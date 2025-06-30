/**
 * Game State Management
 * Centralizovaná správa stavu hry
 */

export const gameState = {
    targetScore: 10000,
    currentPlayer: 0, // 0=human, 1=ai
    players: [
        { name: 'Hráč', score: 0, type: 'human' },
        { name: 'AI Protivník', score: 0, type: 'ai' }
    ],
    currentTurnScore: 0,
    rollsLeft: 3,
    dice: [],
    bankedDice: [],
    gameStarted: false,
    gameEnded: false,
    mustBankDice: false, // Flag indicating player must bank dice before next roll
    finalRound: false,   // Flag indicating final round after someone reaches target
    finalRoundInitiator: null, // Player who triggered final round
    gameStartTime: null, // Čas začátku hry pro statistiky
    currentTurn: 0 // Celkový počet tahů
};

/**
 * Resetuje stav hry do výchozího nastavení
 */
export function resetGameState() {
    gameState.targetScore = 10000;
    gameState.currentPlayer = 0;
    gameState.players = [
        { name: 'Hráč', score: 0, type: 'human' },
        { name: 'AI Protivník', score: 0, type: 'ai' }
    ];
    gameState.currentTurnScore = 0;
    gameState.rollsLeft = 3;
    gameState.dice = [];
    gameState.bankedDice = [];
    gameState.gameStarted = false;
    gameState.gameEnded = false;
    gameState.mustBankDice = false;
    gameState.finalRound = false;
    gameState.finalRoundInitiator = null;
    gameState.gameStartTime = null;
    gameState.currentTurn = 0;
}

/**
 * Přejde na dalšího hráče
 */
export function nextPlayer() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 2;
    gameState.currentTurnScore = 0;
    gameState.rollsLeft = 3;
    gameState.dice = [];
    gameState.bankedDice = [];
    gameState.mustBankDice = false;
}

/**
 * Získá aktuálního hráče
 */
export function getCurrentPlayer() {
    return gameState.players[gameState.currentPlayer];
}

/**
 * Zkontroluje, zda některý hráč vyhrál
 */
export function checkForWinner() {
    return gameState.players.find(player => player.score >= gameState.targetScore);
}
