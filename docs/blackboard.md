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

## 2026-10-14（第三轮）讲义 = 一份固定文档 + 属性面板开关

1. **锁定页面**：`BoardSurface` 装配场景时把每个 PDF 页元素设为 `locked: true`（新板、老板都生效）。
   - 页面不能再被拖动成"散开的独立图片"（此前的「两块板/两页并排」根源）；点击 PDF 也不会再"选中整页"弹属性面板 —— 画笔、文字直接落在墨迹层。
   - 旧板里已被拖散的页位置会保留（位置存在存档里）；重新加载讲义即可得到对齐的一列。
2. **缩放范围放开**：下限从「整页铺满」放开到 0.1 —— 可以缩小到看整个文档；「回到整页」是回来的路。
3. **滚轮双轴**：普通滚动支持 deltaX + deltaY（页内可左右滑）；鼠标滚轮只有 deltaY，纵向依旧笔直。
4. **属性面板开关**：`.board-hide-props` 现在同时隐藏 `.selected-shape-actions` 和 `.properties-content`（字体选择弹层）；**投屏（zen）右侧工具栏新增同一个开关**。

### 2026-10-14（第四轮）稳住画面 — 对「移动就晕、缩放就晕」的回应

1. **缩放改为视口中心锚定**（原来锚在鼠标指针上）：指针锚定会让整页在放大时朝指针方向滑动，
   在大页面上就是"画面在漂"，非常晕。现在缩放 = 原地放大缩小，零平移。
2. **滚动锁死竖直轴**：双指/滚轮只做上下滚动，手指怎么晃画面都不左右飘（横移放到 Shift+滚轮）。
3. **缩放步进变温柔**：每次滚轮格约 0.82×/1.22×（原来上限 2× 一格，一跳一跳）。
4. **缩放过程中不再后台重绘页面图**（settle 防抖）：原来每滚一下都在生成页面位图、主线程卡顿，看起来像抖动。
   现在手势停下 250ms 后才开始补图。
5. **onChange 用 useCallback 稳定**：缩放时不再整体重渲染 Excalidraw 树。

### 2026-10-14（第五轮）对齐 ClassIn 课件窗口的两个可搬功能

参考：站长录屏（ClassIn 课件模式，文件在 `~/Desktop/Upload/20261014_155148.mp4`）——PDF 是独立窗口
（自己的滚动条/书签/底部 29/53 翻页），有一个「缩放比例为页面适合窗口显示大小」按钮（窗口一变、
页面自动贴合边界），并可直接在 PDF 上打字。

搬过来的：
1. **「适配」开关**（右下控制条）：开启后窗口尺寸变化时自动重新缩放到整页 —— 对应参考 app 的 fit-to-window；
   开/关状态存 localStorage（`sat_board_fit_window`）。
2. **底部页码条**：`‹ 第 X / N 页 ›`（zen 下上移 16px 避开板书翻页条）—— 一键跳到上/下一页，
   保持当前缩放（页顶对齐、水平居中），比滚动省力得多；页码随滚动实时更新。

架构备注：ClassIn 那种「PDF 独立窗口 + 黑板分层、点哪滚哪」需要把单画布改成双画布复合应用
（换内核级别），未做；如果站长确认要，先出设计方案再动工。

### 2026-10-14（第六轮）画画工具栏可收起

1. **Excalidraw 工具条（`.App-toolbar-container`）可收起**：编辑器顶栏新增画笔按钮，
   状态记住（localStorage `sat_board_hide_tools`）；收起后原位留一个「工具栏」小胶囊，
   点一下展开 —— 与属性面板同一模式。
2. 收起时快捷键（P/T/数字等）仍然可用，只是视觉上拿走工具条；投影/投屏下同样生效。

### 2026-10-14（第七轮）「收起讲义 / 显示讲义」

参考录屏（`~/Desktop/Upload/20261014_183839.mp4`）：ClassIn 的窗口列表（第 49-61 帧）有
「全部收起 / 全部展开」，窗口右上角有最小化/展开按钮 —— 即讲义可收起腾出黑板、再展开回来。

单画布映射：右下控制条新增 **「收起讲义 / 显示讲义」**：

- 收起 = 视口跳到页面列**右侧的空白区**（黑板区）并记住当前 scroll/zoom；老师在这里讲题书写，
  这些内容照常存在场景里（就像 ClassIn 的黑板层）。
- 显示 = 精确恢复到收起前的位置和缩放。
- 「回到整页」「上/下一页」会自动清除收起状态（避免状态和视口不一致）。
- 按钮仅在讲义板（有页面元素）出现。

### 2026-10-14（第八轮）右上角窗口按钮

站长要 ClassIn 那种「右上角最小化/展开」。补充：**多份讲义本来就是支持的** —— 每次从云盘加载一份
PDF = 一块独立的板（加载时自动切过去），投屏下底部 `‹ 2/2 ›`、编辑器左侧页面栏切换；
同一时间画布只显示一块板 = 只显示一个 PDF。

新增：**板书右上角窗口按钮**（讲义板才显示）—— 展开状态显示 `—`（最小化讲义 = 收起 PDF 腾出黑板），
收起状态显示 `⤢`（展开讲义 = 回到收起前的位置）；与右下角「收起讲义/显示讲义」是同一开关。
投屏下按钮下移 14px 避开「退出投屏」。未做 ✕ 关闭（防误删；删板走左侧页面栏）。

### 2026-10-14（第九轮）拖边缩放把手

站长要参考视频里 ClassIn 的窗口边缘把手（左右拖动 = 缩放 PDF）。实现：**右侧边缘垂直居中的
小把手（MoveHorizontal 图标）**，按住左右拖 → 缩放讲义（300px ≈ 1.5×）；拖动期间懒渲染走
settle 防抖，松手后补图。仅讲义板显示；投屏下右移 16px 避开右侧工具条。

**修订（站长反馈）**：要"橡皮筋"手感 —— **往哪边拉就往哪边放大**（反向视口边缘为锚，
另一边钉住），不是两边对称的"同比放大"；拉回起点恢复本次拖动初始的缩放。

**再修订**：把手**自动吸附在 PDF 右边缘**（`pageEdgeX` = 页面右缘的屏幕坐标，随滚动/缩放在
onChange 里实时更新并 clamp 到视口内）——边界滑出屏幕时停在屏幕边上。

**三修订（站长最终反馈）**：回归常规直觉 —— **往右拉 = 放大，往左拉 = 缩小**（普通窗口边缘逻辑）；
锚点 = 拖动开始时页面左边缘的屏幕位置（左边缘钉住，右边缘跟手）。橡皮筋方案退役。

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
