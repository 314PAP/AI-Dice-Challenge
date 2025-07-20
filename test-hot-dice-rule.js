#!/usr/bin/env node

/**
 * 🔥 Test HOT DICE pravidla
 * 
 * Testuje, že když hráč odloží všech 6 kostek, MUSÍ házet znovu
 * a NEMŮŽE ukončit tah dokud nehodí znovu
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simulace DOM prostředí
global.document = {
    querySelectorAll: () => [],
    createElement: () => ({
        classList: { add: () => { }, remove: () => { } },
        appendChild: () => { }
    })
};

global.window = global;
global._ = {
    filter: (arr, predicate) => arr.filter(predicate),
    map: (arr, iteratee) => arr.map(iteratee),
    isEmpty: (value) => !value || value.length === 0,
    cloneDeep: (obj) => JSON.parse(JSON.stringify(obj)),
    sum: (arr) => arr.reduce((a, b) => a + b, 0),
    clone: (obj) => ({ ...obj })
};

// Mock sound system
const mockSoundSystem = {
    play: (sound) => console.log(`🎵 Mock sound: ${sound}`)
};

// Mock chat system
const mockChatSystem = {
    addSystemMessage: (msg, color) => console.log(`💬 ${msg}`),
    addAiMessage: (name, msg) => console.log(`🤖 ${name}: ${msg}`)
};

// Mock game state
let mockGameState = {
    players: [
        { name: 'Hráč', score: 0 },
        { name: 'Gemini', score: 0 }
    ],
    currentPlayerIndex: 1, // AI hráč
    currentRoll: [],
    selectedDice: [],
    savedDice: [],
    turnScore: 0,
    isRolling: false,
    gamePhase: 'playing'
};

const mockGameStateModule = {
    getState: () => mockGameState,
    updateState: (updates) => {
        mockGameState = { ...mockGameState, ...updates };
        console.log(`🔄 State update:`, updates);
    }
};

// Import herních modulů
async function loadGameModules() {
    // Mock modules
    global.soundSystem = mockSoundSystem;

    const { DiceManager } = await import('./src/js/game/DiceManager.js');
    const { calculatePoints, hasScoringDice } = await import('./src/js/game/diceMechanics.js');
    const { TurnManager } = await import('./src/js/game/TurnManager.js');

    // Mock animation manager
    const mockAnimationManager = {
        addScoringAnimation: () => { },
        playRollingAnimation: async () => { },
        triggerFarkleAnimation: () => { }
    };

    return {
        DiceManager,
        calculatePoints,
        hasScoringDice,
        TurnManager,
        mockAnimationManager
    };
}

/**
 * Test 1: AI odloží všech 6 kostek -> HOT DICE -> musí házet znovu
 */
async function testHotDiceRule() {
    console.log('\n🔥 TEST HOT DICE PRAVIDLA\n');
    console.log('=' * 50);

    const { DiceManager, calculatePoints, TurnManager, mockAnimationManager } = await loadGameModules();

    // Simulace: AI má hod se všemi 6 kostkami, které jsou bodující
    const testRoll = [1, 1, 1, 5, 5, 2]; // 3 jedničky + 2 pětky + jedna dvojka
    const points = calculatePoints(testRoll);

    console.log(`🎲 Testovací hod: [${testRoll.join(', ')}]`);
    console.log(`💎 Body za hod: ${points}`);

    // Inicializace
    const diceManager = new DiceManager(mockAnimationManager);
    const turnManager = new TurnManager();

    // Mock gameState module
    const originalGameState = global.gameState;
    global.gameState = mockGameStateModule;
    global.chatSystem = mockChatSystem;

    try {
        // Nastavíme počáteční stav
        mockGameState.currentRoll = testRoll;
        mockGameState.selectedDice = [];
        mockGameState.savedDice = [];
        mockGameState.turnScore = 0;

        console.log('\n📝 SCÉNÁŘ: AI se rozhodne odložit všech 6 kostek');

        // KROK 1: AI vybere všechny kostky
        const selectedIndices = [0, 1, 2, 3, 4, 5]; // Všechny kostky
        mockGameState.selectedDice = selectedIndices;

        console.log(`🎯 AI vybral kostky na indexech: [${selectedIndices.join(', ')}]`);
        console.log(`🎯 To jsou hodnoty: [${selectedIndices.map(i => testRoll[i]).join(', ')}]`);

        // KROK 2: AI odloží kostky
        console.log('\n⚡ AI odkládá kostky...');
        diceManager.saveDice();

        // KROK 3: Kontrola stavu po odložení
        const stateAfterSave = mockGameState;
        console.log(`\n📊 Stav po odložení kostek:`);
        console.log(`   • Uložené kostky: [${stateAfterSave.savedDice?.join(', ') || 'žádné'}]`);
        console.log(`   • Zbývající kostky: [${stateAfterSave.currentRoll?.join(', ') || 'žádné'}]`);
        console.log(`   • Skóre tahu: ${stateAfterSave.turnScore || 0}`);

        // KROK 4: Test HOT DICE detekce
        const isHotDice = (stateAfterSave.savedDice?.length === 6) ||
            (stateAfterSave.currentRoll?.length === 0 && stateAfterSave.turnScore > 0);

        console.log(`\n🔥 HOT DICE detekováno: ${isHotDice ? 'ANO' : 'NE'}`);

        if (isHotDice) {
            console.log('✅ SPRÁVNĚ: HOT DICE situace byla detekována');

            // KROK 5: Test, že AI nemůže ukončit tah
            console.log('\n🚫 Test: AI se pokusí ukončit tah...');

            // Simulace pokusu o ukončení tahu
            const canEndTurn = diceManager.canRollDice(); // Pokud může házet, nemůže ukončit

            if (canEndTurn) {
                console.log('✅ SPRÁVNĚ: AI musí házet znovu, nemůže ukončit tah');

                // KROK 6: AI musí hodit znovu
                console.log('\n🎲 AI je NUCEN hodit znovu se všemi 6 kostkami...');

                const diceToRoll = diceManager.getDiceCountToRoll();
                console.log(`🎯 Počet kostek k hodu: ${diceToRoll}`);

                if (diceToRoll === 6) {
                    console.log('✅ SPRÁVNĚ: AI hodí všemi 6 kostkami (HOT DICE reset)');
                    return true;
                } else {
                    console.log('❌ CHYBA: AI nehodí všemi 6 kostkami');
                    return false;
                }
            } else {
                console.log('❌ CHYBA: AI může ukončit tah i po HOT DICE!');
                return false;
            }
        } else {
            console.log('❌ CHYBA: HOT DICE situace NEBYLA detekována');
            return false;
        }

    } catch (error) {
        console.error('❌ Chyba v testu:', error);
        return false;
    } finally {
        // Restore gameState
        global.gameState = originalGameState;
    }
}

