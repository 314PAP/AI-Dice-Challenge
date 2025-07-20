#!/bin/bash

# 🌟 AI Dice Challenge - Glow Effects Tester
# Rychlý test glow efektů v prohlížeči

echo "🎲 AI Dice Challenge - Glow Effects Test"
echo "======================================"

# Kontrola závislostí
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 není nainstalován"
    exit 1
fi

# Spuštění lokálního serveru
echo "🌟 Spouštím lokální server pro test glow efektů..."
echo "📂 Test stránka: http://localhost:8000/test-glow-effects.html"
echo "🎮 Hlavní hra: http://localhost:8000/index.html"
echo ""
echo "💡 Tip: V hlavní hře klikněte na 'Glow' tlačítko v pravém horním rohu"
echo "    pro přepínání mezi custom keyframes a library efekty"
echo ""
echo "🔄 Pro zastavení serveru stiskněte Ctrl+C"
echo ""

# Spuštění serveru
python3 -m http.server 8000

echo ""
echo "✅ Server ukončen"
