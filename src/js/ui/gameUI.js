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

export class GameUI {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.aiTurnInProgress = false; // Flag pro kontrolu AI tahu
        this.lastPlayerIndex = undefined; // Pro sledování změny hráče
        this.lastRenderTime = 0; // Pro omezení renderování
        
        // Inicializace modulů
        this.gameRenderer = new GameRenderer();
        this.gameLogic = new GameLogic(this.gameRenderer);
        this.aiController = new AiPlayerController(this.gameLogic);
        
        // Ověříme, že gameArea existuje
        if (!this.gameArea) {
            console.warn('⚠️ GameUI: Element #gameArea nenalezen. GameUI bude čekat na DOM.');
            document.addEventListener('DOMContentLoaded', () => {
                this.gameArea = document.getElementById('gameArea');
                if (this.gameArea) {
                    console.log('✅ GameUI: Element #gameArea nalezen po DOMContentLoaded');
                    this.initEventListeners();
                }
            });
            return;
        }
        
        this.initEventListeners();
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
            'UKONČIT HRU', 
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
     * Zobrazí pravidla
     */
    showRules() {
        gameState.updateState({ gamePhase: 'rules' });
    }

    /**
     * Zobrazí síň slávy
     */
    showHallOfFame() {
        gameState.updateState({ gamePhase: 'halloffame' });
    }

    // =============================================================================
    // DELEGOVANÉ HERNÍ FUNKCE (nyní pouze proxies k GameLogic)
    // =============================================================================

    
    /**
     * Zobrazí menu s potvrzovacím dialogem
     */
    showMenuWithConfirmation() {
        this.showStyledConfirmation(
            'Opravdu chcete odejít do menu?',
            'Rozehraná hra bude ztracena.',
            () => this.showMenu()
        );
    }

