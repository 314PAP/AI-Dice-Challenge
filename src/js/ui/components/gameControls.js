/**
 * 🎮 Game Controls Module - Funkcionální správa tlačítek a ovládání
 */

import { when } from 'ramda';
import { gameState } from '../../game/gameState.js';
import { calculateScore } from '../../game/diceLogic.js';
import { safeGetElement } from '../../utils/gameUtils.js';

// 🎮 GAME CONTROLS STATE UPDATER - Functional button management
export const updateControlsState = () => {
    const selectedValues = gameState.selectedDice.map(index => gameState.diceValues[index]);
    const canBank = gameState.mustBankDice && gameState.selectedDice.length > 0 && calculateScore(selectedValues) > 0;
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
export const updateGameInfo = () => {
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
    
    // Aktualizace mobilních elementů
    const mobileUpdaters = [
        ['currentTurnScoreMobile', `Skóre tahu: ${gameState.currentTurnScore}`],
        ['turnInfoMobile', `${gameState.players[gameState.currentPlayer]?.name || 'Neznámý'} na tahu!`]
    ];
    
    mobileUpdaters.forEach(([id, text]) => {
        when(
            Boolean,
            (el) => { el.textContent = text; }
        )(safeGetElement(id));
    });
};

// ⚠️ PLAYER STATUS UPDATER - Functional warning system
export const updatePlayerStatus = () => {
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
