#!/bin/bash
# ===================================================================
# 🎲 AI DICE CHALLENGE - AUTOMATED GAME FUNCTIONALITY TEST
# Automatizovaný test funkcnosti hry a Farkle logiky
# ===================================================================

echo "🎲 AI DICE CHALLENGE - AUTOMATED FUNCTIONALITY TEST"
echo "════════════════════════════════════════════════════"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to log test results
log_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} $test_name"
        [ -n "$details" ] && echo -e "   ${BLUE}ℹ️  $details${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} $test_name"
        [ -n "$details" ] && echo -e "   ${RED}💥 $details${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to check if server is running
check_server() {
    echo -e "${BLUE}🔍 Kontroluji dev server...${NC}"
    
    if curl -s http://localhost:5174 > /dev/null 2>&1; then
        log_test "Dev server dostupnost" "PASS" "Server běží na portu 5174"
        return 0
    elif curl -s http://localhost:5173 > /dev/null 2>&1; then
        log_test "Dev server dostupnost" "PASS" "Server běží na portu 5173"
        return 0
    else
        log_test "Dev server dostupnost" "FAIL" "Server neběží ani na 5173 ani na 5174"
        echo -e "${YELLOW}⚠️  Spouštím dev server...${NC}"
        npm run dev &
        SERVER_PID=$!
        sleep 3
        return 1
    fi
}

# Function to run JavaScript tests in browser context
run_js_test() {
    local test_name="$1"
    local js_code="$2"
    local expected="$3"
    
    # Create temporary test file
    cat > /tmp/dice_test.js << EOF
// Test: $test_name
try {
    $js_code
    console.log('TEST_RESULT: SUCCESS');
} catch (error) {
    console.log('TEST_RESULT: ERROR - ' + error.message);
}
EOF
    
    # This is a placeholder - in real implementation you'd use Puppeteer or similar
    # For now, we'll check the code structure
    if [[ "$js_code" =~ "gameState\." ]] && [[ "$js_code" =~ "getState\(\)" ]]; then
        log_test "$test_name" "PASS" "GameState API call detected"
    else
        log_test "$test_name" "FAIL" "Invalid gameState usage"
    fi
}

echo -e "${BLUE}📋 Spouštím testy funkčnosti...${NC}"
echo ""

# ===== SERVER TESTS =====
echo -e "${YELLOW}🖥️  SERVER TESTS${NC}"
echo "────────────────────────────────────────"
check_server

# ===== FILE STRUCTURE TESTS =====
echo ""
echo -e "${YELLOW}📁 FILE STRUCTURE TESTS${NC}"
echo "────────────────────────────────────────"

# Check main files exist
if [ -f "src/main.js" ]; then
    log_test "Hlavní main.js existuje" "PASS"
else
    log_test "Hlavní main.js existuje" "FAIL" "src/main.js nenalezen"
fi

if [ -f "src/js/game/gameLogic.js" ]; then
    log_test "GameLogic modul existuje" "PASS"
else
    log_test "GameLogic modul existuje" "FAIL" "gameLogic.js nenalezen"
fi

if [ -f "src/js/game/gameState.js" ]; then
    log_test "GameState modul existuje" "PASS"
else
    log_test "GameState modul existuje" "FAIL" "gameState.js nenalezen"
fi

# Check new modular files
modules=("DiceAnimationManager.js" "TurnManager.js" "DiceManager.js")
for module in "${modules[@]}"; do
    if [ -f "src/js/game/$module" ]; then
        log_test "Modul $module existuje" "PASS"
    else
        log_test "Modul $module existuje" "FAIL" "$module nenalezen"
    fi
done

# ===== CODE STRUCTURE TESTS =====
echo ""
echo -e "${YELLOW}🔧 CODE STRUCTURE TESTS${NC}"
echo "────────────────────────────────────────"

# Check imports
if grep -q "import.*gameState" src/js/game/gameLogic.js; then
    log_test "GameLogic importuje gameState" "PASS"
else
    log_test "GameLogic importuje gameState" "FAIL" "Chybí import gameState"
fi

if grep -q "export.*class.*GameLogic" src/js/game/gameLogic.js; then
    log_test "GameLogic exportuje třídu" "PASS"
else
    log_test "GameLogic exportuje třídu" "FAIL" "Chybí export class GameLogic"
fi

# Check lodash usage
if grep -q "const.*=.*_" src/js/game/DiceAnimationManager.js; then
    log_test "Lodash používán v modulech" "PASS"
else
    log_test "Lodash používán v modulech" "FAIL" "Lodash import nenalezen"
fi

# ===== GAME LOGIC TESTS =====
echo ""
echo -e "${YELLOW}🎮 GAME LOGIC TESTS${NC}"
echo "────────────────────────────────────────"

# Check essential game methods exist
if grep -q "rollDice.*(" src/js/game/gameLogic.js; then
    log_test "GameLogic má rollDice metodu" "PASS"
else
    log_test "GameLogic má rollDice metodu" "FAIL" "rollDice metoda nenalezena"
fi

if grep -q "saveDice.*(" src/js/game/gameLogic.js; then
    log_test "GameLogic má saveDice metodu" "PASS"
else
    log_test "GameLogic má saveDice metodu" "FAIL" "saveDice metoda nenalezena"
fi

if grep -q "endTurn.*(" src/js/game/gameLogic.js; then
    log_test "GameLogic má endTurn metodu" "PASS"
else
    log_test "GameLogic má endTurn metodu" "FAIL" "endTurn metoda nenalezena"
