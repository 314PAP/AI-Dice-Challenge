#!/bin/bash

# Auto-commit watcher skript pro AIDICE projekt
# Sleduje změny v projektu a automaticky je potvrzuje

# Dotaz na potvrzení spuštění
echo "🤖 Auto-commit watcher"
echo "======================="
echo "Tento skript bude sledovat změny v projektu a automaticky je commitovat."
read -p "Chcete spustit sledování změn? (y/n): " confirmation

# Převod odpovědi na malá písmena pro lepší porovnání
confirmation=$(echo "$confirmation" | tr '[:upper:]' '[:lower:]')

# Kontrola odpovědi
if [[ "$confirmation" != "y" && "$confirmation" != "yes" ]]; then
    echo "❌ Spuštění skriptu bylo zrušeno."
    exit 0
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
