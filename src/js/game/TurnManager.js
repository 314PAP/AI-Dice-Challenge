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
import soundSystem from '../utils/soundSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';
import { AiPlayerController } from '../ai/aiPlayerController.js';

/**
 * Třída pro správu tahů hry
 */
export class TurnManager {
    constructor() {
        this.gameLogic = null;
        this.aiController = null;
        this.aiTurnInProgress = false; // Ochrana proti duplicitním AI tahům
    }

    /**
     * Nastaví reference na gameLogic pro AI funkčnost
     * @param {Object} gameLogic - Instance GameLogic
     */
    setGameLogic(gameLogic) {
        this.gameLogic = gameLogic;
        this.aiController = new AiPlayerController(gameLogic);
    }

    /**
     * Ukončí tah hráče
     * @param {boolean} isFarkle - Zda je tah ukončen FARKLE
     */
    endTurn(isFarkle = false) {
        const state = gameState.getState();
        if (state.gamePhase === 'gameover') return; // Hra skončila

        const result = this.calculateTurnResult(isFarkle);
        this.updatePlayerScore(result.player.name, result.pointsGained);

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

        // Přejdeme na dalšího hráče
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
    updatePlayerScore(playerName, points) {
        const state = gameState.getState();
        const playerIndex = state.players.findIndex(p => p.name === playerName);

        if (playerIndex === -1) {
            console.error(`❌ Hráč ${playerName} nenalezen`);
            return;
        }

        const player = state.players[playerIndex];
        const oldScore = player.score;
        const newScore = oldScore + points;

        console.log(`🔍 updatePlayerScore: ${playerName} měl ${oldScore}, získává ${points}, bude mít ${newScore}`);

        // Aktualizace skóre
        gameState.updatePlayerScore(playerName, points);

        // Systémové zprávy a animace
        if (points > 0) {
            console.log(`✅ ${playerName}: +${points} bodů (${oldScore} → ${newScore})`);

            const color = playerName === "Hráč" ? CHAT_COLORS.GREEN : CHAT_COLORS.BLUE;
            chatSystem.addMessage(playerName, `Ukončuji tah. Solidní výsledek! ✅`, color);

        } else {
            console.log(`💥 ${playerName}: FARKLE! (${newScore} bodů)`);
        }

        // Kontrola vítězství s aktualizovaným skóre
        const updatedPlayer = { ...player, score: newScore };
        this.checkVictory(updatedPlayer);
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

        console.log(`🔍 checkVictory: ${player.name} má ${player.score} bodů, cíl ${state.targetScore}, hasWon: ${hasWon}, finalRound: ${state.finalRound}`);

        if (hasWon && !state.finalRound) {
            console.log(`🏆 ${player.name} dosáhl ${state.targetScore} bodů! Začíná finální kolo.`);

            gameState.updateState({
                finalRound: true,
                finalRoundLeader: player.name,
                finalRoundStartPlayerIndex: state.currentPlayerIndex
            });

            const message = `🏆 ${player.name} dosáhl ${state.targetScore} bodů! Finální kolo začíná!`;
            chatSystem.addSystemMessage(message, CHAT_COLORS.YELLOW);

            // 🎵 Zvuk pro dosažení cíle
            soundSystem.play('victory');

            // Neukončujeme hru zde - čekáme na dokončení finálního kola
            return false;
        }

        // Pokud už je finální kolo a někdo dosáhne vyššího skóre, hra pokračuje
        return false;
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

        // Uložíme vítěze do síně slavy
        import('../utils/hallOfFame.js').then(({ addScoreToHallOfFame }) => {
            addScoreToHallOfFame(winner.name, winner.score);
        }).catch(error => {
            console.error('❌ Chyba při ukládání do síně slavy:', error);
        });

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

        // Kontrola finálního kola - pokud jsme zpět u hráče, který ho začal
        console.log(`🔍 switchToNextPlayer: finalRound: ${state.finalRound}, nextPlayerIndex: ${nextPlayerIndex}, finalRoundStartPlayerIndex: ${state.finalRoundStartPlayerIndex}`);

        if (state.finalRound && nextPlayerIndex === state.finalRoundStartPlayerIndex) {
            console.log(`🏁 Finální kolo dokončeno - určujeme vítěze`);
            this.endGame();
            return;
        }

        // Pokud je další hráč AI, automaticky začne hrát
        if (!nextPlayer.isHuman) {
            console.log(`🤖 ${nextPlayer.name} začíná AI tah`);

            // AI timeout bez flag ochrany - každý AI má vlastní timeout
            setTimeout(async () => {
                try {
                    if (this.aiController) {
                        await this.aiController.playAiTurn(nextPlayer);
                    } else {
                        console.error('❌ AI Controller není inicializován!');
                    }
                } catch (error) {
                    console.error('❌ Chyba v AI tahu:', error);
                }
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
