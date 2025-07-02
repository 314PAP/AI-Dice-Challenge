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
    // Update dice display - minimalist single row design
    const diceContainer = document.getElementById('diceContainer');
    if (!diceContainer) return;
    
    diceContainer.innerHTML = '';
    
    // Create single row container for all dice
    const allDiceContainer = document.createElement('div');
    allDiceContainer.className = 'all-dice-container';
    
    // First, show banked dice from this turn (dimmed and non-interactive)
    if (gameState.bankedDiceThisTurn && gameState.bankedDiceThisTurn.length > 0) {
        gameState.bankedDiceThisTurn.forEach(value => {
            const dieElement = document.createElement('div');
            dieElement.className = 'dice banked';
            dieElement.textContent = value;
            // Banked dice are not clickable
            allDiceContainer.appendChild(dieElement);
        });
    }
    
    // Then, show current dice roll (interactive)
    if (gameState.diceValues.length > 0) {
        gameState.diceValues.forEach((value, index) => {
            const dieElement = document.createElement('div');
            
            // Určení CSS tříd pro kostku
            let classes = 'dice';
            if (gameState.selectedDice.includes(index)) classes += ' selected';
            
            // Zvýraznění bodujících kostek (pokud nejsou vybrané a hra je aktivní)
            if (!gameState.selectedDice.includes(index) && gameState.currentPlayer === 0) {
                const singleDieScore = calculateScore([value]);
                if (singleDieScore > 0) {
                    classes += ' scoring';
                }
            }
            
            dieElement.className = classes;
            dieElement.textContent = value;
            dieElement.addEventListener('click', () => {
                if (gameState.currentPlayer === 0 && gameState.mustBankDice) {
                    // Emit custom event to avoid circular dependency
                    const event = new CustomEvent('dieSelected', { detail: { index } });
                    document.dispatchEvent(event);
                }
            });
            allDiceContainer.appendChild(dieElement);
        });
    }
    
    diceContainer.appendChild(allDiceContainer);
    
    // Update current turn score
    const currentTurnScore = document.getElementById('currentTurnScore');
    if (currentTurnScore) {
        currentTurnScore.textContent = `Skóre tahu: ${gameState.currentTurnScore}`;
    }
    
    // Update button states
    const selectedValues = gameState.selectedDice.map(index => gameState.diceValues[index]);
    const canBank = gameState.selectedDice.length > 0 && calculateScore(selectedValues) > 0;
    const canEndTurn = gameState.currentTurnScore >= 300 && !gameState.mustBankDice; // Musí odložit kostky před ukončením
    const canRoll = gameState.availableDice > 0 && !gameState.mustBankDice && gameState.currentPlayer === 0;
    
    const bankBtn = document.getElementById('bankBtn');
    const rollBtn = document.getElementById('rollBtn');
    const endTurnBtn = document.getElementById('endTurnBtn');
    
    if (bankBtn) bankBtn.disabled = !canBank || gameState.currentPlayer !== 0;
    if (rollBtn) rollBtn.disabled = !canRoll;
    if (endTurnBtn) endTurnBtn.disabled = !canEndTurn || gameState.currentPlayer !== 0;
    
    // Update available dice display
    const availableDiceDisplay = document.getElementById('availableDice');
    if (availableDiceDisplay) {
        availableDiceDisplay.textContent = `Volné kostky: ${gameState.availableDice}`;
    }
    
    // Zobrazit varování, pokud musí hráč odložit kostky
    const humanStatus = document.getElementById('humanPlayerStatus');
    if (gameState.mustBankDice && gameState.currentPlayer === 0) {
        if (humanStatus) {
            humanStatus.textContent = '⚠️ Musíte odložit alespoň jednu bodující kombinaci!';
            humanStatus.style.color = 'var(--neon-orange)';
        }
    } else if (humanStatus && gameState.currentPlayer === 0) {
        // Reset status when no warning needed
        humanStatus.textContent = '';
    }
}

/**
 * Aktualizuje tabulku skóre
 */
export function updateScoreboard() {
    // Aktualizuj skóre všech hráčů
    const scoreElements = {
        0: document.getElementById('humanScore'),
        1: document.getElementById('geminiScore'), 
        2: document.getElementById('chatgptScore'),
        3: document.getElementById('claudeScore')
    };
    
    gameState.players.forEach((player, index) => {
        const scoreElement = scoreElements[index];
        if (scoreElement) {
            scoreElement.textContent = player.score;
        }
    });
    
    // Aktualizuj current turn score
    const currentTurnScore = document.getElementById('currentTurnScore');
    if (currentTurnScore) {
        currentTurnScore.textContent = `Skóre tahu: ${gameState.currentTurnScore}`;
    }
}

/**
 * Aktualizuje zobrazení aktivního hráče
 */
export function updateActivePlayer() {
    // Odstraň active třídu ze všech hráčů
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('active');
    });
    
    // Přidej active třídu k aktuálnímu hráči
    const playerClasses = ['human-player', 'gemini-player', 'chatgpt-player', 'claude-player'];
    const currentPlayerClass = playerClasses[gameState.currentPlayer];
    
    if (currentPlayerClass) {
        const currentPlayerElement = document.querySelector(`.${currentPlayerClass}`);
        if (currentPlayerElement) {
            currentPlayerElement.classList.add('active');
        }
    }
    
    // Aktualizuj turn info
    const turnInfo = document.getElementById('turnInfo');
    if (turnInfo) {
        const playerName = gameState.players[gameState.currentPlayer]?.name || 'Neznámý';
        turnInfo.textContent = `${playerName} na tahu!`;
    }
}
