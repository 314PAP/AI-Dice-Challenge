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
    echo "• npm run test - interaktivní spuštění testů"
    echo "• npm run test:quick - rychlé testy"
    echo "• npm run test:full - kompletní testy"
    echo "• npm run test:ui - UI a herní logika testy"
    echo "• npm run test:all - kombinace všech základních testů"
    echo "• npm run test:master - kompletní master test runner"
    echo "• npm run commit - validace + commit + push"
    echo "• npm run watch - sledovat změny"
    echo ""
    echo "🔧 WORKFLOW: změna → npm run test → kontrola → npm run commit"
    echo "═══════════════════════════════════════════════════════════════════"
    echo ""
else
    echo ""
    echo "🚨 SELF-CHECK SELHAL!"
    echo "────────────────────────────────────────────────────────────────────"
    echo "❌ Před jakýmkoliv programováním musíte opravit chyby!"
    echo "💡 Spusťte: npm run test"
    echo "🔧 Opravte všechny problémy a pak spusťte znovu"
    echo ""
    exit 1
fi
