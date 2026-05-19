#!/bin/bash
# 把剪贴板图片存到 screenshots/latest.png
# 用法：Cmd+Shift+4 截图 → 双击运行此脚本（或用快捷键触发）
DIR="$(cd "$(dirname "$0")" && pwd)"
pngpaste "$DIR/latest.png"
if [ $? -eq 0 ]; then
    echo "✅ 截图已保存到 screenshots/latest.png"
else
    echo "❌ 剪贴板里没有图片"
fi
