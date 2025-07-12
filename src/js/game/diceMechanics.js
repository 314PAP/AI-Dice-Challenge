/**
 * Dice Mechanics - Mechaniky pro práci s kostkami
 * Modul obsahuje veškerou logiku pro házení kostkami a vyhodnocování výsledků
 */

/**
 * SEZNAM POUŽÍVANÝCH CSS TŘÍD:
 * Bootstrap: (žádné přímé CSS třídy - čisté game logic)
 * Neon třídy: (žádné - logika bez UI)
 * Vlastní: (žádné - čistá logika)
 */

/**
 * SEZNAM PROMĚNNÝCH (lokální v metodách):
 * result, i, points, counts, count, value, die
 * 
 * MOŽNÉ DUPLICITY: 
 * - counts (používá se v calculatePoints, hasScoringDice, isValidFarkleCombination - OK, různé scope)
 * - count (používá se v calculatePoints a isValidFarkleCombination - OK, různé scope)
 * - value (používá se ve všech for cyklech - OK, lokální scope)
 */

// Konstanty pro kostky
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
    
    // NEJPRVE KONTROLA TŘÍ PÁRŮ (nejvyšší priorita)
    // Tři páry = 1500 bodů (např. 2,2,6,6,3,3)
    let pairCount = 0;
    const originalCounts = { ...counts }; // Kopie pro kontrolu párů
    
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        if (originalCounts[value] === 2) {
            pairCount++;
        }
    }
    
    if (pairCount === 3) {
        console.log(`🎯 Detekovány TŘI PÁRY = 1500 bodů`);
        return 1500; // Tři páry = 1500 bodů (žádné jiné kombinace se nepočítají)
    }
    
    // Tři a více stejných kostek - podle počtu kostek
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        const count = counts[value];
        if (count >= 3) {
            // Speciální bodování pro jednotky
            if (value === DICE_CONSTANTS.MIN_VALUE) {
                // Trojice jedniček = 1000, čtveřice = 2000, pětice = 4000, šestica = 8000
                switch (count) {
                    case 3: points += 1000; break;
                    case 4: points += 2000; break;
                    case 5: points += 4000; break;
                    case 6: points += 8000; break;
                }
            } else {
                // Ostatní čísla: trojice = hodnota × 100, pak se zdvojnásobuje
                switch (count) {
                    case 3: points += value * 100; break;    // 3×2 = 200
                    case 4: points += value * 200; break;    // 4×2 = 400  
                    case 5: points += value * 400; break;    // 5×2 = 800
                    case 6: points += value * 800; break;    // 6×2 = 1600
                }
            }
            
            // Odečteme již započítané kostky
            counts[value] = 0;
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
    console.log(`🎲 hasScoringDice() volána s kostkami:`, dice);
    
    if (!dice || !dice.length) {
        console.log(`❌ Žádné kostky nebo prázdný array`);
        return false;
    }
    
    const counts = countDiceValues(dice);
    console.log(`🔢 Počty hodnot:`, counts);
    
    // KONTROLA TŘÍ PÁRŮ (nejvyšší priorita)
    let pairCount = 0;
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        if (counts[value] === 2) {
            pairCount++;
        }
    }
    
    if (pairCount === 3) {
        console.log(`✅ Nalezeny TŘI PÁRY = 1500 bodů`);
        return true;
    }
    
    // Kontrola na tři a více stejných kostek
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        if (counts[value] >= 3) {
            console.log(`✅ Nalezeny 3+ kostky hodnoty ${value}: ${counts[value]}x`);
            return true;
        }
    }
    
    // Kontrola na jedničky a pětky
    if (counts[DICE_CONSTANTS.MIN_VALUE] > 0) {
        console.log(`✅ Nalezeny jedničky: ${counts[DICE_CONSTANTS.MIN_VALUE]}x`);
        return true;
    }
    
    if (counts[5] > 0) {
        console.log(`✅ Nalezeny pětky: ${counts[5]}x`);
        return true;
    }
    
    console.log(`❌ Žádné bodující kostky nenalezeny`);
    return false;
};

/**
 * Zkontroluje, zda vybrané kostky tvoří platnou Farkle kombinaci
 * @param {Array<number>} selectedDice - Vybrané kostky k validaci
 * @returns {boolean} True pokud kombinace je validní podle Farkle pravidel
 */
export const isValidFarkleCombination = (selectedDice) => {
    if (!selectedDice || selectedDice.length === 0) return false;
    
    const counts = countDiceValues(selectedDice);
    
    // KONTROLA TŘÍ PÁRŮ
    let pairCount = 0;
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        if (counts[value] === 2) {
            pairCount++;
        }
    }
    
    if (pairCount === 3 && selectedDice.length === 6) {
        return true; // Tři páry jsou vždy validní
    }
    
    // Projdeme všechny hodnoty kostek
    for (let value = DICE_CONSTANTS.MIN_VALUE; value <= DICE_CONSTANTS.MAX_VALUE; value++) {
        const count = counts[value];
        if (count === 0) continue; // Žádné kostky této hodnoty
        
        if (value === DICE_CONSTANTS.MIN_VALUE || value === 5) {
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
