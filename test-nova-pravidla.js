#!/usr/bin/env node

/**
 * 🎲 TEST NOVÉ HERNÍ LOGIKY 
 * Test podle aktualizovaných pravidel
 */

import { calculatePoints } from './src/js/game/diceMechanics.js';

console.log('🎲 TESTOVÁNÍ NOVÉ HERNÍ LOGIKY');
console.log('═══════════════════════════════════════');

const testCases = [
    // Základní bodování
    { dice: [1], expected: 100, name: 'Jedna jednička' },
    { dice: [5], expected: 50, name: 'Jedna pětka' },
    { dice: [2], expected: 0, name: 'Jedna dvojka (bez bodů)' },
    
    // Trojice
    { dice: [1, 1, 1], expected: 1000, name: 'Tři jedničky' },
    { dice: [2, 2, 2], expected: 200, name: 'Tři dvojky' },
    { dice: [3, 3, 3], expected: 300, name: 'Tři trojky' },
    { dice: [4, 4, 4], expected: 400, name: 'Tři čtverky' },
    { dice: [5, 5, 5], expected: 500, name: 'Tři pětky' },
    { dice: [6, 6, 6], expected: 600, name: 'Tři šestky' },
    
    // Čtyři stejné
    { dice: [2, 2, 2, 2], expected: 400, name: 'Čtyři dvojky (200×2)' },
    { dice: [3, 3, 3, 3], expected: 600, name: 'Čtyři trojky (300×2)' },
    
    // Pět stejných
    { dice: [2, 2, 2, 2, 2], expected: 800, name: 'Pět dvojek (200×4)' },
    { dice: [1, 1, 1, 1, 1], expected: 4000, name: 'Pět jedniček' },
    
    // ⭐ NOVÉ PRAVIDLO: Šest stejných = 5000 bodů
    { dice: [1, 1, 1, 1, 1, 1], expected: 5000, name: '🔥 Šest jedniček = 5000' },
    { dice: [2, 2, 2, 2, 2, 2], expected: 5000, name: '🔥 Šest dvojek = 5000' },
    { dice: [6, 6, 6, 6, 6, 6], expected: 5000, name: '🔥 Šest šestek = 5000' },
    
    // ⭐ NOVÉ PRAVIDLO: Postupka = 2000 bodů
    { dice: [1, 2, 3, 4, 5, 6], expected: 2000, name: '🚀 Postupka = 2000' },
    
    // ⭐ NOVÉ PRAVIDLO: Tři dvojice = 1500 bodů
    { dice: [2, 2, 3, 3, 4, 4], expected: 1500, name: '🎯 Tři dvojice = 1500' },
    { dice: [2, 2, 6, 6, 3, 3], expected: 1500, name: '🎯 Tři dvojice (random order) = 1500' },
    
    // Smíšené kombinace
    { dice: [1, 5], expected: 150, name: 'Jednička + pětka' },
    { dice: [1, 1, 5], expected: 250, name: 'Dvě jedničky + pětka' },
    { dice: [1, 2, 3, 4, 6], expected: 100, name: 'Pouze jedna jednička' },
    
    // FARKLE
    { dice: [2, 3, 4, 6], expected: 0, name: '💥 FARKLE (žádné body)' },
];

let passed = 0;
let failed = 0;

console.log('\n🧪 SPOUŠTĚNÍ TESTŮ:\n');

testCases.forEach((testCase, index) => {
    try {
        const result = calculatePoints(testCase.dice);
        const success = result === testCase.expected;
        
        if (success) {
            console.log(`✅ ${index + 1}. ${testCase.name}: ${result} bodů`);
            passed++;
        } else {
            console.log(`❌ ${index + 1}. ${testCase.name}: CHYBA!`);
            console.log(`   Očekáváno: ${testCase.expected}, Dostáno: ${result}`);
            failed++;
        }
    } catch (error) {
        console.log(`💥 ${index + 1}. ${testCase.name}: VÝJIMKA - ${error.message}`);
        failed++;
    }
});

console.log('\n═══════════════════════════════════════');
console.log('📊 VÝSLEDKY TESTŮ:');
console.log(`✅ Úspěšné: ${passed}`);
console.log(`❌ Neúspěšné: ${failed}`);
console.log(`📈 Celkem: ${testCases.length}`);

if (failed === 0) {
    console.log('\n🎉 VŠECHNY TESTY PROŠLY! Herní logika funguje správně.');
    console.log('🌙 Můžeme jít spát v klidu! 💤');
} else {
    console.log('\n⚠️  Některé testy selhaly. Je třeba opravit logiku.');
}

console.log('\n🎲 Test dokončen!');
