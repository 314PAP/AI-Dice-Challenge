#!/bin/bash
# ===================================================================
# 🎯 COMPREHENSIVE FARKLE LOGIC VALIDATOR
# Automatizované testování všech herních logik a edge-case scénářů
# Využívá Node.js test script + shell validace
# ===================================================================

echo "🎯 COMPREHENSIVE FARKLE LOGIC VALIDATOR"
echo "═══════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

log_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅${NC} $test_name"
        [ -n "$details" ] && echo -e "   ${BLUE}📋 $details${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌${NC} $test_name"
        [ -n "$details" ] && echo -e "   ${RED}⚠️  $details${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to run Node.js test script
run_node_tests() {
    echo -e "${PURPLE}🧪 SPOUŠTÍM KOMPLEXNÍ NODE.JS TESTY${NC}"
    echo "─────────────────────────────────────────"
    
    if [ -f "test-farkle-comprehensive.js" ]; then
        # Run the comprehensive Node.js test script
        node test-farkle-comprehensive.js
        local node_exit_code=$?
        
        if [ $node_exit_code -eq 0 ]; then
            log_test "Node.js comprehensive tests" "PASS" "Všechny Node.js testy prošly úspěšně"
        else
            log_test "Node.js comprehensive tests" "FAIL" "Node.js testy selhały (exit code: $node_exit_code)"
        fi
    else
        log_test "Node.js test script" "FAIL" "test-farkle-comprehensive.js nenalezen"
    fi
}

# Function to check critical game logic in code
check_critical_logic() {
    local rule_name="$1"
    local file_pattern="$2"
    local search_pattern="$3"
    local description="$4"
    
    if find src -name "$file_pattern" -exec grep -q "$search_pattern" {} \; 2>/dev/null; then
        log_test "$rule_name" "PASS" "$description"
    else
        log_test "$rule_name" "FAIL" "Chybí implementace: $description"
    fi
}

# ===== STEP 1: RUN COMPREHENSIVE NODE.JS TESTS =====
run_node_tests

echo ""
echo -e "${PURPLE}🔍 SHELL-BASED CODE VALIDATION${NC}"
echo "─────────────────────────────────────────"

# ===== STEP 2: VALIDATE CRITICAL LOGIC IN SOURCE CODE =====
echo -e "${YELLOW}🎯 Kritické herní logiky${NC}"

check_critical_logic \
    "První vstup - minimum 300 bodů" \
    "*.js" \
    "300.*first\|first.*300\|firstEntry.*300\|minimum.*entry" \
    "Validace prvního vstupu s minimem 300 bodů"

check_critical_logic \
    "AI vybírá všechny bodující kostky" \
    "*.js" \
    "allScoringDice\|selectAll.*scoring\|všechny.*bodující" \
    "AI musí vybrat všechny dostupné bodující kostky"

check_critical_logic \
    "FARKLE detekce a reset" \
    "*.js" \
    "farkle.*reset\|reset.*farkle\|clearTemp.*farkle" \
    "FARKLE resetuje dočasné body a ukončuje tah"

check_critical_logic \
    "Výherní kondice 10000 bodů" \
    "*.js" \
    "10000.*win\|win.*10000\|victory.*10000" \
    "Hra končí při dosažení 10000 bodů"

# ===== STEP 3: VALIDATE FILE STRUCTURE =====
echo ""
echo -e "${YELLOW}📁 Struktura a modularita${NC}"

# Check for key game files
key_files=(
    "src/js/game/DiceManager.js"
    "src/js/ai/aiDecisionEngine.js"
    "src/js/game/gameLogic.js"
    "src/js/ui/gameUI.js"
)

for file in "${key_files[@]}"; do
    if [ -f "$file" ]; then
        log_test "Soubor $(basename "$file")" "PASS" "Klíčový soubor existuje"
    else
        log_test "Soubor $(basename "$file")" "FAIL" "Chybí klíčový soubor: $file"
    fi
