/**
 * AI Dice Challenge - Game State Management
 * Centralizovaná správa stavu hry - refaktorovaná verze
 */

import { GAME_CONSTANTS, PLAYERS_CONFIG } from './constants.js';

class GameState {
    constructor() {
        this.reset();
    }

    /**
     * Resetuje stav hry do výchozího nastavení
     */
    reset() {
        this.targetScore = GAME_CONSTANTS.DEFAULT_TARGET_SCORE;
        this.currentPlayer = 0;
        this.players = PLAYERS_CONFIG.map(config => ({
            id: config.id,
            name: config.name,
            type: config.type,
            score: 0,
            avatar: config.avatar,
            color: config.color
        }));
        
        // Stav tahu
        this.currentTurnScore = 0;
        this.rollsLeft = GAME_CONSTANTS.MAX_ROLLS_PER_TURN;
        this.dice = [];
        this.bankedDice = [];
        this.mustBankDice = false;
        
        // Stav hry
        this.gameStarted = false;
        this.gameEnded = false;
        this.finalRound = false;
        this.finalRoundInitiator = null;
        this.winner = null;
        
        // Statistiky
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.totalTurns = 0;
        this.playerTurns = {
            human: 0,
            gemini: 0,
            chatgpt: 0,
            claude: 0
        };
    }

    /**
     * Přejde na dalšího hráče
     */
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.currentTurnScore = 0;
        this.rollsLeft = GAME_CONSTANTS.MAX_ROLLS_PER_TURN;
        this.dice = [];
        this.bankedDice = [];
        this.mustBankDice = false;
        this.totalTurns++;
        
        // Sledování tahů podle hráče
        const currentPlayerType = this.getCurrentPlayer().type;
        this.playerTurns[currentPlayerType]++;
    }

    /**
     * Získá aktuálního hráče
     */
    getCurrentPlayer() {
        return this.players[this.currentPlayer];
    }

    /**
     * Získá hráče podle ID
     */
    getPlayerById(playerId) {
        return this.players.find(player => player.id === playerId);
    }

    /**
     * Získá hráče podle typu
     */
    getPlayerByType(playerType) {
        return this.players.find(player => player.type === playerType);
    }

    /**
     * Zkontroluje, zda některý hráč vyhrál
     */
    checkForWinner() {
        return this.players.find(player => player.score >= this.targetScore);
    }

    /**
     * Nastaví skóre hráče
     */
    setPlayerScore(playerId, score) {
        const player = this.getPlayerById(playerId);
        if (player) {
            player.score = score;
        }
    }

    /**
     * Přidá skóre hráči
     */
    addPlayerScore(playerId, scoreToAdd) {
        const player = this.getPlayerById(playerId);
        if (player) {
            player.score += scoreToAdd;
        }
    }

    /**
     * Získá pořadí hráčů podle skóre
     */
    getLeaderboard() {
        return [...this.players].sort((a, b) => b.score - a.score);
    }

    /**
     * Získá statistiky hry
     */
    getGameStats() {
        const duration = this.gameStartTime && this.gameEndTime 
            ? this.gameEndTime - this.gameStartTime 
            : Date.now() - this.gameStartTime;
            
        return {
            duration: Math.floor(duration / 1000), // v sekundách
            totalTurns: this.totalTurns,
            playerTurns: { ...this.playerTurns },
            winner: this.winner,
            finalScore: this.winner ? this.winner.score : 0,
            targetScore: this.targetScore
        };
    }

    /**
     * Exportuje stav pro ukládání
     */
    export() {
        return {
            targetScore: this.targetScore,
            currentPlayer: this.currentPlayer,
            players: this.players.map(p => ({ ...p })),
            gameStarted: this.gameStarted,
            gameEnded: this.gameEnded,
            finalRound: this.finalRound,
            stats: this.getGameStats()
        };
    }

    /**
     * Importuje stav ze souboru
     */
    import(savedState) {
        Object.assign(this, savedState);
    }
}

// Singleton instance
export const gameState = new GameState();

// Legacy exports pro zpětnou kompatibilitu
export function resetGameState() {
    gameState.reset();
}

export function nextPlayer() {
    gameState.nextPlayer();
}

export function getCurrentPlayer() {
    return gameState.getCurrentPlayer();
}

export function checkForWinner() {
    return gameState.checkForWinner();
}
