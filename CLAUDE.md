# SAT Prep 备考网站 — 项目上下文

> 这个文件是给 Claude（AI 助手）看的项目备忘录。
> 不管在哪台电脑、用桌面客户端还是 VS Code 插件，只要说"读一下 CLAUDE.md"就能恢复上下文。

---

## 文件转 Markdown（提速处理）

> 已安装 [Microsoft MarkItDown](https://github.com/microsoft/markitdown)（v0.1.6，pipx），可将 DOCX/PPTX/XLSX/HTML/EPUB/文字型PDF 等转为 Markdown。
>
> 还写了一个整合脚本 `~/bin/to-markdown`，自动判断文件类型：
> - **DOCX/PPTX/XLSX/HTML/EPUB** → 直接调用 markitdown 转换
> - **文字型 PDF** → markitdown (pdfminer)
> - **扫描型 PDF / 图片** → macOS Vision OCR（`~/bin/img2txt`）
> - **YouTube URL** → 提取字幕
>
> **用法**：`to-markdown document.docx` → 同目录生成 `document.md`
>
> **重要**：Patrick 投喂新资料时，Claude 应主动提醒他用 `to-markdown` 转换，这样 Claude 可以直接读取 .md 而非等 OCR。

---

## 截图交流（模型能直接读图）

> **2026-09-25 更新**：当前模型（DeepSeek V4 Flash 等）是**多模态**的，可以直接看图。旧说明里"DeepSeek 不支持图片"已过时。
>
> **"看图"怎么处理——先看图片能不能直接拿到：**
>
> | 情况 | 做法 |
> |------|------|
> | 图片已在对话里（Patrick 贴图），或给了图片文件路径 | ✅ 直接用 `Read` 工具读图 |
> | 只有剪贴板里的截图，没有文件路径 | 运行 `~/bin/img2txt` |
> | **图表题**（柱状图/表格/折线图） | ✅ 必须用 `Read` 直接读图——OCR 只能出文字，读不出数据高低 |
>
> **为什么还要保留 img2txt**：`Read` 只能读**文件**，读不了剪贴板。所以纯剪贴板截图（Cmd+Ctrl+Shift+4）仍然用它。如果切换到不支持图片的模型（如老版 deepseek-chat），也回退到它。
>
> **Patrick 截图方式**：优先使用 macOS 自带快捷键 **Cmd+Ctrl+Shift+4**（截图到剪贴板），不要用第三方截图工具。
>
> **如果剪贴板不更新**：
> 1. 确认用的是 Cmd+Ctrl+Shift+4（不是 Cmd+Shift+4）
> 2. `ps aux | grep -iE 'clipboard|clipy|maccy|pastebot'` 检查是否有剪贴板管理工具
> 3. `killall pboard` 重启剪贴板服务
>
> **核心教训（2026-05-29）**：优先使用 macOS 自带功能。不要给第三方 App 改配置、不要编译自定义工具。Apple 原生方案 99% 的情况最可靠。

---

## 指令触发词（Patrick 专用）

> 以下触发词说出即执行，无需每次重新描述格式。

### 题目解析

| 触发词 | 执行内容 |
|--------|----------|
| **"写词汇解析"** | SSAT/SAT 词汇题 → 逐选项分析表格（选项/词汇/关系分析/对错）+ 生词标注 + ⚠️ 陷阱提示 |
| **"写阅读讲解"** | SAT 阅读题 → 4 步法：①原文逐句拆解（生词+→中文）②对比表格 ③选项逐个辨析 ④一句话总结 |

### 内容生产

| 触发词 | 执行内容 |
|--------|----------|
| **"出题"** | 按 Patrick 指定的题型、难度、数量生成题目 |
| **"加题目到网站"** | 在 `ReadingDetail.tsx` 的对应 `topicData` 数组中追加题目对象 |

### 文件处理

| 触发词 | 执行内容 |
|--------|----------|
| **"看图"** | 有图片文件/对话里贴了图 → 直接 `Read` 读图；只有剪贴板截图 → `~/bin/img2txt` |
| **"读 xxx.md"** 或 **"读截图"** | 去 `~/Desktop/截图文件夹/` 找到对应 .md 文件并读取 |

### 讲义处理工作流

> Patrick 是 SSAT/SAT/托福/雅思老师，经常投喂 PDF 讲义和题目截图。

**标准流程：**
1. Patrick 截图 → 丢进 `~/Desktop/截图文件夹/`
2. Patrick 说"读截图" → Claude 去读对应的 .md 文件
3. Claude 按触发词格式输出解析

**Patrick 投喂新资料时，Claude 应主动提醒：**
- 如果是 PDF/DOCX → 先用 `to-markdown` 转换
- 如果是截图 → 丢进截图文件夹自动转换

---

## 解析库（自动积累）

> 每次给 Patrick 讲解完 SAT/SSAT/托福/雅思题目后，**自动**将解析保存到 iCloud 解析库：
> `解析库/` 路径：`/Users/patrickzou/Library/Mobile Documents/com~apple~CloudDocs/AI文件夹/解析库/`

---

## 教学方法论库（SAT 阅读教学核心 IP）

> Patrick 的 SAT 阅读教学法已完整整理到知识库：
> `知识库/教学方法论/` 路径：`/Users/patrickzou/Library/Mobile Documents/com~apple~CloudDocs/AI文件夹/知识库/教学方法论/`
>
> 包含：总框架 + 看文章技巧 + 9大题型的解题方法论 + 通用技巧
> 核心框架：**变量 + 关系 + 条件**（循证题的方法论灵魂）

---

## SAT 真题整理

> 2023年 SAT 阅读难题（逻辑推断 + If True 循证题）已整理到：
> `知识库/SAT真题/2023/` 路径：`/Users/patrickzou/Library/Mobile Documents/com~apple~CloudDocs/AI文件夹/知识库/SAT真题/2023/`
>
> 待 Patrick 提供 2024/2025/2026 年真题截图 → 按年份归类 → 最终做难度分级讲义

---

## 半年规划

> Patrick 的个人 IP 与睡后收入半年规划文档：
> `知识库/半年规划-个人IP与睡后收入.md`
>
> 三条线：网站 + 内容库 + 个人IP。旺季每天15分钟，淡季加码。

---

## 项目概况

- **名称**: SAT Prep — 中文 SAT 备考网站
- **目标用户**: 准备 SAT 考试的中国学生（Patrick）
- **语言**: 界面中文，题目内容中英混合
- **线上地址**: 通过 Vercel 自动部署（push 到 main 分支即触发）
- **GitHub 仓库**: https://github.com/PatrickZou1225/SATMaterials.git

---

## 教学后台开发优先级（Rules — 按此顺序推进）

> Patrick 2026-09-25 定下的后台建设顺序。**每次涉及后台的改动，先确认现在在哪一步，不要跳步，不要一次铺开**；不确定就问。
>
> 1. **建立题库** —— 把 SAT 套题导入网站，能浏览、检索。
> 2. **建立作业功能** —— 作业 / 分配学生 / 提交记录的数据模型与页面。
> 3. **布置作业** —— 老师能创建并发布作业。
> 4. **老师注册 + 学生注册使用** —— 真实账号注册、登录、日常使用。
> 5. **老师监控学生使用** —— 老师查看学生完成情况、成绩、错题。
> 6. **从题库布置** —— 老师可布置题库里的四种粒度：**知识点 / 整套题 / 单个 Module / 专项练习**。
> 7. **逐步补齐其他功能** —— 班级、统计报告、反馈等，一点点加。
>
> **进度不写死在这里**（会过期）：用 `git log origin/main..HEAD` 看未上线改动；细节见 `docs/backend-roadmap.md`、`docs/veritas-prd-full.md`。

---

## 题目排版规则（Rules — 导入套题必查）

> Patrick 2026-09-25 定的。Veritas 抓回来的文本是**拍平**的：列表、出处说明、表格全被压成一串字。
> 渲染层负责还原版式，**不在数据里手工排**。所有 passage 都走 `src/lib/passage.ts` 的 `formatPassageHtml()`——新页面渲染 passage 也必须用它，不要直接输出文本。

1. **Bullet points** —— "a student has taken the following notes: • A • B" 这类要点题，必须渲染成真正的项目符号列表，**不能揉成一段**。（`formatPassageHtml` 已处理）
2. **出处说明与正文分开** —— 文学题的 "The following text is adapted from Mark Twain's 1876 novel *The Adventures of Tom Sawyer*." 是**编者说明**，不是正文。必须与后面的选段**在视觉上分开**（小字、斜体、左边竖线），不能混成一段。（`formatPassageHtml` 已处理：识别 `The following text/passage/poem/excerpt is (adapted) from ...` 开头，拆成独立块）

   ⚠️ **只对「文学文本题」适用——「Quotation 题」不适用，务必区分。**

   | | 文学文本题 | **Quotation 题** |
   |---|---|---|
   | 题干 | 问文本本身（主旨 / 目的 / 功能 / 结构 / 上下文理解） | 问**引用**："Which quotation from *X* most effectively illustrates / supports the claim?" |
   | 做题方式 | 读懂选段 | **从选项里选一句引用，去证明文本最后一句的观点** |
   | 开头的 "Cane is a 1923 novel by Jean Toomer." | （不适用） | **不是编者说明，是题目本身的铺垫**——学生必须读它才能判断引用是否切题 |
   | 排版 | 出处说明拆成小字侧栏 | **保持整段，不要拆** |

   已确认（2026-09-25）：E5-INT-03 M3 q6、H8-INT-02 q13、H8-NA-01 q10、F6-INT-01 q12、I9-NA-01 q12 这 5 道 Quotation 题的排版**无需修改**。

3. **表格** —— 表格必须建成结构化 `table` 对象（`{ title?, headers, rows }`），让页面渲染成真表格；**绝不能留一串拍平的表格文字**。Veritas 有些表用 div 拼、不是 `<table>`，采集时会漏（体检显示"抓到表格 0"不代表没有表题）——转换脚本会对"提到 table 但无 table 对象"的题打警告，看到警告就手工建表。

   ⚠️ **例外**：如果这道题的表格是**原样采集的截图**（不是被拍平成文字的），**保持原图不动**——转录成结构化表格有出错风险，原图是零风险的。（已确认 2026-09-25：E5-INT-02 M3 q14 的 ISS 灰尘真菌生长率表保持截图）
4. **配图** —— 图片要下载到 `public/` 换成站内路径，命名 `<test-id>-m<模块号>-q<题号>.<ext>`，不能只留 Veritas 私有 URL。

**每套新题导入后，除了核对答案，必须逐题扫一遍这三类版式**（列表 / 出处说明 / 表格配图）。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 3 |
| 路由 | React Router DOM 7 |
| 图标 | Lucide React |
| 部署 | Vercel（自动，连接 GitHub main 分支） |

---

## 项目结构

```
sat-prep/
├── src/
│   ├── App.tsx            # 路由配置
│   ├── main.tsx           # 入口
│   ├── components/
│   │   └── Layout.tsx     # 全局导航栏 + 页脚
│   ├── pages/
│   │   ├── Home.tsx       # 首页
│   │   ├── Subjects.tsx   # 学习科目（数学 / 阅读）
│   │   ├── Knowledge.tsx  # 专项知识点（文法/阅读/数学三个 tab）
│   │   ├── ReadingDetail.tsx  # 阅读专项做题页（一页一题 SAT 机考模式）
│   │   ├── Practice.tsx   # 综合练习（按科目/难度筛选）
│   │   └── FAQ.tsx        # 常见问题
│   └── data/
│       └── questions.ts   # 题库数据（数学 + 阅读）
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── CLAUDE.md              # ← 你正在读的这个文件
```

---

## 路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/subjects` | 学习科目 |
| `/knowledge` | 专项知识点 |
| `/knowledge/reading/:topic/:level` | 阅读专项做题（如 `/knowledge/reading/zhuzhi/level1`） |
| `/practice` | 综合练习 |
| `/faq` | 常见问题 |

---

## 阅读专项题目系统

**ReadingDetail.tsx** 是核心做题页面，特点：
- **一页一题**，SAT 数字考试风格
- 左栏显示 Passage，右栏显示题目和选项
- 选好答案 → 点"确认答案" → 显示对错 → 点"Next"进入下一题
- 顶部有进度条 + 题号导航面板（可跳转任意题）
- 支持标记（Flag）功能
- 做完所有题后显示总结页

**题目数据**在 ReadingDetail.tsx 文件内部的 `topicData` 对象里：
- `zhuzhi` → 主旨与细节题（目前有 Level 1，10 道题）
- 新增 topic 只需要：添加题目数组 → 在 `topicData` 中注册 → 在 `topicNames` 中添加中文名

**Knowledge.tsx** 里的 `topicRouteKeys` 控制哪些题型有可点击的链接。

---

## 综合练习系统

**Practice.tsx** 用 `data/questions.ts` 里的题库，支持按科目（数学/阅读）和难度（简单/中等/困难）筛选，也是一页一题模式。

---

## 改动历史

| 日期 | 改动内容 |
|------|----------|
| 2025-05-17 | 将 ReadingDetail 页面从"所有题目在一页"改为一页一题 SAT 机考模式 |

---

## 用户偏好（Patrick）

- 中文沟通
- 非专业程序员，需要清晰简洁的操作指引
- 使用 VS Code 开发
- 用 Git GUI（VS Code 侧边栏 Source Control）而非命令行提交代码
- 项目存放在 `~/sat-prep`（本地路径，Git 同步，不在 iCloud）

## 输出文件位置

所有 AI 生成的文件（PDF、脚本、文档等）统一输出到 iCloud 下的 **AI文件夹**：

```
/Users/patrickzou/Library/Mobile Documents/com~apple~CloudDocs/AI文件夹/
├── 知识库/            # 个人知识库（SAT 阅读、AI、语言等，跨电脑同步）
├── PDF讲义/          # PDF 文档、讲义
├── 脚本工具/          # Python 脚本、工具
├── Claude-会话/       # Claude 会话记录（跨电脑同步）
└── 其他/             # 临时/未分类
```

不在工作目录或临时目录存放生成文件。换电脑后同一路径可访问。

## 知识库

Patrick 的知识库在 iCloud AI文件夹/知识库/，包含多个领域（SAT 阅读/数学/文法、AI 学习、语言学习、旅游、理财等）。
每次 Patrick 投喂新题目或资料时，Claude 应主动读回对应知识库文件，分析归类并写入。
知识库独立于 SAT-prep 项目，不进入 git，仅通过 iCloud 同步。

---

## 常用操作提醒

**本地预览**: `npm run dev` → 浏览器打开 localhost:5173

**部署上线**: VS Code 左边 Git 面板 → 写备注 → Commit → Sync

**添加新题目**: 在 ReadingDetail.tsx 的对应数组里添加题目对象（包含 id、passage、question、options、answer）

---

## 日常工作流（最重要！每次改完都按这个走）

### 📌 场景 1：当前电脑改完内容 → 保存进度 → 同步上线

每次让 Claude 改完代码后，Patrick 要做的事：

**① 本地预览（可选但推荐）**
- VS Code 终端运行 `npm run dev`
- 浏览器打开 `localhost:5173` 检查改动效果
- 看完没问题，终端按 `Ctrl+C` 关掉

**② 提交并推送到 GitHub**
1. 点 VS Code 左侧 **Source Control 图标**（或按 `Cmd+Shift+G`）
2. 输入框写**提交备注**（例如：`添加阅读Level2题目`、`优化首页布局`）
3. 点 **✓ Commit**
4. 点 **Sync Changes**（推送到 GitHub）
5. **完事！** Vercel 会自动检测 main 分支更新，1-2 分钟后线上网站自动更新 ✅

---

### 📌 场景 2：换到另一台电脑 → 拉取最新进度

**如果这台电脑第一次用** → 看下面"环境配置备忘"那一节走一遍。

**如果之前已经克隆过**：
1. 打开 VS Code，进入项目
2. 点 Source Control 面板 → **Sync Changes / Pull**（或终端跑 `git pull`）
3. 终端运行 `npm install`（保险起见，确保依赖最新）
4. `npm run dev` 启动本地预览

---

### 📌 场景 3：git push/pull 卡住 → 代理问题

打开 ClashX，终端运行：
```
git config --global http.proxy http://127.0.0.1:7891
git config --global https.proxy http://127.0.0.1:7891
```
端口不确定就先跑 `scutil --proxy | grep -E 'HTTPPort|HTTPSPort'` 看当前值（历史上用过 7890，现在 ClashX Meta 是 7891）。

---

### 🌟 核心口诀

> **改完 → Commit 写备注 → Sync → 完事**
>
> **换电脑 → Pull → npm install → 恢复AI记忆 → npm run dev**

---

## 环境配置备忘（换电脑 / 首次使用）

> 完整步骤见 [docs/setup.md](docs/setup.md)。包含：克隆仓库、npm install、Git 代理、img2txt 安装、模型切换脚本。

日常使用只需记住：**git push/pull 卡住 → 打开 ClashX，跑 `git config --global http.proxy http://127.0.0.1:<端口>`**（端口用 `scutil --proxy | grep HTTPPort` 查，当前是 **7891**）

---

## AI 编码行为准则（Karpathy Guidelines）

> 这些准则来自 [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)，旨在减少 LLM 编码中的常见错误。
> **权衡**：这些准则偏向谨慎而非速度。简单任务可按需判断。

### 1. 先思考，再编码

**不要假设。不要隐藏困惑。明确权衡取舍。**

实现之前：
- 明确陈述你的假设。如果不确定，直接问。
- 如果存在多种理解方式，列出它们 — 不要默默选择一种。
- 如果有更简单的方法，说出来。在必要时提出质疑。
- 如果有不清楚的地方，停下来。指出困惑点。提问。

### 2. 简洁优先

**用最少代码解决问题。不写推测性代码。**

- 不添加未被要求的功能。
- 不为单次使用的代码创建抽象。
- 不添加未被要求的"灵活性"或"可配置性"。
- 不为不可能发生的场景添加错误处理。
- 如果你写了 200 行代码，而它本可以用 50 行完成，重写它。

自问："资深工程师会说这太复杂了吗？"如果会，简化。

### 3. 精准修改

**只动必须动的地方。只清理自己造成的烂摊子。**

编辑现有代码时：
- 不要"改进"相邻的代码、注释或格式。
- 不要重构没有问题的东西。
- 匹配现有风格，即使你自己的风格不同。
- 如果注意到无关的废弃代码，提及它 — 但不要删除它。

当你的修改产生了孤立代码：
- 删除被你修改变成无用的导入/变量/函数。
- 不要删除之前就存在的废弃代码，除非被明确要求。

检验标准：每一行修改都应该能追溯到用户的请求。

### 4. 目标驱动执行

**定义成功标准。循环直到验证通过。**

将任务转化为可验证的目标：
- "添加验证" → "先为无效输入写测试，然后让测试通过"
- "修复 bug" → "先写一个能复现的测试，然后修复"
- "重构 X" → "确保重构前后测试都通过"

多步骤任务，先陈述简要计划：
```
1. [步骤] → 验证: [检查点]
2. [步骤] → 验证: [检查点]
3. [步骤] → 验证: [检查点]
```

强成功标准让你能独立循环推进。弱标准（"让它工作"）需要不断澄清。

---

## 下一步可能做的事

- 给其他阅读题型（FSP目的题、文学文本题等）添加题目
- 添加 Level 2、Level 3 难度的题目
- 文法和数学的专项做题页面
- 做题历史记录与错题本功能
