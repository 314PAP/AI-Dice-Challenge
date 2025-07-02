/**
 * AI Player Controller - Refactored for new gameState structure
 * Handles AI player logic using new Farkle rules (no rollsLeft, uses availableDice)
 */

import { gameState, getCurrentPlayer, nextPlayer } from '../game/gameState.js';
import { rollDice, calculateScore, getAllScoringCombinations } from '../game/diceLogic.js';
import { updateGameDisplay } from '../ui/gameUI.js';
import { generateAIGameReaction, enhancedAI } from '../../ai/controllers/enhancedAIController.js';
import { endTurn } from '../game/gameController.js';

// Array to track active AI timeouts
let activeAITimeouts = [];

/**
 * Clears all active AI timeouts
 */
export function clearAllAITimeouts() {
    console.log(`🚫 Clearing ${activeAITimeouts.length} active AI timeouts...`);
    activeAITimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeAITimeouts = [];
}

/**
 * Wrapper for setTimeout that tracks timeouts
 */
export function createAITimeout(callback, delay) {
    const timeoutId = setTimeout(() => {
        // Remove from active timeouts when executed
        activeAITimeouts = activeAITimeouts.filter(id => id !== timeoutId);
        // Only execute if game is still running
        if (!gameState.gameEnded && gameState.gameStarted) {
            callback();
        }
    }, delay);
    
    activeAITimeouts.push(timeoutId);
    return timeoutId;
}

/**
 * Spustí tah AI hráče
 */
export function playAITurn() {
    // Check if game is still running
    if (gameState.gameEnded || !gameState.gameStarted) {
        console.log('🚫 AI turn cancelled - game not running');
        return;
    }
    
    const aiPlayer = getCurrentPlayer();
    console.log(`🤖 Starting AI turn for ${aiPlayer.name}`);
    
    // Reset turn state
    gameState.currentTurnScore = 0;
    gameState.diceValues = [];
    gameState.selectedDice = [];
    gameState.bankedDiceThisTurn = [];
    gameState.availableDice = 6;
    gameState.mustBankDice = false;
    
    // Start with first roll
    createAITimeout(() => playAIRoll(), 1000);
}

/**
 * Provede hod kostkami pro AI
 */
function playAIRoll() {
    // Check if game is still running
    if (gameState.gameEnded || !gameState.gameStarted) {
        console.log('🚫 AI roll cancelled - game not running');
        return;
    }
    
    const aiPlayer = getCurrentPlayer();

    // Check if AI can roll
    if (gameState.availableDice <= 0) {
        console.warn(`AI ${aiPlayer.name} cannot roll: no available dice`);
        return;
    }
    
    console.log(`🎲 AI ${aiPlayer.name} rolling ${gameState.availableDice} dice...`);
    
    // Roll available dice
    const diceResults = rollDice(gameState.availableDice);
    gameState.diceValues = diceResults.map(die => die.value);
    gameState.selectedDice = [];
    
    const rollScore = calculateScore(gameState.diceValues);
    
    window.addChatMessage && window.addChatMessage('system', 
        `${aiPlayer.name} hodil: ${gameState.diceValues.join(', ')} - Možné body z hodu: ${rollScore}`);
    
    if (rollScore === 0) {
        // FARKLE - no scoring dice
        console.log(`❌ AI ${aiPlayer.name}: FARKLE!`);
        
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'farkle');
        if (reaction && window.addChatMessage) {
            window.addChatMessage(aiPlayer.type, reaction);
        }
        
        window.addChatMessage && window.addChatMessage('system', 
            `❌ ${aiPlayer.name} neměl žádné bodující kostky! FARKLE! Tah končí s 0 body.`);
        
        createAITimeout(() => {
            console.log(`🔄 AI ${aiPlayer.name}: Ending turn after FARKLE...`);
            endTurn();
        }, 2000);
        
        return;
    }
    
    // Has scoring dice - decide what to bank
    const bestCombination = findBestScoringCombination(gameState.diceValues);
    
    if (bestCombination && bestCombination.score > 0) {
        // Bank the best scoring combination
        gameState.currentTurnScore += bestCombination.score;
        gameState.bankedDiceThisTurn.push(...bestCombination.dice);
        gameState.availableDice -= bestCombination.dice.length;
        
        // Clear current roll data
        gameState.diceValues = [];
        gameState.selectedDice = [];
        
        window.addChatMessage && window.addChatMessage('system', 
            `${aiPlayer.name} odložil: ${bestCombination.dice.join(', ')} za ${bestCombination.score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`);
        
        // Check for HOT DICE
        if (gameState.availableDice === 0) {
            gameState.availableDice = 6; // Reset to 6 dice
            gameState.diceValues = []; // Clear previous dice display
            gameState.selectedDice = []; // Clear selected dice
            gameState.bankedDiceThisTurn = []; // Clear banked dice visual
            gameState.mustBankDice = false; // AI can roll immediately
            window.addChatMessage && window.addChatMessage('system', 
                `🔥 ${aiPlayer.name} odložil všechny kostky! HOT DICE! Pokračuje s novými kostkami.`);
            
            // AI reaction to hot dice
            const hotDiceReaction = enhancedAI.generateAIResponse(aiPlayer.type, 'hotDice');
            if (hotDiceReaction) {
                createAITimeout(() => window.addChatMessage && window.addChatMessage(aiPlayer.type, hotDiceReaction), 500);
            }
            
            // Continue with new dice
            createAITimeout(() => {
                updateGameDisplay();
                playAIRoll();
            }, 2000);
            return;
        }
        
        // Decide whether to continue or end turn
        const shouldContinue = decideAIAction(aiPlayer);
        
        if (shouldContinue && gameState.availableDice > 0) {
            // Continue rolling
            createAITimeout(() => {
                playAIRoll();
            }, 2000);
        } else {
            // End turn
            createAITimeout(() => {
                console.log(`🏁 AI ${aiPlayer.name}: Ending turn with ${gameState.currentTurnScore} points`);
                
                const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'endTurn', {
                    score: gameState.currentTurnScore
                });
                if (reaction && window.addChatMessage) {
                    window.addChatMessage(aiPlayer.type, reaction);
                }
                
                endTurn();
            }, 2000);
        }
    }
}

