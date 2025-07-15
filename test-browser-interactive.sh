#!/bin/bash
# ===================================================================
# 🌐 BROWSER INTERACTIVE GAME TEST
# Interaktivní test hry v browseru s automatickým klikáním
# ===================================================================

echo "🌐 BROWSER INTERACTIVE GAME TEST"
echo "════════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Check if server is running
check_and_start_server() {
    echo -e "${BLUE}🔍 Kontroluji dev server...${NC}"
    
    if curl -s http://localhost:5174 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server běží na portu 5174${NC}"
        SERVER_URL="http://localhost:5174"
        return 0
    elif curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server běží na portu 5173${NC}"
        SERVER_URL="http://localhost:5173"
        return 0
    else
        echo -e "${YELLOW}⚠️  Spouštím dev server...${NC}"
        npm run dev &
        SERVER_PID=$!
        sleep 5
        
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            SERVER_URL="http://localhost:5173"
            echo -e "${GREEN}✅ Server spuštěn na portu 5173${NC}"
            return 0
        else
            echo -e "${RED}❌ Nepodařilo se spustit server${NC}"
            return 1
        fi
    fi
}

# Create browser test HTML
create_browser_test() {
    cat > /tmp/browser_test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>AI Dice Challenge - Browser Test</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #000; 
            color: #39ff14; 
        }
        .test-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            display: flex; 
            gap: 20px; 
        }
        .control-panel {
            width: 300px;
            border: 2px solid #39ff14;
            padding: 20px;
            border-radius: 10px;
        }
        .game-frame {
            flex: 1;
            border: 2px solid #194dd1;
            border-radius: 10px;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 800px;
            border: none;
        }
        .test-button {
            background: #39ff14;
            color: #000;
            border: none;
            padding: 10px 20px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
        }
        .test-button:hover {
            background: #2ecc1a;
        }
        .test-log {
            background: #111;
            border: 1px solid #39ff14;
            padding: 10px;
            height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        .status-ok { color: #39ff14; }
        .status-error { color: #ff3131; }
        .status-warning { color: #ffff00; }
    </style>
</head>
<body>
    <h1>🎲 AI Dice Challenge - Browser Test</h1>
    
    <div class="test-container">
        <div class="control-panel">
            <h3>🎮 Control Panel</h3>
            
            <button class="test-button" onclick="testMenuLoad()">
                📋 Test Menu Load
            </button>
            
            <button class="test-button" onclick="testGameStart()">
                🎯 Test Game Start
            </button>
            
            <button class="test-button" onclick="testDiceRoll()">
                🎲 Test Dice Roll
            </button>
            
            <button class="test-button" onclick="testDiceSelect()">
                ✋ Test Dice Select
            </button>
            
            <button class="test-button" onclick="testSaveDice()">
                💾 Test Save Dice
            </button>
            
            <button class="test-button" onclick="testEndTurn()">
                🔄 Test End Turn
            </button>
            
            <button class="test-button" onclick="testFarkleScenario()">
                💥 Test FARKLE
            </button>
            
            <button class="test-button" onclick="testWinCondition()">
                🏆 Test Win Condition
            </button>
            
            <button class="test-button" onclick="runFullTest()">
                🔥 Complete Test
            </button>
            
            <h4>📊 Test Log</h4>
            <div class="test-log" id="testLog"></div>
            
            <h4>📈 Statistics</h4>
            <div id="stats">
                <div>Successful: <span id="passCount">0</span></div>
                <div>Failed: <span id="failCount">0</span></div>
                <div>Success Rate: <span id="successRate">0%</span></div>
            </div>
        </div>
        
        <div class="game-frame">
            <iframe id="gameFrame" src=""></iframe>
        </div>
    </div>

    <script>
        let passCount = 0;
        let failCount = 0;
        
        function updateStats() {
            document.getElementById('passCount').textContent = passCount;
            document.getElementById('failCount').textContent = failCount;
            const total = passCount + failCount;
            const rate = total > 0 ? Math.round((passCount / total) * 100) : 0;
            document.getElementById('successRate').textContent = rate + '%';
        }
        
        function log(message, type = 'info') {
            const logDiv = document.getElementById('testLog');
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'error' ? 'status-error' : 
                            type === 'warning' ? 'status-warning' : 'status-ok';
            
            logDiv.innerHTML += `<div class="${className}">[${timestamp}] ${message}</div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
            
            if (type === 'error') failCount++;
            else if (type === 'success') passCount++;
            updateStats();
        }
        
        function getGameWindow() {
            return document.getElementById('gameFrame').contentWindow;
        }
        
        function testMenuLoad() {
            log('🔍 Testing menu load...', 'info');
            
            setTimeout(() => {
                const gameWin = getGameWindow();
                if (gameWin && gameWin.document) {
                    const gameArea = gameWin.document.querySelector('#gameArea');
                    if (gameArea && gameArea.innerHTML.trim() !== '') {
                        log('✅ Game area loaded successfully', 'success');
                        
                        // Check for neon buttons with our CSS classes
                        const neonButtons = gameWin.document.querySelectorAll('.btn-neon[data-neon-color]');
                        if (neonButtons.length > 0) {
                            log(`✅ Found ${neonButtons.length} neon buttons`, 'success');
                            // Log button colors for debugging
                            const colors = Array.from(neonButtons).map(btn => btn.getAttribute('data-neon-color')).join(', ');
                            log(`📋 Button colors: ${colors}`, 'info');
                        } else {
                            log('⚠️ No neon buttons found', 'warning');
                        }
                    } else {
                        log('❌ Game area is empty or not found', 'error');
                    }
                } else {
                    log('❌ Cannot access game window', 'error');
                }
            }, 2000);
        }
        
        function testGameStart() {
            log('🎯 Testing game start...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                // Look for start button - green neon button with Start/Začít text
                const startBtns = gameWin.document.querySelectorAll('.btn-neon[data-neon-color="green"]');
                let startBtn = null;
                
                for (let btn of startBtns) {
                    const text = btn.textContent.toLowerCase();
                    if (text.includes('start') || text.includes('začít') || text.includes('nová hra')) {
                        startBtn = btn;
                        break;
                    }
                }
                
                if (startBtn) {
                    startBtn.click();
                    log('✅ Start button clicked', 'success');
                    
                    setTimeout(() => {
                        // Check if dice section appeared
                        const diceContainer = gameWin.document.querySelector('.dice-container, [class*="dice"]');
                        if (diceContainer) {
                            log('✅ Dice container appeared after game start', 'success');
                        } else {
                            log('❌ Dice container not found after game start', 'error');
                        }
                    }, 1500);
                } else {
                    log('❌ Start button not found', 'error');
                    // Debug: show what buttons we found
                    const allBtns = gameWin.document.querySelectorAll('.btn-neon');
                    if (allBtns.length > 0) {
                        const btnTexts = Array.from(allBtns).map(btn => btn.textContent.trim()).join(', ');
                        log(`📋 Available buttons: ${btnTexts}`, 'info');
                    }
                }
            }
        }
        
        function testDiceRoll() {
            log('🎲 Testing dice roll...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                // Look for Roll button - green neon button with "HODIT" text
                const rollBtns = gameWin.document.querySelectorAll('.btn-neon[data-neon-color="green"]');
                let rollBtn = null;
                
                for (let btn of rollBtns) {
                    const text = btn.textContent.toUpperCase();
                    if (text.includes('HODIT') || text.includes('ROLL')) {
                        rollBtn = btn;
                        break;
                    }
                }
                
                if (rollBtn && !rollBtn.disabled) {
                    rollBtn.click();
                    log('✅ Roll button clicked', 'success');
                    
                    setTimeout(() => {
                        // Look for dice elements with our CSS classes
                        const diceElements = gameWin.document.querySelectorAll('.dice, .dice-item, [class*="dice-"]');
                        if (diceElements.length >= 6) {
                            log(`✅ Found ${diceElements.length} dice elements`, 'success');
                            
                            // Check if dice have values
                            const diceWithValues = Array.from(diceElements).filter(dice => 
                                dice.textContent && dice.textContent.trim() !== ''
                            );
                            if (diceWithValues.length > 0) {
                                log(`✅ ${diceWithValues.length} dice have values`, 'success');
                            } else {
                                log('⚠️ Dice found but no values visible', 'warning');
                            }
                        } else {
                            log(`❌ Only found ${diceElements.length} dice elements (expected 6)`, 'error');
                        }
                    }, 2500);
                } else if (rollBtn && rollBtn.disabled) {
                    log('⚠️ Roll button found but disabled', 'warning');
                    log(`📋 Button title: ${rollBtn.title || 'No title'}`, 'info');
                } else {
                    log('❌ Roll button not found', 'error');
                    // Debug available buttons
                    const allBtns = gameWin.document.querySelectorAll('.btn-neon');
                    if (allBtns.length > 0) {
                        const btnTexts = Array.from(allBtns).map(btn => 
                            `${btn.textContent.trim()} (${btn.getAttribute('data-neon-color')})`
                        ).join(', ');
                        log(`📋 Available buttons: ${btnTexts}`, 'info');
                    }
                }
            }
        }
        
        function testDiceSelect() {
            log('✋ Testing dice selection...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                // Look for dice elements with our CSS classes
                const diceElements = gameWin.document.querySelectorAll('.dice, .dice-item, [class*="dice-"]:not([class*="dice-container"])');
                if (diceElements.length > 0) {
                    // Try to click the first dice
                    const firstDice = diceElements[0];
                    firstDice.click();
                    log('✅ First dice clicked', 'success');
                    
                    setTimeout(() => {
                        // Check if dice got selected class
                        if (firstDice.classList.contains('selected') || 
                            firstDice.classList.contains('dice-selected')) {
                            log('✅ Dice is marked as selected', 'success');
                        } else {
                            // Check for visual changes (colors, borders)
                            const styles = window.getComputedStyle(firstDice);
                            const borderColor = styles.borderColor;
                            if (borderColor && borderColor !== 'rgb(57, 255, 20)') {
                                log(`✅ Dice border color changed: ${borderColor}`, 'success');
                            } else {
                                log('❌ Dice selection not visually indicated', 'error');
                            }
                        }
                    }, 500);
                } else {
                    log('❌ No dice found for selection', 'error');
                    // Debug: show what dice-related elements exist
                    const allDiceElements = gameWin.document.querySelectorAll('[class*="dice"]');
                    if (allDiceElements.length > 0) {
                        const diceClasses = Array.from(allDiceElements).map(el => el.className).join(', ');
                        log(`📋 Found dice-related elements: ${diceClasses}`, 'info');
                    }
                }
            }
        }
        
        function testSaveDice() {
            log('💾 Testing save dice...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                // Look for Save button - blue neon button with "ODLOŽIT" text
                const saveBtns = gameWin.document.querySelectorAll('.btn-neon[data-neon-color="blue"]');
                let saveBtn = null;
                
                for (let btn of saveBtns) {
                    const text = btn.textContent.toUpperCase();
                    if (text.includes('ODLOŽIT') || text.includes('SAVE')) {
                        saveBtn = btn;
                        break;
                    }
                }
                
                if (saveBtn && !saveBtn.disabled) {
                    saveBtn.click();
                    log('✅ Save button clicked', 'success');
                    
                    setTimeout(() => {
                        // Check for saved dice (should have 'saved' class or blue border)
                        const savedDice = gameWin.document.querySelectorAll('.dice.saved, .dice-saved');
                        if (savedDice.length > 0) {
                            log(`✅ Found ${savedDice.length} saved dice`, 'success');
                        } else {
                            log('⚠️ No saved dice found visually', 'warning');
                        }
                    }, 500);
                } else if (saveBtn && saveBtn.disabled) {
                    log('⚠️ Save button found but disabled', 'warning');
                    log(`📋 Button title: ${saveBtn.title || 'No title'}`, 'info');
                } else {
                    log('❌ Save button not found', 'error');
                }
            }
        }
        
        function testEndTurn() {
            log('🔄 Testing end turn...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                // Look for End Turn button - orange neon button with "UKONČIT TAH" text
                const endBtns = gameWin.document.querySelectorAll('.btn-neon[data-neon-color="orange"]');
                let endBtn = null;
                
                for (let btn of endBtns) {
                    const text = btn.textContent.toUpperCase();
                    if (text.includes('UKONČIT') || text.includes('END TURN') || text.includes('UKONČIT TAH')) {
                        endBtn = btn;
                        break;
                    }
                }
                
                if (endBtn && !endBtn.disabled) {
                    endBtn.click();
                    log('✅ End Turn button clicked', 'success');
                    
                    setTimeout(() => {
                        // Check if turn changed (could check player indicators)
                        const activePlayer = gameWin.document.querySelector('.player-active');
                        if (activePlayer) {
                            log('✅ Active player indicator found', 'success');
                        } else {
                            log('⚠️ Active player indicator not found', 'warning');
                        }
                    }, 1000);
                } else if (endBtn && endBtn.disabled) {
                    log('⚠️ End Turn button found but disabled', 'warning');
                    log(`📋 Button title: ${endBtn.title || 'No title'}`, 'info');
                } else {
                    log('❌ End Turn button not found', 'error');
                }
            }
        }
        
        function testFarkleScenario() {
            log('💥 Testing FARKLE scenario...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                // Check if game modules are available in window
                if (gameWin.gameState && gameWin.diceMechanics) {
                    log('✅ Game modules found in window', 'success');
                    
                    // Test FARKLE scenario with non-scoring dice
                    if (gameWin.diceMechanics.calculatePoints) {
                        const nonScoringDice = [2, 3, 4, 6, 6, 2];
                        const score = gameWin.diceMechanics.calculatePoints(nonScoringDice);
                        if (score === 0) {
                            log('✅ FARKLE correctly detected (0 points)', 'success');
                        } else {
                            log(`❌ FARKLE not detected, score: ${score}`, 'error');
                        }
                    } else {
                        log('❌ calculatePoints function not available', 'error');
                    }
                } else {
                    log('⚠️ Game modules not available in window', 'warning');
                    // Check if FARKLE visual elements exist
                    const farkleElements = gameWin.document.querySelectorAll('.farkle-text, .player-farkle, [class*="farkle"]');
                    if (farkleElements.length > 0) {
                        log('✅ FARKLE visual elements found in DOM', 'success');
                    } else {
                        log('📋 No FARKLE elements found (may appear during gameplay)', 'info');
                    }
                }
            }
        }
        
        function testWinCondition() {
            log('🏆 Testing win condition...', 'info');
            
            const gameWin = getGameWindow();
            if (gameWin) {
                if (gameWin.gameState && gameWin.gameState.getState) {
                    const state = gameWin.gameState.getState();
                    if (state && state.players) {
                        const player = state.players[0];
                        if (player && typeof player.score === 'number') {
                            if (player.score >= 10000) {
                                log(`✅ Player has ${player.score} points (win possible)`, 'success');
                            } else {
                                log(`📋 Player has ${player.score} points (win at 10000)`, 'info');
                            }
                        } else {
                            log('❌ Player score not available', 'error');
                        }
                    } else {
                        log('❌ Player information not available', 'error');
                    }
                } else {
                    log('⚠️ GameState not available in window', 'warning');
                    // Alternative: check for score display in DOM
                    const scoreElements = gameWin.document.querySelectorAll('[class*="score"], .player-score, .total-score');
                    if (scoreElements.length > 0) {
                        let foundScore = false;
                        scoreElements.forEach(el => {
                            const text = el.textContent;
                            const scoreMatch = text.match(/(\d+)/);
                            if (scoreMatch) {
                                const score = parseInt(scoreMatch[1]);
                                log(`📋 Found score in DOM: ${score}`, 'info');
                                foundScore = true;
                            }
                        });
                        if (foundScore) {
                            log('✅ Score information found in DOM', 'success');
                        }
                    } else {
                        log('📋 No score elements found in DOM', 'info');
                    }
                }
            }
        }
        
        function runFullTest() {
            log('🔥 Starting complete test...', 'info');
            passCount = 0;
            failCount = 0;
            updateStats();
            
            testMenuLoad();
            setTimeout(() => testGameStart(), 3000);
            setTimeout(() => testDiceRoll(), 6000);
            setTimeout(() => testDiceSelect(), 9000);
            setTimeout(() => testSaveDice(), 12000);
            setTimeout(() => testEndTurn(), 15000);
            setTimeout(() => testFarkleScenario(), 18000);
            setTimeout(() => testWinCondition(), 21000);
            
            setTimeout(() => {
                log('🏁 Complete test finished!', 'info');
                const total = passCount + failCount;
                const rate = total > 0 ? Math.round((passCount / total) * 100) : 0;
                if (rate >= 80) {
                    log('🎉 Game works excellently!', 'success');
                } else if (rate >= 60) {
                    log('⚠️ Game needs minor fixes', 'warning');
                } else {
                    log('❌ Game needs significant fixes', 'error');
                }
            }, 24000);
        }
        
        // Load game on startup
        window.onload = function() {
            const gameFrame = document.getElementById('gameFrame');
            gameFrame.src = window.location.origin;
            
            gameFrame.onload = function() {
                log('🌐 Game loaded in iframe', 'success');
                setTimeout(() => testMenuLoad(), 2000);
            };
        };
    </script>
</body>
</html>
EOF

    echo -e "${GREEN}✅ Browser test vytvořen: /tmp/browser_test.html${NC}"
}

# Main execution
echo -e "${BLUE}🚀 Spouštím interaktivní browser test...${NC}"

# Check server
if check_and_start_server; then
    echo ""
    echo -e "${GREEN}✅ Server je připraven${NC}"
    
    # Create browser test
    create_browser_test
    
    echo ""
    echo -e "${PURPLE}🌐 SPOUŠTĚNÍ BROWSER TESTU${NC}"
    echo "──────────────────────────────────────────"
    echo -e "${YELLOW}📋 Instrukce:${NC}"
    echo "1. Otevírám browser test v Simple Browser"
    echo "2. Test automaticky načte hru v iframe"
    echo "3. Můžeš použít tlačítka pro testování funkcí"
    echo "4. Kompletní test proběhne automaticky"
    echo ""
    
    # Open in simple browser
    echo -e "${BLUE}🔗 Otevírám v Simple Browser...${NC}"
    
    # Copy test file to public directory for easier access
    cp /tmp/browser_test.html ./browser-test.html
    echo -e "${GREEN}✅ Test dostupný na: ${SERVER_URL}/browser-test.html${NC}"
    
    echo ""
    echo -e "${YELLOW}💡 TIPY PRO TESTOVÁNÍ:${NC}"
    echo "• Použij 'Kompletní Test' pro automatické testování"
    echo "• Sleduj Test Log pro výsledky"
    echo "• Testuj jednotlivé funkce pomocí tlačítek"
    echo "• Zkontroluj že se menu zobrazí při načtení"
    echo ""
    
    echo -e "${GREEN}🎯 Browser test je připraven!${NC}"
else
    echo -e "${RED}❌ Nepodařilo se spustit server pro browser test${NC}"
    exit 1
fi
