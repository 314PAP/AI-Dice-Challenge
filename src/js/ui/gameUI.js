/**
 * 🎮 Game UI Controller - Zjednodušená implementace
 */

import { updateDiceContainer, createDiceElement } from './components/diceRenderer.js';
import { updateScoreboard, updateActivePlayer } from './components/scoreboard.js';
import { updateControlsState, updateGameInfo, updatePlayerStatus } from './components/gameControls.js';

// Simple debounce implementation
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 🎮 MAIN UPDATE FUNCTION - Debounced for performance
export const updateGameDisplay = debounce(() => {
    console.log('🔄 Updating game display...');
    console.log(`🔄 Current player: ${gameState.currentPlayer} (${gameState.players[gameState.currentPlayer]?.name})`);
    console.log(`🔄 Current turn score: ${gameState.currentTurnScore}`);
    console.log(`🔄 Player scores: ${gameState.players.map(p => p.name + ': ' + p.score).join(', ')}`);
    
    updateDiceContainer();
    updateControlsState();
    updateScoreboard(); // Přidáno pro aktualizaci skóre u avatarů
    updateActivePlayer(); // Zajistí správné zvýraznění aktivního hráče
    updateGameInfo();    // Zajistí aktualizaci informací o tahu a skóre
}, 50);

// 🔄 COMPREHENSIVE UPDATE FUNCTION - Combines all updates
export const updateCompleteGameDisplay = debounce(() => {
    console.log('🔄 Complete game display update...');
    updateDiceContainer();
    updateControlsState();
    updateGameInfo();
    updatePlayerStatus();
}, 100);

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
