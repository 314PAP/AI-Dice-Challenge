/**
 * Dice Game Mechanics
 * Funkce pro házení kostkami a výpočet skóre
 */

/**
 * Hodí jednou kostkou
 * @returns {number} Hodnota 1-6
 */
export function rollSingleDie() {
    return Math.floor(Math.random() * 6) + 1;
}

/**
 * Vypočítá skóre z pole hodnot kostek podle pravidel Farkle
 * @param {number[]} dice - Pole hodnot kostek
 * @returns {number} Skóre
 */
export function calculateScore(dice) {
    if (dice.length === 0) return 0;
    
    let score = 0;
    let counts = [0, 0, 0, 0, 0, 0, 0]; // index 0 unused, 1-6 for die values
    
    dice.forEach(die => counts[die]++);
    
    // Speciální kombinace - POSTUPKA (1-2-3-4-5-6)
    if (dice.length === 6 && counts.every(count => count === 1)) {
        return 1500; // Postupka = 1500 bodů
    }
    
    // Speciální kombinace - TŘI PÁRY
    if (dice.length === 6) {
        const pairs = counts.filter(count => count === 2).length;
        if (pairs === 3 && counts.filter(count => count > 0).length === 3) {
            return 1500; // Tři páry = 1500 bodů
        }
    }
    
    // Zpracování trojic a víc
    for (let i = 1; i <= 6; i++) {
        if (counts[i] >= 3) {
            let multiplier = counts[i] - 2; // 3=1x, 4=2x, 5=4x, 6=8x
            if (counts[i] >= 4) {
                multiplier = Math.pow(2, counts[i] - 3);
            }
            
            if (i === 1) {
                score += 1000 * multiplier; // Trojice jedniček
            } else {
                score += i * 100 * multiplier; // Trojice ostatních
            }
            counts[i] = 0; // Spotřebované kostky
        }
    }
    
    // Jednotlivé 1s a 5s (pouze pokud nebyly spotřebované v trojicích)
    score += counts[1] * 100; // Zbývající jedničky = 100 bodů
    score += counts[5] * 50;  // Zbývající pětky = 50 bodů
    
    return score;
}

/**
 * Hodí určitým počtem kostek
 * @param {number} numberOfDice - Počet kostek k hození
 * @returns {Array} Pole objektů s hodnotami kostek
 */
export function rollDice(numberOfDice) {
    const dice = [];
    for (let i = 0; i < numberOfDice; i++) {
        dice.push({
            value: rollSingleDie(),
            selected: false
        });
    }
    return dice;
}

/**
 * Zkontroluje, zda kostky obsahují bodující kombinaci
 * @param {number[]} diceValues - Hodnoty kostek
 * @returns {boolean} True pokud kostky obsahují bodující kombinaci
 */
export function hasScoringDice(diceValues) {
    return calculateScore(diceValues) > 0;
}

/**
 * Zjistí všechny možné bodující kombinace z kostek
 * @param {number[]} diceValues - Hodnoty kostek
 * @returns {Array} Pole objektů s kombinacemi {dice: [...], score: number}
 */
export function getAllScoringCombinations(diceValues) {
    const combinations = [];
    
    // Postupka
    if (diceValues.length === 6 && [1,2,3,4,5,6].every(val => diceValues.includes(val))) {
        combinations.push({ dice: [...diceValues], score: 1500, name: 'Postupka' });
        return combinations; // Postupka má přednost
    }
    
    // Tři páry
    if (diceValues.length === 6) {
        const counts = [0, 0, 0, 0, 0, 0, 0];
        diceValues.forEach(die => counts[die]++);
        const pairs = counts.filter(count => count === 2).length;
        if (pairs === 3 && counts.filter(count => count > 0).length === 3) {
            combinations.push({ dice: [...diceValues], score: 1500, name: 'Tři páry' });
            return combinations; // Tři páry mají přednost
        }
    }
    
    // Jednotlivé trojice a více
    const counts = [0, 0, 0, 0, 0, 0, 0];
    diceValues.forEach(die => counts[die]++);
    
    for (let value = 1; value <= 6; value++) {
        if (counts[value] >= 3) {
            const tripletDice = Array(counts[value]).fill(value);
            let multiplier = Math.pow(2, Math.max(0, counts[value] - 3));
            let baseScore = value === 1 ? 1000 : value * 100;
            combinations.push({ 
                dice: tripletDice, 
                score: baseScore * multiplier, 
                name: `${counts[value]} ${value}${counts[value] > 1 ? 's' : ''}` 
            });
        }
    }
    
    // Jednotlivé 1s a 5s
    const remaining1s = counts[1] % 3;
    const remaining5s = counts[5] % 3;
    
    for (let i = 0; i < remaining1s; i++) {
        combinations.push({ dice: [1], score: 100, name: 'Jednička' });
    }
    
    for (let i = 0; i < remaining5s; i++) {
        combinations.push({ dice: [5], score: 50, name: 'Pětka' });
    }
    
    return combinations;
}

/**
 * Kontroluje, zda je možné odložit vybrané kostky
 * Podle pravidel Farkle můžete odložit JAKOUKOLIV bodující kombinaci
 * @param {number[]} allDice - Všechny kostky z hodu
 * @param {number[]} selectedDice - Vybrané kostky k odložení
 * @returns {boolean} True pokud je výběr validní
 */
export function validateDiceSelection(allDice, selectedDice) {
    // Pokud nejsou vybrané žádné kostky, neplatné
    if (!selectedDice || selectedDice.length === 0) {
        return false;
    }
    
    // Vypočítej skóre vybraných kostek
    const selectedScore = calculateScore(selectedDice);
    
    // Pokud vybrané kostky nemají skóre, neplatné
    if (selectedScore === 0) {
        return false;
    }
    
    // Zkontroluj, zda všechny kostky z hodu mají nějaké skóre (jinak FARKLE)
    const allScore = calculateScore(allDice);
    if (allScore === 0) {
        return false; // FARKLE
    }
    
    // Validní výběr - vybrané kostky mají skóre
    return true;
}

/**
 * Najde nejlepší možnou bodující kombinaci
 * @param {number[]} diceValues - Hodnoty kostek
 * @returns {Object|null} {dice: [...], score: number} nebo null
 */
export function findBestScoringCombination(diceValues) {
    const combinations = getAllScoringCombinations(diceValues);
    
    if (combinations.length === 0) return null;
    
    // Seřadit podle skóre sestupně
    combinations.sort((a, b) => b.score - a.score);
    
    return combinations[0];
}
