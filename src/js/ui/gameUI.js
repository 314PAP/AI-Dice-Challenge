/**
 * Game UI Manager - Správa herního UI
 * Stará se o vykreslování a aktualizaci herního rozhraní
 */

import gameState from '../game/gameState.js';
import { createNeonButton, createDiceElement } from './uiComponents.js';

/**
 * GameUI třída - Zajišťuje veškeré renderování herní plochy
 */
export class GameUI {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
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
        if (!this.gameArea) return;
        
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
        
        // Nadpis - kompaktnější v landscape režimu
        const title = document.createElement('h1');
        title.className = 'text-neon-green fs-fluid-1 mb-3 mb-md-4 text-center';
        title.innerHTML = '<i class="bi bi-star-fill"></i> Cílové skóre';
        container.appendChild(title);
        
        // Selector pro cílové skóre - optimalizovaný pro landscape
        const scoreSelector = document.createElement('div');
        scoreSelector.className = 'mb-3 mb-md-4 d-flex align-items-center justify-content-center fs-fluid-2';
        
        // Menší tlačítka v landscape režimu pro úsporu místa
        const minusBtn = createNeonButton('-', 'blue', null, () => this.adjustTargetScore(-1000), 'btn-sm');
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'px-3 px-md-4 text-neon-yellow';
        scoreValue.textContent = gameState.getState().targetScore;
        scoreValue.id = 'targetScoreValue';
        
        const plusBtn = createNeonButton('+', 'blue', null, () => this.adjustTargetScore(1000), 'btn-sm');
        
        scoreSelector.appendChild(minusBtn);
        scoreSelector.appendChild(scoreValue);
        scoreSelector.appendChild(plusBtn);
        
        container.appendChild(scoreSelector);
        
        // Tlačítka akcí - optimalizovaná pro landscape režim
        // V landscape režimu zobrazíme tlačítka v mřížce místo pod sebou
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'd-flex flex-column flex-landscape-row flex-wrap justify-content-center w-100 gap-2 px-3';
        
        const startBtn = createNeonButton(
            'ZAČÍT HRU', 
            'green', 
            'bi-play-fill', 
            () => this.startGame(), 
            'btn-sm btn-md-lg flex-grow-1 w-100 w-landscape-auto'
        );
        
        const rulesBtn = createNeonButton(
            'PRAVIDLA', 
            'blue', 
            'bi-book-fill', 
            () => this.showRules(), 
            'btn-sm btn-md-lg flex-grow-1 w-100 w-landscape-auto'
        );
        
        const hallOfFameBtn = createNeonButton(
            'SÍŇ SLÁVY', 
            'orange', 
            'bi-trophy-fill', 
            () => this.showHallOfFame(), 
            'btn-sm btn-md-lg flex-grow-1 w-100 w-landscape-auto'
        );
        
        buttonsContainer.appendChild(startBtn);
        buttonsContainer.appendChild(rulesBtn);
        buttonsContainer.appendChild(hallOfFameBtn);
        
        container.appendChild(buttonsContainer);
        
        // Vyčistíme a přidáme nový obsah
        this.gameArea.innerHTML = '';
        this.gameArea.appendChild(container);
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
        console.log('Vykresluje se herní obrazovka:', state);
        
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100';
        
        // Header s informacemi o hře - plně responzivní pro všechny režimy zobrazení
        const header = document.createElement('div');
        header.className = 'mb-2 d-flex justify-content-between align-items-center flex-wrap';
        
        // Informace o aktuálním hráči
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        const playerInfo = document.createElement('div');
        playerInfo.className = 'mb-1 mb-md-0 text-center text-md-start';
        playerInfo.innerHTML = `
            <h3 class="fs-fluid-3 mb-1 ${currentPlayer.isHuman ? 'text-neon-green' : `text-neon-${currentPlayer.color}`}">
                <i class="bi ${currentPlayer.avatar} me-1"></i>${currentPlayer.name}
            </h3>
            <div class="small text-neon-yellow d-none d-sm-block">Na tahu</div>
        `;
        header.appendChild(playerInfo);
        
        // Skóre - kompaktnější na malých zařízeních
        const scoreInfo = document.createElement('div');
        scoreInfo.className = 'ms-auto text-end';
        scoreInfo.innerHTML = `
            <div class="text-neon-yellow fs-fluid-4 d-none d-sm-block">Skóre:</div>
            <h4 class="fs-fluid-3 text-neon-green">${currentPlayer.score}</h4>
        `;
        header.appendChild(scoreInfo);
        
        container.appendChild(header);
        
