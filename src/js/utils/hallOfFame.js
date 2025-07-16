/**
 * Hall of Fame - Správa síně slavy
 * Ukládání a načítání nejlepších výsledků hráčů
 */

import { STORAGE_KEYS } from './constants.js';
import { saveToLocalStorage, loadFromLocalStorage } from './helpers.js';

/**
 * Přidá nové skóre do síně slavy
 * @param {string} playerName - Jméno hráče
 * @param {number} score - Dosažené skóre
 */
export const addScoreToHallOfFame = (playerName, score) => {
    try {
        // Načteme současnou síň slavy
        const currentHallOfFame = getHallOfFame();
        
        // Přidáme nové skóre
        const newEntry = {
            name: playerName,
            score: score,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        currentHallOfFame.push(newEntry);
        
        // Seřadíme podle skóre (sestupně) a vezmeme top 10
        const sortedHallOfFame = currentHallOfFame
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        
        // Uložíme zpět
        saveToLocalStorage(STORAGE_KEYS.HALL_OF_FAME, sortedHallOfFame);
        
        console.log(`🏆 Přidáno do síně slavy: ${playerName} - ${score} bodů`);
        return true;
    } catch (error) {
        console.error('❌ Chyba při ukládání do síně slavy:', error);
        return false;
    }
};

/**
 * Načte síň slavy z localStorage
 * @returns {Array} Pole s nejlepšími výsledky
 */
export const getHallOfFame = () => {
    try {
        const hallOfFame = loadFromLocalStorage(STORAGE_KEYS.HALL_OF_FAME, []);
        return Array.isArray(hallOfFame) ? hallOfFame : [];
    } catch (error) {
        console.error('❌ Chyba při načítání síně slavy:', error);
        return [];
    }
};

/**
 * Vymaže celou síň slavy
 */
export const clearHallOfFame = () => {
    try {
        saveToLocalStorage(STORAGE_KEYS.HALL_OF_FAME, []);
        console.log('🗑️ Síň slavy byla vymazána');
        return true;
    } catch (error) {
        console.error('❌ Chyba při mazání síně slavy:', error);
        return false;
    }
};

/**
 * Zkontroluje, jestli je skóre dostatečně dobré na zápis do síně slavy
 * @param {number} score - Skóre ke kontrole
 * @returns {boolean} True pokud se skóre dostane do top 10
 */
export const isScoreWorthyOfHallOfFame = (score) => {
    try {
        const hallOfFame = getHallOfFame();
        
        // Pokud je síň slavy prázdná nebo má méně než 10 záznamů
        if (hallOfFame.length < 10) {
            return true;
        }
        
        // Pokud je skóre lepší než nejhorší v top 10
        const worstScore = hallOfFame[hallOfFame.length - 1].score;
        return score > worstScore;
    } catch (error) {
        console.error('❌ Chyba při kontrole síně slavy:', error);
        return false;
    }
};
