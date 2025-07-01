/**
 * Game State Management
 * Centralizovaná správa stavu hry
 */

export const gameState = {
    targetScore: 10000,
    currentPlayer: 0, // 0=human, 1=gemini, 2=chatgpt, 3=claude
    players: [
        { name: 'Vy', score: 0, type: 'human' },
        { name: 'Gemini', score: 0, type: 'gemini' },
        { name: 'ChatGPT', score: 0, type: 'chatgpt' },
        { name: 'Claude', score: 0, type: 'claude' }
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
    totalTurns: 0, // Celkový počet tahů všech hráčů
    playerTurns: { human: 0, gemini: 0, chatgpt: 0, claude: 0 }, // Tahy jednotlivých hráčů
    endTurnProcessing: false // Zabezpečení proti opakovanému volání endTurn
};

/**
 * Resetuje stav hry do výchozího nastavení
 */
export function resetGameState() {
    gameState.targetScore = 10000;
    gameState.currentPlayer = 0;
    gameState.players = [
        { name: 'Vy', score: 0, type: 'human' },
        { name: 'Gemini', score: 0, type: 'gemini' },
        { name: 'ChatGPT', score: 0, type: 'chatgpt' },
        { name: 'Claude', score: 0, type: 'claude' }
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
    gameState.endTurnProcessing = false;
    gameState.gameStartTime = null;
    gameState.totalTurns = 0;
    gameState.playerTurns = { human: 0, gemini: 0, chatgpt: 0, claude: 0 };
}

/**
 * Přejde na dalšího hráče
 */
export function nextPlayer() {
    const previousPlayer = gameState.currentPlayer;
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 4; // 4 hráči celkem
    console.log(`🔄 NextPlayer: ${previousPlayer} → ${gameState.currentPlayer} (FinalRound: ${gameState.finalRound}, Initiator: ${gameState.finalRoundInitiator})`);
    
    gameState.currentTurnScore = 0;
    gameState.rollsLeft = 3;
    gameState.dice = [];
    gameState.bankedDice = [];
    gameState.mustBankDice = false;
    gameState.totalTurns++;
    
    // Sledování tahů podle hráče
    const currentPlayerType = gameState.players[gameState.currentPlayer].type;
    gameState.playerTurns[currentPlayerType]++;
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
