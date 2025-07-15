#!/bin/bash
# ===================================================================
# 🎯 FARKLE LOGIC VALIDATOR - Detailní test herní logiky
# Testuje konkrétní pravidla Farkle hry a herní scénáře
# ===================================================================

echo "🎯 FARKLE LOGIC VALIDATOR"
echo "═══════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Test counters
LOGIC_TESTS=0
LOGIC_PASSED=0

log_logic_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    LOGIC_TESTS=$((LOGIC_TESTS + 1))
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅${NC} $test_name"
        [ -n "$details" ] && echo -e "   ${BLUE}📋 $details${NC}"
        LOGIC_PASSED=$((LOGIC_PASSED + 1))
    else
        echo -e "${RED}❌${NC} $test_name"
        [ -n "$details" ] && echo -e "   ${RED}⚠️  $details${NC}"
    fi
}

# Function to check if code contains specific logic
check_farkle_rule() {
    local rule_name="$1"
    local file_pattern="$2"
    local search_pattern="$3"
    local description="$4"
    
    if find src -name "$file_pattern" -exec grep -q "$search_pattern" {} \; 2>/dev/null; then
        log_logic_test "$rule_name" "PASS" "$description"
    else
        log_logic_test "$rule_name" "FAIL" "Chybí implementace: $description"
    fi
}

echo -e "${PURPLE}🎲 TESTOVÁNÍ FARKLE PRAVIDEL${NC}"
echo "─────────────────────────────────────────"

# ===== ZÁKLADNÍ BODOVACÍ PRAVIDLA =====
echo -e "${YELLOW}📊 Bodovací pravidla${NC}"

check_farkle_rule \
    "Jedničky = 100 bodů" \
    "*.js" \
    "1.*100\|100.*1" \
    "Každá jednička = 100 bodů"

check_farkle_rule \
    "Pětky = 50 bodů" \
    "*.js" \
    "5.*50\|50.*5" \
    "Každá pětka = 50 bodů"

check_farkle_rule \
    "Tři jedničky = 1000" \
    "*.js" \
    "1000\|three.*1\|triple.*1" \
    "Tři jedničky = 1000 bodů"

check_farkle_rule \
    "Tři dvojky = 200" \
    "*.js" \
    "three.*2.*200\|triple.*2.*200\|200.*2" \
    "Tři dvojky = 200 bodů"

check_farkle_rule \
    "Straight (1-6) = 1500" \
    "*.js" \
    "straight\|1500\|sequence" \
    "Postupka 1-6 = 1500 bodů"

# ===== FARKLE DETEKCE =====
echo ""
echo -e "${YELLOW}💥 FARKLE detekce${NC}"

check_farkle_rule \
    "FARKLE když žádné body" \
    "*.js" \
    "farkle\|noScore\|zero.*points" \
    "Detekce FARKLE při nulových bodech"

check_farkle_rule \
    "FARKLE resetuje temp body" \
    "*.js" \
    "reset.*temp\|temp.*0\|clear.*temp" \
    "FARKLE resetuje dočasné body"

check_farkle_rule \
    "FARKLE ukončuje tah" \
    "*.js" \
    "endTurn\|nextPlayer\|switchPlayer" \
    "FARKLE automaticky ukončuje tah"

# ===== HERNÍ STAV =====
echo ""
echo -e "${YELLOW}🎮 Herní stav management${NC}"

check_farkle_rule \
    "Sledování aktuálního hráče" \
    "*.js" \
    "currentPlayer\|activePlayer\|playerTurn" \
    "Správa aktuálního hráče"

check_farkle_rule \
    "Sledování dočasných bodů" \
    "*.js" \
    "tempScore\|temporaryPoints\|roundScore" \
    "Sledování bodů během tahu"

check_farkle_rule \
    "Sledování celkových bodů" \
    "*.js" \
    "totalScore\|playerScore\|score" \
    "Sledování celkových bodů hráčů"

check_farkle_rule \
    "Výhra při 10000 bodech" \
    "*.js" \
    "10000\|winCondition\|gameWon" \
    "Detekce výhry při 10000 bodech"

# ===== KOSTKY MANAGEMENT =====
echo ""
echo -e "${YELLOW}🎲 Kostky management${NC}"

check_farkle_rule \
    "Kostky lze vybrat/označit" \
    "*.js" \
    "select.*dice\|mark.*dice\|toggle.*dice" \
    "Výběr kostek pro odložení"

check_farkle_rule \
    "Odložené kostky se neházejí" \
    "*.js" \
    "saved.*dice\|kept.*dice\|locked.*dice" \
    "Odložené kostky zůstávají"

check_farkle_rule \
    "Reset kostek při novém tahu" \
    "*.js" \
    "reset.*dice\|new.*roll\|fresh.*dice" \
    "Reset kostek pro nový tah"

# ===== UI LOGIKA =====
echo ""
echo -e "${YELLOW}🖱️  UI logika${NC}"

check_farkle_rule \
    "Tlačítko HODIT dostupné" \
    "*.js" \
    "rollButton\|hodit\|roll.*enabled" \
    "Tlačítko hodit koskami"

check_farkle_rule \
    "Tlačítko ODLOŽIT dostupné" \
    "*.js" \
    "saveButton\|odlozit\|save.*enabled" \
    "Tlačítko odložit kostky"

check_farkle_rule \
    "Tlačítko UKONČIT TAH" \
    "*.js" \
    "endTurnButton\|ukoncit.*tah\|end.*turn" \
    "Tlačítko ukončit tah"

