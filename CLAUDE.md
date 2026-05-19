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
> **换电脑 → Pull → npm install → npm run dev**

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

## Claude Code 多模型切换（Claude 中转 ↔ DeepSeek）

> 2026-05-19 实测可用。通过 `launchctl setenv` 设置环境变量 + `~/.zshrc` 写入，让 VS Code 和终端都能正确加载。

### 安装 CC Switch（可选 GUI）

```bash
brew install --cask cc-switch
```

在 CC Switch 中新建两个 Profile：

| 字段 | Claude 中转 | DeepSeek |
|------|------------|----------|
| 请求地址 | `https://pikachu.claudecode.love` | `https://api.deepseek.com/anthropic` |
| API Key | `sk-b0b246226e18f0d2c0f41eefe310762c759e71937974dfb4ac17bd769b7b21f9` | `sk-cce220333d73455191bee31e64d45996` |

> **注意**：CC Switch 会检测 `~/.zshrc` 中是否有硬编码的环境变量，如果有会弹出"环境变量冲突"警告并拒绝工作。解决方法是先清空 `.zshrc`，让 CC Switch 和切换脚本接管。

### 安装切换脚本 `cc`

```bash
mkdir -p ~/bin
```

复制以下内容到 `~/bin/cc`：

```bash
#!/bin/bash

CLAUDE_URL="https://pikachu.claudecode.love"
CLAUDE_KEY="sk-b0b246226e18f0d2c0f41eefe310762c759e71937974dfb4ac17bd769b7b21f9"

DEEPSEEK_URL="https://api.deepseek.com/anthropic"
DEEPSEEK_KEY="sk-cce220333d73455191bee31e64d45996"

restart_vscode() {
  echo "Restarting VS Code..."
  osascript -e 'tell app "Visual Studio Code" to quit'
  sleep 2
  open -a "Visual Studio Code"
  echo "Done."
}

switch_to() {
  local name=$1 url=$2 key=$3 do_restart=$4
  launchctl setenv ANTHROPIC_BASE_URL "$url"
  launchctl setenv ANTHROPIC_AUTH_TOKEN "$key"
  echo "export ANTHROPIC_BASE_URL=\"$url\"" > ~/.zshrc
  echo "export ANTHROPIC_AUTH_TOKEN=\"$key\"" >> ~/.zshrc
  echo "Switched to $name ($url)"
  if [ "$do_restart" = "1" ]; then
    restart_vscode
  fi
}

show_status() {
  local url name
  url=$(launchctl getenv ANTHROPIC_BASE_URL 2>/dev/null)
  if echo "$url" | grep -q deepseek; then
    name="DeepSeek"
  elif echo "$url" | grep -q pikachu; then
    name="Claude (relay)"
  else
    name="Unknown"
  fi
  echo "Current: $name | $url"
}

restart=false
for arg in "$@"; do
  case "$arg" in -r|--restart) restart=true ;; esac
done

case "${1:-}" in
  claude|c)
    shift; switch_to "Claude (relay)" "$CLAUDE_URL" "$CLAUDE_KEY" "$([ "$restart" = true ] && echo 1 || echo 0)"
    ;;
  deepseek|ds|d)
    shift; switch_to "DeepSeek" "$DEEPSEEK_URL" "$DEEPSEEK_KEY" "$([ "$restart" = true ] && echo 1 || echo 0)"
    ;;
  status|s|"")
    show_status
    ;;
  restart|r)
    restart_vscode
    ;;
  -h|--help|help)
    echo "Usage: cc <command> [-r]"
    echo ""
    echo "  cc claude | c       Switch to Claude relay"
    echo "  cc deepseek | ds    Switch to DeepSeek"
    echo "  cc c -r             Switch + restart VS Code"
    echo "  cc restart | r      Restart VS Code"
    echo "  cc status | s       Show current model"
    ;;
  *)
    echo "Unknown: $1"
    echo "Usage: cc {claude|deepseek|restart|status} [-r]"
    ;;
esac
```

然后：

```bash
chmod +x ~/bin/cc
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

### 清空 .zshrc，避免与 CC Switch 冲突

```bash
echo "" > ~/.zshrc
```

### 日常使用

```bash
cc ds -r     # 切换到 DeepSeek 并重启 VS Code
cc c -r      # 切换到 Claude 中转并重启 VS Code
cc status    # 查看当前模型
```

> **重要**：`cc -r` 命令必须在 macOS 自带 **Terminal.app** 中运行，不要在 VS Code 终端里跑。VS Code 关闭时会杀死终端，导致环境变量设置失败。

### 原理

切换脚本通过 `launchctl setenv` 设置环境变量（供 VS Code 等 GUI 应用读取），同时写入 `~/.zshrc`（供终端新标签页自动加载）。两个变量：

- `ANTHROPIC_BASE_URL` — API 请求地址
- `ANTHROPIC_AUTH_TOKEN` — API 密钥

---

## 下一步可能做的事

- 给其他阅读题型（FSP目的题、文学文本题等）添加题目
- 添加 Level 2、Level 3 难度的题目
- 文法和数学的专项做题页面
- 做题历史记录与错题本功能
