// Test farkle logiky
const countDiceValues = (dice) => {
    const counts = {};
    for (let i = 1; i <= 6; i++) {
        counts[i] = 0;
    }
    for (const die of dice) {
        counts[die]++;
    }
    return counts;
};

const hasScoringDice = (dice) => {
    if (!dice || !dice.length) return false;
    const counts = countDiceValues(dice);
    
    // Kontrola na tři a více stejných kostek
    for (let value = 1; value <= 6; value++) {
        if (counts[value] >= 3) return true;
    }
    
    // Kontrola na jedničky a pětky
    if (counts[1] > 0 || counts[5] > 0) return true;
    
    return false;
};

// Test případů
console.log('=== TESTY FARKLE LOGIKY ===');
console.log('Test 1 - farkle [2,3,4,6,2,4]:', hasScoringDice([2,3,4,6,2,4]));  
console.log('Test 2 - má body [1,3,4,6,2,4]:', hasScoringDice([1,3,4,6,2,4]));  
console.log('Test 3 - má body [2,5,4,6,2,4]:', hasScoringDice([2,5,4,6,2,4]));  
console.log('Test 4 - tři stejné [2,2,2,6,3,4]:', hasScoringDice([2,2,2,6,3,4]));  
console.log('Test 5 - farkle [2,3,4,6,3,4]:', hasScoringDice([2,3,4,6,3,4]));  
console.log('Test 6 - farkle [2,3,4,6,2,3]:', hasScoringDice([2,3,4,6,2,3]));  
console.log('Test 7 - farkle [2,2,3,3,4,4]:', hasScoringDice([2,2,3,3,4,4])); // Tři páry - NE FARKLE jen někde 
console.log('Test 8 - farkle [2,3,4,6,2,6]:', hasScoringDice([2,3,4,6,2,6])); // Dva páry - FARKLE

// Detail pro test 5
console.log('\n=== DETAIL TEST 5 [2,3,4,6,3,4] ===');
const test5 = [2,3,4,6,3,4];
const counts5 = countDiceValues(test5);
console.log('Počty:', counts5);
console.log('Trojice?:', Object.values(counts5).some(count => count >= 3));
console.log('Jedničky?:', counts5[1] > 0);
console.log('Pětky?:', counts5[5] > 0);
