#!/bin/bash

echo "🔍 DEBUG - Kontrola načítání modulů a tlačítek"
echo "=============================================="

# Kontrola serveru
if curl -s http://localhost:5174/ > /dev/null; then
    echo "✅ Server běží na portu 5174"
else
    echo "❌ Server neběží!"
    exit 1
fi

echo ""
echo "📁 Kontrola existence CSS modulů:"
echo "----------------------------------"

CSS_FILES=(
    "src/styles/main.css"
    "src/styles/components/buttons.css"
    "src/styles/components/chat.css"
    "src/styles/utilities/colors.css"
)

for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existuje"
    else
        echo "❌ $file NEEXISTUJE!"
    fi
done

echo ""
echo "🔧 Kontrola existence JS modulů:"
echo "---------------------------------"

JS_FILES=(
    "src/main.js"
    "src/js/ui/gameUI.js"
    "src/js/ui/uiComponents.js"
    "src/js/app/ComponentManager.js"
)

for file in "${JS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existuje"
    else
        echo "❌ $file NEEXISTUJE!"
    fi
done

echo ""
echo "🎮 Test funkce createNeonButton:"
echo "--------------------------------"
if grep -q "createNeonButton" src/js/ui/uiComponents.js; then
    echo "✅ createNeonButton funkce nalezena"
else
    echo "❌ createNeonButton funkce NENALEZENA!"
fi

echo ""
echo "🖱️ Test .btn-neon CSS tříd:"
echo "---------------------------"
if grep -q "\.btn-neon" src/styles/components/buttons.css; then
    echo "✅ .btn-neon CSS třídy nalezeny"
else
    echo "❌ .btn-neon CSS třídy NENALEZENY!"
fi

echo ""
echo "🌐 Test načítání z prohlížeče:"
echo "------------------------------"

# Test načítání main.css
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5174/src/styles/main.css")
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ main.css se načítá (HTTP $HTTP_CODE)"
else
    echo "❌ main.css se nenačítá (HTTP $HTTP_CODE)"
fi

# Test načítání main.js
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5174/src/main.js")
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ main.js se načítá (HTTP $HTTP_CODE)"
else
    echo "❌ main.js se nenačítá (HTTP $HTTP_CODE)"
fi

echo ""
echo "💡 Další debugování:"
echo "--------------------"
echo "1. Otevři http://localhost:5174/css-test.html"
echo "2. Otevři Developer Tools (F12)"
echo "3. Zkontroluj Console tab na chyby"
echo "4. Zkontroluj Network tab - načítají se CSS/JS soubory?"
