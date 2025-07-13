#!/bin/bash

# 🎲 AI DICE CHALLENGE - PROJECT SETUP & WORKFLOW
# ══════════════════════════════════════════════════

echo ""
echo "🎯 AI DICE CHALLENGE - VÝVOJÁŘSKÝ WORKFLOW"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📋 PLNĚ AUTOMATICKÝ WORKFLOW:"
echo "────────────────────────────────────────────────────────────────────"
echo "1️⃣  Při otevření VS Code → automatický self-check"
echo "2️⃣  Spustíš: npm run watch (automatická validace při změnách)"
echo "3️⃣  Programuješ → AUTOMATICKY se validuje při každé změně" 
echo "4️⃣  Když chceš commit: npm run commit → jen potvrdíš"
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
echo "npm run dev      - Spustí vývojářský server"
echo "npm run watch    - Automatické sledování změn + validace"
echo "npm run commit   - Validace → commit → push (jen potvrdíš)"
echo "npm run check    - Self-check systému a pravidel"
echo "npm run validate - Manuální validace CSS pravidel"
echo "npm run setup    - Zobrazí tento workflow"
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