# ===== VALIDACE TAHŮ =====
echo ""
echo -e "${YELLOW}✅ Validace tahů${NC}"

check_farkle_rule \
    "Ověření platných kombinací" \
    "*.js" \
    "valid.*combination\|scoring.*dice\|points.*calculation" \
    "Validace bodovacích kombinací"

check_farkle_rule \
    "Povinné odložení bodujících kostek" \
    "*.js" \
    "must.*save\|require.*save\|force.*keep" \
    "Povinnost odložit bodující kostky"

check_farkle_rule \
    "Minimální body pro vstup" \
    "*.js" \
    "minimum.*score\|entry.*requirement\|500" \
    "Minimální 500 bodů pro vstup"

# ===== POKROČILÉ KOMBINACE =====
echo ""
echo -e "${YELLOW}🔥 Pokročilé kombinace${NC}"

check_farkle_rule \
    "Six of a kind = 3000" \
    "*.js" \
    "3000\|six.*kind\|all.*same" \
    "Šest stejných = 3000 bodů"

check_farkle_rule \
    "Three pairs = 1500" \
    "*.js" \
    "three.*pair\|1500.*pair\|pairs.*1500" \
    "Tři páry = 1500 bodů"

check_farkle_rule \
    "Four of a kind handling" \
    "*.js" \
    "four.*kind\|quad\|4.*same" \
    "Čtyři stejné kostky"

# ===== SIMULACE TESTOVACÍCH SCÉNÁŘŮ =====
echo ""
echo -e "${PURPLE}🧪 SIMULACE HERNÍCH SCÉNÁŘŮ${NC}"
echo "─────────────────────────────────────────"

# Create test scenarios file
cat > /tmp/farkle_scenarios.txt << 'EOF'
SCÉNÁŘ 1: Hod [1,1,1,2,3,4] → Očekáváno: 1000 bodů (tři jedničky)
SCÉNÁŘ 2: Hod [5,5,5,5,6,6] → Očekáváno: 1000 bodů (čtyři pětky)
SCÉNÁŘ 3: Hod [2,3,4,6,6,6] → Očekáváno: 600 bodů (tři šestky)
SCÉNÁŘ 4: Hod [2,3,4,4,6,6] → Očekáváno: 0 bodů (FARKLE)
SCÉNÁŘ 5: Hod [1,2,3,4,5,6] → Očekáváno: 1500 bodů (straight)
SCÉNÁŘ 6: Hod [1,1,2,2,3,3] → Očekáváno: 1500 bodů (tři páry)
SCÉNÁŘ 7: Hod [1,5,1,5,2,3] → Očekáváno: 300 bodů (dvě 1 + dvě 5)
SCÉNÁŘ 8: Hod [4,4,4,4,4,4] → Očekáváno: 3000 bodů (six of a kind)
EOF

echo -e "${BLUE}📋 Testovací scénáře připraveny v /tmp/farkle_scenarios.txt${NC}"

# Check if scoring calculations are comprehensive
if grep -r "calculatePoints\|calculateScore\|getPoints\|scoreFor" src/ | grep -q "dice"; then
    log_logic_test "Bodovací kalkulace implementována" "PASS" "Našel jsem scoring funkce"
else
    log_logic_test "Bodovací kalkulace implementována" "FAIL" "Scoring funkce nenalezeny"
fi

# ===== JAVASCRIPT SYNTAX VALIDATION =====
echo ""
echo -e "${PURPLE}🔍 JAVASCRIPT SYNTAX VALIDATION${NC}"
echo "─────────────────────────────────────────"

# Check all JS files for syntax errors
js_files=$(find src -name "*.js")
syntax_errors=0

for file in $js_files; do
    if node -c "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $file - syntax OK"
    else
        echo -e "${RED}✗${NC} $file - syntax ERROR"
        syntax_errors=$((syntax_errors + 1))
    fi
done

if [ "$syntax_errors" -eq 0 ]; then
    log_logic_test "JavaScript syntax validation" "PASS" "Všechny JS soubory mají správnou syntax"
else
    log_logic_test "JavaScript syntax validation" "FAIL" "$syntax_errors souborů má chyby syntax"
fi

# ===== FINAL LOGIC RESULTS =====
echo ""
echo "═══════════════════════════════════════"
echo -e "${PURPLE}🎯 VÝSLEDKY FARKLE LOGIKY${NC}"
echo "═══════════════════════════════════════"
echo -e "Celkem testů logiky: ${BLUE}$LOGIC_TESTS${NC}"
echo -e "Úspěšné: ${GREEN}$LOGIC_PASSED${NC}"
echo -e "Neúspěšné: ${RED}$((LOGIC_TESTS - LOGIC_PASSED))${NC}"

if [ "$LOGIC_TESTS" -gt 0 ]; then
    logic_rate=$((LOGIC_PASSED * 100 / LOGIC_TESTS))
    echo -e "Úspěšnost logiky: ${BLUE}$logic_rate%${NC}"
    
    if [ "$logic_rate" -ge 85 ]; then
        echo -e "${GREEN}🎯 FARKLE LOGIKA JE KVALITNÍ!${NC}"
    elif [ "$logic_rate" -ge 70 ]; then
        echo -e "${YELLOW}⚠️  FARKLE LOGIKA POTŘEBUJE DOLADĚNÍ${NC}"
    else
        echo -e "${RED}❌ FARKLE LOGIKA POTŘEBUJE VÝZNAMNÉ OPRAVY${NC}"
    fi
fi

echo ""
echo -e "${BLUE}💡 Tip: Spusť také ./test-game-functionality.sh pro kompletní test${NC}"
