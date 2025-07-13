#!/bin/bash

# 🚀 PROJEKT SETUP - Automatické nastavení vývojového prostředí
# Spustí se automaticky při otevření projektu na jakémkoliv PC

echo "🎲 AI DICE CHALLENGE - PROJEKT SETUP"
echo "═══════════════════════════════════════════════"

# Kontrola, zda jsme v správném adresáři
if [ ! -f "package.json" ]; then
    echo "❌ Nejste ve správném adresáři projektu!"
    exit 1
fi

echo "📋 KONTROLA PROSTŘEDÍ..."

# 1. Kontrola Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js není nainstalován!"
    echo "💡 Instalujte Node.js z https://nodejs.org/"
    exit 1
fi

# 2. Kontrola npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm není k dispozici!"
    exit 1
fi

# 3. Kontrola Git
if command -v git >/dev/null 2>&1; then
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
else
    echo "❌ Git není nainstalován!"
    exit 1
fi

echo ""
echo "🔧 NASTAVENÍ PROJEKTU..."

# 4. Instalace závislostí (pokud není node_modules)
if [ ! -d "node_modules" ]; then
    echo "📦 Instaluji závislosti..."
    npm install
else
    echo "✅ Závislosti již nainstalovány"
fi

# 5. Nastavení executable práv pro skripty
echo "🔑 Nastavuji práva pro skripty..."
chmod +x css-validation.sh
chmod +x verify-copilot-system.sh
chmod +x auto-commit-watcher.sh
chmod +x setup-project.sh

echo ""
echo "🤖 COPILOT SELF-CHECK SYSTÉM..."

# 6. Test self-check systému
./verify-copilot-system.sh

echo ""
echo "🎯 DOPORUČENÉ WORKFLOW:"
echo "═══════════════════════════════════════════════"
echo "1️⃣ Před každou změnou: ./verify-copilot-system.sh"
echo "2️⃣ Bootstrap dokumentace: dokumentybtrap/"
echo "3️⃣ CSS validace: ./css-validation.sh"
echo "4️⃣ Auto-commit: npm run auto-commit (volitelné)"
echo ""
echo "📖 BOOTSTRAP DOKUMENTACE:"
echo "   - dokumentybtrap/grid.md - Grid systém"
echo "   - dokumentybtrap/spacing.md - Spacing"
echo "   - dokumentybtrap/buttons.md - Tlačítka"
echo "   - dokumentybtrap/flex.md - Flexbox"
echo ""
echo "🚀 PROJEKT JE PŘIPRAVEN!"
echo "   Spusť: npm run dev"
