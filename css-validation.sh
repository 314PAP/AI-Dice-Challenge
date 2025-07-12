#!/bin/bash

# 🤖 SELF-VALIDATION SCRIPT - Spouští se před každým commitem
# Kontroluje dodržování CSS pravidel bez nutnosti manuálních připomínek

echo "🔍 Kontroluji dodržování CSS pravidel..."

# Funkce pro barevný výstup
red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }
yellow() { echo -e "\033[33m$1\033[0m"; }

# Proměnné pro chyby
ERRORS=0
WARNINGS=0

echo "════════════════════════════════════════════════"
echo "🚨 KRITICKÁ KONTROLA CSS PRAVIDEL"
echo "════════════════════════════════════════════════"

# 1. Kontrola inline stylů
echo "1️⃣ Kontroluji inline styly..."
INLINE_STYLES=$(find src/ -name "*.html" -o -name "*.js" | xargs grep -n 'style="' 2>/dev/null)
if [ ! -z "$INLINE_STYLES" ]; then
    red "❌ NALEZENY INLINE STYLY (ZAKÁZÁNO!):"
    echo "$INLINE_STYLES"
    ERRORS=$((ERRORS + 1))
else
    green "✅ Žádné inline styly nenalezeny"
fi

# 2. Kontrola vlastních CSS definic mimo povolené soubory
echo ""
echo "2️⃣ Kontroluji vlastní CSS mimo povolené soubory..."
CUSTOM_CSS=$(find src/ -name "*.css" ! -name "colors-bootstrap-simple.css" ! -name "responsive-bootstrap.css" ! -name "bootstrap-responsive-utils.css" ! -name "main.css" -exec grep -l "^[^/].*{" {} \; 2>/dev/null)
if [ ! -z "$CUSTOM_CSS" ]; then
    yellow "⚠️ NALEZENY MOŽNÉ VLASTNÍ CSS SOUBORY:"
    echo "$CUSTOM_CSS"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Vlastní CSS soubory v pořádku"
fi

# 3. Kontrola vlastních animací místo knihoven
echo ""
echo "3️⃣ Kontroluji vlastní animace (měly by být z knihoven)..."
CUSTOM_ANIMATIONS=$(find src/ -name "*.css" -exec grep -n "@keyframes\|animation:" {} \; | grep -v "neon-spin\|dice-idle" 2>/dev/null)
if [ ! -z "$CUSTOM_ANIMATIONS" ]; then
    yellow "⚠️ NALEZENY VLASTNÍ ANIMACE (preferuj knihovny):"
    echo "$CUSTOM_ANIMATIONS"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Animace jsou z povolených knihoven"
fi

# 4. Kontrola komplexnosti kódu (4652 řádků je MOC!)
echo ""
echo "4️⃣ Kontroluji komplexnost kódu..."
JS_LINES=$(find src/ -name "*.js" | xargs wc -l | tail -1 | awk '{print $1}')
if [ "$JS_LINES" -gt 3000 ]; then
    red "❌ PŘÍLIŠ MNOHO ŘÁDKŮ JS: $JS_LINES (max 3000 pro hru kostek!)"
    ERRORS=$((ERRORS + 1))
elif [ "$JS_LINES" -gt 2000 ]; then
    yellow "⚠️ Mnoho řádků JS: $JS_LINES (mělo by být méně pro jednoduchou hru)"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Počet řádků JS v pořádku: $JS_LINES"
fi

# 5. Kontrola JS knihoven (měly by být použity místo vlastního kódu)
echo ""
echo "5️⃣ Kontroluji použití JS knihoven..."
DEPENDENCIES=$(grep -c '"dependencies"' package.json 2>/dev/null || echo "0")
DEV_DEPS=$(grep -c '"devDependencies"' package.json 2>/dev/null || echo "0")
if [ "$DEPENDENCIES" -eq 0 ] && [ "$JS_LINES" -gt 2000 ]; then
    yellow "⚠️ Žádné runtime dependencies, ale $JS_LINES řádků - použij knihovny!"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Knihovny jsou použity nebo kód je krátký"
fi

# 6. Kontrola použití z-index mimo povolené hodnoty
echo ""
echo "3️⃣ Kontroluji z-index hodnoty..."
CUSTOM_ZINDEX=$(find src/ -name "*.css" -exec grep -n "z-index:" {} \; | grep -v "z-index: 1050\|z-index: 1000\|z-index: 1070\|z-index: 1055\|z-index: 9999" 2>/dev/null)
if [ ! -z "$CUSTOM_ZINDEX" ]; then
    yellow "⚠️ NALEZENY NEPOVOLENÉ Z-INDEX HODNOTY:"
    echo "$CUSTOM_ZINDEX"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Z-index hodnoty v pořádku"
fi

# 6. Kontrola použití z-index mimo povolené hodnoty
echo ""
echo "6️⃣ Kontroluji z-index hodnoty..."
CUSTOM_ZINDEX=$(find src/ -name "*.css" -exec grep -n "z-index:" {} \; | grep -v "z-index: 1050\|z-index: 1000\|z-index: 1070\|z-index: 1055\|z-index: 9999" 2>/dev/null)
if [ ! -z "$CUSTOM_ZINDEX" ]; then
    yellow "⚠️ NALEZENY NEPOVOLENÉ Z-INDEX HODNOTY:"
    echo "$CUSTOM_ZINDEX"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Z-index hodnoty v pořádku"
fi

# 7. Kontrola Bootstrap dokumentace usage
echo ""
echo "7️⃣ Kontroluji odkazy na Bootstrap dokumentaci..."
DOC_COMMENTS=$(grep -r "dokumentybtrap" src/ 2>/dev/null | wc -l)
if [ "$DOC_COMMENTS" -lt 1 ]; then
    yellow "⚠️ Málo odkazů na Bootstrap dokumentaci v kódu"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Bootstrap dokumentace je odkazována ($DOC_COMMENTS krát)"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "📊 VÝSLEDKY KONTROLY"
echo "════════════════════════════════════════════════"

if [ $ERRORS -gt 0 ]; then
    red "❌ NALEZENO $ERRORS KRITICKÝCH CHYB!"
    red "🛑 COMMIT ZAMÍTNUT - OPRAVTE CHYBY PŘED POKRAČOVÁNÍM"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    yellow "⚠️ Nalezeno $WARNINGS varování"
    yellow "💡 Doporučuji kontrolu, ale commit je povolen"
    exit 0
else
    green "✅ VŠECHNY KONTROLY PROŠŁY!"
    green "🚀 Commit může pokračovat"
    exit 0
fi
