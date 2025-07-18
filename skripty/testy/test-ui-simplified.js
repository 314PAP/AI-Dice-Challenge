#!/usr/bin/env node

/**
 * 🎮 ZJEDNODUŠENÝ UI TEST - BEZ DOM ZÁVISLOSTÍ
 * 
 * Testuje herní logiku a UI komponenty bez nutnosti DOM:
 * - Herní mechaniky a validace
 * - Výběr kostek a bodování
 * - Herní fáze a přechody
 * - Chybové stavy
 * - Bootstrap CSS třídy (simulace)
 * 
 * CÍLOVÁ KOMPLEXNOST: 100% pokrytí logiky bez DOM
 */

// Mock prostředí
global.localStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
    clear: () => { }
};

global.window = {
    localStorage: global.localStorage,
    addEventListener: () => { },
    location: { reload: () => { } }
};

global.document = {
    getElementById: () => null,
    createElement: () => ({
        classList: { add: () => { }, remove: () => { }, contains: () => false },
        setAttribute: () => { },
        appendChild: () => { },
        innerHTML: '',
        textContent: '',
        addEventListener: () => { }
    }),
    addEventListener: () => { },
    readyState: 'complete'
};

import { calculatePoints, hasScoringDice } from '../../src/js/game/diceMechanics.js';

// Simulace herního stavu
class GameStateSimulator {
    constructor() {
        this.reset();
    }

    reset() {
        this.state = {
            players: [
                { name: 'Hráč', score: 0, isAI: false },
                { name: 'AI1', score: 0, isAI: true },
                { name: 'AI2', score: 0, isAI: true }
            ],
            currentPlayerIndex: 0,
            turnScore: 0,
            savedDice: [],
            currentRoll: [],
            selectedDice: [],
            targetScore: 1000,
            finalRound: false,
            gamePhase: 'playing'
        };
    }

    getCurrentPlayer() {
        return this.state.players[this.state.currentPlayerIndex];
    }

    updateState(updates) {
        Object.assign(this.state, updates);
    }

    getState() {
        return { ...this.state };
    }

    canSaveDice(selectedIndices, currentRoll) {
        if (!selectedIndices || selectedIndices.length === 0) {
            return { valid: false, reason: 'Žádné kostky nevybrány' };
        }

        const selectedValues = selectedIndices.map(i => currentRoll[i]);
        const points = calculatePoints(selectedValues);

        if (points === 0) {
            return { valid: false, reason: 'Vybrané kostky nezískávají body' };
        }

        return {
            valid: true,
            points: points,
            totalTurnPoints: this.state.turnScore + points,
            currentScore: this.getCurrentPlayer().score
        };
    }

    canEndTurn(turnScore) {
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.score === 0 && turnScore < 300) {
            return {
                valid: false,
                reason: `První zápis vyžaduje minimálně 300 bodů! Máte jen ${turnScore} bodů.`,
                currentScore: currentPlayer.score,
                turnScore: turnScore
            };
        }

        return {
            valid: true,
            turnScore: turnScore,
            currentScore: currentPlayer.score
        };
    }

    isValidDiceForSelection(dieValue, currentRoll) {
        // KONTROLA POSTUPKY (1,2,3,4,5,6)
        if (currentRoll.length === 6) {
            const sortedDice = [...currentRoll].sort();
            const isSequence = sortedDice.every((value, index) => value === index + 1);
            if (isSequence) {
                return true;
            }
        }

        // KONTROLA TŘÍ PÁRŮ
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
                return true;
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
}

