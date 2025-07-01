/**
 * Turn Initialization Controller
 * Handles turn setup, state initialization, and UI updates
 */

import { gameState, getCurrentPlayer } from '../../gameState.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer } from '../../../ui/gameUI.js';
import { enhancedAI } from '../../../ai/enhancedAIController.js';
import { playAITurn } from '../../../ai/aiPlayer.js';

export class TurnInitController {
    constructor() {
        this.currentTurnScore = 0;
        this.turnInProgress = false;
        this.diceRolled = false;
    }

    /**
     * Starts a player's turn
     */
    startPlayerTurn() {
        if (!gameState.gameStarted) return;
        
        const currentPlayer = getCurrentPlayer();
        console.log(`🎮 ${currentPlayer.name} začíná tah`);
        
        try {
            this.initializeTurn();
            this.updateTurnUI();
            this.handlePlayerType(currentPlayer);
            
        } catch (error) {
            console.error('Error in player turn:', error);
            this.endTurnWithError();
        }
    }

    /**
     * Initializes turn state
     */
    initializeTurn() {
        this.turnInProgress = true;
        this.diceRolled = false;
        this.currentTurnScore = 0;
        gameState.turnScore = 0;
        gameState.availableDice = 6;
        gameState.selectedDice = [];
        gameState.diceValues = [];
        gameState.isBanking = false;
    }

    /**
     * Updates UI for current turn
     */
    updateTurnUI() {
        updateActivePlayer();
        updateGameDisplay();
        updateScoreboard();
    }

    /**
     * Handles different player types (human vs AI)
     * @param {Object} currentPlayer - Current player object
     */
    handlePlayerType(currentPlayer) {
        if (currentPlayer.type === 'ai') {
            this.handleAITurn(currentPlayer);
        } else {
            this.handleHumanTurn(currentPlayer);
        }
    }

    /**
     * Handles AI player turn
     * @param {Object} aiPlayer - AI player object
     */
    handleAITurn(aiPlayer) {
        console.log(`🤖 AI ${aiPlayer.name} hraje...`);
        
        setTimeout(() => {
            if (window.addChatMessage) {
                window.addChatMessage('system', `🎯 ${aiPlayer.name} je na tahu...`);
            }
            
            // Trigger AI turn start reaction
            const reaction = enhancedAI.generateAIResponse(aiPlayer.aiType || 'ai', 'playerTurnStart', { 
                playerName: aiPlayer.name 
            });
            if (reaction && window.addChatMessage) {
                window.addChatMessage(aiPlayer.aiType || 'ai', reaction);
            }
            
            // Start AI turn
            setTimeout(() => playAITurn(), 1000);
        }, 500);
    }

    /**
     * Handles human player turn
     * @param {Object} humanPlayer - Human player object
     */
    handleHumanTurn(humanPlayer) {
        console.log(`👤 Lidský hráč ${humanPlayer.name} je na tahu`);
        
        if (window.addChatMessage) {
            window.addChatMessage('system', `🎯 ${humanPlayer.name}, jste na tahu! Hoďte kostkami.`);
        }
        
        // Enable roll dice button
        this.enableRollButton();
    }

    /**
     * Enables the roll dice button
     */
    enableRollButton() {
        const rollButton = document.getElementById('rollDiceBtn');
        if (rollButton) {
            rollButton.disabled = false;
            rollButton.textContent = 'Hodit kostkami';
        }
    }

    /**
     * Disables the roll dice button
     */
    disableRollButton() {
        const rollButton = document.getElementById('rollDiceBtn');
        if (rollButton) {
            rollButton.disabled = true;
        }
    }

    /**
     * Shows continue or end turn choice for human players
     */
    showContinueOrEndChoice() {
        const rollButton = document.getElementById('rollDiceBtn');
        const endTurnButton = document.getElementById('endTurnBtn');
        
        if (rollButton) {
            rollButton.disabled = false;
            rollButton.textContent = 'Hodit znovu';
        }
        
        if (endTurnButton) {
            endTurnButton.disabled = false;
        }
    }

    /**
     * Handles turn initialization error
     */
    endTurnWithError() {
        this.turnInProgress = false;
        this.diceRolled = false;
        
        if (window.addChatMessage) {
            window.addChatMessage('system', '❌ Nastala chyba při zahájení tahu. Přepínám na dalšího hráče.');
        }
        
        // Move to next player after error
        setTimeout(() => {
            if (window.playerTurnController) {
                window.playerTurnController.moveToNextPlayer();
            }
        }, 1000);
    }

    /**
     * Gets current turn initialization status
     * @returns {Object} Turn status information
     */
    getTurnStatus() {
        return {
            turnInProgress: this.turnInProgress,
            diceRolled: this.diceRolled,
            currentTurnScore: this.currentTurnScore,
            currentPlayer: getCurrentPlayer()
        };
    }
}

// Export singleton instance
export const turnInitController = new TurnInitController();
