#!/bin/bash

# 🎲 AI DICE CHALLENGE - AUTOMATICKÝ FILE WATCHER
# ══════════════════════════════════════════════════

echo ""
echo "👁️ AUTOMATICKÝ SLEDOVÁNÍ ZMĚN - AI DICE CHALLENGE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Kontrola, že jsme v správném adresáři
if [ ! -f "package.json" ]; then
    echo "❌ Nejste ve správném adresáři projektu!"
    exit 1
fi

echo "🔍 Spouštím automatické sledování změn v kódu..."
echo "────────────────────────────────────────────────────────────────────"
echo "✨ AUTOMATICKY se spustí validace při každé změně souboru"
echo "💡 Pro commit+push stačí spustit: npm run commit"
echo ""

# Použijeme inotifywait pro sledování změn (nebo fallback na polling)
if ! command -v inotifywait &> /dev/null; then
    echo "⚠️ inotify-tools není nainstalován - používám jednoduché polling"
    echo "� Pro lepší výkon nainstalujte: sudo apt-get install inotify-tools"
    
    # Fallback - jednoduché polling každé 2 sekundy
    last_change=""
    while true; do
        current_change=$(find src/ -name "*.js" -o -name "*.css" -o -name "*.html" | xargs ls -lt | head -1)
        if [ "$current_change" != "$last_change" ]; then
            if [ -n "$last_change" ]; then
                echo ""
                echo "🔄 ZMĚNA DETEKOVÁNA"
                echo "────────────────────────────────────────────────────────────────────"
                
                # Spuštění automatické validace
                if ./css-validation.sh; then
                    echo "✅ VALIDACE ÚSPĚŠNÁ - kód je v pořádku!"
                    echo ""
                    echo "❓ CHCEŠ COMMITNOUT A PUSHNOUT ZMĚNY?"
                    echo "🔹 Stiskni ENTER pro commit+push, nebo Ctrl+C pro pokračování"
                    read -p "💬 " user_choice
                    
                    if [ -z "$user_choice" ]; then
                        echo "🚀 Spouštím commit+push..."
                        ./smart-commit.sh
                    else
                        echo "💡 Pokračuješ v programování..."
                    fi
                else
                    echo "❌ VALIDACE SELHALA - oprav chyby před commitem!"
                fi
                echo "────────────────────────────────────────────────────────────────────"
            fi
            last_change="$current_change"
        fi
        sleep 2
    done
else
    # Pokud je inotify dostupný, použijeme ho

else
    # Pokud je inotify dostupný, použijeme ho
    echo "👀 Sledování aktivní pro složku src/ (inotify)..."
    echo "────────────────────────────────────────────────────────────────────"

    inotifywait -m -r -e modify,create,delete,move --format '%w%f %e' src/ | while read file event; do
        # Ignoruj soubory, které nás nezajímají
        if [[ "$file" == *.js ]] || [[ "$file" == *.css ]] || [[ "$file" == *.html ]]; then
            echo ""
            echo "🔄 ZMĚNA DETEKOVÁNA: $file ($event)"
            echo "────────────────────────────────────────────────────────────────────"
            
            # Krátká pauza, aby se dokončily všechny změny
            sleep 1
            
            # Spuštění automatické validace
            if ./css-validation.sh; then
                echo "✅ VALIDACE ÚSPĚŠNÁ - kód je v pořádku!"
                echo ""
                echo "❓ CHCEŠ COMMITNOUT A PUSHNOUT ZMĚNY?"
                echo "🔹 Stiskni ENTER pro commit+push, nebo Ctrl+C pro pokračování"
                read -p "💬 " user_choice
                
                if [ -z "$user_choice" ]; then
                    echo "🚀 Spouštím commit+push..."
                    ./smart-commit.sh
                else
                    echo "💡 Pokračuješ v programování..."
                fi
            else
                echo "❌ VALIDACE SELHALA - oprav chyby před commitem!"
            fi
            echo "────────────────────────────────────────────────────────────────────"
        fi
    done
fi