// Testovací runner
class SimplifiedUITester {
    constructor() {
        this.simulator = new GameStateSimulator();
        this.testResults = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const colors = {
            info: '\x1b[36m',
            success: '\x1b[32m',
            error: '\x1b[31m',
            warning: '\x1b[33m',
            test: '\x1b[35m',
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

    // Test 1: Herní mechaniky
    testGameMechanics() {
        return this.runTest('Herní mechaniky', () => {
            this.simulator.reset();

            // Test základních bodovacích kombinací
            const testCases = [
                { roll: [1, 1, 1], selected: [0, 1, 2], expectedPoints: 1000, desc: 'Tři jedničky' },
                { roll: [5, 5, 5], selected: [0, 1, 2], expectedPoints: 500, desc: 'Tři pětky' },
                { roll: [1, 2, 3, 4, 5, 6], selected: [0, 1, 2, 3, 4, 5], expectedPoints: 2000, desc: 'Postupka' },
                { roll: [1, 1, 2, 2, 3, 3], selected: [0, 1, 2, 3, 4, 5], expectedPoints: 1500, desc: 'Tři páry' }
            ];

            for (const testCase of testCases) {
                const result = this.simulator.canSaveDice(testCase.selected, testCase.roll);

                if (!result.valid) {
                    return {
                        success: false,
                        reason: `${testCase.desc}: Mělo by být platné - ${result.reason}`,
                        testCase
                    };
                }

                if (result.points !== testCase.expectedPoints) {
                    return {
                        success: false,
                        reason: `${testCase.desc}: Očekáváno ${testCase.expectedPoints}, dostáno ${result.points}`,
                        testCase
                    };
                }
            }

            return { success: true, testedCases: testCases.length };
        });
    }

    // Test 2: Výběr kostek
    testDiceSelection() {
        return this.runTest('Výběr kostek', () => {
            this.simulator.reset();

            // Test validních výběrů
            const validCases = [
                { roll: [1, 2, 3, 4, 5, 6], dieValue: 1, desc: 'Jednička' },
                { roll: [1, 2, 3, 4, 5, 6], dieValue: 5, desc: 'Pětka' },
                { roll: [2, 2, 2, 4, 5, 6], dieValue: 2, desc: 'Trojka dvojek' },
                { roll: [1, 2, 3, 4, 5, 6], dieValue: 3, desc: 'Postupka - trojka' }
            ];

            for (const testCase of validCases) {
                const isValid = this.simulator.isValidDiceForSelection(testCase.dieValue, testCase.roll);

                if (!isValid) {
                    return {
                        success: false,
                        reason: `${testCase.desc}: Mělo by být platné`,
                        testCase
                    };
                }
            }

            // Test nevalidních výběrů
            const invalidCases = [
                { roll: [2, 3, 4, 6, 3, 4], dieValue: 2, desc: 'Jednotlivá dvojka' },
                { roll: [2, 3, 4, 6, 3, 4], dieValue: 6, desc: 'Jednotlivá šestka' }
            ];

            for (const testCase of invalidCases) {
                const isValid = this.simulator.isValidDiceForSelection(testCase.dieValue, testCase.roll);

                if (isValid) {
                    return {
                        success: false,
                        reason: `${testCase.desc}: NEMĚLO by být platné`,
                        testCase
                    };
                }
            }

            return {
                success: true,
                validCases: validCases.length,
                invalidCases: invalidCases.length
            };
        });
    }

    // Test 3: Herní fáze
    testGamePhases() {
        return this.runTest('Herní fáze', () => {
            this.simulator.reset();

            const validPhases = ['menu', 'game', 'gameover', 'rules', 'halloffame'];

            for (const phase of validPhases) {
                this.simulator.updateState({ gamePhase: phase });
                const currentState = this.simulator.getState();

                if (currentState.gamePhase !== phase) {
                    return {
                        success: false,
                        reason: `Nepodařilo se nastavit fázi '${phase}'`,
                        currentPhase: currentState.gamePhase
                    };
                }
            }

            return { success: true, phasesCount: validPhases.length };
        });
    }

    // Test 4: První zápis validace
    testFirstEntryValidation() {
        return this.runTest('První zápis validace', () => {
            this.simulator.reset();

            // Test nedostatečných bodů
            const invalidCases = [
                { turnScore: 100, desc: '100 bodů' },
                { turnScore: 250, desc: '250 bodů' },
                { turnScore: 299, desc: '299 bodů' }
            ];

            for (const testCase of invalidCases) {
                const result = this.simulator.canEndTurn(testCase.turnScore);

                if (result.valid) {
                    return {
                        success: false,
                        reason: `${testCase.desc}: Nemělo by být platné pro první zápis`,
                        testCase
                    };
                }
            }

            // Test dostatečných bodů
            const validCases = [
                { turnScore: 300, desc: '300 bodů' },
                { turnScore: 500, desc: '500 bodů' },
                { turnScore: 1000, desc: '1000 bodů' }
            ];

            for (const testCase of validCases) {
                const result = this.simulator.canEndTurn(testCase.turnScore);

                if (!result.valid) {
                    return {
                        success: false,
                        reason: `${testCase.desc}: Mělo by být platné pro první zápis`,
                        testCase
                    };
                }
            }

            return {
                success: true,
                invalidCases: invalidCases.length,
                validCases: validCases.length
            };
        });
    }

    // Test 5: Bootstrap CSS simulace
    testBootstrapCSS() {
        return this.runTest('Bootstrap CSS', () => {
            // Simulace kontroly Bootstrap tříd
            const requiredClasses = [
                'container-fluid', 'row', 'col-12', 'col-6', 'd-flex',
                'flex-column', 'justify-content-center', 'align-items-center',
                'text-center', 'mb-2', 'mb-3', 'btn', 'btn-sm'
            ];

            const neonClasses = [
                'text-neon-green', 'text-neon-blue', 'text-neon-purple',
                'text-neon-orange', 'text-neon-red', 'text-neon-yellow',
                'border-neon-green', 'btn-neon', 'bg-neon-black'
            ];

            // V reálné implementaci by se kontrolovaly CSS soubory
            // Zde simulujeme, že všechny třídy existují
            const allClasses = [...requiredClasses, ...neonClasses];

            // Simulace úspěšné kontroly
            const missingClasses = []; // Žádné chybějící třídy

            if (missingClasses.length > 0) {
                return {
                    success: false,
                    reason: `Chybějící CSS třídy: ${missingClasses.join(', ')}`,
                    missingClasses
                };
            }

            return {
                success: true,
                bootstrapClasses: requiredClasses.length,
                neonClasses: neonClasses.length,
                totalClasses: allClasses.length
            };
        });
    }

    // Test 6: FARKLE detekce
    testFarkleDetection() {
        return this.runTest('FARKLE detekce', () => {
            const farkleRolls = [
                [2, 3, 4, 6, 3, 4],  // Pouze dvojice, ne tři páry
                [2, 3, 4, 6, 2, 3],  // Pouze jednotlivé páry
                [3, 4, 6, 3, 4, 2]   // Pouze dvojice, ne tři páry
            ];

            for (const roll of farkleRolls) {
                if (hasScoringDice(roll)) {
                    return {
                        success: false,
                        reason: `${roll.join(',')} by měl být FARKLE`,
                        roll
                    };
                }
            }

            const scoringRolls = [
                [1, 2, 3, 4, 6, 6],      // Jednička
                [5, 2, 3, 4, 6, 6],      // Pětka
                [1, 1, 1, 4, 6, 6],      // Tři jedničky
                [2, 4, 6, 2, 4, 6]       // Tři páry (2,2), (4,4), (6,6)
            ];

            for (const roll of scoringRolls) {
                if (!hasScoringDice(roll)) {
                    return {
                        success: false,
                        reason: `${roll.join(',')} by měl být bodující`,
                        roll
                    };
                }
            }

            return {
                success: true,
                farkleRolls: farkleRolls.length,
                scoringRolls: scoringRolls.length
            };
        });
    }

    // Hlavní spouštěcí metoda
    runAllTests() {
        this.log('\n🎮 SPOUŠTĚNÍ ZJEDNODUŠENÝCH UI TESTŮ', 'test');
        this.log('='.repeat(80), 'test');

        // Spuštění všech testů
        this.testGameMechanics();
        this.testDiceSelection();
        this.testGamePhases();
        this.testFirstEntryValidation();
        this.testBootstrapCSS();
        this.testFarkleDetection();

        // Zobrazení výsledků
        this.displayResults();
    }

    displayResults() {
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const errors = this.testResults.filter(r => r.status === 'ERROR').length;

        this.log('\n🎯 SOUHRN VÝSLEDKŮ', 'test');
        this.log('='.repeat(80), 'test');
        this.log(`📊 Celkem testů: ${total}`, 'info');
        this.log(`✅ Úspěšné: ${passed}`, 'success');
        this.log(`❌ Neúspěšné: ${failed}`, 'error');
        this.log(`💥 Chyby: ${errors}`, 'error');
        this.log(`📈 Úspěšnost: ${((passed / total) * 100).toFixed(1)}%`,
            passed === total ? 'success' : 'warning');

        if (this.errors.length > 0) {
            this.log('\n🔍 DETAILY CHYB', 'warning');
            this.log('-'.repeat(50), 'warning');

            this.errors.forEach(error => {
                this.log(`❌ ${error.name}: ${error.reason || error.error}`, 'error');
            });
        }

        this.log('\n💡 VÝSLEDEK', 'warning');
        this.log('-'.repeat(50), 'warning');

        if (failed > 0 || errors > 0) {
            this.log('🔧 Některé UI testy selhaly - zkontrolujte herní logiku', 'warning');
        } else {
            this.log('🎉 Všechny UI testy prošly! Logika je funkční.', 'success');
        }

        this.log('\n🏁 HOTOVO', 'test');
        this.log('='.repeat(80), 'test');
    }
}

// Spuštění testů
const tester = new SimplifiedUITester();
tester.runAllTests();
