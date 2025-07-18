#!/bin/bash

# 🎮 MASTER TEST RUNNER - KOMPLETNÍ TESTOVÁNÍ VŠECH ASPEKTŮ HRY
# ═════════════════════════════════════════════════════════════════════════════════════════

echo ""
echo "🎯 MASTER TEST RUNNER - AI DICE CHALLENGE"
echo "════════════════════════════════════════════════════════════════════════════════════"
echo ""

# Kontrola, že jsme ve správném adresáři
if [ ! -f "package.json" ]; then
    echo "❌ Nejste ve správném adresáři AI Dice Challenge projektu!"
    exit 1
fi

# Začátek času
START_TIME=$(date +%s)

# Funkce pro výpis času
print_time() {
    current_time=$(date +%s)
    elapsed=$((current_time - START_TIME))
    printf "⏱️  Čas: %02d:%02d " $((elapsed/60)) $((elapsed%60))
}

# Funkce pro výpis výsledků
print_result() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    print_time
    if [ "$result" = "PASS" ]; then
        echo "✅ ${test_name} - PROŠEL ${details}"
    elif [ "$result" = "FAIL" ]; then
        echo "❌ ${test_name} - SELHAL ${details}"
    else
        echo "⚠️  ${test_name} - ${result} ${details}"
    fi
}

# Inicializace statistik
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
ERROR_TESTS=0

# Funkce pro spuštění testu
run_test() {
    local test_name="$1"
    local test_command="$2"
    local is_critical="$3"
    
    echo ""
    print_time
    echo "🧪 Spouštím: $test_name"
    echo "────────────────────────────────────────────────────────────────────────────────"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Spuštění testu s timeout
    if timeout 300 bash -c "$test_command" > /tmp/test_output.log 2>&1; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        print_result "$test_name" "PASS" "$(cat /tmp/test_output.log | tail -1 | grep -o '[0-9]* testů\\|[0-9]* checks\\|[0-9]* kombinací' | head -1)"
    else
        local exit_code=$?
        if [ $exit_code -eq 124 ]; then
            ERROR_TESTS=$((ERROR_TESTS + 1))
            print_result "$test_name" "TIMEOUT" "(5 minut timeout)"
        else
            FAILED_TESTS=$((FAILED_TESTS + 1))
            print_result "$test_name" "FAIL" "$(cat /tmp/test_output.log | tail -1)"
        fi
        
        # Pokud je test kritický a selhal, zastavíme
        if [ "$is_critical" = "true" ]; then
            echo ""
            echo "🚨 KRITICKÝ TEST SELHAL - ZASTAVOVÁNÍ TESTOVÁNÍ"
            echo "────────────────────────────────────────────────────────────────────────────────"
            echo "📋 Podrobnosti chyby:"
            cat /tmp/test_output.log | tail -10
            echo ""
            exit 1
        fi
    fi
}

# Zobrazení hlavičky
echo "🎯 PLÁN TESTOVÁNÍ:"
echo "──────────────────────────────────────────────────────────────────────────────────"
echo "1. 🔧 Systémová validace (kritická)"
echo "2. 🎲 Herní logika a mechaniky"
echo "3. 🎮 UI komponenty a interakce"
echo "4. 🤖 AI a pokročilé funkce"
echo "5. 🌐 Bootstrap a CSS komponenty"
echo "6. 📊 Kompletní herní simulace"
echo ""

# =============================================================================
# FÁZE 1: SYSTÉMOVÁ VALIDACE (KRITICKÁ)
# =============================================================================

echo "🔧 FÁZE 1: SYSTÉMOVÁ VALIDACE"
echo "════════════════════════════════════════════════════════════════════════════════════"

run_test "Copilot System Verification" "./skripty/validace/verify-copilot-system.sh" "true"
run_test "CSS Validation" "./skripty/validace/smart-css-validation.sh" "true"

# =============================================================================
# FÁZE 2: HERNÍ LOGIKA A MECHANIKY
# =============================================================================

echo ""
echo "🎲 FÁZE 2: HERNÍ LOGIKA A MECHANIKY"
echo "════════════════════════════════════════════════════════════════════════════════════"

run_test "Farkle Comprehensive Tests" "node ./skripty/testy/test-farkle-comprehensive.js" "false"
run_test "Real Game Simulation" "node ./skripty/testy/test-real-game-simulation.js" "false"

# =============================================================================
# FÁZE 3: UI KOMPONENTY A INTERAKCE
# =============================================================================

echo ""
echo "🎮 FÁZE 3: UI KOMPONENTY A INTERAKCE"
echo "════════════════════════════════════════════════════════════════════════════════════"

