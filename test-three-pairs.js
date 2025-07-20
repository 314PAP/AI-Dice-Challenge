// Test pravidla tří párů
import { calculatePoints } from './src/js/game/diceMechanics.js';

// Test: tři páry (2,2,6,6,3,3) - očekáváme 1500 bodů
const threePairs = [2, 2, 6, 6, 3, 3];
const result = calculatePoints(threePairs);

console.log(`🧪 Test tří párů:`);
console.log(`Kostky: [${threePairs.join(', ')}]`);
console.log(`Výsledek: ${result} bodů`);
console.log(`Očekáváno: 1500 bodů`);
console.log(`Test ${result === 1500 ? '✅ PROŠEL' : '❌ NEPROŠEL'}`);

// Test: tři páry s 1 a 5 (1,1,5,5,3,3) - očekáváme jen 1500 bodů
const threePairsWithOnesAndFives = [1, 1, 5, 5, 3, 3];
const result2 = calculatePoints(threePairsWithOnesAndFives);

console.log(`\n🧪 Test tří párů s 1 a 5:`);
console.log(`Kostky: [${threePairsWithOnesAndFives.join(', ')}]`);
console.log(`Výsledek: ${result2} bodů`);
console.log(`Očekáváno: 1500 bodů (ne 1500+100+100+50+50)`);
console.log(`Test ${result2 === 1500 ? '✅ PROŠEL' : '❌ NEPROŠEL'}`);
