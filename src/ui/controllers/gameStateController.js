/**
 * Game State Management Controller
 * Handles game initialization, state management, and game flow coordination
 */

export class GameStateController {
    constructor() {
        this.isInitialized = false;
        this.gameController = null;
    }

    /**
     * Spustí novou hru
     */
    startNewGame() {
        console.log('🔄 Starting new game...');
        this.closeGameOverModal();
        
        // Reset UI
        this.resetGameUI();
        this.resetPlayerScores();
        this.resetDiceContainer();
        this.resetTurnInfo();
        this.clearChat();
        
        this.addChatMessage('Systém', '🎮 Připraveno pro novou hru! Nastavte cílové skóre a začněte.');
    }

    /**
     * Resets game UI elements
     */
    resetGameUI() {
        const gameControls = document.getElementById('gameControls');
        const targetScoreSetup = document.getElementById('targetScoreSetup');
        
        if (gameControls && targetScoreSetup) {
            gameControls.style.display = 'none';
            gameControls.classList.add('hidden');
            targetScoreSetup.style.display = 'block';
        }
    }

    /**
     * Resets all player scores to 0
     */
    resetPlayerScores() {
        const scoreElements = [
            'humanScore',
            'geminiScore', 
            'chatgptScore',
            'claudeScore'
        ];
        
        scoreElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = '0';
            }
        });
    }

    /**
     * Resets dice container
     */
    resetDiceContainer() {
        const diceContainer = document.getElementById('diceContainer');
        if (diceContainer) {
            diceContainer.innerHTML = '';
        }
    }

    /**
     * Resets turn information display
     */
    resetTurnInfo() {
        const turnInfo = document.getElementById('turnInfo');
        const currentTurnScore = document.getElementById('currentTurnScore');
        
        if (turnInfo) turnInfo.textContent = 'Váš tah!';
        if (currentTurnScore) currentTurnScore.textContent = 'Skóre tahu: 0';
    }

    /**
     * Clears chat messages
     */
    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }

    /**
     * Návrat do hlavního menu
     */
    returnToMainMenu() {
        console.log('🏠 Returning to main menu...');
        this.startNewGame(); // Same as new game for now
    }

    /**
     * Zavře game over modal
     */
    closeGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            modal.style.display = 'none';
        }
    }

    /**
     * Fallback funkcionalita pro základní operace
     */
    setupBasicFallback() {
        console.log('🔄 Setting up basic fallback functionality...');
        
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                document.getElementById('targetScoreSetup').style.display = 'none';
                document.getElementById('gameControls').style.display = 'block';
                this.addChatMessage('Systém', '🎮 Hra spuštěna (základní režim)!');
            });
        }
        
        const quitGameBtn = document.getElementById('quitGameBtn');
        if (quitGameBtn) {
            quitGameBtn.addEventListener('click', () => {
                if (confirm('Opravdu chcete opustit hru?')) {
                    document.getElementById('gameControls').style.display = 'none';
                    document.getElementById('targetScoreSetup').style.display = 'block';
                    this.addChatMessage('Systém', '🚪 Hra byla opuštěna');
                }
            });
        }
    }

    /**
     * Initializes the game state controller
     * @param {Object} gameController - Reference to main game controller
     */
    async initialize(gameController) {
        console.log('🎮 Inicializuji Game State Controller...');
        
        try {
            this.gameController = gameController;
            
            if (gameController) {
                await gameController.initialize();
            }
            
            this.isInitialized = true;
            console.log('✅ Game State Controller inicializován');
            
            // Uvítací zpráva
            setTimeout(() => {
                this.addChatMessage('Systém', '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!');
            }, 500);
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci Game State:', error);
            this.setupBasicFallback();
        }
    }

    /**
     * Gets current initialization status
     * @returns {boolean} Whether controller is initialized
     */
    isControllerInitialized() {
        return this.isInitialized;
    }

    /**
     * Sets game controller reference
     * @param {Object} gameController - Game controller instance
     */
    setGameController(gameController) {
        this.gameController = gameController;
    }

    /**
     * Gets game controller reference
     * @returns {Object} Game controller instance
     */
    getGameController() {
        return this.gameController;
    }

    /**
     * Handles initialization error
     * @param {Error} error - Initialization error
     */
    handleInitializationError(error) {
        console.error('❌ Initialization error:', error);
        this.setupBasicFallback();
        this.addChatMessage('Systém', '⚠️ Nastala chyba při inicializaci. Spuštěn záložní režim.');
    }

    /**
     * Helper method to add chat messages
     * @param {string} sender - Message sender
     * @param {string} message - Message content
     */
    addChatMessage(sender, message) {
        if (window.addChatMessage) {
            window.addChatMessage(sender, message);
        }
    }
}

// Export singleton instance
export const gameStateController = new GameStateController();
