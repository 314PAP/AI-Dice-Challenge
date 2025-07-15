/**
 * AI Decision Engine - Logika rozhodování pro AI hráče
 * Přesunuto z aiPlayerController.js pro zmenšení velikosti
 */

import { calculatePoints, hasScoringDice } from '../game/diceMechanics.js';
import gameState from '../game/gameState.js';
import chatSystem from './chatSystem.js';

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
        
        // Testujeme jednotlivé kostky - ale pouze pokud jsou validní podle pravidel
        for (let i = 0; i < dice.length; i++) {
            const dieValue = dice[i];
            
            // Jedničky a pětky lze vždy vybrat
            if (dieValue === 1 || dieValue === 5) {
                const testDice = [dieValue];
                const points = calculatePoints(testDice);
                combinations.push({
                    indices: [i],
                    points: points,
                    dice: testDice
                });
            } else {
                // Pro ostatní hodnoty (2,3,4,6) kontrolujeme, zda je jich alespoň 3
                const countOfValue = dice.filter(die => die === dieValue).length;
                if (countOfValue >= 3) {
                    // Najdeme všechny indexy této hodnoty
                    const allIndices = dice.map((die, idx) => die === dieValue ? idx : -1).filter(idx => idx !== -1);
                    const testDice = allIndices.slice(0, 3).map(idx => dice[idx]); // Minimálně 3 kusy
                    const points = calculatePoints(testDice);
                    
                    combinations.push({
                        indices: allIndices.slice(0, 3), // Minimálně 3 indexy
                        points: points,
                        dice: testDice
                    });
                }
            }
        }
        
        // Odstraníme duplicity a seřadíme podle bodů
        const uniqueCombinations = combinations.filter((combo, index, arr) => {
            return arr.findIndex(c => JSON.stringify(c.indices.sort()) === JSON.stringify(combo.indices.sort())) === index;
        });
        
        return uniqueCombinations.sort((a, b) => b.points - a.points);
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

    /**
     * Hlavní rozhodovací metoda AI - zjednodušená verze
     */
    makeDecision(aiPlayer, state) {
        const bestDice = this.findBestDiceToSave(state.currentRoll);
        
        if (bestDice.length === 0) {
            return { action: 'wait' };
        }
        
        // OPRAVA: turnScore už obsahuje body ze všech uložených kostek v tomto tahu
        const currentTurnPoints = state.turnScore || 0;
        const newPoints = calculatePoints(bestDice.map(i => state.currentRoll[i]));
        const totalPoints = currentTurnPoints + newPoints;
        
        // LOGIKA PRVNÍHO ZÁPISU
        if (aiPlayer.score === 0) {
            if (totalPoints < 300) {
                chatSystem.addAiMessage(aiPlayer.name, `Potřebuji ještě ${300 - totalPoints} bodů pro první zápis! 🎯`);
                return { action: 'save', diceToSave: bestDice, nextAction: 'continue' };
            } else {
                chatSystem.addAiMessage(aiPlayer.name, `Mám ${totalPoints} bodů - dosáhl jsem prvního zápisu! ✅`);
                return { action: 'save', diceToSave: bestDice, nextAction: 'endTurn' };
            }
        }
        
        // Základní rozhodování - zjednodušené
        const shouldRisk = totalPoints < 500 && Math.random() > 0.5;
        const action = shouldRisk ? 'continue' : 'endTurn';
        
        chatSystem.addAiMessage(aiPlayer.name, 
            action === 'continue' ? `Mám ${totalPoints} bodů, ale zkusím ještě! 🎯` : `Ukončuji s ${totalPoints} body! ✅`
        );
        
        return { action: 'save', diceToSave: bestDice, nextAction: action };
    }

    /**
     * Najde nejlepší kostky k odložení - opravená verze
     */
    findBestDiceToSave(dice) {
        if (!dice || dice.length === 0) return [];
        
        const combinations = AiDecisionEngine.findScoringCombinations(dice);
        
        if (combinations.length === 0) return [];
        
        // Nejlepší kombinace podle bodů na kostku
        combinations.sort((a, b) => (b.points / b.indices.length) - (a.points / a.indices.length));
        
        return combinations[0].indices;
    }
}

export default AiDecisionEngine;
