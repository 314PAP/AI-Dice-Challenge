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

// 🎯 ACTIVE PLAYER INDICATOR - Functional highlighting
const updatePlayerActiveState = (player, index) => {
    // Map player types to correct CSS classes
    const playerClasses = [
        '.human-player',
        '.gemini-player', 
        '.chatgpt-player',
        '.claude-player'
    ];
    
    // Získat barvy hráče z CSS proměnných (pro konzistentnost použití)
    const playerColors = [
        'var(--neon-green)',   // Human
        'var(--neon-blue)',    // Gemini
        'var(--neon-pink)',    // ChatGPT
        'var(--neon-orange)'   // Claude
    ];
    
    const playerElement = document.querySelector(playerClasses[index]);
    
    when(
        Boolean,
        (element) => {
            const isActive = gameState.currentPlayer === index;
            
            // Remove active from all players first
            if (isActive) {
                document.querySelectorAll('.player').forEach(p => {
                    p.classList.remove('active');
                    p.classList.add('inactive');
                });
            }
            
            // Aplikovat třídy aktivního/neaktivního hráče
            element.classList.toggle('active', isActive);
            element.classList.toggle('inactive', !isActive);
            
            // Zajistíme, že CSS třída 'active' na prvku je aktuální
            // (CSS v themes.css již správně nastavuje barvy)
            console.log(`🎯 Player ${index} (${player.name}) - Active: ${isActive}`);
        }
    )(playerElement);
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
