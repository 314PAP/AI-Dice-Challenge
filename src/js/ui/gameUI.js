/**
 * SEZNAM POUŽÍVANÝCH CSS TŘÍD:
 * Bootstrap: container-fluid, row, col-12, col-6, d-flex, flex-column, justify-content-center, align-items-center, h-100, text-center, mb-2, mb-3, btn, btn-sm, opacity
 * Neon třídy: text-neon-green, text-neon-blue, text-neon-purple, text-neon-orange, text-neon-red, text-neon-yellow, border-neon-*, bg-neon-black
 * Vlastní: btn-neon, dice-selected, player-avatar
 */

/**
 * SEZNAM PROMĚNNÝCH (lokální v metodách):
 * now, callbacks, gameContainer, currentPlayer, state, selectedDice, dieValue, warningMsg, countOfValue, container, title, scoreSelector,
 * minusBtn, scoreValue, plusBtn, buttonsContainer, startBtn, rulesBtn, hallOfFameBtn, exitGameBtn, col1, col2, col3, col4,
 * currentScore, newScore, scoreValueEl, backdrop, modal, yesBtn
 * 
 * MOŽNÉ DUPLICITY: 
 * - currentPlayer (používá se v renderGame a showMenuWithConfirmation)
 * - container (používá se v renderMenu a showConfirmationModal)
 * - state (používá se v renderGame a toggleDiceSelection)
 */

/**
 * Game UI - Hlavní UI kontroler (REFAKTOROVANÝ)
 * 
 * OBSAH MODULU (po refaktoringu):
 * - Orchestrace UI komponent
 * - Routing mezi obrazovkami
 * - Event handling pro uživatelské akce
 * - Integrace s ostatními moduly
 * - Menu a ostatní obrazovky
 * 
 * PŘESUNUTO DO JINÝCH MODULŮ:
 * - Herní logika → game/gameLogic.js
 * - AI logika → ai/aiPlayerController.js
 * - Vykreslování herní obrazovky → ui/gameRenderer.js
 */

import gameState from '../game/gameState.js';
import { GameLogic } from '../game/gameLogic.js';
import { GameRenderer } from './gameRenderer.js';
import { AiPlayerController } from '../ai/aiPlayerController.js';
import chatSystem from '../ai/chatSystem.js';
import { createNeonButton, createNeonCard } from './uiComponents.js';
import { MenuComponents } from './menuComponents.js';
import { GameScreens } from './gameScreens.js';

export class GameUI {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.aiTurnInProgress = false;
        this.lastPlayerIndex = undefined;
        this.lastRenderTime = 0;
        
        // Inicializace modulů
        this.gameRenderer = new GameRenderer();
        this.gameLogic = new GameLogic(this.gameRenderer);
        this.aiController = new AiPlayerController(this.gameLogic);
        this.menuComponents = new MenuComponents();
        this.gameScreens = new GameScreens();
        
        // Ověříme DOM
        if (!this.gameArea) {
            console.warn('⚠️ GameUI: Element #gameArea nenalezen');
            document.addEventListener('DOMContentLoaded', () => this.initWhenReady());
            return;
        }
        
