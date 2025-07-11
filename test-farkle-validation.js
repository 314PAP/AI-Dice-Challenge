// Test Farkle validace kombinací
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

// Validace jestli vybrané kostky tvoří platnou Farkle kombinaci
const isValidFarkleCombination = (selectedDice) => {
    if (!selectedDice || selectedDice.length === 0) return false;
    
    const counts = countDiceValues(selectedDice);
    
    // Projdeme všechny hodnoty kostek
    for (let value = 1; value <= 6; value++) {
        const count = counts[value];
        if (count === 0) continue; // Žádné kostky této hodnoty
        
        if (value === 1 || value === 5) {
            // Jedničky a pětky: můžeme mít libovolný počet (1+, nebo 3+ pro trojice)
            // Vše je validní - jednotlivé i trojice
            continue;
        } else {
            // Pro 2,3,4,6: MUSÍME mít alespoň 3 stejné (trojice či více)
            if (count < 3) {
                return false; // Nevalidní - máme 2,3,4,6 ale méně než 3 kusy
            }
        }
    }
    
    return true;
};

// Test případy
console.log('=== TESTY FARKLE VALIDACE ===');
console.log('Test 1 - [1] (validní):', isValidFarkleCombination([1]));          // true
console.log('Test 2 - [5] (validní):', isValidFarkleCombination([5]));          // true  
console.log('Test 3 - [1,5] (validní):', isValidFarkleCombination([1,5]));      // true
console.log('Test 4 - [1,1,1] (validní):', isValidFarkleCombination([1,1,1]));  // true
console.log('Test 5 - [2,2,2] (validní):', isValidFarkleCombination([2,2,2]));  // true
console.log('Test 6 - [2] (NEvalidní):', isValidFarkleCombination([2]));        // false
console.log('Test 7 - [2,3] (NEvalidní):', isValidFarkleCombination([2,3]));    // false
console.log('Test 8 - [1,2] (NEvalidní):', isValidFarkleCombination([1,2]));    // false - mícháme validní s nevalidní
console.log('Test 9 - [1,2,3] (NEvalidní):', isValidFarkleCombination([1,2,3]));// false
console.log('Test 10 - [2,2] (NEvalidní):', isValidFarkleCombination([2,2]));   // false - jen 2 dvojky
console.log('Test 11 - [1,1,5,2,2,2] (validní):', isValidFarkleCombination([1,1,5,2,2,2])); // true
