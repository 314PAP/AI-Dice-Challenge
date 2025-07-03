#!/bin/bash

# Jednoduchý skript pro spuštění auto-commit-watcheru

# Zajistíme, že oba skripty jsou spustitelné
chmod +x auto-commit-watcher.sh
chmod +x auto-commit.sh

# Spustíme auto-commit-watcher na pozadí
./auto-commit-watcher.sh --background

echo "✅ Auto-commit watcher byl spuštěn na pozadí"
echo "📝 Výstup je přesměrován do souboru auto-commit-watcher.log"
echo "🛑 Pro ukončení použijte: pkill -f auto-commit-watcher.sh"
