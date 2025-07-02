/**
 * Game Event Controller
 * Manages DOM event listeners and user interactions
 */

import { gameFlowController } from '../flow/gameFlowController.js';
import { playerTurnController } from '../turns/playerTurnController.js';
import { diceInteractionController } from '../dice/diceInteractionController.js';

export class GameEventController {
    constructor() {
        this.isInitialized = false;
        this.eventListeners = new Map();
    }

    /**
     * Sets up all game event listeners
     */
    setupEventListeners() {
        if (this.isInitialized) {
            console.warn('Event listeners already set up');
            return;
        }

        console.log('🎮 Setting up game event listeners...');

        try {
            this.setupGameControlListeners();
            this.setupDiceListeners();
            this.setupUIListeners();
            this.setupKeyboardListeners();
            
            this.isInitialized = true;
            console.log('✅ All event listeners set up');
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    /**
     * Sets up game control event listeners
     */
    setupGameControlListeners() {
        // Start game button
        this.addListener('startGameBtn', 'click', () => {
            if (gameFlowController.canStartGame()) {
                gameFlowController.startGame();
                playerTurnController.playerTurn();
            }
        });

        // Roll dice button
        this.addListener('rollDiceBtn', 'click', () => {
            playerTurnController.rollDiceForPlayer();
        });

        // Bank dice button
        this.addListener('bankDiceBtn', 'click', () => {
            playerTurnController.bankSelectedDice();
        });

        // End turn button
        this.addListener('endTurnBtn', 'click', () => {
            playerTurnController.endTurn(true);
        });

        // New game button
        this.addListener('newGameBtn', 'click', () => {
            gameFlowController.resetGame();
        });

        // Save score button
        this.addListener('saveScoreBtn', 'click', () => {
            this.saveScore();
        });

        // Return to menu button
        this.addListener('returnMenuBtn', 'click', () => {
            gameFlowController.returnToMainMenu();
        });
    }

    /**
     * Sets up dice interaction listeners
     */
    setupDiceListeners() {
        // Dice container click delegation
        const diceContainer = document.getElementById('diceContainer');
        if (diceContainer) {
            this.eventListeners.set('diceContainer', {
                element: diceContainer,
                type: 'click',
                handler: (event) => {
                    const dieElement = event.target.closest('[data-dice-index]');
                    if (dieElement) {
                        const index = parseInt(dieElement.dataset.diceIndex);
                        diceInteractionController.selectDie(index);
                    }
                }
            });
            
            diceContainer.addEventListener('click', this.eventListeners.get('diceContainer').handler);
        }

        // Auto-select best button
        this.addListener('autoSelectBtn', 'click', () => {
            diceInteractionController.autoSelectBest();
        });

        // Clear selection button
        this.addListener('clearSelectionBtn', 'click', () => {
            diceInteractionController.clearSelection();
        });
    }

    /**
     * Sets up UI-related listeners
     */
    setupUIListeners() {
        // Target score input validation
        this.addListener('targetScoreInput', 'input', (event) => {
            this.validateTargetScore(event.target);
        });

        // Toggle chat button
        this.addListener('toggleChatBtn', 'click', () => {
            this.toggleChatVisibility();
        });

        // Toggle sound button
        this.addListener('toggleSoundBtn', 'click', () => {
            this.toggleSound();
        });

        // Settings button
        this.addListener('settingsBtn', 'click', () => {
            this.showSettings();
        });

        // Hall of Fame button
        this.addListener('hallOfFameBtn', 'click', () => {
            this.showHallOfFame();
        });
    }

    /**
     * Sets up keyboard shortcuts
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (event) => {
            // Only handle if not typing in input
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (event.key.toLowerCase()) {
                case ' ':
                case 'enter':
                    event.preventDefault();
                    this.handleSpacebarAction();
                    break;
                case 'r':
                    event.preventDefault();
                    playerTurnController.rollDiceForPlayer();
                    break;
                case 'b':
                    event.preventDefault();
                    playerTurnController.bankSelectedDice();
                    break;
                case 'e':
                    event.preventDefault();
                    playerTurnController.endTurn(true);
                    break;
                case 'c':
                    event.preventDefault();
                    diceInteractionController.clearSelection();
                    break;
                case 'a':
                    event.preventDefault();
                    diceInteractionController.autoSelectBest();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6': {
                    event.preventDefault();
                    const diceIndex = parseInt(event.key) - 1;
                    diceInteractionController.selectDie(diceIndex);
                    break;
                }
            }
        });
    }

    /**
     * Adds an event listener and tracks it
     * @param {string} elementId - ID of the element
     * @param {string} eventType - Type of event
     * @param {Function} handler - Event handler function
     */
    addListener(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            this.eventListeners.set(elementId, {
                element,
                type: eventType,
                handler
            });
            
            element.addEventListener(eventType, handler);
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }
    }

    /**
     * Handles spacebar/enter actions based on context
     */
    handleSpacebarAction() {
        const rollBtn = document.getElementById('rollDiceBtn');
        const bankBtn = document.getElementById('bankDiceBtn');
        const startBtn = document.getElementById('startGameBtn');

        // Priority: Start game > Roll dice > Bank dice
        if (startBtn && !startBtn.disabled) {
            startBtn.click();
        } else if (rollBtn && !rollBtn.disabled) {
            rollBtn.click();
        } else if (bankBtn && !bankBtn.disabled) {
            bankBtn.click();
        }
    }

    /**
     * Validates target score input
     * @param {HTMLInputElement} input - Target score input element
     */
    validateTargetScore(input) {
        const value = parseInt(input.value);
        const startBtn = document.getElementById('startGameBtn');
        
        if (isNaN(value) || value < 1000) {
            input.style.borderColor = '#ff3333';
            if (startBtn) startBtn.disabled = true;
        } else {
            input.style.borderColor = '#39ff14';
            if (startBtn) startBtn.disabled = false;
        }
    }

    /**
     * Toggles chat visibility
     */
    toggleChatVisibility() {
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            chatContainer.style.display = 
                chatContainer.style.display === 'none' ? 'block' : 'none';
        }
    }

    /**
     * Toggles sound on/off
     */
    toggleSound() {
        // Sound toggle logic would go here
        console.log('🔊 Sound toggled');
    }

    /**
     * Shows settings modal
     */
    showSettings() {
        // Settings modal logic would go here
        console.log('⚙️ Settings opened');
    }

    /**
     * Shows hall of fame
     */
    showHallOfFame() {
        import('../../utils/hallOfFame.js').then(module => {
            module.displayHallOfFame();
        });
    }

    /**
     * Saves current score
     */
    saveScore() {
        try {
            import('../../utils/hallOfFame.js').then(module => {
                module.saveScore();
            });
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }

    /**
     * Removes all event listeners
     */
    removeAllListeners() {
        this.eventListeners.forEach((listener, _elementId) => {
            listener.element.removeEventListener(listener.type, listener.handler);
        });
        
        this.eventListeners.clear();
        this.isInitialized = false;
        
        console.log('🧹 All event listeners removed');
    }

    /**
     * Gets event listener status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            listenerCount: this.eventListeners.size,
            listeners: Array.from(this.eventListeners.keys())
        };
    }
}

// Export singleton instance
export const gameEventController = new GameEventController();

// Legacy compatibility function
export function setupEventListeners() {
    return gameEventController.setupEventListeners();
}
