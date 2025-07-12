// Kompletní test herní logiky - kontrola všech funkcí a proměnných
import { 
    calculatePoints, 
    hasScoringDice, 
    countDiceValues,
    isValidFarkleCombination,
    rollDie 
} from './src/js/game/diceMechanics.js';

import gameState from './src/js/game/gameState.js';

console.log('=== KOMPLETNÍ TEST HERNÍ LOGIKY ===\n');

// 1. Test diceMechanics funkcí
console.log('1. DICE MECHANICS TESTY:');
console.log('✓ calculatePoints exportováno:', typeof calculatePoints === 'function');
console.log('✓ hasScoringDice exportováno:', typeof hasScoringDice === 'function');
console.log('✓ countDiceValues exportováno:', typeof countDiceValues === 'function');
console.log('✓ isValidFarkleCombination exportováno:', typeof isValidFarkleCombination === 'function');
console.log('✓ rollDie exportováno:', typeof rollDie === 'function');

// 2. Test scoring logiky
console.log('\n2. SCORING LOGIKA:');
const testCases = [
    { dice: [1,1,1], expected: 1000, desc: 'Tři jedničky' },
    { dice: [2,2,2], expected: 200, desc: 'Tři dvojky' },
    { dice: [1,5], expected: 150, desc: 'Jednička + pětka' },
    { dice: [2,2,3,3,4,4], expected: 1500, desc: 'Tři páry' },
    { dice: [1,2,3,4,5,6], expected: 1500, desc: 'Straight' },
    { dice: [2,3,4,6], expected: 0, desc: 'Žádné body' }
];

testCases.forEach(test => {
    const result = calculatePoints(test.dice);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.desc}: ${result} (očekáváno ${test.expected})`);
});

// 3. Test FARKLE detekce
console.log('\n3. FARKLE DETEKCE:');
const farkleTests = [
    { dice: [2,3,4,6,2,4], shouldBeFarkle: true, desc: 'Dva páry' },
    { dice: [1,3,4,6,2,4], shouldBeFarkle: false, desc: 'Má jedničku' },
    { dice: [2,2,3,3,4,4], shouldBeFarkle: false, desc: 'Tři páry' },
    { dice: [2,3,4,6,3,4], shouldBeFarkle: true, desc: 'Žádné body' }
];

farkleTests.forEach(test => {
    const hasScoring = hasScoringDice(test.dice);
    const isFarkle = !hasScoring;
    const status = isFarkle === test.shouldBeFarkle ? '✅' : '❌';
    console.log(`${status} ${test.desc}: FARKLE=${isFarkle} (očekáváno ${test.shouldBeFarkle})`);
});

// 4. Test gameState
console.log('\n4. GAME STATE TEST:');
console.log('✓ gameState importován:', typeof gameState === 'object');
console.log('✓ getState funkce:', typeof gameState.getState === 'function');
console.log('✓ updateState funkce:', typeof gameState.updateState === 'function');

// Test stavu
const initialState = gameState.getState();
console.log('✓ Počáteční stav získán');
console.log('  - players:', Array.isArray(initialState.players));
console.log('  - currentPlayerIndex:', typeof initialState.currentPlayerIndex);
console.log('  - currentRoll:', Array.isArray(initialState.currentRoll));

console.log('\n=== TEST DOKONČEN ===');
