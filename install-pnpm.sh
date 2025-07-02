#!/bin/bash

# 📦 pnpm Auto-Installer & Migration Script
# Nainstaluje pnpm a provede migraci z npm

echo "🚀 pnpm Migration Script"
echo "========================"

# Check if pnpm is already installed
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm je již nainstalován: $(pnpm --version)"
    exit 0
fi

echo "📦 Instaluji pnpm..."

# Method 1: Try npm global install
echo "🔧 Metoda 1: npm global install"
npm install -g pnpm 2>/dev/null
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm nainstalován via npm!"
    pnpm --version
    exit 0
fi

# Method 2: Try curl install
echo "🔧 Metoda 2: curl install"
curl -fsSL https://get.pnpm.io/install.sh | sh - 2>/dev/null

# Add to PATH and reload
export PATH="$HOME/.local/share/pnpm:$PATH"
source ~/.bashrc 2>/dev/null || true

if command -v pnpm &> /dev/null; then
    echo "✅ pnpm nainstalován via curl!"
    pnpm --version
    
    echo "🔄 Přidávám do ~/.bashrc..."
    echo 'export PATH="$HOME/.local/share/pnpm:$PATH"' >> ~/.bashrc
    
    echo "📦 Spouštím migraci..."
    pnpm import 2>/dev/null || echo "⚠️ package-lock.json nenalezen"
    pnpm install
    
    echo "✅ Migrace dokončena!"
    echo "🎯 Použij: pnpm dev"
    exit 0
fi

# Method 3: Manual instructions
echo "❌ Automatická instalace selhala"
echo ""
echo "🔧 Manuální instalace:"
echo "1. curl -fsSL https://get.pnpm.io/install.sh | sh -"
echo "2. source ~/.bashrc"
echo "3. pnpm --version"
echo "4. pnpm import"
echo "5. pnpm install"
echo ""
echo "📚 Více info: https://pnpm.io/installation"
