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

export function setupUI() {
    console.log('🎨 Inicializace UI...');
    
    // Game control buttons
    const startGameBtn = document.getElementById('startGameBtn');
    const rollBtn = document.getElementById('rollBtn');
    const bankBtn = document.getElementById('bankBtn');
    const endTurnBtn = document.getElementById('endTurnBtn');
    const saveScoreBtn = document.getElementById('saveScoreBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const quitGameBtn = document.getElementById('quitGameBtn');
    
    // Event listeners
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            const targetScore = parseInt(document.getElementById('targetScoreInput').value) || 10000;
            startGame(targetScore);
        });
    }
    
    if (rollBtn) {
        rollBtn.addEventListener('click', rollDiceForPlayer);
    }
    
    if (bankBtn) {
        bankBtn.addEventListener('click', bankSelectedDice);
    }
    
    if (endTurnBtn) {
        endTurnBtn.addEventListener('click', endTurn);
    }
}
    
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
