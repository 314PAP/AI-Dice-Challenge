#!/bin/bash

# 🔌 VS Code Extensions Auto-Installer
# Instaluje všechna doporučená rozšíření z extensions.json

echo "🚀 Instaluji VS Code rozšíření..."

# Array of extensions to install
extensions=(
    "ms-vscode.vscode-eslint"
    "esbenp.prettier-vscode"
    "bradlc.vscode-tailwindcss"
    "ms-vscode.vscode-json"
    "formulahendry.auto-rename-tag"
    "christian-kohler.path-intellisense"
    "ms-vscode.sublime-keybindings"
    "ms-vscode.vscode-typescript-next"
    "ms-vscode.js-debug"
    "ms-vscode.live-server"
    "ritwickdey.liveserver"
    "ms-vscode.vscode-github-issue-notebooks"
    "ms-vscode.references-view"
    "ms-vscode.bracket-pair-colorizer-2"
    "oderwat.indent-rainbow"
    "ms-vscode.hexeditor"
    "eamodio.gitlens"
    "ms-vscode.git-graph"
    "ms-vscode.powershell"
    "ms-vscode.vscode-npm-dependency-links"
    "ms-vscode.vscode-js-profile-flame"
)

# Install each extension
for ext in "${extensions[@]}"; do
    echo "📦 Instaluji: $ext"
    code --install-extension "$ext"
done

echo "✅ Instalace dokončena!"
echo "🔍 Zkontroluj: code --list-extensions | wc -l"
