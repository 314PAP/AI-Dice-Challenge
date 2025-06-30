/**
 * AI Dice Challenge - Turn Manager
 * Správa tahů hráčů
 */

import { gameState } from '../../core/gameState.js';
import { GAME_EVENTS, GAME_CONSTANTS } from '../../core/constants.js';

export class TurnManager {
    constructor(eventSystem) {
        this.events = eventSystem;
    }

    /**
     * Inicializuje turn manager
     */
    async initialize() {
        console.log('🔄 Inicializuji Turn Manager...');
        this.setupEventListeners();
        console.log('✅ Turn Manager připraven');
    }

    /**
     * Spustí tah hráče
     */
    startPlayerTurn(playerId) {
        gameState.currentPlayer = playerId;
        const player = gameState.getCurrentPlayer();
        
        console.log(`🎯 Začíná tah hráče: ${player.name}`);
        
        // Reset turn state
        gameState.currentTurnScore = 0;
        gameState.rollsLeft = GAME_CONSTANTS.MAX_ROLLS_PER_TURN;
        gameState.dice = [];
        gameState.bankedDice = [];
        gameState.mustBankDice = false;

        this.events.emit(GAME_EVENTS.TURN_START, {
            player,
            playerId,
            isHuman: player.type === 'human'
        });
    }

    /**
     * Ukončí aktuální tah
     */
    endTurn(forced = false) {
        const currentPlayer = gameState.getCurrentPlayer();
        const finalScore = gameState.currentTurnScore;
        
        console.log(`🏁 Končí tah hráče ${currentPlayer.name}, skóre: ${finalScore}`);

        // Přidej skóre pouze pokud je >= minimální threshold
        if (finalScore >= GAME_CONSTANTS.MIN_SCORING_THRESHOLD) {
            gameState.addPlayerScore(currentPlayer.id, finalScore);
        } else if (finalScore > 0) {
            // Hráč má body, ale nedosáhl minimální threshold
            this.events.emit('turnFailedMinScore', {
                player: currentPlayer,
                score: finalScore,
                required: GAME_CONSTANTS.MIN_SCORING_THRESHOLD
            });
        }

        this.events.emit(GAME_EVENTS.TURN_END, {
            player: currentPlayer,
            score: finalScore,
            forced
        });

        // Zkontroluj vítěze
        const winner = gameState.checkForWinner();
        if (winner && !gameState.finalRound) {
            this.startFinalRound(winner);
        } else if (gameState.finalRound && this.isFinalRoundComplete()) {
            this.endGame();
        } else {
            // Přejdi na dalšího hráče
            gameState.nextPlayer();
            this.startPlayerTurn(gameState.currentPlayer);
        }
    }

    /**
     * Spustí finální kolo
     */
    startFinalRound(initiator) {
        console.log(`🏆 Spouští se finální kolo! Iniciátor: ${initiator.name}`);
        
        gameState.finalRound = true;
        gameState.finalRoundInitiator = initiator;

        this.events.emit(GAME_EVENTS.FINAL_ROUND, {
            initiator,
            targetScore: gameState.targetScore
        });
    }

    /**
     * Zkontroluje, zda je finální kolo dokončené
     */
    isFinalRoundComplete() {
        // Všichni hráči kromě iniciátora musí mít možnost hrát
        const initiatorIndex = gameState.finalRoundInitiator.id;
        return gameState.currentPlayer === initiatorIndex;
    }

    /**
     * Ukončí hru
     */
    endGame() {
        const winner = gameState.getLeaderboard()[0];
        gameState.gameEnded = true;
        gameState.gameEndTime = new Date();
        gameState.winner = winner;

        console.log(`🎉 Hra skončila! Vítěz: ${winner.name} se skóre ${winner.score}`);

        this.events.emit(GAME_EVENTS.GAME_END, {
            winner,
            finalScores: gameState.getLeaderboard(),
            stats: gameState.getGameStats()
        });
    }

    /**
     * Nastavuje event listenery
     */
    setupEventListeners() {
        // Poslouchej události z dice systému
        this.events.on(GAME_EVENTS.FARKLE, (data) => {
            console.log('💥 FARKLE detekováno!');
            this.endTurn(true);
        });

        this.events.on('turnFailedMinScore', (data) => {
            console.log(`⚠️ ${data.player.name} nedosáhl minimálního skóre ${data.required}`);
            // Reset score to 0 for this turn
            gameState.currentTurnScore = 0;
        });
    }

    /**
     * Získá informace o aktuálním tahu
     */
    getCurrentTurnInfo() {
        const player = gameState.getCurrentPlayer();
        return {
            player,
            turnScore: gameState.currentTurnScore,
            rollsLeft: gameState.rollsLeft,
            mustBankDice: gameState.mustBankDice,
            canRoll: gameState.rollsLeft > 0 && !gameState.mustBankDice,
            canBank: gameState.dice.some(die => die.selected),
            canEndTurn: gameState.currentTurnScore >= GAME_CONSTANTS.MIN_SCORING_THRESHOLD
        };
    }
}
