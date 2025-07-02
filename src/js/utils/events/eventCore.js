/**
 * 🎯 Event Types and Core Event System
 */

import mitt from 'mitt';

// 📡 Global Event Emitter
export const emitter = mitt();

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
