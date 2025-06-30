/**
 * 🚀 Game Initializer - Modul pro inicializaci hry
 * 
 * Zodpovědnosti:
 * - Nastavení event listenerů pro herní prvky
 * - Vytvoření počátečních kostek
 * - Inicializace hlavního game controlleru
 * - Propojení UI s herní logikou
 * 
 * Tento modul zajišťuje čistou separaci inicializační logiky
 * od hlavního game controlleru pro lepší maintainability.
 * 
 * @author AI Assistant & pipap  
 * @version 1.0 - Modulární extrakce
 * @date 2025-07-01
 */

import { GAME_CONSTANTS } from '../../core/constants.js';

export class GameInitializer {
    constructor(gameController) {
        this.gameController = gameController;
    }

    /**
     * Inicializuje hlavní herní controller
     */
    initialize() {
        console.log('🎮 Inicializuji Main Game Controller...');
        
        this.setupEventListeners();
        this.createInitialDice();
        this.gameController.isInitialized = true;
        
        console.log('✅ Main Game Controller inicializován');
    }

    /**
     * Nastavuje event listenery pro herní prvky
     */
    setupEventListeners() {
        // Start game button
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.gameController.startGame());
        }

        // Roll dice button
        const rollBtn = document.getElementById('rollBtn');
        if (rollBtn) {
            rollBtn.addEventListener('click', () => this.gameController.rollDice());
        }

        // Bank score button
        const bankBtn = document.getElementById('bankBtn');
        if (bankBtn) {
            bankBtn.addEventListener('click', () => this.gameController.bankSelectedDice());
        }

        // End turn button
        const endTurnBtn = document.getElementById('endTurnBtn');
        if (endTurnBtn) {
            endTurnBtn.addEventListener('click', () => this.gameController.endTurn());
        }

        // Quit game button
        const quitBtn = document.getElementById('quitGameBtn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => this.gameController.quitGame());
        }

        // Hall of Fame button
        const hallBtn = document.querySelector('[onclick="displayHallOfFame()"]');
        if (hallBtn) {
            hallBtn.addEventListener('click', () => this.gameController.showHallOfFame());
        }
    }

    /**
     * Vytvoří počáteční kostky
     */
    createInitialDice() {
        const container = document.getElementById('diceContainer');
        if (!container) return;

        container.innerHTML = '';
        this.gameController.currentDice = [];
        
        for (let i = 0; i < GAME_CONSTANTS.DICE_COUNT; i++) {
            const dice = this.gameController.diceController.createDiceElement(i, 1);
            container.appendChild(dice);
            this.gameController.currentDice.push({ id: i, value: 1, selected: false, banked: false });
        }
    }
}
