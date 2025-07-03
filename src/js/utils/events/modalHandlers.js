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

// Opravená a vylepšená funkce pro bezpečný návrat z Hall of Fame
export const hideHallOfFameWithContext = () => {
    console.log('🏆 Zavírání Hall of Fame...');
    
    // Skrýt Hall of Fame
    hideHallOfFame();
    
    // Pevně uloženou proměnnou si uložíme lokálně pro zpracování
    const fromGameOver = window.hallOfFameFromGameOver;
    
    // Kontrola aktuálního stavu hry přímo z modulu, nikoliv přes globální proměnnou
    const gameIsEnded = isGameEnded();
    
    console.log(`🏆 Návrat ze Síně slávy - gameOver flag: ${fromGameOver}, hra ukončena: ${gameIsEnded}`);
    
    // Pokud jsme přišli z konce hry a hra je ukončená
    if (fromGameOver && gameIsEnded) {
        console.log('🎮 Návrat z Hall of Fame po konci hry - zobrazuji game over modal');
        // Zobrazit znovu game over modal s delším čekáním pro jistotu
        setTimeout(() => {
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                // Přímé nastavení stylu pro zajištění viditelnosti
                gameOverModal.style.display = 'flex';
                gameOverModal.classList.remove('hidden');
                gameOverModal.classList.add('visible');
                emitter.emit(EVENTS.MODAL_SHOW, { modalId: 'gameOverModal', context: 'return-from-hof' });
                
                console.log('🏆 Game over modal znovu zobrazen');
            } else {
                console.error('❌ Game over modal nenalezen!');
            }
        }, 500);
    } else {
        // Pokud jsme v hlavním menu nebo jiném kontextu
        console.log('🎮 Návrat z Hall of Fame - standardní zavření');
    }
    
    // Resetovat flag až na konci celého procesu
    setTimeout(() => {
        window.hallOfFameFromGameOver = false;
        console.log('🏆 Flag hallOfFameFromGameOver resetován');
    }, 600);
    
    // Ujistíme se, že AI timeouty jsou vypnuty, aby nedošlo k emergency modu
    if (window.endAITurn && typeof window.endAITurn === 'function') {
        window.endAITurn();
    }
    
    // Ujistíme se, že všechny ostatní timeouty jsou vymazány
    if (window.clearAllAITimeouts && typeof window.clearAllAITimeouts === 'function') {
        window.clearAllAITimeouts();
    }
};

// 🧹 UTILITY FUNCTIONS
export const hideAllModals = () => {
    ['gameOverModal', 'hallOfFameModal'].forEach(modalId => {
        hideModal(modalId, 'cleanup');
    });
    setHallOfFameFlag(false);
};
