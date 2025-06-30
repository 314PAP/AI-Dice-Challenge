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
    const diceContainer = document.getElementById('diceContainer');
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
