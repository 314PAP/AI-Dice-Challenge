/**
 * 🎮 ADVANCED EVENT SYSTEM - Modularized and Optimized
 * Kombinuje event handlery z modulárních komponent
 */

// Jednoduché implementace pro debounce a memoize
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const memoize = (func) => {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
};

import { emitter, EVENTS } from './events/eventCore.js';
import { showModal, hideModal, showHallOfFame, hideHallOfFameWithContext } from './events/modalHandlers.js';
import { createEventHandler, createNewGameHandler, createMenuHandler, createSaveScoreHandler } from './events/gameHandlers.js';
import { displayHallOfFame } from './hallOfFame.js';

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
                window.hallOfFameFromGameOver = false; // Important: NOT from game over
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
                
                // Explicitně nastavit flag před skrytím game over modalu
                window.hallOfFameFromGameOver = true;
                console.log('🏆 Flag hallOfFameFromGameOver nastaven na true');
                
                // Uložit globálně stav hry pro pozdější kontrolu
                if (window.gameModule && window.gameModule.gameState) {
                    window.savedGameState = {
                        gameEnded: window.gameModule.gameState.gameEnded,
                        players: JSON.parse(JSON.stringify(window.gameModule.gameState.players))
                    };
                    console.log('🏆 Uložen aktuální stav hry');
                }
                
                // Nejprve skrýt game over modal
                hideModal('gameOverModal', 'show-hof');
                
                // Poté zobrazit Hall of Fame
                setTimeout(() => {
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
        saveScoreBtn.addEventListener('click', debounce(createSaveScoreHandler(), 300));
        console.log('✅ Save score handler attached');
    }
    
    // 🎮 NEW GAME ACTIONS
    ['startNewGameBtn', 'newGameFromHallBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', debounce(createNewGameHandler(), 300));
            console.log(`✅ New game handler attached (${btnId})`);
        }
    });
    
    // 🏠 MAIN MENU ACTIONS
    ['returnToMenuBtn', 'mainMenuFromHallBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', debounce(createMenuHandler(), 300));
            console.log(`✅ Main menu handler attached (${btnId})`);
        }
    });
    
    console.log('🎉 Optimized event system ready!');
});

// 📊 EVENT DEBUGGING - Development only
if (import.meta.env.DEV) {
    Object.values(EVENTS).forEach(event => {
        emitter.on(event, (data) => {
            console.log(`🎯 Event: ${event}`, data);
        });
    });
}

// 📤 RE-EXPORT CORE FUNCTIONS
export {
    emitter,
    EVENTS,
    showModal,
    hideModal,
    showHallOfFame,
    hideHallOfFameWithContext,
    createEventHandler
};
