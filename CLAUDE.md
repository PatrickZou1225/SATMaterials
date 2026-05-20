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
- 项目存放在 iCloud Drive 路径下

## 输出文件位置

所有 AI 生成的文件（PDF、脚本、文档等）统一输出到 `~/Downloads/AI 文件夹/`，按类型分目录：

- `PDF讲义/` — PDF 文档、讲义
- `脚本工具/` — Python 脚本、工具
- 其他类型新建对应子目录

不在工作目录或临时目录存放生成文件。

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

### 6. 安装 `img2txt`（截图 OCR 工具，macOS 专用）

> DeepSeek 模型不支持图片输入，所以用 macOS 自带 Vision OCR 把截图里的文字瞬间提取出来，AI 再分析文字。
> 使用前提：macOS 10.15+，自带 Vision 框架，无需任何第三方依赖。

```bash
mkdir -p ~/bin ~/Screenshots
```

把下面这段 Swift 代码保存为 `/tmp/ocr.swift`：

```swift
import Vision
import AppKit
import Foundation

let screenshotsDir = NSHomeDirectory() + "/Screenshots"
try? FileManager.default.createDirectory(atPath: screenshotsDir, withIntermediateDirectories: true)

let df = DateFormatter()
df.dateFormat = "yyyy-MM-dd_HH-mm-ss"
let filename = "screenshot_\(df.string(from: Date())).png"
let filepath = screenshotsDir + "/" + filename

guard let img = NSPasteboard.general.readObjects(forClasses: [NSImage.self], options: nil)?.first as? NSImage,
      let tiff = img.tiffRepresentation,
      let bmp = NSBitmapImageRep(data: tiff),
      let png = bmp.representation(using: .png, properties: [:]) else {
    print("ERROR: No image in clipboard")
    exit(1)
}
try png.write(to: URL(fileURLWithPath: filepath))
print("SAVED: \(filepath)")

guard let cgImg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { exit(1) }
let req = VNRecognizeTextRequest()
req.recognitionLanguages = ["zh-Hans", "zh-Hant", "en"]
req.recognitionLevel = .accurate
try? VNImageRequestHandler(cgImage: cgImg, options: [:]).perform([req])
if let obs = req.results {
    for o in obs {
        if let top = o.topCandidates(1).first {
            print(top.string)
        }
    }
}
```

然后编译安装：

```bash
swiftc -O /tmp/ocr.swift -o ~/bin/img2txt && rm /tmp/ocr.swift
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

测试（先截一张图到剪贴板，然后跑）：

```bash
~/bin/img2txt
```

如果能输出文字，就说明安装成功。以后 Patrick 说 **"看图"**，AI 就会自动跑这个命令。

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
