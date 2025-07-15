#!/bin/bash

echo "🔧 DEBUG: Tlačítka a Event Listenery - AI Dice"
echo "================================================="

# Spustíme server na pozadí, pokud neběží
if ! pgrep -f "python3 -m http.server 8000" > /dev/null; then
    echo "🚀 Spouštím development server..."
    cd /home/pipap/projects/hry-maker/AIDICE
    python3 -m http.server 8000 > /dev/null 2>&1 &
    SERVER_PID=$!
    echo "✅ Server spuštěn (PID: $SERVER_PID)"
    sleep 2
else
    echo "✅ Development server již běží"
fi

echo ""
echo "📋 Kontrola struktury souborů pro UI debug:"
echo "--------------------------------------------"

echo "🔍 Kontrolujem klíčové soubory..."

if [ -f "src/js/ui/uiComponents.js" ]; then
    echo "✅ uiComponents.js existuje"
    grep -n "createNeonButton" src/js/ui/uiComponents.js | head -2
else
    echo "❌ uiComponents.js NEEXISTUJE!"
fi

if [ -f "src/js/ui/gameUI.js" ]; then
    echo "✅ gameUI.js existuje"
    grep -n "renderMainMenu" src/js/ui/gameUI.js | head -1
else
    echo "❌ gameUI.js NEEXISTUJE!"
fi

if [ -f "src/main.js" ]; then
    echo "✅ main.js existuje"
    grep -n "waitForLodash" src/main.js | head -1
else
    echo "❌ main.js NEEXISTUJE!"
fi

echo ""
echo "🔍 Vyhledávám event listener problém..."
echo "--------------------------------------"

echo "🔎 createNeonButton funkce a addEventListener:"
grep -A 10 "if (onClick)" src/js/ui/uiComponents.js

echo ""
echo "🔎 renderMainMenu a volání createNeonButton:"
grep -A 5 "createNeonButton.*onClick" src/js/ui/gameUI.js || echo "❌ Nenalezeno volání s onClick"

echo ""
echo "📊 Debug informace z console logů:"
echo "-----------------------------------"

# Spustíme Puppeteer script pro console logy, pokud existuje node
if command -v node >/dev/null 2>&1; then
    cat > debug-console-capture.js << 'EOF'
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Zachytíme console logy
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  // Zachytíme chyby
  page.on('pageerror', (err) => {
    console.log('[PAGE_ERROR]', err.message);
  });
  
  try {
    await page.goto('http://localhost:8000/debug-ui-buttons.html');
    
    // Počkáme na načtení
    await page.waitForTimeout(3000);
    
    // Spustíme debug test
    await page.evaluate(() => {
      if (typeof startDebugTest === 'function') {
        startDebugTest();
      }
    });
    
    // Počkáme na dokončení
    await page.waitForTimeout(5000);
    
    // Zkontrolujeme tlačítka
    await page.evaluate(() => {
      if (typeof checkButtons === 'function') {
        checkButtons();
      }
    });
    
    await page.waitForTimeout(2000);
    
  } catch (err) {
    console.log('[ERROR]', err.message);
  }
  
  await browser.close();
})();
EOF

    if [ -f "node_modules/puppeteer/package.json" ] || npm list puppeteer >/dev/null 2>&1; then
        echo "🤖 Spouštím Puppeteer console capture..."
        node debug-console-capture.js
        rm -f debug-console-capture.js
    else
        echo "⚠️ Puppeteer není dostupný - přeskakuji console capture"
    fi
else
    echo "⚠️ Node.js není dostupný - přeskakuji console capture"
fi

echo ""
echo "🔗 Manuální debug odkazy:"
echo "-------------------------"
echo "🌐 Debug UI stránka: http://localhost:8000/debug-ui-buttons.html"
echo "🌐 Hlavní aplikace: http://localhost:8000"
echo "🌐 Debug konzole: http://localhost:8000/debug-console.html"

echo ""
echo "📋 Doporučené debug kroky:"
echo "--------------------------"
echo "1. Otevři debug stránku a klikni 'Start Debug Test'"
echo "2. Sleduj console log výstup"
echo "3. Klikni 'Check Buttons in DOM'"
echo "4. Hledej rozdíly mezi vytvořenými a skutečnými tlačítky"

echo ""
echo "🔧 Debug dokončen!"
