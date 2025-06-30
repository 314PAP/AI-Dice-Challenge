/**
 * UI Controller
 * Inicializuje event listenery a UI interakce
 */

import { 
    startGame, 
    rollDiceForPlayer, 
    bankSelectedDice, 
    endTurn, 
    saveScore, 
    resetGame,
    startNewGame,
    selectDie,
    quitGame
} from '../game/gameController.js';

/**
 * Inicializuje UI event listenery
 */
export function initializeUI() {
    console.log('🎨 Inicializace UI...');
    
    // Game control buttons
    const startGameBtn = document.getElementById('startGameBtn');
    const rollBtn = document.getElementById('rollDiceBtn');
    const bankBtn = document.getElementById('bankScoreBtn');
    const saveScoreBtn = document.getElementById('saveScoreBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const quitGameBtn = document.getElementById('quitGameBtn');
    
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }
    
    if (rollBtn) {
        rollBtn.addEventListener('click', rollDiceForPlayer);
    }
    
    if (bankBtn) {
        bankBtn.addEventListener('click', bankSelectedDice);
    }
    
    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', saveScore);
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
    
    if (quitGameBtn) {
        quitGameBtn.addEventListener('click', quitGame);
    }
    
    // Hall of Fame buttons
    const viewHallOfFameBtn = document.getElementById('viewHallOfFameBtn');
    const viewHallOfFameFromGameBtn = document.getElementById('viewHallOfFameFromGameBtn');
    const closeHallOfFameBtn = document.getElementById('closeHallOfFameBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    
    if (viewHallOfFameBtn) {
        viewHallOfFameBtn.addEventListener('click', () => {
            import('../utils/hallOfFame.js').then(({ displayHallOfFame }) => {
                displayHallOfFame();
            });
        });
    }
    
    if (viewHallOfFameFromGameBtn) {
        viewHallOfFameFromGameBtn.addEventListener('click', () => {
            import('../utils/hallOfFame.js').then(({ displayHallOfFame }) => {
                displayHallOfFame();
            });
        });
    }
    
    if (closeHallOfFameBtn) {
        closeHallOfFameBtn.addEventListener('click', () => {
            const modal = document.getElementById('hallOfFameModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (mainMenuBtn) {
        mainMenuBtn.addEventListener('click', () => {
            document.getElementById('gameOverModal').style.display = 'none';
            document.getElementById('gameControls').style.display = 'none';
            document.getElementById('targetScoreSetup').style.display = 'block';
        });
    }
    
    // Handle die selection via custom event to avoid circular dependency
    document.addEventListener('dieSelected', (event) => {
        selectDie(event.detail.index);
    });
    
    console.log('✅ UI event listenery inicializovány');
}
