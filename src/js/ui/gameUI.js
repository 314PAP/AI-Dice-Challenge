/**
 * 🎮 Game UI Controller - Zjednodušená implementace
 */

import { gameState } from '../game/gameState.js';
import { updateDiceContainer, createDiceElement } from './components/diceRenderer.js';
import { updateMobileDiceContainer } from './components/mobileDiceRenderer.js';
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
    console.log(`🔄 Game state check - Final round: ${gameState.finalRound}, End turn processing: ${gameState.endTurnProcessing}`);
    
    try {
        // Kontrola konzistence stavu před aktualizací UI
        if (gameState.currentPlayer >= gameState.players.length) {
            console.error('⚠️ Neplatný index aktuálního hráče, resetuji na 0');
            gameState.currentPlayer = 0;
        }
        
        // Zajistíme, že všechny hodnoty jsou platné před aktualizací UI
        if (gameState.currentTurnScore < 0) {
            console.warn('⚠️ Negativní skóre tahu opraveno na 0');
            gameState.currentTurnScore = 0;
        }
        
        // Kontrola zda nedošlo k chybě ve stavu finálního kola
        if (gameState.finalRound && gameState.finalRoundInitiator === null) {
            console.error('⚠️ Finální kolo aktivní, ale chybí iniciátor, opravuji...');
            gameState.finalRoundInitiator = 0; // Defaultně nastavíme na prvního hráče jako pojistka
        }
        
        updateDiceContainer();
        updateMobileDiceContainer();
        updateControlsState();
        updateScoreboard(); // Přidáno pro aktualizaci skóre u avatarů
        updateActivePlayer(); // Zajistí správné zvýraznění aktivního hráče
        updateGameInfo();    // Zajistí aktualizaci informací o tahu a skóre
        
    } catch (error) {
        console.error('⚠️ Chyba při aktualizaci herního rozhraní:', error);
    }
}, 50);

// 🔄 COMPREHENSIVE UPDATE FUNCTION - Combines all updates
export const updateCompleteGameDisplay = debounce(() => {
    console.log('🔄 Complete game display update...');
    updateDiceContainer();
    updateMobileDiceContainer();
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