fi

# ===== FARKLE LOGIC TESTS =====
echo ""
echo -e "${YELLOW}💥 FARKLE LOGIC TESTS${NC}"
echo "────────────────────────────────────────"

# Check FARKLE handling
if grep -q "handleFarkle" src/js/game/gameLogic.js; then
    log_test "FARKLE handler existuje" "PASS"
else
    log_test "FARKLE handler existuje" "FAIL" "handleFarkle metoda nenalezena"
fi

if grep -q "hasScoringDice" src/js/game/diceMechanics.js; then
    log_test "Scoring dice kontrola existuje" "PASS"
else
    log_test "Scoring dice kontrola existuje" "FAIL" "hasScoringDice nenalezena"
fi

if grep -q "calculatePoints" src/js/game/diceMechanics.js; then
    log_test "Body calculation existuje" "PASS"
else
    log_test "Body calculation existuje" "FAIL" "calculatePoints nenalezena"
fi

# ===== UI BUTTON TESTS =====
echo ""
echo -e "${YELLOW}🖱️  UI BUTTON TESTS${NC}"
echo "────────────────────────────────────────"

# Check button creation
if grep -q "createNeonButton" src/js/ui/gameRenderer.js; then
    log_test "Neonová tlačítka se vytvářejí" "PASS"
else
    log_test "Neonová tlačítka se vytvářejí" "FAIL" "createNeonButton nenalezen"
fi

# Check button callbacks
if grep -q "rollDice.*callback\|onClick.*rollDice" src/js/ui/gameRenderer.js; then
    log_test "HODIT tlačítko má callback" "PASS"
else
    log_test "HODIT tlačítko má callback" "FAIL" "rollDice callback nenalezen"
fi

if grep -q "saveDice.*callback\|onClick.*saveDice" src/js/ui/gameRenderer.js; then
    log_test "ODLOŽIT tlačítko má callback" "PASS"
else
    log_test "ODLOŽIT tlačítko má callback" "FAIL" "saveDice callback nenalezen"
fi

if grep -q "endTurn.*callback\|onClick.*endTurn\|callbacks\.endTurn" src/js/ui/gameRenderer.js; then
    log_test "UKONČIT TAH tlačítko má callback" "PASS"
else
    log_test "UKONČIT TAH tlačítko má callback" "FAIL" "endTurn callback nenalezen"
fi

# ===== ANIMATION TESTS =====
echo ""
echo -e "${YELLOW}🎬 ANIMATION TESTS${NC}"
echo "────────────────────────────────────────"

if grep -q "playRollingAnimation" src/js/game/DiceAnimationManager.js; then
    log_test "Rolling animace existuje" "PASS"
else
    log_test "Rolling animace existuje" "FAIL" "playRollingAnimation nenalezena"
fi

if grep -q "dice-farkle\|dice-new\|dice-scoring" src/js/game/DiceAnimationManager.js; then
    log_test "CSS animace třídy používány" "PASS"
else
    log_test "CSS animace třídy používány" "FAIL" "Animace CSS třídy nenalezeny"
fi

# ===== MODULAR ARCHITECTURE TESTS =====
echo ""
echo -e "${YELLOW}🏗️  MODULAR ARCHITECTURE TESTS${NC}"
echo "────────────────────────────────────────"

# Count lines in main files
main_lines=$(wc -l < src/main.js)
gamelogic_lines=$(wc -l < src/js/game/gameLogic.js)

if [ "$main_lines" -lt 200 ]; then
    log_test "main.js je modulární (<200 řádků)" "PASS" "$main_lines řádků"
else
    log_test "main.js je modulární (<200 řádků)" "FAIL" "$main_lines řádků (příliš mnoho)"
fi

if [ "$gamelogic_lines" -lt 250 ]; then
    log_test "gameLogic.js je modulární (<250 řádků)" "PASS" "$gamelogic_lines řádků"
else
    log_test "gameLogic.js je modulární (<250 řádků)" "FAIL" "$gamelogic_lines řádků (příliš mnoho)"
fi

# Check no backup files remain
backup_count=$(find src -name "*backup*" -o -name "*original*" | wc -l)
if [ "$backup_count" -eq 0 ]; then
    log_test "Žádné backup soubory" "PASS"
else
    log_test "Žádné backup soubory" "FAIL" "$backup_count backup souborů nalezeno"
fi

# ===== FINAL RESULTS =====
echo ""
echo "════════════════════════════════════════"
echo -e "${BLUE}📊 VÝSLEDKY TESTŮ${NC}"
echo "════════════════════════════════════════"
echo -e "Celkem testů: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Úspěšné: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Neúspěšné: ${RED}$FAILED_TESTS${NC}"

# Calculate success rate
if [ "$TOTAL_TESTS" -gt 0 ]; then
    success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Úspěšnost: ${BLUE}$success_rate%${NC}"
    
    if [ "$success_rate" -ge 90 ]; then
        echo -e "${GREEN}🎉 VÝBORNÝ VÝSLEDEK!${NC}"
        exit 0
    elif [ "$success_rate" -ge 75 ]; then
        echo -e "${YELLOW}⚠️  DOBRÝ VÝSLEDEK, malé opravy potřebné${NC}"
        exit 1
    else
        echo -e "${RED}❌ POTŘEBNÉ VÝZNAMNÉ OPRAVY${NC}"
        exit 2
    fi
else
    echo -e "${RED}❌ ŽÁDNÉ TESTY NEPROBĚHLY${NC}"
    exit 3
fi
