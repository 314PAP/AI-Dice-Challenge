#!/bin/bash

# 🎲 AI DICE CHALLENGE - PROJECT SETUP & WORKFLOW
# ══════════════════════════════════════════════════

echo ""
echo "🎯 AI DICE CHALLENGE - VÝVOJÁŘSKÝ WORKFLOW"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📋 POVINNÝ WORKFLOW PRO VŠECHNY ZMĚNY:"
echo "────────────────────────────────────────────────────────────────────"
echo "1️⃣  Před každou změnou: npm run check"
echo "2️⃣  Po změnách kódu: npm run validate" 
echo "3️⃣  Zkontroluj výsledky validace"
echo "4️⃣  Teprve po schválení → commit & push"
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
echo "⚙️ DOSTUPNÉ PŘÍKAZY:"
echo "────────────────────────────────────────────────────────────────────"
echo "npm run dev     - Spustí vývojářský server"
echo "npm run check   - Self-check systému a pravidel"
echo "npm run validate - Validace CSS pravidel"
echo "npm run setup   - Zobrazí tento workflow"
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

echo "✅ Projekt je připraven - DODRŽUJ WORKFLOW!"
echo ""
