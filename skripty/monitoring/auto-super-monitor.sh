#!/bin/bash

# 🎲 AI DICE AUTO MONITOR - Spouští super test při změnách JS souborů
# Nahrazuje všechny staré monitoring skripty

echo "🚀 AI DICE AUTO MONITOR - Super Test Watcher"
echo "════════════════════════════════════════════════════════════════════"
echo "👁️ Hlídám změny JS souborů a spouštím super test..."
echo "📁 Monitoruji: src/**/*.js"
echo "🛠️ Test spustím při: změně JS souboru"
echo ""

# Kontrola inotifywait
if ! command -v inotifywait &> /dev/null; then
    echo "❌ inotifywait není nainstalován!"
    echo "💡 Nainstalujte: sudo apt-get install inotify-tools"
    exit 1
fi

# Kontrola super-test.sh
if [ ! -f "super-test.sh" ]; then
    echo "❌ super-test.sh neexistuje!"
    exit 1
fi

echo "✅ Monitoring aktivní - čekám na změny..."
echo "⌨️ Ukončení: Ctrl+C"
echo ""

# Nekonečná smyčka pro monitoring
while true; do
    # Čekání na změnu JS souboru
    CHANGED_FILE=$(inotifywait -r -e modify,move,create,delete --format '%w%f' src/ --include='.*\.js$' 2>/dev/null)
    
    if [ -n "$CHANGED_FILE" ]; then
        echo "🔄 Detekována změna: $CHANGED_FILE"
        echo "🧪 Spouštím super test..."
        echo "────────────────────────────────────────────────────────────────────"
        
        # Spustit super test
        if ./super-test.sh; then
            echo "────────────────────────────────────────────────────────────────────"
            echo "✅ Super test prošel! ✨"
            echo "⏰ $(date '+%H:%M:%S') - Čekám na další změny..."
            echo ""
        else
            echo "────────────────────────────────────────────────────────────────────"
            echo "❌ Super test selhal! ⚠️"
            echo "🔧 Opravte chyby a uložte soubor pro nový test"
            echo "⏰ $(date '+%H:%M:%S') - Čekám na opravu..."
            echo ""
        fi
    fi
done
