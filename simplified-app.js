/**
 * Zjednodušená a spolehlivá verze hlavní aplikace
 * Zajišťuje základní funkčnost bez složitých závislostí
 */

console.log('🎲 AI Kostková Výzva - Zjednodušená verze');

// Globální stav aplikace
window.gameState = {
    targetScore: 10000,
    gameStarted: false,
    currentPlayer: 0,
    players: [
        { name: 'Vy', score: 0, type: 'human' },
        { name: 'Gemini', score: 0, type: 'ai' },
        { name: 'ChatGPT', score: 0, type: 'ai' },
        { name: 'Claude', score: 0, type: 'ai' }
    ],
    currentTurnScore: 0,
    availableDice: 6,
    diceValues: [],
    selectedDice: []
};

// Utility funkce pro načítání šablon
async function loadTemplate(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Chyba při načítání šablony ${url}:`, error);
        return '<div class="alert alert-danger">Chyba při načítání šablony</div>';
    }
}

// Funkce pro přidání zpráv do chatu
function addChatMessage(type, message, senderType = 'system') {
    console.log(`💬 [${type}] ${message}`);
    
    // Najdeme chat kontejner
    const chatMessages = document.querySelector('.chat-messages') || 
                        document.querySelector('#chatMessages') ||
                        document.querySelector('.chat-window');
    
    if (chatMessages) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${senderType}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <span class="sender">${type}:</span>
                <span class="text">${message}</span>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Zjednodušená startGame funkce
function startGame() {
    console.log('🎮 Spouštím zjednodušenou hru...');
    
    // Získání target score
    const targetScoreInput = document.getElementById('targetScoreInput') || 
                            document.getElementById('targetScoreInputMobile');
    
    if (!targetScoreInput) {
        console.error('❌ Input pro target score nenalezen!');
        alert('Chyba: Nenalezen input pro cílové skóre!');
        return;
    }
    
    const targetScore = parseInt(targetScoreInput.value);
    if (targetScore < 1000) {
        alert('Cílové skóre musí být alespoň 1000 bodů!');
        return;
    }
    
    // Nastavení stavu hry
    window.gameState.targetScore = targetScore;
    window.gameState.gameStarted = true;
    
    console.log('🎯 Target score nastaven na:', targetScore);
    
    // Skrytí menu
    const gameHeader = document.getElementById('gameHeader');
    if (gameHeader) {
        gameHeader.classList.add('d-none');
        console.log('✅ Desktop menu skryto');
    }
    
    const gameMobileContent = document.getElementById('gameMobileContent');
    if (gameMobileContent) {
        gameMobileContent.classList.add('d-none');
        console.log('✅ Mobile menu skryto');
    }
    
    // Zobrazení herních kontrol
    const gameControls = document.getElementById('gameControls');
    if (gameControls) {
        gameControls.classList.remove('d-none', 'hidden');
        gameControls.classList.add('d-block', 'd-md-block');
        console.log('✅ Desktop herní kontroly zobrazeny');
    }
    
    const gameControlsMobile = document.getElementById('gameControlsMobile');
    if (gameControlsMobile) {
        gameControlsMobile.classList.remove('d-none', 'hidden');
        gameControlsMobile.classList.add('d-block', 'd-md-none');
        console.log('✅ Mobile herní kontroly zobrazeny');
    }
    
    // Aktualizace target score display
    const targetScoreDisplay = document.getElementById('targetScoreDisplay');
    if (targetScoreDisplay) {
        targetScoreDisplay.textContent = targetScore;
    }
    
    // Zpráva do chatu
    addChatMessage('Systém', `🎮 Hra začala! Cíl: ${targetScore} bodů`);
    
    // Inicializace herního UI
    initializeGameUI();
    
    console.log('✅ Hra úspěšně spuštěna!');
}

// Inicializace herního UI
function initializeGameUI() {
    console.log('🎨 Inicializace herního UI...');
    
    // Aktualizace skóre hráčů
    updatePlayerScores();
    
    // Zobrazení aktuálního hráče
    updateCurrentPlayer();
    
    // Inicializace kostek
    initializeDice();
}

// Aktualizace skóre hráčů
function updatePlayerScores() {
    window.gameState.players.forEach((player, index) => {
        const scoreElement = document.getElementById(`${player.name.toLowerCase()}Score`) ||
                            document.getElementById(`${player.type}Score`) ||
                            document.querySelector(`[data-player="${index}"] .player-score`);
        
        if (scoreElement) {
            scoreElement.textContent = player.score;
        }
    });
}

// Aktualizace aktuálního hráče
function updateCurrentPlayer() {
    const currentPlayer = window.gameState.players[window.gameState.currentPlayer];
    const turnInfo = document.getElementById('turnInfo');
    
    if (turnInfo) {
        turnInfo.textContent = `Tah hráče: ${currentPlayer.name}`;
    }
    
    // Zvýraznění aktivního hráče
    document.querySelectorAll('.player').forEach((playerEl, index) => {
        if (index === window.gameState.currentPlayer) {
            playerEl.classList.add('active');
        } else {
            playerEl.classList.remove('active');
        }
    });
}

// Inicializace kostek
function initializeDice() {
    const diceContainer = document.getElementById('diceContainer');
    if (!diceContainer) return;
    
    diceContainer.innerHTML = '';
    
    // Vytvoření 6 kostek
    for (let i = 0; i < 6; i++) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.textContent = '?';
        dice.style.cssText = `
            width: 50px;
            height: 50px;
            border: 2px solid #00ff00;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #00ff00;
            background: rgba(0, 255, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        dice.addEventListener('click', () => {
            dice.style.background = dice.style.background === 'rgba(0, 255, 0, 0.3)' 
                ? 'rgba(0, 255, 0, 0.1)' 
                : 'rgba(0, 255, 0, 0.3)';
        });
        
        diceContainer.appendChild(dice);
    }
}

