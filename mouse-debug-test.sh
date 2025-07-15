#!/bin/bash
# Simple mouse debug test script

echo "🖱️ MOUSE DEBUG TEST - AI Dice Challenge"
echo "========================================="

echo "📖 Návod:"
echo "1. Otevři aplikaci v prohlížeči: http://localhost:5176/"
echo "2. Otevři developer tools (F12)"
echo "3. Přejdi na záložku Console"
echo "4. Klikni na jakékoliv tlačítko v aplikaci"
echo "5. Sleduj debug logy v konzoli"
echo ""
echo "🔍 Hledej tyto logy:"
echo "   🐭 Mouse debug setup"
echo "   🔧 createNeonButton debug"
echo "   🖱️ CLICK detected"
echo "   🔘 BUTTON clicked"
echo "   🚀 BUTTON CALLBACK"
echo ""
echo "❓ Pokud nevidíš žádné 🖱️ nebo 🔘 logy při kliknutí:"
echo "   - Tlačítko nemá event listener"
echo "   - Klik se nepropaguje"
echo "   - Element není button"
echo ""
echo "❓ Pokud vidíš 🖱️ ale ne 🚀 CALLBACK:"
echo "   - Event listener je přidán, ale callback se nevolá"
echo "   - Možná chyba v callback funkci"
echo ""

# Open the app automatically
if command -v xdg-open > /dev/null; then
    echo "🌐 Otevírám aplikaci..."
    xdg-open "http://localhost:5176/" 2>/dev/null &
elif command -v open > /dev/null; then
    echo "🌐 Otevírám aplikaci..."
    open "http://localhost:5176/" 2>/dev/null &
fi

echo "🕐 Aplikace je připravena pro testování!"
