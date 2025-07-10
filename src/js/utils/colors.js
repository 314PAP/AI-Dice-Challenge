/**
 * colors.js - Sdílené barevné konstanty pro JavaScript
 * 
 * Tento modul poskytuje jednotné barevné proměnné pro použití v JavaScriptu
 * Synchronizováno s CSS proměnnými v neon-colors.css
 */

// Definice barev z CSS proměnných pro použití v JavaScript
export const CONSOLE_COLORS = {
    // Neonové barvy - 6 základních
    neonGreen: '#39ff14',
    neonBlue: '#194DD1',
    neonPurple: '#FF00FF',
    neonOrange: '#FF8800',
    neonRed: '#ff3131',
    neonYellow: '#ffff00',
    
    // Tmavé barvy - pouze černá
    neonBlack: '#000000'
};

// Funkce pro převod px na rem - užitečné pro konzolové styly
export function pxToRem(px) {
    return `${px / 16}rem`;
}

/**
 * Mapování názvů neonových barev na hexadecimální hodnoty
 * Pro použití v chatSystem a dalších modulech
 */
export const CHAT_COLORS = {
    GREEN: CONSOLE_COLORS.neonGreen,
    BLUE: CONSOLE_COLORS.neonBlue,
    PURPLE: CONSOLE_COLORS.neonPurple,
    ORANGE: CONSOLE_COLORS.neonOrange,
    RED: CONSOLE_COLORS.neonRed,
    YELLOW: CONSOLE_COLORS.neonYellow
};

/**
 * Převede barvu z hex na rgb formát (používá se pro rgba)
 * @param {string} hex - Hexadecimální kód barvy (např. '#39ff14')
 * @returns {Object} - Objekt s hodnotami r, g, b
 */
export function hexToRgb(hex) {
    // Odstraní # pokud existuje
    const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
    
    // Převede hex na rgb
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    return { r, g, b };
}

/**
 * Vytvoří rgba string z hex barvy a alpha hodnoty
 * @param {string} hex - Hexadecimální kód barvy
 * @param {number} alpha - Průhlednost (0-1)
 * @returns {string} - rgba string pro použití v CSS
 */
export function hexToRgba(hex, alpha = 1) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Získá barvu podle jména z CONSOLE_COLORS
 * @param {string} colorName - Jméno barvy (např. 'neonGreen')
 * @returns {string} - Hexadecimální kód barvy
 */
export function getNeonColor(colorName) {
    return CONSOLE_COLORS[colorName] || CONSOLE_COLORS.neonGreen;
}
