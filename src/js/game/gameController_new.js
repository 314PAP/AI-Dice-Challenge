/**
 * Game Controller - Refactored
 * Main game controller that coordinates all game modules
 * Replaced 660-line monolithic file with modular architecture
 */

// Import all controller modules
import { 
    initializeGame, 
    startGame, 
    playerTurn, 
    endTurn, 
    endGame, 
    startNewGame, 
    resetGame, 
    saveScore, 
    returnToMainMenu 
} from './controllers/gameFlowController.js';

import { 
    rollDiceForPlayer, 
    selectDie, 
    bankSelectedDice 
} from './controllers/turnActionsController.js';

import { 
    triggerAIAfterGoodRoll,
    triggerAIAfterBadRoll,
    triggerFarkleHeckling,
    triggerRandomAITrashTalk,
    triggerAIBanter,
    triggerAIHighTensionComment,
    triggerSituationalComment
} from './controllers/aiReactionsController.js';

import { setupEventListeners } from './controllers/eventSetupController.js';

// Re-export all functions for backward compatibility
export {
    // Game Flow
    initializeGame,
    startGame,
    playerTurn,
    endTurn,
    endGame,
    startNewGame,
    resetGame,
    saveScore,
    returnToMainMenu,
    
    // Turn Actions
    rollDiceForPlayer,
    selectDie,
    bankSelectedDice,
    
    // AI Reactions
    triggerAIAfterGoodRoll,
    triggerAIAfterBadRoll,
    triggerFarkleHeckling,
    triggerRandomAITrashTalk,
    triggerAIBanter,
    triggerAIHighTensionComment,
    triggerSituationalComment,
    
    // Event Setup
    setupEventListeners
};

/**
 * Main game controller initialization
 * This is the main entry point for game functionality
 */
export function initGameController() {
    console.log('🎮 Inicializuji Game Controller...');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Initialize game logic
    initializeGame();
    
    console.log('✅ Game Controller inicializován');
}

/**
 * Legacy support - keeping some global functions for backward compatibility
 */
window.gameController = {
    initializeGame,
    startGame,
    playerTurn,
    endTurn,
    endGame,
    rollDiceForPlayer,
    selectDie,
    bankSelectedDice,
    resetGame,
    saveScore,
    startNewGame,
    returnToMainMenu
};
