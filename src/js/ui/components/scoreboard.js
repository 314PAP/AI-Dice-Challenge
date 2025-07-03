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
        
        // Definujeme mapování typů hráčů na CSS třídy a neonové barvy
        const playerTypeMapping = {
            'human': { class: 'human-player', color: '--neon-green' },
            'gemini': { class: 'gemini-player', color: '--neon-blue' },
            'chatgpt': { class: 'chatgpt-player', color: '--neon-pink' },
            'claude': { class: 'claude-player', color: '--neon-orange' }
        };
        
        // Odstraníme třídu active a inline styly ze všech hráčů
        document.querySelectorAll('.player').forEach(p => {
            p.classList.remove('active');
            p.style.borderColor = '';
            p.style.boxShadow = '';
        });
        
        // Získáme aktuálního hráče
        const currentPlayer = gameState.players[gameState.currentPlayer];
        if (!currentPlayer) return; // Ochrana proti chybám
        
        const currentPlayerType = currentPlayer.type;
        if (!currentPlayerType) return; // Ochrana proti chybám
        
        // Získáme mapování pro tento typ hráče
        const typeConfig = playerTypeMapping[currentPlayerType];
        if (!typeConfig) {
            console.error(`🚨 Neznámý typ hráče: ${currentPlayerType}`);
            return;
        }
        
        // Najdeme element hráče v DOM
        const activePlayer = document.querySelector(`.${typeConfig.class}`);
        if (!activePlayer) {
            console.error(`🚨 Nenalezen element pro třídu: ${typeConfig.class}`);
            return;
        }
        
        // Aplikujeme třídu active
        activePlayer.classList.add('active');
        
        // Explicitně nastavíme barvy pomocí inline stylů jako zálohu
        activePlayer.style.borderColor = `var(${typeConfig.color})`;
        activePlayer.style.boxShadow = `0 0 10px var(${typeConfig.color}), 0 0 20px var(${typeConfig.color})`;
        
        console.log(`🎯 Přidána třída active hráči: ${typeConfig.class} s typem: ${currentPlayerType}`);
    }
);
