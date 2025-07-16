#!/bin/bash

# 🧪 ROZŠÍŘENÝ TEST RUNNER PRO AI DICE CHALLENGE
# Spouští všechny testy včetně nových edge-case a real-game simulací

echo "🎲 AI DICE CHALLENGE - ROZŠÍŘENÝ TEST SUITE"
echo "════════════════════════════════════════════════"

# Kontrola existence souborů
if [ ! -f "test-farkle-comprehensive.js" ]; then
    echo "❌ test-farkle-comprehensive.js nenalezen!"
    exit 1
fi

if [ ! -f "test-real-game-simulation.js" ]; then
    echo "❌ test-real-game-simulation.js nenalezen!"
    exit 1
fi

# Test 1: Komprehenzivní unit testy (včetně nových edge-cases)
echo "🧪 1/3: Spouštím komprehenzivní unit testy..."
echo "────────────────────────────────────────────────"

node test-farkle-comprehensive.js

UNIT_TEST_EXIT_CODE=$?

if [ $UNIT_TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Unit testy dokončeny úspěšně!"
else
    echo "❌ Unit testy selhaly s kódem: $UNIT_TEST_EXIT_CODE"
fi

echo ""

# Test 2: Real-game simulace
echo "🎮 2/3: Spouštím real-game simulaci..."
echo "────────────────────────────────────────────────"

node test-real-game-simulation.js

SIMULATION_EXIT_CODE=$?

if [ $SIMULATION_EXIT_CODE -eq 0 ]; then
    echo "✅ Real-game simulace dokončena úspěšně!"
else
    echo "❌ Real-game simulace selhala s kódem: $SIMULATION_EXIT_CODE"
fi

echo ""

# Test 3: CSS a projekt validace
echo "🔍 3/3: Spouštím CSS a projekt validaci..."
echo "────────────────────────────────────────────────"

if [ -f "smart-css-validation.sh" ]; then
    bash smart-css-validation.sh
    CSS_EXIT_CODE=$?
else
    echo "⚠️ smart-css-validation.sh nenalezen, přeskakuji CSS validaci"
    CSS_EXIT_CODE=0
fi

echo ""

# Souhrn výsledků
echo "📊 SOUHRN VÝSLEDKŮ TESTŮ:"
echo "════════════════════════════════════════════════"

if [ $UNIT_TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Unit testy: ÚSPĚCH"
else
    echo "❌ Unit testy: SELHÁNÍ"
fi

if [ $SIMULATION_EXIT_CODE -eq 0 ]; then
    echo "✅ Real-game simulace: ÚSPĚCH"
else
    echo "❌ Real-game simulace: SELHÁNÍ"
fi

if [ $CSS_EXIT_CODE -eq 0 ]; then
    echo "✅ CSS validace: ÚSPĚCH"
else
    echo "❌ CSS validace: SELHÁNÍ"
fi

echo ""

# Celkové hodnocení
if [ $UNIT_TEST_EXIT_CODE -eq 0 ] && [ $SIMULATION_EXIT_CODE -eq 0 ] && [ $CSS_EXIT_CODE -eq 0 ]; then
    echo "🎉 VŠECHNY TESTY PROŠLY! Projekt je připraven k nasazení."
    echo ""
    echo "💡 Co bylo testováno:"
    echo "  • První zápis validace (300 bodů minimum)"
    echo "  • HOT DICE re-rolling mechanizmus"
    echo "  • FARKLE timing a synchronizace"
    echo "  • AI fallback a loop protection"
    echo "  • ODLOŽIT vs endTurn validace"
    echo "  • Dlouhé hry a AI stabilita"
    echo "  • CSS konzistence a modularita"
    
    exit 0
else
    echo "⚠️ NĚKTERÉ TESTY SELHALY! Zkontroluj výše uvedené chyby."
    echo ""
    echo "🔧 Doporučené akce:"
    
    if [ $UNIT_TEST_EXIT_CODE -ne 0 ]; then
        echo "  • Zkontroluj herní logiku v src/js/game/"
        echo "  • Ověř validaci prvního zápisu"
        echo "  • Prověř calculatePoints() funkci"
    fi
    
    if [ $SIMULATION_EXIT_CODE -ne 0 ]; then
        echo "  • Zkontroluj AI controller logiku"
        echo "  • Ověř anti-loop protection"
        echo "  • Prověř AI decision engine"
    fi
    
    if [ $CSS_EXIT_CODE -ne 0 ]; then
        echo "  • Zkontroluj Bootstrap compliance"
        echo "  • Odstraň inline styly"
        echo "  • Ověř CSS modularitu"
    fi
    
    exit 1
fi
