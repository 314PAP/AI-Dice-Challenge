#!/bin/bash

# 🎲 AI DICE CHALLENGE - AUTOMATICKÝ SELF-CHECK PRI OTEVŘENÍ VS CODE
# ══════════════════════════════════════════════════════════════════════

echo ""
echo "🤖 AUTOMATICKÝ SELF-CHECK - AI DICE CHALLENGE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Kontrola, že jsme v správném adresáři
if [ ! -f "package.json" ] || [ ! -f "skripty/validace/verify-copilot-system.sh" ]; then
    echo "❌ Nejste ve správném adresáři AI Dice Challenge projektu!"
    exit 1
fi

echo "🔧 Spouštím self-check systému..."
echo "────────────────────────────────────────────────────────────────────"

# Spuštění self-check
if ./skripty/validace/verify-copilot-system.sh; then
    echo ""
    echo "✅ SELF-CHECK ÚSPĚŠNÝ!"
    echo "────────────────────────────────────────────────────────────────────"
    echo "🎯 Můžete začít programovat podle pravidel"
    echo "📋 REMEMBER: npm run validate po každé změně!"
    echo ""
    echo "⚙️ DOSTUPNÉ PŘÍKAZY:"
    echo "• npm run validate - kontrola kódu po změnách"
    echo "• npm run check - kompletní self-check"
    echo "• npm run setup - zobrazit workflow"
    echo ""
    echo "🔧 WORKFLOW: změna → npm run validate → kontrola → commit+push"
    echo "═══════════════════════════════════════════════════════════════════"
    echo ""
else
    echo ""
    echo "🚨 SELF-CHECK SELHAL!"
    echo "────────────────────────────────────────────────────────────────────"
    echo "❌ Před jakýmkoliv programováním musíte opravit chyby!"
    echo "💡 Spusťte: npm run validate"
    echo "🔧 Opravte všechny problémy a pak spusťte: npm run check"
    echo ""
    exit 1
fi
