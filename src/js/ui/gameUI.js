/**
 * 🎮 Game UI Controller - Modularized and Optimized
 * Kombinuje funkce z komponentních modulů pro lepší maintainability
 */

import { pipe } from 'ramda';
// Jednoduchá implementace debounce
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

import { updateDiceContainer, createDiceElement } from './components/diceRenderer.js';
import { updateScoreboard, updateActivePlayer } from './components/scoreboard.js';
import { updateControlsState, updateGameInfo, updatePlayerStatus } from './components/gameControls.js';

// 🎮 MAIN UPDATE FUNCTION - Debounced for performance
export const updateGameDisplay = debounce(() => {
    console.log('🔄 Updating game display...');
    updateDiceContainer();
}, 50);

// 🔄 COMPREHENSIVE UPDATE FUNCTION - Combines all updates
export const updateCompleteGameDisplay = debounce(pipe(
    () => console.log('🔄 Complete game display update...'),
    updateDiceContainer,
    updateControlsState,
    updateGameInfo,
    updatePlayerStatus
), 100);

// 📤 RE-EXPORT COMPONENT FUNCTIONS
export {
    updateDiceContainer,
    updateScoreboard, 
    updateActivePlayer,
    updateControlsState,
    updateGameInfo,
    updatePlayerStatus,
    createDiceElement
};
