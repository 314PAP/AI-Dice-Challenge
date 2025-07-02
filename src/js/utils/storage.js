/**
 * Storage Utilities
 * Funkce pro práci s localStorage
 */

/**
 * Uloží data do localStorage
 * @param {string} key - Klíč
 * @param {any} data - Data k uložení
 * @returns {boolean} True pokud bylo úspěšné
 */
export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Chyba při ukládání do localStorage:', error);
        return false;
    }
}

/**
 * Načte data z localStorage
 * @param {string} key - Klíč
 * @param {any} defaultValue - Výchozí hodnota
 * @returns {any} Načtená data nebo výchozí hodnota
 */
export function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Chyba při načítání z localStorage:', error);
        return defaultValue;
    }
}

/**
 * Odstraní data z localStorage
 * @param {string} key - Klíč
 * @returns {boolean} True pokud bylo úspěšné
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Chyba při odstraňování z localStorage:', error);
        return false;
    }
}

/**
 * Vyčistí celý localStorage
 * @returns {boolean} True pokud bylo úspěšné
 */
export function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Chyba při čištění localStorage:', error);
        return false;
    }
}

/**
 * Zkontroluje, zda je localStorage dostupný
 * @returns {boolean} True pokud je localStorage dostupný
 */
export function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

/**
 * Získá velikost localStorage v bytech
 * @returns {number} Velikost v bytech
 */
export function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
}

/**
 * Získá všechny klíče z localStorage
 * @returns {string[]} Pole klíčů
 */
export function getAllStorageKeys() {
    return Object.keys(localStorage);
}
