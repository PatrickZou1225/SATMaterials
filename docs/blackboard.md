# 讲解黑板（Blackboard）— 开发记录 & 交接

> 讲课时用的白板区，对标 ClassIn：点进去直接是黑板，从「我的云盘」加载 PDF 讲义，
> 在上面手写标注，讲完一键导出长图 / 发布给学生回看。
>
> 最近更新：2026-10-14。技术栈：React 19 + Excalidraw（内核）+ Supabase + Vercel。

---

## 线上状态

- 已上线 commit `f1867d5`（"Load a handout PDF as one board with all pages stacked"）。
- 两个迁移已在 Supabase SQL Editor 跑过：
  - `20261014000002_library_files.sql`（云盘文件表）
  - `20261014000003_board_files.sql`（boards 表加 `files_path` / `files_bytes`）
- **本轮改动尚未在真机浏览器实测**（无法用自动化登录 Supabase），下次继续时先跑一遍验证清单。

---

## 数据模型

- `boards` 表：一块**已保存的板书**。
  - `title` / `teacher_id` / `status`（draft / published / archived）
  - `pdf_path` / `pdf_name`：板书来源 PDF（存 Storage 路径，前端用 `getPublicUrl` 加载）
  - `pages`：JSON 数组 `BoardPage[]`（见下）。前端用 `parsePages()` 解析。
  - `files_path` / `files_bytes`：板书里粘贴的图片打包成一个 JSON blob 存 Storage（`boardfiles/{owner}/{boardId}.json`），
    避免大 data URL 撑爆数据库行（见 `src/lib/boardFiles.ts`）。
- `library_files` 表：站长私有的**云盘**文件元数据（`owner_id` / `name` / `size_bytes` / `storage_path`）。
  - 文件实体在 Cloudflare R2（配了 `VITE_R2_WORKER_URL` 时）或 Supabase Storage（`boards` 桶，路径 `library/{owner}/{uuid}.pdf`）。
  - `storage_path` 以 `r2:` 开头表示在 R2。见 `src/lib/library.ts`。
- `BoardPage = { id, name, background, scene }`
  - `background`：`{ type:'pdf', pdfPage }`（旧式：一页 PDF 一张板背景）或 `{ type:'blank', color, grid }`
  - `scene`：`{ elements, files, appState }` —— Excalidraw 的元素 / 图片文件 / 精简后的 appState（背景色、viewport）
- 一个 `Board`（已保存）里可以有**多个 `BoardPage`**（左侧栏可切换的多块板）。

---

## 路由与入口

| 路径 | 组件 | 说明 |
|------|------|------|
| `/board` | `Board.tsx` | 老师 → 直接进 `BoardEditor`（会话模式，无 id）；学生 → 已发布板书列表 |
| `/board/archive` | `BoardArchive` | 老师历史板书（TeacherGate） |
| `/board/:boardId/edit` | `BoardEditor` | 编辑已保存板书（TeacherGate） |
| `/board/:boardId` | `BoardView` | 只读回看（学生 / 老师） |

---

## 关键文件

| 文件 | 作用 |
|------|------|
| `src/pages/BoardEditor.tsx` | 编辑器主体：工具栏 / 投屏(zen) / 云盘 / 导出 / 保存 / 发布 |
| `src/pages/BoardView.tsx` | 只读回看 |
| `src/components/BoardSurface.tsx` | 单块板的 Excalidraw 容器 + **懒渲染** + 滚轮缩放 + 属性面板折叠把手 |
| `src/components/CloudDrivePicker.tsx` | 「我的云盘」模态框（列表 + 上传 + 选中加载） |
| `src/lib/boardPages.ts` | `BoardPage` 类型、页面增删、`renderPdfPageToDataUrl`、handout 排版/占位/`stripPdfBitmaps` |
| `src/lib/boardPdf.ts` | 把一份 PDF 变成「竖排图片元素」的辅助（**运行时依赖 Excalidraw，只能动态 import**） |
| `src/lib/boardExport.ts` | 导出长图（多块板拼成一张 PNG） |
| `src/lib/boardFiles.ts` | 板书粘贴图片的 Storage 读写 |
| `src/lib/library.ts` | 云盘（R2 或 Supabase Storage）读写 |
| `src/lib/r2.ts` | Cloudflare R2 worker 客户端（未配 `VITE_R2_WORKER_URL` 时自动降级到 Supabase） |
| `src/index.css` | `.board-zen` / `.board-hide-props` 两块 CSS 挂钩 |

---

## 讲义（handout）的渲染机制（本轮核心）

**一份 PDF = 一块黑板，所有页竖着排成一列**（不是一页一块板）。

- `layoutPdfPages(pdf)` 逐页量尺寸，按 `BACKGROUND_WIDTH = 1000` 等比换算高度，上到下堆叠（间距 `PDF_PAGE_GAP = 40`）。
- `buildHandoutElements(layout)`：每页一个**未锁定**图片元素（可拖四角放大缩小），贴 `customData.pdfPage = 页码`。
  ⚠️ 页码**按元素 id 查**（不是按数组下标）——`convertToExcalidrawElements` 可能重排返回顺序。
- `buildHandoutFiles(layout)`：每页一个**灰色占位图**（`pdf-ph-{n}`，写着「第 N 页」）。
- **懒渲染**（`BoardSurface.tsx` 的 `renderVisible`）：
  - 只渲染当前视野内的页；每轮最多 8 页（Excalidraw **永不释放**已解码的位图，全渲染会爆内存）。
  - 渲染出真图后 `addFiles` 成 `pdf-bm-{n}`，再把元素的 `fileId` 换成它（`captureUpdate: NEVER`）。
  - 触发时机：挂载、`onChange`、滚轮缩放。