        // Sekce s kostkami - optimalizovaná pro landscape režim
        const diceSection = document.createElement('div');
        diceSection.className = 'my-2 my-md-3 text-center';
        
        // Kontejner pro kostky - responzivní s využitím flexboxu
        const diceContainer = document.createElement('div');
        diceContainer.className = 'd-flex flex-wrap justify-content-center align-items-center';
        
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
            // Pokud nejsou žádné kostky, zobrazíme tlačítko pro hod
            const rollBtn = createNeonButton(
                'HODIT KOSTKY', 
                'green', 
                'bi-dice-3-fill', 
                () => this.rollDice(),
                'btn my-2 my-md-3'
            );
            diceContainer.appendChild(rollBtn);
        }
        
        diceSection.appendChild(diceContainer);
        container.appendChild(diceSection);
        
        // Akční tlačítka - responzivní s využitím Bootstrap tříd
        const actionButtons = document.createElement('div');
        actionButtons.className = 'mt-auto d-flex justify-content-center flex-wrap gap-2';
        
        // Různá tlačítka podle stavu hry - optimalizovaná pro landscape režim
        if (state.currentRoll && state.currentRoll.length > 0) {
            const buttonRow = document.createElement('div');
            buttonRow.className = 'd-flex justify-content-center gap-2 w-100';
        
            const continueBtn = createNeonButton(
                'POKRAČOVAT', 
                'green', 
                'bi-check-circle-fill',
                () => this.continueTurn(),
                'btn-sm btn-md-lg'
            );
            
            const endTurnBtn = createNeonButton(
                'UKONČIT TAH', 
                'blue', 
                'bi-skip-forward-fill',
                () => this.endTurn(),
                'btn-sm btn-md-lg'
            );
            
            buttonRow.appendChild(continueBtn);
            buttonRow.appendChild(endTurnBtn);
            actionButtons.appendChild(buttonRow);
        }
        
        // Tlačítko pro menu - vždy viditelné, ale menší v landscape režimu
        const menuBtnContainer = document.createElement('div');
        menuBtnContainer.className = 'w-100 mt-2';
        
        const menuBtn = createNeonButton(
            'MENU', 
            'orange', 
            'bi-list', 
            () => this.showMenu(),
            'btn-sm btn-md-lg w-100'
        );
        menuBtnContainer.appendChild(menuBtn);
        actionButtons.appendChild(menuBtnContainer);
        
        container.appendChild(actionButtons);
        
        // Vyčistíme a přidáme nový obsah
        this.gameArea.innerHTML = '';
        this.gameArea.appendChild(container);
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
     * Hodí kostky
     */
    rollDice() {
        console.log('Házení kostkami...');
        
        // Generuje náhodný hod 6 kostkami (hodnoty 1-6)
        const dice = [];
        for (let i = 0; i < 6; i++) {
            dice.push(Math.floor(Math.random() * 6) + 1);
        }
        
        // Aktualizuje herní stav
        gameState.updateState({
            currentRoll: dice,
            selectedDice: []
        });
        
        console.log('Hozeno:', dice);
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
            'btn-sm btn-md-lg flex-grow-1'
        );
        
        const menuBtn = createNeonButton(
            'HLAVNÍ MENU', 
            'blue', 
            'bi-house-fill', 
            () => gameState.updateState({ gamePhase: 'menu' }), 
            'btn-sm btn-md-lg flex-grow-1'
        );
        
        btnGroup.appendChild(newGameBtn);
        btnGroup.appendChild(menuBtn);
        
        container.appendChild(btnGroup);
        
        // Vyčistíme a přidáme nový obsah
        this.gameArea.innerHTML = '';
        this.gameArea.appendChild(container);
    }

    /**
     * Vykreslí pravidla - optimalizovaná pro všechny režimy zobrazení
     */
    renderRules() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100';
        
        // Nadpis - kompaktnější v landscape režimu
        const title = document.createElement('h1');
        title.className = 'text-neon-blue fs-fluid-1 mb-2 mb-md-3 text-center';
        title.innerHTML = '<i class="bi bi-book-fill"></i> Pravidla hry';
        container.appendChild(title);
        
        // Pravidla - responzivní layout s podporou pro scroll
        const rulesContainer = document.createElement('div');
        rulesContainer.className = 'flex-grow-1 overflow-auto px-1';
        
        // Vytvoření pravidel v responsivní kartě - kompaktnější layout pro malé obrazovky
        const rulesCard = createNeonCard('Pravidla kostkovky', 'blue', `
            <div class="rule-section mb-2 mb-md-3">
                <h4 class="text-neon-blue fs-fluid-3">Cíl hry</h4>
                <p class="small">Dosáhnout jako první cílového skóre (výchozí je 10 000 bodů).</p>
            </div>
            
            <div class="rule-section mb-2 mb-md-3">
                <h4 class="text-neon-blue fs-fluid-3">Průběh tahu</h4>
                <ol class="small ps-4">
                    <li class="mb-1">Hráč hodí všemi šesti kostkami.</li>
                    <li class="mb-1">Musí vybrat alespoň jednu bodovanou kombinaci.</li>
                    <li class="mb-1">Může buď ukončit tah a připsat si body, nebo pokračovat s házením zbývajícími kostkami.</li>
                    <li class="mb-1">Pokud pokračuje a hodí kombinaci bez bodů, ztrácí všechny body z aktuálního tahu.</li>
                </ol>
            </div>
            
            <div class="rule-section">
                <h4 class="text-neon-blue fs-fluid-3">Bodování</h4>
                <ul class="small ps-4">
                    <li class="mb-1">Jednička = 100 bodů</li>
                    <li class="mb-1">Pětka = 50 bodů</li>
                    <li class="mb-1">Tři stejné kostky = hodnota × 100 (tři jedničky = 1000)</li>
                    <li class="mb-1">Čtyři stejné kostky = hodnota × 200</li>
                    <li class="mb-1">Pět stejných kostek = hodnota × 400</li>
                    <li class="mb-1">Šest stejných kostek = hodnota × 800</li>
                </ul>
            </div>
        `);
        
        rulesContainer.appendChild(rulesCard);
        container.appendChild(rulesContainer);
        
        // Tlačítko zpět - sticky na spodek
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-auto pt-2';
        
        const backBtn = createNeonButton('ZPĚT DO MENU', 'green', 'bi-arrow-left-circle-fill', 
            () => gameState.updateState({ gamePhase: 'menu' }), 'btn-sm btn-md-lg w-100');
        buttonContainer.appendChild(backBtn);
        container.appendChild(buttonContainer);
        
        // Vyčistíme a přidáme nový obsah
        this.gameArea.innerHTML = '';
        this.gameArea.appendChild(container);
    }

    /**
     * Vykreslí síň slávy - optimalizovaná pro všechny režimy zobrazení
     */
    renderHallOfFame() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100';
        
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
        
        // Optimalizace pro malé obrazovky - menší písmo, kompaktnější rozložení
        table.innerHTML = `
            <table class="table table-sm neon-table" style="background: transparent; color: inherit;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--neon-orange);">
                        <th scope="col" class="text-center" style="color: var(--neon-orange) !important; text-shadow: 0 0 10px var(--neon-orange); background: transparent;">#</th>
                        <th scope="col" style="color: var(--neon-orange) !important; text-shadow: 0 0 10px var(--neon-orange); background: transparent;">Jméno</th>
                        <th scope="col" class="text-center" style="color: var(--neon-orange) !important; text-shadow: 0 0 10px var(--neon-orange); background: transparent;">Skóre</th>
                        <th scope="col" class="text-center d-none d-sm-table-cell" style="color: var(--neon-orange) !important; text-shadow: 0 0 10px var(--neon-orange); background: transparent;">Datum</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map((record, index) => `
                        <tr style="background: transparent;">
                            <th scope="row" class="text-center" style="color: var(--neon-yellow) !important; text-shadow: 0 0 10px var(--neon-yellow); background: transparent;">${index + 1}</th>
                            <td style="color: var(--neon-blue) !important; text-shadow: 0 0 10px var(--neon-blue); background: transparent;">${record.name}</td>
                            <td class="text-center" style="color: var(--neon-green) !important; text-shadow: 0 0 10px var(--neon-green); background: transparent;">${record.score}</td>
                            <td class="text-center d-none d-sm-table-cell" style="color: var(--neon-purple) !important; text-shadow: 0 0 10px var(--neon-purple); background: transparent;">${record.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        recordsContainer.appendChild(table);
        container.appendChild(recordsContainer);
        
        // Tlačítko zpět - sticky na spodek
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-auto pt-2';
        
        const backBtn = createNeonButton('ZPĚT DO MENU', 'green', 'bi-arrow-left-circle-fill', 
            () => gameState.updateState({ gamePhase: 'menu' }), 'btn-sm btn-md-lg w-100');
        buttonContainer.appendChild(backBtn);
        container.appendChild(buttonContainer);
        
        // Vyčistíme a přidáme nový obsah
        this.gameArea.innerHTML = '';
        this.gameArea.appendChild(container);
    }
}

// Exportujeme třídu GameUI
export default GameUI;
