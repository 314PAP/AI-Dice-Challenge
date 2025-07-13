/**
 * SEZNAM POUŽÍVANÝCH CSS TŘÍD:
 * Bootstrap: btn, btn-outline-success, btn-outline-danger, col-auto, d-flex, flex-column, justify-content-center, align-items-center, text-center, mb-2, mb-3, position-relative, fs-6, fw-bold, rounded-3, border-2, p-3, mx-auto, w-100
 * Neon třídy: text-neon-green, text-        const hasTurnScore = state.turnScore && state.turnScore > 0;
        
        if (isAiTurn) {
            endTurnBtn.disabled = true;
            endTurnBtn.style.opacity = '0.3';
            endTurnBtn.title = 'AI hraje automaticky';
        } else if (!savedDiceCount || !hasTurnScore) {e, text-neon-purple, text-neon-orange, text-neon-red, text-neon-yellow, border-neon-green, border-neon-blue, border-neon-purple, border-neon-orange, border-neon-red, border-neon-yellow, bg-neon-black
 * Vlastní: btn-neon, dice-area, dice-item, dice-selected, player-avatar, player-farkle-pulse, dice-rolling
 */

/**
 * SEZNAM PROMĚNNÝCH (lokální v metodách):
 * currentPlayer, container, playersSection, finalRoundAlert, isCurrentPlayer, isLeader, playerCol, cardClasses, playerCard, statusContent,
 * diceSection, diceContainer, isSelected, diceEl, infoText, actionButtons, buttonsContainer, isAiTurn, hasSelectedDice, hasCurrentRoll,
 * savedDiceCount, remainingDiceCount, canRoll, rollBtn, rollCol, saveBtn, saveCol, endTurnBtn, hasSavedDice, hasTurnScore, endCol, menuBtn, menuCol
 * 
 * MOŽNÉ DUPLICITY: 
 * - hasSavedDice (používá se v renderActionButtons - zkontrolovat)
 * - container (používá se v renderGameScreen a createErrorContainer)
 */

/**
 * Game Renderer - Vykreslování herní obrazovky
 * Oddělen od GameUI pro lepší modularitu
 */

import { createNeonButton, createDiceElement, createNeonCard } from './uiComponents.js';
import { CONSOLE_COLORS } from '../utils/colors.js';

export class GameRenderer {
    /**
     * Vykreslí herní obrazovku
     * @param {Object} state - Aktuální herní stav
     * @param {Function} toggleDiceSelection - Callback pro výběr kostek
     * @param {Function} rollDice - Callback pro házení
     * @param {Function} saveDice - Callback pro odložení
     * @param {Function} endTurn - Callback pro ukončení tahu
     * @param {Function} showMenuWithConfirmation - Callback pro menu
     * @returns {HTMLElement} Vytvořený herní kontejner
     */
    renderGameScreen(state, callbacks = {}) {
        console.log('🎮 GameRenderer: Vykresluje se herní obrazovka:', state);
        
        if (!state.players || state.players.length === 0) {
            console.error('❌ Žádní hráči v herním stavu!');
            return this.createErrorContainer('Žádní hráči');
        }
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (!currentPlayer) {
            console.error('❌ Aktuální hráč nenalezen! Index:', state.currentPlayerIndex);
            return this.createErrorContainer('Aktuální hráč nenalezen');
        }
        
        console.log('👤 Aktuální hráč:', currentPlayer);
        
        const container = document.createElement('div');
        container.className = 'container-fluid h-100 d-flex flex-column p-1 p-md-2';
        // ODSTRANĚNO: Omezující inline styly - CSS řeší responsive-bootstrap.css
        
        // 1. Responzivní karty hráčů
        container.appendChild(this.renderPlayersSection(state));
        
        // 2. Sekce s kostkami
        container.appendChild(this.renderDiceSection(state, callbacks.toggleDiceSelection));
        
        // 3. Akční tlačítka
        container.appendChild(this.renderButtonsSection(state, currentPlayer, callbacks));
        
        return container;
    }