/**
 * Test 2: AI odloží pouze část kostek -> může ukončit tah
 */
async function testPartialSaveRule() {
    console.log('\n📝 TEST ČÁSTEČNÉHO ULOŽENÍ\n');
    console.log('=' * 40);

    const { DiceManager, calculatePoints, mockAnimationManager } = await loadGameModules();

    // Simulace: AI má hod, odloží jen část
    const testRoll = [1, 1, 1, 2, 3, 4]; // 3 jedničky + 3 nehodící

    console.log(`🎲 Testovací hod: [${testRoll.join(', ')}]`);

    const diceManager = new DiceManager(mockAnimationManager);
    global.gameState = mockGameStateModule;
    global.chatSystem = mockChatSystem;

    try {
        // Reset stavu
        mockGameState.currentRoll = testRoll;
        mockGameState.selectedDice = [0, 1, 2]; // Jen 3 jedničky
        mockGameState.savedDice = [];
        mockGameState.turnScore = 0;

        console.log('📝 SCÉNÁŘ: AI odloží jen 3 jedničky (ne všech 6 kostek)');

        // AI odloží kostky
        diceManager.saveDice();

        const stateAfterSave = mockGameState;
        console.log(`📊 Stav po odložení:`);
        console.log(`   • Uložené kostky: [${stateAfterSave.savedDice?.join(', ') || 'žádné'}]`);
        console.log(`   • Zbývající kostky: [${stateAfterSave.currentRoll?.join(', ') || 'žádné'}]`);

        const isHotDice = stateAfterSave.savedDice?.length === 6;
        console.log(`🔥 HOT DICE: ${isHotDice ? 'ANO' : 'NE'}`);

        if (!isHotDice) {
            console.log('✅ SPRÁVNĚ: Není HOT DICE, AI může ukončit tah nebo pokračovat');
            return true;
        } else {
            console.log('❌ CHYBA: Detekován HOT DICE i když neměl být');
            return false;
        }

    } catch (error) {
        console.error('❌ Chyba v testu:', error);
        return false;
    }
}

// Spuštění testů
async function runTests() {
    console.log('🔥 TESTOVÁNÍ HOT DICE PRAVIDLA');
    console.log('==============================\n');

    const test1 = await testHotDiceRule();
    const test2 = await testPartialSaveRule();

    console.log('\n🏁 VÝSLEDKY TESTŮ:');
    console.log('==================');
    console.log(`🔥 HOT DICE pravidlo: ${test1 ? '✅ PROŠEL' : '❌ SELHAL'}`);
    console.log(`📝 Částečné uložení: ${test2 ? '✅ PROŠEL' : '❌ SELHAL'}`);

    if (test1 && test2) {
        console.log('\n🎉 VŠECHNY TESTY PROŠLY! HOT DICE pravidlo funguje správně.');
        process.exit(0);
    } else {
        console.log('\n💥 NĚKTERÉ TESTY SELHALY! Je třeba opravit logiku.');
        process.exit(1);
    }
}

runTests().catch(error => {
    console.error('❌ Chyba při spuštění testů:', error);
    process.exit(1);
});
