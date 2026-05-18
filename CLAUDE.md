# SAT Prep 备考网站 — 项目上下文

> 这个文件是给 Claude（AI 助手）看的项目备忘录。
> 不管在哪台电脑、用桌面客户端还是 VS Code 插件，只要说"读一下 CLAUDE.md"就能恢复上下文。

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
- 项目存放在 iCloud Drive 路径下

---

## 常用操作提醒

**本地预览**: `npm run dev` → 浏览器打开 localhost:5173

**部署上线**: VS Code 左边 Git 面板 → 写备注 → Commit → Sync

**添加新题目**: 在 ReadingDetail.tsx 的对应数组里添加题目对象（包含 id、passage、question、options、answer）

---

## 环境配置备忘（新电脑首次使用）

### 1. 克隆仓库
```
git clone https://github.com/PatrickZou1225/SATMaterials.git
```

### 2. 安装依赖
```
cd SATMaterials
npm install
```

### 3. 配置 Git 代理（国内访问 GitHub 必需）

如果在中国大陆，git push/pull 会连不上 GitHub，需要让 Git 走代理：

```
git config --global http.proxy http://127.0.0.1:<端口>
git config --global https.proxy http://127.0.0.1:<端口>
```

**Patrick 当前使用的代理工具与端口**：
- 工具：**ClashX**（Mac 端，菜单栏图标）
- HTTP 代理端口：**7890**

所以命令是：
```
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

### 4. 排查代理端口的方法

如果忘了端口号，用这个命令查本机所有监听端口：
```
lsof -iTCP -sTCP:LISTEN -P -n | grep 127.0.0.1
```
找到 `ClashX`（或其他代理工具）那一行，看它的端口号。

### 5. 取消代理（如果切到不需要代理的网络）
```
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## 下一步可能做的事

- 给其他阅读题型（FSP目的题、文学文本题等）添加题目
- 添加 Level 2、Level 3 难度的题目
- 文法和数学的专项做题页面
- 做题历史记录与错题本功能