    /**
     * Vykreslí sekci s kartami hráčů
     */
    renderPlayersSection(state) {
        const playersSection = document.createElement('div');
        playersSection.className = 'row g-1 g-md-2 mb-1 flex-shrink-0';
        playersSection.style.minHeight = '0';
        playersSection.style.marginBottom = 'clamp(0.25rem, 1vw, 0.5rem)'; // Menší responzivní mezera
        
        // Přidáme informaci o finálním kole nad karty hráčů
        if (state.finalRound) {
            const finalRoundAlert = document.createElement('div');
            finalRoundAlert.className = 'col-12 mb-1';
            finalRoundAlert.innerHTML = `
                <div class="alert border border-neon-orange text-neon-orange text-center py-1 bg-transparent final-round-alert">
                    <strong>🚨 FINÁLNÍ KOLO</strong> - ${state.finalRoundLeader} dosáhl cíle!
                </div>
            `;
            playersSection.appendChild(finalRoundAlert);
        }
        
        state.players.forEach((player, index) => {
            const isCurrentPlayer = index === state.currentPlayerIndex;
            const isLeader = state.finalRound && player.name === state.finalRoundLeader;
            
            // Avatary PŘÍSNĚ v Bootstrap grid - col-3 (4 sloupce), bez overflow
            const playerCol = document.createElement('div');
            playerCol.className = 'col-3';
            playerCol.style.minWidth = '0'; // Bootstrap fix pro overflow
            
            // Čistá karta hráče s neonovým rámečkem podle barvy
            let cardClasses = `card bg-black border border-neon-${player.color} h-100 ${isCurrentPlayer ? 'border-3 player-active' : 'border-2'}`;
            if (isLeader) {
                cardClasses += ' border-neon-orange border-3'; // Leader má oranžový rámeček
            }
            
            const playerCard = document.createElement('div');
            playerCard.className = cardClasses;
            playerCard.id = `player-card-${index}`; // ID pro animace
            
            // Status pro finální kolo nebo FARKLE
            let statusContent = '';
            if (player.hasFarkle) {
                statusContent = '<div class="text-neon-red fw-bold player-farkle-pulse small">💥 FARKLE!</div>';
            } else if (state.finalRound) {
                if (isLeader) {
                    statusContent = '<div class="text-neon-orange fw-bold small">👑 LEADER</div>';
                } else {
                    statusContent = '<div class="text-neon-yellow small">Last chance!</div>';
                }
            }
            
            // Responzivní obsah - kompaktní layout pro malé obrazovky
            playerCard.innerHTML = `
                <div class="card-body text-center p-1">
                    <div class="mb-1 d-flex justify-content-center">
                        <img src="ai-icons/${player.avatar}" alt="${player.name}" 
                             class="player-avatar rounded-circle ${isCurrentPlayer ? 'player-avatar-active' : ''} img-fluid">
                    </div>
                    <div class="text-neon-${player.color} small fw-bold mb-1 text-truncate">${player.name}</div>
                    <div class="text-neon-green small">Score:</div>
                    <div class="text-neon-green fw-bold">${player.score}</div>
                    <div id="player-status-${index}" class="mt-1 small min-h-0">${statusContent}</div>
                </div>
            `;
            
            playerCol.appendChild(playerCard);
            playersSection.appendChild(playerCol);
        });
        
        return playersSection;
    }

