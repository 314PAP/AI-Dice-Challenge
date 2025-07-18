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
import { CHAT_COLORS } from '../utils/colors.js';
import { createNeonButton, createNeonCard } from './uiComponents.js';
import { MenuComponents } from './menuComponents.js';
import { GameScreens } from './gameScreens.js';
import { showConfirmDialog } from './confirmDialog.js';
import soundSystem from '../utils/soundSystem.js';

export class GameUI {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        // Odstraněno: this.aiTurnInProgress - řízeno nyní přes gameState.isAiTurnInProgress
        this.lastPlayerIndex = undefined;
        this.lastRenderTime = 0;

        // Inicializace modulů
        this.gameRenderer = new GameRenderer();
        this.gameLogic = new GameLogic(this.gameRenderer);
        this.aiController = new AiPlayerController(this.gameLogic);
        this.menuComponents = new MenuComponents();
        this.gameScreens = new GameScreens();

        // Ověříme DOM s fallbackem
        if (!this.gameArea) {
            console.warn('⚠️ GameUI: Element #gameArea nenalezen při inicializaci');
            // Zkusíme hned i po DOMContentLoaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initWhenReady());
            } else {
                setTimeout(() => this.initWhenReady(), 100);
            }
            return;
        }

        this.initEventListeners();
    }

    initWhenReady() {
        this.gameArea = document.getElementById('gameArea');

        if (this.gameArea) {
            this.initEventListeners();
        } else {
            console.error('❌ GameUI: Element #gameArea stále nenalezen');
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
            return; // Přeskočíme render během rychlé animace
        }
        this.lastRenderTime = now;

        // Kontrola změny hráče
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
                this.renderHallOfFame(state).catch(error =>
                    console.error('❌ Chyba při renderování síně slavy:', error)
                );
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
        // Připravíme callbacks pro GameRenderer
        const callbacks = {
            toggleDiceSelection: (index) => this.toggleDiceSelection(index),
            rollDice: () => this.gameLogic.rollDice(),
            saveDice: () => this.gameLogic.saveDice(),
            endTurn: () => this.endTurnWithValidation(),
            showMenuWithConfirmation: () => this.showMenuWithConfirmation()
        };

        // Delegujeme vykreslení na GameRenderer
        const gameContainer = this.gameRenderer.renderGameScreen(state, callbacks);

        if (gameContainer && this.gameArea) {
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(gameContainer);

            // AI tahy se nyní řídí z TurnManager.js - odstraněno duplicitní volání
        }
    }

    /**
     * Přepíná výběr kostky
     * @param {number} index - Index kostky
     */
    toggleDiceSelection(index) {
        const state = gameState.getState();

        // Blokovat interakci během AI tahu
        if (state.currentPlayerIndex !== 0) {
            console.log('🚫 Nelze vybírat kostky během AI tahu');
            soundSystem.play('error');
            return;
        }

        let selectedDice = [...(state.selectedDice || [])];

        if (selectedDice.includes(index)) {
            // Odznačování - vždy povoleno
            selectedDice = selectedDice.filter(i => i !== index);
        } else {
            // Označování - kontrolujeme platnost kostky
            const dieValue = state.currentRoll[index];

            if (this.isValidDiceForSelection(dieValue, state.currentRoll)) {
                selectedDice.push(index);
            } else {
                const warningMsg = `⚠️ Kostka ${dieValue} nemůže být označena! Potřebujete alespoň 3 stejné kostky.`;
                console.warn(warningMsg);
                // Přehrajeme error zvuk - kostka nejde označit
                soundSystem.play('error');
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
        // KONTROLA POSTUPKY (1,2,3,4,5,6) - všechny kostky lze vybrat
        if (currentRoll.length === 6) {
            const sortedDice = [...currentRoll].sort();
            const isSequence = sortedDice.every((value, index) => value === index + 1);
            if (isSequence) {
                return true; // V postupce lze vybrat jakoukoli kostku
            }
        }

        // KONTROLA TŘÍ PÁRŮ - všechny kostky lze vybrat
        if (currentRoll.length === 6) {
            const counts = {};
            currentRoll.forEach(die => {
                counts[die] = (counts[die] || 0) + 1;
            });

            let pairCount = 0;
            for (let value = 1; value <= 6; value++) {
                if (counts[value] === 2) {
                    pairCount++;
                }
            }

            if (pairCount === 3) {
                return true; // Ve třech párech lze vybrat jakoukoli kostku
            }
        }

        // Jedničky a pětky lze vždy vybrat
        if (dieValue === 1 || dieValue === 5) {
            return true;
        }

        // Pro ostatní hodnoty musí být alespoň 3 stejné
        const countOfValue = currentRoll.filter(die => die === dieValue).length;
        return countOfValue >= 3;
    }

    /**
     * Ukončí tah s validací prvního zápisu
     */
    endTurnWithValidation() {
        const state = gameState.getState();

        // Blokovat interakci během AI tahu
        if (state.currentPlayerIndex !== 0) {
            console.log('🚫 Nelze ukončit tah během AI tahu');
            soundSystem.play('error');
            return;
        }

        const currentPlayer = state.players[state.currentPlayerIndex];
        const turnScore = state.turnScore || 0;

        // KONTROLA PRVNÍHO ZÁPISU před ukončením tahu
        if (currentPlayer.score === 0 && turnScore < 300) {
            const errorMsg = `❌ První zápis vyžaduje minimálně 300 bodů! Máte jen ${turnScore} bodů. Pokračujte v házení nebo odložte více kostek.`;
            console.warn(errorMsg);

            // Zobraz chybovou zprávu
            import('../ai/chatSystem.js').then(({ default: chatSystem }) => {
                import('../utils/colors.js').then(({ CHAT_COLORS }) => {
                    chatSystem.addSystemMessage(errorMsg, CHAT_COLORS.RED);
                });
            });

            // Přehraj error zvuk
            soundSystem.play('error');
            return; // BLOKUJ ukončení tahu
        }

        // Pokud validace prošla, ukončíme tah
        this.gameLogic.endTurn();
    }

    // =============================================================================
    // MENU A OSTATNÍ OBRAZOVKY (TODO: přesunout do MenuRenderer)
    // =============================================================================

    /**
     * Vykreslí hlavní menu - optimalizované pro všechny režimy zobrazení
     */
    renderMainMenu() {
        if (!this.gameArea) {
            console.error('❌ GameUI.renderMainMenu: gameArea není dostupný při renderování!');
            return;
        }

        // Přidání úvodních zpráv do chatu při zobrazení menu (BEZ triggeru state update)
        this.addWelcomeMessages();

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
        const minusBtn = createNeonButton('-', 'blue', null, () => this.adjustTargetScore(-1000), 'btn px-3 py-2 fs-4 lh-1 btn-no-scale');

        const scoreValue = document.createElement('div');
        scoreValue.className = 'px-3 text-neon-yellow fs-4 lh-1 d-flex align-items-center';
        scoreValue.textContent = gameState.getState().targetScore;
        scoreValue.id = 'targetScoreValue';

        const plusBtn = createNeonButton('+', 'blue', null, () => this.adjustTargetScore(1000), 'btn px-3 py-2 fs-4 lh-1 btn-no-scale');

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
        // Vyčistíme chat při novém startu hry
        chatSystem.clearMessages();

        // Reset všech FARKLE flagů při novém startu hry
        this.resetAllFarkleFlags();

        gameState.updateState({
            gameStarted: true,
            gamePhase: 'game',
            currentPlayerIndex: 0,
            currentRoll: [],
            selectedDice: [],
            turnScore: 0,
            players: gameState.getState().players.map(p => ({ ...p, score: 0 }))
        });

        // Přidáme systémovou zprávu o začátku hry
        const currentPlayer = gameState.getState().players[0];
        chatSystem.addSystemMessage(`Hra začíná! Na řadě je ${currentPlayer.name}`, CHAT_COLORS.GREEN);

        // AI tahy řídí POUZE TurnManager.js - ODSTRANĚNO duplicitní volání
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
    async showHallOfFame() {
        await this.gameScreens.renderHallOfFame(this.gameArea, null);
    }

    /**
     * 🏠 Zobrazí hlavní menu s potvrzením (pokud je hra v průběhu)
     */
    async showMenuWithConfirmation() {

        const state = gameState.getState();

        // Pokud hra není spuštěná, přejdi rovnou do menu
        if (!state.gameStarted) {
            gameState.updateState({
                currentPhase: 'menu',
                gameStarted: false
            });
            return;
        }

        // Pokud je hra v průběhu, zobraz stylizovaný dialog
        const confirmMessage = 'Opravdu chcete ukončit hru a vrátit se do hlavního menu? Veškerý postup bude ztracen.';

        const confirmed = await showConfirmDialog(
            confirmMessage,
            () => {
                // Přidáme uvítací zprávy při návratu do menu (clearMessages se volá uvnitř)
                this.addWelcomeMessages();

                gameState.updateState({
                    gamePhase: 'menu',
                    gameStarted: false,
                    currentPlayerIndex: 0
                });
            },
            () => {
                // Zrušeno
            }
        );

        // Pokud nebyl potvrzen, nic dalšího nedělej
        if (!confirmed) {
            // Dialog zrušen
        }
    }

    /**
     * Přidá úvodní zprávy do chatu v hlavním menu
     */
    addWelcomeMessages() {
        // Vždy vyčistíme chat při návratu do menu a přidáme uvítací zprávy
        chatSystem.clearMessages();

        // Přidáme úvodní zprávy pomocí správných metod
        chatSystem.addSystemMessage('Vítejte v AI Kostkové Výzvě!', CHAT_COLORS.GREEN);
        chatSystem.addAiMessage('Gemini', 'Připravte se na analytickou výzvu!');
        chatSystem.addAiMessage('ChatGPT', 'Bude to skvělá hra!');
        chatSystem.addAiMessage('Claude', 'Hodně štěstí!');
    }

    /**
     * Resetuje FARKLE flagy pro všechny hráče (bez triggeru state change)
     */
    resetAllFarkleFlags() {
        const state = gameState.getState();

        // Upravíme data přímo bez notifikace listeneru
        state.players.forEach(player => {
            player.hasFarkle = false;
        });
        state.isFarkleProcessing = false;
    }

    /**
     * Vykreslí pravidla hry
     */
    renderRules() {
        if (!this.gameArea) {
            console.error('❌ GameUI.renderRules: gameArea není dostupný při renderování!');
            return;
        }

        // Delegujeme na GameScreens
        if (this.gameScreens && this.gameScreens.renderRules) {
            this.gameScreens.renderRules(this.gameArea);
        } else {
            console.error('❌ GameScreens nebo renderRules metoda není dostupná!');
        }
    }

    /**
     * Vykreslí síň slávy
     */
    async renderHallOfFame(state = null) {
        if (!this.gameArea) {
            console.error('❌ GameUI.renderHallOfFame: gameArea není dostupný při renderování!');
            return;
        }

        // Delegujeme na GameScreens
        if (this.gameScreens && this.gameScreens.renderHallOfFame) {
            await this.gameScreens.renderHallOfFame(this.gameArea, state);
        } else {
            console.error('❌ GameScreens nebo renderHallOfFame metoda není dostupná!');
        }
    }

    /**
     * Vykreslí obrazovku konce hry s výsledky
     */
    renderGameOver(state) {
        if (!this.gameArea) {
            console.error('❌ GameUI.renderGameOver: gameArea není dostupný při renderování!');
            return;
        }

        // Delegujeme na GameScreens
        if (this.gameScreens && this.gameScreens.renderGameOver) {
            this.gameScreens.renderGameOver(this.gameArea, state);
        } else {
            console.error('❌ GameScreens nebo renderGameOver metoda není dostupná!');
            // Fallback - základní zobrazení
            this.renderBasicGameOver(state);
        }
    }

    /**
     * Základní fallback pro konec hry
     */
    renderBasicGameOver(state) {
        this.gameArea.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'h-100 d-flex flex-column justify-content-center align-items-center p-3';

        const winner = state.players.find(p => p.score >= state.targetScore) ||
            state.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);

        container.innerHTML = `
            <h1 class="text-neon-yellow mb-4">🏆 KONEC HRY</h1>
            <h2 class="text-neon-green mb-3">Vítěz: ${winner.name}</h2>
            <h3 class="text-neon-blue mb-4">Skóre: ${winner.score} bodů</h3>
            <div class="d-flex gap-3">
                <button class="btn btn-neon" data-neon-color="green" onclick="gameState.updateState({gamePhase: 'menu'})">
                    <i class="bi bi-house-fill me-2"></i>Hlavní menu
                </button>
                <button class="btn btn-neon" data-neon-color="blue" onclick="gameState.updateState({gamePhase: 'halloffame'})">
                    <i class="bi bi-trophy-fill me-2"></i>Síň slávy
                </button>
            </div>
        `;

        this.gameArea.appendChild(container);
    }
}

// Exportujeme třídu GameUI
export default GameUI;
// Force refresh Pá 11. července 2025, 18:21:25 CEST
