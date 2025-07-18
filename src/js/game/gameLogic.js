/**
 * 🎲 AI Dice Challenge - Refaktorovaný Game Logic
 * 
 * Redukováno z 515 řádků na ~150 řádků pomocí modulů a lodash
 * Moduly: DiceAnimationManager, TurnManager, DiceManager
 */

// Lodash utilities (načteno z CDN)
const { isEmpty } = _;

import { DiceAnimationManager } from './DiceAnimationManager.js';
import { TurnManager } from './TurnManager.js';
import { DiceManager } from './DiceManager.js';
import { hasScoringDice } from './diceMechanics.js';
import gameState from './gameState.js';
import soundSystem from '../utils/soundSystem.js';
import chatSystem from '../ai/chatSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';

/**
 * Hlavní herní logika - zjednodušená pomocí modulů
 */
export class GameLogic {
    constructor(gameRenderer) {
        this.gameRenderer = gameRenderer;

        // Moduly pro zjednodušení
        this.animationManager = new DiceAnimationManager();
        this.turnManager = new TurnManager();
        this.diceManager = new DiceManager(this.animationManager);

        // Nastavíme referenci na gameLogic pro AI funkčnost
        this.turnManager.setGameLogic(this);
    }

    /**
     * Hodí kostky - zjednodušená verze
     */
    async rollDice() {
        const state = gameState.getState();

        // Blokovat házení pokud už probíhá házení nebo je hra ukončena
        if (state.isRolling || state.gamePhase === 'gameover') {
            console.log('🚫 Nelze házet kostky - házení již probíhá nebo hra skončila');
            soundSystem.play('error');
            return;
        }

        if (!this.diceManager.canRollDice()) {
            console.warn('⚠️ Nelze hodit kostky nyní');
            return;
        }

        const diceCount = this.diceManager.getDiceCountToRoll();

        // Příprava animace
        gameState.updateState({
            currentRoll: Array(diceCount).fill(0),
            selectedDice: [],
            isRolling: true
        });

        // Spuštění animace
        await this.animationManager.playRollingAnimation(diceCount);

        // Kontrola výsledku
        this.checkRollResult();
    }

    /**
     * Kontrola výsledku hodu
     */
    checkRollResult() {
        const state = gameState.getState();
        const dice = state.currentRoll;

        if (!hasScoringDice(dice)) {
            this.handleFarkle(dice);
        }
    }

    /**
     * Zpracuje FARKLE situaci - zjednodušeno
     * @param {Array} dice - Kostky
     */
    handleFarkle(dice) {
        const currentState = gameState.getState();
        if (currentState.isFarkleProcessing) {
            return;
        }

        gameState.updateState({ isFarkleProcessing: true });

        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];

        // Označení hráče s FARKLE
        const updatedPlayers = [...state.players];
        updatedPlayers[state.currentPlayerIndex] = { ...currentPlayer, hasFarkle: true };
        gameState.updateState({ players: updatedPlayers });

        const farkleMsg = `💥 ${currentPlayer.name} FARKLE!`;
        console.warn(farkleMsg);
        chatSystem.addSystemMessage(farkleMsg, CHAT_COLORS.RED);

        // 🎵 FARKLE zvuk
        soundSystem.play('farkle');

        // Animace FARKLE
        this.animationManager.triggerFarkleAnimation(dice);

        // Automatické ukončení tahu po 3 sekundách
        setTimeout(() => {
            this.endTurn(true);
        }, 3000);
    }

    /**
     * Odloží vybrané kostky - deleguje na DiceManager
     */
    saveDice() {
        this.diceManager.saveDice();
    }

    /**
     * Ukončí tah - deleguje na TurnManager
     * @param {boolean} isFarkle - FARKLE flag
     */
    endTurn(isFarkle = false) {
        this.turnManager.endTurn(isFarkle);
    }

    /**
     * Získá status hry pro UI
     */
    getGameStatus() {
        const state = gameState.getState();
        const diceStatus = this.diceManager.getDiceStatus();
        const turnData = this.turnManager.getCurrentTurnData();

        return {
            gamePhase: state.gamePhase,
            currentPlayer: turnData.player,
            isAnimating: this.animationManager.isAnimationRunning(),
            dice: diceStatus,
            turn: turnData,
            finalRound: state.finalRound || false
        };
    }

    /**
     * Reset hry
     */
    resetGame() {
        this.diceManager.resetDiceForNewTurn();

        gameState.updateState({
            currentPlayerIndex: 0,
            gameStarted: false,
            gamePhase: 'menu',
            finalRound: false,
            finalRoundLeader: null,
            finalRoundStartPlayerIndex: -1,
            isFarkleProcessing: false,
            players: gameState.getState().players.map(p => ({
                ...p,
                score: 0,
                hasFarkle: false
            }))
        });

        chatSystem.clearMessages();
    }

    /**
     * Získá moduly pro debugging
     */
    getModules() {
        return {
            animation: this.animationManager,
            turn: this.turnManager,
            dice: this.diceManager
        };
    }

    /**
     * Čištění při uzavření
     */
    cleanup() {
        // Zde by mohlo být čištění modulů pokud by bylo potřeba
    }
}
