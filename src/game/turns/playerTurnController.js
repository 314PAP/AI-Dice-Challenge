/**
 * Player Turn Controller
 * Manages individual player turns and turn-based actions
 */

import { gameState, nextPlayer, getCurrentPlayer, checkForWinner } from '../gameState.js';
import { rollDice, calculateScore, hasScoringDice, validateDiceSelection } from '../diceLogic.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer } from '../../ui/gameUI.js';
import { enhancedAI } from '../../ai/enhancedAIController.js';
import { playAITurn } from '../../ai/aiPlayer.js';
import { gameFlowController } from '../flow/gameFlowController.js';

export class PlayerTurnController {
    constructor() {
        this.currentTurnScore = 0;
        this.turnInProgress = false;
        this.diceRolled = false;
    }

    /**
     * Starts a player's turn
     */
    playerTurn() {
        if (!gameState.gameStarted) return;
        
        const currentPlayer = getCurrentPlayer();
        console.log(`🎮 ${currentPlayer.name} začíná tah`);
        
        try {
            this.initializeTurn();
            this.updateTurnUI();
            this.handlePlayerType(currentPlayer);
            
        } catch (error) {
            console.error('Error in player turn:', error);
            this.endTurn(false);
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
     * Handles dice rolling for current player
     */
    rollDiceForPlayer() {
        if (!this.turnInProgress) return;
        
        const currentPlayer = getCurrentPlayer();
        console.log(`🎲 ${currentPlayer.name} hází kostkami...`);
        
        try {
            // Roll dice
            const diceResults = rollDice(gameState.availableDice);
            gameState.diceValues = diceResults;
            this.diceRolled = true;
            
            // Check for scoring dice
            const hasScoring = hasScoringDice(diceResults);
            
            if (!hasScoring) {
                this.handleFarkle(currentPlayer);
            } else {
                this.handleSuccessfulRoll(currentPlayer, diceResults);
            }
            
        } catch (error) {
            console.error('Error rolling dice:', error);
            this.endTurn(false);
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
        setTimeout(() => this.endTurn(false), 2000);
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
        if (!this.turnInProgress || !this.diceRolled) return;
        
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
            this.currentTurnScore += scoreGained;
            
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
     * Ends the current turn
     * @param {boolean} scored - Whether the player scored this turn
     */
    endTurn(scored = true) {
        if (!this.turnInProgress) return;
        
        const currentPlayer = getCurrentPlayer();
        console.log(`🔚 Konec tahu pro ${currentPlayer.name}. Skóroval: ${scored}`);
        
        try {
            this.turnInProgress = false;
            this.diceRolled = false;
            
            // Add turn score to total if scored
            if (scored && gameState.turnScore > 0) {
                this.addScoreToPlayer(currentPlayer, gameState.turnScore);
            }
            
            // Check for winner
            const winner = checkForWinner();
            if (winner) {
                gameFlowController.endGame(winner.name);
                return;
            }
            
            // Move to next player
            this.moveToNextPlayer();
            
        } catch (error) {
            console.error('Error ending turn:', error);
        }
    }

    /**
     * Adds score to player's total
     * @param {Object} player - Player to add score to
     * @param {number} score - Score to add
     */
    addScoreToPlayer(player, score) {
        // Check if player has entered the game (scored at least 300 points in a turn)
        if (!player.hasEntered && score >= 300) {
            player.hasEntered = true;
            if (window.addChatMessage) {
                window.addChatMessage('system', `🎉 ${player.name} vstoupil do hry s ${score} body!`);
            }
        }
        
        // Add score only if player has entered
        if (player.hasEntered) {
            player.score += score;
            
            // Trigger AI reactions for scoring
            this.triggerScoringReactions(player, score);
        } else {
            if (window.addChatMessage) {
                window.addChatMessage('system', 
                    `${player.name} potřebuje alespoň 300 bodů v jednom tahu pro vstup do hry. Získal: ${score}`
                );
            }
        }
    }

    /**
     * Moves to the next player
     */
    moveToNextPlayer() {
        nextPlayer();
        
        // Reset turn state
        gameState.turnScore = 0;
        gameState.selectedDice = [];
        gameState.diceValues = [];
        gameState.availableDice = 6;
        
        // Update UI
        updateScoreboard();
        updateGameDisplay();
        
        // Start next player's turn
        setTimeout(() => this.playerTurn(), 1000);
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
                    const reaction = enhancedAI.generateAIResponse(aiType, 'farkle', { 
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
                    const reaction = enhancedAI.generateAIResponse(aiType, 'goodRoll', { 
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
                const reaction = enhancedAI.generateAIResponse(aiType, 'hotDice', { 
                    playerName: player.name 
                });
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiType, reaction);
                }
            }, (index + 1) * 500);
        });
    }

    /**
     * Triggers AI reactions for scoring
     * @param {Object} player - Player who scored
     * @param {number} score - Score achieved
     */
    triggerScoringReactions(player, score) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            if (score >= 1000 || Math.random() < 0.3) {
                setTimeout(() => {
                    const reaction = enhancedAI.generateAIResponse(aiType, 'scoredPoints', { 
                        playerName: player.name,
                        points: score
                    });
                    if (reaction && window.addChatMessage) {
                        window.addChatMessage(aiType, reaction);
                    }
                }, (index + 1) * 700);
            }
        });
    }

    /**
     * Gets current turn status
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
export const playerTurnController = new PlayerTurnController();

// Legacy compatibility functions
export function playerTurn() {
    return playerTurnController.playerTurn();
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
