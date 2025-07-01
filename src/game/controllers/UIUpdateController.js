/**
 * UI Update Controller
 * Spravuje aktualizace uživatelského rozhraní
 */

export class UIUpdateController {
    constructor(gameController) {
        this.gameController = gameController;
    }

    /**
     * Aktualizuje zobrazení cílového skóre
     */
    updateTargetScoreDisplay() {
        const targetScoreDisplay = document.getElementById('targetScoreDisplay');
        if (targetScoreDisplay) {
            targetScoreDisplay.textContent = this.gameController.targetScore || 10000;
        }
    }

    /**
     * Aktualizuje informace o tahu
     */
    updateTurnInfo() {
        const turnInfoElement = document.getElementById('turnInfo');
        if (turnInfoElement) {
            const currentPlayer = this.gameController.getCurrentPlayer();
            const playerName = currentPlayer ? currentPlayer.name : 'Hráč';
            turnInfoElement.textContent = `Tah: ${playerName} | Celkem tahů: ${this.gameController.totalTurns}`;
        }
    }

    /**
     * Aktualizuje stav tlačítek
     */
    updateButtons() {
        const rollBtn = document.getElementById('rollBtn');
        const bankBtn = document.getElementById('bankBtn');
        const endTurnBtn = document.getElementById('endTurnBtn');

        const selectedDice = this.gameController.currentDice.filter(d => d.selected);
        const availableDice = this.gameController.currentDice.filter(d => !d.banked);
        const hasValidSelection = selectedDice.length > 0 && 
            this.gameController.scoreController.calculateDiceScore(selectedDice.map(d => d.value)) > 0;

        if (rollBtn) {
            rollBtn.disabled = !this.gameController.gameStarted || availableDice.length === 0;
        }

        if (bankBtn) {
            // Tlačítko ODLOŽIT je dostupné pouze po hození a s platným výběrem
            bankBtn.disabled = !this.gameController.hasRolledThisTurn || !hasValidSelection;
        }

        if (endTurnBtn) {
            // Farkle pravidlo: Minimum 300 bodů pro ukončení tahu
            // Hráč může ukončit tah po jakémkoliv platném bodování >= 300 bodů
            const canEndTurn = this.gameController.gameStarted && this.gameController.turnScore >= 300;
            endTurnBtn.disabled = !canEndTurn;
        }
    }

    /**
     * Zobrazí zprávu "Hoďte kostkami!"
     */
    showRollFirstMessage() {
        let messageElement = document.getElementById('rollFirstMessage');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'rollFirstMessage';
            messageElement.className = 'roll-first-message';
            messageElement.textContent = 'Hoďte kostkami!';
            
            const diceContainer = document.getElementById('diceContainer');
            if (diceContainer && diceContainer.parentNode) {
                diceContainer.parentNode.insertBefore(messageElement, diceContainer.nextSibling);
            }
        }
        
        messageElement.classList.add('show');
        
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 2000);
    }

    /**
     * Odstraní zprávu "Hoďte kostkami!"
     */
    removeRollFirstMessage() {
        const messageElement = document.getElementById('rollFirstMessage');
        if (messageElement) {
            messageElement.classList.remove('show');
        }
    }

    /**
     * Zobrazí modální okno
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }

    /**
     * Skryje modální okno
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    }

    /**
     * Zobrazí výsledky hry
     */
    showGameResults(winner, gameData) {
        const modal = document.getElementById('gameResultModal');
        if (!modal) return;

        const winnerName = document.getElementById('winnerName');
        const gameTime = document.getElementById('gameTime');
        const totalTurns = document.getElementById('totalTurns');
        const finalScore = document.getElementById('finalScore');

        if (winnerName) winnerName.textContent = winner.name;
        if (gameTime) gameTime.textContent = gameData.duration;
        if (totalTurns) totalTurns.textContent = gameData.turns;
        if (finalScore) finalScore.textContent = winner.score;

        this.showModal('gameResultModal');
    }
}
