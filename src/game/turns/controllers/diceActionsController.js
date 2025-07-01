/**
 * Dice Actions Controller
 * Handles dice rolling, selection, and banking operations
 */

import { gameState, getCurrentPlayer } from '../../gameState.js';
import { rollDice, calculateScore, hasScoringDice, validateDiceSelection } from '../../diceLogic.js';
import { updateGameDisplay } from '../../../ui/gameUI.js';

export class DiceActionsController {
    /**
     * Handles dice rolling for current player
     */
    rollDiceForPlayer() {
        const currentPlayer = getCurrentPlayer();
        console.log(`🎲 ${currentPlayer.name} hází kostkami...`);
        
        try {
            // Roll dice
            const diceResults = rollDice(gameState.availableDice);
            gameState.diceValues = diceResults;
            
            // Check for scoring dice
            const hasScoring = hasScoringDice(diceResults);
            
            if (!hasScoring) {
                this.handleFarkle(currentPlayer);
            } else {
                this.handleSuccessfulRoll(currentPlayer, diceResults);
            }
            
        } catch (error) {
            console.error('Error rolling dice:', error);
            this.handleRollError();
        }
    }

    /**
     * Handles farkle (no scoring dice)
     * @param {Object} player - Current player
     */
    handleFarkle(player) {
        console.log(`💥 FARKLE! ${player.name} nezískal žádné body`);
        
        // Update UI
        updateGameDisplay();
        
        // Show farkle message
        if (window.addChatMessage) {
            window.addChatMessage('system', `💥 FARKLE! ${player.name} nezískal žádné body a končí tah.`);
        }
        
        // Trigger AI reactions
        this.triggerFarkleReactions(player);
        
        // End turn with no score
        setTimeout(() => {
            if (window.playerTurnController) {
                window.playerTurnController.endTurn(false);
            }
        }, 2000);
    }

    /**
     * Handles successful dice roll
     * @param {Object} player - Current player
     * @param {Array} diceResults - Dice roll results
     */
    handleSuccessfulRoll(player, diceResults) {
        console.log(`✅ ${player.name} hodil úspěšně:`, diceResults);
        
        // Update UI
        updateGameDisplay();
        
        // For human players, enable dice selection
        if (player.type === 'human') {
            this.enableDiceSelection();
        }
        
        // Trigger AI reactions for good rolls
        this.triggerGoodRollReactions(player, diceResults);
    }

    /**
     * Enables dice selection for human players
     */
    enableDiceSelection() {
        const rollButton = document.getElementById('rollDiceBtn');
        const bankButton = document.getElementById('bankDiceBtn');
        
        if (rollButton) {
            rollButton.disabled = true;
            rollButton.textContent = 'Vyberte kostky';
        }
        
        if (bankButton) {
            bankButton.disabled = false;
        }
    }

    /**
     * Banks selected dice and adds score
     */
    bankSelectedDice() {
        const currentPlayer = getCurrentPlayer();
        
        try {
            // Validate selection
            if (!validateDiceSelection(gameState.selectedDice, gameState.diceValues)) {
                this.showInvalidSelectionMessage();
                return;
            }
            
            // Calculate score for selected dice
            const selectedValues = gameState.selectedDice.map(index => gameState.diceValues[index]);
            const scoreGained = calculateScore(selectedValues);
            
            if (scoreGained === 0) {
                this.showInvalidSelectionMessage();
                return;
            }
            
            // Add to turn score
            gameState.turnScore += scoreGained;
            
            // Update available dice
            gameState.availableDice -= gameState.selectedDice.length;
            
            // Check for hot dice (all dice used)
            if (gameState.availableDice === 0) {
                this.handleHotDice(currentPlayer);
            } else {
                this.continueAfterBanking(currentPlayer, scoreGained);
            }
            
        } catch (error) {
            console.error('Error banking dice:', error);
            this.showInvalidSelectionMessage();
        }
    }

