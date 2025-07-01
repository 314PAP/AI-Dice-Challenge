/**
 * Event Setup Controller
 * Manages all event listeners and DOM event bindings for the game
 */

import { startGame, resetGame, saveScore, startNewGame, returnToMainMenu, endTurn } from './gameFlowController.js';
import { rollDiceForPlayer, selectDie, bankSelectedDice } from './turnActionsController.js';

/**
 * Nastavuje event listenery pro herní prvky
 */
export function setupEventListeners() {
    console.log('🎮 Nastavuji event listenery...');
    
    // Počkej na úplné načtení DOM
    setTimeout(() => {
        // Start game button
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            console.log('✅ Přidávám event listener pro Start Game');
            startGameBtn.addEventListener('click', () => {
                console.log('🚀 Start Game button clicked!');
                const targetScoreInput = document.getElementById('targetScoreInput');
                const targetScore = parseInt(targetScoreInput.value);
                
                if (targetScore >= 1000) {
                    startGame();
                } else {
                    alert('Cílové skóre musí být alespoň 1000 bodů!');
                }
            });
        } else {
            console.error('❌ Start Game button not found!');
        }

        // Roll dice button
        const rollBtn = document.getElementById('rollBtn');
        if (rollBtn) {
            console.log('✅ Přidávám event listener pro Roll Dice');
            rollBtn.addEventListener('click', rollDiceForPlayer);
        }
        
        // Bank dice button
        const bankBtn = document.getElementById('bankBtn');
        if (bankBtn) {
            console.log('✅ Přidávám event listener pro Bank Dice');
            bankBtn.addEventListener('click', bankSelectedDice);
        }
        
        // End turn button
        const endTurnBtn = document.getElementById('endTurnBtn');
        if (endTurnBtn) {
            console.log('✅ Přidávám event listener pro End Turn');
            endTurnBtn.addEventListener('click', () => endTurn(true));
        }
        
        // Quit game button
        const quitGameBtn = document.getElementById('quitGameBtn');
        if (quitGameBtn) {
            console.log('✅ Přidávám event listener pro Quit Game');
            quitGameBtn.addEventListener('click', quitGame);
        }

        // Save score button
        const saveScoreBtn = document.getElementById('saveScoreBtn');
        if (saveScoreBtn) {
            console.log('✅ Přidávám event listener pro Save Score');
            saveScoreBtn.addEventListener('click', saveScore);
        }
        
        // New game button
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            console.log('✅ Přidávám event listener pro New Game');
            newGameBtn.addEventListener('click', startNewGame);
        }
        
        // Return to menu button
        const returnMenuBtn = document.getElementById('returnMenuBtn');
        if (returnMenuBtn) {
            console.log('✅ Přidávám event listener pro Return to Menu');
            returnMenuBtn.addEventListener('click', returnToMainMenu);
        }

        // Custom event listener pro výběr kostek z gameUI
        console.log('✅ Přidávám event listener pro dieSelected');
        document.addEventListener('dieSelected', (event) => {
            const { index } = event.detail;
            selectDie(index);
        });

        // Target score input change
        const targetScoreInput = document.getElementById('targetScoreInput');
        if (targetScoreInput) {
            targetScoreInput.addEventListener('change', () => {
                const targetScoreDisplay = document.getElementById('targetScoreDisplay');
                if (targetScoreDisplay) {
                    targetScoreDisplay.textContent = targetScoreInput.value;
                }
            });
        }

        // Modal close buttons
        setupModalEventListeners();
        
        // Keyboard shortcuts
        setupKeyboardShortcuts();

        console.log('✅ Event listenery nastaveny');
    }, 100);
}

/**
 * Nastavuje event listenery pro modální okna
 */
function setupModalEventListeners() {
    // Game over modal close
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.addEventListener('click', (e) => {
            if (e.target === gameOverModal) {
                gameOverModal.style.display = 'none';
            }
        });
    }
    
    // Hall of fame modal close
    const hallOfFameModal = document.getElementById('hallOfFameModal');
    if (hallOfFameModal) {
        hallOfFameModal.addEventListener('click', (e) => {
            if (e.target === hallOfFameModal) {
                hallOfFameModal.style.display = 'none';
            }
        });
    }
}

/**
 * Nastavuje klávesové zkratky pro hru
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Pouze když není zaměřený input element
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            switch (e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    rollDiceForPlayer();
                    break;
                case 'b':
                    e.preventDefault();
                    bankSelectedDice();
                    break;
                case 'e':
                    e.preventDefault();
                    endTurn(true);
                    break;
                case 'escape':
                    e.preventDefault();
                    // Zavřít modály
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                    break;
            }
        }
    });
}

/**
 * Ukončí aktuální hru a vrátí se do menu
 */
function quitGame() {
    if (confirm('Opravdu chcete ukončit aktuální hru?')) {
        returnToMainMenu();
    }
}
