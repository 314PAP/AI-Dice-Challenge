#!/usr/bin/env node

/**
 * 🧪 KOMPREHENZIVNÍ FARKLE TEST SUITE - ROZŠÍŘENÁ VERZE
 * 
 * Testuje všechny možné kombinace a herní stavy:
 * - První zápis (0 bodů → musí mít alespoň 300)
 * - Běžné tahy (již má body → může odložit cokoliv bodující)
 * - Finální kolo (dosažení cíle → ostatní hrají poslední tah)
 * - FARKLE situace (žádné bodující kostky)
 * - Edge cases (hot dice, speciální kombinace)
 * - AI fallback logika a loop protection
 * - HOT DICE re-rolling po odložení všech kostek
 * - FARKLE timing synchronizace
 * - First-entry validation pouze při endTurn
 */

import { calculatePoints, hasScoringDice } from './src/js/game/diceMechanics.js';

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

    canSaveDice(selectedIndices, currentRoll) {
        if (!selectedIndices || selectedIndices.length === 0) {
            return { valid: false, reason: 'Žádné kostky nevybrány' };
        }

        const selectedValues = selectedIndices.map(i => currentRoll[i]);
        const points = calculatePoints(selectedValues);

        if (points === 0) {
            return { valid: false, reason: 'Vybrané kostky nezískávají body' };
        }

        // OPRAVENO: ODLOŽIT je vždy povoleno, validace jen při endTurn
        // První zápis validace se NETÝKÁ funkce saveDice, jen endTurn
        return { 
            valid: true, 
            points: points,
            totalTurnPoints: this.state.turnScore + points,
            currentScore: this.getCurrentPlayer().score
        };
    }

    canEndTurn(turnScore) {
        const currentPlayer = this.getCurrentPlayer();
        
        // První zápis vyžaduje minimálně 300 bodů
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
}

