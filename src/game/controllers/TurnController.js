/**
 * Turn Controller
 * Spravuje řízení tahů a herní logiku
 */

import { gameState } from '../../js/game/gameState.js';
import { MESSAGES, CSS_CLASSES } from '../../core/constants.js';

export class TurnController {
    constructor(gameController) {
        this.gameController = gameController;
    }

    /**
     * Odloží vybrané kostky
     */
    bankSelectedDice() {
        const selectedDice = this.gameController.currentDice.filter(d => d.selected);
        if (selectedDice.length === 0) return;

        const score = this.gameController.scoreController.calculateDiceScore(selectedDice.map(d => d.value));
        if (score === 0) {
            this.gameController.addChatMessage('Systém', '❌ Vybrané kostky nemají žádnou hodnotu!');
            return;
        }

        // Odlož kostky
        selectedDice.forEach(dice => {
            dice.banked = true;
            dice.selected = false;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.SELECTED);
                element.classList.add(CSS_CLASSES.DICE.BANKED);
            }
        });

        this.gameController.turnScore += score;
        this.gameController.scoreController.updateTurnScore();
        
        // Zkontroluj Hot Dice
        const allBanked = this.gameController.currentDice.every(d => d.banked);
        if (allBanked) {
            this.triggerHotDice();
        }

        this.gameController.uiController.updateButtons();
        this.gameController.addChatMessage('Systém', `💰 Odloženo ${score} bodů! Celkem v tahu: ${this.gameController.turnScore}`);
    }

    /**
     * Hot Dice - všechny kostky odloženy
     */
    triggerHotDice() {
        this.gameController.addChatMessage('Systém', MESSAGES.HOT_DICE);
        
        // Resetuj kostky pro další hod
        this.gameController.currentDice.forEach(dice => {
            dice.banked = false;
            dice.selected = false;
            dice.value = 1;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.BANKED, CSS_CLASSES.DICE.SELECTED);
                element.dataset.value = 1;
                element.textContent = 1;
            }
        });
    }

    /**
     * Ukončí tah
     */
    endTurn() {
        console.log('🔄 Ukončujem tah...');
        
        // Přidej skóre k celkovému skóre hráče
        if (this.gameController.turnScore > 0) {
            gameState.currentPlayerIndex = gameState.currentPlayerIndex || 0;
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            if (currentPlayer) {
                currentPlayer.score += this.gameController.turnScore;
                this.gameController.addChatMessage('Systém', 
                    `✅ ${currentPlayer.name} získává ${this.gameController.turnScore} bodů! Celkem: ${currentPlayer.score}`);
            }
        }

        // Zkontroluj výherce
        const winner = this.gameController.scoreController.checkWinner();
        if (winner) {
            this.gameController.endGame(winner);
            return;
        }

        // Přejdi na dalšího hráče
        this.nextPlayer();
        this.resetTurn();
        
        this.gameController.totalTurns++;
        this.gameController.uiController.updateTurnInfo();
    }

    /**
     * Přejde na dalšího hráče
     */
    nextPlayer() {
        if (gameState.players && gameState.players.length > 0) {
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            console.log(`🔄 Na řadě je hráč: ${gameState.players[gameState.currentPlayerIndex].name}`);
        }
    }

    /**
     * Resetuje tah
     */
    resetTurn() {
        this.gameController.turnScore = 0;
        this.gameController.rollCount = 0;
        this.gameController.hasRolledThisTurn = false;
        this.gameController.selectedDice = [];
        
        // Resetuj kostky
        this.gameController.currentDice.forEach(dice => {
            dice.selected = false;
            dice.banked = false;
            dice.value = 1;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.SELECTED, CSS_CLASSES.DICE.BANKED);
                element.classList.add('dice-inactive'); // Přidej neaktivní stav
                element.dataset.value = 1;
                element.textContent = 1;
            }
        });
        
        // Aktualizuj UI
        this.gameController.scoreController.updateTurnScore();
        this.gameController.uiController.updateButtons();
        
        console.log('✅ Tah resetován');
    }

    /**
     * Zpracuje Farkle (žádné bodující kostky)
     */
    handleFarkle() {
        console.log('💥 FARKLE!');
        this.gameController.addChatMessage('Systém', MESSAGES.FARKLE);
        
        // Ztráta všech bodů v tahu
        this.gameController.turnScore = 0;
        
        setTimeout(() => {
            this.endTurn();
        }, 2000);
    }
}
