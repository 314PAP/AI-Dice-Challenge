/**
 * Game Flow Controller
 * Manages high-level game flow: start, end, initialization
 */

import { gameState, resetGameState } from '../gameState.js';
import { updateGameDisplay, updateScoreboard } from '../../ui/gameUI.js';
import { enhancedAI } from '../../ai/enhancedAIController.js';
import { saveGameResult, displayHallOfFame, createGameResult } from '../../utils/hallOfFame.js';

export class GameFlowController {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initializes the game system
     */
    initialize() {
        console.log('🎮 Initializing game logic...');
        
        try {
            updateScoreboard();
            updateGameDisplay();
            this.isInitialized = true;
            console.log('✅ Game logic initialized');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    /**
     * Starts a new game
     */
    startGame() {
        console.log('🎮 Starting game...');
        
        try {
            const targetScoreInput = document.getElementById('targetScoreInput');
            gameState.targetScore = parseInt(targetScoreInput.value);
            gameState.gameStarted = true;
            gameState.gameStartTime = new Date();
            
            // Update target score display
            const targetScoreDisplay = document.getElementById('targetScoreDisplay');
            if (targetScoreDisplay) {
                targetScoreDisplay.textContent = gameState.targetScore;
            }

            // Update UI
            this.updateGameUI();
            
            // Send game start messages
            this.sendGameStartMessages();
            
            console.log(`✅ Game started with target score: ${gameState.targetScore}`);
            
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }

    /**
     * Ends the current game
     * @param {string} winner - Name of the winning player
     */
    endGame(winner) {
        console.log(`🎮 Game ending. Winner: ${winner}`);
        
        try {
            gameState.gameStarted = false;
            gameState.gameEndTime = new Date();
            
            // Create and save game result
            const gameResult = createGameResult(winner, gameState);
            saveGameResult(gameResult);
            
            // Update UI
            this.showGameEndUI(winner, gameResult);
            
            // Trigger AI reactions
            this.triggerGameEndReactions(winner);
            
            console.log('✅ Game ended successfully');
            
        } catch (error) {
            console.error('Error ending game:', error);
        }
    }

    /**
     * Updates game UI for game start
     */
    updateGameUI() {
        const targetScoreSetup = document.getElementById('targetScoreSetup');
        const gameControls = document.getElementById('gameControls');
        
        if (targetScoreSetup) {
            targetScoreSetup.style.display = 'none';
        }
        
        if (gameControls) {
            gameControls.style.display = 'block';
            console.log('✅ Game controls displayed');
        }
    }

    /**
     * Sends messages when game starts
     */
    sendGameStartMessages() {
        // System message
        if (window.addChatMessage) {
            window.addChatMessage('system', 
                `🎮 Hra začala! První hráč, který dosáhne ${gameState.targetScore} bodů, vyhrává!`
            );
        }
        
        // AI introduction messages
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        aiTypes.forEach((aiType, index) => {
            setTimeout(() => {
                const reaction = enhancedAI.generateAIResponse(aiType, 'hello');
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiType, reaction);
                }
            }, 1000 + (index * 1500));
        });
    }

    /**
     * Shows game end UI
     * @param {string} winner - Name of the winner
     * @param {Object} gameResult - Game result data
     */
    showGameEndUI(winner, gameResult) {
        // Show winner message
        if (window.addChatMessage) {
            window.addChatMessage('system', 
                `🎉 Hra skončila! Vítězem je ${winner} s ${gameResult.winnerScore} body!`
            );
        }
        
        // Update scoreboard and display
        updateScoreboard();
        updateGameDisplay();
        
        // Show hall of fame
        setTimeout(() => {
            displayHallOfFame();
        }, 2000);
        
        // Show game controls
        this.showEndGameControls();
    }

    /**
     * Shows end game controls
     */
    showEndGameControls() {
        const gameArea = document.getElementById('gameArea');
        const gameOverControls = document.getElementById('gameOverControls');
        
        if (gameArea) {
            gameArea.style.display = 'none';
        }
        
        if (gameOverControls) {
            gameOverControls.style.display = 'block';
        }
    }

    /**
     * Triggers AI reactions to game ending
     * @param {string} winner - Name of the winner
     */
    triggerGameEndReactions(winner) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            setTimeout(() => {
                const reaction = enhancedAI.generateAIResponse(aiType, 'gameOver', { winnerName: winner });
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiType, reaction);
                }
            }, (index + 1) * 1000);
        });
    }

    /**
     * Resets the game to initial state
     */
    resetGame() {
        console.log('🎮 Resetting game...');
        
        try {
            // Reset game state
            resetGameState();
            
            // Update UI
            updateScoreboard();
            updateGameDisplay();
            
            // Show setup UI
            this.showSetupUI();
            
            // Clear chat messages if needed
            this.clearGameMessages();
            
            console.log('✅ Game reset successfully');
            
        } catch (error) {
            console.error('Error resetting game:', error);
        }
    }

    /**
     * Shows game setup UI
     */
    showSetupUI() {
        const targetScoreSetup = document.getElementById('targetScoreSetup');
        const gameControls = document.getElementById('gameControls');
        const gameArea = document.getElementById('gameArea');
        const gameOverControls = document.getElementById('gameOverControls');
        
        if (targetScoreSetup) {
            targetScoreSetup.style.display = 'block';
        }
        
        if (gameControls) {
            gameControls.style.display = 'none';
        }
        
        if (gameArea) {
            gameArea.style.display = 'block';
        }
        
        if (gameOverControls) {
            gameOverControls.style.display = 'none';
        }
    }

    /**
     * Clears game-related chat messages
     */
    clearGameMessages() {
        // This could be enhanced to selectively clear only game messages
        // For now, we'll just announce the reset
        if (window.addChatMessage) {
            window.addChatMessage('system', '🔄 Hra byla resetována. Můžete začít novou hru!');
        }
    }

    /**
     * Returns to main menu
     */
    returnToMainMenu() {
        console.log('🎮 Returning to main menu...');
        
        try {
            this.resetGame();
            
            // Additional main menu logic could go here
            if (window.addChatMessage) {
                window.addChatMessage('system', '🏠 Návrat do hlavního menu');
            }
            
        } catch (error) {
            console.error('Error returning to main menu:', error);
        }
    }

    /**
     * Gets current game status
     * @returns {Object} Game status information
     */
    getGameStatus() {
        return {
            isInitialized: this.isInitialized,
            gameStarted: gameState.gameStarted,
            targetScore: gameState.targetScore,
            currentPlayer: gameState.currentPlayer,
            gameStartTime: gameState.gameStartTime,
            gameEndTime: gameState.gameEndTime
        };
    }

    /**
     * Checks if game is ready to start
     * @returns {boolean} True if game can start
     */
    canStartGame() {
        const targetScoreInput = document.getElementById('targetScoreInput');
        return targetScoreInput && 
               parseInt(targetScoreInput.value) >= 1000 && 
               !gameState.gameStarted;
    }
}

// Export singleton instance
export const gameFlowController = new GameFlowController();

// Legacy compatibility functions
export function initializeGame() {
    return gameFlowController.initialize();
}

export function startGame() {
    return gameFlowController.startGame();
}

export function endGame(winner) {
    return gameFlowController.endGame(winner);
}

export function resetGame() {
    return gameFlowController.resetGame();
}

export function returnToMainMenu() {
    return gameFlowController.returnToMainMenu();
}
