#!/bin/bash

# Automatické sledování souborů a commitování změn
# Toto je jednoduchý skript pro automatické commitování změn

INTERVAL=300  # Kontrolovat každých 5 minut

echo "🔄 Automatické sledování změn a commitování zapnuto"
echo "⏱️ Interval: $INTERVAL sekund"

while true; do
    # Zjistíme, jestli jsou nějaké změny k commitování
    if [[ -n $(git status --porcelain) ]]; then
        echo "📝 Nalezeny změny, spouštím CSS validaci..."
        
        # 🚨 CSS VALIDATION PŘED COMMITEM
        if ./css-validation.sh; then
            echo "✅ CSS validace prošla"
            
            # Přidáme všechny změny do stage
            git add .
            
            # Vytvoříme timestamp pro commit zprávu
            TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
            
            # Vytvoříme commit s časovou značkou
            git commit -m "🤖 Auto-commit: $TIMESTAMP [CSS-validated ✅]"
            
            echo "✅ Automatický commit vytvořen: $TIMESTAMP"
        else
            echo "❌ CSS validace selhala - commit přeskočen!"
            echo "🔧 Opravte CSS chyby pro pokračování auto-commitů"
        fi
    else
        echo "👍 Žádné změny k commitování ($(date '+%H:%M:%S'))"
    fi
    
    # Počkáme stanovený interval
    sleep $INTERVAL
done
