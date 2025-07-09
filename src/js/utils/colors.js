/**
 * colors.js - Sdílené barevné konstanty pro JavaScript
 * 
 * Tento modul poskytuje jednotné barevné proměnné pro použití v JavaScriptu
 * Synchronizováno s CSS proměnnými v neon-colors.css
 */

// Definice barev z CSS proměnných pro použití v JavaScript
export const CONSOLE_COLORS = {
    // Neonové barvy
    neonGreen: '#39ff14',
    neonBlue: '#194DD1',
    neonPurple: '#FF00FF',
    neonOrange: '#FF8800',
    neonRed: '#ff3131',
    neonYellow: '#ffff00',
    
    // Tmavé barvy
    neonBlack: '#000000',
    neonDarkGray: '#111111',
    neonDarkGray2: '#2a2a2a',
    
    // Text a pozadí
    textDark: '#888888',
    textLight: '#dddddd',
    textWhite: '#ffffff',
    bgDark1: '#111111',
    bgDark2: '#222222',
    bgDark3: '#333333'
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
    WHITE: CONSOLE_COLORS.textWhite,
    GREEN: CONSOLE_COLORS.neonGreen,
    BLUE: CONSOLE_COLORS.neonBlue,
    PURPLE: CONSOLE_COLORS.neonPurple,
    ORANGE: CONSOLE_COLORS.neonOrange,
    RED: CONSOLE_COLORS.neonRed,
    YELLOW: CONSOLE_COLORS.neonYellow
};
