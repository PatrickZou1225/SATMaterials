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
5. **导出长图**~~会真正渲染每页位图~~ → 第十二轮起**只导出笔迹**（见下），不再烘焙讲义位图。
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

**修订（站长第十问）**：工具条下方那行提示（`HintViewer`："To move canvas, hold mouse wheel…"）
也并入同一个开关 —— 收起时一并消失。

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

**四修订**：可见的把手改为**隐形热区** —— PDF 右边缘 12px 宽、70% 高的透明热区（cursor 为
`ew-resize`），**hover 时才浮现 ⇔ 指示胶囊**（纯 CSS `group-hover`，拖动中 `group-active` 保持显示），
移开即消失。位置仍自动吸附边界（`pageEdgeX`，并 clamp 在视口内）。

### 2026-10-14（第十轮）字体面板：只在主动点「文字工具」时出现（对齐 ClassIn）

参考：站长截图（ClassIn 板书的文本工具）——「主动点击字体，才弹出候选颜色大小的选项；其余情况
双击背景板直接输入内容，用上次的字体颜色大小；没点字体就不要弹」。

Excalidraw 原生规则（`showSelectedShapeActions`）：**文字工具激活、任意文字被选中、或正在编辑文字**，
这三个条件任一成立，左上角属性岛（文字颜色 / 字号 / 字体 / 对齐）都会出现 —— 所以双击打字、点选
文字时它都会挡在板上。（双击直接打字、沿用上次设置，本来就是原生行为；`startTextEditing` 不动工具。）

改法（`BoardSurface.tsx` 两个状态 + `index.css` 三条规则）：

| 场景 | 行为 |
|------|------|
| 主动点文字工具 T（顶栏或投屏工具条） | ✅ 弹出颜色/大小面板 —— 投屏 zen 下、手动收起属性面板时也弹 |
| 双击背景板直接打字 | ❌ 不弹（新文字用上次的字体/颜色/大小） |
| 选中已有文字 / 双击编辑文字 | ❌ 不弹 |
| 其他工具（矩形/画笔等）的属性和手动「收起属性面板」 | 维持原样 |

- `board-quiet-text`：正在编辑文字或选中了文字（且文字工具没开）时挂上 → 藏属性岛。
- `board-text-tool`：文字工具激活时挂上 → 属性岛可穿过 `.board-hide-props` / `.board-zen` 的隐藏规则。
- zen 的左上角整列仍是全隐藏，唯独 `.selected-shape-actions` 用 `:not()` 留一个例外，再由
  `board-text-tool` 决定它出不出现。
- 想改一段已有文字的颜色/大小：先点 T（面板出现）再点那段文字编辑；或手动展开属性面板。

### 2026-10-14（第十一轮）「保存」改为弹出选项：存网站 / 复制图片到剪贴板

站长担心网站存储空间（Supabase 免费档 1GB），要一个「存图不存货」的出口。顶栏「保存」按钮现在
弹一个两选菜单：

1. **保存到网站** —— 原行为（历史板书 / 发布给学生用）。
2. **复制图片到剪贴板** —— 复用 `exportBoardLongImage` 生成长图 → `navigator.clipboard.write`
   直接进剪贴板，**不向网站写任何数据**；Safari 等不允许异步写剪贴板的浏览器自动退化为下载 PNG。
   （与「导出长图」同一套渲染，只是落点不同。）

### 2026-10-14（第十二轮）导出/复制只留笔迹 + 画布背景可选（含黑）

三个诉求：① 导出的图片只保留老师的笔迹，不要把 PDF 讲义整个烘焙进去；② 长图里 PDF 一片「马赛克」；
③ 画布背景要能选黑色。

1. **导出去 PDF 化**（`boardExport.ts`）：`exportBoardLongImage` 现在只收集「非 PDF 页元素」，
   不再渲染讲义位图、不再换占位图 —— **马赛克 = 旧逻辑把每页 PDF 光栅烘进长图、再为塞进
   `MAX_EXPORT_PX` 上限整体降采样的结果**，去掉 PDF 即消失；没有笔迹的板整页跳过（不再有空白页）。
   空图时抛「还没有任何板书内容可以导出。」，两个调用点都透传错误文案。
