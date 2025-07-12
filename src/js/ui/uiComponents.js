/**
 * SEZNAM POUŽÍVANÝCH CSS TŘÍD:
 * Bootstrap: btn, btn-sm, btn-outline-*, d-flex, align-items-center, me-2, position-relative, text-center, fw-bold, fs-5, border-2, rounded-3, card, card-body, p-3
 * Neon třídy: btn-neon, text-neon-*, border-neon-*, bg-neon-black
 * Vlastní: dice-item, dice-selected, dice-rolling, neon-glow
 */

/**
 * SEZNAM PROMĚNNÝCH (lokální v metodách):
 * button, icon, dice, card, cardBody
 * 
 * MOŽNÉ DUPLICITY: 
 * - Žádné duplicity nalezeny - každá komponenta má své vlastní lokální proměnné
 */

/**
 * UI Components - Správa UI komponent a jejich renderování
 * Modul obsahuje funkce pro vytváření a aktualizaci UI prvků
 */

import { UI_CONSTANTS, NEON_COLORS, DICE_CONSTANTS } from '../utils/constants.js';
import { CONSOLE_COLORS } from '../utils/colors.js';

/**
 * Vytvoří tlačítko s neonovým efektem - plně responzivní pro všechny režimy zobrazení
 * @param {string} text - Text tlačítka
 * @param {string} color - Barva tlačítka (green, blue, purple, orange, yellow)
 * @param {string} [icon=null] - Bootstrap ikona (bi-xxx)
 * @param {Function} [onClick=null] - Click handler
 * @param {string} [additionalClasses=""] - Další CSS třídy
 * @returns {HTMLButtonElement} Vytvořené tlačítko
 */
export const createNeonButton = (text, color, icon = null, onClick = null, additionalClasses = "") => {
    // Validace barvy pomocí konstant
    const validColor = Object.values(NEON_COLORS).includes(color) ? color : NEON_COLORS.GREEN;
    
    const button = document.createElement('button');
    button.className = `btn btn-neon ${additionalClasses}`;
    button.setAttribute('data-neon-color', validColor);
    
    let buttonContent = '';
    
    if (icon) {
        // Menší mezera na malých zařízeních pro úsporu místa
        buttonContent += `<i class="bi ${icon} me-1 me-sm-2"></i>`;
    }
    
    // Pro velmi malé displeje použijeme Bootstrap třídy místo testování window.innerHeight
    // Responzivní zobrazení textu s využitím Bootstrap tříd
    const isShortText = text.length <= 12; // Zvětšen limit z 10 na 12, aby se vešlo "UKONČIT HRU"
    const displayText = !isShortText ? 
        `<span class="d-none d-landscape-inline">${text}</span><span class="d-inline d-landscape-none">${text.substring(0, 4)}...</span>` : 
        text;
    
    buttonContent += displayText;
    button.innerHTML = buttonContent;
    
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
};

/**
 * Vytvoří kartu s neonovým okrajem
 * @param {string} title - Nadpis karty
 * @param {string} color - Barva karty (green, blue, purple, orange, yellow)
 * @param {string} [content=""] - Obsah karty
 * @param {string} [headerIcon=null] - Bootstrap ikona pro hlavičku (bi-xxx)
 * @returns {HTMLDivElement} Vytvořená karta
 */
export const createNeonCard = (title, color, content = "", headerIcon = null) => {
    // Validace barvy pomocí konstant
    const validColor = Object.values(NEON_COLORS).includes(color) ? color : NEON_COLORS.BLUE;
    
    const card = document.createElement('div');
    card.className = `card bg-black border-wide-neon-${validColor} mb-3`;
    
    let headerContent = '';
    if (headerIcon) {
        headerContent += `<i class="bi ${headerIcon} me-2"></i>`;
    }
    headerContent += title;
    
    card.innerHTML = `
        <div class="card-header text-neon-${validColor}">
            ${headerContent}
        </div>
        <div class="card-body">
            ${content}
        </div>
    `;
    
    return card;
};

/**
 * Vytvoří dice element pro herní plochu
 * @param {number} value - Hodnota kostky (1-6)
 * @param {boolean} [selected=false] - Zda je kostka vybraná
 * @param {Function} [onClick=null] - Click handler
 * @returns {HTMLDivElement} Vytvořený element kostky
 */
export const createDiceElement = (value, selected = false, onClick = null) => {
    // Validace hodnoty pomocí konstant - speciální případ pro házející kostky
    let validValue;
    if (value === '?' || value === 0) {
        validValue = '?';
    } else {
        validValue = Math.min(Math.max(value, DICE_CONSTANTS.MIN_VALUE), DICE_CONSTANTS.MAX_VALUE);
    }
    
    const dice = document.createElement('div');
    dice.className = `dice ${selected ? 'selected' : ''} d-flex justify-content-center align-items-center rounded`;
    dice.setAttribute('data-value', validValue);
    
    
    // Vytvoření patternu s tečkami podle hodnoty kostky
    let content;
    if (validValue === '?') {
        // Pro házející kostky zobrazíme otazník
        content = document.createElement('div');
        content.className = 'fs-4 fw-bold';
        content.textContent = '?';
    } else {
        content = createDotPattern(validValue);
    }
    
    dice.appendChild(content);
    
    if (onClick) {
        dice.addEventListener('click', onClick);
    }
    
    return dice;
};

/**
 * Vytvoří pattern teček pro kostku
 * @param {number} value - Hodnota kostky (1-6)
 * @returns {HTMLDivElement} Pattern teček
 */
const createDotPattern = (value) => {
    const pattern = document.createElement('div');
    pattern.className = 'position-relative w-100 h-100'; // Změna na relativní pozicování
    
    const dotCount = value;
    
    // Rozdělení teček podle hodnoty
    switch (dotCount) {
        case 1:
            pattern.innerHTML = `<div class="dot center"></div>`;
            break;
        case 2:
            pattern.innerHTML = `
                <div class="dot top-left"></div>
                <div class="dot bottom-right"></div>
            `;
            break;
        case 3:
            pattern.innerHTML = `
                <div class="dot top-left"></div>
                <div class="dot center"></div>
                <div class="dot bottom-right"></div>
            `;
            break;
        case 4:
            pattern.innerHTML = `
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
            `;
            break;
        case 5:
            pattern.innerHTML = `
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot center"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
            `;
            break;
        case 6:
            pattern.innerHTML = `
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot middle-left"></div>
                <div class="dot middle-right"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
            `;
            break;
    }
    
    return pattern;
};
