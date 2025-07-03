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
        
        try {
            // Definujeme mapování typů hráčů na CSS třídy a neonové barvy
            // Oprava barev podle HTML: ChatGPT má oranžovou, Claude má růžovou
            const playerTypeMapping = {
                'human': { class: 'human-player', color: '--neon-green' },
                'gemini': { class: 'gemini-player', color: '--neon-blue' },
                'chatgpt': { class: 'chatgpt-player', color: '--neon-orange' },
                'claude': { class: 'claude-player', color: '--neon-pink' }
            };
            
            // DŮLEŽITÉ: Důkladně vyčistíme všechna aktivní zvýraznění a inline styly
            // Tím zajistíme, že žádné předchozí styly nebudou přetrvávat
            document.querySelectorAll('.player').forEach(p => {
                // Odstranění třídy active
                p.classList.remove('active');
                
                // Kompletní reset inline stylů
                p.style.borderColor = '';
                p.style.boxShadow = '';
                p.style.animation = '';
                p.style.transform = '';
                
                // Odstranění jakýchkoliv dalších potenciálních tříd pro aktivní stav
                p.classList.remove('player-active');
                p.classList.remove('active-player');
            });
            
            // Získáme aktuálního hráče
            const currentPlayer = gameState.players[gameState.currentPlayer];
            if (!currentPlayer) {
                console.error('🚨 Aktuální hráč nenalezen v gameState, oprava stavu hry...');
                // Pokusíme se napravit stav
                gameState.currentPlayer = 0;
                return; // Předčasně ukončíme, další volání updateActivePlayer to napraví
            }
            
            const currentPlayerType = currentPlayer.type;
            if (!currentPlayerType) {
                console.error('🚨 Aktuální hráč nemá definovaný typ, používám default "human"');
                currentPlayer.type = 'human'; // Pojistka proti chybějícím datům
            }
            
            // Získáme mapování pro tento typ hráče
            let typeConfig = playerTypeMapping[currentPlayer.type || 'human'];
            if (!typeConfig) {
                console.error(`🚨 Neznámý typ hráče: ${currentPlayer.type}, používám default`);
                // Použijeme výchozí mapování pro případ neznámého typu
                typeConfig = playerTypeMapping['human'];
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
            // Použijeme !important pro zajištění, že žádná jiná pravidla nepřepíší tyto styly
            const color = `var(${typeConfig.color})`;
            activePlayer.style.cssText = `
                background: rgba(0, 0, 0, 0.8) !important;
                border-color: ${color} !important;
                box-shadow: 0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color} !important;
                animation: player-active-pulse 2s ease-in-out infinite !important;
            `;
            
            console.log(`🎯 Přidána třída active hráči: ${typeConfig.class} s typem: ${currentPlayer.type}`);
            console.log(`🎯 Nastavena barva: ${color}`);
        } catch (error) {
            console.error('⚠️ Chyba při aktualizaci aktivního hráče:', error);
        }
    }
);
