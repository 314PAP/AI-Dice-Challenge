/**
 * Constants - Konstanty a konfigurační hodnoty
 */

// Import převodních funkcí z colors.js
import { pxToRem } from './colors.js';

// Herní konstanty
export const GAME_CONSTANTS = {
    MAX_DICE: 6,
    MIN_TARGET_SCORE: 1000,
    MAX_TARGET_SCORE: 50000,
    DEFAULT_TARGET_SCORE: 10000
};

// Konstanty pro mechaniku kostek
export const DICE_CONSTANTS = {
    MIN_VALUE: 1,
    MAX_VALUE: 6,
    TRIPLET_BASE_POINTS: 100,  // Základní bodování pro trojice (kromě jedniček)
    ONES_TRIPLET_POINTS: 1000, // Body za trojici jedniček
    SINGLE_ONE_POINTS: 100,    // Body za jednu jedničku
    SINGLE_FIVE_POINTS: 50     // Body za jednu pětku
};

// UI konstanty
export const UI_CONSTANTS = {
    DICE_ANIMATION_DURATION: 800,
    MESSAGE_DELAY: 1500,
    AI_RESPONSE_DELAY: 1000,
    AI_RESPONSE_MIN_DELAY: 800,  // Minimální zpoždění AI odpovědi v ms
    AI_RESPONSE_RANDOM_DELAY: 1200,  // Náhodné dodatečné zpoždění v ms
    SCROLL_THRESHOLD: pxToRem(50),  // Threshold pro auto-scrollování chatu
    NEON_SHADOW_BLUR: 0.625  // Hodnota pro neonové stíny v rem
};

// Z-indexy pro elementy
export const Z_INDEXES = {
    MODAL: 1050,
    DROPDOWN: 1000,
    TOOLTIP: 1070
};

// Konstanty pro chat
export const CHAT_CONSTANTS = {
    PLAYER_NAME: 'Hráč',
    SYSTEM_NAME: 'Systém'
};

// LocalStorage klíče
export const STORAGE_KEYS = {
    CHAT_HISTORY: 'aidice-chat-history',
    HALL_OF_FAME: 'aidice-hall-of-fame',
    GAME_SETTINGS: 'aidice-game-settings'
};

/**
 * Neonové barvy - identifikátory pro CSS třídy a data atributy
 * Používá se napříč aplikací pro konzistentní pojmenování barev
 * Hodnoty odpovídají CSS třídám (např. text-neon-green, border-neon-blue)
 * a data atributům (např. data-neon-color="green")
 */
export const NEON_COLORS = {
    GREEN: 'green',
    BLUE: 'blue',
    PURPLE: 'purple',
    ORANGE: 'orange',
    RED: 'red',
    YELLOW: 'yellow'
};
