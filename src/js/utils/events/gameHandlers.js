/**
 * 🎯 Game Event Handlers (New Game, Menu, etc.)
 */

import { curry } from 'ramda';
import { emitter, EVENTS } from './eventCore.js';
import { hideAllModals } from './modalHandlers.js';
import { safeExecute } from '../gameUtils.js';

// 📝 OPTIMIZED EVENT HANDLERS - Simplified version without complex composition
export const createEventHandler = curry((eventType, handler) => 
    (...args) => {
        console.log(`🎯 Event handler called for: ${eventType}`);
        
        // Spustit handler bezpečně
        safeExecute(handler)(...args);
        
        // Emitovat událost
        emitter.emit(eventType);
        
        // Pro debugging
        console.log(`✅ Handler pro ${eventType} dokončen`);
    }
);

// 🎮 GAME ACTION HANDLERS
export const createNewGameHandler = () => createEventHandler(
    EVENTS.NEW_GAME,
    async () => {
        const { startNewGame } = await import('../../game/controllers/gameFlowController.js');
        hideAllModals();
        startNewGame();
    }
);

export const createMenuHandler = () => createEventHandler(
    EVENTS.RETURN_TO_MENU,
    async () => {
        const { returnToMainMenu } = await import('../../game/controllers/gameFlowController.js');
        hideAllModals();
        returnToMainMenu();
    }
);

export const createSaveScoreHandler = () => createEventHandler(
    EVENTS.SCORE_SAVE,
    async () => {
        console.log('💾 Save score handler triggered');
        const { saveScore } = await import('../../game/controllers/gameFlowController.js');
        saveScore();
    }
);