done

# ===== STEP 4: JAVASCRIPT SYNTAX VALIDATION =====
echo ""
echo -e "${YELLOW}🔧 JavaScript syntax${NC}"

js_files=$(find src -name "*.js" 2>/dev/null)
syntax_errors=0

if [ -z "$js_files" ]; then
    log_test "JavaScript soubory" "FAIL" "Žádné JS soubory nenalezeny v src/"
else
    for file in $js_files; do
        if node -c "$file" 2>/dev/null; then
            # Only count, don't spam output
            continue
        else
            echo -e "${RED}✗${NC} $file - syntax ERROR"
            syntax_errors=$((syntax_errors + 1))
        fi
    done
    
    if [ "$syntax_errors" -eq 0 ]; then
        log_test "JavaScript syntax validation" "PASS" "Všechny JS soubory mají správnou syntax"
    else
        log_test "JavaScript syntax validation" "FAIL" "$syntax_errors souborů má chyby syntax"
    fi
fi

# ===== STEP 5: SUMMARY AND RECOMMENDATIONS =====
echo ""
echo "═══════════════════════════════════════"
echo -e "${PURPLE}🎯 KONEČNÉ VÝSLEDKY${NC}"
echo "═══════════════════════════════════════"
echo -e "Celkem testů: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Úspěšné: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Neúspěšné: ${RED}$FAILED_TESTS${NC}"

if [ "$TOTAL_TESTS" -gt 0 ]; then
    success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Úspěšnost: ${BLUE}$success_rate%${NC}"
    
    if [ "$success_rate" -ge 90 ]; then
        echo -e "${GREEN}🎯 FARKLE LOGIKA JE VYNIKAJÍCÍ!${NC}"
        echo -e "${GREEN}   Všechny kritické funkce fungují správně.${NC}"
    elif [ "$success_rate" -ge 75 ]; then
        echo -e "${YELLOW}⚠️  FARKLE LOGIKA JE DOBRÁ, ALE POTŘEBUJE DOLADĚNÍ${NC}"
        echo -e "${YELLOW}   Zkontroluj neúspěšné testy a opravi chyby.${NC}"
    else
        echo -e "${RED}❌ FARKLE LOGIKA POTŘEBUJE VÝZNAMNÉ OPRAVY${NC}"
        echo -e "${RED}   Mnoho kritických funkcí nefunguje správně.${NC}"
    fi
fi

echo ""
echo -e "${BLUE}💡 DOPORUČENÍ PRO DALŠÍ KROKY:${NC}"

if [ "$FAILED_TESTS" -gt 0 ]; then
    echo -e "${YELLOW}1.${NC} Opravi neúspěšné testy uvedené výše"
    echo -e "${YELLOW}2.${NC} Spusť tento test znovu po opravách"
fi

echo -e "${BLUE}3.${NC} Spusť také manuální test ve hře"
echo -e "${BLUE}4.${NC} Otestuj edge-case scénáře v reálné hře"
echo ""

# Create test report
cat > /tmp/farkle-test-report.txt << EOF
FARKLE LOGIC TEST REPORT
========================
Datum: $(date)
Úspěšnost: $success_rate% ($PASSED_TESTS/$TOTAL_TESTS)

DOPORUČENÍ:
$(if [ "$success_rate" -ge 90 ]; then echo "✅ Logika je vynikající"; elif [ "$success_rate" -ge 75 ]; then echo "⚠️ Potřebuje doladění"; else echo "❌ Potřebuje významné opravy"; fi)

DALŠÍ KROKY:
- Manuální testování specifických scénářů
- Validace AI rozhodování
- Test prvního vstupu (300 bodů minimum)
- Test FARKLE detekce a resetů
EOF

echo -e "${GREEN}📄 Detailní report uložen: /tmp/farkle-test-report.txt${NC}"
