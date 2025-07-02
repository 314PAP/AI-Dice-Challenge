/**
 * 🤖 AI Player Controller - Modernized with Functional Programming
 * Maximizes use of Ramda + Lodash-ES for clean, functional AI logic
 */

import { pipe, when, unless, cond, always, T, gt, gte, lt, prop, pathOr } from 'ramda';
import { isEmpty, random, sample, clamp, debounce } from 'lodash-es';
import { gameState, getCurrentPlayer, nextPlayer } from '../game/gameState.js';
import { rollDice, calculateScore, getAllScoringCombinations } from '../game/diceLogic.js';
import { updateGameDisplay } from '../ui/gameUI.js';
import { generateAIGameReaction, enhancedAI } from '../../ai/controllers/enhancedAIController.js';
import { endTurn } from '../game/gameController.js';
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
    const timeoutId = setTimeout(
        pipe(
            () => activeAITimeouts.filter(id => id !== timeoutId),
            (filtered) => { activeAITimeouts = filtered; },
            () => when(isGameRunning, callback)()
        ),
        delay
    );
    
    activeAITimeouts.push(timeoutId);
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
    () => console.log('🤖 AI Turn Check...'),
    unless(isGameRunning, () => {
        console.log('🚫 AI turn cancelled - game not running');
        return false;
    }),
    () => {
        const aiPlayer = getCurrentPlayer();
        console.log(`🤖 Starting AI turn for ${aiPlayer.name}`);
        resetAITurnState();
        createAITimeout(() => playAIRoll(), random(800, 1200));
        return true;
    }
);

// 🎲 AI ROLL LOGIC - Functional decision making
const playAIRoll = pipe(
    () => console.log('🎲 AI Roll Check...'),
    unless(isGameRunning, () => {
        console.log('🚫 AI roll cancelled - game not running');
        return false;
    }),
    unless(hasAvailableDice, () => {
        const aiPlayer = getCurrentPlayer();
        console.warn(`AI ${aiPlayer.name} cannot roll: no available dice`);
        return false;
    }),
    () => {
        const aiPlayer = getCurrentPlayer();
        const diceCount = gameState.availableDice;
        
        console.log(`🎲 AI ${aiPlayer.name} rolling ${diceCount} dice...`);
        
        // Execute roll with functional flow
        const diceResults = rollDice(diceCount);
        gameState.diceValues = diceResults.map(prop('value'));
        gameState.selectedDice = [];
        
        const rollScore = calculateScore(gameState.diceValues);
        
        // Use debounced chat message
        debouncedChatMessage('system', 
            `${aiPlayer.name} hodil: ${gameState.diceValues.join(', ')} - Možné body z hodu: ${rollScore}`
        );
        
        return handleAIRollResult(rollScore, aiPlayer);
    }
);

// 🎯 AI ROLL RESULT HANDLER - Conditional logic with Ramda
const handleAIRollResult = cond([
    // FARKLE - No scoring dice
    [(rollScore) => rollScore === 0, (rollScore, aiPlayer) => {
        console.log(`❌ AI ${aiPlayer.name}: FARKLE!`);
        
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'farkle');
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        
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
        createAITimeout(() => makeAIDecision(rollScore, aiPlayer), random(1000, 2000));
        return 'success';
    }]
]);

// 🧠 AI DECISION MAKING - Functional approach with risk assessment
const makeAIDecision = (rollScore, aiPlayer) => {
    const riskProfile = calculateRiskLevel();
    const currentTurn = getCurrentTurnScore();
    const playerTotal = getPlayerScore(aiPlayer);
    
    // Find best scoring combination
    const bestCombination = findBestScoringCombination(gameState.diceValues);
    
    if (!bestCombination || bestCombination.score <= 0) {
        console.warn(`No valid scoring combination found for AI ${aiPlayer.name}`);
        return createAITimeout(() => safeExecute(endTurn, null, 'AI No Combination End Turn'), 1000);
    }
    
    // Bank the best scoring combination
    bankAIScoring(bestCombination, aiPlayer);
    
    // Decide whether to continue or end turn
    const shouldContinue = pipe(
        () => ({ currentTurn: currentTurn + bestCombination.score, riskProfile, availableDice: gameState.availableDice }),
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
    
    if (shouldContinue && gameState.availableDice > 0) {
        createAITimeout(() => playAIRoll(), random(1200, 2000));
    } else {
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'endTurn', {
            turnScore: getCurrentTurnScore(),
            totalScore: getPlayerScore(aiPlayer)
        });
        
        if (reaction) debouncedChatMessage(aiPlayer.type, reaction);
        createAITimeout(() => safeExecute(endTurn, null, 'AI Decision End Turn'), random(1500, 2500));
    }
};

// 🏦 AI BANKING LOGIC - Functional scoring combination banking
const bankAIScoring = (combination, aiPlayer) => {
    // Update game state functionally
    Object.assign(gameState, {
        currentTurnScore: gameState.currentTurnScore + combination.score,
        availableDice: gameState.availableDice - combination.dice.length,
        diceValues: [],
        selectedDice: []
    });
    
    gameState.bankedDiceThisTurn.push(...combination.dice);
    
    debouncedChatMessage('system', 
        `${aiPlayer.name} odložil: ${combination.dice.join(', ')} za ${combination.score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`
    );
    
    // Handle Hot Dice scenario
    when(
        () => gameState.availableDice === 0,
        () => {
            Object.assign(gameState, {
                availableDice: 6,
                diceValues: [],
                selectedDice: [],
                bankedDiceThisTurn: [],
                mustBankDice: false
            });
            
            debouncedChatMessage('system', 
                `🔥 ${aiPlayer.name} odložil všechny kostky! HOT DICE! Pokračuje s novými kostkami.`
            );
            
            const hotDiceReaction = enhancedAI.generateAIResponse(aiPlayer.type, 'hotDice');
            if (hotDiceReaction) {
                createAITimeout(() => debouncedChatMessage(aiPlayer.type, hotDiceReaction), 500);
            }
        }
    )();
};

// 🎯 SCORING COMBINATION FINDER - Optimized with Ramda
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

// 🧮 RISK CALCULATION - Functional risk assessment
const calculateRiskFactor = cond([
    [(dice) => dice === 6, always(0.1)],
    [(dice) => dice === 5, always(0.2)],
    [(dice) => dice === 4, always(0.3)],
    [(dice) => dice === 3, always(0.4)],
    [(dice) => dice === 2, always(0.6)],
    [(dice) => dice === 1, always(0.8)],
    [T, always(1.0)]
]);
