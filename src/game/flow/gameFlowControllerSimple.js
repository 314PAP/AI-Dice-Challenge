/**
 * Game Flow Controller - Simplified Wrapper
 * Simplified version for basic game flow management
 */

export class GameFlowController {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isInitialized = false;
    }

    /**
     * Initializes the game system
     */
    async initialize() {
        console.log('🎮 Initializing Game Flow Controller (Simplified)...');
        
        try {
            // Setup basic game flow
            this.setupGameFlowEvents();
            this.isInitialized = true;
            console.log('✅ Game Flow Controller initialized');
        } catch (error) {
            console.error('Error initializing game flow:', error);
        }
    }

    /**
     * Setup basic game flow events
     */
    setupGameFlowEvents() {
        // Event listeners for game flow
        if (this.gameEngine) {
            this.gameEngine.on('gameStart', (data) => {
                console.log('🚀 Game started with target score:', data.targetScore);
            });

            this.gameEngine.on('gameEnd', (data) => {
                console.log('🏁 Game ended, winner:', data.winner);
            });
        }
    }

    /**
     * Starts a new game
     */
    startGame(targetScore) {
        if (!this.isInitialized) {
            console.warn('Game Flow Controller not initialized');
            return false;
        }

        if (this.gameEngine) {
            return this.gameEngine.startGame(targetScore);
        }

        return false;
    }

    /**
     * Ends the current game
     */
    endGame(winner) {
        if (this.gameEngine) {
            this.gameEngine.endGame(winner);
        }
    }

    /**
     * Resets the game
     */
    resetGame() {
        if (this.gameEngine) {
            this.gameEngine.resetGame();
        }
    }

    /**
     * Get initialization status
     */
    getInitialized() {
        return this.isInitialized;
    }
}

export default GameFlowController;