2. **画布背景调色**：顶栏新增调色板按钮（全屏旁边）→ 黑色（黑板）/ 白色 / 深蓝 / 米黄 / 浅绿。
   - 空白板：颜色存在 `page.background.color`（笔迹颜色照旧自动反色）；
   - 讲义板（PDF）：颜色存在 `page.scene.appState.viewBackgroundColor`，`initialData` 优先读它
     （缺省白）—— 于是 **PDF 页可以悬在黑底上**（ClassIn 那种黑底白纸），导出的笔迹图同样带这个底色。
   - `BoardSurface` 新增 `canvasColor` 派生值 + effect 实时 `updateScene`：`initialData` 是
     memo（依赖 `page.id`），单靠它不会重绘新颜色。
3. **关掉 Excalidraw 自带的「Canvas background」行**（☰ 菜单里那排只有浅色的色块）：
   `UIOptions.canvasActions.changeViewBackgroundColor: false` —— 那是它写死的色板、没有黑色，
   留着会和我们的 🎨 调色板打架。背景色统一从 🎨 设置。
4. **关掉 Excalidraw 自带的「Export image…」**（同一个 ☰ 菜单里）：`UIOptions.canvasActions.saveAsImage: false`。
   它导出整个场景（含讲义光栅）、预览带**透明棋盘格**——站长一直说的「马赛克背景」就是它；
   而且没有关闭按钮（原生设计：点外部 / Esc 关闭）。导出统一走「导出长图 / 保存→复制图片」。

### 2026-10-14（第十三轮）导航可收起 / PDF 黑板默认黑 / 文字工具默认值

1. **全站导航可收起（不进全屏）**：讲解区顶栏新增「顶部导航」开关（PanelTop 图标，历史板书右边）。
   `Layout` 的 header 加 `.site-nav` 类；`BoardEditor` 用 `body.board-hide-nav` 隐藏它，同时自己的
   高度在 `h-[calc(100vh-4rem)]` / `h-screen` 间切换；离开讲解区自动恢复。状态存 localStorage
   `sat_board_hide_nav`。
2. **加载 PDF 的板默认黑底**：`BoardSurface.canvasColor` 与 `boardExport.canvasColorOf` 的缺省从
   `#ffffff` 改为 `#000000`（讲义页 = 白纸悬在黑板前）。**只影响还没存过颜色的板**；已有板带着
   自己存过的颜色，用 🎨 改。
3. **文字工具默认值**：字号 Large（28；Excalidraw 的 S16 / M20 / L28 / XL36）、字体 Normal（Nunito）、
   **文字颜色白色** —— 在文字工具激活期间把 `currentItemStrokeColor` 设为白，离开文字工具恢复
   自适应笔色（所以在 PDF 白页上的圈画仍是深色，不受影响）。
   ⚠️ Excalidraw **没有 Times New Roman / 任何衬线字体**（选择器里只有 手写 Excalifont / Normal
   Nunito / Code Comic Shanns；注册表里另有 Lilita One、Liberation Sans 也不在选择器里）。
   要 Times 得注册自定义字库（Liberation Serif 是 Times 的同度量免费替代）—— 暂缓，站长要再研究。

### 2026-10-14（第十四轮）文字自动反色守卫 + PDF 目录（书签）跳转

1. **文字自动反色**：白字默认给黑板用；一旦文字（中心点）落在白色讲义页矩形内就自动换深色
   `#1e1e1e`，拖回黑板又换回白 —— **只翻转两个默认墨色**，老师主动挑的颜色（红/蓝…）一律不动。
   实现在 `BoardSurface.handleChange`：算好整份元素后 `queueMicrotask` → `updateScene`（翻转后
   条件恒假，不会自激循环）。绑在容器里的文字（`containerId`）跳过。
