/**
 * AI Decision Engine - Logika rozhodování pro AI hráče
 * Přesunuto z aiPlayerController.js pro zmenšení velikosti
 */

import { calculatePoints, hasScoringDice } from '../game/diceMechanics.js';
import gameState from '../game/gameState.js';

export class AiDecisionEngine {
    /**
     * Rozhodne, které kostky vybrat
     * @param {Array} currentRoll - Aktuální kostky na stole
     * @param {Object} aiPlayer - AI hráč
     * @returns {Array} Indexy kostek k výběru
     */
    static selectDice(currentRoll, aiPlayer) {
        if (!currentRoll || currentRoll.length === 0) return [];
        
        // Najdeme všechny možné kombinace
        const combinations = this.findScoringCombinations(currentRoll);
        if (combinations.length === 0) return [];
        
        // Vybereme kombinaci podle osobnosti AI
        return this.chooseBestCombination(combinations, aiPlayer);
    }

    /**
     * Rozhodne, zda pokračovat v házení
     * @param {Object} state - Současný stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {boolean} Pokračovat v házení?
     */
    static shouldContinueRolling(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        const currentScore = state.players[state.currentPlayerIndex].score;
        const targetScore = state.targetScore;
        
        // Základní strategie podle osobnosti
        switch (aiPlayer.personality?.riskLevel || 'medium') {
            case 'low':
                return turnScore < 500 && (targetScore - currentScore) > 1500;
            case 'medium':
                return turnScore < 800 && (targetScore - currentScore) > 1000;
            case 'high':
                return turnScore < 1200 && (targetScore - currentScore) > 500;
            default:
                return turnScore < 600;
        }
    }

    /**
     * Najde všechny možné bodující kombinace
     * @param {Array} dice - Kostky k analýze
     * @returns {Array} Pole kombinací s body a indexy
     */
    static findScoringCombinations(dice) {
        const combinations = [];
        
        // Pro jednoduchost - najdeme nejlepší kombinaci
        for (let i = 0; i < dice.length; i++) {
            const testSelection = [i];
            const points = calculatePoints(dice, testSelection);
            if (points > 0) {
                combinations.push({
                    indices: testSelection,
                    points: points,
                    dice: [dice[i]]
                });
            }
        }
        
        return combinations.sort((a, b) => b.points - a.points);
    }

    /**
     * Vybere nejlepší kombinaci podle osobnosti AI
     * @param {Array} combinations - Možné kombinace
     * @param {Object} aiPlayer - AI hráč
     * @returns {Array} Indexy vybrané kombinace
     */
    static chooseBestCombination(combinations, aiPlayer) {
        if (combinations.length === 0) return [];
        
        const riskLevel = aiPlayer.personality?.riskLevel || 'medium';
        
        switch (riskLevel) {
            case 'low':
                // Vždy nejbezpečnější volba
                return combinations[0].indices;
            case 'high':
                // Občas riskantní volba
                const riskChoice = Math.random() < 0.3 ? 1 : 0;
                return combinations[Math.min(riskChoice, combinations.length - 1)].indices;
            default:
                // Rozumná volba
                return combinations[0].indices;
        }
    }
}

export default AiDecisionEngine;
