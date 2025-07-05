/* =============================================================================
   🔧 EMERGENCY FIX - Funkčná herná logika
   ============================================================================= */

console.log('🚨 Loading emergency game fix...');

// Jednoduchý game state
const gameState = {
    targetScore: 10000,
    currentPlayer: 0,
    players: [
        { name: 'Vy', score: 0 },
        { name: 'Gemini', score: 0 },
        { name: 'ChatGPT', score: 0 },
        { name: 'Claude', score: 0 }
    ],
    currentTurnScore: 0,
    dice: [],
    bankedDice: [],
    gameStarted: false
};

// Funkcionalita
function rollDice(count) {
    const dice = [];
    for (let i = 0; i < count; i++) {
        dice.push({
            value: Math.floor(Math.random() * 6) + 1,
            selected: false
        });
    }
    return dice;
}

function calculateScore(diceValues) {
    if (diceValues.length === 0) return 0;
    
    let score = 0;
    let counts = [0, 0, 0, 0, 0, 0, 0];
    
    diceValues.forEach(val => counts[val]++);
    
    // Trojice a viac
    for (let i = 1; i <= 6; i++) {
        if (counts[i] >= 3) {
            if (i === 1) {
                score += 1000;
            } else {
                score += i * 100;
            }
            counts[i] -= 3;
        }
    }
    
    // Jedničky a päťky
    score += counts[1] * 100;
    score += counts[5] * 50;
    
    return score;
}

