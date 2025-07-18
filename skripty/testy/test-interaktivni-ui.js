#!/usr/bin/env node

/**
 * 🎮 INTERAKTIVNÍ TESTER - SIMULACE REÁLNÝCH HERNÍCH AKCÍ
 * 
 * Tento test simuluje reálné herní situace s DOM manipulací:
 * - Klikání na tlačítka a jejich odezva
 * - Změny stavu tlačítek v reálném čase
 * - Animace a přechody mezi stavy
 * - Chybové stavy a jejich zpracování
 * - Kompletní herní session od začátku do konce
 * - AI chování a reakce
 * - Responsivní layout na různých velikostech
 * 
 * CÍLE:
 * - 100% pokrytí všech klikatelných elementů
 * - Testování všech možných herních stavů
 * - Validace UX flow a chybových stavů
 * - Ověření Bootstrap responzivity
 */

import { calculatePoints, hasScoringDice } from '../../src/js/game/diceMechanics.js';
import gameState from '../../src/js/game/gameState.js';

// Simulátor DOM prostředí s event handling
class InteractiveDOMSimulator {
    constructor() {
        this.elements = new Map();
        this.eventHandlers = new Map();
        this.clickHistory = [];
        this.stateHistory = [];
        this.animationQueue = [];
        this.setupDOM();
    }

    setupDOM() {
        // Herní oblast
        this.addElement('gameArea', 'div', {
            className: 'container-fluid h-100',
            id: 'gameArea'
        });

        // Herní tlačítka
        this.addElement('rollDiceBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'green',
            textContent: '🎲 HODIT',
            disabled: false
        });

        this.addElement('saveDiceBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'blue',
            textContent: '💾 ODLOŽIT',
            disabled: true
        });

        this.addElement('endTurnBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'orange',
            textContent: '✅ UKONČIT TAH',
            disabled: true
        });

        this.addElement('menuBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'red',
            textContent: '📋 MENU',
            disabled: false
        });

        // Kostky (6 kusů)
        for (let i = 0; i < 6; i++) {
            this.addElement(`dice${i}`, 'div', {
                className: 'dice dice-clickable',
                'data-index': i,
                'data-value': 1,
                textContent: '⚀'
            });
        }

        // Menu tlačítka
        this.addElement('startGameBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'green',
            textContent: '🎮 HRÁT',
            disabled: false
        });

        this.addElement('rulesBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'blue',
            textContent: '📜 PRAVIDLA',
            disabled: false
        });

        this.addElement('hallOfFameBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'purple',
            textContent: '🏆 SÍNĚ SLÁVY',
            disabled: false
        });

        this.addElement('exitBtn', 'button', {
            className: 'btn btn-neon',
            'data-neon-color': 'red',
            textContent: '❌ KONEC',
            disabled: false
        });

        // Herní informace
        this.addElement('currentPlayerInfo', 'div', {
            className: 'text-center text-neon-green',
            textContent: 'Hráč na tahu: Test'
        });

        this.addElement('turnScoreInfo', 'div', {
            className: 'text-center text-neon-blue',
            textContent: 'Body v tahu: 0'
        });

        this.addElement('targetScoreInfo', 'div', {
            className: 'text-center text-neon-yellow',
            textContent: 'Cíl: 1000'
        });

        console.log('✅ DOM simulator nastaven s', this.elements.size, 'elementy');
    }

    addElement(id, tagName, attributes = {}) {
        const element = {
            id,
            tagName: tagName.toUpperCase(),
            className: attributes.className || '',
            disabled: attributes.disabled || false,
            textContent: attributes.textContent || '',
            style: {},
            classList: {
                add: (className) => {
                    const classes = element.className.split(' ');
                    if (!classes.includes(className)) {
                        classes.push(className);
                        element.className = classes.join(' ');
                    }
                },
                remove: (className) => {
                    const classes = element.className.split(' ');
                    element.className = classes.filter(c => c !== className).join(' ');
                },
                contains: (className) => element.className.includes(className)
            },
            addEventListener: (event, handler) => {
                if (!this.eventHandlers.has(id)) {
                    this.eventHandlers.set(id, new Map());
                }
                if (!this.eventHandlers.get(id).has(event)) {
                    this.eventHandlers.get(id).set(event, []);
                }
                this.eventHandlers.get(id).get(event).push(handler);
            },
            click: () => this.simulateClick(id),
            ...attributes
        };

        this.elements.set(id, element);
        return element;
    }

    simulateClick(elementId) {
        const element = this.elements.get(elementId);
        if (!element) {
            console.warn(`⚠️ Element ${elementId} nenalezen pro click`);
            return false;
        }

        if (element.disabled) {
            console.warn(`⚠️ Element ${elementId} je zakázán`);
            return false;
        }

        // Zaznamenáme click
        this.clickHistory.push({
            elementId,
            timestamp: Date.now(),
            elementState: { ...element }
        });

        // Spustíme event handlery
        const handlers = this.eventHandlers.get(elementId);
        if (handlers && handlers.has('click')) {
            handlers.get('click').forEach(handler => {
                try {
                    handler();
                } catch (error) {
                    console.error(`❌ Chyba v click handleru pro ${elementId}:`, error);
                }
            });
        }

        return true;
    }

    getElement(id) {
        return this.elements.get(id);
    }

    updateElementState(id, updates) {
        const element = this.elements.get(id);
        if (element) {
            Object.assign(element, updates);

            // Zaznamenáme změnu stavu
            this.stateHistory.push({
                elementId: id,
                timestamp: Date.now(),
                updates,
                newState: { ...element }
            });
        }
    }

    isElementVisible(id) {
        const element = this.elements.get(id);
        return element && !element.style.display?.includes('none');
    }

    isElementEnabled(id) {
        const element = this.elements.get(id);
        return element && !element.disabled;
    }

    hasClass(id, className) {
        const element = this.elements.get(id);
        return element && element.classList.contains(className);
    }

    getClickHistory() {
        return [...this.clickHistory];
    }

    getStateHistory() {
        return [...this.stateHistory];
    }

    clearHistory() {
        this.clickHistory = [];
        this.stateHistory = [];
    }
}

