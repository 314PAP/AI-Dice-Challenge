/**
 * Utility Functions
 * Pomocné funkce pro celou aplikaci
 */

/**
 * Generuje náhodné číslo v rozsahu
 * @param {number} min - Minimální hodnota
 * @param {number} max - Maximální hodnota
 * @returns {number} Náhodné číslo
 */
export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formátuje číslo s tisíci separátory
 * @param {number} num - Číslo k formátování
 * @returns {string} Formátované číslo
 */
export function formatNumber(num) {
    return num.toLocaleString('cs-CZ');
}

/**
 * Debounce funkce - zpoždění volání funkce
 * @param {Function} func - Funkce k zavolání
 * @param {number} wait - Doba čekání v ms
 * @returns {Function} Debounced funkce
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle funkce - omezuje četnost volání
 * @param {Function} func - Funkce k zavolání
 * @param {number} limit - Limit v ms
 * @returns {Function} Throttled funkce
 */
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Zkopíruje text do schránky
 * @param {string} text - Text k zkopírování
 * @returns {Promise<boolean>} True pokud bylo úspěšné
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Nepodařilo se zkopírovat text: ', err);
        return false;
    }
}

/**
 * Animuje číslo od 0 do target hodnoty
 * @param {HTMLElement} element - Element k animaci
 * @param {number} target - Cílová hodnota
 * @param {number} duration - Doba animace v ms
 */
export function animateNumber(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const range = target - start;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (range * easeOut));
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Získá náhodný prvek z pole
 * @param {Array} array - Pole prvků
 * @returns {any} Náhodný prvek
 */
export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Zamíchá pole (Fisher-Yates algorithm)
 * @param {Array} array - Pole k zamíchání
 * @returns {Array} Zamíchané pole
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
