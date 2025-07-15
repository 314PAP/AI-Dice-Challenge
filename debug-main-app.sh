#!/bin/bash

echo "🔍 DEBUG - Kontrola hlavní aplikace"
echo "===================================="

# Kontrola, zda server běží
if ! curl -s http://localhost:5174/ > /dev/null; then
    echo "❌ Server neběží na portu 5174!"
    exit 1
fi

echo "✅ Server běží"
echo ""

# Vytvoření jednoduchého test scriptu pro browser console
cat > public/debug-console.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Debug Console - AI Dice Challenge</title>
    <style>
        body { font-family: monospace; background: #000; color: #39ff14; padding: 20px; }
        .log { margin: 5px 0; padding: 5px; border-left: 3px solid #39ff14; }
        .error { border-left-color: #ff3131; color: #ff3131; }
        .warn { border-left-color: #ffff00; color: #ffff00; }
    </style>
</head>
<body>
    <h1>🔍 Debug Console - AI Dice Challenge</h1>
    <div id="log-output"></div>
    
    <script>
        const logOutput = document.getElementById('log-output');
        
        // Zachytávání console.log, console.error, console.warn
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        function addToOutput(message, type = 'log') {
            const div = document.createElement('div');
            div.className = `log ${type}`;
            div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logOutput.appendChild(div);
            logOutput.scrollTop = logOutput.scrollHeight;
        }
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            addToOutput(args.join(' '), 'log');
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            addToOutput(args.join(' '), 'error');
        };
        
        console.warn = function(...args) {
            originalWarn.apply(console, args);
            addToOutput(args.join(' '), 'warn');
        };
        
        // Zachytávání chyb
        window.addEventListener('error', (e) => {
            addToOutput(`ERROR: ${e.message} at ${e.filename}:${e.lineno}`, 'error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            addToOutput(`UNHANDLED PROMISE: ${e.reason}`, 'error');
        });
        
        // Testování načítání hlavní aplikace
        addToOutput('🚀 Spouštím debug test...');
        
        // Načtení hlavní aplikace
        import('/src/main.js')
            .then(() => {
                addToOutput('✅ Hlavní aplikace načtena');
            })
            .catch((error) => {
                addToOutput(`❌ Chyba při načítání hlavní aplikace: ${error.message}`, 'error');
            });
    </script>
</body>
</html>
EOF

echo "📝 Vytvořen debug console: http://localhost:5174/debug-console.html"
echo ""

echo "🌐 Testování základních komponent:"
echo "-----------------------------------"

# Test hlavních JS modulů
JS_MODULES=(
    "src/main.js"
    "src/js/app/AppInitializer.js"
    "src/js/app/ComponentManager.js"
    "src/js/ui/gameUI.js"
)

for module in "${JS_MODULES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5174/$module")
    if [ "$HTTP_CODE" == "200" ]; then
        echo "✅ $module (HTTP $HTTP_CODE)"
    else
        echo "❌ $module (HTTP $HTTP_CODE)"
    fi
done

echo ""
echo "💡 Další kroky debugování:"
echo "-------------------------"
echo "1. Otevři http://localhost:5174/debug-console.html"
echo "2. Sleduj console logy v real-time"
echo "3. Otevři hlavní aplikaci http://localhost:5174/ v druhém tabu"
echo "4. Přepni zpět na debug console a sleduj logy"
echo ""
echo "🔧 Pokud se aplikace nezobrazí:"
echo "1. Zkontroluj, zda se skrývá loading screen"
echo "2. Zkontroluj, zda se vypisují logy o inicializaci"
echo "3. Hledej červené error logy"
