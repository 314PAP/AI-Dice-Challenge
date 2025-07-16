#!/bin/bash

# 🎲 AI DICE CHALLENGE - SMART CSS VALIDACE
# Kontroluje celý projekt + blokuje jen nové chyby
# ══════════════════════════════════════════════════

echo "🔍 SMART VALIDACE - AI DICE CHALLENGE"
echo "════════════════════════════════════════════════"
echo "✅ Kontroluje celý projekt pro přehled"
echo "🚫 Blokuje pouze NOVÉ chyby v změnách"
echo ""

# Kontrola, že jsme v git repository
if [ ! -d ".git" ]; then
    echo "❌ Nejste v git repository!"
    exit 1
fi

# Získání změněných souborů
CHANGED_FILES=$(git diff --name-only HEAD)
STAGED_FILES=$(git diff --cached --name-only)
ALL_CHANGED_FILES="$CHANGED_FILES $STAGED_FILES"

echo "📋 ZMĚNĚNÉ SOUBORY:"
echo "────────────────────────────────────────────────"
if [ -z "$ALL_CHANGED_FILES" ]; then
    echo "ℹ️  Žádné změny k validaci"
    exit 0
else
    echo "$ALL_CHANGED_FILES" | tr ' ' '\n' | sort -u | grep -E '\.(js|css|html)$' || echo "ℹ️  Žádné relevantní změny"
fi

echo ""
echo "🔍 1️⃣ KOMPLETNÍ PŘEHLED PROJEKTU:"
echo "════════════════════════════════════════════════"

CRITICAL_ERRORS=0

# 1. Kontrola inline stylů (celý projekt)
echo "🔍 Inline styly (celý projekt)..."
INLINE_STYLES=$(find src/ -name "*.html" -o -name "*.js" | xargs grep -n 'style="' 2>/dev/null || true)
if [ -n "$INLINE_STYLES" ]; then
    echo "⚠️ NALEZENY INLINE STYLY:"
    echo "$INLINE_STYLES"
else
    echo "✅ Žádné inline styly"
fi

# 2. Kontrola vlastních CSS souborů
echo ""
echo "🔍 Vlastní CSS soubory..."
# POVOLENÉ CSS SOUBORY: main.css + modularizovaná struktura + archivované
ALLOWED_CSS_PATTERN="(main\.css|colors-bootstrap-simple\.css|base/|components/|utilities/|themes/|archive/)"
OWN_CSS=$(find src/styles/ -name "*.css" | grep -v -E "$ALLOWED_CSS_PATTERN" || true)
if [ -n "$OWN_CSS" ]; then
    echo "⚠️ NEPOVOLENÉ CSS SOUBORY:"
    echo "$OWN_CSS"
else
    echo "✅ Pouze povolené CSS soubory (modularizovaná struktura)"
fi

# 3. Kontrola komplexnosti JS (celý projekt)
echo ""
echo "🔍 Komplexnost JavaScript kódu..."
JS_LINES=$(find src/ -name "*.js" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
echo "📊 Celkem řádků JS: $JS_LINES"
if [ "$JS_LINES" -gt 3000 ]; then
    echo "⚠️ PŘEKROČEN LIMIT: $JS_LINES řádků (max 3000)"
    echo "💡 POZNÁMKA: Starý problém - neblokuje commit nových změn"
else
    echo "✅ JS kód pod limitem"
fi

echo ""
echo "🔍 2️⃣ VALIDACE NOVÝCH ZMĚN:"
echo "════════════════════════════════════════════════"

# Kontrola nových změn
NEW_ERRORS=0

for file in $ALL_CHANGED_FILES; do
    if [[ "$file" =~ \.(js|css|html)$ ]] && [ -f "$file" ]; then
        echo "🔍 Kontroluji nové změny v: $file"
        
        # Kontrola inline stylů v nových změnách
        if git diff HEAD "$file" | grep -q 'style="'; then
            echo "❌ NOVÁ CHYBA: Inline styly v $file"
            NEW_ERRORS=$((NEW_ERRORS + 1))
        fi
        
        # Kontrola nových vlastních CSS - nyní podporuje modularizovanou strukturu
        if [[ "$file" =~ \.css$ ]] && [[ ! "$file" =~ (main\.css|colors-bootstrap-simple\.css|base/|components/|utilities/|themes/|archive/) ]]; then
            if git diff HEAD "$file" | grep -q '^+'; then
                echo "❌ NOVÁ CHYBA: Nepovolený CSS soubor $file (použij modularizovanou strukturu)"
                NEW_ERRORS=$((NEW_ERRORS + 1))
            fi
        fi
        
        # Kontrola nových z-index hodnot (povolené jsou CSS proměnné)
        if git diff HEAD "$file" | grep '^+' | grep 'z-index:' | grep -v 'var(--z-' | grep -q .; then
            echo "❌ NOVÁ CHYBA: Nový z-index v $file (použij CSS proměnné --z-*)"
            NEW_ERRORS=$((NEW_ERRORS + 1))
        fi
    fi
done

if [ "$NEW_ERRORS" -eq 0 ]; then
    echo "✅ Žádné nové chyby v změnách!"
else
    echo "❌ Nalezeno $NEW_ERRORS nových chyb!"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "📊 VÝSLEDKY SMART VALIDACE"
echo "════════════════════════════════════════════════"

if [ "$NEW_ERRORS" -eq 0 ]; then
    echo "🎉 COMMIT POVOLEN!"
    echo "✅ Nové změny jsou v pořádku"
    echo "💡 Starý kód může mít problémy, ale neblokují commit"
    echo ""
    echo "📊 CELKOVÝ STAV PROJEKTU:"
    echo "• JS řádky: $JS_LINES (limit 3000)"
    echo "• Nové chyby: $NEW_ERRORS"
    echo ""
    exit 0
else
    echo "🛑 COMMIT ZAMÍTNUT!"
    echo "❌ Nové změny obsahují $NEW_ERRORS chyb"
    echo "🔧 Opravte nové chyby a zkuste znovu"
    echo ""
    exit 1
fi