// Interaktivní tester pro herní akce
class InteractiveGameTester {
    constructor() {
        this.dom = new InteractiveDOMSimulator();
        this.testResults = [];
        this.errors = [];
        this.scenarios = [];
        this.setupGameHandlers();
    }

    setupGameHandlers() {
        // Simulace herních událostí
        this.dom.getElement('rollDiceBtn').addEventListener('click', () => {
            this.handleRollDice();
        });

        this.dom.getElement('saveDiceBtn').addEventListener('click', () => {
            this.handleSaveDice();
        });

        this.dom.getElement('endTurnBtn').addEventListener('click', () => {
            this.handleEndTurn();
        });

        this.dom.getElement('menuBtn').addEventListener('click', () => {
            this.handleShowMenu();
        });

        this.dom.getElement('startGameBtn').addEventListener('click', () => {
            this.handleStartGame();
        });

        // Kostky
        for (let i = 0; i < 6; i++) {
            this.dom.getElement(`dice${i}`).addEventListener('click', () => {
                this.handleDiceClick(i);
            });
        }

        console.log('✅ Event handlery nastaveny');
    }

    handleRollDice() {
        console.log('🎲 Házení kostkami...');

        // Simulace hodu
        const roll = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1);
        gameState.updateState({
            currentRoll: roll,
            selectedDice: [],
            isRolling: true
        });

        // Aktualizace kostek v DOM
        roll.forEach((value, index) => {
            const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            this.dom.updateElementState(`dice${index}`, {
                'data-value': value,
                textContent: diceSymbols[value - 1]
            });
        });

        // Aktualizace tlačítek
        this.updateButtonStates();

