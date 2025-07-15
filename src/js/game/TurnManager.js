/**
 * 🎲 AI Dice Challenge - Turn Manager Module
 * 
 * Modul pro správu tahů oddělený z GameLogic.js
 * Používá lodash pro optimalizaci logiky tahů
 */

// Lodash utilities (načteno z CDN)
const { cloneDeep, sumBy, maxBy, filter } = _;

import gameState from './gameState.js';
import chatSystem from '../ai/chatSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';
import soundSystem from '../utils/soundSystem.js';

/**
 * Třída pro správu tahů hráčů
 */
export class TurnManager {
    constructor() {
        this.currentTurnData = null;
    }

    /**
     * Ukončí tah hráče
     * @param {boolean} isFarkle - Zda je tah ukončen FARKLE
     */
    endTurn(isFarkle = false) {
        const state = gameState.getState();
        if (state.gamePhase === 'gameover') return; // Hra skončila
        
        const result = this.calculateTurnResult(isFarkle);
        this.updatePlayerScore(result);
        
        // Pokud je tah neplatný, nepokračujeme v endTurn sekvenci
        if (result.invalidTurn) {
            return; // Hráč zůstává na tahu a může pokračovat
        }
        
        // Kontrola výhry pomocí lodash
        const winner = this.checkVictory(result.player);
        if (winner) {
            this.endGame();
            return;
        }
        
        // Finální kolo kontrola
        if (state.finalRound && this.checkFinalRoundCompletion()) {
            this.endGame();
            return;
        }
        
        this.switchToNextPlayer();
    }

    /**
     * Vypočítá výsledek tahu - s lodash optimalizací
     * @param {boolean} isFarkle - FARKLE flag
     */
    calculateTurnResult(isFarkle) {
        const state = gameState.getState();
        const currentPlayer = cloneDeep(state.players[state.currentPlayerIndex]);
        
        if (isFarkle) {
            console.log(`💥 ${currentPlayer.name} FARKLE - ztrácí ${state.turnScore || 0} bodů`);
            return {
                player: currentPlayer,
                pointsGained: 0,
                wasFarkle: true,
                oldScore: currentPlayer.score
            };
        }
        
        // Normální ukončení tahu
        const pointsGained = state.turnScore || 0;
        const oldScore = currentPlayer.score;
        
        // VALIDACE PRVNÍHO ZÁPISU - POUZE PŘI UKONČENÍ TAHU!
        if (currentPlayer.score === 0 && pointsGained < 300) {
            const errorMsg = `❌ První zápis vyžaduje minimálně 300 bodů! Máte jen ${pointsGained} bodů. Pokračujte v házení.`;
            console.error(errorMsg);
            
            // Import chatSystem dynamicky pro menší závislosti
            import('../ai/chatSystem.js').then(({ default: chatSystem }) => {
                import('../utils/colors.js').then(({ CHAT_COLORS }) => {
                    chatSystem.addSystemMessage(errorMsg, CHAT_COLORS.RED);
                });
            });
            
            // Vrátíme "farkle-like" výsledek - neplatný tah
            return {
                player: currentPlayer,
                pointsGained: 0,
                wasFarkle: false,
                invalidTurn: true,
                reason: 'Nedostatečné body pro první zápis',
                oldScore
            };
        }
        
        return {
            player: currentPlayer,
            pointsGained,
            wasFarkle: false,
            oldScore
        };
    }

    /**
     * Aktualizuje skóre hráče
     * @param {Object} result - Výsledek tahu
     */
    updatePlayerScore(result) {
        const state = gameState.getState();
        
        // Pokud je tah neplatný (nedostatečné body), nepřidávej skóre a neukončuj tah
        if (result.invalidTurn) {
            console.warn(`⚠️ Neplatný tah: ${result.reason} - tah pokračuje`);
            // Pouze resetujeme turnScore na 0 a umožníme hráči pokračovat
            gameState.updateState({
                turnScore: 0,
                selectedDice: [],
                currentRoll: []
            });
            return; // NEPOKRAČUJEME v endTurn sekvenci!
        }
        
        // Lodash cloneDeep pro bezpečnou kopii
        const updatedPlayers = cloneDeep(state.players);
        updatedPlayers[state.currentPlayerIndex].score += result.pointsGained;
        updatedPlayers[state.currentPlayerIndex].hasFarkle = result.wasFarkle;
        
        // Reset herního stavu po tahu
        gameState.updateState({
            players: updatedPlayers,
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0,
            isFarkleProcessing: false // Reset ochranného flagu
        });
        
        this.logTurnResult(result.player, state, result.pointsGained, result.oldScore);
    }

