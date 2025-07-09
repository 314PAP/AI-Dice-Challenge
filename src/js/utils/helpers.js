/**
 * Helper Functions - Pomocné utility funkce
 */

import { STORAGE_KEYS, UI_CONSTANTS } from './constants.js';
import { CONSOLE_COLORS, pxToRem } from './colors.js';

/**
 * Funkce pro zpoždění (sleep)
 * @param {number} ms - Počet milisekund, nebo použije přednastavené hodnoty z UI_CONSTANTS
 * @param {string} [type='default'] - Typ zpoždění ('ai', 'message', 'default')
 * @returns {Promise} Promise
 */
export const sleep = (ms, type = 'default') => {
    // Pokud není zadaná hodnota nebo je 0, použije konstanty podle typu
    if (!ms) {
        switch(type) {
            case 'ai':
                ms = UI_CONSTANTS.AI_RESPONSE_DELAY;
                break;
            case 'message':
                ms = UI_CONSTANTS.MESSAGE_DELAY;
                break;
            default:
                ms = 300; // Výchozí hodnota
        }
    }
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
 * @param {string} key - Klíč pro localStorage, lze použít hodnotu z STORAGE_KEYS
 * @param {Object} data - Data k uložení
 */
export const saveToLocalStorage = (key, data) => {
    try {
        // Ověří, zda je klíč jedním z předdefinovaných klíčů
        const storageKey = Object.values(STORAGE_KEYS).includes(key) ? key : STORAGE_KEYS.GAME_SETTINGS;
        localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
        stylizedLog(`Chyba při ukládání do localStorage (${key}):`, error, 'error');
    }
};

/**
 * Bezpečně načte objekt z localStorage
 * @param {string} key - Klíč pro localStorage, lze použít hodnotu z STORAGE_KEYS
 * @param {*} defaultValue - Výchozí hodnota, pokud klíč neexistuje
 * @returns {*} Načtená data nebo výchozí hodnota
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        // Ověří, zda je klíč jedním z předdefinovaných klíčů
        const storageKey = Object.values(STORAGE_KEYS).includes(key) ? key : STORAGE_KEYS.GAME_SETTINGS;
        const item = localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        stylizedLog(`Chyba při načítání z localStorage (${key}):`, error, 'error');
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
        stylizedLog(`Chyba při emitování události ${eventName}:`, error, 'error');
    }
};

/**
 * Stylizovaný výpis do konzole s použitím neonových barev
 * @param {string} message - Hlavní zpráva
 * @param {*} [data=null] - Doplňující data k výpisu
 * @param {string} [type='info'] - Typ zprávy (info, success, warning, error)
 */
export const stylizedLog = (message, data = null, type = 'info') => {
    let style = '';
    let prefix = '';
    
    // Výběr stylu podle typu zprávy
    switch(type) {
        case 'success':
            style = `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;`;
            prefix = '✓ SUCCESS: ';
            break;
        case 'warning':
            style = `color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold;`;
            prefix = '⚠ WARNING: ';
            break;
        case 'error':
            style = `color: ${CONSOLE_COLORS.neonRed}; font-weight: bold;`;
            prefix = '✗ ERROR: ';
            break;
        default:
            style = `color: ${CONSOLE_COLORS.neonBlue}; font-weight: bold;`;
            prefix = 'ℹ INFO: ';
    }
    
    if (data) {
        console.log(`%c${prefix}${message}`, style, data);
    } else {
        console.log(`%c${prefix}${message}`, style);
    }
};

/**
 * Převede velikost z pixelů na rem jednotky
 * @param {number} px - Hodnota v pixelech
 * @returns {string} Hodnota v rem jednotkách
 * @deprecated Použijte pxToRem z colors.js
 */
export const pxToRemDeprecated = (px) => {
    return pxToRem(px);
};
