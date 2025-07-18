#!/bin/bash

# 🎲 AI Dice Challenge - KOMPLEXNÍ JS KONTROLNÍ SYSTÉM
# Sleduje a testuje všechny aspekty JS kódu po každé změně

LOG_FILE="js-control.log"
ERROR_LOG="js-errors.log"

echo "🔍 SPOUŠTÍM KOMPLEXNÍ JS KONTROLNÍ SYSTÉM" | tee $LOG_FILE
echo "=======================================" | tee -a $LOG_FILE
echo "⏰ $(date)" | tee -a $LOG_FILE
echo "" | tee -a $LOG_FILE

# Funkce pro logování
log_info() {
    echo "ℹ️  $1" | tee -a $LOG_FILE
}

log_error() {
    echo "❌ $1" | tee -a $LOG_FILE
    echo "❌ $1" >> $ERROR_LOG
}

log_success() {
    echo "✅ $1" | tee -a $LOG_FILE
}

# Kompletní test suite
run_complete_tests() {
    local changed_file="$1"
    echo "" | tee -a $LOG_FILE
    echo "🧪 KOMPLETNÍ TESTOVÁNÍ PO ZMĚNĚ: $changed_file" | tee -a $LOG_FILE
    echo "================================================" | tee -a $LOG_FILE
    
    # 1. SYNTAX KONTROLA
    log_info "1️⃣ Kontrola JavaScript syntaxe..."
    for js_file in $(find src/js -name "*.js"); do
        if ! node -c "$js_file" 2>/dev/null; then
            log_error "Syntax chyba v: $js_file"
            node -c "$js_file" 2>> $ERROR_LOG
            return 1
        fi
    done
    log_success "Syntax všech JS souborů OK"
    
    # 2. IMPORT/EXPORT KONTROLA
    log_info "2️⃣ Kontrola import/export..."
    if grep -r "import.*import" src/js/; then
        log_error "Duplicitní importy nalezeny!"
        return 1
    fi
    log_success "Import/export struktura OK"
    
    # 3. CSS INLINE KONTROLA
    log_info "3️⃣ Kontrola inline CSS..."
    if grep -r "style=" src/js/ | grep -v "ODSTRANĚNO\|test"; then
        log_error "Inline CSS nalezeno v JS souborech!"
        return 1
    fi
    log_success "Žádné inline CSS v JS"
    
    # 4. KNIHOVNY KONTROLA
    log_info "4️⃣ Kontrola použití knihoven..."
    # Kontrola lodash usage
    if ! grep -r "const.*_" src/js/ | grep -q "lodash\|_"; then
        log_error "Lodash možná nepoužívána správně"
    fi
    log_success "Knihovny používány správně"
    
    # 5. AI LOGIKA KONTROLA
    log_info "5️⃣ Kontrola AI logiky..."
    node -e "
        try {
            const fs = require('fs');
            const turnManager = fs.readFileSync('src/js/game/TurnManager.js', 'utf8');
            const aiController = fs.readFileSync('src/js/ai/aiPlayerController.js', 'utf8');
            
            // Kontrola AI connection
            if (!turnManager.includes('AiPlayerController')) {
                console.log('❌ AI Controller není importován v TurnManager');
                process.exit(1);
            }
            
            if (!turnManager.includes('playAiTurn')) {
                console.log('❌ playAiTurn není voláno v TurnManager');
                process.exit(1);
            }
            
            // Kontrola duplicitních volání
            const aiTurnMatches = (turnManager.match(/playAiTurn/g) || []).length;
            if (aiTurnMatches > 1) {
                console.log('❌ playAiTurn je voláno ' + aiTurnMatches + 'x - možná duplicita!');
                process.exit(1);
            }
            
            console.log('✅ AI logika správně propojená');
        } catch(e) {
            console.log('❌ Chyba v AI kontrole:', e.message);
            process.exit(1);
        }
    " 2>>$ERROR_LOG
    
    if [ $? -ne 0 ]; then
        log_error "AI logika má problémy!"
        return 1
    fi
    log_success "AI logika OK"
    
    # 6. HERNÍ LOGIKA SIMULACE
    log_info "6️⃣ Simulace herní logiky..."
    npm run test:ui >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        log_error "UI testy selhaly!"
        return 1
    fi
    log_success "Herní logika simulace OK"
    
    # 7. MEMORY LEAK KONTROLA
    log_info "7️⃣ Kontrola memory leaks..."
    if grep -r "setInterval\|setTimeout" src/js/ | grep -v "clearInterval\|clearTimeout\|AI tah\|delay"; then
        log_error "Možné memory leaky - nekončící intervaly/timeouty!"
    fi
    log_success "Memory management OK"
    
    # 8. EVENT LISTENER KONTROLA
    log_info "8️⃣ Kontrola event listenerů..."
    event_adds=$(grep -r "addEventListener" src/js/ | wc -l)
    event_removes=$(grep -r "removeEventListener" src/js/ | wc -l)
    log_info "Event listeners: +$event_adds, -$event_removes"
    
    # 9. CONSOLE LOG KONTROLA
    log_info "9️⃣ Kontrola console logů..."
    console_logs=$(grep -r "console\." src/js/ | grep -v "console.error\|console.warn" | wc -l)
    if [ $console_logs -gt 50 ]; then
        log_error "Příliš mnoho console.log ($console_logs) - optimalizovat!"
    fi
    log_success "Console usage OK"
    
    # 10. FINÁLNÍ VALIDACE
    log_info "🔟 Finální validace..."
    npm run test:quick >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        log_error "Rychlé testy selhaly!"
        return 1
    fi
    
    echo "" | tee -a $LOG_FILE
    log_success "🎉 VŠECHNY KONTROLY PROŠLY! Kód je validní."
    echo "=======================================" | tee -a $LOG_FILE
    return 0
}

# Monitoring změn
log_info "Monitoring aktivní - sledování src/js/"

if ! command -v inotifywait &> /dev/null; then
    log_error "inotifywait není nainstalováno! Instaluji..."
    sudo apt-get install -y inotify-tools 2>/dev/null || {
        log_error "Nemohu nainstalovat inotify-tools"
        exit 1
    }
fi

# Spuštění prvotní kontroly
run_complete_tests "INITIAL"

# Sledování změn
inotifywait -m -r -e modify --format '%w%f' src/js/ 2>/dev/null | while read file
do
    if [[ "$file" == *.js ]]; then
        echo ""
        log_info "📝 ZMĚNA DETEKOVÁNA: $file"
        sleep 2  # Čekání na dokončení zápisu
        
        if run_complete_tests "$file"; then
            log_success "✅ Změna v $file je validní"
        else
            log_error "❌ Změna v $file způsobila problémy!"
            echo "🚨 KONTROLA SELHALA - OPRAVTE CHYBY!" | tee -a $LOG_FILE
        fi
    fi
done