/**
 * AI decision logic - decides whether to continue rolling or end turn
 */
function decideAIAction(aiPlayer) {
    const currentScore = gameState.currentTurnScore;
    const playerScore = aiPlayer.score;
    const targetScore = gameState.targetScore;
    const diceLeft = gameState.availableDice;
    
    // Calculate risk factor based on available dice
    const riskFactor = calculateRiskFactor(diceLeft);
    
    // Different AI personalities have different strategies
    switch (aiPlayer.type) {
        case 'gemini':
            // Conservative - stops early with good scores
            return currentScore < 500 && diceLeft >= 3 && riskFactor < 0.4;
            
        case 'chatgpt':
            // Balanced - considers game state
            const neededScore = targetScore - playerScore;
            return currentScore < neededScore && diceLeft >= 2 && riskFactor < 0.5;
            
        case 'claude':
            // Aggressive - takes more risks
            return currentScore < 800 && diceLeft >= 1 && riskFactor < 0.6;
            
        default:
            // Entry game logic - need at least 300 to enter
            if (!aiPlayer.hasEnteredGame) {
                return currentScore < 300 && diceLeft >= 2;
            }
            return currentScore < 400 && diceLeft >= 2;
    }
}

/**
 * Calculate risk factor based on available dice
 * @param {number} diceLeft - Number of dice left to roll
 * @returns {number} Risk factor (0-1, higher = more risky)
 */
function calculateRiskFactor(diceLeft) {
    // More dice = lower risk, fewer dice = higher risk
    switch (diceLeft) {
        case 6: return 0.1;
        case 5: return 0.2;
        case 4: return 0.3;
        case 3: return 0.4;
        case 2: return 0.6;
        case 1: return 0.8;
        default: return 1.0;
    }
}

/**
 * Find the best scoring combination from dice values
 * @param {number[]} diceValues - Array of dice values
 * @returns {Object|null} Best combination {dice: [], score: number}
 */
function findBestScoringCombination(diceValues) {
    if (!diceValues || diceValues.length === 0) return null;
    
    const allCombinations = getAllScoringCombinations(diceValues);
    
    if (allCombinations.length === 0) {
        // If no predefined combinations, try individual scoring dice
        const scoringDice = [];
        const counts = [0, 0, 0, 0, 0, 0, 0];
        
        diceValues.forEach(value => counts[value]++);
        
        // Add 1s (100 points each)
        for (let i = 0; i < counts[1]; i++) {
            scoringDice.push(1);
        }
        
        // Add 5s (50 points each)  
        for (let i = 0; i < counts[5]; i++) {
            scoringDice.push(5);
        }
        
        if (scoringDice.length > 0) {
            return {
                dice: scoringDice,
                score: calculateScore(scoringDice)
            };
        }
        
        return null;
    }
    
    // Return the combination with highest score
    return allCombinations.reduce((best, current) => 
        current.score > best.score ? current : best
    );
}

export { findBestScoringCombination, decideAIAction, calculateRiskFactor };
