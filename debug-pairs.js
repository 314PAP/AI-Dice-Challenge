// Automatický test s Console Ninja debugging
import { calculatePoints } from './src/js/game/diceMechanics.js';

console.log('🎯 === CONSOLE NINJA DEBUG - PRAVIDLA PÁRŮ ===');

// Test 1: Tři klasické páry (bez 1 a 5)
console.log('\n🧪 Test 1: Tři klasické páry');
const test1 = [2, 2, 6, 6, 3, 3];
const result1 = calculatePoints(test1);
console.log(`Kostky: [${test1.join(', ')}]`);
console.log(`Výsledek: ${result1} bodů`);
console.log(`Očekáváno: 1500 bodů`);
console.log(`Test 1: ${result1 === 1500 ? '✅ PROŠEL' : '❌ SELHAL'}`);

// Test 2: KRITICKÝ - Tři páry VČETNĚ 1 a 5
console.log('\n🧪 Test 2: KRITICKÝ - Tři páry VČETNĚ 1 a 5');
const test2 = [1, 1, 5, 5, 3, 3];
const result2 = calculatePoints(test2);
console.log(`Kostky: [${test2.join(', ')}]`);
console.log(`Výsledek: ${result2} bodů`);
console.log(`Pokud logika RESPEKTUJE pravidlo: očekáváno cca 300 bodů (1+1+5+5 = 100+100+50+50)`);
console.log(`Pokud logika IGNORUJE pravidlo: očekáváno 1500 bodů (tři páry)`);
console.log(`Test 2: ${result2 === 1500 ? '⚠️ IGNORUJE pravidlo (páry zahrnují 1 a 5)' : '✅ RESPEKTUJE pravidlo'}`);

// Test 3: Jednotlivé 1 a 5 (kontrolní)
console.log('\n🧪 Test 3: Jednotlivé 1 a 5 (kontrolní)');
const test3 = [1, 5, 2, 3, 4, 6];
const result3 = calculatePoints(test3);
console.log(`Kostky: [${test3.join(', ')}]`);
console.log(`Výsledek: ${result3} bodů`);
console.log(`Očekáváno: 150 bodů (1=100 + 5=50)`);
console.log(`Test 3: ${result3 === 150 ? '✅ PROŠEL' : '❌ SELHAL'}`);

// Test 4: Pár jedniček + jednotlivá pětka
console.log('\n🧪 Test 4: Pár jedniček + jednotlivá pětka');
const test4 = [1, 1, 5, 2, 3, 4];
const result4 = calculatePoints(test4);
console.log(`Kostky: [${test4.join(', ')}]`);
console.log(`Výsledek: ${result4} bodů`);
console.log(`Očekáváno: 250 bodů (1+1+5 = 100+100+50, žádný pár)`);
console.log(`Test 4: ${result4 === 250 ? '✅ PROŠEL' : '❌ SELHAL'}`);

console.log('\n🔍 === ZÁVĚR DEBUG ANALÝZY ===');
if (result2 === 1500) {
    console.log('❌ PROBLÉM NALEZEN: Logika POČÍTÁ 1 a 5 jako páry!');
    console.log('🔧 POTŘEBA OPRAVA: Odstranit mylné pravidlo z UI');
} else {
    console.log('✅ LOGIKA FUNGUJE: Pravidlo je správně implementované');
}
