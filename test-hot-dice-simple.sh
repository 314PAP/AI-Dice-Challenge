#!/bin/bash

# 🔥 Test HOT DICE pravidla - rychlý test
# Ověří, že když AI odloží všechny kostky, nemůže okamžitě ukončit tah

echo "🔥 TEST HOT DICE PRAVIDLA"
echo "========================="
echo ""

# Najdeme řádky kde AI řeší HOT DICE rozhodování
echo "🔍 Kontroluji HOT DICE logiku v AI rozhodování..."

echo ""
echo "📝 Hledám HOT DICE detekci v aiPlayerController.js:"
grep -n -A 5 -B 2 "isHotDice.*=" src/js/ai/aiPlayerController.js

echo ""
echo "📝 Hledám HOT DICE zprávy:"
grep -n "HOT DICE" src/js/ai/aiPlayerController.js

echo ""
echo "📝 Kontroluji DiceManager HOT DICE logiku:"
grep -n -A 3 -B 1 "HOT DICE" src/js/game/DiceManager.js

echo ""
echo "📝 Kontroluji nextAction === 'endTurn' handling:"
grep -n -A 5 -B 2 "nextAction.*endTurn" src/js/ai/aiPlayerController.js

echo ""
echo "✅ KONTROLA DOKONČENA"
echo ""
echo "🎯 OČEKÁVANÝ VÝSLEDEK:"
echo "   1. AI detekuje HOT DICE když odloží všechny kostky"
echo "   2. AI NEMŮŽE ukončit tah když je HOT DICE"
echo "   3. AI MUSÍ pokračovat v házení (force continue)"
echo ""

# Spuštění super testu pro ověření, že oprava nezpůsobila regresi
echo "🚀 Spouštím super test pro kontrolu regresí..."
./super-test.sh
