/**
 * Game State Management
 * Centralizovaná správa stavu hry
 */

export const gameState = {
    targetScore: 10000,
    currentPlayer: 0, // 0=human, 1=gemini, 2=chatgpt, 3=claude
    players: [
        { name: 'Vy', score: 0, type: 'human', hasEnteredGame: false },
        { name: 'Gemini', score: 0, type: 'gemini', hasEnteredGame: false },
        { name: 'ChatGPT', score: 0, type: 'chatgpt', hasEnteredGame: false },
        { name: 'Claude', score: 0, type: 'claude', hasEnteredGame: false }
    ],
    currentTurnScore: 0,
    // REMOVED: rollsLeft - not used in Farkle, you can roll as long as you have unbanked dice
    diceValues: [], // Current dice roll values [1,2,3,4,5,6]
    selectedDice: [], // Indices of selected dice for banking
    bankedDiceThisTurn: [], // Visual display of banked dice this turn
    availableDice: 6, // Number of dice available to roll (6 minus banked dice)
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
        { name: 'Vy', score: 0, type: 'human', hasEnteredGame: false },
        { name: 'Gemini', score: 0, type: 'gemini', hasEnteredGame: false },
        { name: 'ChatGPT', score: 0, type: 'chatgpt', hasEnteredGame: false },
        { name: 'Claude', score: 0, type: 'claude', hasEnteredGame: false }
    ];
    gameState.currentTurnScore = 0;
    gameState.diceValues = [];
    gameState.selectedDice = [];
    gameState.bankedDiceThisTurn = [];
    gameState.availableDice = 6;
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
    // End any active AI turn before switching players
    if (typeof window !== 'undefined' && window.endAITurn) {
        window.endAITurn();
    }
    
    const previousPlayer = gameState.currentPlayer;
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 4; // 4 hráči celkem
    console.log(`🔄 NextPlayer: ${previousPlayer} → ${gameState.currentPlayer} (FinalRound: ${gameState.finalRound}, Initiator: ${gameState.finalRoundInitiator})`);
    
    // Reset turn state (but NOT currentTurnScore - that's handled in endTurn)
    // gameState.currentTurnScore = 0; // MOVED to endTurn() after points are added
    gameState.diceValues = [];
    gameState.selectedDice = [];
    // NOTE: bankedDiceThisTurn will be cleared in playerTurn() for proper visual timing
    gameState.availableDice = 6;
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
