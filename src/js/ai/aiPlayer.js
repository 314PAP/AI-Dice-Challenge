/**
 * 🤖 AI Player Controller - Modernized with Functional Programming
 * Maximizes use of Ramda + Lodash-ES for clean, functional AI logic
 */

import { pipe, when, unless, cond, always, T, gt, gte, lt, prop, pathOr } from 'ramda';
import { isEmpty, random } from 'lodash-es';
import { gameState, getCurrentPlayer } from '../game/gameState.js';
import { rollDice, calculateScore, getAllScoringCombinations } from '../game/diceLogic.js';
import { updateGameDisplay } from '../ui/gameUI.js';
import { enhancedAI } from './enhancedAIController.js';
import { endTurn } from '../game/gameController.js';
import { bankAIDice } from '../game/controllers/turnActionsController.js';
import { safeExecute, debouncedChatMessage } from '../utils/gameUtils.js';

// 🎯 FUNCTIONAL AI LOGIC - Ramda-based decision making
const isGameRunning = () => !gameState.gameEnded && gameState.gameStarted;
const hasAvailableDice = () => gt(gameState.availableDice, 0);
const getCurrentTurnScore = () => pathOr(0, ['currentTurnScore'], gameState);
const getPlayerScore = (player) => pathOr(0, ['score'], player);

// 🎲 AI DECISION MATRIX - Risk vs Reward calculation
const aiDecisionMatrix = {
    conservative: { riskThreshold: 300, bankThreshold: 250 },
    moderate: { riskThreshold: 400, bankThreshold: 350 },
    aggressive: { riskThreshold: 600, bankThreshold: 500 }
};

// 🧠 AI PERSONALITY RISK ASSESSMENT - Functional approach
const calculateRiskLevel = pipe(
    getCurrentPlayer,
    prop('personality'),
    when(
        isEmpty,
        always('moderate')
    ),
    (personality) => pathOr(aiDecisionMatrix.moderate, [personality], aiDecisionMatrix)
);

// 🎯 TIMEOUT MANAGEMENT - Enhanced with turn tracking
let activeAITimeouts = [];
let currentAIPlayer = null;
let aiTurnInProgress = false;

export const clearAllAITimeouts = () => {
    console.log(`🚫 Clearing ${activeAITimeouts.length} active AI timeouts...`);
    activeAITimeouts.forEach(clearTimeout);
    activeAITimeouts.length = 0;
    aiTurnInProgress = false;
    currentAIPlayer = null;
};

export const createAITimeout = (callback, delay) => {
    // Don't create timeout if AI turn is not in progress
    if (!aiTurnInProgress) {
        console.log('❌ AI timeout cancelled - no AI turn in progress');
        return null;
    }

    console.log(`🔧 Creating AI timeout with delay: ${delay}ms`);
    const timeoutId = setTimeout(() => {
        console.log('⏰ AI timeout fired!');
        // Remove timeout from active list
        activeAITimeouts = activeAITimeouts.filter(id => id !== timeoutId);
        
        // Only execute if game is still running and AI turn is still active
        if (isGameRunning() && aiTurnInProgress) {
            const currentPlayer = getCurrentPlayer();
            if (currentPlayer && currentPlayer.type !== 'human' && currentPlayer === currentAIPlayer) {
                console.log('✅ Valid AI callback execution');
                callback();
            } else {
                console.log('❌ AI callback cancelled - player changed or invalid');
            }
        } else {
            console.log('❌ Game not running or AI turn ended, skipping callback');
        }
    }, delay);
    
    activeAITimeouts.push(timeoutId);
    console.log(`📝 Added timeout ${timeoutId} to active list. Total: ${activeAITimeouts.length}`);
    return timeoutId;
};

// 🎮 AI TURN INITIALIZATION - Functional state reset
const resetAITurnState = () => {
    Object.assign(gameState, {
        currentTurnScore: 0,
        diceValues: [],
        selectedDice: [],
        bankedDiceThisTurn: [],
        availableDice: 6,
        mustBankDice: false
    });
};

// � MAIN AI TURN FUNCTION - Enhanced with proper controls
export const playAITurn = pipe(
    () => console.log('🤖 === AI TURN START ==='),
    () => console.log('🔍 AI Debug - Game State Check:'),
    () => console.log(`   - gameEnded: ${gameState.gameEnded}`),
    () => console.log(`   - gameStarted: ${gameState.gameStarted}`),
    () => console.log(`   - currentPlayer: ${gameState.currentPlayer}`),
    () => console.log(`   - availableDice: ${gameState.availableDice}`),
    () => console.log(`   - aiTurnInProgress: ${aiTurnInProgress}`),
    unless(isGameRunning, () => {
        console.log('🚫 AI turn cancelled - game not running');
        return false;
    }),
    () => {
        const aiPlayer = getCurrentPlayer();
        
        // KRITICKÁ KONTROLA: AI nesmí hrát za lidského hráče!
        if (gameState.currentPlayer === 0 || !aiPlayer || aiPlayer.type === 'human') {
            console.log('🚫 AI turn cancelled - current player is human!');
            console.log(`   - currentPlayer: ${gameState.currentPlayer}, type: ${aiPlayer?.type || 'undefined'}`);
            return false;
        }

        // Check if AI turn is already in progress for this player
        if (aiTurnInProgress && currentAIPlayer === aiPlayer) {
            console.log('🚫 AI turn already in progress for this player');
            return false;
        }

        // Set AI turn state
        aiTurnInProgress = true;
        currentAIPlayer = aiPlayer;
        
        console.log(`🤖 Starting AI turn for ${aiPlayer.name} (player ${gameState.currentPlayer})`);
        console.log(`🎮 Game state - ended: ${gameState.gameEnded}, started: ${gameState.gameStarted}`);
        console.log('🎯 Current scores:', gameState.players.map(p => `${p.name}: ${p.score}`));
        
        resetAITurnState();
        
        const rollDelay = random(800, 1200);
        console.log(`🎲 Rolling in ${rollDelay}ms...`);
        createAITimeout(() => playAIRoll(), rollDelay);
        return true;
    }
);