run_test "Kompletní UI Interakce" "node ./skripty/testy/test-kompletni-ui-interakce.js" "false"
run_test "Interaktivní UI Testy" "node ./skripty/testy/test-interaktivni-ui.js" "false"

# =============================================================================
# FÁZE 4: AI A POKROČILÉ FUNKCE
# =============================================================================

echo ""
echo "🤖 FÁZE 4: AI A POKROČILÉ FUNKCE"
echo "════════════════════════════════════════════════════════════════════════════════════"

# Testování AI pouze pokud jsou základní testy úspěšné
if [ $FAILED_TESTS -eq 0 ]; then
    run_test "AI Chat System" "node ./skripty/testy/test-chat-system-debug.js" "false"
    run_test "Hot Dice Fix" "node ./skripty/testy/test-hot-dice-fix.js" "false"
else
    echo "⚠️  Přeskakuji AI testy kvůli chybám v základních testech"
fi

# =============================================================================
# FÁZE 5: BOOTSTRAP A CSS KOMPONENTY
# =============================================================================

echo ""
echo "🌐 FÁZE 5: BOOTSTRAP A CSS KOMPONENTY"
echo "════════════════════════════════════════════════════════════════════════════════════"

run_test "Bootstrap Grid System" "grep -r 'container-fluid\\|row\\|col-' src/ && echo 'Bootstrap grid OK'" "false"
run_test "Neon CSS Classes" "grep -r 'text-neon-\\|border-neon-\\|bg-neon-' src/ && echo 'Neon classes OK'" "false"
run_test "Forbidden Inline Styles" "! grep -r 'style=' src/ && echo 'No inline styles found'" "false"

# =============================================================================
# FÁZE 6: KOMPLETNÍ HERNÍ SIMULACE
# =============================================================================

echo ""
echo "📊 FÁZE 6: KOMPLETNÍ HERNÍ SIMULACE"
echo "════════════════════════════════════════════════════════════════════════════════════"

# Pouze pokud jsou všechny předchozí testy úspěšné
if [ $FAILED_TESTS -eq 0 ] && [ $ERROR_TESTS -eq 0 ]; then
    run_test "Extended Test Suite" "./skripty/testy/test-extended-suite.sh" "false"
    run_test "Game Functionality" "./skripty/testy/test-game-functionality.sh" "false"
else
    echo "⚠️  Přeskakuji kompletní simulaci kvůli chybám v předchozích testech"
fi

# =============================================================================
# VÝSLEDKY A STATISTIKY
# =============================================================================

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo ""
echo "🎯 CELKOVÉ VÝSLEDKY"
echo "════════════════════════════════════════════════════════════════════════════════════"
echo "📊 Celkem testů: $TOTAL_TESTS"
echo "✅ Úspěšné: $PASSED_TESTS"
echo "❌ Neúspěšné: $FAILED_TESTS"
echo "💥 Chyby: $ERROR_TESTS"

if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo "📈 Úspěšnost: ${SUCCESS_RATE}%"
fi

echo "⏱️  Celkový čas: $((TOTAL_TIME/60))m $((TOTAL_TIME%60))s"

# Výsledný status
if [ $FAILED_TESTS -eq 0 ] && [ $ERROR_TESTS -eq 0 ]; then
    echo ""
    echo "🎉 VŠECHNY TESTY ÚSPĚŠNÉ!"
    echo "════════════════════════════════════════════════════════════════════════════════════"
    echo "✅ Hra je plně funkční a připravená k použití"
    echo "🚀 Můžete pokračovat s dalším vývojem"
    echo "🎯 Kód je připraven pro produkci"
    echo ""
    echo "🎮 DOSTUPNÉ PŘÍKAZY:"
    echo "• npm run dev - spustit vývojový server"
    echo "• npm run build - build pro produkci"
    echo "• npm run test:all - znovu spustit všechny testy"
    echo "• npm run commit - validace + commit + push"
    echo ""
    exit 0
else
    echo ""
    echo "🚨 NĚKTERÉ TESTY SELHALY!"
    echo "════════════════════════════════════════════════════════════════════════════════════"
    echo "❌ Neúspěšné testy: $FAILED_TESTS"
    echo "💥 Chyby: $ERROR_TESTS"
    echo ""
    echo "🔧 DOPORUČENÉ KROKY:"
    echo "1. Zkontrolujte logy výše pro podrobnosti chyb"
    echo "2. Opravte identifikované problémy"
    echo "3. Spusťte znovu: npm run test:all"
    echo "4. Zkontrolujte konkrétní testy: npm run test:quick"
    echo ""
    exit 1
fi
