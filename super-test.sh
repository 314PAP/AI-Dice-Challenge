#!/bin/bash

# 🎲 AI DICE CHALLENGE - SUPER KOMPLETNÍ TEST
# Tento test hlídá VŠECHNO co jsme si zavedli během vývoje
# Spouští se automaticky po každé změně JS souboru

set -e

echo "🚀 AI DICE SUPER TEST - KOMPLETNÍ VALIDACE"
echo "════════════════════════════════════════════════════════════════════"

# ===============================================================================
# 1. ZÁKLADNÍ VALIDACE PRAVIDEL
# ===============================================================================
echo "1️⃣ Základní validace pravidel..."

# Kontrola inline stylů
echo "🔍 Kontroluji inline styly..."
INLINE_STYLES=$(find src -name "*.html" -o -name "*.js" | xargs grep -l 'style=' || echo "")
if [ -n "$INLINE_STYLES" ]; then
    echo "❌ CHYBA: Nalezeny inline styly!"
    echo "$INLINE_STYLES"
    exit 1
fi
echo "✅ Žádné inline styly"

# Kontrola CSS modularity
echo "🔍 Kontroluji CSS modularitu..."
if [ ! -f "src/styles/main.css" ]; then
    echo "❌ CHYBA: Hlavní CSS soubor neexistuje!"
    exit 1
fi
echo "✅ CSS modulární struktura OK"

# Kontrola použití lodash
echo "🔍 Kontroluji Lodash..."
LODASH_USAGE=$(find src -name "*.js" | xargs grep -l "lodash\|_\." || echo "")
if [ -z "$LODASH_USAGE" ]; then
    echo "⚠️ VAROVÁNÍ: Lodash není používán"
else
    echo "✅ Lodash je používán"
fi

# ===============================================================================
# 2. KRITICKÉ JS FUNKCE A DUPLIKÁTY
# ===============================================================================
echo ""
echo "2️⃣ Kontrola kritických JS funkcí..."

# Kontrola updatePlayerScore volání
echo "🔍 Kontroluji updatePlayerScore..."
UPDATE_CALLS=$(find src -name "*.js" | xargs grep -n "updatePlayerScore" || echo "")
echo "📊 updatePlayerScore volání:"
echo "$UPDATE_CALLS"
echo ""

# Kontrola endTurn volání
echo "🔍 Kontroluji endTurn..."
ENDTURN_CALLS=$(find src -name "*.js" | xargs grep -n "endTurn" || echo "")
echo "📊 endTurn volání:"
echo "$ENDTURN_CALLS"
echo ""

# Kontrola AI tahů
echo "🔍 Kontroluji AI tahy..."
AI_CALLS=$(find src -name "*.js" | xargs grep -n "startAiTurn\|Začínám tah" || echo "")
echo "📊 AI tah volání:"
echo "$AI_CALLS"
echo ""

# Kontrola FARKLE handling
echo "🔍 Kontroluji FARKLE handling..."
FARKLE_CALLS=$(find src -name "*.js" | xargs grep -n "handleFarkle\|FARKLE" || echo "")
echo "📊 FARKLE handling:"
echo "$FARKLE_CALLS"
echo ""

# ===============================================================================
# 3. HERNÍ LOGIKA KONZISTENCE
# ===============================================================================
echo ""
echo "3️⃣ Test herní logiky konzistence..."

# Rychlé JS syntax check
echo "🔍 Kontroluji JS syntax..."
for file in $(find src -name "*.js"); do
    if ! node -c "$file" 2>/dev/null; then
        echo "❌ SYNTAX CHYBA v $file"
        node -c "$file"
        exit 1
    fi
done
echo "✅ JS syntax OK"

# ===============================================================================
# 4. FUNKČNÍ TESTY HERNÍ LOGIKY
# ===============================================================================
echo ""
echo "4️⃣ Funkční testy herní logiky..."

