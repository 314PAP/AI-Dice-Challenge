/**
 * 🎲 Dice Controller - Modul pro správu kostek
 * 
 * Hlavní zodpovědnosti:
 * - Logika hození kostek s animacemi
 * - Výběr a označování kostek (selected/banked/inactive)
 * - Validace výběru před prvním hodem
 * - Vizuální aktualizace stavů kostek
 * - Kontrola scoring kombinací
 * 
 * Obsahuje kompletní logiku pro interakci s kostkami
 * včetně prevence výběru před hodem a správy stavů.
 * 
 * @author AI Assistant & pipap
 * @version 1.0 - Modulární extrakce  
 * @date 2025-07-01
 */

import { CSS_CLASSES, GAME_CONSTANTS } from '../../core/constants.js';

export class DiceController {
    constructor(gameController) {
        this.gameController = gameController;
    }

    /**
     * Vytvoří element kostky
     */
    createDiceElement(id, value) {
        const dice = document.createElement('div');
        dice.className = CSS_CLASSES.DICE.BASE;
        dice.dataset.id = id;
        dice.dataset.value = value;
        dice.textContent = value;
        
        // Přidej třídu pro neaktivní kostky na začátku tahu
        if (!this.gameController.hasRolledThisTurn) {
            dice.classList.add('dice-inactive');
        }
        
        dice.addEventListener('click', () => this.selectDice(id));
        
        return dice;
    }

    /**
     * Hodí kostkami
     */
    rollDice() {
        if (!this.gameController.gameStarted) {
            console.warn('Hra není spuštěna');
            return;
        }

        console.log('🎲 Házím kostkami...');
        
        // Odstraň hlášku "Hoďte kostkami"
        this.gameController.uiController.removeRollFirstMessage();
        
        // Animace a hození
        const availableDice = this.gameController.currentDice.filter(d => !d.selected && !d.banked);
        
        if (availableDice.length === 0) {
            console.warn('Žádné dostupné kostky pro hození');
            return;
        }

        // Vymaž výběr
        this.clearSelection();
        
        // Hoď kostkami
        availableDice.forEach(dice => {
            const newValue = Math.floor(Math.random() * 6) + 1;
            dice.value = newValue;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.dataset.value = newValue;
                element.textContent = newValue;
                element.classList.add('rolling');
                
                setTimeout(() => {
                    element.classList.remove('rolling');
                }, 500);
            }
        });

        this.gameController.rollCount++;
        this.gameController.hasRolledThisTurn = true;
        
        // Aktualizuj vizuální stav kostek
        this.updateDiceVisualState();
        
        // Zkontroluj scoring
        setTimeout(() => {
            this.checkForScoring();
            this.gameController.uiController.updateButtons();
        }, 600);
        
        this.gameController.addChatMessage('Systém', `🎲 Hod číslo ${this.gameController.rollCount}`);
    }

    /**
     * Vybere/zruší výběr kostky
     */
    selectDice(diceId) {
        // Nelze vybírat kostky před prvním hodem
        if (!this.gameController.hasRolledThisTurn) {
            this.gameController.uiController.showRollFirstMessage();
            return;
        }

        const dice = this.gameController.currentDice.find(d => d.id === diceId);
        if (!dice || dice.banked) return;

        dice.selected = !dice.selected;
        
        const element = document.querySelector(`[data-id="${diceId}"]`);
        if (element) {
            element.classList.toggle(CSS_CLASSES.DICE.SELECTED, dice.selected);
        }

        this.gameController.uiController.updateButtons();
        this.gameController.scoreController.calculateSelectedScore();
    }

    /**
     * Vymaže výběr kostek
     */
    clearSelection() {
        this.gameController.currentDice.forEach(dice => {
            dice.selected = false;
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.SELECTED);
            }
        });
        this.gameController.selectedDice = [];
    }

    /**
     * Aktualizuje vizuální stav kostek
     */
    updateDiceVisualState() {
        this.gameController.currentDice.forEach(dice => {
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                // Odstraň třídu neaktivní kostky po hození
                element.classList.remove('dice-inactive');
                
                // Aktualizuj ostatní třídy
                element.classList.toggle(CSS_CLASSES.DICE.SELECTED, dice.selected);
                element.classList.toggle(CSS_CLASSES.DICE.BANKED, dice.banked);
            }
        });
    }

    /**
     * Zkontroluje, zda kostky mají skóre
     */
    checkForScoring() {
        const availableDice = this.gameController.currentDice.filter(d => !d.banked);
        const values = availableDice.map(d => d.value);
        const score = this.gameController.scoreController.calculateDiceScore(values);
        
        if (score === 0) {
            this.gameController.handleFarkle();
        }
    }
}
