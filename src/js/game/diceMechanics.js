/**
 * Dice Mechanics - Mechaniky pro práci s kostkami
 * Modul obsahuje veškerou logiku pro házení kostkami a vyhodnocování výsledků
 */

import { DICE_CONSTANTS } from '../utils/constants.js';

/**
 * Vygeneruje náhodný hod kostkou (1-6)
 * @returns {number} Hodnota kostky 1-6
 */
export const rollDie = () => {
    return Math.floor(Math.random() * DICE_CONSTANTS.MAX_VALUE) + DICE_CONSTANTS.MIN_VALUE;
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
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        if (counts[value] >= 3) {
            // Speciální bodování pro jednotky
            if (value === DICE_CONSTANTS.MIN_VALUE) {
                points += DICE_CONSTANTS.ONES_TRIPLET_POINTS * Math.floor(counts[value] / 3);
            } else {
                points += value * DICE_CONSTANTS.TRIPLET_BASE_POINTS * Math.floor(counts[value] / 3);
            }
            
            // Odečteme již započítané kostky
            counts[value] %= 3;
        }
    }
    
    // Jednotlivé jedničky a pětky
    points += counts[DICE_CONSTANTS.MIN_VALUE] * DICE_CONSTANTS.SINGLE_ONE_POINTS; // Každá jednotka 100 bodů
    points += counts[5] * DICE_CONSTANTS.SINGLE_FIVE_POINTS;  // Každá pětka 50 bodů
    
    return points;
};

/**
 * Spočítá výskyt hodnot kostek
 * @param {Array<number>} dice - Pole s hodnotami kostek
 * @returns {Object} Objekt s počty jednotlivých hodnot
 */
export const countDiceValues = (dice) => {
    const counts = {};
    
    // Inicializace počítadel pro všechny možné hodnoty kostek
    for (let i = DICE_CONSTANTS.MIN_VALUE; i <= DICE_CONSTANTS.MAX_VALUE; i++) {
        counts[i] = 0;
    }
    
    // Počítání výskytů hodnot
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
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        if (counts[value] >= 3) return true;
    }
    
    // Kontrola na jedničky a pětky
    if (counts[DICE_CONSTANTS.MIN_VALUE] > 0 || counts[5] > 0) return true;
    
    return false;
};