2. **PDF 目录侧栏**：`pdf.getOutline()` 读 PDF 内嵌书签（参考件「SAT 人文阅读-邹老师-**有书签**.pdf」
   左边栏那种跳转），逐条 `getDestination` + `getPageIndex` 解析页码（上限 300 条，解析失败的跳过，
   没书签的 PDF 就什么都不显示）。底部页码条新增 **「目录」** 按钮 → 左侧浮层列出目录
   （层级缩进、当前页蓝色高亮）→ 点击 `goToPage` 跳页、保留当前缩放。投屏下同样可用。

   **修订（站长报「点目录后 PDF 不显示、无法跳转」bug）**：黑板的 wheel 拦截器（capture 挂在 host）
   只放行 TEXTAREA / INPUT，把**目录面板里列表的滚动**也吃掉了 —— 鼠标在面板上滚 = 滚的是黑板
   （PDF 滑出视野，看起来"消失"），列表本身永远滚不动、后面的标签点不到。修法：面板容器加
   `data-board-scroll`，`e.target.closest('[data-board-scroll]')` 命中时直接放行给浏览器。

   **修订 2（真正的根因 —— 用 Playwright 本地复现后定位）**：`goToPage` 的滚动坐标**符号写反**。
   滚轮 / 缩放 / 收起讲义用的都是 `scroll = screenCentre/zoom − scene` 约定，唯独 goToPage 写成
   `scene − screenCentre` —— 点目录 / 翻页时视口被送到**文档另一侧的空白区**（正是「PDF 消失 +
   Scroll back to content + 页码仍显示第 1 页」那一幕）；底部 ‹ › 翻页键从第五轮起同病。修法：与
   `fitPage` 统一成减号约定。

   **本地复现法（值得保留）**：① `npm run dev`；② 根目录建 `boardtest.html` + `src/boardtest-main.tsx`
   （复刻 onPickCloudFile 流程：`loadPdf('/boardtest.pdf')` → `layoutPdfPages` → 直接挂 BoardSurface，
   无需登录），测试 PDF 拷进 `public/boardtest.pdf`；③ Playwright 驱动**本机 Chrome**
   （`chromium.launch({ channel: 'chrome' })`，免下载内核；装 devDep 用完记得
   `git checkout package.json package-lock.json` 还原）；点目录 / 滚轮后读页面条「第 X / N 页」验证。
   验证结果：修复前点「CID-LEVEL 2」毫无动静，修复后正确跳到「第 8 / 29 页」。

### 2026-10-14（第十五轮）顶栏两栏同收 + 讲解区搜题贴题

1. **「顶部导航」开关升级**：原来只收全站导航，现在**两栏一起收**（全站导航 + 讲解区顶栏）；
   收起后左上角浮一个「顶部栏」小胶囊用于展开；投屏（zen）下胶囊隐藏（zen 有自己的退出按钮）。
2. **搜题**：顶栏「我的云盘」旁新增 **「搜题」** 按钮 → 输入关键词（≥2 字）→ 在全部真题的
   passage / question / options 里子串匹配（上限 30 条；题库**懒加载** —— 动态 import
   `buildQuestionBank()`，首次搜索才拉数据）→ 点结果即把题目格式化（`【套题·模块N·第X题】` +
   原文 + 题干 + 选项；硬换行 ≤72 列，CJK 记双宽）**贴到当前黑板视野中央**，成为普通文字元素
   （已选中可直接拖、Ctrl+Z 一步撤销）。默认白字，落在讲义页上会被自动反色守卫换成深色；
   含图表的题加一行提示（图表不随文字过来）。

### 2026-10-14（第十六轮）顶栏重排 / 删「工具栏」浮标 / 左侧留白隐藏

1. **顶栏按用途重排**（原来像堆出来的）：左边 = 标题 · 页码 · 未保存/消息；右边 =
   我的云盘 · 搜题 ｜ 投屏 ｜ 导出长图 · 保存 · 发布给学生 ｜ 历史板书(图标) · 页面列表 ·
   顶部导航 · 属性面板 · 工具栏 · 全屏 · 🎨 —— 组间加细分隔线。「历史板书」从文字压成图标
   （History），「页面列表」新增图标按钮。