        this.initEventListeners();
    }

    initWhenReady() {
        this.gameArea = document.getElementById('gameArea');
        if (this.gameArea) {
            console.log('✅ GameUI: Element nalezen po DOMContentLoaded');
            this.initEventListeners();
        }
    }

    /**
     * Inicializuje event listenery pro UI
     */
    initEventListeners() {
        // Listener pro změny herního stavu
        gameState.addListener(this.renderUI.bind(this));
    }

    /**
     * Hlavní render funkce - rozhoduje, co se má zobrazit
     * @param {Object} state - Aktuální herní stav
     */
    renderUI(state) {
        if (!this.gameArea) {
            console.warn('⚠️ GameUI.renderUI: gameArea element není dostupný');
            return;
        }

        // Omezení renderování během animace (max každých 500ms)
        const now = Date.now();
        if (state.isRolling && (now - this.lastRenderTime) < 500) {
            console.log('🎮 GameUI: Přeskakuji render během animace');
            return; // Přeskočíme render během rychlé animace
        }
        this.lastRenderTime = now;

        console.log(`🎮 GameUI: Renderuji fázi "${state.gamePhase}" pro hráče ${state.currentPlayerIndex}`);

        // Kontrola změny hráče - reset AI flagu
        if (this.lastPlayerIndex !== undefined && this.lastPlayerIndex !== state.currentPlayerIndex) {
            console.log(`🔄 GameUI: Hráč se změnil z ${this.lastPlayerIndex} na ${state.currentPlayerIndex}, resetuji AI flag`);
            this.aiTurnInProgress = false;
        }
        this.lastPlayerIndex = state.currentPlayerIndex;
        
        // Vyčistíme herní plochu
        this.gameArea.innerHTML = '';
        
        // Zobrazíme správný obsah podle fáze hry
        switch (state.gamePhase) {
            case 'menu':
                this.renderMainMenu();
                break;
            case 'game':
                this.renderGameScreen(state);
                break;
            case 'gameover':
                this.renderGameOver(state);
                break;
            case 'rules':
                this.renderRules();
                break;
            case 'halloffame':
                this.renderHallOfFame();
                break;
            default:
                this.renderMainMenu();
        }
    }

    /**
     * Vykreslí herní obrazovku pomocí GameRenderer
     * @param {Object} state - Aktuální herní stav
     */
    renderGameScreen(state) {
        console.log('🎮 GameUI: Deleguji vykreslení na GameRenderer');
        
        // Připravíme callbacks pro GameRenderer
        const callbacks = {
            toggleDiceSelection: (index) => this.toggleDiceSelection(index),
            rollDice: () => this.gameLogic.rollDice(),
            saveDice: () => this.gameLogic.saveDice(),
            endTurn: () => this.gameLogic.endTurn(),
            showMenuWithConfirmation: () => this.showMenuWithConfirmation()
        };
        
        // Delegujeme vykreslení na GameRenderer
        const gameContainer = this.gameRenderer.renderGameScreen(state, callbacks);
        
        if (gameContainer && this.gameArea) {
            // JEDNODUCHÉ ŘEŠENÍ: Vždy aktualizuj DOM, throttling jen pro render logiku
            console.log('🎮 GameUI: Aktualizuji DOM');
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(gameContainer);
            
            // Pokud je na tahu AI hráč, spustíme jeho automatický tah (pouze jednou)
            const currentPlayer = state.players[state.currentPlayerIndex];
            if (currentPlayer && !currentPlayer.isHuman && !state.isRolling && !this.aiTurnInProgress && 
                !state.isFarkleProcessing && (state.currentRoll.length === 0 || state.currentRoll.length === 6)) {
                // Spustíme AI pouze na začátku tahu (prázdné kostky) nebo na začátku nového hodu (6 kostek)
                console.log(`🤖 GameUI: Spouštím AI pro ${currentPlayer.name}`);
                this.aiTurnInProgress = true;
                setTimeout(() => {
                    this.aiController.playAiTurn(currentPlayer).finally(() => {
                        this.aiTurnInProgress = false; // Reset flagu po dokončení
                    });
                }, 1500);
            }
        }
    }

    /**
     * Přepíná výběr kostky
     * @param {number} index - Index kostky
     */
    toggleDiceSelection(index) {
        console.log('🎯 GameUI: toggleDiceSelection volán s indexem:', index);
        const state = gameState.getState();
        let selectedDice = [...(state.selectedDice || [])];
        
        if (selectedDice.includes(index)) {
            // Odznačování - vždy povoleno
            selectedDice = selectedDice.filter(i => i !== index);
            console.log('➖ Odebírám index', index);
        } else {
            // Označování - kontrolujeme platnost kostky
            const dieValue = state.currentRoll[index];
            
            if (this.isValidDiceForSelection(dieValue, state.currentRoll)) {
                selectedDice.push(index);
                console.log('➕ Přidávám kostku', dieValue, 'index', index);
            } else {
                const warningMsg = `⚠️ Kostka ${dieValue} nemůže být označena! Potřebujete alespoň 3 stejné kostky.`;
                console.warn(warningMsg);
                return;
            }
        }
        
        gameState.updateState({ selectedDice });
    }

    /**
     * Kontroluje, zda lze kostku vybrat
     * @param {number} dieValue - Hodnota kostky
     * @param {Array} currentRoll - Aktuální hod
     * @returns {boolean} Zda lze kostku vybrat
     */
    isValidDiceForSelection(dieValue, currentRoll) {
        // Jedničky a pětky lze vždy vybrat
        if (dieValue === 1 || dieValue === 5) {
            return true;
        }
        
        // Pro ostatní hodnoty musí být alespoň 3 stejné
        const countOfValue = currentRoll.filter(die => die === dieValue).length;
        return countOfValue >= 3;
    }

    // =============================================================================
    // MENU A OSTATNÍ OBRAZOVKY (TODO: přesunout do MenuRenderer)
    // =============================================================================

    /**
     * Vykreslí hlavní menu - optimalizované pro všechny režimy zobrazení
     */
    renderMainMenu() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column justify-content-center align-items-center h-100 py-2 py-sm-3 py-md-5';
        
        // Nadpis - responzivní mezery
        const title = document.createElement('h1');
        title.className = 'text-neon-green fs-4 mb-2 mb-sm-2 mb-md-3 text-center';
        title.innerHTML = '<i class="bi bi-star-fill"></i> Cílové skóre';
        container.appendChild(title);
        
        // Selector pro cílové skóre - responzivní spacing
        const scoreSelector = document.createElement('div');
        scoreSelector.className = 'mb-2 mb-sm-3 mb-md-4 d-flex align-items-center justify-content-center';
        
        // Tlačítka - přesná velikost pro text fs-4
        const minusBtn = createNeonButton('-', 'blue', null, () => this.adjustTargetScore(-1000), 'btn px-3 py-2 fs-4 lh-1');
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'px-3 text-neon-yellow fs-4 lh-1 d-flex align-items-center';
        scoreValue.textContent = gameState.getState().targetScore;
        scoreValue.id = 'targetScoreValue';
        
        const plusBtn = createNeonButton('+', 'blue', null, () => this.adjustTargetScore(1000), 'btn px-3 py-2 fs-4 lh-1');
        
        scoreSelector.appendChild(minusBtn);
        scoreSelector.appendChild(scoreValue);
        scoreSelector.appendChild(plusBtn);
        
        container.appendChild(scoreSelector);
        
        // Tlačítka akcí - mezery pro hover animace
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'row g-2';
        
        const startBtn = createNeonButton(
            'ZAČÍT HRU', 
            'green', 
            'bi-play-fill', 
            () => this.startGame(), 
            'btn w-100'
        );
        
        const rulesBtn = createNeonButton(
            'PRAVIDLA', 
            'blue', 
            'bi-book-fill', 
            () => this.showRules(), 
            'btn w-100'
        );
        
        const hallOfFameBtn = createNeonButton(
            'SÍŇ SLÁVY', 
            'orange', 
            'bi-trophy-fill', 
            () => this.showHallOfFame(), 
            'btn w-100'
        );
        
        const exitGameBtn = createNeonButton(
            'UKONČIT', // Zkráceno pro lepší fit na mobilu 
            'red', 
            'bi-power', 
            () => window.close(), 
            'btn w-100'
        );
        
        const col1 = document.createElement('div');
        col1.className = 'col-12 col-sm-6 mb-2 px-2';
        col1.appendChild(startBtn);
        
        const col2 = document.createElement('div');
        col2.className = 'col-12 col-sm-6 mb-2 px-2';
        col2.appendChild(rulesBtn);
        
        const col3 = document.createElement('div');
        col3.className = 'col-12 col-sm-6 mb-2 px-2';
        col3.appendChild(hallOfFameBtn);
        
        const col4 = document.createElement('div');
        col4.className = 'col-12 col-sm-6 mb-2 px-2';
        col4.appendChild(exitGameBtn);
        
        buttonsContainer.appendChild(col1);
        buttonsContainer.appendChild(col2);
        buttonsContainer.appendChild(col3);
        buttonsContainer.appendChild(col4);
        
        container.appendChild(buttonsContainer);
        
        // Vyčistíme a přidáme nový obsah
        if (this.gameArea) {
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(container);
        } else {
            console.warn('⚠️ GameUI.renderMainMenu: gameArea není dostupný');
        }
    }

    /**
     * Upraví cílové skóre
     * @param {number} change - O kolik změnit skóre
     */
    adjustTargetScore(change) {
        const currentScore = gameState.getState().targetScore;
        const newScore = Math.max(1000, Math.min(50000, currentScore + change));
        
        gameState.updateState({ targetScore: newScore });
        
        // Aktualizujeme zobrazení
        const scoreValueEl = document.getElementById('targetScoreValue');
        if (scoreValueEl) {
            scoreValueEl.textContent = newScore;
        }
    }

    /**
     * Spustí hru
     */
    startGame() {
        console.log('Startuje hra...');
        
        // Vyčistíme chat při novém startu hry
        chatSystem.clearMessages();
        
        // Reset AI flag při novém startu
        this.aiTurnInProgress = false;
        
        gameState.updateState({ 
            gameStarted: true,
            gamePhase: 'game',
            currentPlayerIndex: 0,
            currentRoll: [],
            selectedDice: [],
            turnScore: 0,
            players: gameState.getState().players.map(p => ({ ...p, score: 0 }))
        });
        console.log('Nový herní stav:', gameState.getState());
        
        // Pokud začíná AI hráč, spustíme jeho tah
        const currentPlayer = gameState.getState().players[0];
        if (!currentPlayer.isHuman) {
            setTimeout(() => {
                this.aiController.playAiTurn(currentPlayer);
            }, 2000); // Krátká pauza po startu hry
        }
    }

    /**
     * Zobrazí pravidla - deleguje na GameScreens
     */
    showRules() {
        this.gameScreens.showRules();
    }

    /**
     * Zobrazí síň slávy - deleguje na GameScreens
     */
    showHallOfFame() {
        this.gameScreens.renderHallOfFame(this.gameArea);
    }
}

// Exportujeme třídu GameUI
export default GameUI;
// Force refresh Pá 11. července 2025, 18:21:25 CEST
