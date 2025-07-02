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

// 🎯 TIMEOUT MANAGEMENT - Functional array operations
let activeAITimeouts = [];

export const clearAllAITimeouts = () => {
    console.log(`🚫 Clearing ${activeAITimeouts.length} active AI timeouts...`);
    activeAITimeouts.forEach(clearTimeout);
    activeAITimeouts.length = 0; // Clear array efficiently
};

export const createAITimeout = (callback, delay) => {
    console.log(`🔧 Creating AI timeout with delay: ${delay}ms`);
    const timeoutId = setTimeout(() => {
        console.log('⏰ AI timeout fired!');
        // Remove timeout from active list
        activeAITimeouts = activeAITimeouts.filter(id => id !== timeoutId);
        
        // Only execute if game is still running
        if (isGameRunning()) {
            console.log('✅ Game is running, executing AI callback');
            callback();
        } else {
            console.log('❌ Game not running, skipping AI callback');
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

// 🎯 MAIN AI TURN FUNCTION - Functional composition
export const playAITurn = pipe(
    () => console.log('🤖 === AI TURN START ==='),
    () => console.log('🔍 AI Debug - Game State Check:'),
    () => console.log(`   - gameEnded: ${gameState.gameEnded}`),
    () => console.log(`   - gameStarted: ${gameState.gameStarted}`),
    () => console.log(`   - currentPlayer: ${gameState.currentPlayer}`),
    () => console.log(`   - availableDice: ${gameState.availableDice}`),
    unless(isGameRunning, () => {
        console.log('🚫 AI turn cancelled - game not running');
        return false;
    }),
    () => {
        const aiPlayer = getCurrentPlayer();
        
        // KRITICKÁ KONTROLA: AI nesmí hrát za lidského hráče!
        if (gameState.currentPlayer === 0 || aiPlayer.type === 'human') {
            console.log('🚫 AI turn cancelled - current player is human!');
            console.log(`   - currentPlayer: ${gameState.currentPlayer}, type: ${aiPlayer.type}`);
            return false;
        }
        console.log(`🤖 Starting AI turn for ${aiPlayer.name} (player ${gameState.currentPlayer})`);
        console.log(`🎮 Game state - ended: ${gameState.gameEnded}, started: ${gameState.gameStarted}`);
        console.log('🎯 Current scores:', gameState.players.map(p => `${p.name}: ${p.score}`));
        resetAITurnState();
        console.log(`🎲 Rolling in ${random(800, 1200)}ms...`);
        createAITimeout(() => playAIRoll(), random(800, 1200));
        return true;
    }
);

// 🎲 AI ROLL LOGIC - Functional decision making
const playAIRoll = pipe(
    () => console.log('🎲 === AI ROLL START ==='),
    unless(isGameRunning, () => {
        console.log('🚫 AI roll cancelled - game not running');
        return false;
    }),
    unless(hasAvailableDice, () => {
        const aiPlayer = getCurrentPlayer();
        console.warn(`AI ${aiPlayer.name} cannot roll: no available dice (${gameState.availableDice})`);
        console.log('🏁 AI ending turn due to no available dice');
        createAITimeout(() => safeExecute(endTurn, null, 'AI No Dice End Turn'), 1000);
        return false;
    }),
    () => {
        const aiPlayer = getCurrentPlayer();
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

// 🎯 AI ROLL RESULT HANDLER - Conditional logic with Ramda
const handleAIRollResult = cond([
    // FARKLE - No scoring dice
    [(rollScore) => rollScore === 0, (rollScore, aiPlayer) => {
        console.log(`💥 AI ${aiPlayer.name}: FARKLE! No scoring dice`);
        
        debouncedChatMessage('system', `💥 FARKLE! ${aiPlayer.name} nezískal žádné body a končí tah.`);
        
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'farkle');
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        
        console.log('🏁 AI ending turn due to FARKLE');
        createAITimeout(() => safeExecute(endTurn, null, 'AI Farkle End Turn'), random(1500, 2500));
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
        console.log(`🧠 AI making decision in ${random(1000, 2000)}ms...`);
        createAITimeout(() => makeAIDecision(rollScore, aiPlayer), random(1000, 2000));
        return 'success';
    }]
]);

// 🧠 AI DECISION MAKING - Functional approach with risk assessment
const makeAIDecision = (rollScore, aiPlayer) => {
    console.log('🧠 === AI DECISION START ===');
    console.log(`🤖 AI: ${aiPlayer.name} (type: ${aiPlayer.type})`);
    console.log(`🎲 Roll score: ${rollScore}`);
    console.log(`💰 Current turn total: ${getCurrentTurnScore()}`);
    console.log(`🎯 Available dice: ${gameState.availableDice}`);
    
    const riskProfile = calculateRiskLevel();
    
    console.log('📊 Risk profile:', riskProfile);
    
    // Find best scoring combination
    const bestCombination = findBestScoringCombination(gameState.diceValues);
    
    console.log('🎯 Best combination found:', bestCombination);
    
    if (!bestCombination || bestCombination.score <= 0) {
        console.warn(`❌ No valid scoring combination found for AI ${aiPlayer.name}`);
        console.log('🏁 AI ending turn due to no valid combination');
        return createAITimeout(() => safeExecute(endTurn, null, 'AI No Combination End Turn'), 1000);
    }
    
    console.log(`🏦 Banking combination: ${bestCombination.dice.join(', ')} for ${bestCombination.score} points`);
    
    // Bank the best scoring combination using the new AI banking function
    const bankingSuccess = bankAIDice(bestCombination);
    
    if (!bankingSuccess) {
        console.warn(`❌ Failed to bank combination for AI ${aiPlayer.name}`);
        console.log('🏁 AI ending turn due to banking failure');
        return createAITimeout(() => safeExecute(endTurn, null, 'AI Banking Failure End Turn'), 1000);
    }
    
    // Decide whether to continue or end turn
    const shouldContinue = pipe(
        () => ({ currentTurn: gameState.currentTurnScore, riskProfile, availableDice: gameState.availableDice }),
        cond([
            // Always continue with Hot Dice
            [({ availableDice }) => availableDice === 0, always(true)],
            // Conservative AI
            [({ currentTurn, riskProfile }) => 
                riskProfile.personality === 'conservative' && gte(currentTurn, riskProfile.bankThreshold), 
                always(false)],
            // Aggressive AI
            [({ currentTurn, riskProfile }) => 
                riskProfile.personality === 'aggressive' && lt(currentTurn, riskProfile.riskThreshold), 
                always(true)],
            // Default moderate behavior
            [T, ({ currentTurn }) => random(0, 1) > (currentTurn / 1000)]
        ])
    )();
    
    console.log(`🤔 Should continue rolling? ${shouldContinue}`);
    console.log(`🎯 Available dice after banking: ${gameState.availableDice}`);
    
    if (shouldContinue && gameState.availableDice > 0) {
        console.log('🎲 AI decided to continue rolling');
        createAITimeout(() => playAIRoll(), random(1200, 2000));
    } else {
        console.log('🏁 AI decided to end turn');
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'endTurn', {
            turnScore: getCurrentTurnScore(),
            totalScore: getPlayerScore(aiPlayer)
        });
        
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        createAITimeout(() => safeExecute(endTurn, null, 'AI Decision End Turn'), random(1500, 2500));
    }
};

//  SCORING COMBINATION FINDER - Optimized with Ramda
const findBestScoringCombination = pipe(
    (diceValues) => {
        if (isEmpty(diceValues)) return null;
        
        const allCombinations = getAllScoringCombinations(diceValues);
        
        if (!isEmpty(allCombinations)) {
            // Return highest scoring combination
            return allCombinations.reduce((best, current) => 
                current.score > best.score ? current : best
            );
        }
        
        // Fallback: individual scoring dice
        return findIndividualScoringDice(diceValues);
    }
);

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