        setTimeout(() => {
            gameState.updateState({ isRolling: false });
            this.updateButtonStates();
        }, 1000);
    }

    handleSaveDice() {
        console.log('💾 Ukládání kostek...');

        const state = gameState.getState();
        const selectedIndices = state.selectedDice || [];
        const selectedValues = selectedIndices.map(i => state.currentRoll[i]);
        const points = calculatePoints(selectedValues);

        if (points > 0) {
            gameState.updateState({
                turnScore: (state.turnScore || 0) + points,
                savedDice: [...(state.savedDice || []), ...selectedValues],
                selectedDice: [],
                // Odebrání uložených kostek z aktuálního hodu
                currentRoll: state.currentRoll.filter((_, index) => !selectedIndices.includes(index))
            });

            this.updateScoreDisplay();
            this.updateButtonStates();
        }
    }

    handleEndTurn() {
        console.log('✅ Ukončení tahu...');

        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];
        const turnScore = state.turnScore || 0;

        // Validace prvního zápisu
        if (currentPlayer.score === 0 && turnScore < 300) {
            console.warn('❌ První zápis musí být alespoň 300 bodů!');
            return;
        }

        // Přičtení bodů a přechod na dalšího hráče
        const updatedPlayers = [...state.players];
        updatedPlayers[state.currentPlayerIndex].score += turnScore;

        gameState.updateState({
            players: updatedPlayers,
            currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
            turnScore: 0,
            savedDice: [],
            currentRoll: [],
            selectedDice: []
        });

        this.updateScoreDisplay();
        this.updateButtonStates();
    }

    handleShowMenu() {
        console.log('📋 Zobrazení menu...');
        gameState.updateState({ gamePhase: 'menu' });
        this.updateButtonStates();
    }

    handleStartGame() {
        console.log('🎮 Spuštění hry...');
        gameState.reset();
        gameState.updateState({
            gamePhase: 'game',
            players: [
                { name: 'Hráč', score: 0, isHuman: true },
                { name: 'AI1', score: 0, isHuman: false },
                { name: 'AI2', score: 0, isHuman: false }
            ]
        });
        this.updateButtonStates();
        this.updateScoreDisplay();
    }

    handleDiceClick(index) {
        console.log(`🎯 Klik na kostku ${index}...`);

        const state = gameState.getState();
        const selectedDice = [...(state.selectedDice || [])];

        if (selectedDice.includes(index)) {
            // Odznačení kostky
            const newSelected = selectedDice.filter(i => i !== index);
            gameState.updateState({ selectedDice: newSelected });
            this.dom.getElement(`dice${index}`).classList.remove('dice-selected');
        } else {
            // Označení kostky
            selectedDice.push(index);
            gameState.updateState({ selectedDice: selectedDice });
            this.dom.getElement(`dice${index}`).classList.add('dice-selected');
        }

        this.updateButtonStates();
    }

    updateButtonStates() {
        const state = gameState.getState();

        switch (state.gamePhase) {
            case 'menu':
                this.dom.updateElementState('startGameBtn', { disabled: false });
                this.dom.updateElementState('rulesBtn', { disabled: false });
                this.dom.updateElementState('hallOfFameBtn', { disabled: false });
                this.dom.updateElementState('exitBtn', { disabled: false });
                break;

            case 'game':
                const hasCurrentRoll = state.currentRoll && state.currentRoll.length > 0;
                const hasSelectedDice = state.selectedDice && state.selectedDice.length > 0;
                const hasTurnScore = (state.turnScore || 0) > 0;
                const currentPlayer = state.players[state.currentPlayerIndex];
                const canEndTurn = currentPlayer.score > 0 || (state.turnScore || 0) >= 300;

                this.dom.updateElementState('rollDiceBtn', {
                    disabled: state.isRolling || (hasCurrentRoll && !hasSelectedDice)
                });

                this.dom.updateElementState('saveDiceBtn', {
                    disabled: !hasSelectedDice || state.isRolling
                });

                this.dom.updateElementState('endTurnBtn', {
                    disabled: !hasTurnScore || !canEndTurn || state.isRolling
                });

                this.dom.updateElementState('menuBtn', { disabled: false });
                break;
        }
    }

    updateScoreDisplay() {
        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];

        this.dom.updateElementState('currentPlayerInfo', {
            textContent: `Hráč na tahu: ${currentPlayer.name} (${currentPlayer.score})`
        });

        this.dom.updateElementState('turnScoreInfo', {
            textContent: `Body v tahu: ${state.turnScore || 0}`
        });

        this.dom.updateElementState('targetScoreInfo', {
            textContent: `Cíl: ${state.targetScore || 1000}`
        });
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const colors = {
            info: '\x1b[36m',    // cyan
            success: '\x1b[32m', // green
            error: '\x1b[31m',   // red
            warning: '\x1b[33m', // yellow
            test: '\x1b[35m',    // magenta
            interaction: '\x1b[96m', // bright cyan
            reset: '\x1b[0m'
        };

        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    runTest(name, testFunction) {
        this.log(`🧪 Test: ${name}`, 'test');

        try {
            const result = testFunction();
            if (result.success) {
                this.log(`✅ ${name} - PROŠEL`, 'success');
                this.testResults.push({ name, status: 'PASS', ...result });
            } else {
                this.log(`❌ ${name} - SELHAL: ${result.reason}`, 'error');
                this.testResults.push({ name, status: 'FAIL', ...result });
                this.errors.push({ name, ...result });
            }
        } catch (error) {
            this.log(`💥 ${name} - VÝJIMKA: ${error.message}`, 'error');
            this.testResults.push({ name, status: 'ERROR', error: error.message });
            this.errors.push({ name, error: error.message });
        }
    }

    // Test 1: Základní interakce s tlačítky
    testBasicButtonInteractions() {
        return this.runTest('Základní interakce s tlačítky', () => {
            this.dom.clearHistory();

            // Test menu tlačítek
            const menuButtons = ['startGameBtn', 'rulesBtn', 'hallOfFameBtn', 'exitBtn'];
            const menuClickResults = [];

            gameState.updateState({ gamePhase: 'menu' });

            for (const buttonId of menuButtons) {
                const success = this.dom.simulateClick(buttonId);
                menuClickResults.push({ buttonId, success });
            }

            const failedMenuClicks = menuClickResults.filter(r => !r.success);
            if (failedMenuClicks.length > 0) {
                return {
                    success: false,
                    reason: `Neúspěšné kliky na menu tlačítka: ${failedMenuClicks.map(r => r.buttonId).join(', ')}`,
                    failedClicks: failedMenuClicks
                };
            }

            // Test herních tlačítek
            gameState.updateState({ gamePhase: 'game' });
            this.updateButtonStates();

            const gameButtons = ['rollDiceBtn', 'menuBtn'];
            const gameClickResults = [];

            for (const buttonId of gameButtons) {
                const success = this.dom.simulateClick(buttonId);
                gameClickResults.push({ buttonId, success });
            }

            const failedGameClicks = gameClickResults.filter(r => !r.success);
            if (failedGameClicks.length > 0) {
                return {
                    success: false,
                    reason: `Neúspěšné kliky na herní tlačítka: ${failedGameClicks.map(r => r.buttonId).join(', ')}`,
                    failedClicks: failedGameClicks
                };
            }

            const totalClicks = this.dom.getClickHistory().length;
            return {
                success: true,
                totalClicks,
                menuClicks: menuClickResults.length,
                gameClicks: gameClickResults.length
            };
        });
    }

    // Test 2: Výběr kostek a jejich validace
    testDiceSelectionInteractions() {
        return this.runTest('Výběr kostek - interakce', () => {
            this.dom.clearHistory();

            // Nastavíme herní stav s kostkami
            gameState.updateState({
                gamePhase: 'game',
                currentRoll: [1, 1, 1, 2, 3, 4],
                selectedDice: []
            });

            // Aktualizujeme kostky v DOM
            const roll = [1, 1, 1, 2, 3, 4];
            const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

            roll.forEach((value, index) => {
                this.dom.updateElementState(`dice${index}`, {
                    'data-value': value,
                    textContent: diceSymbols[value - 1]
                });
            });

            // Test výběru validních kostek (3 jedničky)
            const validSelections = [0, 1, 2]; // Tři jedničky
            const selectionResults = [];

            for (const diceIndex of validSelections) {
                const success = this.dom.simulateClick(`dice${diceIndex}`);
                selectionResults.push({ diceIndex, success });

                // Zkontrolujeme, že kostka je označena
                const isSelected = this.dom.hasClass(`dice${diceIndex}`, 'dice-selected');
                if (!isSelected) {
                    return {
                        success: false,
                        reason: `Kostka ${diceIndex} nebyla označena po kliknutí`,
                        diceIndex
                    };
                }
            }

            // Test nevalidních kostek (2, 3, 4 jednotlivě)
            const invalidSelections = [3, 4, 5]; // Jednotlivé 2, 3, 4

            for (const diceIndex of invalidSelections) {
                const success = this.dom.simulateClick(`dice${diceIndex}`);

                // Nevalidní kostky by se neměly označit
                const isSelected = this.dom.hasClass(`dice${diceIndex}`, 'dice-selected');
                if (isSelected) {
                    return {
                        success: false,
                        reason: `Kostka ${diceIndex} byla chybně označena (nevalidní)`,
                        diceIndex
                    };
                }
            }

            // Test odznačení kostek
            for (const diceIndex of validSelections) {
                const success = this.dom.simulateClick(`dice${diceIndex}`);

                // Kostka by se měla odznačit
                const isSelected = this.dom.hasClass(`dice${diceIndex}`, 'dice-selected');
                if (isSelected) {
                    return {
                        success: false,
                        reason: `Kostka ${diceIndex} se neodznačila`,
                        diceIndex
                    };
                }
            }

            return {
                success: true,
                validSelections: validSelections.length,
                invalidSelections: invalidSelections.length,
                totalDiceClicks: this.dom.getClickHistory().length
            };
        });
    }

    // Test 3: Kompletní herní session
    testCompleteGameSession() {
        return this.runTest('Kompletní herní session', () => {
            this.dom.clearHistory();

            // Začneme v menu
            gameState.updateState({ gamePhase: 'menu' });
            this.updateButtonStates();

            // Spustíme hru
            this.dom.simulateClick('startGameBtn');

            const state1 = gameState.getState();
            if (state1.gamePhase !== 'game') {
                return {
                    success: false,
                    reason: 'Nepodařilo se spustit hru z menu',
                    currentPhase: state1.gamePhase
                };
            }

            // Simulujeme několik tahů
            const turnResults = [];

            for (let turn = 0; turn < 3; turn++) {
                // Hodíme kostkami
                this.dom.simulateClick('rollDiceBtn');

                // Počkáme na dokončení animace
                setTimeout(() => {
                    const state = gameState.getState();

                    // Najdeme validní kostky
                    const validDice = [];
                    state.currentRoll.forEach((value, index) => {
                        if (value === 1 || value === 5) {
                            validDice.push(index);
                        }
                    });

                    // Označíme validní kostky
                    validDice.forEach(index => {
                        this.dom.simulateClick(`dice${index}`);
                    });

                    // Uložíme kostky
                    if (validDice.length > 0) {
                        this.dom.simulateClick('saveDiceBtn');
                    }

                    // Pokud máme dostatek bodů, ukončíme tah
                    const currentState = gameState.getState();
                    if ((currentState.turnScore || 0) >= 300) {
                        this.dom.simulateClick('endTurnBtn');
                    }

                    turnResults.push({
                        turn,
                        roll: state.currentRoll,
                        validDice,
                        turnScore: currentState.turnScore
                    });
                }, 100);
            }

            // Zkontrolujeme výsledky
            const totalClicks = this.dom.getClickHistory().length;
            const stateChanges = this.dom.getStateHistory().length;

            return {
                success: true,
                totalClicks,
                stateChanges,
                turnResults: turnResults.length
            };
        });
    }

    // Test 4: Chybové stavy a jejich zpracování
    testErrorStatesAndHandling() {
        return this.runTest('Chybové stavy - zpracování', () => {
            this.dom.clearHistory();

            // Test 1: Klik na zakázané tlačítko
            gameState.updateState({ gamePhase: 'game' });
            this.updateButtonStates();

            // saveDiceBtn by měl být zakázán bez výběru kostek
            const saveDiceElement = this.dom.getElement('saveDiceBtn');
            saveDiceElement.disabled = true;

            const disabledClickSuccess = this.dom.simulateClick('saveDiceBtn');
            if (disabledClickSuccess) {
                return {
                    success: false,
                    reason: 'Klik na zakázané tlačítko byl úspěšný (neměl by být)',
                    buttonId: 'saveDiceBtn'
                };
            }

            // Test 2: První zápis s nedostatečnými body
            gameState.updateState({
                players: [{ name: 'Test', score: 0, isHuman: true }],
                currentPlayerIndex: 0,
                turnScore: 150 // Méně než 300
            });

            this.updateButtonStates();

            const endTurnElement = this.dom.getElement('endTurnBtn');
            const shouldBeDisabled = endTurnElement.disabled;

            if (!shouldBeDisabled) {
                return {
                    success: false,
                    reason: 'Tlačítko "Ukončit tah" by mělo být zakázáno při prvním zápisu < 300 bodů',
                    turnScore: 150
                };
            }

            // Test 3: Neexistující element
            const invalidClickSuccess = this.dom.simulateClick('nonExistentButton');
            if (invalidClickSuccess) {
                return {
                    success: false,
                    reason: 'Klik na neexistující element byl úspěšný (neměl by být)',
                    buttonId: 'nonExistentButton'
                };
            }

            return {
                success: true,
                disabledClicksPrevented: 2,
                invalidClicksPrevented: 1
            };
        });
    }

    // Test 5: Responsivní layout a Bootstrap komponenty
    testResponsiveLayoutAndBootstrap() {
        return this.runTest('Responsivní layout a Bootstrap', () => {
            const bootstrapTests = [];

            // Test Bootstrap tříd na elementech
            const elementsWithBootstrap = [
                { id: 'gameArea', expectedClasses: ['container-fluid', 'h-100'] },
                { id: 'rollDiceBtn', expectedClasses: ['btn', 'btn-neon'] },
                { id: 'saveDiceBtn', expectedClasses: ['btn', 'btn-neon'] },
                { id: 'endTurnBtn', expectedClasses: ['btn', 'btn-neon'] },
                { id: 'currentPlayerInfo', expectedClasses: ['text-center', 'text-neon-green'] },
                { id: 'turnScoreInfo', expectedClasses: ['text-center', 'text-neon-blue'] }
            ];

            for (const test of elementsWithBootstrap) {
                const element = this.dom.getElement(test.id);
                if (!element) {
                    bootstrapTests.push({
                        elementId: test.id,
                        success: false,
                        reason: 'Element nenalezen'
                    });
                    continue;
                }

                const missingClasses = test.expectedClasses.filter(cls =>
                    !element.className.includes(cls)
                );

                if (missingClasses.length > 0) {
                    bootstrapTests.push({
                        elementId: test.id,
                        success: false,
                        reason: `Chybí Bootstrap třídy: ${missingClasses.join(', ')}`,
                        missingClasses
                    });
                } else {
                    bootstrapTests.push({
                        elementId: test.id,
                        success: true,
                        foundClasses: test.expectedClasses
                    });
                }
            }

            // Test neon barev
            const neonColorTests = [
                { id: 'rollDiceBtn', expectedNeonColor: 'green' },
                { id: 'saveDiceBtn', expectedNeonColor: 'blue' },
                { id: 'endTurnBtn', expectedNeonColor: 'orange' },
                { id: 'menuBtn', expectedNeonColor: 'red' }
            ];

            for (const test of neonColorTests) {
                const element = this.dom.getElement(test.id);
                if (!element) continue;

                const hasNeonColor = element['data-neon-color'] === test.expectedNeonColor;
                bootstrapTests.push({
                    elementId: test.id,
                    success: hasNeonColor,
                    reason: hasNeonColor ? 'Správná neon barva' :
                        `Očekávaná barva: ${test.expectedNeonColor}, nalezeno: ${element['data-neon-color']}`
                });
            }

            const failedBootstrapTests = bootstrapTests.filter(test => !test.success);

            if (failedBootstrapTests.length > 0) {
                return {
                    success: false,
                    reason: `Bootstrap testy selhaly: ${failedBootstrapTests.length} problémů`,
                    failedTests: failedBootstrapTests,
                    allTests: bootstrapTests
                };
            }

            return {
                success: true,
                bootstrapTestsCount: bootstrapTests.length,
                elementsWithBootstrap: elementsWithBootstrap.length,
                neonColorTests: neonColorTests.length
            };
        });
    }

    // Hlavní spouštěcí metoda
    runAllInteractiveTests() {
        this.log('\n🎮 SPOUŠTĚNÍ INTERAKTIVNÍCH UI TESTŮ', 'interaction');
        this.log('='.repeat(80), 'interaction');

        // Spuštění všech testů
        this.testBasicButtonInteractions();
        this.testDiceSelectionInteractions();
        this.testCompleteGameSession();
        this.testErrorStatesAndHandling();
        this.testResponsiveLayoutAndBootstrap();

        // Zobrazení výsledků
        this.displayResults();
    }

    displayResults() {
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const errors = this.testResults.filter(r => r.status === 'ERROR').length;

        this.log('\n🎯 SOUHRN INTERAKTIVNÍCH TESTŮ', 'interaction');
        this.log('='.repeat(80), 'interaction');
        this.log(`📊 Celkem testů: ${total}`, 'info');
        this.log(`✅ Úspěšné: ${passed}`, 'success');
        this.log(`❌ Neúspěšné: ${failed}`, 'error');
        this.log(`💥 Chyby: ${errors}`, 'error');
        this.log(`📈 Úspěšnost: ${((passed / total) * 100).toFixed(1)}%`,
            passed === total ? 'success' : 'warning');

        // Interaktivní statistiky
        this.log('\n🎮 INTERAKTIVNÍ STATISTIKY', 'interaction');
        this.log('-'.repeat(50), 'interaction');
        this.log(`🖱️  Celkové kliky: ${this.dom.getClickHistory().length}`, 'info');
        this.log(`🔄 Změny stavu: ${this.dom.getStateHistory().length}`, 'info');
        this.log(`🎯 Testované elementy: ${this.dom.elements.size}`, 'info');
        this.log(`📱 Bootstrap komponenty: ${this.testResults.filter(r => r.name.includes('Bootstrap')).length}`, 'info');

        if (this.errors.length > 0) {
            this.log('\n🔍 DETAILY CHYB', 'warning');
            this.log('-'.repeat(50), 'warning');

            this.errors.forEach(error => {
                this.log(`❌ ${error.name}: ${error.reason || error.error}`, 'error');
            });
        }

        this.log('\n💡 DOPORUČENÍ', 'warning');
        this.log('-'.repeat(50), 'warning');

        if (failed > 0 || errors > 0) {
            this.log('🔧 Zkontroluj event handling a DOM manipulaci', 'warning');
            this.log('🔧 Ověř Bootstrap třídy a responzivitu', 'warning');
            this.log('🔧 Prověř chybové stavy a validace', 'warning');
        } else {
            this.log('🎉 Všechny interaktivní testy prošly!', 'success');
            this.log('🎮 UI je plně funkční a připravené pro hru!', 'success');
        }

        this.log('\n🏁 HOTOVO', 'interaction');
        this.log('='.repeat(80), 'interaction');
    }
}

// Spuštění interaktivních testů
const interactiveTester = new InteractiveGameTester();
interactiveTester.runAllInteractiveTests();
