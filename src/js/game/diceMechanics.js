/**
 * Dice Mechanics - Mechaniky pro práci s kostkami
 * Modul obsahuje veškerou logiku pro házení kostkami a vyhodnocování výsledků
 */

/**
 * Vygeneruje náhodný hod kostkou (1-6)
 * @returns {number} Hodnota kostky 1-6
 */
export const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
};

/**
 * Vygeneruje hod více kostkami najednou
 * @param {number} count - Počet kostek
 * @returns {Array<number>} Pole s hodnotami kostek
 */
export const rollDice = (count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(rollDie());
    }
    return result;
};

/**
 * Spočítá body z daného hodu kostek
 * @param {Array<number>} dice - Pole s hodnotami kostek
 * @returns {number} Počet bodů
 */
export const calculatePoints = (dice) => {
    if (!dice || !dice.length) return 0;
    
    let points = 0;
    const counts = countDiceValues(dice);
    
    // Tři a více stejných kostek
    for (let value = 1; value <= 6; value++) {
        if (counts[value] >= 3) {
            // Speciální bodování pro jednotky
            if (value === 1) {
                points += 1000 * Math.floor(counts[value] / 3);
            } else {
                points += value * 100 * Math.floor(counts[value] / 3);
            }
            
            // Odečteme již započítané kostky
            counts[value] %= 3;
        }
    }
    
    // Jednotlivé jedničky a pětky
    points += counts[1] * 100; // Každá jednotka 100 bodů
    points += counts[5] * 50;  // Každá pětka 50 bodů
    
    return points;
};

/**
 * Spočítá výskyt hodnot kostek
 * @param {Array<number>} dice - Pole s hodnotami kostek
 * @returns {Object} Objekt s počty jednotlivých hodnot
 */
export const countDiceValues = (dice) => {
    const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
    
    for (const die of dice) {
        counts[die]++;
    }
    
    return counts;
};

/**
 * Zkontroluje, zda daný hod kostek obsahuje bodované kombinace
 * @param {Array<number>} dice - Pole s hodnotami kostek
 * @returns {boolean} True pokud hod obsahuje bodovanou kombinaci
 */
export const hasScoringDice = (dice) => {
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
