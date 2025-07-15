/**
 * AI Strategies - Strategické algoritmy pro AI hráče
 * Přesunuto z aiPlayerController.js pro zmenšení velikosti
 */

import gameState from '../game/gameState.js';
import chatSystem from './chatSystem.js';

export class AiStrategies {
    /**
     * Analyzuje herní situaci pro strategické rozhodování
     */
    analyzeGameSituation(aiPlayer, state, turnPoints) {
        const players = state.players;
        const myScore = aiPlayer.score;
        const targetScore = state.targetScore || 10000;
        
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        const myPosition = sortedPlayers.findIndex(p => p.name === aiPlayer.name) + 1;
        const leadingScore = sortedPlayers[0].score;
        const gap = leadingScore - myScore;
        
        const gamePhase = this.determineGamePhase(myScore, leadingScore, targetScore);
        
        let riskTolerance = 'conservative';
        if (gamePhase === 'early') {
            riskTolerance = 'conservative';
        } else if (gamePhase === 'middle') {
            riskTolerance = myPosition <= 2 ? 'moderate' : 'aggressive';
        } else {
            if (gap > 2000) {
                riskTolerance = 'aggressive';
            } else if (myPosition === 1) {
                riskTolerance = 'conservative';
            } else {
                riskTolerance = 'aggressive';
            }
        }
        
        return {
            gamePhase,
            myPosition,
            gap,
            riskTolerance,
            remainingDice: state.currentRoll?.length || 6,
            turnPoints
        };
    }

    /**
     * Určí fázi hry
     */
    determineGamePhase(myScore, leadingScore, targetScore) {
        const maxScore = Math.max(myScore, leadingScore);
        const progress = maxScore / targetScore;
        
        if (progress < 0.3) return 'early';
        if (progress < 0.7) return 'middle';
        return 'late';
    }

    /**
     * Vypočítá riziko FARKLE
     */
    calculateFarkleRisk(remainingDice) {
        const riskTable = {
            1: 0.67, 2: 0.56, 3: 0.42, 4: 0.29, 5: 0.19, 6: 0.13
        };
        return riskTable[remainingDice] || 0.1;
    }

    /**
     * Oznámí rozhodnutí AI
     */
    announceDecision(aiPlayer, decision, totalPoints, strategy) {
        const { reason } = decision;
        
        let message = '';
        if (decision.nextAction === 'continue') {
            message = `Mám ${totalPoints} bodů, ale ${reason}! 🎯`;
        } else {
            message = `Ukončuji s ${totalPoints} body - ${reason}! ✅`;
        }
        
        chatSystem.addAiMessage(aiPlayer.name, message);
    }

    /**
     * Vypočítá rizikový faktor
     */
    calculateRiskFactor(remainingDice, currentPoints) {
        const diceRisk = (6 - remainingDice) / 6;
        const pointsRisk = Math.min(currentPoints / 1000, 1);
        return (diceRisk + pointsRisk) / 2;
    }

    // ...existing code...
    /**
     * Konzervativní strategie - bezpečné hraní
     * @param {Object} state - Stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {Object} Doporučená akce
     */
    static conservativeStrategy(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        
        if (turnScore >= 300) {
            return { action: 'endTurn', reason: 'Bezpečné ukončení s 300+ body' };
        }
        
        if (turnScore >= 150 && Math.random() < 0.7) {
            return { action: 'endTurn', reason: 'Konzervativní ukončení' };
        }
        
        return { action: 'continue', reason: 'Pokračovat opatrně' };
    }

    /**
     * Agresivní strategie - riskantní hraní
     * @param {Object} state - Stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {Object} Doporučená akce
     */
    static aggressiveStrategy(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        const currentScore = state.players[state.currentPlayerIndex].score;
        const targetScore = state.targetScore;
        const remainingPoints = targetScore - currentScore;
        
        if (remainingPoints <= turnScore) {
            return { action: 'endTurn', reason: 'Vítězství na dosah!' };
        }
        
        if (turnScore >= 1000) {
            return { action: 'endTurn', reason: 'Výborný tah s 1000+ body' };
        }
        
        if (turnScore >= 500 && Math.random() < 0.3) {
            return { action: 'endTurn', reason: 'Občasné ukončení' };
        }
        
        return { action: 'continue', reason: 'Riskujeme dál!' };
    }

    /**
     * Vyrovnaná strategie - střední cesta
     * @param {Object} state - Stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {Object} Doporučená akce
     */
    static balancedStrategy(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        
        if (turnScore >= 600) {
            return { action: 'endTurn', reason: 'Slušný zisk' };
        }
        
        if (turnScore >= 300 && Math.random() < 0.5) {
            return { action: 'endTurn', reason: 'Náhodné ukončení' };
        }
        
        return { action: 'continue', reason: 'Ještě pokračujeme' };
    }

    /**
     * Vybere strategii podle osobnosti AI
     * @param {Object} aiPlayer - AI hráč
     * @returns {Function} Strategická funkce
     */
    static getStrategy(aiPlayer) {
        const riskLevel = aiPlayer.personality?.riskLevel || 'medium';
        
        switch (riskLevel) {
            case 'low':
                return this.conservativeStrategy;
            case 'high':
                return this.aggressiveStrategy;
            default:
                return this.balancedStrategy;
        }
    }
}

export default AiStrategies;