2. **删掉黑板上的「工具栏」浮标**：收起工具条后不再浮胶囊，恢复统一走顶栏画笔按钮
   （`BoardSurface` 的 `onToggleTools` prop 一并删掉）。投屏下要恢复工具条 → 退出投屏再开。
3. **左侧留白完全隐藏**：页面栏收起时不再保留 `w-8` 竖条，整条消失；展开入口移到顶栏
   「页面列表」图标（高亮 = 展开中）。
4. **修一个老 bug**（站长报「点搜题没反应」）：顶栏没有 stacking context，下面的 `<main>`
   在文档里更靠后 → 三个下拉（保存 / 🎨 / 搜题）其实弹了但被黑板盖住。顶栏加 `relative z-30`。

### 2026-10-15（第十七轮）按住讲义拖动 = 移动整份 PDF

1. **拖 PDF 页面平移视图**（站长要的「移动整个 PDF」）：页面是锁定元素，Excalidraw 自己的拖动对
   它们无效。现在在 host 上监听**捕获阶段**的 pointerdown（Excalidraw 在冒泡阶段会吞掉指针事件，
   祖先的冒泡监听收不到）；仅当「选择工具 + 按下点落在某张讲义页矩形内 + 不在按钮 / 面板上」时
   进入拖动 → `scroll = 起点scroll + 位移/zoom`（与滚轮同一约定 —— **纸跟手走**，初版把符号写反成
   反向平移，已修）。松手时若真的移动过，清掉 Excalidraw 误画的选框。画笔 / 图形 / 文字工具不受
   影响；按下没位移不算拖动（双击在新位置打字照旧）。
2. **站长报「点目录后左右缩放把手消失」的结论**：真身是**修复前的跳页把视口甩到空白区**，把手
   `pageEdgeX` 跟着被 clamp 到屏幕边上。符号修复后把手贴 PDF 右缘、位置正常；若正缩放使 PDF 宽过
   窗口，把手贴屏幕右边，仍可直接拖。请强刷复测。
3. **Playwright 回归**（本机 Chrome）：拖动 ✓（向上拖两段 → 第 2 页）、双击打字 ✓、把手缩放 ✓
   （100%→150%→225%）、滚轮翻页 ✓、目录跳转 ✓（点 Level 3 → 第 18 / 29 页）。

### 2026-10-15（第十八轮）新讲义默认黑底 + 墨水按落点选色（重做）+ PDF 窗口按钮组

1. **新讲义默认黑底**：`onPickCloudFile` 里新讲义板的空白色 `#ffffff` → `#000000`（第 15 轮只改了
   pdf 型旧式板的兜底 —— 改错了地方，新讲义板其实是 blank 型）。白纸悬在黑板上，纸的边界一目了然
   （找缩放把手不再费劲）。**只影响新加载的**；既有板用 🎨 调。
2. **墨水自动选色重构（重要修复）**：原「反色守卫」在元素生成 / 编辑**中途**用 `updateScene` 替换
   整个元素数组 —— 会打断正在绘制的笔画和正在写的文字（测试台里表现为"画不出线、字打不上"）。
   重做为两层：
   - **落笔瞬间定色**（capture 阶段 pointerdown）：画笔 / 文字 / 图形 / 箭头 / 线这些工具按下时，
     落点在讲义页内 → `currentItemStrokeColor` 切深色；落在黑板区 → 切白色。**只切换两个默认墨色**，
     手选的红 / 蓝不动。笔画从第一个像素就是正确颜色（白纸上看得见），打字时也是。
   - **元素翻转守卫降级为兜底**：只在「指针已松开且不在编辑文字」时翻转（`pointerHeldRef` /
     `editingTextElement` 门控），负责"把白字 / 白笔画拖到页面上"这类搬运场景，绝不打断进行中的操作。
   - 该层只在含讲义页的板上启用；纯黑板 / 白板仍按 `defaultInkColor` 自适应。
