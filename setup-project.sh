#!/bin/bash

# 🎲 AI DICE CHALLENGE - PROJECT SETUP & WORKFLOW
# ══════════════════════════════════════════════════

echo ""
echo "🎯 AI DICE CHALLENGE - VÝVOJÁŘSKÝ WORKFLOW"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📋 SUPER-AUTOMATICKÝ WORKFLOW:"
echo "────────────────────────────────────────────────────────────────────"
echo "1️⃣  Otevřeš VS Code → AUTOMATICKY self-check + file watcher"
echo "2️⃣  Programuješ → AUTOMATICKY se validuje při každé změně" 
echo "3️⃣  Po úspěšné validaci → AUTOMATICKY se zeptá na commit"
echo "4️⃣  Stiskneš ENTER → AUTOMATICKY commit + push!"
echo ""
echo "🚨 KRITICKÁ PRAVIDLA (NIKDY NEPORUŠUJ!):"
echo "────────────────────────────────────────────────────────────────────"
echo "❌ ZAKÁZÁNY inline styly - style=\"...\" NIKDY!"
echo "❌ ZAKÁZÁNO vlastní CSS - pouze Bootstrap + naše neon-* třídy"
echo "❌ MAX 3000 řádků JS - pro hru kostek je více PŘÍLIŠ!"
echo "✅ POUŽÍVEJ JS knihovny místo vlastního kódu (lodash, ramda, atd.)"
echo "✅ POUŽÍVEJ Bootstrap dokumentaci v dokumentybtrap/"
echo ""
echo "🎨 CSS ZÁSADY:"
echo "────────────────────────────────────────────────────────────────────"
echo "1️⃣  PRVNÍ: Bootstrap utility třídy"
echo "2️⃣  DRUHÉ: Naše neon-* rozšíření"
echo "3️⃣  POSLEDNÍ: Vlastní CSS (pouze nutné minimum)"
echo ""
echo "⚙️ DOSTUPNÉ PŘÍKAZY (většinou nepotřebuješ):"
echo "────────────────────────────────────────────────────────────────────"
echo "npm run dev      - Spustí vývojářský server"
echo "npm run commit   - Manuální commit (pokud nechceš automatický)"
echo "npm run check    - Manuální self-check"
echo "npm run validate - Manuální validace"
echo "npm run setup    - Zobrazí tento workflow"
echo ""
echo "💡 VĚTŠINOU STAČÍ: Programovat → ENTER pro commit!"
echo ""
echo "📖 BOOTSTRAP DOKUMENTACE:"
echo "────────────────────────────────────────────────────────────────────"
echo "dokumentybtrap/grid.md - Grid systém"
echo "dokumentybtrap/colors.md - Barevný systém"
echo "dokumentybtrap/spacing.md - Spacing utility"
echo "dokumentybtrap/buttons.md - Tlačítka"
echo "dokumentybtrap/forms.md - Formuláře"
echo ""
echo "🔧 PŘED KAŽDOU ZMĚNOU SPUSŤ: npm run check"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Nastavení oprávnění pro skripty
chmod +x verify-copilot-system.sh 2>/dev/null || true
chmod +x css-validation.sh 2>/dev/null || true
chmod +x setup-project.sh 2>/dev/null || true
chmod +x auto-selfcheck.sh 2>/dev/null || true
chmod +x smart-commit.sh 2>/dev/null || true
chmod +x auto-watcher.sh 2>/dev/null || true

echo "✅ Projekt je připraven - DODRŽUJ WORKFLOW!"
echo ""