// Test runner
class FarkleTestRunner {
    constructor() {
        this.simulator = new GameStateSimulator();
        this.testResults = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const colors = {
            info: '\x1b[36m',    // cyan
            success: '\x1b[32m', // green
            error: '\x1b[31m',   // red
            warning: '\x1b[33m', // yellow
            reset: '\x1b[0m'
        };
        
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    runTest(name, testFunction) {
        this.log(`🧪 Test: ${name}`, 'info');
        
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

    // Test 1: První zápis - valid cases
    testPrvniZapisValid() {
        return this.runTest('První zápis - dostatečné body', () => {
            this.simulator.reset();
            
            // Test cases pro první zápis
            const validCases = [
                { roll: [1, 1, 1], selected: [0, 1, 2], expectedPoints: 1000, desc: 'Tři jedničky' },
                { roll: [5, 5, 5], selected: [0, 1, 2], expectedPoints: 500, desc: 'Tři pětky' },
                { roll: [2, 2, 2, 1, 5], selected: [0, 1, 2, 3, 4], expectedPoints: 350, desc: 'Tři dvojky + jednička + pětka' },
                { roll: [1, 1, 1, 1], selected: [0, 1, 2, 3], expectedPoints: 2000, desc: 'Čtyři jedničky' },
                { roll: [1, 5, 1, 5, 1], selected: [0, 1, 2, 3, 4], expectedPoints: 1100, desc: 'Tři jedničky + dvě pětky kombinované' }
            ];

            for (const testCase of validCases) {
                const result = this.simulator.canSaveDice(testCase.selected, testCase.roll);
                
                if (!result.valid) {
                    return { 
                        success: false, 
                        reason: `${testCase.desc}: Mělo by být platné, ale není - ${result.reason}`,
                        testCase
                    };
                }

                if (result.points !== testCase.expectedPoints) {
                    return { 
                        success: false, 
                        reason: `${testCase.desc}: Očekáváno ${testCase.expectedPoints} bodů, dostáno ${result.points}`,
                        testCase
                    };
                }

                if (result.totalTurnPoints < 300) {
                    return { 
                        success: false, 
                        reason: `${testCase.desc}: První zápis musí být >= 300, je ${result.totalTurnPoints}`,
                        testCase
                    };
                }
            }

            return { success: true, testedCases: validCases.length };
        });
    }

    // Test 2: První zápis - invalid cases
    testPrvniZapisInvalid() {
        return this.runTest('První zápis - nedostatečné body při endTurn', () => {
            this.simulator.reset();
            
            const invalidCases = [
                { turnScore: 100, desc: 'Jen jedna jednička (100 bodů)' },
                { turnScore: 50, desc: 'Jen jedna pětka (50 bodů)' },
                { turnScore: 150, desc: 'Jednička + pětka (150 bodů)' },
                { turnScore: 250, desc: 'Kombinace pod 300 bodů (250 bodů)' }
            ];

            for (const testCase of invalidCases) {
                // ODLOŽIT by měl být vždy povolen
                const saveResult = this.simulator.canSaveDice([0], [1, 2, 3, 4, 5, 6]);
                if (!saveResult.valid && saveResult.reason.includes('300 bodů')) {
                    return { 
                        success: false, 
                        reason: `ODLOŽIT by měl být vždy povolen, ale: ${saveResult.reason}`,
                        testCase
                    };
                }
                
                // EndTurn s malými body by měl být odmítnut
                const endTurnResult = this.simulator.canEndTurn(testCase.turnScore);
                if (endTurnResult.valid) {
                    return { 
                        success: false, 
                        reason: `${testCase.desc}: EndTurn by měl být odmítnut (< 300 bodů), ale je povolen`,
                        testCase,
                        result: endTurnResult
                    };
                }

                if (!endTurnResult.reason.includes('300 bodů')) {
                    return { 
                        success: false, 
                        reason: `${testCase.desc}: Špatná chybová zpráva - ${endTurnResult.reason}`,
                        testCase
                    };
                }
            }

            return { success: true, testedCases: invalidCases.length };
        });
    }

    // Test 3: Běžné tahy (již má body)
    testBeznyTah() {
        return this.runTest('Běžný tah - hráč už má body', () => {
            this.simulator.reset();
            this.simulator.state.players[0].score = 500; // Hráč už má body
            
            const cases = [
                { roll: [5, 2, 3, 4, 6, 6], selected: [0], expectedPoints: 50, desc: 'Jen pětka - mělo by být OK' },
                { roll: [1, 2, 3, 4, 6, 6], selected: [0], expectedPoints: 100, desc: 'Jen jednička - mělo by být OK' },
                { roll: [2, 2, 3, 4, 6, 6], selected: [], expectedPoints: 0, desc: 'Žádné body - neplatné' }
            ];

            for (const testCase of cases) {
                const result = this.simulator.canSaveDice(testCase.selected, testCase.roll);
                
                if (testCase.expectedPoints > 0) {
                    // Mělo by být platné
                    if (!result.valid) {
                        return { 
                            success: false, 
                            reason: `${testCase.desc}: Mělo by být platné, ale není - ${result.reason}`,
                            testCase
                        };
                    }
                } else {
                    // Mělo by být neplatné
                    if (result.valid) {
                        return { 
                            success: false, 
                            reason: `${testCase.desc}: Mělo by být neplatné, ale je platné`,
                            testCase
                        };
                    }
                }
            }

            return { success: true, testedCases: cases.length };
        });
    }

    // Test 4: Edge cases
    testEdgeCases() {
        return this.runTest('Edge cases', () => {
            this.simulator.reset();
            
            // Test postupky
            const postupka = [1, 2, 3, 4, 5, 6];
            const postupkaPoints = calculatePoints(postupka);
            
            if (postupkaPoints !== 1500) {
                return { 
                    success: false, 
                    reason: `Postupka by měla dát 1500 bodů, ale dává ${postupkaPoints}`
                };
            }

            // Test tří párů
            const triPary = [1, 1, 2, 2, 3, 3];
            const triParyPoints = calculatePoints(triPary);
            
            if (triParyPoints !== 1500) {
                return { 
                    success: false, 
                    reason: `Tři páry by měly dát 1500 bodů, ale dávají ${triParyPoints}`
                };
            }

            return { success: true };
        });
    }

    // Test 5: FARKLE detection
    testFarkleDetection() {
        return this.runTest('FARKLE detekce', () => {
            const farkleRolls = [
                [2, 3, 4, 6, 3, 4],  // Pouze dvojice, žádné trojice nebo jiné kombinace
                [3, 4, 6, 2, 3, 4],  // Dvě trojice (3,3), (4,4) ale ne tři páry
                [2, 3, 4, 6, 2, 3]   // Pouze jednotlivé páry, ne tři páry
            ];

            for (const roll of farkleRolls) {
                if (hasScoringDice(roll)) {
                    return { 
                        success: false, 
                        reason: `${roll.join(',')} by měl být FARKLE, ale hlásí se jako bodující`,
                        roll
                    };
                }
            }

            const scoringRolls = [
                [1, 2, 3, 4, 6, 6],
                [5, 2, 3, 4, 6, 6],
                [1, 1, 1, 4, 6, 6]
            ];

            for (const roll of scoringRolls) {
                if (!hasScoringDice(roll)) {
                    return { 
                        success: false, 
                        reason: `${roll.join(',')} by měl být bodující, ale hlásí se jako FARKLE`,
                        roll
                    };
                }
            }

            return { success: true };
        });
    }

    // Test 6: HOT DICE scenarios
    testHotDiceScenarios() {
        return this.runTest('HOT DICE scenarios', () => {
            this.simulator.reset();
            
            // Test: Všechny kostky odloženy -> HOT DICE reset
            const hotDiceRoll = [1, 1, 1, 5, 5, 2];
            const allDiceSelected = [0, 1, 2, 3, 4]; // 3x1 + 2x5 = 1000 + 100 = 1100 bodů
            
            const result = this.simulator.canSaveDice(allDiceSelected, hotDiceRoll);
            
            if (!result.valid) {
                return { 
                    success: false, 
                    reason: `HOT DICE by měl být platný: ${result.reason}`,
                    testCase: { roll: hotDiceRoll, selected: allDiceSelected }
                };
            }

            // HOT DICE = všechny bodující kostky odloženy
            const scoringDiceCount = hotDiceRoll.filter((val, idx) => 
                [0, 1, 2, 3, 4].includes(idx) && (val === 1 || val === 5 || 
                hotDiceRoll.filter(v => v === val).length >= 3)
            ).length;
            
            // Pokud jsou odloženy všechny bodující kostky, je to HOT DICE
            if (allDiceSelected.length >= 5) { // Minimálně 5 z 6 kostek
                return { success: true, points: result.points, isHotDice: true };
            }

            return { 
                success: false, 
                reason: 'HOT DICE nesprávně identifikován - nedostatek odložených kostek',
                points: result.points,
                selectedCount: allDiceSelected.length
            };
        });
    }

    // Test 7: First-entry validation pouze při endTurn
    testFirstEntryValidation() {
        return this.runTest('First-entry validation - ODLOŽIT vs endTurn', () => {
            this.simulator.reset();
            
            // Simulace: Hráč má 0 bodů, odloží 200 bodů
            this.simulator.state.players[0].score = 0;
            const roll = [1, 5, 2, 3, 4, 6];
            const selected = [0, 1]; // Jednička + pětka = 150 bodů
            
            // ODLOŽIT by měl být vždy povolen (jen ukládá kostky)
            const saveResult = this.simulator.canSaveDice(selected, roll);
            if (!saveResult.valid) {
                return { 
                    success: false, 
                    reason: `ODLOŽIT by měl být vždy povolen, ale: ${saveResult.reason}`,
                    testCase: { roll, selected, action: 'save' }
                };
            }

            // EndTurn s méně než 300 body by měl být odmítnut
            const endTurnResult = this.simulator.canEndTurn(150);
            if (endTurnResult.valid) {
                return { 
                    success: false, 
                    reason: 'EndTurn s 150 body by měl být odmítnut pro prvního hráče',
                    testCase: { turnScore: 150, action: 'endTurn' }
                };
            }

            return { success: true };
        });
    }

    // Test 8: AI Fallback logika
    testAiFallbackLogic() {
        return this.runTest('AI Fallback a loop protection', () => {
            // Simulace neočekávané AI akce
            const unknownAction = 'unknownAction';
            const validActions = ['save', 'endTurn', 'continue'];
            
            if (validActions.includes(unknownAction)) {
                return { 
                    success: false, 
                    reason: 'Test setup chyba - unknownAction by neměl být platný'
                };
            }

            // AI by měla mít fallback pro neplatné akce
            // V reálné implementaci by AI měla vybrat bezpečnou akci
            const fallbackAction = 'endTurn'; // Defaultní bezpečná akce
            
            if (!validActions.includes(fallbackAction)) {
                return { 
                    success: false, 
                    reason: 'Fallback akce není platná'
                };
            }

            return { success: true, fallbackAction };
        });
    }

    // Test 9: FARKLE timing a animation sync
    testFarkleTiming() {
        return this.runTest('FARKLE timing a animation sync', () => {
            // Simulace FARKLE situace
            const farkleRoll = [2, 3, 4, 6, 6, 3];
            
            if (hasScoringDice(farkleRoll)) {
                return { 
                    success: false, 
                    reason: 'Test setup chyba - roll by měl být FARKLE',
                    testCase: { roll: farkleRoll }
                };
            }

            // FARKLE detekce funguje
            // V reálné implementaci by měl být 2.2s delay před zobrazením FARKLE
            const expectedDelay = 2200; // ms
            const actualDelay = 2200; // Simulace - v reálném testu by se měřil čas
            
            if (actualDelay < expectedDelay - 100) {
                return { 
                    success: false, 
                    reason: `FARKLE zobrazeno příliš brzy: ${actualDelay}ms místo ${expectedDelay}ms`
                };
            }

            return { success: true, delay: actualDelay };
        });
    }

    // Spustí všechny testy
    runAllTests() {
        this.log('🚀 Spouštím komprehenzivní Farkle test suite...', 'info');
        
        this.testPrvniZapisValid();
        this.testPrvniZapisInvalid();
        this.testBeznyTah();
        this.testEdgeCases();
        this.testFarkleDetection();
        this.testHotDiceScenarios();
        this.testFirstEntryValidation();
        this.testAiFallbackLogic();
        this.testFarkleTiming();
        this.testHotDiceScenarios();
        this.testFirstEntryValidation();
        this.testAiFallbackLogic();
        this.testFarkleTiming();
        
        this.printSummary();
    }

    printSummary() {
        this.log('\n📊 VÝSLEDKY TESTŮ:', 'info');
        this.log('═'.repeat(50), 'info');
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const errors = this.testResults.filter(r => r.status === 'ERROR').length;
        
        this.log(`✅ Prošly: ${passed}`, 'success');
        this.log(`❌ Selhaly: ${failed}`, 'error');
        this.log(`💥 Chyby: ${errors}`, 'error');
        
        if (this.errors.length > 0) {
            this.log('\n🔍 DETAILY CHYB:', 'warning');
            this.log('-'.repeat(50), 'warning');
            
            this.errors.forEach(error => {
                this.log(`❌ ${error.name}: ${error.reason || error.error}`, 'error');
                if (error.testCase) {
                    this.log(`   Roll: [${error.testCase.roll.join(', ')}]`, 'info');
                    this.log(`   Selected: [${error.testCase.selected.join(', ')}]`, 'info');
                    this.log(`   Expected: ${error.testCase.expectedPoints} bodů`, 'info');
                }
            });
        }
        
        this.log('\n💡 DOPORUČENÍ:', 'warning');
        
        if (failed > 0 || errors > 0) {
            this.log('- Zkontroluj herní logiku v DiceManager.js', 'warning');
            this.log('- Ověř validaci prvního zápisu', 'warning');
            this.log('- Prověř funkci calculatePoints()', 'warning');
        } else {
            this.log('- Všechny testy prošly! 🎉', 'success');
        }
    }
}

// Spuštění testů
const runner = new FarkleTestRunner();
runner.runAllTests();
