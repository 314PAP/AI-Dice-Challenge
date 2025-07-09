/**
 * Constants - Konstanty a konfigurační hodnoty
 */

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
    AI_RESPONSE_DELAY: 1000
};

// LocalStorage klíče
export const STORAGE_KEYS = {
    CHAT_HISTORY: 'aidice-chat-history',
    HALL_OF_FAME: 'aidice-hall-of-fame',
    GAME_SETTINGS: 'aidice-game-settings'
};

// Neonové barvy
export const NEON_COLORS = {
    GREEN: 'green',
    BLUE: 'blue',
    PURPLE: 'purple',
    ORANGE: 'orange',
    RED: 'red',
    YELLOW: 'yellow'
};