// Funkce pro hod kostkami
function rollDice() {
    const diceContainer = document.getElementById('diceContainer');
    if (!diceContainer) return;
    
    const diceElements = diceContainer.querySelectorAll('.dice');
    const diceValues = [];
    
    diceElements.forEach((dice, index) => {
        const value = Math.floor(Math.random() * 6) + 1;
        diceValues.push(value);
        dice.textContent = value;
        
        // Animace
        dice.style.animation = 'none';
        setTimeout(() => {
            dice.style.animation = 'pulse 0.5s ease-in-out';
        }, index * 100);
    });
    
    window.gameState.diceValues = diceValues;
    console.log('🎲 Hod kostek:', diceValues);
    
    addChatMessage('Systém', `🎲 Hozeno: ${diceValues.join(', ')}`);
}

// Hlavní inicializace
async function initializeSimplifiedApp() {
    console.log('🚀 Inicializace zjednodušené aplikace...');
    
    try {
        // Načtení šablon
        const gameMenu = await loadTemplate('/src/templates/game-menu.html');
        const gameControls = await loadTemplate('/src/templates/game-controls.html');
        const gameControlsMobile = await loadTemplate('/src/templates/game-controls-mobile.html');
        const chat = await loadTemplate('/src/templates/chat.html');
        const chatMobile = await loadTemplate('/src/templates/chat-mobile-bootstrap.html');
        
        // Vložení šablon
        const gameContent = document.getElementById('gameContent');
        const gameControlsContainer = document.getElementById('gameControls');
        const gameControlsMobileContainer = document.getElementById('gameControlsMobile');
        const chatPanel = document.getElementById('chatPanel');
        const chatMobilePanel = document.getElementById('chatPanelMobileContainer');
        
        if (gameContent) gameContent.innerHTML = gameMenu;
        if (gameControlsContainer) gameControlsContainer.innerHTML = gameControls;
        if (gameControlsMobileContainer) gameControlsMobileContainer.innerHTML = gameControlsMobile;
        if (chatPanel) chatPanel.innerHTML = chat;
        if (chatMobilePanel) chatMobilePanel.innerHTML = chatMobile;
        
        // Nastavení globálních funkcí
        window.addChatMessage = addChatMessage;
        window.startGame = startGame;
        window.rollDice = rollDice;
        
        // Připojení event listenerů
        setTimeout(() => {
            attachEventListeners();
        }, 500);
        
        console.log('✅ Zjednodušená aplikace inicializována');
        
    } catch (error) {
        console.error('❌ Chyba při inicializaci:', error);
    }
}

// Připojení event listenerů
function attachEventListeners() {
    console.log('🔗 Připojování event listenerů...');
    
    // Start game tlačítka
    const startBtns = [
        document.getElementById('startGameBtn'),
        document.getElementById('startGameBtnMobile')
    ].filter(Boolean);
    
    startBtns.forEach(btn => {
        btn.addEventListener('click', startGame);
    });
    
    // Roll dice tlačítka
    const rollBtns = [
        document.getElementById('rollBtn'),
        document.getElementById('rollBtnMobile')
    ].filter(Boolean);
    
    rollBtns.forEach(btn => {
        btn.addEventListener('click', rollDice);
    });
    
    console.log(`✅ Event listeners připojeny (${startBtns.length + rollBtns.length} tlačítek)`);
}

// Spuštění po načtení DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSimplifiedApp);
} else {
    initializeSimplifiedApp();
}
