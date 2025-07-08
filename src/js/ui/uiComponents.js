/**
 * UI Components - Správa UI komponent a jejich renderování
 * Modul obsahuje funkce pro vytváření a aktualizaci UI prvků
 */

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
    const button = document.createElement('button');
    button.className = `btn btn-neon ${additionalClasses}`;
    button.setAttribute('data-neon-color', color);
    
    let buttonContent = '';
    
    if (icon) {
        // Menší mezera na malých zařízeních pro úsporu místa
        buttonContent += `<i class="bi ${icon} me-1 me-sm-2"></i>`;
    }
    
    // Pro velmi malé displeje (landscape) přidáme speciální třídu
    const isShortText = text.length <= 10;
    const displayText = window.innerHeight <= 400 && !isShortText ? 
        `<span class="d-none d-sm-inline">${text}</span><span class="d-inline d-sm-none">${text.substring(0, 4)}...</span>` : 
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
    const card = document.createElement('div');
    card.className = `card bg-black border-wide-neon-${color} mb-3`;
    
    let headerContent = '';
    if (headerIcon) {
        headerContent += `<i class="bi ${headerIcon} me-2"></i>`;
    }
    headerContent += title;
    
    card.innerHTML = `
        <div class="card-header text-neon-${color}">
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
    const dice = document.createElement('div');
    dice.className = `dice ${selected ? 'selected' : ''} d-flex justify-content-center align-items-center rounded p-2 m-2`;
    dice.setAttribute('data-value', value);
    
    // Responzivní velikost kostky s využitím Bootstrap tříd
    dice.classList.add('dice-sm', 'dice-md-lg');
    
    // Vytvoření patternu s tečkami podle hodnoty kostky
    const dotPattern = createDotPattern(value);
    dice.appendChild(dotPattern);
    
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
    pattern.className = 'd-flex flex-wrap justify-content-around align-items-center w-100 h-100';
    
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