    /**
     * Shows invalid selection message
     */
    showInvalidSelectionMessage() {
        if (window.addChatMessage) {
            window.addChatMessage('system', '❌ Neplatná kombinace kostek! Vyberte kostky, které mají bodovou hodnotu.');
        }
    }

    /**
     * Handles hot dice situation (all dice used)
     * @param {Object} player - Current player
     */
    handleHotDice(player) {
        console.log(`🔥 HOT DICE! ${player.name} použil všechny kostky`);
        
        // Reset available dice
        gameState.availableDice = 6;
        gameState.selectedDice = [];
        gameState.diceValues = [];
        
        // Update UI
        updateGameDisplay();
        
        // Show hot dice message
        if (window.addChatMessage) {
            window.addChatMessage('system', `🔥 HOT DICE! ${player.name} může pokračovat se všemi 6 kostkami!`);
        }
        
        // Trigger AI reactions
        this.triggerHotDiceReactions(player);
        
        // Continue turn
        if (player.type === 'human') {
            this.enableRollButton();
        }
    }

    /**
     * Continues turn after successful banking
     * @param {Object} player - Current player
     * @param {number} scoreGained - Score gained this roll
     */
    continueAfterBanking(player, scoreGained) {
        console.log(`💰 ${player.name} získal ${scoreGained} bodů`);
        
        // Reset for next roll
        gameState.selectedDice = [];
        gameState.diceValues = [];
        
        // Update UI
        updateGameDisplay();
        
        // Show score message
        if (window.addChatMessage) {
            window.addChatMessage('system', 
                `💰 ${player.name} získal ${scoreGained} bodů. Celkem v tomto tahu: ${gameState.turnScore} bodů.`
            );
        }
        
        // For human players, give choice to continue or end turn
        if (player.type === 'human') {
            this.showContinueOrEndChoice();
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
     * Enables roll button
     */
    enableRollButton() {
        const rollButton = document.getElementById('rollDiceBtn');
        if (rollButton) {
            rollButton.disabled = false;
            rollButton.textContent = 'Hodit kostkami';
        }
    }

    /**
     * Handles dice roll error
     */
    handleRollError() {
        if (window.addChatMessage) {
            window.addChatMessage('system', '❌ Nastala chyba při házení kostkami. Zkuste to znovu.');
        }
        
        // Reset roll button
        this.enableRollButton();
    }

    /**
     * Triggers AI reactions for farkle
     * @param {Object} player - Player who farkled
     */
    triggerFarkleReactions(player) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            if (Math.random() < 0.4) { // 40% chance each AI reacts
                setTimeout(() => {
                    const reaction = window.enhancedAI?.generateAIResponse(aiType, 'farkle', { 
                        playerName: player.name 
                    });
                    if (reaction && window.addChatMessage) {
                        window.addChatMessage(aiType, reaction);
                    }
                }, (index + 1) * 800);
            }
        });
    }

    /**
     * Triggers AI reactions for good rolls
     * @param {Object} player - Player who rolled
     * @param {Array} diceResults - Dice results
     */
    triggerGoodRollReactions(player, diceResults) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            if (Math.random() < 0.3) { // 30% chance each AI reacts
                setTimeout(() => {
                    const reaction = window.enhancedAI?.generateAIResponse(aiType, 'goodRoll', { 
                        playerName: player.name,
                        diceResults: diceResults
                    });
                    if (reaction && window.addChatMessage) {
                        window.addChatMessage(aiType, reaction);
                    }
                }, (index + 1) * 600);
            }
        });
    }

    /**
     * Triggers AI reactions for hot dice
     * @param {Object} player - Player who achieved hot dice
     */
    triggerHotDiceReactions(player) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            setTimeout(() => {
                const reaction = window.enhancedAI?.generateAIResponse(aiType, 'hotDice', { 
                    playerName: player.name 
                });
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiType, reaction);
                }
            }, (index + 1) * 500);
        });
    }
}

// Export singleton instance
export const diceActionsController = new DiceActionsController();
