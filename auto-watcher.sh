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

# Použijeme inotifywait pro sledování změn
if ! command -v inotifywait &> /dev/null; then
    echo "📦 Instaluji inotify-tools pro sledování souborů..."
    sudo apt-get update && sudo apt-get install -y inotify-tools
fi

# Sledujeme změny v src/ adresáři
echo "👀 Sledování aktivní pro složku src/ ..."
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
            echo "💡 Pro commit+push spusť: npm run commit"
        else
            echo "❌ VALIDACE SELHALA - oprav chyby před commitem!"
        fi
        echo "────────────────────────────────────────────────────────────────────"
    fi
done
