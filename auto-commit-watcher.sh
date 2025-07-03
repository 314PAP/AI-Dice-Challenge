#!/bin/bash

# Auto-commit watcher skript pro AIDICE projekt
# Sleduje změny v projektu a automaticky je potvrzuje

# Funkce pro spuštění na pozadí
run_in_background() {
    echo "🚀 Spouštím skript na pozadí..."
    nohup "$0" --running > auto-commit-watcher.log 2>&1 &
    echo "✅ Skript běží na pozadí, sledujte výstup v souboru auto-commit-watcher.log"
    echo "   Pro ukončení použijte: pkill -f auto-commit-watcher.sh"
    exit 0
}

# Kontrola parametrů
if [[ "$1" == "--background" || "$1" == "-b" ]]; then
    run_in_background
fi

# Pokud je skript spuštěn s parametrem --running, přeskočíme dotaz
if [[ "$1" != "--running" ]]; then
    # Dotaz na potvrzení spuštění
    echo "🤖 Auto-commit watcher"
    echo "======================="
    echo "Tento skript bude sledovat změny v projektu a automaticky je commitovat."
    echo "Možnosti:"
    echo "  1) Spustit interaktivně (zůstane v popředí)"
    echo "  2) Spustit na pozadí (nohup)"
    echo "  3) Zrušit"
    read -p "Zadejte volbu [1-3]: " choice

    case $choice in
        1)
            echo "👁️ Spouštím sledování změn v popředí..."
            ;;
        2)
            run_in_background
            ;;
        *)
            echo "❌ Spuštění skriptu bylo zrušeno."
            exit 0
            ;;
    esac
fi

echo "👁️ Spouštím sledování změn pro automatické potvrzení..."

# Nastavíme interval kontroly (v sekundách)
INTERVAL=60

# Funkce pro kontrolu změn a jejich potvrzení
check_and_commit() {
    # Kontrolujeme, zda existují nepřidané nebo nepotvrzené změny
    if [[ -n "$(git status --porcelain)" ]]; then
        echo "🔄 Nalezeny změny, provádím automatické potvrzení..."
        
        # Spustíme auto-commit skript
        ./auto-commit.sh
        
        return 0
    else
        echo "✅ Žádné změny k potvrzení."
        return 1
    fi
}

# Nekonečná smyčka pro sledování změn
while true; do
    echo "🔍 Kontroluji změny... ($(date +"%H:%M:%S"))"
    
    # Kontrola a potvrzení změn
    check_and_commit
    
    echo "⏱️ Čekám $INTERVAL sekund před další kontrolou..."
    sleep $INTERVAL
done
