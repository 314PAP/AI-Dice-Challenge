/**
 * Turn Completion Controller
 * Handles turn ending, scoring, and player transitions
 */

import { gameState, nextPlayer, getCurrentPlayer, checkForWinner } from '../../gameState.js';
import { updateGameDisplay, updateScoreboard } from '../../../ui/gameUI.js';
import { enhancedAI } from '../../../ai/enhancedAIController.js';

export class TurnCompletionController {
    /**
     * Ends the current turn
     * @param {boolean} scored - Whether the player scored this turn
     */
    endTurn(scored = true) {
        const currentPlayer = getCurrentPlayer();
        console.log(`🔚 Konec tahu pro ${currentPlayer.name}. Skóroval: ${scored}`);
        
        try {
            // Add turn score to total if scored
            if (scored && gameState.turnScore > 0) {
                this.addScoreToPlayer(currentPlayer, gameState.turnScore);
            }
            
            // Check for winner
            const winner = checkForWinner();
            if (winner) {
                this.handleGameEnd(winner);
                return;
            }
            
            // Move to next player
            this.moveToNextPlayer();
            
        } catch (error) {
            console.error('Error ending turn:', error);
            this.handleTurnEndError();
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
            
            // Check for milestone scores
            this.checkScoreMilestones(player, score);
        } else {
            if (window.addChatMessage) {
                window.addChatMessage('system', 
                    `${player.name} potřebuje alespoň 300 bodů v jednom tahu pro vstup do hry. Získal: ${score}`
                );
            }
        }
    }

    /**
     * Checks for score milestones and triggers appropriate reactions
     * @param {Object} player - Player who scored
     * @param {number} score - Score achieved this turn
     */
    checkScoreMilestones(player, score) {
        // High score achievements
        if (score >= 1000) {
            this.triggerHighScoreReaction(player, score);
        }
        
        // First to reach certain thresholds
        const milestones = [2000, 5000, 8000];
        milestones.forEach(milestone => {
            if (player.score >= milestone && player.score - score < milestone) {
                this.triggerMilestoneReaction(player, milestone);
            }
        });
        
        // Close to target score
        const percentageToTarget = player.score / gameState.targetScore;
        if (percentageToTarget >= 0.8 && percentageToTarget < 0.9) {
            this.triggerCloseToWinReaction(player);
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
        setTimeout(() => {
            if (window.playerTurnController) {
                window.playerTurnController.startPlayerTurn();
            }
        }, 1000);
    }

    /**
     * Handles game end when winner is found
     * @param {Object} winner - Winning player
     */
    handleGameEnd(winner) {
        console.log(`🏆 Hra končí! Vítěz: ${winner.name}`);
        
        if (window.gameFlowController) {
            window.gameFlowController.endGame(winner.name);
        }
        
        // Trigger final AI reactions
        this.triggerGameEndReactions(winner);
    }

    /**
     * Handles turn end error
     */
    handleTurnEndError() {
        if (window.addChatMessage) {
            window.addChatMessage('system', '❌ Nastala chyba při ukončování tahu. Pokračuji na dalšího hráče.');
        }
        
        // Force move to next player
        setTimeout(() => this.moveToNextPlayer(), 1000);
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
     * Triggers reaction for high score achievement
     * @param {Object} player - Player who achieved high score
     * @param {number} score - High score achieved
     */
    triggerHighScoreReaction(player, score) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const highScoreReactions = {
            gemini: [`Exceptional performance! ${score} points calculated. Probability: 5.2% 📊⚡`],
            chatgpt: [`WOOOOW! ${score} points?! That's INSANE! 🤯🔥`],
            claude: [`${score} bodů... to je mistrný výkon! 🎯✨`]
        };
        
        const reaction = highScoreReactions[selectedAI][0];
        if (window.addChatMessage) {
            window.addChatMessage(selectedAI, reaction);
        }
    }

    /**
     * Triggers reaction for milestone achievement
     * @param {Object} player - Player who reached milestone
     * @param {number} milestone - Milestone reached
     */
    triggerMilestoneReaction(player, milestone) {
        if (window.addChatMessage) {
            window.addChatMessage('system', `🎯 ${player.name} dosáhl ${milestone} bodů!`);
        }
        
        // AI reactions to milestones
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        setTimeout(() => {
            const reaction = enhancedAI.generateAIResponse(selectedAI, 'milestone', { 
                playerName: player.name,
                milestone: milestone
            });
            if (reaction && window.addChatMessage) {
                window.addChatMessage(selectedAI, reaction);
            }
        }, 1000);
    }

    /**
     * Triggers reaction when player is close to winning
     * @param {Object} player - Player close to winning
     */
    triggerCloseToWinReaction(player) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            setTimeout(() => {
                const reaction = enhancedAI.generateAIResponse(aiType, 'closeToWin', { 
                    playerName: player.name 
                });
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiType, reaction);
                }
            }, (index + 1) * 400);
        });
    }

    /**
     * Triggers final reactions when game ends
     * @param {Object} winner - Winning player
     */
    triggerGameEndReactions(winner) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        aiTypes.forEach((aiType, index) => {
            setTimeout(() => {
                const reaction = enhancedAI.generateAIResponse(aiType, 'gameOver', { 
                    winner: winner.name 
                });
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiType, reaction);
                }
            }, (index + 1) * 600);
        });
    }
}

// Export singleton instance
export const turnCompletionController = new TurnCompletionController();
