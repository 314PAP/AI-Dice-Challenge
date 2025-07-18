import { FARKLE_EFFECTS } from '../utils/constants.js';

/**
 * Game State - Centrální správa herního stavu
 * Modul odpovědný za správu herního stavu, hráčů, skóre a herní logiky
 */

// Výchozí herní stav
const initialGameState = {
    players: [
        { name: 'Hráč', score: 0, isHuman: true, avatar: 'mind.jpeg', color: 'green' },
        { name: 'Gemini', score: 0, isHuman: false, avatar: 'gemini.jpeg', color: 'blue' },
        { name: 'ChatGPT', score: 0, isHuman: false, avatar: 'gpt.jpeg', color: 'purple' },
        { name: 'Claude', score: 0, isHuman: false, avatar: 'claude.jpeg', color: 'orange' }
    ],
    currentPlayerIndex: 0,
    targetScore: 1000,
    gameStarted: false,
    currentRoll: [],
    selectedDice: [],
    savedDice: [],
    turnScore: 0,
    gamePhase: 'menu',
    // Finální kolo mechanika
    finalRound: false,
    finalRoundLeader: null,
    finalRoundStartPlayerIndex: -1,
    // Ochrana proti duplicitnímu zpracování
    isFarkleProcessing: false,
    isRolling: false,
    // FARKLE efekt nastavení
    farkleEffect: FARKLE_EFFECTS.DICE_DIAGONAL  // Testujeme diagonální efekt
};

/**
 * Třída GameState pro správu herního stavu
 */
class GameState {
    constructor() {
        this.state = { ...initialGameState };
        this.listeners = [];
    }

    /**
     * Získat aktuální herní stav
     */
    getState() {
        return this.state;
    }

    /**
     * Aktualizovat herní stav
     * @param {Object} newState - Nový herní stav nebo jeho část
     */
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    /**
     * Resetovat herní stav
     */
    resetGame() {
        this.state = { ...initialGameState };
        this.notifyListeners();
    }

    /**
     * Přidat posluchače změn stavu
     * @param {Function} listener - Callback funkce, která se zavolá při změně stavu
     */
    addListener(listener) {
        this.listeners.push(listener);
    }

    /**
     * Odstranit posluchače změn stavu
     * @param {Function} listener - Callback funkce, která se má odstranit
     */
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Notifikovat všechny posluchače o změně stavu
     */
    notifyListeners() {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

    /**
     * Změnit hráče na tahu
     */
    nextPlayer() {
        const nextPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
        this.updateState({
            currentPlayerIndex: nextPlayerIndex,
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0
        });
    }

    /**
     * Přidat body aktuálnímu hráči
     * @param {number} points - Počet bodů k přidání
     */
    addPoints(points) {
        const player = this.state.players[this.state.currentPlayerIndex];
        player.score += points;

        this.updateState({
            players: [...this.state.players],
            turnScore: this.state.turnScore + points
        });
    }

    /**
     * Aktualizovat skóre konkrétního hráče
     * @param {string} playerName - Jméno hráče
     * @param {number} points - Body k přidání
     */
    updatePlayerScore(playerName, points) {
        const playerIndex = this.state.players.findIndex(p => p.name === playerName);
        if (playerIndex === -1) {
            console.error(`❌ Hráč ${playerName} nenalezen`);
            return;
        }

        const player = this.state.players[playerIndex];
        const oldScore = player.score;
        player.score += points;

        console.log(`🎯 ${playerName}: ${oldScore} + ${points} = ${player.score} bodů`);

        this.updateState({
            players: [...this.state.players]
        });
    }
}

// Exportujeme jedinou instanci pro celou aplikaci
export default new GameState();
