/**
 * Player Turn Controller - Refactored
 * Main controller that coordinates all turn-related modules
 * Replaced 554-line monolithic file with modular architecture
 */

// Import all turn controller modules
import { turnInitController } from './controllers/turnInitController.js';
import { diceActionsController } from './controllers/diceActionsController.js';
import { turnCompletionController } from './controllers/turnCompletionController.js';
import { getCurrentPlayer } from '../gameState.js';

export class PlayerTurnController {
    constructor() {
        this.turnInit = turnInitController;
        this.diceActions = diceActionsController;
        this.turnCompletion = turnCompletionController;
    }

    /**
     * Starts a player's turn - delegates to turn initialization controller
     */
    startPlayerTurn() {
        return this.turnInit.startPlayerTurn();
    }

    /**
     * Handles dice rolling - delegates to dice actions controller
     */
    rollDiceForPlayer() {
        return this.diceActions.rollDiceForPlayer();
    }

    /**
     * Banks selected dice - delegates to dice actions controller
     */
    bankSelectedDice() {
        return this.diceActions.bankSelectedDice();
    }

    /**
     * Ends the current turn - delegates to turn completion controller
     */
    endTurn(scored = true) {
        return this.turnCompletion.endTurn(scored);
    }

    /**
     * Moves to the next player - delegates to turn completion controller
     */
    moveToNextPlayer() {
        return this.turnCompletion.moveToNextPlayer();
    }

    /**
     * Gets current turn status - aggregates from all controllers
     * @returns {Object} Turn status information
     */
    getTurnStatus() {
        const initStatus = this.turnInit.getTurnStatus();
        
        return {
            ...initStatus,
            currentPlayer: getCurrentPlayer(),
            controllers: {
                turnInit: this.turnInit,
                diceActions: this.diceActions,
                turnCompletion: this.turnCompletion
            }
        };
    }

    /**
     * Enables dice selection for human players
     */
    enableDiceSelection() {
        return this.diceActions.enableDiceSelection();
    }

    /**
     * Shows continue or end turn choice
     */
    showContinueOrEndChoice() {
        return this.turnInit.showContinueOrEndChoice();
    }

    /**
     * Handles farkle situation
     * @param {Object} player - Player who farkled
     */
    handleFarkle(player) {
        return this.diceActions.handleFarkle(player);
    }

    /**
     * Handles hot dice situation
     * @param {Object} player - Player who achieved hot dice
     */
    handleHotDice(player) {
        return this.diceActions.handleHotDice(player);
    }

    /**
     * Adds score to player
     * @param {Object} player - Player to add score to
     * @param {number} score - Score to add
     */
    addScoreToPlayer(player, score) {
        return this.turnCompletion.addScoreToPlayer(player, score);
    }
}

// Export singleton instance
export const playerTurnController = new PlayerTurnController();

// Legacy compatibility functions for backward compatibility
export function playerTurn() {
    return playerTurnController.startPlayerTurn();
}

export function rollDiceForPlayer() {
    return playerTurnController.rollDiceForPlayer();
}

export function bankSelectedDice() {
    return playerTurnController.bankSelectedDice();
}

export function endTurn(scored = true) {
    return playerTurnController.endTurn(scored);
}

// Expose to window for global access
window.playerTurnController = playerTurnController;
