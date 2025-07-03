/**
 * 📊 Scoreboard Module - Funkcionální správa skóre tabulky
 */

import { pipe, when } from 'ramda';
import { gameState } from '../../game/gameState.js';
import { safeGetElement } from '../../utils/gameUtils.js';

// 📊 PLAYER ELEMENT UPDATER - Functional approach
const updatePlayerElement = (player, index) => {
    // Použijeme jak původní ID, tak novou strukturu
    const playerId = index === 0 ? 'humanPlayer' : `aiPlayer${index}`;
    const playerElement = safeGetElement(playerId);
    
    when(
        Boolean,
        (element) => {
            const nameElement = element.querySelector('.player-name');
            const scoreElement = element.querySelector('.player-score span');
            
            when(Boolean, (el) => { el.textContent = player.name; })(nameElement);
            when(Boolean, (el) => { el.textContent = player.score; })(scoreElement);
        }
    )(playerElement);
    
    // Aktualizace skóre také v moderní struktuře hráčů
    const playerTypes = ['human', 'gemini', 'chatgpt', 'claude'];
    const playerType = playerTypes[index];
    if (playerType) {
        const scoreSpan = document.getElementById(`${playerType}Score`);
        if (scoreSpan) {
            scoreSpan.textContent = player.score;
        }
    }
};

// 🎯 ACTIVE PLAYER INDICATOR - Oprava pro správné barvy a zobrazení aktivního hráče
// Nyní je tato funkce nahrazena přímo v updateActivePlayer
// Ponecháváme ji zde jako referenci
const _updatePlayerActiveState = (_player, _index) => {
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
    
    // Získáme aktuálního hráče
    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (!currentPlayer) {
        console.error(`🔴 Neplatný index hráče: ${gameState.currentPlayer}`);
        return;
    }
    
    // Správný element hráče najdeme pomocí jeho indexu
    const currentPlayerClass = playerClasses[gameState.currentPlayer];
    if (!currentPlayerClass) {
        console.error(`🔴 Neplatná třída pro index hráče: ${gameState.currentPlayer}`);
        return;
    }
    
    // Vyhledáme element aktivního hráče podle správné třídy
    const activePlayerElement = document.querySelector(`.${currentPlayerClass}`);
    if (activePlayerElement) {
        // Přidáme třídu active pro aktivního hráče a zajistíme, že ostatní třídy active jsou odstraněny
        document.querySelectorAll('.player.active').forEach(p => p.classList.remove('active'));
        activePlayerElement.classList.add('active');
        
        // Debug log pro ověření správného označení
        console.log(`🎯 Aktivní hráč: ${gameState.currentPlayer} (${currentPlayer.name}) - třída ${currentPlayerClass}`);
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
    () => {
        console.log('🎯 Updating active player...');
        console.log(`🎯 Current player index: ${gameState.currentPlayer}, name: ${gameState.players[gameState.currentPlayer]?.name}`);
        
        // Odstraníme třídu active ze všech hráčů
        document.querySelectorAll('.player').forEach(p => {
            p.classList.remove('active');
        });
        
        // Přidáme třídu active pouze aktuálnímu hráči
        const playerTypes = ['human-player', 'gemini-player', 'chatgpt-player', 'claude-player'];
        const currentPlayerClass = playerTypes[gameState.currentPlayer];
        const currentPlayerType = gameState.players[gameState.currentPlayer]?.type;
        
        if (currentPlayerClass) {
            const activePlayer = document.querySelector(`.${currentPlayerClass}`);
            if (activePlayer) {
                activePlayer.classList.add('active');
                
                // Aplikujeme specifické neonové barvy podle typu hráče
                let playerColor;
                if (currentPlayerType === 'human') {
                    playerColor = '--neon-green';
                } else if (currentPlayerType === 'gemini') {
                    playerColor = '--neon-blue';
                } else if (currentPlayerType === 'chatgpt') {
                    playerColor = '--neon-pink';
                } else if (currentPlayerType === 'claude') {
                    playerColor = '--neon-orange';
                }
                
                // Explicitně nastavíme barvy pomocí inline stylů pro zajištění, že budou mít přednost
                // Toto je záložní řešení, kdyby CSS nebylo správně aplikováno
                if (playerColor) {
                    activePlayer.style.borderColor = `var(${playerColor})`;
                    activePlayer.style.boxShadow = `0 0 10px var(${playerColor}), 0 0 20px var(${playerColor})`;
                }
                
                console.log(`🎯 Přidána třída active hráči: ${currentPlayerClass} s typem: ${currentPlayerType}`);
            }
        }
    }
);
