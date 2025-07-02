/**
 * 🎮 Modal and Hall of Fame Event Handlers
 */

import { curry, pipe } from 'ramda';
import { emitter, EVENTS } from './eventCore.js';
import { toggleModal } from '../gameUtils.js';
import { displayHallOfFame, hideHallOfFame } from '../hallOfFame.js';
import { gameState } from '../../game/gameState.js';

// 🔧 UTILITY FUNCTIONS WITH RAMDA
const isGameEnded = () => gameState.gameEnded;
const setHallOfFameFlag = (value) => { window.hallOfFameFromGameOver = value; };

// 🎮 MODAL CONTROLLERS - Curried functions
export const showModal = curry((modalId, context) => {
    emitter.emit(EVENTS.MODAL_SHOW, { modalId, context });
    return toggleModal(modalId, true);
});

export const hideModal = curry((modalId, context) => {
    emitter.emit(EVENTS.MODAL_HIDE, { modalId, context });
    return toggleModal(modalId, false);
});

// 🏆 HALL OF FAME CONTROLLERS - Functional approach
export const showHallOfFame = pipe(
    () => setHallOfFameFlag(isGameEnded()),
    () => emitter.emit(EVENTS.HALL_OF_FAME_SHOW, { context: isGameEnded() ? 'game-over' : 'main-menu' }),
    () => displayHallOfFame()
);

// Opravená funkce bez použití pipe a cond, aby nedocházelo k chybám
export const hideHallOfFameWithContext = () => {
    // Skrýt Hall of Fame
    hideHallOfFame();
    
    // Pokud jsme přišli z konce hry a hra je ukončená
    if (window.hallOfFameFromGameOver && isGameEnded()) {
        // Zobrazit znovu game over modal
        setTimeout(() => {
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                gameOverModal.classList.remove('hidden');
                gameOverModal.classList.add('visible');
                emitter.emit(EVENTS.MODAL_SHOW, { modalId: 'gameOverModal', context: 'return-from-hof' });
            }
        }, 300);
    }
    
    // Resetovat flag
    window.hallOfFameFromGameOver = false;
};

// 🧹 UTILITY FUNCTIONS
export const hideAllModals = () => {
    ['gameOverModal', 'hallOfFameModal'].forEach(modalId => {
        hideModal(modalId, 'cleanup');
    });
    setHallOfFameFlag(false);
};