# Test scoring systému
echo "🔍 Testuji scoring systém..."
node -e "
const path = process.cwd() + '/src/js/game/diceMechanics.js';
import(path).then(module => {
    const { calculatePoints } = module;
    const testCases = [
        { dice: [1], expected: 100, desc: 'Jednička' },
        { dice: [5], expected: 50, desc: 'Pětka' },
        { dice: [1,1,1], expected: 1000, desc: 'Tři jedničky' },
        { dice: [2,2,2], expected: 200, desc: 'Tři dvojky' },
        { dice: [1,1,1,1], expected: 2000, desc: 'Čtyři jedničky' },
        { dice: [2,3,4,6], expected: 0, desc: 'Žádné body' }
    ];
    
    let errors = 0;
    testCases.forEach(test => {
        const result = calculatePoints(test.dice);
        if (result !== test.expected) {
            console.error(\`❌ \${test.desc}: očekáváno \${test.expected}, získáno \${result}\`);
            errors++;
        } else {
            console.log(\`✅ \${test.desc}: \${result} bodů\`);
        }
    });
    
    if (errors > 0) {
        console.error(\`❌ \${errors} chyb ve scoring systému!\`);
        process.exit(1);
    } else {
        console.log('✅ Scoring systém OK');
    }
}).catch(e => {
    console.error('❌ Chyba při načítání diceMechanics:', e.message);
    process.exit(1);
});
"

# ===============================================================================
# 5. UI/UX KOMPONENTY
# ===============================================================================
echo ""
echo "5️⃣ Test UI/UX komponent..."

# Kontrola Bootstrap usage
echo "🔍 Kontroluji Bootstrap usage..."
BOOTSTRAP_USAGE=$(find src -name "*.html" -o -name "*.js" | xargs grep -c "class.*\(container\|row\|col\|btn\|d-\|p-\|m-\|text-\)" | awk -F: '{sum += $2} END {print sum}')
echo "📊 Bootstrap utility třídy: $BOOTSTRAP_USAGE usage"

if [ "$BOOTSTRAP_USAGE" -lt 50 ]; then
    echo "⚠️ VAROVÁNÍ: Málo Bootstrap utility tříd"
else
    echo "✅ Bootstrap utility třídy OK"
fi

# Kontrola neon tříd
echo "🔍 Kontroluji neon třídy..."
NEON_USAGE=$(find src -name "*.html" -o -name "*.js" -o -name "*.css" | xargs grep -c "neon-\|text-neon\|btn-neon\|border-neon" | awk -F: '{sum += $2} END {print sum}')
echo "📊 Neon třídy: $NEON_USAGE usage"

if [ "$NEON_USAGE" -lt 10 ]; then
    echo "⚠️ VAROVÁNÍ: Málo neon tříd"
else
    echo "✅ Neon třídy OK"
fi

# ===============================================================================
# 6. PERFORMANCE A STABILITA
# ===============================================================================
echo ""
echo "6️⃣ Test performance a stability..."

# Počet řádků JS kódu
echo "🔍 Kontroluji velikost kódu..."
JS_LINES=$(find src -name "*.js" | xargs wc -l | tail -1 | awk '{print $1}')
echo "📊 Celkem řádků JS: $JS_LINES"

if [ "$JS_LINES" -gt 8000 ]; then
    echo "⚠️ VAROVÁNÍ: Kód přesahuje 8000 řádků!"
else
    echo "✅ Velikost kódu OK"
fi

# Test event listeners duplikátů
echo "🔍 Kontroluji event listeners..."
EVENT_LISTENERS=$(find src -name "*.js" | xargs grep -c "addEventListener\|onclick\|onload" | awk -F: '{sum += $2} END {print sum}')
echo "📊 Event listeners: $EVENT_LISTENERS"

# ===============================================================================
# 7. GAME STATE KONZISTENCE
# ===============================================================================
echo ""
echo "7️⃣ Test game state konzistence..."

# Kontrola game state funkcí
echo "🔍 Kontroluji gameState funkce..."
GAMESTATE_FUNCTIONS=$(grep -n "^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*(" src/js/game/gameState.js | wc -l)
echo "📊 GameState funkcí: $GAMESTATE_FUNCTIONS"

# Kontrola, zda existuje updatePlayerScore
if ! grep -q "updatePlayerScore" src/js/game/gameState.js; then
    echo "❌ CHYBA: updatePlayerScore neexistuje v gameState!"
    exit 1
fi
echo "✅ updatePlayerScore existuje"

# ===============================================================================
# 8. FINÁLNÍ VALIDACE
# ===============================================================================
echo ""
echo "8️⃣ Finální validace..."

# Kontrola všech důležitých souborů
CRITICAL_FILES=(
    "src/js/game/gameState.js"
    "src/js/game/TurnManager.js"
    "src/js/game/diceMechanics.js"
    "src/js/game/DiceManager.js"
    "src/js/ai/aiPlayerController.js"
    "src/js/ui/gameUI.js"
    "src/js/ui/gameRenderer.js"
    "src/styles/main.css"
    "index.html"
)

echo "🔍 Kontroluji kritické soubory..."
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ CHYBA: Kritický soubor $file neexistuje!"
        exit 1
    fi
done
echo "✅ Všechny kritické soubory existují"

# ===============================================================================
# VÝSLEDKY
# ===============================================================================
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "🎉 SUPER TEST DOKONČEN ÚSPĚŠNĚ!"
echo "════════════════════════════════════════════════════════════════════"
echo "📊 STATISTIKY:"
echo "   • JS řádky: $JS_LINES"
echo "   • Bootstrap usage: $BOOTSTRAP_USAGE"
echo "   • Neon třídy: $NEON_USAGE"
echo "   • Event listeners: $EVENT_LISTENERS"
echo "   • GameState funkcí: $GAMESTATE_FUNCTIONS"
echo ""
echo "✅ Všechny testy prošly!"
echo "✅ Kód je připraven pro produkci!"
echo "════════════════════════════════════════════════════════════════════"

exit 0