function updateUI() {
    // Update scores
    gameState.players.forEach((player, index) => {
        const scoreElements = ['humanScore', 'geminiScore', 'chatgptScore', 'claudeScore'];
        const element = document.getElementById(scoreElements[index]);
        if (element) element.textContent = player.score;
    });
    
    // Update turn score
    const turnScore = document.getElementById('currentTurnScore');
    if (turnScore) turnScore.textContent = `Skóre tahu: ${gameState.currentTurnScore}`;
    
    // Update turn info
    const turnInfo = document.getElementById('turnInfo');
    if (turnInfo) turnInfo.textContent = `${gameState.players[gameState.currentPlayer].name} na tahu!`;
    
    // Update active player
    document.querySelectorAll('.player').forEach(p => p.classList.remove('active'));
    const playerClasses = ['human-player', 'gemini-player', 'chatgpt-player', 'claude-player'];
    const activePlayer = document.querySelector(`.${playerClasses[gameState.currentPlayer]}`);
    if (activePlayer) activePlayer.classList.add('active');
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listenery
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Emergency game setup starting...');
    
    // Start game
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('🚀 Starting game...');
            
            const targetInput = document.getElementById('targetScoreInput');
            gameState.targetScore = parseInt(targetInput.value) || 10000;
            gameState.gameStarted = true;
            
            const setup = document.getElementById('targetScoreSetup');
            const controls = document.getElementById('gameControls');
            const players = document.getElementById('playersContainer');
            
            if (setup) setup.classList.add('hidden');
            if (controls) controls.classList.remove('hidden');
            if (players) players.classList.remove('hidden');
            
            addChatMessage('Systém', `Hra začala! Cieľ: ${gameState.targetScore} bodov`);
            updateUI();
        });
    }
    
    // Roll dice
    const rollBtn = document.getElementById('rollBtn');
    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            if (!gameState.gameStarted || gameState.currentPlayer !== 0) return;
            
            console.log('🎲 Rolling dice...');
            
            const diceToRoll = 6 - gameState.bankedDice.length;
            gameState.dice = rollDice(diceToRoll);
            
            const diceContainer = document.getElementById('diceContainer');
            if (diceContainer) {
                diceContainer.innerHTML = '';
                
                // Show rolled dice
                gameState.dice.forEach((die, index) => {
                    const diceElement = document.createElement('div');
                    diceElement.className = 'dice';
                    diceElement.textContent = die.value;
                    diceElement.addEventListener('click', () => {
                        die.selected = !die.selected;
                        diceElement.classList.toggle('selected');
                        
                        const selectedDice = gameState.dice.filter(d => d.selected);
                        const score = calculateScore(selectedDice.map(d => d.value));
                        
                        const bankBtn = document.getElementById('bankBtn');
                        if (bankBtn) bankBtn.disabled = score === 0;
                    });
                    diceContainer.appendChild(diceElement);
                });
                
                // Show banked dice
                gameState.bankedDice.forEach(value => {
                    const diceElement = document.createElement('div');
                    diceElement.className = 'dice banked';
                    diceElement.textContent = value;
                    diceElement.style.opacity = '0.5';
                    diceContainer.appendChild(diceElement);
                });
            }
            
            const diceValues = gameState.dice.map(d => d.value);
            const rollScore = calculateScore(diceValues);
            
            addChatMessage('Systém', `Hod: ${diceValues.join(', ')} - Možné body: ${rollScore}`);
            
            if (rollScore === 0) {
                addChatMessage('Systém', '❌ FARKLE! Žiadne bodujúce kostky!');
                setTimeout(() => nextPlayer(), 2000);
            }
        });
    }
    
    // Bank dice
    const bankBtn = document.getElementById('bankBtn');
    if (bankBtn) {
        bankBtn.addEventListener('click', () => {
            const selectedDice = gameState.dice.filter(d => d.selected);
            if (selectedDice.length === 0) return;
            
            const score = calculateScore(selectedDice.map(d => d.value));
            gameState.currentTurnScore += score;
            
            selectedDice.forEach(die => gameState.bankedDice.push(die.value));
            gameState.dice = gameState.dice.filter(d => !d.selected);
            
            addChatMessage('Systém', `Odložené kostky za ${score} bodov`);
            
            const endTurnBtn = document.getElementById('endTurnBtn');
            if (endTurnBtn) endTurnBtn.disabled = false;
            
            updateUI();
        });
    }
    
    // End turn
    const endTurnBtn = document.getElementById('endTurnBtn');
    if (endTurnBtn) {
        endTurnBtn.addEventListener('click', () => {
            gameState.players[gameState.currentPlayer].score += gameState.currentTurnScore;
            
            addChatMessage('Systém', `${gameState.players[gameState.currentPlayer].name} získal ${gameState.currentTurnScore} bodov!`);
            
            if (gameState.players[gameState.currentPlayer].score >= gameState.targetScore) {
                addChatMessage('Systém', `🎉 ${gameState.players[gameState.currentPlayer].name} vyhral!`);
                return;
            }
            
            nextPlayer();
        });
    }
    
    function nextPlayer() {
        gameState.currentTurnScore = 0;
        gameState.dice = [];
        gameState.bankedDice = [];
        gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
        
        const bankBtn = document.getElementById('bankBtn');
        const endTurnBtn = document.getElementById('endTurnBtn');
        if (bankBtn) bankBtn.disabled = true;
        if (endTurnBtn) endTurnBtn.disabled = true;
        
        updateUI();
        
        if (gameState.currentPlayer !== 0) {
            setTimeout(() => aiTurn(), 1000);
        }
    }
    
    function aiTurn() {
        const aiName = gameState.players[gameState.currentPlayer].name;
        addChatMessage(aiName, 'Idem hrať!');
        
        // Simulácia AI hodu
        setTimeout(() => {
            const score = Math.floor(Math.random() * 500) + 250;
            gameState.players[gameState.currentPlayer].score += score;
            
            addChatMessage(aiName, `Získal som ${score} bodov!`);
            
            if (gameState.players[gameState.currentPlayer].score >= gameState.targetScore) {
                addChatMessage('Systém', `🎉 ${aiName} vyhral!`);
                return;
            }
            
            setTimeout(() => nextPlayer(), 1000);
        }, 2000);
    }
    
    // Chat toggle
    const chatToggle = document.getElementById('chatToggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            const chatPanel = document.getElementById('chatPanel');
            if (chatPanel) {
                chatPanel.classList.toggle('collapsed');
                chatToggle.textContent = chatPanel.classList.contains('collapsed') ? '+' : '−';
            }
        });
    }
    
    // Chat
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    
    if (chatInput && sendBtn) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                addChatMessage('Vy', message);
                chatInput.value = '';
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // Hall of Fame
    const hallBtn = document.getElementById('hallOfFameBtn');
    if (hallBtn) {
        hallBtn.addEventListener('click', () => {
            const modal = document.getElementById('hallOfFameModal');
            if (modal) modal.classList.remove('hidden');
        });
    }
    
    const closeHallBtn = document.getElementById('closeHallOfFameBtn');
    if (closeHallBtn) {
        closeHallBtn.addEventListener('click', () => {
            const modal = document.getElementById('hallOfFameModal');
            if (modal) modal.classList.add('hidden');
        });
    }
    
    console.log('✅ Emergency game setup complete');
});
