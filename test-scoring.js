import { calculatePoints, hasScoringDice, isValidFarkleCombination } from './src/js/game/diceMechanics.js';

console.log('🎯 TESTOVÁNÍ BODOVACÍHO SYSTÉMU');
console.log('=================================');

// Test postupky (1,2,3,4,5,6)
console.log('\n1️⃣ Postupka (1,2,3,4,5,6):');
const postupka = [1,2,3,4,5,6];
console.log('Kostky:', postupka);
console.log('Body:', calculatePoints(postupka));
console.log('Má bodující kostky:', hasScoringDice(postupka));
console.log('Je validní kombinace:', isValidFarkleCombination(postupka));

// Test tří párů (2,2,4,4,6,6)
console.log('\n2️⃣ Tři páry (2,2,4,4,6,6):');
const triPary = [2,2,4,4,6,6];
console.log('Kostky:', triPary);
console.log('Body:', calculatePoints(triPary));
console.log('Má bodující kostky:', hasScoringDice(triPary));
console.log('Je validní kombinace:', isValidFarkleCombination(triPary));

// Test trojice jedniček
console.log('\n3️⃣ Trojice jedniček (1,1,1):');
const trojiceJednicek = [1,1,1];
console.log('Kostky:', trojiceJednicek);
console.log('Body:', calculatePoints(trojiceJednicek));
console.log('Má bodující kostky:', hasScoringDice(trojiceJednicek));
console.log('Je validní kombinace:', isValidFarkleCombination(trojiceJednicek));

// Test trojice dvojek
console.log('\n4️⃣ Trojice dvojek (2,2,2):');
const trojiceDvojek = [2,2,2];
console.log('Kostky:', trojiceDvojek);
console.log('Body:', calculatePoints(trojiceDvojek));
console.log('Má bodující kostky:', hasScoringDice(trojiceDvojek));
console.log('Je validní kombinace:', isValidFarkleCombination(trojiceDvojek));

// Test jednotlivých jedniček a pětek
console.log('\n5️⃣ Jedna jednička a jedna pětka (1,5):');
const jednickaAPetka = [1,5];
console.log('Kostky:', jednickaAPetka);
console.log('Body:', calculatePoints(jednickaAPetka));
console.log('Má bodující kostky:', hasScoringDice(jednickaAPetka));
console.log('Je validní kombinace:', isValidFarkleCombination(jednickaAPetka));

// Test FARKLE (2,3,4,6)
console.log('\n6️⃣ FARKLE (2,3,4,6):');
const farkle = [2,3,4,6];
console.log('Kostky:', farkle);
console.log('Body:', calculatePoints(farkle));
console.log('Má bodující kostky:', hasScoringDice(farkle));
console.log('Je validní kombinace:', isValidFarkleCombination(farkle));

console.log('\n🏁 Testování dokončeno!');
