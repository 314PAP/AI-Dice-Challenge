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
    // OPRAVENO: Menší viewport jednotky pro vždy jeden řádek kostek
    dice.className = `dice ${selected ? 'selected' : ''} d-flex justify-content-center align-items-center rounded position-relative`;
    dice.setAttribute('data-value', validValue);
    
    // OPRAVENO: Skutečně responzivní velikost podle CSS
    // Používáme stejnou logiku jako v CSS - clamp() hodnoty
    let vwSize;
    
    // Detekce landscape pro menší kostky
    if (window.innerHeight < window.innerWidth && window.innerHeight <= 600) {
        // Landscape s malou výškou - kompaktní kostky
        vwSize = 'clamp(1.2rem, 4vw, 3rem)';
    } else {
        // Normal nebo portrait - responzivní škálování podle breakpointů
        const width = window.innerWidth;
        if (width >= 1400) {
            vwSize = 'clamp(4rem, 12vw, 10rem)';
        } else if (width >= 1200) {
            vwSize = 'clamp(3.5rem, 10vw, 8rem)';
        } else if (width >= 992) {
            vwSize = 'clamp(3rem, 9vw, 7rem)';
        } else if (width >= 768) {
            vwSize = 'clamp(2.5rem, 8vw, 6rem)';
        } else if (width >= 576) {
            vwSize = 'clamp(2rem, 7vw, 5rem)';
        } else {
            vwSize = 'clamp(1.5rem, 6vw, 4rem)';
        }
    }
    
    dice.style.width = vwSize;
    dice.style.height = vwSize;
    dice.style.minWidth = '1rem'; // Zachováme minimum
    dice.style.minHeight = '1rem';
    dice.style.margin = 'clamp(0.1rem, 0.5vw, 1rem)'; // Responzivní margin
    dice.style.border = '1px solid var(--neon-green)';
    dice.style.flexShrink = '0'; // Zabrání smršťování
    
    // Vytvoření patternu s tečkami podle hodnoty kostky
    let content;
    if (validValue === '?') {
        // Pro házející kostky zobrazíme otazník
        content = document.createElement('div');
        content.className = 'fw-bold';
        
        // Responzivní font podle velikosti obrazovky
        let fontSize;
        const width = window.innerWidth;
        
        if (window.innerHeight < window.innerWidth && window.innerHeight <= 600) {
            // Landscape kompaktní
            fontSize = 'clamp(0.3rem, 1.5vw, 0.8rem)';
        } else if (width >= 1400) {
            fontSize = 'clamp(1.5rem, 4vw, 3rem)';
        } else if (width >= 1200) {
            fontSize = 'clamp(1.2rem, 3.5vw, 2.5rem)';
        } else if (width >= 992) {
            fontSize = 'clamp(1rem, 3vw, 2rem)';
        } else if (width >= 768) {
            fontSize = 'clamp(0.8rem, 2.5vw, 1.5rem)';
        } else {
            fontSize = 'clamp(0.6rem, 2vw, 1rem)';
        }
        
        content.style.fontSize = fontSize; // Responzivní font
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
 * Vytvoří pattern teček pro kostku s viewport-responsive velikostmi
 * @param {number} value - Hodnota kostky (1-6)
 * @returns {HTMLDivElement} Pattern teček
 */
const createDotPattern = (value) => {
    const pattern = document.createElement('div');
    pattern.className = 'position-relative w-100 h-100';
    
    // Vytvoření teček s responzivními velikostmi - podle velikosti obrazovky
    const createDot = (position) => {
        const dot = document.createElement('div');
        
        // Responzivní velikost teček podle šířky obrazovky (jako CSS)
        let dotSize;
        const width = window.innerWidth;
        
        if (window.innerHeight < window.innerWidth && window.innerHeight <= 600) {
            // Landscape kompaktní
            dotSize = 'clamp(1px, 0.8vw, 3px)';
        } else if (width >= 1400) {
            dotSize = 'clamp(4px, 2.5vw, 12px)';
        } else if (width >= 1200) {
            dotSize = 'clamp(3px, 2vw, 10px)';
        } else if (width >= 992) {
            dotSize = 'clamp(2.5px, 1.8vw, 8px)';
        } else if (width >= 768) {
            dotSize = 'clamp(2px, 1.5vw, 6px)';
        } else {
            dotSize = 'clamp(1.5px, 1.2vw, 4px)';
        }
        
        dot.style.width = dotSize;
        dot.style.height = dotSize;
        dot.style.backgroundColor = 'var(--neon-green)';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        dot.style.boxShadow = `0 0 clamp(0.5px, 0.4vw, 3px) var(--neon-green)`;
        
        // Pozicování podle typu
        switch (position) {
            case 'center':
                dot.style.top = '50%';
                dot.style.left = '50%';
                dot.style.transform = 'translate(-50%, -50%)';
                break;
            case 'top-left':
                dot.style.top = '15%';
                dot.style.left = '15%';
                break;
            case 'top-right':
                dot.style.top = '15%';
                dot.style.right = '15%';
                break;
            case 'middle-left':
                dot.style.top = '50%';
                dot.style.left = '15%';
                dot.style.transform = 'translateY(-50%)';
                break;
            case 'middle-right':
                dot.style.top = '50%';
                dot.style.right = '15%';
                dot.style.transform = 'translateY(-50%)';
                break;
            case 'bottom-left':
                dot.style.bottom = '15%';
                dot.style.left = '15%';
                break;
            case 'bottom-right':
                dot.style.bottom = '15%';
                dot.style.right = '15%';
                break;
        }
        return dot;
    };
    
    // Rozdělení teček podle hodnoty
    switch (value) {
        case 1:
            pattern.appendChild(createDot('center'));
            break;
        case 2:
            pattern.appendChild(createDot('top-left'));
            pattern.appendChild(createDot('bottom-right'));
            break;
        case 3:
            pattern.appendChild(createDot('top-left'));
            pattern.appendChild(createDot('center'));
            pattern.appendChild(createDot('bottom-right'));
            break;
        case 4:
            pattern.appendChild(createDot('top-left'));
            pattern.appendChild(createDot('top-right'));
            pattern.appendChild(createDot('bottom-left'));
            pattern.appendChild(createDot('bottom-right'));
            break;
        case 5:
            pattern.appendChild(createDot('top-left'));
            pattern.appendChild(createDot('top-right'));
            pattern.appendChild(createDot('center'));
            pattern.appendChild(createDot('bottom-left'));
            pattern.appendChild(createDot('bottom-right'));
            break;
        case 6:
            pattern.appendChild(createDot('top-left'));
            pattern.appendChild(createDot('top-right'));
            pattern.appendChild(createDot('middle-left'));
            pattern.appendChild(createDot('middle-right'));
            pattern.appendChild(createDot('bottom-left'));
            pattern.appendChild(createDot('bottom-right'));
            break;
    }
    
    return pattern;
};

/**
 * Aktualizuje velikosti kostek při změně orientace
 */
export const updateDiceForOrientation = () => {
    const dices = document.querySelectorAll('.dice');
    
    dices.forEach(dice => {
        let vwSize;
        
        // Stejná logika jako v createDiceElement
        if (window.innerHeight < window.innerWidth && window.innerHeight <= 600) {
            // Landscape s malou výškou - kompaktní kostky
            vwSize = 'clamp(1.2rem, 4vw, 3rem)';
        } else {
            // Normal nebo portrait - responzivní škálování podle breakpointů
            const width = window.innerWidth;
            if (width >= 1400) {
                vwSize = 'clamp(4rem, 12vw, 10rem)';
            } else if (width >= 1200) {
                vwSize = 'clamp(3.5rem, 10vw, 8rem)';
            } else if (width >= 992) {
                vwSize = 'clamp(3rem, 9vw, 7rem)';
            } else if (width >= 768) {
                vwSize = 'clamp(2.5rem, 8vw, 6rem)';
            } else if (width >= 576) {
                vwSize = 'clamp(2rem, 7vw, 5rem)';
            } else {
                vwSize = 'clamp(1.5rem, 6vw, 4rem)';
            }
        }
        
        dice.style.width = vwSize;
        dice.style.height = vwSize;
        dice.style.margin = 'clamp(0.1rem, 0.5vw, 1rem)';
        
        // Aktualizace teček
        const dots = dice.querySelectorAll('div[style*="border-radius: 50%"]');
        dots.forEach(dot => {
            let dotSize;
            const width = window.innerWidth;
            
            if (window.innerHeight < window.innerWidth && window.innerHeight <= 600) {
                dotSize = 'clamp(1px, 0.8vw, 3px)';
            } else if (width >= 1400) {
                dotSize = 'clamp(4px, 2.5vw, 12px)';
            } else if (width >= 1200) {
                dotSize = 'clamp(3px, 2vw, 10px)';
            } else if (width >= 992) {
                dotSize = 'clamp(2.5px, 1.8vw, 8px)';
            } else if (width >= 768) {
                dotSize = 'clamp(2px, 1.5vw, 6px)';
            } else {
                dotSize = 'clamp(1.5px, 1.2vw, 4px)';
            }
            
            dot.style.width = dotSize;
            dot.style.height = dotSize;
            dot.style.boxShadow = `0 0 clamp(0.5px, 0.4vw, 3px) var(--neon-green)`;
        });
        
        // Aktualizace otazníku
        const questionMark = dice.querySelector('.fw-bold');
        if (questionMark) {
            let fontSize;
            const width = window.innerWidth;
            
            if (window.innerHeight < window.innerWidth && window.innerHeight <= 600) {
                fontSize = 'clamp(0.3rem, 1.5vw, 0.8rem)';
            } else if (width >= 1400) {
                fontSize = 'clamp(1.5rem, 4vw, 3rem)';
            } else if (width >= 1200) {
                fontSize = 'clamp(1.2rem, 3.5vw, 2.5rem)';
            } else if (width >= 992) {
                fontSize = 'clamp(1rem, 3vw, 2rem)';
            } else if (width >= 768) {
                fontSize = 'clamp(0.8rem, 2.5vw, 1.5rem)';
            } else {
                fontSize = 'clamp(0.6rem, 2vw, 1rem)';
            }
            questionMark.style.fontSize = fontSize;
        }
    });
};
