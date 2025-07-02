/**
 * 📊 Scoreboard Module - Funkcionální správa skóre tabulky
 */

import { pipe, when } from 'ramda';
import { gameState } from '../../game/gameState.js';
import { safeGetElement } from '../../utils/gameUtils.js';

// 📊 PLAYER ELEMENT UPDATER - Functional approach
const updatePlayerElement = (player, index) => {
    const playerId = index === 0 ? 'humanPlayer' : `aiPlayer${index}`;
    const playerElement = safeGetElement(playerId);
    
    when(
        Boolean,
        (element) => {
            const nameElement = element.querySelector('.player-name');
            const scoreElement = element.querySelector('.player-score');
            
            when(Boolean, (el) => { el.textContent = player.name; })(nameElement);
            when(Boolean, (el) => { el.textContent = player.score; })(scoreElement);
        }
    )(playerElement);
};

// 🎯 ACTIVE PLAYER INDICATOR - Přepracovaný s spolehlivou detekci a správnými barvami hráčů
const updatePlayerActiveState = (player, _index) => {
    // Mapování typů hráčů na CSS třídy - uspořádané podle indexů hráčů
    const playerClasses = [
        'human-player',  // Index 0 - lidský hráč
        'gemini-player', // Index 1 - Gemini AI
        'chatgpt-player', // Index 2 - ChatGPT AI
        'claude-player'   // Index 3 - Claude AI
    ];
    
    // Nejprve resetujeme všechny hráče - odstraníme třídu active
    document.querySelectorAll('.player').forEach(p => {
        p.classList.remove('active');
    });
    
    // Najdeme aktuálního hráče a označíme ho jako aktivního
    const currentPlayerClass = playerClasses[gameState.currentPlayer];
    if (!currentPlayerClass) {
        console.error(`🔴 Neplatný index hráče: ${gameState.currentPlayer}`);
        return;
    }
    
    // Vyhledáme element aktivního hráče
    const activePlayerElement = document.querySelector(`.${currentPlayerClass}`);
    if (activePlayerElement) {
        // Přidáme třídu active pro aktivního hráče
        activePlayerElement.classList.add('active');
        
        console.log(`🎯 Aktivní hráč: ${gameState.currentPlayer} (${player.name}) - třída ${currentPlayerClass}`);
    } else {
        console.error(`🔴 Element hráče nenalezen pro třídu: .${currentPlayerClass}`);
    }
};

// 📊 MAIN SCOREBOARD UPDATER
export const updateScoreboard = pipe(
    () => console.log('📊 Updating scoreboard...'),
    () => gameState.players.forEach(updatePlayerElement)
);

// 🎯 ACTIVE PLAYER UPDATER
export const updateActivePlayer = pipe(
    () => console.log('🎯 Updating active player...'),
    () => gameState.players.forEach(updatePlayerActiveState)
);