3. **PDF 窗口按钮组（右上角）**：用 `pageEdgeX` 吸附在 PDF 右上角：**最大化**（当前页铺满窗口宽度）/
   **最小化**（收起讲义回黑板）/ **缩小一档** / **关闭**（关掉这份讲义，先 confirm；只剩一块板时
   换回全新黑板）。收起状态下只显示「展开」按钮（原行为）。`onClosePage` prop 由编辑器提供；
   只读端不显示关闭按钮。
4. **Playwright 全套回归**：页面笔画深色 ✓ / 黑边笔画白 ✓ / 页面文字深 ✓ / 黑边文字白 ✓ /
   拖动 ✓ / 双击打字 ✓ / 把手 100→150→225% ✓ / 滚轮 ✓ / 目录跳转 18/29 ✓。

### 2026-10-15（第十九轮）ClassIn 式右侧工具条（对齐站长截图）

站长要 ClassIn 的「笔刷位置和排列」：工具竖排在**右侧**、笔刷设置面板跟在旁边、和 PDF 窗口按钮
不再打架。做法：

1. **原生顶部工具条退役**（全局 CSS `.excalidraw .App-toolbar-container{display:none}`）：顶部不再
   有那条和窗口按钮重叠的工具行；Library 触发钮和 "hold mouse wheel" 提示一并隐藏（拖页面即可
   移动视角）。
2. **右侧工具条**（`BoardSurface` 内置，`board-tool-rail`）：五个按钮 —— **点击**（选择/移动；拖
   页面=平移文档）/ **框选**（拖哪都能拉选择框、不平移，专门圈选自己写的内容）/ **画笔** / **文字**
   / **橡皮**。激活态蓝色；投屏下贴右栏左侧（right-[64px]）。
   - 框选 = selection 工具 + `marqueeMode` 标志；`handleChange` 跟踪全量 `activeToolType` 做高亮，
     离开 selection 自动解除框选。平移 onDown 加 `marqueeModeRef` 门控。
   - 「收起工具条」开关改为收起这条 rail（`.board-hide-tools .board-tool-rail`）。
3. **笔刷 / 文字设置面板挪到右侧**（ClassIn 位置）：`.selected-shape-actions{position:fixed; right:76px;
   top:88px}` + 内层 `.Island{right:0;left:auto}`（外壳宽度塌缩为 0，所以要锚内层）→ 面板出现在
   rail 左侧（实测 x=1164 w=200，rail 在 1380+）。原来的左侧旧位置退役。
4. **Playwright 验证**：rail 五键 ✓、原生工具栏/ Library 全隐 ✓、面板位置 ✓、页面笔画深色 ✓、
   文字深色 ✓、框选拖拽选中页面上的文字且画面不平移 ✓、点击模式拖页面 = 平移（两段 700px → 第 2 页）✓。

---

## 已知问题 / 待在真机验证

- **未验证（第二轮）**：见上节验证清单。历史遗留：加载 PDF 后是不是「一块板 + 一列竖排页面」、拖角改大小、导出长图、学生端只读回看。
- 一张截图里出现过「两块板（空白 + 讲义）+ 两个页面并排」，怀疑是手动拖动所致；若**刚加载就并排**，是 bug，要查。
- 云盘 + 板书 PDF 共用 Supabase 免费档 1GB；R2 已写好但未部署（`VITE_R2_WORKER_URL` 未配 → 降级到 Supabase）。
- ~~Excalidraw 的字体/文字属性面板收不起来~~ → 已解决（第十轮）：文字面板改为「主动点文字工具才出现」；
  形状类属性仍靠手动「收起属性面板」开关。

## 下一步 TODO（可选）

- 真机走一遍上面的验证清单。
- 若「并排」是真 bug：查 `buildHandoutElements` 是否被 `restore()` 改动位置，或 `initialData` 是否又做了一次 `scrollToContent`。
- 部署 R2（等站长信用卡），把云盘和板书 PDF 挪出 Supabase 免费额度。
- 讲义的「按页跳转」（一列太长时，底部页码条跳到第 N 页）。
