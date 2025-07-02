/**
 * 🎮 Game Controller - Modernized Hub
 * Functional architecture coordinating all game modules with Ramda/Lodash
 */

import { pipe, curry } from 'ramda';
import { memoize, once } from 'lodash-es';
import { safeExecute } from '../utils/gameUtils.js';

// 🎯 MODULAR IMPORTS - Functional game flow
import { 
    startGame as _startGame, 
    playerTurn as _playerTurn, 
    endTurn as _endTurn, 
    endGame as _endGame, 
    startNewGame as _startNewGame, 
    resetGame as _resetGame, 
    saveScore as _saveScore, 
    returnToMainMenu as _returnToMainMenu 
} from './controllers/gameFlowController.js';

import { 
    rollDiceForPlayer as _rollDiceForPlayer, 
    selectDie as _selectDie, 
    bankSelectedDice as _bankSelectedDice 
} from './controllers/turnActionsController.js';

import { 
    triggerAIAfterGoodRoll as _triggerAIAfterGoodRoll,
    triggerAIAfterBadRoll as _triggerAIAfterBadRoll,
    triggerFarkleHeckling as _triggerFarkleHeckling,
    triggerRandomAITrashTalk as _triggerRandomAITrashTalk,
    triggerAIBanter as _triggerAIBanter,
    triggerAIHighTensionComment as _triggerAIHighTensionComment,
    triggerSituationalComment as _triggerSituationalComment
} from './controllers/aiReactionsController.js';

import { setupEventListeners as _setupEventListeners } from './controllers/eventSetupController.js';

// 🚀 ENHANCED INITIALIZATION - Memoized setup
const initializeGameSystem = once(pipe(
    () => console.log('🎮 Initializing modernized game system...'),
    () => safeExecute(_setupEventListeners, null, 'Event Setup'),
    () => console.log('✅ Game system ready!')
));

// 🎯 SAFE FUNCTION WRAPPERS - Error-resilient game actions
const createSafeGameAction = curry((actionName, actionFunction) =>
    (...args) => safeExecute(() => actionFunction(...args), null, actionName)
);

// 🎮 SAFE GAME ACTIONS - All wrapped for reliability
const safeGameActions = {
    startGame: createSafeGameAction('Start Game', _startGame),
    playerTurn: createSafeGameAction('Player Turn', _playerTurn),
    endTurn: createSafeGameAction('End Turn', _endTurn),
    endGame: createSafeGameAction('End Game', _endGame),
    startNewGame: createSafeGameAction('New Game', _startNewGame),
    resetGame: createSafeGameAction('Reset Game', _resetGame),
    saveScore: createSafeGameAction('Save Score', _saveScore),
    returnToMainMenu: createSafeGameAction('Return to Menu', _returnToMainMenu),
    rollDiceForPlayer: createSafeGameAction('Roll Dice', _rollDiceForPlayer),
    selectDie: createSafeGameAction('Select Die', _selectDie),
    bankSelectedDice: createSafeGameAction('Bank Dice', _bankSelectedDice)
};

// Re-export modernized safe functions for backward compatibility
export const initializeGame = initializeGameSystem;
export const startGame = safeGameActions.startGame;
export const playerTurn = safeGameActions.playerTurn;
export const endTurn = safeGameActions.endTurn;
export const endGame = safeGameActions.endGame;
export const startNewGame = safeGameActions.startNewGame;
export const resetGame = safeGameActions.resetGame;
export const saveScore = safeGameActions.saveScore;
export const returnToMainMenu = safeGameActions.returnToMainMenu;
export const rollDiceForPlayer = safeGameActions.rollDiceForPlayer;
export const selectDie = safeGameActions.selectDie;
export const bankSelectedDice = safeGameActions.bankSelectedDice;

// 🤖 AI Reactions - Enhanced with safety  
export const triggerAIAfterGoodRollSafe = createSafeGameAction('AI Good Roll', _triggerAIAfterGoodRoll);
export const triggerAIAfterBadRollSafe = createSafeGameAction('AI Bad Roll', _triggerAIAfterBadRoll);
export const triggerFarkleHecklingSafe = createSafeGameAction('AI Farkle', _triggerFarkleHeckling);
export const triggerRandomAITrashTalkSafe = createSafeGameAction('AI Trash Talk', _triggerRandomAITrashTalk);
export const triggerAIBanterSafe = createSafeGameAction('AI Banter', _triggerAIBanter);
export const triggerAIHighTensionCommentSafe = createSafeGameAction('AI Tension', _triggerAIHighTensionComment);
export const triggerSituationalCommentSafe = createSafeGameAction('AI Situational', _triggerSituationalComment);

// 🔧 System Functions
export const setupEventListenersSafe = createSafeGameAction('Setup Events', _setupEventListeners);

// 🎯 LEGACY SUPPORT - Global window object for backward compatibility
if (typeof window !== 'undefined') {
    window.gameController = {
        ...safeGameActions,
        initializeGame: initializeGameSystem,
        triggerAIAfterGoodRoll: triggerAIAfterGoodRollSafe,
        triggerAIAfterBadRoll: triggerAIAfterBadRollSafe,
        triggerFarkleHeckling: triggerFarkleHecklingSafe,
        triggerRandomAITrashTalk: triggerRandomAITrashTalkSafe,
        triggerAIBanter: triggerAIBanterSafe,
        triggerAIHighTensionComment: triggerAIHighTensionCommentSafe,
        triggerSituationalComment: triggerSituationalCommentSafe,
        setupEventListeners: setupEventListenersSafe
    };
    
    // Auto-initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeGameSystem);
}

// 📊 EXPORT DEFAULT - Complete modernized controller
export default {
    ...safeGameActions,
    initializeGameSystem,
    createSafeGameAction
};
