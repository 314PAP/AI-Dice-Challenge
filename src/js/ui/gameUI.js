/**
 * 🎮 Game UI Controller - Modernized with Functional Programming
 * Maximizes Ramda + Lodash-ES for clean, performant UI updates
 */

import { pipe, when, unless, cond, always, T, isEmpty, map, filter, prop } from 'ramda';
import { debounce, throttle, partial, memoize } from 'lodash-es';
import { gameState } from '../game/gameState.js';
import { calculateScore } from '../game/diceLogic.js';
import { safeGetElement, debouncedUpdateUI } from '../utils/gameUtils.js';

// 🎲 DICE RENDERING - Functional approach with Ramda/Lodash
const createDiceElement = (value, index, type = 'current') => {
    const dieElement = document.createElement('div');
    
    const classes = pipe(
        () => ['dice'],
        when(() => type === 'banked', (classes) => [...classes, 'banked']),
        when(() => type === 'current' && gameState.selectedDice.includes(index), 
             (classes) => [...classes, 'selected']),
        when(() => type === 'current' && 
                   !gameState.selectedDice.includes(index) && 
                   gameState.currentPlayer === 0 && 
                   calculateScore([value]) > 0,
             (classes) => [...classes, 'scoring']),
        (classes) => classes.join(' ')
    )();
    
    dieElement.className = classes;
    dieElement.textContent = value;
    
    // Add click handler for current dice only
    when(
        () => type === 'current' && gameState.currentPlayer === 0,
        () => {
            dieElement.addEventListener('click', () => {
                if (window.selectDie) window.selectDie(index);
            });
        }
    )();
    
    return dieElement;
};

// 🎯 DICE CONTAINER UPDATER - Optimized with functional composition
const updateDiceContainer = pipe(
    () => safeGetElement('diceContainer'),
    unless(Boolean, () => {
        console.warn('🚫 Dice container not found');
        return null;
    }),
    (container) => {
        container.innerHTML = '';
        
        const allDiceContainer = document.createElement('div');
        allDiceContainer.className = 'all-dice-container';
        
        // Render banked dice first (if any)
        when(
            () => !isEmpty(gameState.bankedDiceThisTurn),
            () => {
                gameState.bankedDiceThisTurn.forEach(value => {
                    const dieElement = createDiceElement(value, -1, 'banked');
                    allDiceContainer.appendChild(dieElement);
                });
            }
        )();
        
        // Render current dice roll
        when(
            () => !isEmpty(gameState.diceValues),
            () => {
                gameState.diceValues.forEach((value, index) => {
                    const dieElement = createDiceElement(value, index, 'current');
                    allDiceContainer.appendChild(dieElement);
                });
            }
        )();
        
        container.appendChild(allDiceContainer);
        return container;
    }
);

// 🎮 MAIN UPDATE FUNCTION - Debounced for performance
export const updateGameDisplay = debounce(() => {
    console.log('🔄 Updating game display...');
    updateDiceContainer();
}, 50);

// 📊 SCOREBOARD UPDATER - Functional approach
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

export const updateScoreboard = pipe(
    () => console.log('📊 Updating scoreboard...'),
    () => gameState.players.forEach(updatePlayerElement)
);

// 🎯 ACTIVE PLAYER INDICATOR - Functional highlighting
const updatePlayerActiveState = (player, index) => {
    const playerId = index === 0 ? 'humanPlayer' : `aiPlayer${index}`;
    const playerElement = safeGetElement(playerId);
    
    when(
        Boolean,
        (element) => {
            const isActive = gameState.currentPlayer === index;
            element.classList.toggle('active', isActive);
            element.classList.toggle('inactive', !isActive);
        }
    )(playerElement);
};

export const updateActivePlayer = pipe(
    () => console.log('🎯 Updating active player...'),
    () => gameState.players.forEach(updatePlayerActiveState)
);

// 🎮 GAME CONTROLS UPDATER - Functional button state management
const updateControlsState = () => {
    const selectedValues = gameState.selectedDice.map(index => gameState.diceValues[index]);
    const canBank = gameState.selectedDice.length > 0 && calculateScore(selectedValues) > 0;
    const canEndTurn = gameState.currentTurnScore >= 300 && !gameState.mustBankDice;
    const canRoll = gameState.availableDice > 0 && !gameState.mustBankDice && gameState.currentPlayer === 0;
    const isHumanTurn = gameState.currentPlayer === 0;
    
    // Button state updaters
    const buttonUpdaters = [
        ['bankBtn', !canBank || !isHumanTurn],
        ['rollBtn', !canRoll],
        ['endTurnBtn', !canEndTurn || !isHumanTurn]
    ];
    
    buttonUpdaters.forEach(([id, disabled]) => {
        when(
            Boolean,
            (btn) => { btn.disabled = disabled; }
        )(safeGetElement(id));
    });
};

// 📊 GAME INFO UPDATER - Functional info display
const updateGameInfo = () => {
    const infoUpdaters = [
        ['currentTurnScore', `Skóre tahu: ${gameState.currentTurnScore}`],
        ['availableDice', `Volné kostky: ${gameState.availableDice}`],
        ['turnInfo', `${gameState.players[gameState.currentPlayer]?.name || 'Neznámý'} na tahu!`]
    ];
    
    infoUpdaters.forEach(([id, text]) => {
        when(
            Boolean,
            (el) => { el.textContent = text; }
        )(safeGetElement(id));
    });
};

// ⚠️ PLAYER STATUS UPDATER - Functional warning system
const updatePlayerStatus = () => {
    const humanStatus = safeGetElement('humanPlayerStatus');
    
    when(
        Boolean,
        (statusEl) => {
            if (gameState.mustBankDice && gameState.currentPlayer === 0) {
                statusEl.textContent = '⚠️ Musíte odložit alespoň jednu bodující kombinaci!';
                statusEl.style.color = 'var(--neon-orange)';
            } else if (gameState.currentPlayer === 0) {
                statusEl.textContent = '';
                statusEl.style.color = '';
            }
        }
    )(humanStatus);
};

// 🔄 COMPREHENSIVE UPDATE FUNCTION - Combines all updates
export const updateCompleteGameDisplay = debounce(pipe(
    () => console.log('🔄 Complete game display update...'),
    updateDiceContainer,
    updateControlsState,
    updateGameInfo,
    updatePlayerStatus
), 100);

// 📤 EXPORT MODERNIZED FUNCTIONS
export {
    updateControlsState,
    updateGameInfo,
    updatePlayerStatus,
    createDiceElement
};
