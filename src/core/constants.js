/**
 * AI Dice Challenge - Game Constants
 * Všechny herní konstanty na jednom místě
 */

// Herní konstanty
export const GAME_CONSTANTS = {
    DEFAULT_TARGET_SCORE: 10000,
    MIN_TARGET_SCORE: 1000,
    MIN_SCORING_THRESHOLD: 250,
    DICE_COUNT: 6,
    MAX_ROLLS_PER_TURN: 3,
    
    // AI pravděpodobnosti
    AI_REACTION_CHANCES: {
        GOOD_ROLL: 0.3,        // 30% šance na komentář při dobrém hodu
        BAD_ROLL: 0.4,         // 40% šance na hecování při špatném hodu
        FARKLE: 1.0,           // 100% šance na hecování při Farkle
        RANDOM_TRASH_TALK: 0.15, // 15% šance na náhodný trash talk
        AI_BANTER: 0.2,        // 20% šance na banter mezi AI
        CHAT_RESPONSE: 0.8     // 80% šance na reakci na chat zprávy
    },
    
    // Skóre hodnoty
    SCORING: {
        GOOD_ROLL_THRESHOLD: 300,
        BAD_ROLL_THRESHOLD: 200,
        SINGLE_ONE: 100,
        SINGLE_FIVE: 50,
        THREE_ONES: 1000,
        THREE_TWOS: 200,
        THREE_THREES: 300,
        THREE_FOURS: 400,
        THREE_FIVES: 500,
        THREE_SIXES: 600
    }
};

// AI typy
export const AI_TYPES = {
    GEMINI: 'gemini',
    CHATGPT: 'chatgpt',
    CLAUDE: 'claude',
    HUMAN: 'human',
    SYSTEM: 'system'
};

// Události hry
export const GAME_EVENTS = {
    GAME_START: 'gameStart',
    GAME_END: 'gameEnd',
    TURN_START: 'turnStart',
    TURN_END: 'turnEnd',
    DICE_ROLL: 'diceRoll',
    DICE_BANK: 'diceBank',
    FARKLE: 'farkle',
    HOT_DICE: 'hotDice',
    FINAL_ROUND: 'finalRound',
    WINNER: 'winner'
};

// CSS třídy
export const CSS_CLASSES = {
    DICE: {
        BASE: 'dice',
        SELECTED: 'selected',
        BANKED: 'banked',
        SCORING: 'scoring',
        FARKLE: 'farkle'
    },
    PLAYER: {
        BASE: 'player',
        ACTIVE: 'active',
        HUMAN: 'human-player',
        GEMINI: 'gemini-player',
        CHATGPT: 'chatgpt-player',
        CLAUDE: 'claude-player'
    },
    BUTTONS: {
        PRIMARY: 'btn btn-primary',
        SECONDARY: 'btn btn-secondary',
        DANGER: 'btn btn-danger'
    }
};

// Zprávy
export const MESSAGES = {
    GAME_START: '🎮 Hra začala! První hráč, který dosáhne {targetScore} bodů, vyhrává!',
    FARKLE: '❌ FARKLE! Žádné bodující kostky! Tah končí s 0 body.',
    HOT_DICE: '🔥 HOT DICE! Všechny kostky odloženy! Můžete pokračovat v házení všech 6 kostek.',
    MIN_SCORE_NOT_REACHED: '{playerName} nezískal minimálních 250 bodů. Tah končí s 0 body.',
    FINAL_ROUND: '🏆 {playerName} dosáhl cílového skóre {targetScore}! Ostatní hráči mají ještě jednu šanci!'
};

// Timings (v milisekundách)
export const TIMINGS = {
    AI_RESPONSE_DELAY: 1000,
    AI_RESPONSE_RANDOM: 500,
    CHAT_ANIMATION: 300,
    DOM_READY_DELAY: 100,
    COOLDOWN_TRASH_TALK: 10000
};

// Hráči konfigurace
export const PLAYERS_CONFIG = [
    { 
        id: 0, 
        name: 'Vy', 
        type: AI_TYPES.HUMAN, 
        avatar: '/ai-icons/mind.jpeg',
        color: '--neon-green'
    },
    { 
        id: 1, 
        name: 'Gemini', 
        type: AI_TYPES.GEMINI, 
        avatar: '/ai-icons/gemini.jpeg',
        color: '--neon-blue'
    },
    { 
        id: 2, 
        name: 'ChatGPT', 
        type: AI_TYPES.CHATGPT, 
        avatar: '/ai-icons/gpt.jpeg',
        color: '--neon-pink'
    },
    { 
        id: 3, 
        name: 'Claude', 
        type: AI_TYPES.CLAUDE, 
        avatar: '/ai-icons/claude.jpeg',
        color: '--neon-orange'
    }
];

// Easter eggs
export const EASTER_EGGS = {
    PIPAP: ['pipap', 'pip', 'autor'],
    THANKS: ['děkuji', 'thanks', 'díky', 'thx'],
    LOVE: ['love you', 'miluju', 'miluji', 'love'],
    HELP: ['help', 'pomoc', 'nápověda', '?']
};
