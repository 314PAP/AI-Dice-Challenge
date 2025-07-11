/**
 * Game UI Manager - Správa herního UI
 * Stará se o vykreslování a aktualizaci herního rozhraní
 */

import gameState from '../game/gameState.js';
import { createNeonButton, createDiceElement, createNeonCard } from './uiComponents.js';
import { UI_CONSTANTS, NEON_COLORS } from '../utils/constants.js';
import { CONSOLE_COLORS, CHAT_COLORS, pxToRem } from '../utils/colors.js';
import { rollDie, rollDice, calculatePoints } from '../game/diceMechanics.js';
import chatSystem from '../ai/chatSystem.js';

/**
 * GameUI třída - Zajišťuje veškeré renderování herní plochy
 */
export class GameUI {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        
        // Ověříme, že gameArea existuje
        if (!this.gameArea) {
            console.warn('⚠️ GameUI: Element #gameArea nenalezen. GameUI bude čekat na DOM.');
            // Pokusíme se najít gameArea po načtení DOM
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
     * Vykreslí hlavní menu - optimalizované pro všechny režimy zobrazení
     */
    renderMainMenu() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column justify-content-center align-items-center h-100';
        
        // Nadpis - ČISTÝ BOOTSTRAP
        const title = document.createElement('h1');
        title.className = 'text-neon-green display-6 mb-4 text-center';
        title.innerHTML = '<i class="bi bi-star-fill"></i> Cílové skóre';
        container.appendChild(title);
        
        // Selector pro cílové skóre - ČISTÝ BOOTSTRAP
        const scoreSelector = document.createElement('div');
        scoreSelector.className = 'mb-4 d-flex align-items-center justify-content-center fs-5';
        
        // Tlačítka - ČISTÝ BOOTSTRAP
        const minusBtn = createNeonButton('-', 'blue', null, () => this.adjustTargetScore(-1000), 'btn-sm');
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'px-4 text-neon-yellow fs-4';
        scoreValue.textContent = gameState.getState().targetScore;
        scoreValue.id = 'targetScoreValue';
        
        const plusBtn = createNeonButton('+', 'blue', null, () => this.adjustTargetScore(1000), 'btn-sm');
        
        scoreSelector.appendChild(minusBtn);
        scoreSelector.appendChild(scoreValue);
        scoreSelector.appendChild(plusBtn);
        
        container.appendChild(scoreSelector);
        
        // Tlačítka akcí - ČISTÝ BOOTSTRAP GRID
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
        col1.className = 'col-12 col-sm-6 mb-2';
        col1.appendChild(startBtn);
        
        const col2 = document.createElement('div');
        col2.className = 'col-12 col-sm-6 mb-2';
        col2.appendChild(rulesBtn);
        
        const col3 = document.createElement('div');
        col3.className = 'col-12 col-sm-6 mb-2';
        col3.appendChild(hallOfFameBtn);
        
        const col4 = document.createElement('div');
        col4.className = 'col-12 col-sm-6 mb-2';
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

    /**
     * Vykreslí herní obrazovku
     * @param {Object} state - Aktuální herní stav
     */
    renderGameScreen(state) {
        console.log('🎮 Vykresluje se herní obrazovka:', state);
        
        if (!state.players || state.players.length === 0) {
            console.error('❌ Žádní hráči v herním stavu!');
            return;
        }
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (!currentPlayer) {
            console.error('❌ Aktuální hráč nenalezen! Index:', state.currentPlayerIndex);
            return;
        }
        
        console.log('👤 Aktuální hráč:', currentPlayer);
        
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100 overflow-hidden';
        
        // Header s informacemi o hře - ČISTÝ BOOTSTRAP bez custom tříd
        const header = document.createElement('div');
        header.className = 'row mb-3 p-2 border border-primary rounded';
        
        // Informace o aktuálním hráči - BOOTSTRAP GRID
        const playerCol = document.createElement('div');
        playerCol.className = 'col-8';
        playerCol.innerHTML = `
            <h4 class="text-neon-green mb-1">
                <i class="bi ${currentPlayer.avatar} me-2"></i>${currentPlayer.name}
            </h4>
            <div class="text-neon-yellow small">Na tahu</div>
        `;
        header.appendChild(playerCol);
        
        // Skóre - BOOTSTRAP GRID
        const scoreCol = document.createElement('div');
        scoreCol.className = 'col-4 text-end';
        scoreCol.innerHTML = `
            <div class="text-neon-yellow small">Skóre:</div>
            <h4 class="text-neon-green">${currentPlayer.score}</h4>
        `;
        header.appendChild(scoreCol);
        
        container.appendChild(header);
        
        // Sekce s kostkami - ČISTÝ BOOTSTRAP
        const diceSection = document.createElement('div');
        diceSection.className = 'text-center my-3';
        
        // Kontejner pro kostky - BOOTSTRAP FLEXBOX s responzivními mezerami
        const diceContainer = document.createElement('div');
        diceContainer.className = 'd-flex flex-wrap justify-content-center align-items-center gap-1 gap-sm-2';
        
        // Pokud jsou nějaké kostky, zobrazíme je
        if (state.currentRoll && state.currentRoll.length > 0) {
            state.currentRoll.forEach((dieValue, index) => {
                const isSelected = state.selectedDice.includes(index);
                const diceEl = createDiceElement(
                    dieValue, 
                    isSelected, 
                    () => this.toggleDiceSelection(index)
                );
                diceContainer.appendChild(diceEl);
            });
        } else {
            // Pokud nejsou žádné kostky, zobrazíme informativní text
            const infoText = document.createElement('div');
            infoText.className = 'text-neon-yellow fs-5';
            infoText.innerHTML = '<i class="bi bi-dice-6"></i> Stiskněte HODIT pro začátek';
            diceContainer.appendChild(infoText);
        }
        
        diceSection.appendChild(diceContainer);
        container.appendChild(diceSection);
        
        // Akční tlačítka - TĚSNĚ POD KOSTKAMI, ne na spodku
        const actionButtons = document.createElement('div');
        actionButtons.className = 'mt-3 mb-3'; // Změna z mt-auto na mt-3
        
        // Kontejner pro tlačítka - BOOTSTRAP GRID s menšími tlačítky
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'row g-2 px-2'; // Přidán padding pro okraje
        
        // Tlačítko HODIT - vždy dostupné
        const rollBtn = createNeonButton(
            'HODIT', 
            'green', 
            'bi-dice-6-fill',
            () => this.rollDice(),
            'btn-sm w-100' // Menší tlačítko s plnou šířkou
        );
        
        const rollCol = document.createElement('div');
        rollCol.className = 'col-6 mb-2'; // col-6 místo col-sm-6 pro konzistentní 2x2 grid
        rollCol.appendChild(rollBtn);
        buttonsContainer.appendChild(rollCol);
        
        // Tlačítko ODLOŽIT - vždy viditelné, ale disabled pokud nejsou vybrané kostky
        const saveBtn = createNeonButton(
            'ODLOŽIT', 
            'blue', 
            'bi-floppy-fill',
            () => this.saveDice(),
            'btn-sm w-100' // Menší tlačítko s plnou šířkou
        );
        
        // Disable tlačítko pokud nejsou vybrané kostky
        if (!state.selectedDice || state.selectedDice.length === 0) {
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.5';
        }
        
        const saveCol = document.createElement('div');
        saveCol.className = 'col-6 mb-2'; // col-6 místo col-sm-6
        saveCol.appendChild(saveBtn);
        buttonsContainer.appendChild(saveCol);
        
        // Tlačítko UKONČIT TAH - vždy viditelné, ale disabled pokud není hod
        const endTurnBtn = createNeonButton(
            'UKONČIT TAH', 
            'orange', 
            'bi-skip-forward-fill',
            () => this.endTurn(),
            'btn-sm w-100' // Menší tlačítko s plnou šířkou
        );
        
        // Disable tlačítko pokud není hod
        if (!state.currentRoll || state.currentRoll.length === 0) {
            endTurnBtn.disabled = true;
            endTurnBtn.style.opacity = '0.5';
        }
        
        const endCol = document.createElement('div');
        endCol.className = 'col-6 mb-2'; // col-6 místo col-sm-6
        endCol.appendChild(endTurnBtn);
        buttonsContainer.appendChild(endCol);
        
        // Tlačítko MENU - vždy dostupné
        const menuBtn = createNeonButton(
            'MENU', 
            'red', 
            'bi-list', 
            () => this.showMenu(),
            'btn-sm w-100' // Menší tlačítko s plnou šířkou
        );
        
        const menuCol = document.createElement('div');
        menuCol.className = 'col-6 mb-2'; // col-6 místo col-sm-6
        menuCol.appendChild(menuBtn);
        buttonsContainer.appendChild(menuCol);
        
        actionButtons.appendChild(buttonsContainer);
        
        container.appendChild(actionButtons);
        
        // Vyčistíme a přidáme nový obsah
        if (this.gameArea) {
            this.gameArea.innerHTML = '';
            this.gameArea.appendChild(container);
        } else {
            console.warn('⚠️ GameUI.renderGameScreen: gameArea není dostupný');
        }
    }
    
    /**
     * Přepíná výběr kostky
     * @param {number} index - Index kostky
     */
    toggleDiceSelection(index) {
        const state = gameState.getState();
        let selectedDice = [...state.selectedDice];
        
        if (selectedDice.includes(index)) {
            selectedDice = selectedDice.filter(i => i !== index);
        } else {
            selectedDice.push(index);
        }
        
        gameState.updateState({ selectedDice });
    }
    
    /**
     * Hodí kostky - využívá diceMechanics modul místo vlastní implementace
     */
    rollDice() {
        console.log('🎲 Házení kostkami...');
        
        // Využití importované funkce pro hod 6 kostkami
        const dice = rollDice(6);
        
        // Spočítáme body z tohoto hodu
        const points = calculatePoints(dice);
        
        // Aktualizuje herní stav
        gameState.updateState({
            currentRoll: dice,
            selectedDice: []
        });
        
        console.log(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
        chatSystem.addSystemMessage(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
        
        // Zkontrolujeme, zda hod obsahuje bodující kostky
        if (points === 0) {
            const warningMsg = '⚠️ POZOR: Tento hod neobsahuje žádné bodující kostky! Musíte ukončit tah.';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
        } else {
            const successMsg = `✅ Dobré! Máte ${points} bodů z tohoto hodu. Vyberte kostky k odložení nebo pokračujte.`;
            console.log(successMsg);
            chatSystem.addSystemMessage(successMsg, CHAT_COLORS.GREEN);
        }
        
        // Překreslíme obrazovku
        this.renderGameScreen(gameState.getState());
    }
    
    /**
     * Pokračuje v tahu s vybranými kostkami
     */
    continueTurn() {
        // Implementace pokračování tahu
        console.log('Pokračování v tahu...');
    }
    
    /**
     * Ukončí aktuální tah
     */
    endTurn() {
        // Implementace ukončení tahu
        console.log('Ukončení tahu...');
    }
    
    /**
     * Zobrazí herní menu
     */
    showMenu() {
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
        
        // Informace o vítězi - kompaktnější pro malé displeje
        const winnerInfo = document.createElement('div');
        winnerInfo.className = 'text-center mb-3 mb-md-4';
        winnerInfo.innerHTML = `
            <h2 class="fs-fluid-2 text-neon-${winner.color} mb-2">
                <i class="bi ${winner.avatar} me-1 me-sm-2"></i>${winner.name}
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

    /**
     * Odloží vybrané kostky - přesune je z aktuálního hodu do odložených
     */
    saveDice() {
        const state = gameState.getState();
        
        if (!state.selectedDice || state.selectedDice.length === 0) {
            const warningMsg = '⚠️ Vyberte kostky k odložení!';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        if (!state.currentRoll || state.currentRoll.length === 0) {
            const warningMsg = '⚠️ Nejsou žádné kostky k odložení';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        // Získáme hodnoty vybraných kostek
        const savedDiceValues = state.selectedDice.map(index => state.currentRoll[index]);
        
        // Spočítáme body z vybraných kostek
        const points = calculatePoints(savedDiceValues);
        
        if (points === 0) {
            const warningMsg = '⚠️ POZOR: Vybrané kostky nemají žádnou hodnotu! Vyberte bodující kostky (1, 5, nebo trojice).';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        // Aktualizujeme stav - přidáme odložené kostky a vymažeme výběr
        const newSavedDice = [...(state.savedDice || []), ...savedDiceValues];
        const newSavedPoints = calculatePoints(newSavedDice);
        
        console.log(`💾 Odkládám kostky: [${savedDiceValues.join(', ')}] = ${points} bodů`);
        console.log(`📊 Celkem odloženo: [${newSavedDice.join(', ')}] = ${newSavedPoints} bodů`);
        
        chatSystem.addSystemMessage(`💾 Odkládám kostky: [${savedDiceValues.join(', ')}] = ${points} bodů`);
        chatSystem.addSystemMessage(`📊 Celkem odloženo: [${newSavedDice.join(', ')}] = ${newSavedPoints} bodů`, CHAT_COLORS.BLUE);
        
        gameState.updateState({ 
            savedDice: newSavedDice,
            selectedDice: [],
            currentRoll: [] // Vyčistíme aktuální hod
        });
        
        // Překreslíme obrazovku
        this.renderGameScreen(gameState.getState());
    }

    /**
     * Pokračuje v tahu - placeholder pro budoucí implementaci
     */
    continueTurn() {
        console.log('🎯 Pokračuji v tahu...');
        // TODO: Implementovat logiku pokračování tahu
    }

    /**
     * Ukončí aktuální tah
     */
    endTurn() {
        const state = gameState.getState();
        
        // Kontrola, zda hráč má odložené nějaké kostky
        if (!state.savedDice || state.savedDice.length === 0) {
            const warningMsg = '⚠️ POZOR: Nemůžete ukončit tah bez odložených kostek! Nejdříve odložte bodující kostky.';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        console.log('⏭️ Ukončuji tah...');
        
        const players = [...state.players];
        const currentPlayer = players[state.currentPlayerIndex];
        
        if (!currentPlayer) {
            console.error('❌ Aktuální hráč nenalezen');
            return;
        }
        
        // Spočítáme body z odložených kostek
        const points = calculatePoints(state.savedDice || []);
        const oldScore = currentPlayer.score;
        currentPlayer.score += points;
        
        console.log(`📊 Hráč ${currentPlayer.name}:`);
        console.log(`   • Odložené kostky: [${state.savedDice.join(', ')}]`);
        console.log(`   • Získané body: ${points}`);
        console.log(`   • Skóre: ${oldScore} → ${currentPlayer.score}`);
        
        chatSystem.addSystemMessage(`📊 Hráč ${currentPlayer.name}: Odložené kostky [${state.savedDice.join(', ')}] = ${points} bodů`);
        chatSystem.addSystemMessage(`🎯 Skóre: ${oldScore} → ${currentPlayer.score}`, CHAT_COLORS.BLUE);
        
        // Kontrola vítězství
        if (currentPlayer.score >= state.targetScore) {
            const victoryMsg = `🏆 VÍTĚZSTVÍ! ${currentPlayer.name} dosáhl cílového skóre ${state.targetScore}!`;
            console.log(victoryMsg);
            chatSystem.addSystemMessage(victoryMsg, CHAT_COLORS.GREEN);
            // TODO: Zobrazit obrazovku vítězství
        }
        
        // Přejdeme na dalšího hráče
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % players.length;
        const nextPlayer = players[nextPlayerIndex];
        
        console.log(`👤 Další hráč: ${nextPlayer.name}`);
        chatSystem.addSystemMessage(`👤 Další hráč: ${nextPlayer.name}`, CHAT_COLORS.PURPLE);
        
        gameState.updateState({
            players,
            currentPlayerIndex: nextPlayerIndex,
            currentRoll: [],
            selectedDice: [],
            savedDice: []
        });
        
        // Překreslíme obrazovku
        this.renderGameScreen(gameState.getState());
    }
}

// Exportujeme třídu GameUI
export default GameUI;