- **位图永不落库**：保存前 `stripPdfBitmaps()` 把每个元素 `fileId` 还原成 `pdf-ph-{n}` 并丢掉 `pdf-bm-*` 文件。
  所以数据库/Storage 里只有占位图，PDF 多长都不怕。
- **加载时的视图**：`needsFit = page.scene.appState.scrollX === undefined`。
  有存过的视图就恢复；没有（刚加载）就居中放大到第一页。**不要用 `scrollToContent`**——它会缩到「一列全览」，等于缩成一堆小卡片。

---

## 2026-10-14 本轮改动

1. **打开 PDF = 一块黑板**（原来是一页一块板）。`BoardEditor.onPickCloudFile` 重写：
   只有一张**没画过**的空白板时才替换掉，否则把讲义作为**新的一块板**追加。
   （判定「没画过」看**场景元素数**，不能看 `sceneRef` 是否为空——Excalidraw 一挂载就会回调 `onChange`，`sceneRef` 必然非空。）
2. **糊 → 清晰**：`renderPdfPageToDataUrl` 位图渲染提到 `RENDER_SCALE = 3`、长边封顶 `MAX_BITMAP_SIDE = 4000`；
   但元素在场景里仍是 `BACKGROUND_WIDTH` 宽（只改位图分辨率，不改板面尺寸）。
3. **滚轮 = 缩放**（原来滚轮平移，「背景也在拖动、眼晕」）：捕获阶段拦截 wheel，按指针为中心缩放，
   下限 = 「整页刚好铺满」的 zoom（`fitZoomRef`）。
4. **投屏（zen）模式**：右侧浮动工具条 + 底部翻页条 + 左下状态、右上退出；CSS 隐藏 Excalidraw 自带菜单。
5. **导出长图**会真正渲染每页位图，并按浏览器画布上限（`MAX_EXPORT_PX = 16000`）自动降倍率，避免几十页拼图失败。
6. **保存前 `stripPdfBitmaps`**：不把位图写进数据库。
7. **结构变更判定 `isStructural`**：自动换位图（只改 `fileId`）不算「改动」，拖动/缩放页面才算。

---

## 2026-10-14（第二轮）视口交互重做 — 对「缩放不满意」的回应

原来的实现把滚轮整个吃掉做缩放，四个问题：讲义没法用滚轮翻、缩放手感跳、没有控制按钮、缩放后找不回整页。
现在改成 **PDF 阅读器式**交互（全部在 `BoardSurface.tsx`，师生两端一致）：

1. **滚轮/双指 = 纵向滚动讲义**（锁轴：忽略 deltaX，不会横向漂 —— 老版「眼晕」的根治）。
   `Shift+滚轮` = 横向滚动。
2. **⌘/Ctrl+滚轮 与 双指捏合 = 以指针为中心缩放**。缩放系数归一化：
   `clamp(exp(-deltaY * 0.002), 0.5, 2)` —— 鼠标滚轮每格约 ×0.82 / ×1.22，捏合小增量平滑。
3. **缩放下限 = 当前页整页铺满**（fit×0.95）、上限 4。
   ⚠️ 顺带修正一个隐性 bug：旧逻辑的下限只在「老式板（PDF 作背景）」上生效；讲义板背景是 blank、
   `hasPageRef` 恒为 false —— 下限实际是 0.1。现在从**页面元素**取最近页算 fit，讲义板同样受约束。
4. **右下角浮动控制条**：`− / 百分比 / ＋ / 回到整页`。
   - ± 以视口中心步进 ×1.25；
   - 「回到整页」= 居中并铺满**离视口中心最近的那页**（老式板 → 背景页；空白板 → 已画内容的外接框；全空 → 原点）。
5. 缩放/滚动后都会触发 `renderVisible`（懒渲染不受影响）。

### 这轮要验证的（真机）
- 滚轮上下平滑翻讲义，画面不横漂。
- 捏合 / Ctrl+滚轮缩放跟手、不跳；缩到最小正好一页铺满。
- 右下角三个按钮：± 步进、「回到整页」是否回到当前页。
- 学生只读端（BoardView）同样有滚动 + 控制条。

---

## 已知问题 / 待在真机验证

- **未验证（第二轮）**：见上节验证清单。历史遗留：加载 PDF 后是不是「一块板 + 一列竖排页面」、拖角改大小、导出长图、学生端只读回看。
- 一张截图里出现过「两块板（空白 + 讲义）+ 两个页面并排」，怀疑是手动拖动所致；若**刚加载就并排**，是 bug，要查。
- 云盘 + 板书 PDF 共用 Supabase 免费档 1GB；R2 已写好但未部署（`VITE_R2_WORKER_URL` 未配 → 降级到 Supabase）。
- Excalidraw 的字体/文字属性面板收不起来（`UIOptions` 无对应开关），留待后续：CSS 隐藏 / 折叠 / 接受现状。

## 下一步 TODO（可选）

- 真机走一遍上面的验证清单。
- 若「并排」是真 bug：查 `buildHandoutElements` 是否被 `restore()` 改动位置，或 `initialData` 是否又做了一次 `scrollToContent`。
- 部署 R2（等站长信用卡），把云盘和板书 PDF 挪出 Supabase 免费额度。
- 讲义的「按页跳转」（一列太长时，底部页码条跳到第 N 页）。