    /**
     * Zobrazí stylovaný potvrzovací dialog
     */
    showStyledConfirmation(title, message, onConfirm) {
        // Vytvoříme backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 1050;
            backdrop-filter: blur(5px);
        `;

        // Vytvoříme modální dialog
        const modal = document.createElement('div');
        modal.className = 'modal d-flex align-items-center justify-content-center';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1055;
            display: flex !important;
        `;

        modal.innerHTML = `
            <div class="modal-dialog modal-sm">
                <div class="modal-content bg-black border-3 border-neon-red shadow-lg">
                    <div class="modal-header border-bottom border-neon-red">
                        <h5 class="modal-title text-neon-red fw-bold">${title}</h5>
                    </div>
                    <div class="modal-body text-center">
                        <p class="text-neon-yellow mb-3">${message}</p>
                        <div class="d-flex gap-2 justify-content-center">
                            <button type="button" class="btn btn-neon btn-sm" data-neon-color="green" id="confirm-yes">
                                <i class="bi bi-check-lg me-1"></i>Ano
                            </button>
                            <button type="button" class="btn btn-neon btn-sm" data-neon-color="red" id="confirm-no">
                                <i class="bi bi-x-lg me-1"></i>Ne
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Přidáme do DOM
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        // Event listenery
        const yesBtn = modal.querySelector('#confirm-yes');
        const noBtn = modal.querySelector('#confirm-no');

        const closeModal = () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        };

        yesBtn.addEventListener('click', () => {
            closeModal();
            onConfirm();
        });

        noBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * Zobrazí herní menu
     */
    showMenu() {
        // Vyčistíme chat při návratu do menu
        chatSystem.clearMessages();
        
        // Reset AI flag při návratu do menu
        this.aiTurnInProgress = false;
        
        gameState.updateState({ gamePhase: 'menu' });
    }

    /**
     * Vykreslí obrazovku konce hry - optimalizovaná pro všechny režimy zobrazení
     * @param {Object} state - Aktuální herní stav
     */
    renderGameOver(state) {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column justify-content-center align-items-center h-100';
        
        // Nadpis - menší na landscape/malých zařízeních
        const title = document.createElement('h1');
        title.className = 'text-neon-green fs-fluid-1 mb-2 mb-md-3 text-center';
        title.innerHTML = '<i class="bi bi-trophy-fill"></i> Konec hry';
        container.appendChild(title);
        
        // Najdeme vítěze
        const winner = state.players.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current);
        
        // Informace o vítězi - kompaktnější pro malé displeje s obrázkem
        const winnerInfo = document.createElement('div');
        winnerInfo.className = 'text-center mb-3 mb-md-4';
        winnerInfo.innerHTML = `
            <h2 class="fs-fluid-2 text-neon-${winner.color} mb-2">
                <img src="ai-icons/${winner.avatar}" alt="${winner.name}" class="rounded-circle me-1 me-sm-2">
                ${winner.name}
            </h2>
            <div class="fs-fluid-3 text-neon-yellow mb-1 mb-sm-2">Vítězné skóre</div>
            <div class="fs-fluid-1 text-neon-green">${winner.score}</div>
        `;
        container.appendChild(winnerInfo);
        
        // Tlačítka akcí - responzivní layout pro všechny režimy
        const btnGroup = document.createElement('div');
        btnGroup.className = 'd-flex flex-column flex-sm-row justify-content-center gap-2 w-100 px-3';
        
        // V landscape režimu zobrazit tlačítka vedle sebe pro úsporu místa
        const newGameBtn = createNeonButton(
            'NOVÁ HRA', 
            'green', 
            'bi-play-fill', 
            () => this.startGame(), 
            'btn-custom-sm btn-md-lg flex-grow-1'
        );
        
        const menuBtn = createNeonButton(
            'HLAVNÍ MENU', 
            'blue', 
            'bi-house-fill', 
            () => gameState.updateState({ gamePhase: 'menu' }), 
            'btn-custom-sm btn-md-lg flex-grow-1'
        );
        
        btnGroup.appendChild(newGameBtn);
        btnGroup.appendChild(menuBtn);
        
        container.appendChild(btnGroup);
        
        // Vyčistíme a přidáme nový obsah
        if (this.gameArea) {
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(container);
        } else {
            console.warn('⚠️ GameUI.renderGameOver: gameArea není dostupný');
        }
    }

    /**
     * Vykreslí pravidla - optimalizovaná pro všechny režimy zobrazení
     */
    renderRules() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100 p-2 p-md-3';
        
        // Nadpis - Bootstrap responsive typography
        const title = document.createElement('h1');
        title.className = 'text-neon-blue h2 h-md-1 mb-3 mb-md-4 text-center';
        title.innerHTML = '<i class="bi bi-book-fill me-2"></i>Pravidla hry';
        container.appendChild(title);
        
        // Pravidla - Bootstrap responsive container s overflow
        const rulesContainer = document.createElement('div');
        rulesContainer.className = 'flex-grow-1 overflow-auto px-0 px-md-2';
        
        // Vytvoření pravidel v responsivní kartě - Bootstrap-first approach
        const rulesCard = createNeonCard('Pravidla kostkovky', 'blue', `
            <div class="mb-3 mb-lg-4">
                <h4 class="text-neon-blue h5 h-md-4 mb-2">Cíl hry</h4>
                <p class="text-neon-green mb-0">Dosáhnout jako první cílového skóre (výchozí je 10 000 bodů).</p>
            </div>
            
            <div class="mb-3 mb-lg-4">
                <h4 class="text-neon-blue h5 h-md-4 mb-2">Průběh tahu</h4>
                <ol class="text-neon-green ps-3 ps-md-4 mb-0">
                    <li class="mb-1 mb-md-2">Hráč hodí všemi šesti kostkami.</li>
                    <li class="mb-1 mb-md-2">Musí vybrat alespoň jednu bodovanou kombinaci.</li>
                    <li class="mb-1 mb-md-2">Může buď ukončit tah a připsat si body, nebo pokračovat s házením zbývajícími kostkami.</li>
                    <li class="mb-1 mb-md-2">Pokud pokračuje a hodí kombinaci bez bodů, ztrácí všechny body z aktuálního tahu.</li>
                </ol>
            </div>
            
            <div class="mb-0">
                <h4 class="text-neon-blue h5 h-md-4 mb-2">Bodování</h4>
                <ul class="text-neon-green ps-3 ps-md-4 mb-0">
                    <li class="mb-1 mb-md-2"><span class="text-neon-yellow fw-bold">Jednička</span> = 100 bodů</li>
                    <li class="mb-1 mb-md-2"><span class="text-neon-yellow fw-bold">Pětka</span> = 50 bodů</li>
                    <li class="mb-1 mb-md-2"><span class="text-neon-yellow fw-bold">Tři stejné kostky</span> = hodnota × 100 (tři jedničky = 1000)</li>
                    <li class="mb-1 mb-md-2"><span class="text-neon-yellow fw-bold">Čtyři stejné kostky</span> = hodnota × 200</li>
                    <li class="mb-1 mb-md-2"><span class="text-neon-yellow fw-bold">Pět stejných kostek</span> = hodnota × 400</li>
                    <li class="mb-1 mb-md-2"><span class="text-neon-yellow fw-bold">Šest stejných kostek</span> = hodnota × 800</li>
                </ul>
            </div>
        `);
        
        rulesContainer.appendChild(rulesCard);
        container.appendChild(rulesContainer);
        
        // Tlačítko zpět - Bootstrap responsive button
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-auto pt-3 d-flex justify-content-center';
        
        const backBtn = createNeonButton('ZPĚT DO MENU', 'orange', 'bi-arrow-left-circle-fill', 
            () => gameState.updateState({ gamePhase: 'menu' }), 'btn-sm btn-md-regular px-4 py-2 btn-no-scale');
        buttonContainer.appendChild(backBtn);
        container.appendChild(buttonContainer);
        
        // Vyčistíme a přidáme nový obsah
        if (this.gameArea) {
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(container);
        } else {
            console.warn('⚠️ GameUI.renderRules: gameArea není dostupný');
        }
    }

    /**
     * Vykreslí síň slávy - optimalizovaná pro všechny režimy zobrazení
     * Odstraněny inline styly a nahrazeny Bootstrap třídami
     */
    renderHallOfFame() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100 overflow-visible p-1';
        
        // Nadpis - kompaktnější v landscape režimu
        const title = document.createElement('h1');
        title.className = 'text-neon-orange fs-fluid-1 mb-2 mb-md-3 text-center';
        title.innerHTML = '<i class="bi bi-trophy-fill"></i> Síň slávy';
        container.appendChild(title);
        
        // Zobrazení tabulky se záznamy - plně responzivní
        const recordsContainer = document.createElement('div');
        recordsContainer.className = 'flex-grow-1 overflow-auto';
        
        // Vytvoříme fiktivní záznamy pro demonstraci - v reálném použití by se načetly z localStorage
        const records = [
            { name: 'Hráč', score: 12500, date: '2023-12-15' },
            { name: 'Gemini', score: 10800, date: '2023-12-14' },
            { name: 'ChatGPT', score: 10200, date: '2023-12-12' },
            { name: 'Claude', score: 9800, date: '2023-12-10' }
        ];
        
        // Vytvoříme responzivní tabulku s využitím Bootstrap tříd
        const table = document.createElement('div');
        table.className = 'table-responsive';
        
        // Optimalizace pro malé obrazovky - Bootstrap-first přístup
        // ODSTRANĚNO: Zbytečné bg-transparent třídy (black background je default)
        // OPRAVENO: neon-orange-border-bottom → neon-green-border-bottom (zelené oddělovače)
        table.innerHTML = `
            <table class="table table-sm neon-table">
                <thead>
                    <tr class="neon-green-border-bottom">
                        <th scope="col" class="text-center text-neon-orange neon-text-shadow-orange">#</th>
                        <th scope="col" class="text-neon-orange neon-text-shadow-orange">Jméno</th>
                        <th scope="col" class="text-center text-neon-orange neon-text-shadow-orange">Skóre</th>
                        <th scope="col" class="text-center d-none d-sm-table-cell text-neon-orange neon-text-shadow-orange">Datum</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map((record, index) => `
                        <tr>
                            <th scope="row" class="text-center text-neon-yellow neon-text-shadow-yellow">${index + 1}</th>
                            <td class="text-neon-blue neon-text-shadow-blue">${record.name}</td>
                            <td class="text-center text-neon-green neon-text-shadow-green">${record.score}</td>
                            <td class="text-center d-none d-sm-table-cell text-neon-purple neon-text-shadow-purple">${record.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        recordsContainer.appendChild(table);
        container.appendChild(recordsContainer);
        
        // Tlačítko zpět - sticky na spodek, kompaktní design s overflow protection
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-auto pt-2 d-flex justify-content-center overflow-visible p-2';
        
        const backBtn = createNeonButton('ZPĚT DO MENU', 'orange', 'bi-arrow-left-circle-fill', 
            () => gameState.updateState({ gamePhase: 'menu' }), 'btn-sm px-3 py-2');
        buttonContainer.appendChild(backBtn);
        container.appendChild(buttonContainer);
        
        // Vyčistíme a přidáme nový obsah
        if (this.gameArea) {
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(container);
        } else {
            console.warn('⚠️ GameUI.renderHallOfFame: gameArea není dostupný');
        }
    }

}

// Exportujeme třídu GameUI
export default GameUI;
// Force refresh Pá 11. července 2025, 18:21:25 CEST
