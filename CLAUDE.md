# SAT Prep 备考网站 — 项目上下文

> 这个文件是给 Claude（AI 助手）看的项目备忘录。
> 不管在哪台电脑、用桌面客户端还是 VS Code 插件，只要说"读一下 CLAUDE.md"就能恢复上下文。

---

## 截图交流（重要！DeepSeek 不支持图片）

> DeepSeek 模型无法识别图片。Patrick 截图后会说 **"看图"**，意思是：运行 `~/bin/img2txt` 从剪贴板提取文字（macOS Vision OCR，秒级），然后把文字结果返回给 Patrick 分析。
>
> **关键**：看到"看图"就执行命令 `~/bin/img2txt`，不要等 Patrick 做任何其他操作。他不需要粘贴图片，只需要说"看图"两个字。

---

## 项目概况

- **名称**: SAT Prep — 中文 SAT 备考网站
- **目标用户**: 准备 SAT 考试的中国学生（Patrick）
- **语言**: 界面中文，题目内容中英混合
- **线上地址**: 通过 Vercel 自动部署（push 到 main 分支即触发）
- **GitHub 仓库**: https://github.com/PatrickZou1225/SATMaterials.git

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
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

---

### 🌟 核心口诀

> **改完 → Commit 写备注 → Sync → 完事**
>
> **换电脑 → Pull → npm install → 恢复AI记忆 → npm run dev**

---

## 环境配置备忘（换电脑 / 首次使用）

> 完整步骤见 [docs/setup.md](docs/setup.md)。包含：克隆仓库、npm install、Git 代理、img2txt 安装、模型切换脚本。

日常使用只需记住：**git push/pull 卡住 → 打开 ClashX，跑 `git config --global http.proxy http://127.0.0.1:7890`**

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
