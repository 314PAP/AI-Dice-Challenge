/**
 * 🎯 Game Event Handlers (New Game, Menu, etc.)
 */

import { curry, pipe } from 'ramda';
import { debounce } from 'lodash-es';
import { emitter, EVENTS } from './eventCore.js';
import { hideAllModals } from './modalHandlers.js';
import { safeExecute } from '../gameUtils.js';

// 📝 OPTIMIZED EVENT HANDLERS - Using function composition
export const createEventHandler = curry((eventType, handler) => 
    pipe(
        safeExecute,
        () => emitter.emit(eventType)
    )(handler)
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
        const { saveScore } = await import('../../game/controllers/gameFlowController.js');
        saveScore();
    }
);
