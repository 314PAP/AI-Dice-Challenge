/**
 * 🎮 Game State Manager
 * Správa herního stavu s využitím lodash a ramda
 */

import { cloneDeep, merge } from 'lodash-es';
import { curry, pipe, map, filter, reduce } from 'ramda';

// Výchozí stav hry
const DEFAULT_GAME_STATE = {
    gameStarted: false,
    gameEnded: false,
    currentPlayerIndex: 0,
    targetScore: 5000,
    currentTurnScore: 0,
    currentRoll: [],
    selectedDice: [],
    bankedDice: [],
    players: [
        { name: 'Hráč', score: 0, isHuman: true, avatar: '👤' },
        { name: 'AI Sarah', score: 0, isHuman: false, avatar: '🤖' },
        { name: 'AI Marcus', score: 0, isHuman: false, avatar: '🎭' },
        { name: 'AI Luna', score: 0, isHuman: false, avatar: '🌙' }
    ],
    diceCount: 6,
    rollsInTurn: 0,
    lastAction: null,
    gameHistory: []
};

/**
 * Správce herního stavu
 */
export class GameStateManager {
    constructor() {
        this.state = cloneDeep(DEFAULT_GAME_STATE);
        this.listeners = new Set();
    }

    /**
     * Získání aktuálního stavu
     */
    getState() {
        return cloneDeep(this.state);
    }

    /**
     * Aktualizace stavu
     */
    updateState(updates) {
        const oldState = cloneDeep(this.state);
        this.state = merge(this.state, updates);
        
        // Notifikuj listenery
        this.notifyListeners(oldState, this.state);
    }

    /**
     * Přidání listenera změn stavu
     */
    addListener(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Notifikace listenerů
     */
    notifyListeners(oldState, newState) {
        this.listeners.forEach(listener => {
            try {
                listener(newState, oldState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Spuštění hry
     */
    async startGame(targetScore = 5000) {
        this.updateState({
            gameStarted: true,
            gameEnded: false,
            targetScore,
            currentPlayerIndex: 0,
            currentTurnScore: 0,
            rollsInTurn: 0,
            lastAction: 'game_started',
            gameHistory: []
        });
        
        console.log('🎮 Game started with target score:', targetScore);
    }

    /**
     * Reset hry
     */
    async resetGame() {
        this.state = cloneDeep(DEFAULT_GAME_STATE);
        this.notifyListeners({}, this.state);
        console.log('🔄 Game reset');
    }

    /**
     * Ukončení hry
     */
    async endGame(winner = null) {
        this.updateState({
            gameEnded: true,
            lastAction: 'game_ended',
            winner: winner || this.getWinner()
        });
        
        console.log('🏁 Game ended, winner:', this.state.winner);
    }

    /**
     * Hod kostkami
     */
    rollDice() {
        const diceCount = this.state.diceCount - this.state.bankedDice.length;
        const newRoll = Array.from({ length: diceCount }, () => 
            Math.floor(Math.random() * 6) + 1
        );
        
        this.updateState({
            currentRoll: newRoll,
            selectedDice: [],
            rollsInTurn: this.state.rollsInTurn + 1,
            lastAction: 'dice_rolled'
        });
        
        return newRoll;
    }

    /**
     * Výběr kostky
     */
    selectDie(index) {
        const selectedDice = [...this.state.selectedDice];
        
        if (selectedDice.includes(index)) {
            selectedDice.splice(selectedDice.indexOf(index), 1);
        } else {
            selectedDice.push(index);
        }
        
        this.updateState({
            selectedDice,
            lastAction: 'die_selected'
        });
    }

    /**
     * Uložení vybraných kostek
     */
    bankSelectedDice() {
        const bankedDice = [...this.state.bankedDice];
        const selectedValues = this.state.selectedDice.map(index => 
            this.state.currentRoll[index]
        );
        
        bankedDice.push(...selectedValues);
        
        const score = this.calculateScore(selectedValues);
        
        this.updateState({
            bankedDice,
            selectedDice: [],
            currentTurnScore: this.state.currentTurnScore + score,
            lastAction: 'dice_banked'
        });
        
        return score;
    }

    /**
     * Ukončení tahu
     */
    endTurn() {
        const currentPlayer = this.state.players[this.state.currentPlayerIndex];
        currentPlayer.score += this.state.currentTurnScore;
        
        // Kontrola vítězství
        if (currentPlayer.score >= this.state.targetScore) {
            this.endGame(currentPlayer);
            return;
        }
        
        // Přechod na dalšího hráče
        const nextPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
        
        this.updateState({
            currentPlayerIndex: nextPlayerIndex,
            currentTurnScore: 0,
            rollsInTurn: 0,
            bankedDice: [],
            selectedDice: [],
            currentRoll: [],
            lastAction: 'turn_ended'
        });
    }

    /**
     * Výpočet skóre z kostek
     */
    calculateScore(dice) {
        if (!dice || dice.length === 0) return 0;
        
        const counts = dice.reduce((acc, die) => {
            acc[die] = (acc[die] || 0) + 1;
            return acc;
        }, {});
        
        let score = 0;
        
        // Výpočet skóre podle pravidel
        Object.entries(counts).forEach(([value, count]) => {
            const val = parseInt(value);
            
            if (val === 1) {
                if (count >= 3) score += 1000 * Math.pow(2, count - 3);
                score += (count % 3) * 100;
            } else if (val === 5) {
                if (count >= 3) score += 500 * Math.pow(2, count - 3);
                score += (count % 3) * 50;
            } else if (count >= 3) {
                score += val * 100 * Math.pow(2, count - 3);
            }
        });
        
        return score;
    }

    /**
     * Získání vítěze
     */
    getWinner() {
        return this.state.players.reduce((winner, player) => 
            player.score > winner.score ? player : winner
        );
    }

    /**
     * Získání aktuálního hráče
     */
    getCurrentPlayer() {
        return this.state.players[this.state.currentPlayerIndex];
    }

    /**
     * Kontrola možnosti hodu
     */
    canRoll() {
        return this.state.gameStarted && 
               !this.state.gameEnded && 
               this.state.diceCount > this.state.bankedDice.length;
    }

    /**
     * Kontrola možnosti ukončení tahu
     */
    canEndTurn() {
        return this.state.gameStarted && 
               !this.state.gameEnded && 
               this.state.currentTurnScore > 0;
    }

    /**
     * Funkcionální utilities s Ramda
     */
    
    // Curry funkce pro práci s hráči
    static updatePlayer = curry((index, updates, players) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], ...updates };
        return newPlayers;
    });

    // Pipe pro výpočet celkového skóre
    static calculateTotalScore = pipe(
        map(player => player.score),
        reduce((a, b) => a + b, 0)
    );

    // Filter pro aktivní hráče
    static getActivePlayers = filter(player => player.score > 0);
}

export default GameStateManager;
