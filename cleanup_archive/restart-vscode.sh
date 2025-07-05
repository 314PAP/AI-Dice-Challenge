#!/bin/bash
# Skript pro restart VS Code a vyčištění cache

echo "🔄 Restartování VS Code a vyčištění cache..."

# Ukončení všech běžících instancí VS Code
echo "📋 Ukončuji všechny instance VS Code..."
pkill -f code

# Ukončení běžících Node procesů
echo "📋 Ukončuji běžící Node procesy..."
pkill -f node

# Vyčištění VS Code cache
echo "🧹 Čištění cache VS Code..."
rm -rf ~/.config/Code/Cache/* 2>/dev/null
rm -rf ~/.config/Code/CachedData/* 2>/dev/null
rm -rf ~/.config/Code/CachedExtensions/* 2>/dev/null
rm -rf ~/.config/Code/Code\ Cache/* 2>/dev/null
rm -rf ~/.config/Code/Crashpad/* 2>/dev/null
rm -rf ~/.config/Code/logs/* 2>/dev/null

# Vyčištění lokální cache projektu
echo "🧹 Čištění cache projektu..."
rm -rf .vscode/.browse* 2>/dev/null
rm -rf .vscode/.ropeproject 2>/dev/null
rm -rf .vscode/.cache 2>/dev/null

echo "✅ Čištění dokončeno!"
echo "🚀 Nyní můžete VS Code znovu spustit příkazem: code ."
