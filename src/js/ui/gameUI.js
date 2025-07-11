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
        
        // Pokud začíná AI hráč, spustíme jeho tah
        const currentPlayer = gameState.getState().players[0];
        if (!currentPlayer.isHuman) {
            setTimeout(() => {
                this.playAiTurn(currentPlayer);
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
            playerCard.className = `card bg-black border border-neon-${player.color} ${isCurrentPlayer ? 'border-3 player-active' : 'border-2'}`;
            playerCard.id = `player-card-${index}`; // ID pro animace
            
            // Responzivní obsah - responzivní avatary s Bootstrap
            playerCard.innerHTML = `
                <div class="card-body text-center p-1 p-sm-2">
                    <div class="mb-1 mb-sm-2 d-flex justify-content-center">
                        <img src="ai-icons/${player.avatar}" alt="${player.name}" 
                             class="player-avatar rounded-circle ${isCurrentPlayer ? 'player-avatar-active' : ''} img-fluid" 
                             style="width: min(12vw, 60px); height: min(12vw, 60px); max-width: 60px; max-height: 60px; object-fit: cover;">
                    </div>
                    <div class="text-neon-${player.color} small fw-bold mb-1 text-truncate">${player.name}</div>
                    <div class="text-neon-green" style="font-size: clamp(0.6rem, 1.5vw, 0.7rem);">Score:</div>
                    <div class="text-neon-green fw-bold" style="font-size: clamp(0.7rem, 2vw, 0.875rem);">${player.score}</div>
                    <div id="player-status-${index}" class="mt-1" style="min-height: 1rem; font-size: clamp(0.6rem, 1.5vw, 0.75rem);"></div>
                </div>
            `;
            
            playerCol.appendChild(playerCard);
            playersSection.appendChild(playerCol);
        });
        
        container.appendChild(playersSection);
        
        // Sekce s kostkami - odložené i aktuální v jedné řadě
        const diceSection = document.createElement('div');
        diceSection.className = 'text-center my-3';
        
        // Kontejner pro kostky - Bootstrap flexbox s garantovanou responzivitou
        const diceContainer = document.createElement('div');
        diceContainer.className = 'd-flex flex-wrap justify-content-center align-items-center dice-container-responsive';
        
        // Pokud jsou nějaké aktuální kostky, zobrazíme je VLEVO
        if (state.currentRoll && state.currentRoll.length > 0) {
            state.currentRoll.forEach((dieValue, index) => {
                const isSelected = state.selectedDice.includes(index);
                const diceEl = createDiceElement(
                    dieValue || '?', // Zobrazíme ? pro házející kostky
                    isSelected, 
                    state.isRolling ? null : () => this.toggleDiceSelection(index) // Zakážeme klik během házení
                );
                
                // Přidáme animaci házení, pokud je aktivní
                if (state.isRolling) {
                    diceEl.classList.add('dice-rolling');
                    // Zakážeme hover během házení
                    diceEl.style.pointerEvents = 'none';
                } else {
                    diceEl.classList.remove('dice-rolling');
                    diceEl.style.pointerEvents = 'auto';
                }
                
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
        
        // Tlačítko HODIT - dostupné pouze když:
        // 1. Na začátku tahu (žádné kostky na stole)
        // 2. Po odložení všech kostek (hot dice)
        const rollBtn = createNeonButton(
            'HODIT', 
            'green', 
            'bi-dice-6-fill',
            () => this.rollDice(),
            'btn-sm w-100'
        );
        
        // KONTROLA AI HRÁČE - blokujeme všechna tlačítka kromě MENU
        const isAiTurn = currentPlayer && currentPlayer.isAi;
        
        // Logika pro disable tlačítka HODIT:
        const hasSelectedDice = state.selectedDice && state.selectedDice.length > 0;
        const hasCurrentRoll = state.currentRoll && state.currentRoll.length > 0;
        const hasSavedDice = state.savedDice && state.savedDice.length > 0;
        
        // HODIT je povoleno když:
        // 1. Na začátku tahu (currentRoll je prázdné)
        // 2. Po odložení kostek - OPRAVENO: můžeme hodit se zbývajícími kostkami
        // 3. Vždy pokud není právě házení v progresu
        const canRoll = !state.isRolling;
        
        if (isAiTurn) {
            rollBtn.disabled = true;
            rollBtn.style.opacity = '0.3';
            rollBtn.title = 'AI hraje automaticky';
        } else if (!canRoll) {
            rollBtn.disabled = true;
            rollBtn.style.opacity = '0.5';
            rollBtn.title = 'Nejdříve odložte kostky nebo ukončete tah';
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
        
        // Disable tlačítko pokud nejsou vybrané kostky nebo je AI tah
        if (isAiTurn) {
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.3';
            saveBtn.title = 'AI hraje automaticky';
        } else if (!state.selectedDice || state.selectedDice.length === 0) {
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.5';
            saveBtn.title = 'Nejsou vybrané kostky';
        } else {
            saveBtn.disabled = false;
            saveBtn.style.opacity = '1';
            saveBtn.title = 'Odložit vybrané kostky';
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
        
        // Disable tlačítko pokud nemá žádné body k ukončení nebo je AI tah
        const hasTurnScore = state.turnScore && state.turnScore > 0;
        
        if (isAiTurn) {
            endTurnBtn.disabled = true;
            endTurnBtn.style.opacity = '0.3';
            endTurnBtn.title = 'AI hraje automaticky';
        } else if (!hasSavedDice && !hasTurnScore) {
            endTurnBtn.disabled = true;
            endTurnBtn.style.opacity = '0.5';
            endTurnBtn.title = 'Nejsou body k ukončení';
        } else {
            endTurnBtn.disabled = false;
            endTurnBtn.style.opacity = '1';
            endTurnBtn.title = 'Ukončit tah';
        }
        
        const endCol = document.createElement('div');
        endCol.className = 'col-6 mb-2'; // col-6 místo col-sm-6
        endCol.appendChild(endTurnBtn);
        buttonsContainer.appendChild(endCol);
        
        // Tlačítko MENU - vždy dostupné s potvrzením
        const menuBtn = createNeonButton(
            'MENU', 
            'red', 
            'bi-list', 
            () => this.showMenuWithConfirmation(),
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
            // Odznačování - vždy povoleno
            selectedDice = selectedDice.filter(i => i !== index);
            console.log('➖ Odebírám index', index, 'nové selectedDice:', selectedDice);
        } else {
            // Označování - kontrolujeme, zda kostka má platnou hodnotu
            const dieValue = state.currentRoll[index];
            
            // Kontrola, zda lze kostku odložit samostatně (1 nebo 5)
            if (dieValue === 1 || dieValue === 5) {
                selectedDice.push(index);
                console.log('➕ Přidávám platnou kostku', dieValue, 'index', index);
            } else {
                // Pro 2,3,4,6 - musíme zkontrolovat, zda existuje trojice/více této hodnoty
                const availableDice = state.currentRoll;
                const countOfValue = availableDice.filter(die => die === dieValue).length;
                
                if (countOfValue >= 3) {
                    // Existuje trojice této hodnoty - kostku lze označit
                    selectedDice.push(index);
                    console.log('➕ Přidávám kostku do trojice/více', dieValue, 'index', index, `(${countOfValue} kusů k dispozici)`);
                } else {
                    // Kostka nemůže být označena - není součástí trojice
                    const warningMsg = `⚠️ Kostka ${dieValue} nemůže být označena! Potřebujete alespoň 3 stejné kostky (máte jen ${countOfValue}).`;
                    console.warn(warningMsg);
                    chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
                    return; // Nepokračujeme v aktualizaci stavu
                }
            }
        }
        
        gameState.updateState({ selectedDice });
        console.log('✅ Stav aktualizován, renderuji...');
    }
    
    /**
     * Hodí kostky - s dynamickou animací změny čísel
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

        // Ukážeme animaci házeních kostek PŘED výsledkem
        gameState.updateState({
            currentRoll: Array(diceCount).fill(0), // Dočasně prázdné kostky
            selectedDice: [],
            isRolling: true // Flag pro animaci
        });
        
        // Překreslíme s animací házení
        this.renderGameScreen(gameState.getState());
        
        // Dynamická animace změny čísel během házení
        let animationCounter = 0;
        const animationInterval = setInterval(() => {
            animationCounter++;
            const randomDice = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
            
            // Aktualizujeme kostky s náhodnými čísly pro animaci
            gameState.updateState({
                currentRoll: randomDice,
                isRolling: true
            });
            this.renderGameScreen(gameState.getState());
            
            // Po 10 iteracích (2 sekundy) ukončíme animaci
            if (animationCounter >= 10) {
                clearInterval(animationInterval);
                
                // Po animaci ukážeme finální výsledek
                setTimeout(() => {
                    // Využití importované funkce pro finální hod
                    const dice = rollDice(diceCount);
                    
                    // Spočítáme body z tohoto hodu
                    const points = calculatePoints(dice);
                    
                    // Aktualizuje herní stav s výsledkem
                    gameState.updateState({
                        currentRoll: dice,
                        selectedDice: [],
                        isRolling: false
                    });
                    
                    console.log(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
                    chatSystem.addSystemMessage(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
                    
                    // Přidáme "dice-new" třídu pro spawn animaci
                    setTimeout(() => {
                        const diceElements = document.querySelectorAll('.dice:not(.saved)');
                        diceElements.forEach(el => {
                            el.classList.add('dice-new');
                            console.log('🎲 Přidávám spawn animaci');
                        });
                        
                        // Odstraníme třídu po animaci
                        setTimeout(() => {
                            diceElements.forEach(el => el.classList.remove('dice-new'));
                        }, 800);
                    }, 50); // Kratší zpoždění pro lepší synchronizaci
                    
                    // Zkontrolujeme FARKLE - když hod neobsahuje žádné bodující kostky
                    if (!hasScoringDice(dice)) {
                        const farkleMsg = '💥 FARKLE! Hod neobsahuje žádné bodující kostky! Přicházíte o všechny odložené body tohoto tahu!';
                        console.warn(farkleMsg);
                        chatSystem.addSystemMessage(farkleMsg, CHAT_COLORS.RED);
                        
                        // Přidáme farkle animaci ke kostkám
                        setTimeout(() => {
                            const diceElements = document.querySelectorAll('.dice:not(.saved)');
                            diceElements.forEach(el => el.classList.add('dice-farkle'));
                            
                            setTimeout(() => {
                                diceElements.forEach(el => el.classList.remove('dice-farkle'));
                            }, 1200);
                        }, 200);
                        
                        // Zobrazíme FARKLE pod hráčem
                        this.showPlayerFarkle();
                        
                        // AI reakce na farkle
                        this.triggerAiReactions('farkle', { dice, points: 0 });
                        
                        // Automaticky ukončíme tah s farkle okamžitě
                        setTimeout(() => {
                            this.endTurn(true);
                        }, 1500); // 1.5 sekundy na animaci
                        
                    } else {
                        const successMsg = `✅ Máte kostky na výběr! Označte platné kostky k odložení.`;
                        console.log(successMsg);
                        chatSystem.addSystemMessage(successMsg, CHAT_COLORS.GREEN);
                    }
                    
                    // Překreslíme obrazovku s výsledkem
                    this.renderGameScreen(gameState.getState());
                    
                }, 100); // Krátké zpoždění po animaci
            }
        }, 200); // Každých 200ms se změní čísla
    }

    
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
                <div class="modal-content bg-black border-3 border-neon-red" style="box-shadow: 0 0 2rem var(--neon-red);">
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
        
        // Přidáme animaci skórování k vybraným kostkám
        const selectedElements = document.querySelectorAll('.dice.selected');
        selectedElements.forEach(el => {
            el.classList.add('dice-scoring');
            setTimeout(() => {
                el.classList.remove('dice-scoring');
            }, 1500);
        });
        
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
        const hasSavedDice = state.savedDice && state.savedDice.length > 0;
        const hasTurnScore = state.turnScore && state.turnScore > 0;
        
        if (!isFarkle && !hasSavedDice && !hasTurnScore) {
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
            
            // KONTROLA MINIMÁLNÍHO SKÓRE: První zápis musí být min. 300 bodů
            if (currentPlayer.score === 0 && points < 300) {
                const warningMsg = `⚠️ POZOR: První zápis musí být minimálně 300 bodů! Máte jen ${points} bodů. Pokračujte v tahu nebo riskujte!`;
                console.warn(warningMsg);
                chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
                return;
            }
            
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
            
            // Animace skóre - zvýrazníme kartu hráče
            this.animatePlayerScore(state.currentPlayerIndex, points);
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
        
        // Pokud je další hráč AI, spustíme jeho automatický tah
        if (!nextPlayer.isHuman) {
            setTimeout(() => {
                this.playAiTurn(nextPlayer);
            }, 1500); // Krátká pauza pro realističnost
        }
    }

    /**
     * Vyvolá AI reakce na herní událost
     * @param {string} eventType - Typ události ('roll', 'save', 'endTurn', 'farkle')
     * @param {Object} eventData - Data o události (dice, points, atd.)
     */
    triggerAiReactions(eventType, eventData = {}) {
        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        // POUZE pro lidského hráče - AI nekomentuje své vlastní tahy
        if (!currentPlayer.isHuman) {
            console.log(`🤖 AI reakce přeskočeny - na tahu je AI hráč ${currentPlayer.name}`);
            return;
        }
        
        // Získáme AI hráče (všichni kromě aktuálního)
        const aiPlayers = state.players.filter(player => !player.isHuman);
        
        // Náhodně vybereme 1 AI pro reakci (ne všichni najednou)
        const reactingAI = aiPlayers
            .sort(() => Math.random() - 0.5)
            .slice(0, 1); // Jen jedna AI reaguje, aby to nebylo moc chaotické
        
        // Reakce s prodlevou pro realističnost
        reactingAI.forEach((aiPlayer, index) => {
            setTimeout(() => {
                let reaction = '';
                
                switch (eventType) {
                    case 'roll':
                        if (eventData.points > 500) {
                            reaction = `Wow, ${currentPlayer.name}! ${eventData.points} bodů! Skvělý hod! 🎯`;
                        } else if (eventData.points > 200) {
                            reaction = `Slušný hod, ${currentPlayer.name}! ${eventData.points} bodů není špatné! 👍`;
                        } else {
                            reaction = `Hmm, ${currentPlayer.name}, jen ${eventData.points} bodů... Zkus štěstí znovu! 🎲`;
                        }
                        break;
                        
                    case 'farkle':
                        reaction = `Ach ne, ${currentPlayer.name}! FARKLE! 💥 To se stává i těm nejlepším! 😅`;
                        break;
                        
                    case 'save':
                        if (eventData.savedCount >= 4) {
                            reaction = `Výborně, ${currentPlayer.name}! Odložit ${eventData.savedCount} kostek je chytrá volba! 🧠`;
                        } else {
                            reaction = `Dobře, ${currentPlayer.name}! Bezpečná hra s ${eventData.savedCount} kostkami! 💪`;
                        }
                        break;
                        
                    case 'endTurn':
                        if (eventData.points > 1000) {
                            reaction = `${currentPlayer.name}, ${eventData.points} bodů za tah?! To je úžasné! 🏆`;
                        } else if (eventData.points > 500) {
                            reaction = `Pěkných ${eventData.points} bodů, ${currentPlayer.name}! Solidní tah! ⭐`;
                        } else {
                            reaction = `${eventData.points} bodů, ${currentPlayer.name}... Příště to bude lepší! 💫`;
                        }
                        break;
                        
                    default:
                        reaction = `Zajímavý tah, ${currentPlayer.name}! 🎮`;
                }
                
                chatSystem.addAiMessage(aiPlayer.name, reaction);
            }, (index + 1) * 1000); // 1-2 sekundy prodleva mezi reakcemi
        });
    }
    
    /**
     * Hraje automatický tah za AI hráče
     * @param {Object} aiPlayer - AI hráč na tahu
     */
    async playAiTurn(aiPlayer) {
        console.log(`🤖 ${aiPlayer.name} hraje automaticky...`);
        chatSystem.addSystemMessage(`🤖 ${aiPlayer.name} přemýšlí...`, CHAT_COLORS.BLUE);
        
        const state = gameState.getState();
        
        // Pokud AI není na tahu, ukončíme
        if (state.players[state.currentPlayerIndex].name !== aiPlayer.name) {
            console.warn('⚠️ AI není na tahu!');
            return;
        }
        
        try {
            // Pokud nejsou kostky na stole, začneme hodem
            if (!state.currentRoll || state.currentRoll.length === 0) {
                await this.delay(1000);
                chatSystem.addAiMessage(aiPlayer.name, "Začínám tah! 🎲");
                this.rollDice();
                await this.delay(2000);
            }
            
            // AI rozhodování loop
            let attempts = 0;
            const maxAttempts = 10; // Ochrana proti nekonečné smyčce
            
            while (attempts < maxAttempts) {
                attempts++;
                const currentState = gameState.getState();
                
                // Kontrola, zda je AI stále na tahu
                if (currentState.players[currentState.currentPlayerIndex].name !== aiPlayer.name) {
                    break;
                }
                
                // Pokud není co odložit, může být farkle (už se zpracuje automaticky)
                if (!currentState.currentRoll || currentState.currentRoll.length === 0) {
                    break;
                }
                
                // AI rozhodování
                const decision = this.makeAiDecision(aiPlayer, currentState);
                
                if (decision.action === 'save') {
                    // AI označí kostky a pak je odloží
                    console.log(`🤖 AI ${aiPlayer.name} vybírá kostky:`, decision.diceToSave);
                    gameState.updateState({ selectedDice: decision.diceToSave });
                    await this.delay(500);
                    
                    const selectedValues = decision.diceToSave.map(i => currentState.currentRoll[i]);
                    chatSystem.addAiMessage(aiPlayer.name, `Odkládám kostky: [${selectedValues.join(', ')}] 💾`);
                    
                    this.saveDice();
                    await this.delay(1500);
                    
                } else if (decision.action === 'roll') {
                    // Házet znovu
                    chatSystem.addAiMessage(aiPlayer.name, "Zkusím štěstí znovu! 🎯");
                    await this.delay(1000);
                    this.rollDice();
                    await this.delay(2000);
                    
                } else if (decision.action === 'endTurn') {
                    // Pokusit se ukončit tah
                    const currentPoints = calculatePoints(currentState.savedDice || []) + (currentState.turnScore || 0);
                    
                    // Kontrola, zda AI může skutečně ukončit tah (má dost bodů)
                    if (aiPlayer.score === 0 && currentPoints < 300) {
                        // AI nemůže ukončit tah - pokračuj v hraní
                        console.log(`🤖 ${aiPlayer.name} nemůže ukončit tah s ${currentPoints} body, pokračuje...`);
                        chatSystem.addAiMessage(aiPlayer.name, `Nemám dost bodů (${currentPoints}/300), musím pokračovat! 💪`);
                        
                        // Zkusit házt znovu, pokud je to možné
                        if (currentState.currentRoll && currentState.currentRoll.length > 0 && 
                            (!currentState.selectedDice || currentState.selectedDice.length === 0)) {
                            await this.delay(1000);
                            this.rollDice();
                            await this.delay(2000);
                        } else if (hasScoringDice(currentState.currentRoll || [])) {
                            // Pokud jsou na stole bodující kostky, odlož je
                            const scoringDice = this.findBestScoringDice(currentState.currentRoll);
                            if (scoringDice.length > 0) {
                                gameState.updateState({ selectedDice: scoringDice });
                                await this.delay(500);
                                this.saveDice();
                                await this.delay(1500);
                            } else {
                                break; // Nemůže pokračovat
                            }
                        } else {
                            break; // Nemůže pokračovat
                        }
                    } else {
                        // AI může ukončit tah
                        chatSystem.addAiMessage(aiPlayer.name, `Ukončujem tah s ${currentPoints} body! ✨`);
                        await this.delay(1000);
                        this.endTurn();
                        break;
                    }
                }
            }
            
            if (attempts >= maxAttempts) {
                console.warn(`⚠️ AI ${aiPlayer.name} dosáhlo max pokusů, vynucuji ukončení tahu`);
                this.endTurn(true); // Vynucené ukončení jako farkle
            }
            
        } catch (error) {
            console.error('❌ Chyba v AI tahu:', error);
            chatSystem.addSystemMessage(`❌ Chyba v AI tahu pro ${aiPlayer.name}`, CHAT_COLORS.RED);
        }
    }
    
    /**
     * AI rozhodování o dalším tahu
     * @param {Object} aiPlayer - AI hráč
     * @param {Object} state - Aktuální herní stav
     * @returns {Object} Rozhodnutí AI
     */
    makeAiDecision(aiPlayer, state) {
        // Jednoduchá AI logika - odložit nejlepší kostky, pak rozhodnout
        const bestDice = this.findBestDiceToSave(state.currentRoll);
        
        if (bestDice.length === 0) {
            // Žádné kostky k odložení - farkle se zpracuje automaticky
            return { action: 'endTurn' };
        }
        
        // Spočítáme aktuální body v tahu
        const currentTurnPoints = calculatePoints(state.savedDice || []) + (state.turnScore || 0);
        const newPoints = calculatePoints(bestDice.map(i => state.currentRoll[i]));
        const totalPoints = currentTurnPoints + newPoints;
        
        // DŮLEŽITÉ: Pokud je to první zápis a nemáme dost bodů, MUSÍME pokračovat
        if (aiPlayer.score === 0 && totalPoints < 300) {
            // Nejdříve odložíme dostupné kostky
            if (bestDice.length > 0) {
                return { action: 'save', diceToSave: bestDice };
            } else {
                // Pokud nejsou kostky k odložení, musíme házet znovu (nebo bude farkle)
                return { action: 'roll' };
            }
        }
        
        // Pokud už máme 300+ bodů, můžeme uvažovat o ukončení
        if (totalPoints >= 300) {
            // Rozhodování podle strategie AI
            if (totalPoints >= 500 || Math.random() > 0.6) {
                return { action: 'endTurn' };
            } else {
                return { action: 'save', diceToSave: bestDice };
            }
        }
        
        // Máme méně než 300, ale už máme nějaké skóre - můžeme riskovat nebo pokračovat
        if (totalPoints >= 200 && Math.random() > 0.7) {
            return { action: 'endTurn' };
        } else {
            return { action: 'save', diceToSave: bestDice };
        }
    }
    
    /**
     * Najde nejlepší kostky k odložení
     * @param {Array} dice - Kostky na stole
     * @returns {Array} Indexy nejlepších kostek
     */
    findBestDiceToSave(dice) {
        const indices = [];
        
        // Najdeme všechny jedničky a pětky
        dice.forEach((value, index) => {
            if (value === 1 || value === 5) {
                indices.push(index);
            }
        });
        
        // Pokud nenašli jedničky/pětky, hledáme trojice
        if (indices.length === 0) {
            const counts = {};
            dice.forEach((value, index) => {
                if (!counts[value]) counts[value] = [];
                counts[value].push(index);
            });
            
            // Najdeme trojice nebo více
            for (const [value, valueIndices] of Object.entries(counts)) {
                if (valueIndices.length >= 3) {
                    indices.push(...valueIndices);
                    break; // Bereme jen jednu trojici
                }
            }
        }
        
        return indices;
    }
    
    /**
     * Pomocná funkce pro zpoždění
     * @param {number} ms - Milisekundy
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Animuje skóre hráče při získání bodů
     */
    animatePlayerScore(playerIndex, points) {
        const playerCard = document.getElementById(`player-card-${playerIndex}`);
        if (playerCard) {
            console.log(`🎯 Animuji skóre pro hráče ${playerIndex}: +${points} bodů`);
            playerCard.classList.add('score-animation');
            
            // Odstraníme animaci po dokončení
            setTimeout(() => {
                playerCard.classList.remove('score-animation');
            }, 1000);
        }
    }

    /**
     * Zobrazí FARKLE animaci u aktuálního hráče
     */
    showPlayerFarkle() {
        const state = gameState.getState();
        console.log('🔥 FARKLE! Hráč:', state.currentPlayerIndex);
        
        const playerCard = document.getElementById(`player-card-${state.currentPlayerIndex}`);
        
        console.log('🎯 Player card:', playerCard);
        
        if (playerCard) {
            // Přidáme FARKLE animaci na kartu
            playerCard.classList.add('player-card-farkle');
            console.log('✅ FARKLE animace přidána');
            
            // Vytvoříme červený šikmý FARKLE text overlay
            const farkleOverlay = document.createElement('div');
            farkleOverlay.className = 'farkle-text-overlay';
            farkleOverlay.textContent = 'FARKLE!';
            farkleOverlay.id = `farkle-overlay-${state.currentPlayerIndex}`;
            
            // Přidáme overlay do karty hráče
            playerCard.appendChild(farkleOverlay);
            console.log('✅ FARKLE červený šikmý text overlay přidán');
            
            // Odstraníme animaci a overlay po 3 sekundách
            setTimeout(() => {
                playerCard.classList.remove('player-card-farkle');
                const overlay = document.getElementById(`farkle-overlay-${state.currentPlayerIndex}`);
                if (overlay) {
                    overlay.remove();
                }
                console.log('🔄 FARKLE animace a overlay odstraněny');
            }, 3000);
        } else {
            console.error('❌ Nepodařilo se najít player card!');
        }
    }
}

// Exportujeme třídu GameUI
export default GameUI;
// Force refresh Pá 11. července 2025, 18:21:25 CEST