    /**
     * Vykreslí sekci s kostkami
     */
    renderDiceSection(state, toggleDiceCallback) {
        const diceSection = document.createElement('div');
        diceSection.className = 'flex-grow-1 d-flex align-items-center justify-content-center dice-section';
        // ODSTRANĚNO: Veškeré inline styly - CSS řeší responsive-bootstrap.css
        
        // Kontejner pro kostky - POUZE CSS třídy, žádné inline styly
        const diceContainer = document.createElement('div');
        diceContainer.className = 'd-flex justify-content-center align-items-center gap-1 dice-container';
        // ODSTRANĚNO: Veškeré inline styly - CSS řeší responsive-bootstrap.css
        
        // Pokud jsou nějaké aktuální kostky, zobrazíme je VLEVO
        if (state.currentRoll && state.currentRoll.length > 0) {
            state.currentRoll.forEach((dieValue, index) => {
                const isSelected = state.selectedDice.includes(index);
                const diceEl = createDiceElement(
                    dieValue || '?', // Zobrazíme ? pro házející kostky
                    isSelected, 
                    state.isRolling ? null : () => toggleDiceCallback(index)
                );
                
                // Přidáme animaci házení, pokud je aktivní
                if (state.isRolling) {
                    diceEl.classList.add('dice-rolling');
                    // ODSTRANĚNO: inline style - CSS řeší přes .dice-rolling
                } else {
                    diceEl.classList.remove('dice-rolling');
                    // ODSTRANĚNO: inline style - CSS řeší přes .dice
                }
                
                diceContainer.appendChild(diceEl);
            });
        }
        
        // Potom zobrazíme odložené kostky (modré, vpravo)
        if (state.savedDice && state.savedDice.length > 0) {
            state.savedDice.forEach(dieValue => {
                const diceEl = createDiceElement(dieValue, false, null);
                diceEl.classList.add('saved');
                // ODSTRANĚNO: inline style filter - CSS řeší přes .dice.saved
                diceContainer.appendChild(diceEl);
            });
        }
        
        // Pokud nejsou žádné kostky
        if ((!state.currentRoll || state.currentRoll.length === 0) && (!state.savedDice || state.savedDice.length === 0)) {
            const infoText = document.createElement('div');
            // OPRAVENO: Responzivní velikost textu - malý na mobilu, větší na desktopu
            infoText.className = 'text-neon-yellow small fs-md-6';
            infoText.innerHTML = '<i class="bi bi-dice-6"></i> Stiskněte HODIT pro začátek';
            diceContainer.appendChild(infoText);
        }
        
        diceSection.appendChild(diceContainer);
        return diceSection;
    }