// 🎲 AI ROLL LOGIC - Enhanced with proper validation
const playAIRoll = pipe(
    () => console.log('🎲 === AI ROLL START ==='),
    unless(isGameRunning, () => {
        console.log('🚫 AI roll cancelled - game not running');
        aiTurnInProgress = false;
        return false;
    }),
    unless(hasAvailableDice, () => {
        const aiPlayer = getCurrentPlayer();
        console.warn(`AI ${aiPlayer.name} cannot roll: no available dice (${gameState.availableDice})`);
        console.log('🏁 AI ending turn due to no available dice');
        createAITimeout(() => {
            aiTurnInProgress = false;
            safeExecute(endTurn, null, 'AI No Dice End Turn');
        }, 1000);
        return false;
    }),
    () => {
        const aiPlayer = getCurrentPlayer();
        
        // Double check this is still the right AI player
        if (currentAIPlayer !== aiPlayer || !aiTurnInProgress) {
            console.log('🚫 AI roll cancelled - player changed');
            return false;
        }
        
        console.log(`🎲 AI ${aiPlayer.name} rolling ${gameState.availableDice} dice...`);
        
        const diceResults = rollDice(gameState.availableDice);
        gameState.diceValues = diceResults.map(die => die.value);
        
        console.log(`🎲 AI rolled: [${gameState.diceValues.join(', ')}]`);
        
        const rollScore = calculateScore(gameState.diceValues);
        console.log(`💰 Roll score: ${rollScore}`);
        
        updateGameDisplay();
        
        return handleAIRollResult(rollScore, aiPlayer);
    }
);

// 🎯 AI ROLL RESULT HANDLER - Enhanced with proper cleanup
const handleAIRollResult = cond([
    // FARKLE - No scoring dice
    [(rollScore) => rollScore === 0, (rollScore, aiPlayer) => {
        console.log(`💥 AI ${aiPlayer.name}: FARKLE! No scoring dice`);
        
        debouncedChatMessage('system', `💥 FARKLE! ${aiPlayer.name} nezískal žádné body a končí tah.`);
        
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'farkle');
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        
        console.log('🏁 AI ending turn due to FARKLE');
        createAITimeout(() => {
            aiTurnInProgress = false;
            safeExecute(endTurn, null, 'AI Farkle End Turn');
        }, random(1500, 2500));
        return 'farkle';
    }],
    
    // SUCCESS - Handle scoring and decision
    [T, (rollScore, aiPlayer) => {
        console.log(`✅ AI ${aiPlayer.name}: Scoring dice available (${rollScore} points)`);
        
        updateGameDisplay();
        
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'roll', {
            rollScore,
            currentTurnScore: getCurrentTurnScore(),
            totalScore: getPlayerScore(aiPlayer)
        });
        
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        
        // AI decision making with delay
        const decisionDelay = random(1000, 2000);
        console.log(`🧠 AI making decision in ${decisionDelay}ms...`);
        createAITimeout(() => makeAIDecision(rollScore, aiPlayer), decisionDelay);
        return 'success';
    }]
]);

