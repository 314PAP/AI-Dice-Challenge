/**
 * Game UI Manager - Správa herního UI
 * Stará se o vykreslování a aktualizaci herního rozhraní
 */

import gameState from '../game/gameState.js';
import { createNeonButton, createDiceElement, createNeonCard } from './uiComponents.js';
import { UI_CONSTANTS, NEON_COLORS } from '../utils/constants.js';
import { CONSOLE_COLORS, CHAT_COLORS, pxToRem } from '../utils/colors.js';
import { rollDie, rollDice, calculatePoints, hasScoringDice, isValidFarkleCombination } from '../game/diceMechanics.js';
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
        
        // Responzivní karty hráčů - vždy v jednom řádku
        const playersSection = document.createElement('div');
        playersSection.className = 'row g-1 g-sm-2 mb-3';
        
        state.players.forEach((player, index) => {
            const isCurrentPlayer = index === state.currentPlayerIndex;
            
            // Vždy 4 sloupce v jednom řádku - responzivní
            const playerCol = document.createElement('div');
            playerCol.className = 'col-3';
            
            // Čistá karta hráče s neonovým rámečkem podle barvy
            const playerCard = document.createElement('div');
            playerCard.className = `card bg-black border border-neon-${player.color} ${isCurrentPlayer ? 'border-3' : 'border-2'}`;
            
            // Responzivní obsah - větší ikona, menší text
            playerCard.innerHTML = `
                <div class="card-body text-center p-1 p-sm-2">
                    <div class="mb-1 mb-sm-2">
                        <img src="ai-icons/${player.avatar}" alt="${player.name}" 
                             class="rounded-circle" 
                             style="width: 48px; height: 48px; object-fit: cover;">
                    </div>
                    <div class="text-neon-${player.color} small fw-bold mb-1">${player.name}</div>
                    <div class="text-neon-green" style="font-size: 0.7rem;">Score:</div>
                    <div class="text-neon-green fw-bold small">${player.score}</div>
                </div>
            `;
            
            playerCol.appendChild(playerCard);
            playersSection.appendChild(playerCol);
        });
        
        container.appendChild(playersSection);
        
        // Sekce s kostkami - odložené i aktuální v jedné řadě
        const diceSection = document.createElement('div');
        diceSection.className = 'text-center my-3';
        
        // Kontejner pro kostky - BOOTSTRAP FLEXBOX s responzivními mezerami
        const diceContainer = document.createElement('div');
        diceContainer.className = 'd-flex flex-wrap justify-content-center align-items-center gap-1 gap-sm-2';
        
        // Pokud jsou nějaké aktuální kostky, zobrazíme je VLEVO
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
        }
        
        // Potom zobrazíme odložené kostky (modré, vpravo) - odkládané zprava doleva
        if (state.savedDice && state.savedDice.length > 0) {
            state.savedDice.forEach(dieValue => {
                const diceEl = createDiceElement(dieValue, false, null);
                // Použijeme CSS třídu saved pro modrou barvu
                diceEl.classList.add('saved');
                diceEl.style.filter = 'brightness(0.8)'; // Trochu ztlumit pro rozlišení
                diceContainer.appendChild(diceEl);
            });
        }
        
        // Pokud nejsou žádné kostky (ani odložené, ani aktuální)
        if ((!state.currentRoll || state.currentRoll.length === 0) && (!state.savedDice || state.savedDice.length === 0)) {
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
        
        // Tlačítko HODIT - dostupné když:
        // 1. Nejsou žádné kostky na stole (začátek tahu nebo po odložení všech kostek)
        // 2. NEBO jsou kostky na stole, ale žádné nejsou vybrané (hráč může házt znovu se zbývajícími)
        const rollBtn = createNeonButton(
            'HODIT', 
            'green', 
            'bi-dice-6-fill',
            () => this.rollDice(),
            'btn-sm w-100'
        );
        
        // Logika pro disable tlačítka HODIT:
        // - Zakázané pouze když jsou vybrané kostky (hráč musí je nejdříve odložit nebo odznačit)
        const hasSelectedDice = state.selectedDice && state.selectedDice.length > 0;
        
        if (hasSelectedDice) {
            rollBtn.disabled = true;
            rollBtn.style.opacity = '0.5';
            rollBtn.title = 'Nejdříve odložte nebo odznačte vybrané kostky';
        } else {
            rollBtn.disabled = false;
            rollBtn.style.opacity = '1';
            rollBtn.title = 'Házet kostkami';
        }
        
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
        
        // Tlačítko UKONČIT TAH - dostupné když má hráč nějaké body (odložené kostky nebo hot dice)
        const endTurnBtn = createNeonButton(
            'UKONČIT TAH', 
            'orange', 
            'bi-skip-forward-fill',
            () => this.endTurn(),
            'btn-sm w-100' // Menší tlačítko s plnou šířkou
        );
        
        // Disable tlačítko pokud nemá žádné body k ukončení
        const hasSavedDice = state.savedDice && state.savedDice.length > 0;
        const hasTurnScore = state.turnScore && state.turnScore > 0;
        
        if (!hasSavedDice && !hasTurnScore) {
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
        console.log('🎯 toggleDiceSelection volán s indexem:', index);
        const state = gameState.getState();
        console.log('📊 Aktuální selectedDice:', state.selectedDice);
        let selectedDice = [...state.selectedDice];
        
        if (selectedDice.includes(index)) {
            selectedDice = selectedDice.filter(i => i !== index);
            console.log('➖ Odebírám index', index, 'nové selectedDice:', selectedDice);
        } else {
            selectedDice.push(index);
            console.log('➕ Přidávám index', index, 'nové selectedDice:', selectedDice);
        }
        
        gameState.updateState({ selectedDice });
        console.log('✅ Stav aktualizován, renderuji...');
    }
    
    /**
     * Hodí kostky - využívá diceMechanics modul místo vlastní implementace
     */
    rollDice() {
        console.log('🎲 Házení kostkami...');
        
        const state = gameState.getState();
        
        // Určíme kolik kostek hodit
        let diceCount;
        
        // Pokud jsou zbývající kostky z předchozího hodu, házíme jimi
        if (state.currentRoll && state.currentRoll.length > 0) {
            diceCount = state.currentRoll.length;
            console.log(`🎯 Házím se zbývajícími ${diceCount} kostkami`);
        } else {
            // Jinak házíme novými kostkami podle toho, kolik jich zbývá
            const totalSavedDice = (state.savedDice || []).length;
            if (totalSavedDice === 0) {
                // Začátek tahu - hodíme všemi 6 kostkami
                diceCount = 6;
            } else {
                // Hot dice - všech 6 kostek bylo odloženo, házíme znovu všemi
                diceCount = 6;
            }
            console.log(`🎯 Házím ${diceCount} novými kostkami`);
        }
        
        // Využití importované funkce
        const dice = rollDice(diceCount);
        
        // Spočítáme body z tohoto hodu
        const points = calculatePoints(dice);
        
        // Aktualizuje herní stav
        gameState.updateState({
            currentRoll: dice,
            selectedDice: []
        });
        
        console.log(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
        chatSystem.addSystemMessage(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
        
        // Zkontrolujeme FARKLE - když hod neobsahuje žádné bodující kostky
        if (!hasScoringDice(dice)) {
            const farkleMsg = '💥 FARKLE! Hod neobsahuje žádné bodující kostky! Přicházíte o všechny odložené body tohoto tahu!';
            console.warn(farkleMsg);
            chatSystem.addSystemMessage(farkleMsg, CHAT_COLORS.RED);
            
            // AI reakce na farkle
            this.triggerAiReactions('farkle', { dice, points: 0 });
            
            // Automaticky ukončíme tah s farkle
            setTimeout(() => {
                this.endTurn(true);
            }, 2000); // 2 sekundy na přečtení zprávy
            
        } else {
            const successMsg = `✅ Máte kostky na výběr! Označte platné kostky k odložení.`;
            console.log(successMsg);
            chatSystem.addSystemMessage(successMsg, CHAT_COLORS.GREEN);
            
            // AI reakce na úspěšný hod
            this.triggerAiReactions('roll', { dice, points });
        }
        
        // Překreslíme obrazovku
        this.renderGameScreen(gameState.getState());
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
        
        // Informace o vítězi - kompaktnější pro malé displeje s obrázkem
        const winnerInfo = document.createElement('div');
        winnerInfo.className = 'text-center mb-3 mb-md-4';
        winnerInfo.innerHTML = `
            <h2 class="fs-fluid-2 text-neon-${winner.color} mb-2">
                <img src="ai-icons/${winner.avatar}" alt="${winner.name}" class="rounded-circle me-1 me-sm-2" style="width: 40px; height: 40px; object-fit: cover;">
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

    /**
     * Odloží vybrané kostky - přesune je z aktuálního hodu do odložených
     */
    saveDice() {
        console.log('💾 saveDice() zavolána');
        const state = gameState.getState();
        console.log('📊 Aktuální stav:', {
            selectedDice: state.selectedDice,
            currentRoll: state.currentRoll,
            savedDice: state.savedDice
        });
        
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
        
        // VALIDACE: Zkontroluj, zda jsou kostky podle pravidel Farkle
        if (!isValidFarkleCombination(savedDiceValues)) {
            const warningMsg = '⚠️ NEPLATNÁ KOMBINACE! Můžete odložit pouze: jedničky, pětky nebo trojice a více stejných čísel (2,3,4,6).';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        // Spočítáme body z vybraných kostek
        const points = calculatePoints(savedDiceValues);
        
        // Aktualizujeme stav - přidáme odložené kostky a odstraníme vybrané z currentRoll
        const newSavedDice = [...(state.savedDice || []), ...savedDiceValues];
        const newSavedPoints = calculatePoints(newSavedDice);
        
        // Vytvoříme nový currentRoll bez vybraných kostek
        const remainingDice = state.currentRoll.filter((die, index) => !state.selectedDice.includes(index));
        
        console.log(`💾 Odkládám kostky: [${savedDiceValues.join(', ')}] = ${points} bodů`);
        console.log(`📊 Celkem odloženo: [${newSavedDice.join(', ')}] = ${newSavedPoints} bodů`);
        console.log(`🎲 Zbývající kostky k hodu: ${remainingDice.length}`);
        
        chatSystem.addSystemMessage(`💾 Odkládám kostky: [${savedDiceValues.join(', ')}] = ${points} bodů`);
        chatSystem.addSystemMessage(`📊 Celkem odloženo: [${newSavedDice.join(', ')}] = ${newSavedPoints} bodů`, CHAT_COLORS.BLUE);
        
        // Kontrola zda byly odloženy všechny kostky (6 nebo více)
        if (newSavedDice.length >= 6 && remainingDice.length === 0) {
            // ÚSPĚCH! Všech 6 kostek odloženo - HOT DICE!
            chatSystem.addSystemMessage(`🎯 SKVĚLÉ! Všech 6 kostek odloženo! Akumulované body: ${newSavedPoints}. Můžete hodit znovu všemi kostkami!`, CHAT_COLORS.GREEN);
            
            // HOT DICE - akumulujeme body a resetujeme kostky pro nový hod
            gameState.updateState({ 
                turnScore: (state.turnScore || 0) + newSavedPoints, // Akumulujeme body
                savedDice: [], // VYMAŽEME odložené kostky - hot dice reset
                selectedDice: [],
                currentRoll: [] // Prázdné pro umožnění nového hodu všemi kostkami
            });
        } else if (remainingDice.length > 0) {
            chatSystem.addSystemMessage(`🎲 Zbývá ${remainingDice.length} kostek k dalšímu hodu`, CHAT_COLORS.YELLOW);
            
            gameState.updateState({ 
                savedDice: newSavedDice,
                selectedDice: [],
                currentRoll: remainingDice
            });
        } else {
            chatSystem.addSystemMessage(`🎯 Všechny kostky odloženy! Můžete hodit všech 6 kostek znovu.`, CHAT_COLORS.GREEN);
            
            gameState.updateState({ 
                savedDice: newSavedDice,
                selectedDice: [],
                currentRoll: [] // Prázdné pole pro nový hod
            });
        }
        
        // AI reakce na odložení kostek
        this.triggerAiReactions('save', { savedCount: savedDiceValues.length, points: newSavedPoints });
        
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
     * @param {boolean} isFarkle - Pokud true, jedná se o farkle (žádné body se nepřidají)
     */
    endTurn(isFarkle = false) {
        const state = gameState.getState();
        
        // Kontrola, zda hráč má body k ukončení tahu (kromě farkle)
        if (!isFarkle && (!state.savedDice || state.savedDice.length === 0) && (!state.turnScore || state.turnScore === 0)) {
            const warningMsg = '⚠️ POZOR: Nemůžete ukončit tah bez odložených kostek nebo bodů! Nejdříve odložte bodující kostky.';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        console.log(isFarkle ? '💥 Ukončuji tah s FARKLE...' : '⏭️ Ukončuji tah...');
        
        const players = [...state.players];
        const currentPlayer = players[state.currentPlayerIndex];
        
        if (!currentPlayer) {
            console.error('❌ Aktuální hráč nenalezen');
            return;
        }
        
        let points = 0;
        let oldScore = currentPlayer.score;
        
        if (!isFarkle) {
            // Normální ukončení tahu - přidáme body z odložených kostek PLUS akumulované body z hot dice
            const savedDicePoints = calculatePoints(state.savedDice || []);
            const turnScorePoints = state.turnScore || 0;
            points = savedDicePoints + turnScorePoints;
            currentPlayer.score += points;
            
            console.log(`📊 Hráč ${currentPlayer.name}:`);
            console.log(`   • Odložené kostky: [${state.savedDice ? state.savedDice.join(', ') : 'žádné'}] = ${savedDicePoints} bodů`);
            console.log(`   • Hot dice body: ${turnScorePoints} bodů`);
            console.log(`   • Celkem získané body: ${points}`);
            console.log(`   • Skóre: ${oldScore} → ${currentPlayer.score}`);
            
            if (turnScorePoints > 0 && savedDicePoints > 0) {
                chatSystem.addSystemMessage(`📊 ${currentPlayer.name}: Odložené kostky [${state.savedDice.join(', ')}] = ${savedDicePoints} bodů + Hot dice ${turnScorePoints} bodů`);
            } else if (turnScorePoints > 0) {
                chatSystem.addSystemMessage(`📊 ${currentPlayer.name}: Hot dice body = ${turnScorePoints} bodů`);
            } else {
                chatSystem.addSystemMessage(`📊 ${currentPlayer.name}: Odložené kostky [${state.savedDice.join(', ')}] = ${savedDicePoints} bodů`);
            }
            chatSystem.addSystemMessage(`🎯 Skóre: ${oldScore} → ${currentPlayer.score}`, CHAT_COLORS.BLUE);
        } else {
            // FARKLE - žádné body se nepřidají
            console.log(`💥 FARKLE pro hráče ${currentPlayer.name} - žádné body!`);
            chatSystem.addSystemMessage(`💥 ${currentPlayer.name} má FARKLE - přichází o všechny body tohoto tahu!`, CHAT_COLORS.RED);
        }
        
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
        
        // AI reakce na ukončení tahu (pouze pokud nebyl farkle)
        if (!isFarkle) {
            this.triggerAiReactions('endTurn', { points });
        }
        
        gameState.updateState({
            players,
            currentPlayerIndex: nextPlayerIndex,
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0 // Reset turn score pro nového hráče
        });
        
        // Překreslíme obrazovku
        this.renderGameScreen(gameState.getState());
    }

    /**
     * Vyvolá AI reakce na herní událost
     * @param {string} eventType - Typ události ('roll', 'save', 'endTurn', 'farkle')
     * @param {Object} eventData - Data o události (dice, points, atd.)
     */
    triggerAiReactions(eventType, eventData = {}) {
        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        // Pouze pro lidského hráče
        if (!currentPlayer.isHuman) return;
        
        // Získáme AI hráče (všichni kromě aktuálního)
        const aiPlayers = state.players.filter(player => !player.isHuman);
        
        // Náhodně vybereme 1-2 AI pro reakci (ne všichni najednou)
        const reactingAI = aiPlayers
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.random() > 0.5 ? 1 : 2);
        
        // Reakce s prodlevou pro realističnost
        reactingAI.forEach((aiPlayer, index) => {
            setTimeout(() => {
                let reaction = '';
                
                switch (eventType) {
                    case 'roll':
                        if (eventData.points > 500) {
                            reaction = `Wow, ${eventData.points} bodů! To je skvělé!`;
                        } else if (eventData.points > 200) {
                            reaction = `Slušný hod, ${eventData.points} bodů.`;
                        } else {
                            reaction = `Hmm, jen ${eventData.points} bodů...`;
                        }
                        break;
                        
                    case 'farkle':
                        reaction = `Ha! FARKLE! To se stává i těm nejlepším.`;
                        break;
                        
                    case 'save':
                        reaction = `Chytrá volba! Odložit ${eventData.savedCount} kostek.`;
                        break;
                        
                    case 'endTurn':
                        reaction = `${eventData.points} bodů za tah? ${eventData.points > 1000 ? 'Výborně!' : 'Mohlo být lepší...'}`;
                        break;
                        
                    default:
                        reaction = 'Zajímavý tah!';
                }
                
                chatSystem.addAiMessage(aiPlayer.name, reaction);
            }, (index + 1) * 1000); // 1-2 sekundy prodleva mezi reakcemi
        });
    }
}

// Exportujeme třídu GameUI
export default GameUI;
// Force refresh Pá 11. července 2025, 18:21:25 CEST
