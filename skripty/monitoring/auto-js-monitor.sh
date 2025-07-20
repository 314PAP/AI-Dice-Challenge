#!/bin/bash

# 🎲 AI Dice Challenge - JS Monitor Script
# Sleduje změny v JS souborech a spouští testy

echo "🔍 Spouštím monitoring JS souborů..."

# Funkce pro spuštění testů
run_tests() {
    echo ""
    echo "🧪 SPOUŠTĚNÍ TESTŮ PO ZMĚNĚ JS SOUBORU"
    echo "=================================="
    
    # Rychlé testy
    npm run test:quick 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Rychlé testy: PROŠLY"
    else
        echo "❌ Rychlé testy: SELHALY"
    fi
    
    # Test herní logiky
    node -e "
    try {
        const gameState = require('./src/js/game/gameState.js');
        console.log('✅ GameState: FUNKČNÍ');
    } catch(e) {
        console.log('❌ GameState: CHYBA -', e.message);
    }
    
    try {
        const { GameLogic } = require('./src/js/game/gameLogic.js');
        console.log('✅ GameLogic: FUNKČNÍ');
    } catch(e) {
        console.log('❌ GameLogic: CHYBA -', e.message);
    }
    " 2>/dev/null || echo "❌ Syntax check: SELHALY"
    
    echo "=================================="
}

# Sledování změn v JS souborech
inotifywait -m -r -e modify --format '%w%f' src/js/ 2>/dev/null | while read file
do
    if [[ "$file" == *.js ]]; then
        echo "📝 Změna detekována: $file"
        sleep 1  # Krátká pauza před testem
        run_tests
    fi
done
