/**
 * Game UI Controller
 * Řídí zobrazení herních prvků
 */

import { gameState } from '../game/gameState.js';
import { calculateScore } from '../game/diceLogic.js';

/**
 * Aktualizuje zobrazení hry
 */
export function updateGameDisplay() {
    // Update dice display
    const diceContainer = document.getElementById('humanDiceContainer');
    if (!diceContainer) return;
    
    diceContainer.innerHTML = '';
    
    gameState.dice.forEach((die, index) => {
        const dieElement = document.createElement('div');
        
        // Určení CSS tříd pro kostku
        let classes = 'dice';
        if (die.selected) classes += ' selected';
        if (die.farkle) classes += ' farkle';
        
        // Zvýraznění bodujících kostek (pokud nejsou vybrané a hra je aktivní)
        if (!die.selected && !die.farkle && gameState.currentPlayer === 0) {
            const singleDieScore = calculateScore([die.value]);
            if (singleDieScore > 0) {
                classes += ' scoring';
            }
        }
        
        dieElement.className = classes;
        dieElement.textContent = die.value;
        dieElement.addEventListener('click', () => {
            if (gameState.currentPlayer === 0 && !die.farkle) {
                // Emit custom event to avoid circular dependency
                const event = new CustomEvent('dieSelected', { detail: { index } });
                document.dispatchEvent(event);
            }
        });
        diceContainer.appendChild(dieElement);
    });
    
    // Show banked dice
    gameState.bankedDice.forEach(value => {
        const dieElement = document.createElement('div');
        dieElement.className = 'dice banked';
        dieElement.textContent = value;
        diceContainer.appendChild(dieElement);
    });
    
    // Update current turn score
    const humanTurnScore = document.getElementById('humanTurnScore');
    if (humanTurnScore) {
        humanTurnScore.textContent = gameState.currentTurnScore;
    }
    
    const selectedDice = gameState.dice.filter(d => d.selected);
    const canBank = selectedDice.length > 0 && calculateScore(selectedDice.map(d => d.value)) > 0;
    const canEndTurn = gameState.currentTurnScore >= 250;
    const canRoll = gameState.rollsLeft > 0 && !gameState.mustBankDice && gameState.currentPlayer === 0;
    
    const bankBtn = document.getElementById('bankScoreBtn');
    const rollBtn = document.getElementById('rollDiceBtn');
    
    if (bankBtn) bankBtn.disabled = !canBank || gameState.currentPlayer !== 0;
    if (rollBtn) rollBtn.disabled = !canRoll;
    
    // Zobrazit varování, pokud musí hráč odložit kostky
    if (gameState.mustBankDice && gameState.currentPlayer === 0) {
        const humanStatus = document.getElementById('humanPlayerStatus');
        if (humanStatus) {
            humanStatus.textContent = '⚠️ Musíte odložit alespoň jednu bodující kombinaci!';
            humanStatus.style.color = 'var(--neon-orange)';
        }
    }
}

/**
 * Aktualizuje tabulku skóre
 */
export function updateScoreboard() {
    // Aktualizuj skóre lidského hráče
    const humanTotalScore = document.getElementById('humanTotalScore');
    if (humanTotalScore && gameState.players[0]) {
        humanTotalScore.textContent = gameState.players[0].score;
    }
    
    // Aktualizuj skóre AI hráče
    const aiTotalScore = document.getElementById('aiTotalScore');
    if (aiTotalScore && gameState.players[1]) {
        aiTotalScore.textContent = gameState.players[1].score;
    }
}

/**
 * Aktualizuje zobrazení aktivního hráče
 */
export function updateActivePlayer() {
    const humanSection = document.getElementById('humanPlayerSection');
    const aiSection = document.getElementById('aiPlayerSection');
    
    if (gameState.currentPlayer === 0) {
        if (humanSection) humanSection.classList.add('active');
        if (aiSection) aiSection.classList.remove('active');
    } else {
        if (humanSection) humanSection.classList.remove('active');
        if (aiSection) aiSection.classList.add('active');
    }
}