    /**
     * Loguje výsledek tahu
     */
    logTurnResult(player, state, points, oldScore) {
        const newScore = oldScore + points;
        const message = points > 0 
            ? `✅ ${player.name}: +${points} bodů (${oldScore} → ${newScore})`
            : `💥 ${player.name}: FARKLE! (${oldScore} bodů)`;
        
        console.log(message);
        chatSystem.addSystemMessage(message, points > 0 ? CHAT_COLORS.GREEN : CHAT_COLORS.RED);
    }

    /**
     * Kontrola výhry - s lodash optimalizací
     * @param {Object} player - Hráč
     */
    checkVictory(player) {
        const state = gameState.getState();
        const hasWon = player.score >= state.targetScore;
        
        if (hasWon && !state.finalRound) {
            console.log(`🏆 ${player.name} dosáhl ${state.targetScore} bodů! Začíná finální kolo.`);
            
            gameState.updateState({
                finalRound: true,
                finalRoundLeader: player,
                finalRoundStartPlayerIndex: state.currentPlayerIndex
            });
            
            const message = `🏆 ${player.name} dosáhl ${state.targetScore} bodů! Finální kolo začíná!`;
            chatSystem.addSystemMessage(message, CHAT_COLORS.YELLOW);
            
            // 🎵 Zvuk pro dosažení cíle
            soundSystem.play('victory');
        }
        
        return hasWon && state.finalRound && this.checkFinalRoundCompletion();
    }

    /**
     * Kontrola dokončení finálního kola
     */
    checkFinalRoundCompletion() {
        const state = gameState.getState();
        if (!state.finalRound) return false;
        
        // Finální kolo končí, když se dostaneme zpět k hráči, který ho začal
        return state.currentPlayerIndex === state.finalRoundStartPlayerIndex;
    }

    /**
     * Ukončí hru a určí vítěze - s lodash maxBy
     */
    endGame() {
        const state = gameState.getState();
        
        // Lodash maxBy pro nalezení vítěze
        const winner = maxBy(state.players, 'score');
        
        console.log(`🏆 Hra skončila! Vítěz: ${winner.name} s ${winner.score} body`);
        
        const message = `🏆 Vítěz: ${winner.name} s ${winner.score} body!`;
        chatSystem.addSystemMessage(message, CHAT_COLORS.GOLD);
        
        // 🎵 Závěrečný zvuk
        soundSystem.play('gameEnd');
        
        gameState.updateState({ gamePhase: 'gameover' });
    }

    /**
     * Přepne na dalšího hráče
     */
    switchToNextPlayer() {
        const state = gameState.getState();
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        
        // Reset hasFarkle flag pro všechny hráče
        const resetPlayers = state.players.map(player => ({
            ...player,
            hasFarkle: false
        }));
        
        gameState.updateState({
            currentPlayerIndex: nextPlayerIndex,
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0,
            players: resetPlayers,
            isFarkleProcessing: false
        });
        
        const nextPlayer = resetPlayers[nextPlayerIndex];
        console.log(`🔄 Další hráč: ${nextPlayer.name}`);
        
        // Pokud je další hráč AI, automaticky začne hrát
        if (!nextPlayer.isHuman) {
            setTimeout(() => {
                console.log(`🤖 ${nextPlayer.name} začíná AI tah`);
                // Zde by se volala AI logika
            }, 1000);
        }
    }

    /**
     * Získá aktuální data tahu
     */
    getCurrentTurnData() {
        const state = gameState.getState();
        return {
            player: state.players[state.currentPlayerIndex],
            turnScore: state.turnScore || 0,
            savedDice: state.savedDice || [],
            currentRoll: state.currentRoll || [],
            canRoll: !state.isRolling && (!state.selectedDice || state.selectedDice.length === 0)
        };
    }
}