    /**
     * Vykreslí sekci s tlačítky
     */
    renderButtonsSection(state, currentPlayer, callbacks) {
        const actionButtons = document.createElement('div');
        actionButtons.className = 'mt-1 mb-1 flex-shrink-0';
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'row g-2 px-0 mx-0';
        
        const isAiTurn = currentPlayer && !currentPlayer.isHuman;
        
        // OPRAVENÁ LOGIKA HÁZENÍ - hráč musí odložit vybrané kostky před dalším hodem
        const hasSelectedDice = state.selectedDice && state.selectedDice.length > 0;
        const hasCurrentRoll = state.currentRoll && state.currentRoll.length > 0;
        const savedDiceCount = state.savedDice?.length || 0;
        
        // Můžeme hodit pouze pokud:
        // 1. Není animace házení  
        // 2. NEMÁME vybrané kostky (musí je odložit)
        // 3. Buď nemáme kostky na stole (začátek) NEBO máme odložené kostky a zbývají kostky k hodu
        const remainingDiceCount = 6 - savedDiceCount;
        const canRoll = !state.isRolling && 
                       !hasSelectedDice && 
                       (!hasCurrentRoll || (savedDiceCount > 0 && remainingDiceCount > 0));
        
        console.log(`🎲 GameRenderer: canRoll=${canRoll} (isRolling=${state.isRolling}, hasSelected=${hasSelectedDice}, hasCurrentRoll=${hasCurrentRoll}, savedDice=${savedDiceCount}, remaining=${remainingDiceCount})`);
        
        
        // 1. Tlačítko HODIT
        const rollBtn = createNeonButton(
            'HODIT', 
            'green', 
            'bi-dice-6-fill',
            () => {
                console.log(`🎯 TLAČÍTKO HODIT stisknuto! canRoll=${canRoll}`);
                if (callbacks.rollDice) callbacks.rollDice();
            },
            'btn-sm w-100'
        );
        
        if (isAiTurn) {
            rollBtn.disabled = true;
            rollBtn.classList.add('disabled', 'opacity-50');
            rollBtn.title = 'AI hraje automaticky';
            console.log(`🤖 TLAČÍTKO HODIT zakázáno - AI tah`);
        } else if (!canRoll) {
            rollBtn.disabled = true;
            rollBtn.classList.add('disabled', 'opacity-50');
            if (state.isRolling) {
                rollBtn.title = 'Probíhá házení...';
            } else if (state.selectedDice && state.selectedDice.length > 0) {
                rollBtn.title = 'Nejprve odložte vybrané kostky';
            } else {
                rollBtn.title = 'Nelze hodit';
            }
            console.log(`❌ TLAČÍTKO HODIT zakázáno - canRoll=false (${rollBtn.title})`);
        } else {
            rollBtn.disabled = false;
            rollBtn.classList.remove('disabled', 'opacity-50');
            rollBtn.title = 'Hodit kostkami';
            console.log(`✅ TLAČÍTKO HODIT povoleno - canRoll=true`);
        }
        
        const rollCol = document.createElement('div');
        rollCol.className = 'col-6 mb-1 px-1';
        rollCol.appendChild(rollBtn);
        buttonsContainer.appendChild(rollCol);
        
        // 2. Tlačítko ODLOŽIT
        const saveBtn = createNeonButton(
            'ODLOŽIT', 
            'blue', 
            'bi-floppy-fill',
            () => {
                console.log(`💾 TLAČÍTKO ODLOŽIT stisknuto! selectedDice=${state.selectedDice?.length || 0}`);
                if (callbacks.saveDice) callbacks.saveDice();
            },
            'btn-sm w-100'
        );
        
        if (isAiTurn) {
            saveBtn.disabled = true;
            saveBtn.classList.add('disabled', 'opacity-50');
            saveBtn.title = 'AI hraje automaticky';
            console.log(`🤖 TLAČÍTKO ODLOŽIT zakázáno - AI tah`);
        } else if (!state.selectedDice || state.selectedDice.length === 0) {
            saveBtn.disabled = true;
            saveBtn.classList.add('disabled', 'opacity-50');
            saveBtn.title = 'Nejsou vybrané kostky';
            console.log(`❌ TLAČÍTKO ODLOŽIT zakázáno - žádné vybrané kostky`);
        } else {
            saveBtn.disabled = false;
            saveBtn.classList.remove('disabled', 'opacity-50');
            saveBtn.title = 'Odložit vybrané kostky';
            console.log(`✅ TLAČÍTKO ODLOŽIT povoleno - ${state.selectedDice.length} kostek vybráno`);
        }
        
        const saveCol = document.createElement('div');
        saveCol.className = 'col-6 mb-1 px-1';
        saveCol.appendChild(saveBtn);
        buttonsContainer.appendChild(saveCol);
        
        // 3. Tlačítko UKONČIT TAH
        const endTurnBtn = createNeonButton(
            'UKONČIT TAH', 
            'orange', 
            'bi-skip-forward-fill',
            callbacks.endTurn,
            'btn-sm w-100'
        );
        
        const hasSavedDice = state.savedDice && state.savedDice.length > 0;
        const hasTurnScore = state.turnScore && state.turnScore > 0;
        
        if (isAiTurn) {
            endTurnBtn.disabled = true;
            endTurnBtn.classList.add('disabled', 'opacity-50');
            endTurnBtn.title = 'AI hraje automaticky';
        } else if (!hasSavedDice && !hasTurnScore) {
            endTurnBtn.disabled = true;
            endTurnBtn.classList.add('disabled', 'opacity-50');
            endTurnBtn.title = 'Nejsou body k ukončení';
        } else {
            endTurnBtn.disabled = false;
            endTurnBtn.classList.remove('disabled', 'opacity-50');
            endTurnBtn.title = 'Ukončit tah';
        }
        
        const endCol = document.createElement('div');
        endCol.className = 'col-6 mb-1 px-1';
        endCol.appendChild(endTurnBtn);
        buttonsContainer.appendChild(endCol);
        
        // 4. Tlačítko MENU
        const menuBtn = createNeonButton(
            'MENU', 
            'red', 
            'bi-list', 
            callbacks.showMenuWithConfirmation,
            'btn-sm w-100'
        );
        
        const menuCol = document.createElement('div');
        menuCol.className = 'col-6 mb-1 px-1';
        menuCol.appendChild(menuBtn);
        buttonsContainer.appendChild(menuCol);
        
        actionButtons.appendChild(buttonsContainer);
        return actionButtons;
    }

    /**
     * Vytvoří error kontejner
     */
    createErrorContainer(message) {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column justify-content-center align-items-center h-100';
        container.innerHTML = `
            <div class="text-neon-red fs-4 mb-3">
                <i class="bi bi-exclamation-triangle-fill"></i> ${message}
            </div>
        `;
        return container;
    }
}