// 🧠 AI DECISION MAKING - Enhanced with proper state management
const makeAIDecision = (rollScore, aiPlayer) => {
    console.log('🧠 === AI DECISION START ===');
    console.log(`🤖 AI: ${aiPlayer.name} (type: ${aiPlayer.type})`);
    console.log(`🎲 Roll score: ${rollScore}`);
    console.log(`💰 Current turn total: ${getCurrentTurnScore()}`);
    console.log(`🎯 Available dice: ${gameState.availableDice}`);
    
    // Validate this is still the correct AI turn
    if (currentAIPlayer !== aiPlayer || !aiTurnInProgress) {
        console.log('🚫 AI decision cancelled - player changed');
        return;
    }
    
    const riskProfile = calculateRiskLevel();
    console.log('📊 Risk profile:', riskProfile);
    
    // Find best scoring combination
    const bestCombination = findBestScoringCombination(gameState.diceValues);
    console.log('🎯 Best combination found:', bestCombination);
    
    if (!bestCombination || bestCombination.score <= 0) {
        console.warn(`❌ No valid scoring combination found for AI ${aiPlayer.name}`);
        console.log('🏁 AI ending turn due to no valid combination');
        return createAITimeout(() => {
            aiTurnInProgress = false;
            safeExecute(endTurn, null, 'AI No Combination End Turn');
        }, 1000);
    }
    
    console.log(`🏦 Banking combination: ${bestCombination.dice.join(', ')} for ${bestCombination.score} points`);
    
    // Bank the best scoring combination using the new AI banking function
    const bankingSuccess = bankAIDice(bestCombination);
    
    if (!bankingSuccess) {
        console.warn(`❌ Failed to bank combination for AI ${aiPlayer.name}`);
        console.log('🏁 AI ending turn due to banking failure');
        return createAITimeout(() => {
            aiTurnInProgress = false;
            safeExecute(endTurn, null, 'AI Banking Failure End Turn');
        }, 1000);
    }
    
    // Decide whether to continue or end turn
    const shouldContinue = pipe(
        () => ({ 
            currentTurn: gameState.currentTurnScore, 
            riskProfile, 
            availableDice: gameState.availableDice,
            playerType: aiPlayer.type
        }),
        cond([
            // Always continue with Hot Dice (all dice scored)
            [({ availableDice }) => availableDice === 0, always(true)],
            // Conservative AI - bank early
            [({ currentTurn, riskProfile, playerType }) => 
                (playerType === 'claude' || riskProfile.personality === 'conservative') && 
                gte(currentTurn, riskProfile.bankThreshold), 
                always(false)],
            // Aggressive AI - take more risks
            [({ currentTurn, riskProfile, playerType }) => 
                (playerType === 'chatgpt' || riskProfile.personality === 'aggressive') && 
                lt(currentTurn, riskProfile.riskThreshold), 
                always(true)],
            // Default moderate behavior with some randomness
            [T, ({ currentTurn }) => {
                const riskFactor = Math.min(currentTurn / 1000, 0.8);
                return random(0, 1) > riskFactor;
            }]
        ])
    )();
    
    console.log(`🤔 Should continue rolling? ${shouldContinue}`);
    console.log(`🎯 Available dice after banking: ${gameState.availableDice}`);
    
    if (shouldContinue && gameState.availableDice > 0) {
        console.log('🎲 AI decided to continue rolling');
        const rollDelay = random(1200, 2000);
        createAITimeout(() => playAIRoll(), rollDelay);
    } else {
        console.log('🏁 AI decided to end turn');
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'endTurn', {
            turnScore: getCurrentTurnScore(),
            totalScore: getPlayerScore(aiPlayer)
        });
        
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        
        const endDelay = random(1500, 2500);
        createAITimeout(() => {
            aiTurnInProgress = false;
            safeExecute(endTurn, null, 'AI Decision End Turn');
        }, endDelay);
    }
};

//  🎯 SCORING COMBINATION FINDER - Fixed logic
const findBestScoringCombination = (diceValues) => {
    if (isEmpty(diceValues)) {
        console.log('❌ No dice values provided');
        return null;
    }
    
    console.log(`🔍 Finding best combination for: [${diceValues.join(', ')}]`);
    
    // First try to get all scoring combinations
    const allCombinations = getAllScoringCombinations(diceValues);
    console.log('🎯 All combinations found:', allCombinations);
    
    if (!isEmpty(allCombinations)) {
        // Return highest scoring combination
        const bestCombo = allCombinations.reduce((best, current) => 
            current.score > best.score ? current : best
        );
        console.log('✅ Best combination selected:', bestCombo);
        return bestCombo;
    }
    
    // Fallback: find individual scoring dice
    console.log('🔄 Trying individual scoring dice...');
    const individualDice = findIndividualScoringDice(diceValues);
    
    if (individualDice) {
        console.log('✅ Individual scoring dice found:', individualDice);
        return individualDice;
    }
    
    console.log('❌ No scoring combinations found');
    return null;
};

// 🎲 INDIVIDUAL DICE SCORING - Functional approach
const findIndividualScoringDice = (diceValues) => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    diceValues.forEach(value => counts[value]++);
    
    const scoringDice = [
        ...Array(counts[1]).fill(1), // 1s (100 points each)
        ...Array(counts[5]).fill(5)  // 5s (50 points each)
    ];
    
    return isEmpty(scoringDice) ? null : {
        dice: scoringDice,
        score: calculateScore(scoringDice)
    };
};

// 🧮 RISK CALCULATION - Functional risk assessment (for future use)
const _calculateRiskFactor = cond([
    [(dice) => dice === 6, always(0.1)],
    [(dice) => dice === 5, always(0.2)],
    [(dice) => dice === 4, always(0.3)],
    [(dice) => dice === 3, always(0.4)],
    [(dice) => dice === 2, always(0.6)],
    [(dice) => dice === 1, always(0.8)],
    [T, always(1.0)]
]);

// 🔄 AI TURN CLEANUP - For external use when player changes
export const endAITurn = () => {
    console.log('🔄 Ending AI turn - cleaning up state');
    aiTurnInProgress = false;
    currentAIPlayer = null;
    // Don't clear timeouts here - let them finish naturally with validation
};
