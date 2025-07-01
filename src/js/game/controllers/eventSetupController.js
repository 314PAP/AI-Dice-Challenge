/**
 * Event Setup Controller
 * Manages all event listeners and DOM event bindings for the game
 */

import { startGame, resetGame, saveScore, startNewGame, returnToMainMenu, endTurn } from './gameFlowController.js';
import { rollDiceForPlayer, selectDie, bankSelectedDice } from './turnActionsController.js';
import { displayHallOfFame } from '../../utils/hallOfFame.js';

/**
 * Quit game function - return to main menu
 */
function quitGame() {
    console.log('🚪 Ukončuji hru...');
    if (confirm('Opravdu chcete ukončit hru?')) {
        returnToMainMenu();
    }
}

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
        
        // Hall of Fame button
        const hallOfFameBtn = document.getElementById('hallOfFameBtn');
        if (hallOfFameBtn) {
            console.log('✅ Přidávám event listener pro Hall of Fame');
            hallOfFameBtn.addEventListener('click', () => {
                console.log('🏆 Hall of Fame button clicked!');
                displayHallOfFame();
            });
        }
        
        // Close Hall of Fame button
        const closeHallOfFameBtn = document.getElementById('closeHallOfFameBtn');
        if (closeHallOfFameBtn) {
            console.log('✅ Přidávám event listener pro Close Hall of Fame');
            closeHallOfFameBtn.addEventListener('click', () => {
                const modal = document.getElementById('hallOfFameModal');
                if (modal) modal.classList.add('hidden');
            });
        }
        
        // Show Hall of Fame from game over modal
        const showHallOfFameBtn = document.getElementById('showHallOfFameBtn');
        if (showHallOfFameBtn) {
            console.log('✅ Přidávám event listener pro Show Hall of Fame');
            showHallOfFameBtn.addEventListener('click', () => {
                displayHallOfFame();
            });
        }
        
        // Start new game button
        const startNewGameBtn = document.getElementById('startNewGameBtn');
        if (startNewGameBtn) {
            console.log('✅ Přidávám event listener pro Start New Game');
            startNewGameBtn.addEventListener('click', startNewGame);
        }
        
        // Return to menu button  
        const returnToMenuBtn = document.getElementById('returnToMenuBtn');
        if (returnToMenuBtn) {
            console.log('✅ Přidávám event listener pro Return to Menu');
            returnToMenuBtn.addEventListener('click', returnToMainMenu);
        }

        // Custom event listener pro výběr kostek z gameUI
        console.log('✅ Přidávám event listener pro dieSelected');
        document.addEventListener('dieSelected', (event) => {
            const { index } = event.detail;
            selectDie(index);
        });

        // Chat toggle button
        const chatToggle = document.getElementById('chatToggle');
        if (chatToggle) {
            console.log('✅ Přidávám event listener pro Chat Toggle');
            chatToggle.addEventListener('click', () => {
                const chatPanel = document.getElementById('chatPanel');
                if (chatPanel) {
                    chatPanel.classList.toggle('collapsed');
                    chatToggle.textContent = chatPanel.classList.contains('collapsed') ? '+' : '−';
                }
            });
        }
        
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
                gameOverModal.classList.add('hidden');
            }
        });
    }
    
    // Hall of fame modal close
    const hallOfFameModal = document.getElementById('hallOfFameModal');
    if (hallOfFameModal) {
        hallOfFameModal.addEventListener('click', (e) => {
            if (e.target === hallOfFameModal) {
                hallOfFameModal.classList.add('hidden');
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
                        modal.classList.add('hidden');
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
