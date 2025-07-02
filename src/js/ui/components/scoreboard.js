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

// 🎯 ACTIVE PLAYER INDICATOR - Functional highlighting with player-specific colors
const updatePlayerActiveState = (player, index) => {
    // Map player types to correct CSS classes
    const playerClasses = [
        '.human-player',
        '.gemini-player', 
        '.chatgpt-player',
        '.claude-player'
    ];
    
    // Player-specific color variables from CSS
    const playerColors = [
        '--neon-green',   // Human
        '--neon-blue',    // Gemini
        '--neon-pink',    // ChatGPT
        '--neon-orange'   // Claude
    ];
    
    const playerElement = document.querySelector(playerClasses[index]);
    
    when(
        Boolean,
        (element) => {
            const isActive = gameState.currentPlayer === index;
            
            // Remove active from all players first and reset custom styles
            document.querySelectorAll('.player').forEach(p => {
                p.classList.remove('active');
                p.classList.add('inactive');
                p.style.boxShadow = ''; // Reset any custom box shadows
            });
            
            // Apply active/inactive classes and correct color for active player
            if (isActive) {
                element.classList.add('active');
                element.classList.remove('inactive');
                
                // Use CSS variable for player's color
                const playerColor = `var(${playerColors[index]})`;
                element.style.boxShadow = `0 0 20px ${playerColor}`; 
            } else {
                element.classList.remove('active');
                element.classList.add('inactive');
            }
            
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
