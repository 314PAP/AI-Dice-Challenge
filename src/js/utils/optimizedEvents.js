/**
 * 🎮 ADVANCED EVENT SYSTEM - Optimalizovaný s knihovnami
 * Maximální využití mitt + lodash-es + ramda pro čistý, funkcionální kód
 */

import mitt from 'mitt';
import { debounce, throttle, once, memoize } from 'lodash-es';
import { curry, pipe, compose, when, unless, cond, always, T } from 'ramda';
import { toggleModal, safeExecute, debouncedChatMessage } from './gameUtils.js';
import { displayHallOfFame, hideHallOfFame } from './hallOfFame.js';
import { gameState } from '../game/gameState.js';

// 📡 Global Event Emitter
const emitter = mitt();
export { emitter };

// 🎯 EVENT TYPES
export const EVENTS = {
    GAME_START: 'game:start',
    GAME_END: 'game:end', 
    MODAL_SHOW: 'modal:show',
    MODAL_HIDE: 'modal:hide',
    HALL_OF_FAME_SHOW: 'hof:show',
    HALL_OF_FAME_HIDE: 'hof:hide',
    SCORE_SAVE: 'score:save',
    NEW_GAME: 'game:new',
    RETURN_TO_MENU: 'menu:return'
};

// 🔧 UTILITY FUNCTIONS WITH RAMDA
const isGameEnded = () => gameState.gameEnded;
const isFromMainMenu = () => !gameState.gameEnded;
const setHallOfFameFlag = (value) => { window.hallOfFameFromGameOver = value; };

// 🎮 MODAL CONTROLLERS - Curried functions
const showModal = curry((modalId, context) => {
    emitter.emit(EVENTS.MODAL_SHOW, { modalId, context });
    return toggleModal(modalId, true);
});

const hideModal = curry((modalId, context) => {
    emitter.emit(EVENTS.MODAL_HIDE, { modalId, context });
    return toggleModal(modalId, false);
});

// 🏆 HALL OF FAME CONTROLLERS - Functional approach
const showHallOfFame = pipe(
    () => setHallOfFameFlag(isGameEnded()),
    () => emitter.emit(EVENTS.HALL_OF_FAME_SHOW, { context: isGameEnded() ? 'game-over' : 'main-menu' }),
    () => displayHallOfFame()
);

const hideHallOfFameWithContext = cond([
    [() => window.hallOfFameFromGameOver && isGameEnded(), 
     () => pipe(
         () => hideHallOfFame(),
         () => showModal('gameOverModal', 'return-from-hof'),
         () => setHallOfFameFlag(false)
     )()],
    [T, () => hideHallOfFame()]
]);

// 📝 OPTIMIZED EVENT HANDLERS - Using function composition
const createEventHandler = curry((eventType, handler) => 
    pipe(
        safeExecute,
        when(() => eventType, () => emitter.emit(eventType))
    )(handler)
);

// 🎯 MAIN EVENT SETUP - Memoized for performance
export const setupOptimizedEvents = memoize(() => {
    console.log('🚀 Setting up optimized event system...');
    
    // 🏠 MAIN MENU HALL OF FAME - Fixed logic
    const hallOfFameBtn = document.getElementById('hallOfFameBtn');
    if (hallOfFameBtn) {
        const mainMenuHallOfFameHandler = createEventHandler(
            EVENTS.HALL_OF_FAME_SHOW,
            () => {
                console.log('🏆 Main menu Hall of Fame clicked');
                setHallOfFameFlag(false); // Important: NOT from game over
                displayHallOfFame();
            }
        );
        
        hallOfFameBtn.addEventListener('click', debounce(mainMenuHallOfFameHandler, 200));
        console.log('✅ Main menu Hall of Fame handler attached');
    }
    
    // 🎮 GAME OVER HALL OF FAME
    const showHallOfFameBtn = document.getElementById('showHallOfFameBtn');
    if (showHallOfFameBtn) {
        const gameOverHallOfFameHandler = createEventHandler(
            EVENTS.HALL_OF_FAME_SHOW,
            () => {
                console.log('🏆 Game over Hall of Fame clicked');
                hideModal('gameOverModal', 'show-hof');
                setTimeout(() => {
                    setHallOfFameFlag(true); // Important: FROM game over
                    displayHallOfFame();
                }, 300);
            }
        );
        
        showHallOfFameBtn.addEventListener('click', debounce(gameOverHallOfFameHandler, 200));
        console.log('✅ Game over Hall of Fame handler attached');
    }
    
    // 🔙 HALL OF FAME CLOSE - Smart context detection
    const closeHallOfFameBtn = document.getElementById('closeHallOfFameBtn');
    if (closeHallOfFameBtn) {
        const closeHandler = createEventHandler(
            EVENTS.HALL_OF_FAME_HIDE,
            hideHallOfFameWithContext
        );
        
        closeHallOfFameBtn.addEventListener('click', debounce(closeHandler, 200));
        console.log('✅ Hall of Fame close handler attached');
    }
    
    // 💾 SAVE SCORE
    const saveScoreBtn = document.getElementById('saveScoreBtn');
    if (saveScoreBtn) {
        const saveScoreHandler = createEventHandler(
            EVENTS.SCORE_SAVE,
            async () => {
                const { saveScore } = await import('../game/controllers/gameFlowController.js');
                saveScore();
            }
        );
        
        saveScoreBtn.addEventListener('click', debounce(saveScoreHandler, 300));
        console.log('✅ Save score handler attached');
    }
    
    // 🎮 NEW GAME ACTIONS
    ['startNewGameBtn', 'newGameFromHallBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            const newGameHandler = createEventHandler(
                EVENTS.NEW_GAME,
                async () => {
                    const { startNewGame } = await import('../game/controllers/gameFlowController.js');
                    hideAllModals();
                    startNewGame();
                }
            );
            
            btn.addEventListener('click', debounce(newGameHandler, 300));
            console.log(`✅ New game handler attached (${btnId})`);
        }
    });
    
    // 🏠 MAIN MENU ACTIONS
    ['returnToMenuBtn', 'mainMenuFromHallBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            const menuHandler = createEventHandler(
                EVENTS.RETURN_TO_MENU,
                async () => {
                    const { returnToMainMenu } = await import('../game/controllers/gameFlowController.js');
                    hideAllModals();
                    returnToMainMenu();
                }
            );
            
            btn.addEventListener('click', debounce(menuHandler, 300));
            console.log(`✅ Main menu handler attached (${btnId})`);
        }
    });
    
    console.log('🎉 Optimized event system ready!');
});

// 🧹 UTILITY FUNCTIONS
const hideAllModals = () => {
    ['gameOverModal', 'hallOfFameModal'].forEach(modalId => {
        hideModal(modalId, 'cleanup');
    });
    setHallOfFameFlag(false);
};

// 📊 EVENT DEBUGGING - Development only
if (import.meta.env.DEV) {
    Object.values(EVENTS).forEach(event => {
        emitter.on(event, (data) => {
            console.log(`🎯 Event: ${event}`, data);
        });
    });
}

// 🎯 EXPORT OPTIMIZED FUNCTIONS
export {
    showModal,
    hideModal,
    showHallOfFame,
    hideHallOfFameWithContext,
    hideAllModals,
    createEventHandler
};
