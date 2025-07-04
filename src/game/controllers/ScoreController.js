/**
 * 📊 Score Controller - Modul pro správu skóre
 * 
 * Klíčové funkce:
 * - Výpočet skóre podle Farkle pravidel
 * - Podpora straight (1-6), trojic, čtveřic, pětic, šestic
 * - Správa skóre vybraných kostek v real-time
 * - Aktualizace score boardu a turn score
 * - Kontrola vítězných podmínek
 * 
 * Implementuje kompletní scoring systém pro Farkle hru
 * s podporou všech standardních kombinací.
 * 
 * @author AI Assistant & pipap
 * @version 1.0 - Modulární extrakce
 * @date 2025-07-01
 */

import { GAME_CONSTANTS } from '../../core/constants.js';
import { gameState } from '../../js/game/gameState.js';

export class ScoreController {
    constructor(gameController) {
        this.gameController = gameController;
    }

    /**
     * Vypočítá skóre pro dané hodnoty kostek
     */
    calculateDiceScore(values) {
        if (!values || values.length === 0) return 0;

        let score = 0;
        const counts = [0, 0, 0, 0, 0, 0, 0]; // index 0 unused, 1-6 for dice values

        // Spočítej výskyty jednotlivých hodnot
        values.forEach(value => {
            if (value >= 1 && value <= 6) {
                counts[value]++;
            }
        });

        // Kontrola straight (1,2,3,4,5,6)
        if (values.length === 6 && counts.slice(1).every(count => count === 1)) {
            return GAME_CONSTANTS.SCORING.STRAIGHT;
        }

        // Zpracuj trojice, čtveřice, páry
        for (let value = 1; value <= 6; value++) {
            const count = counts[value];
            
            if (count >= 6) {
                score += (value === 1) ? GAME_CONSTANTS.SCORING.SIX_ONES : value * 1000;
                counts[value] -= 6;
            } else if (count >= 5) {
                score += (value === 1) ? GAME_CONSTANTS.SCORING.FIVE_ONES : value * 500;
                counts[value] -= 5;
            } else if (count >= 4) {
                score += (value === 1) ? GAME_CONSTANTS.SCORING.FOUR_ONES : value * 200;
                counts[value] -= 4;
            } else if (count >= 3) {
                const baseScore = (value === 1) ? GAME_CONSTANTS.SCORING.THREE_ONES : value * 100;
                score += baseScore;
                counts[value] -= 3;
            }
        }

        // Zpracuj zbývající jednotky a pětky
        score += counts[1] * GAME_CONSTANTS.SCORING.SINGLE_ONE; // Zbývající jedničky
        score += counts[5] * GAME_CONSTANTS.SCORING.SINGLE_FIVE; // Zbývající pětky

        return score;
    }

    /**
     * Vypočítá skóre pro aktuálně vybrané kostky
     */
    calculateSelectedScore() {
        const selectedDice = this.gameController.currentDice.filter(d => d.selected);
        const values = selectedDice.map(d => d.value);
        const score = this.calculateDiceScore(values);
        
        // Aktualizuj zobrazení
        const selectedScoreElement = document.getElementById('selectedScore');
        if (selectedScoreElement) {
            selectedScoreElement.textContent = score;
        }
        
        return score;
    }

    /**
     * Aktualizuje skóre tahu
     */
    updateTurnScore() {
        const element = document.getElementById('turnScore');
        if (element) {
            element.textContent = this.gameController.turnScore;
        }
    }

    /**
     * Aktualizuje celkové skóre v tabulce
     */
    updateScoreboard() {
        gameState.players.forEach((player) => {
            const scoreElement = document.getElementById(`${player.type}Score`);
            if (scoreElement) {
                scoreElement.textContent = player.score;
            }
        });
    }

    /**
     * Zkontroluje vítěze
     */
    checkWinner() {
        const currentPlayer = gameState.players[gameState.currentPlayer];
        if (currentPlayer && currentPlayer.score >= gameState.targetScore) {
            return currentPlayer;
        }
        return null;
    }

    /**
     * Přidá body k celkovému skóre hráče
     */
    addScoreToPlayer(playerId, score) {
        if (gameState.players[playerId]) {
            gameState.players[playerId].score += score;
            this.updateScoreboard();
        }
    }
}
