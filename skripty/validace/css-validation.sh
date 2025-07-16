#!/bin/bash

# 🤖 MODERNIZOVANÝ VALIDATION SCRIPT - Upraveno pro současnou strukturu projektu
# Kontroluje dodržování CSS pravidel bez falešných poplachů

echo "🔍 Kontroluji dodržování CSS pravidel..."

# Funkce pro barevný výstup
red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }
yellow() { echo -e "\033[33m$1\033[0m"; }

# Proměnné pro chyby
ERRORS=0
WARNINGS=0

echo "════════════════════════════════════════════════"
echo "🚨 MODERNIZOVANÁ KONTROLA CSS PRAVIDEL"
echo "════════════════════════════════════════════════"

# 1. Kontrola inline stylů (KRITICKÁ)
echo "1️⃣ Kontroluji inline styly..."
INLINE_STYLES=$(find src/ index.html -name "*.html" -o -name "*.js" | xargs grep -n 'style="' 2>/dev/null | grep -v "debug\|console\|test")
if [ ! -z "$INLINE_STYLES" ]; then
    red "❌ NALEZENY INLINE STYLY (ZAKÁZÁNO!):"
    echo "$INLINE_STYLES"
    ERRORS=$((ERRORS + 1))
else
    green "✅ Žádné inline styly nenalezeny"
fi

# 2. Kontrola modularního CSS systému (INFO ONLY)
echo ""
echo "2️⃣ Kontroluji modularní CSS strukturu..."
if [ -f "src/styles/main.css" ]; then
    green "✅ Hlavní CSS soubor existuje (src/styles/main.css)"
    CSS_MODULES=$(find src/styles/ -name "*.css" | wc -l)
    yellow "ℹ️ Nalezeno $CSS_MODULES CSS modulů (modularní architektura)"
else
    yellow "⚠️ Hlavní CSS soubor nebyl nalezen"
    WARNINGS=$((WARNINGS + 1))
fi

# 3. Kontrola použití knihoven pro animace (INFO ONLY)
echo ""
echo "3️⃣ Kontroluji animační knihovny..."
ANIMATION_LIBS=$(grep -c "animate.css\|magic.css\|hover.css\|csshake" index.html 2>/dev/null || echo "0")
if [ "$ANIMATION_LIBS" -gt 0 ]; then
    green "✅ Nalezeno $ANIMATION_LIBS animačních knihoven v HTML"
else
    yellow "ℹ️ Žádné animační knihovny nenalezeny v HTML (možná jsou v modulech)"
fi

# 4. Kontrola komplexnosti kódu (ROZUMNÁ KONTROLA)
echo ""
echo "4️⃣ Kontroluji komplexnost kódu..."
JS_LINES=$(find src/ -name "*.js" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
if [ "$JS_LINES" -gt 10000 ]; then
    yellow "⚠️ Vysoký počet řádků JS: $JS_LINES (zvažte refaktoring)"
    WARNINGS=$((WARNINGS + 1))
else
    green "✅ Počet řádků JS v rozumných mezích: $JS_LINES"
fi

# 5. Kontrola JS knihoven (MODERNÍ PŘÍSTUP)
echo ""
echo "5️⃣ Kontroluji použití knihoven..."
LODASH_CHECK=$(grep -c "lodash" index.html 2>/dev/null || echo "0")
BOOTSTRAP_CHECK=$(grep -c "bootstrap" index.html 2>/dev/null || echo "0")
if [ "$LODASH_CHECK" -gt 0 ] && [ "$BOOTSTRAP_CHECK" -gt 0 ]; then
    green "✅ Klíčové knihovny (Lodash, Bootstrap) jsou načteny"
else
    yellow "ℹ️ Kontrola knihoven: Lodash($LODASH_CHECK), Bootstrap($BOOTSTRAP_CHECK)"
fi

# 6. Kontrola neon CSS tříd (PROJEKT-SPECIFICKÉ)
echo ""
echo "6️⃣ Kontroluji neon třídy..."
NEON_CLASSES=$(grep -r "text-neon-\|border-neon-\|btn-neon" src/ 2>/dev/null | wc -l)
if [ "$NEON_CLASSES" -gt 0 ]; then
    green "✅ Neon třídy jsou používány ($NEON_CLASSES výskytů)"
else
    yellow "⚠️ Neon třídy nejsou používány"
    WARNINGS=$((WARNINGS + 1))
fi

# 7. Kontrola bootstrap utility tříd (DŮLEŽITÉ)
echo ""
echo "7️⃣ Kontroluji Bootstrap utility usage..."
BOOTSTRAP_UTILS=$(grep -r "d-flex\|col-\|btn\|text-\|bg-\|border\|p-\|m-\|justify-\|align-" src/ 2>/dev/null | wc -l)
if [ "$BOOTSTRAP_UTILS" -gt 50 ]; then
    green "✅ Bootstrap utility třídy jsou hojně používány ($BOOTSTRAP_UTILS výskytů)"
else
    yellow "⚠️ Málo Bootstrap utility tříd ($BOOTSTRAP_UTILS výskytů) - preferuj Bootstrap před vlastním CSS"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "════════════════════════════════════════════════"
echo "📊 VÝSLEDKY MODERNIZOVANÉ KONTROLY"
echo "════════════════════════════════════════════════"

if [ $ERRORS -gt 0 ]; then
    red "❌ NALEZENO $ERRORS KRITICKÝCH CHYB!"
    red "🛑 COMMIT ZAMÍTNUT - OPRAVTE CHYBY PŘED POKRAČOVÁNÍM"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    yellow "⚠️ Nalezeno $WARNINGS informačních varování"
    yellow "💡 Varování jsou informativní, commit je povolen"
    green "🚀 Commit může pokračovat"
    exit 0
else
    green "✅ VŠECHNY KONTROLY PROŠŁY PERFEKTNĚ!"
    green "🚀 Commit může pokračovat"
    exit 0
fi
