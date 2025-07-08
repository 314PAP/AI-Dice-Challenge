/**
 * Helper Functions - Pomocné utility funkce
 */

/**
 * Funkce pro zpoždění (sleep)
 * @param {number} ms - Počet milisekund
 * @returns {Promise} Promise
 */
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Vytvoří náhodný ID řetězec
 * @returns {string} Náhodné ID
 */
export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Bezpečně uloží objekt do localStorage
 * @param {string} key - Klíč pro localStorage
 * @param {Object} data - Data k uložení
 */
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Chyba při ukládání do localStorage (${key}):`, error);
    }
};

/**
 * Bezpečně načte objekt z localStorage
 * @param {string} key - Klíč pro localStorage
 * @param {*} defaultValue - Výchozí hodnota, pokud klíč neexistuje
 * @returns {*} Načtená data nebo výchozí hodnota
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Chyba při načítání z localStorage (${key}):`, error);
        return defaultValue;
    }
};

/**
 * Formátuje číslo jako skóre s mezerami mezi tisíci
 * @param {number} number - Číslo k formátování
 * @returns {string} Formátované číslo
 */
export const formatScore = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

/**
 * Bezpečná event emitter funkce pro vlastní události
 * @param {string} eventName - Název události
 * @param {Object} detail - Detail události
 * @param {HTMLElement} target - Element, na kterém se má událost vyvolat
 */
export const emitCustomEvent = (eventName, detail = {}, target = document) => {
    try {
        const event = new CustomEvent(eventName, { detail });
        target.dispatchEvent(event);
    } catch (error) {
        console.error(`Chyba při emitování události ${eventName}:`, error);
    }
};
