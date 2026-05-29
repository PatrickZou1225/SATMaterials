# SAT Prep 环境配置备忘（新电脑首次使用）

> 这个文件从 CLAUDE.md 拆出来，只在换电脑 / 首次配置时需要。日常使用不需要读。

---

## 1. 克隆仓库

```bash
git clone https://github.com/PatrickZou1225/SATMaterials.git ~/sat-prep
```

## 2. 安装依赖

```bash
cd ~/sat-prep
npm install
```

## 3. 配置 Git 代理（国内访问 GitHub 必需）

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

## 4. 排查代理端口的方法

如果忘了端口号，用这个命令查本机所有监听端口：
```
lsof -iTCP -sTCP:LISTEN -P -n | grep 127.0.0.1
```
找到 `ClashX`（或其他代理工具）那一行，看它的端口号。

## 5. 取消代理（如果切到不需要代理的网络）

```
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 6. 恢复 Claude Code 跨电脑记忆（软链接）

换电脑后，需要让 Claude Code 读取 iCloud 里的会话记录和项目记忆。跑这行命令：

```bash
rm -rf ~/.claude/projects && ln -s "/Users/patrickzou/Library/Mobile Documents/com~apple~CloudDocs/AI文件夹/Claude-会话/projects" ~/.claude/projects
```

> **原理**：Claude Code 本身把数据存本地 `~/.claude/projects/`。这条命令把这个目录变成一个"快捷方式"指向 iCloud。iCloud 会先自动同步 AI文件夹 的内容，所以第一次打开可能要多等几分钟。

## 7. 安装 `img2txt`（截图 OCR 工具，macOS 专用）

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

## 8. Claude Code 多模型切换（Claude 中转 ↔ DeepSeek）

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
