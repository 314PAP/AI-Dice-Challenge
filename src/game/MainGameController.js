/**
 * 🎮 Main Game Controller - Modular Architecture v2.0
 * 
 * Refaktorovaný hlavní herní controller používající modulární komponenty.
 * 
 * Architektura:
 * - GameInitializer    → Inicializace a event listenery
 * - DiceController     → Logika kostek a hodů
 * - ScoreController    → Výpočty skóre a bodování  
 * - TurnController     → Řízení tahů a Hot Dice
 * - UIUpdateController → Aktualizace UI
 * - GameStateController→ Správa stavu hry (start/end/quit)
 * 
 * Každý modul má jasnou zodpovědnost a max 120 řádků kódu.
 * Controller slouží jako orchestrátor mezi moduly.
 * 
 * @author AI Assistant & pipap
 * @version 2.0 - Modulární refactor
 * @date 2025-07-01
 */

import { GameInitializer } from './controllers/GameInitializer.js';
import { DiceController } from './controllers/DiceController.js';
import { ScoreController } from './controllers/ScoreController.js';
import { TurnController } from './controllers/TurnController.js';
import { UIUpdateController } from './controllers/UIUpdateController.js';
import { GameStateController } from './controllers/GameStateController.js';

export class MainGameController {
    constructor() {
        this.isInitialized = false;
        this.currentDice = [];
        this.selectedDice = [];
        this.turnScore = 0;
        this.rollCount = 0;
        this.gameStarted = false;
        this.gameStartTime = null;
        this.totalTurns = 0;
        this.hasRolledThisTurn = false;
        this.targetScore = 10000;

        // Inicializuj moduly
        this.initializer = new GameInitializer(this);
        this.diceController = new DiceController(this);
        this.scoreController = new ScoreController(this);
        this.turnController = new TurnController(this);
        this.uiController = new UIUpdateController(this);
        this.stateController = new GameStateController(this);
    }

    /**
     * Inicializuje hlavní herní controller
     */
    initialize() {
        return this.initializer.initialize();
    }

    /**
     * Spustí novou hru
     */
    startGame() {
        return this.stateController.startGame();
    }

    /**
     * Hodí kostkami
     */
    rollDice() {
        return this.diceController.rollDice();
    }

    /**
     * Odloží vybrané kostky
     */
    bankSelectedDice() {
        return this.turnController.bankSelectedDice();
    }

    /**
     * Ukončí tah
     */
    endTurn() {
        return this.turnController.endTurn();
    }

    /**
     * Ukončí hru předčasně
     */
    quitGame() {
        return this.stateController.quitGame();
    }

    /**
     * Získá aktuálního hráče
     */
    getCurrentPlayer() {
        return this.stateController.getCurrentPlayer();
    }

    /**
     * Zpracuje Farkle
     */
    handleFarkle() {
        return this.turnController.handleFarkle();
    }

    /**
     * Ukončí hru s vítězem
     */
    endGame(winner) {
        return this.stateController.endGame(winner);
    }

    /**
     * Zobrazí Hall of Fame
     */
    showHallOfFame() {
        this.uiController.showModal('hallOfFameModal');
        // TODO: Načíst a zobrazit data z Hall of Fame
    }

    /**
     * Přidá zprávu do chatu
     */
    addChatMessage(sender, message) {
        // TODO: Implementovat nebo připojit k chat systému
        console.log(`${sender}: ${message}`);
        
        // Pokud existuje globální chat funkce, použij ji
        if (window.addChatMessage) {
            window.addChatMessage(sender, message);
        }
    }
}
