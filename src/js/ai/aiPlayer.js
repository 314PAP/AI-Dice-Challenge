/**
 * AI Player Logic
 * Logika pro AI hráče
 */

import { gameState, getCurrentPlayer } from '../game/gameState.js';
import { rollDice, calculateScore, findBestScoringCombination } from '../game/diceLogic.js';
import { updateGameDisplay } from '../ui/gameUI.js';
// Use global addChatMessage instead of direct import
import { generateAIGameReaction, enhancedAI } from '../../ai/controllers/enhancedAIController.js';
import { endTurn } from '../game/gameController.js';

/**
 * Spustí tah AI hráče
 */
export function playAITurn() {
    const aiPlayer = getCurrentPlayer();
    gameState.rollsLeft = 3;
    gameState.currentTurnScore = 0;
    gameState.dice = [];
    gameState.bankedDice = [];
    
    // Vymazat předchozí farkle značky
    gameState.dice.forEach(die => delete die.farkle);
    
    playAIRoll();
}

/**
 * Provede hod kostkami pro AI
 */
function playAIRoll() {
    const aiPlayer = getCurrentPlayer();

    // Roll dice
    const diceToRoll = 6 - gameState.bankedDice.length;
    gameState.dice = rollDice(diceToRoll);
    gameState.rollsLeft--;
    
    // Vymazat předchozí farkle značky
    gameState.dice.forEach(die => delete die.farkle);
    
    const diceValues = gameState.dice.map(d => d.value);
    const rollScore = calculateScore(diceValues);
    
    window.addChatMessage && window.addChatMessage('system', `${aiPlayer.name} hodil: ${diceValues.join(', ')} - Možné body z hodu: ${rollScore}`);
    
    if (rollScore === 0) {
        // Farkle - žádné bodující kostky
        console.log(`❌ AI ${aiPlayer.name}: FARKLE detekován!`);
        
        // Označit kostky jako farkle pro vizuální efekt
        gameState.dice.forEach(die => die.farkle = true);
        
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'farkle');
        if (reaction && window.addChatMessage) window.addChatMessage(aiPlayer.type, reaction);
        window.addChatMessage && window.addChatMessage('system', `❌ ${aiPlayer.name} neměl žádné bodující kostky! FARKLE! Tah končí s 0 body.`);
        
        setTimeout(() => {
            console.log(`🔄 AI ${aiPlayer.name}: Automaticky ukončuji tah po farkle...`);
            endTurn(false);
        }, 2000);
        
        updateGameDisplay();
        return;
    }
    
    // AI strategy: find the best scoring combination and bank it
    const bestCombination = findBestScoringCombination(diceValues);
    
    if (bestCombination && bestCombination.score > 0) {
        // Bank the best scoring combination
        gameState.currentTurnScore += bestCombination.score;
        gameState.bankedDice = gameState.bankedDice.concat(bestCombination.dice);
        
        // Remove banked dice from current dice
        let remainingDice = [...diceValues];
        bestCombination.dice.forEach(value => {
            let index = remainingDice.indexOf(value);
            if (index > -1) remainingDice.splice(index, 1);
        });
        
        // Update dice state
        gameState.dice = remainingDice.map(value => ({ value, selected: false }));
        
        window.addChatMessage && window.addChatMessage('system', `${aiPlayer.name} odložil: ${bestCombination.dice.join(', ')} za ${bestCombination.score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`);
        
        // HOT DICE: Check if all dice are banked
        if (gameState.bankedDice.length === 6) {
            gameState.bankedDice = [];
            gameState.rollsLeft = Math.max(gameState.rollsLeft, 1);
            window.addChatMessage && window.addChatMessage('system', `🔥 ${aiPlayer.name} odložil všechny kostky! HOT DICE! Pokračuje s novými kostkami.`);
            
            // AI reakce na hot dice
            const hotDiceReaction = enhancedAI.generateAIResponse(aiPlayer.type, 'hotdice');
            if (hotDiceReaction) {
                setTimeout(() => window.addChatMessage && window.addChatMessage(aiPlayer.type, hotDiceReaction), 500);
            }
            
            setTimeout(() => {
                updateGameDisplay();
                playAIRoll();
            }, 2000);
            return;
        }
        
        // AI decides whether to continue or end turn
        const shouldContinue = decideAIAction(aiPlayer);
        
        if (shouldContinue && gameState.rollsLeft > 0 && gameState.dice.length > 0) {
            // Continue rolling
            setTimeout(() => {
                updateGameDisplay();
                playAIRoll();
            }, 2000);
        } else if (gameState.bankedDice.length === 6 && gameState.rollsLeft > 0) {
            // All dice banked, continue with fresh dice
            gameState.bankedDice = [];
            window.addChatMessage && window.addChatMessage('system', `${aiPlayer.name} odložil všechny kostky a pokračuje s novými.`);
            setTimeout(() => {
                updateGameDisplay();
                playAIRoll();
            }, 2000);
        } else {
            // End turn
            const score = gameState.currentTurnScore;
            let reaction;
            
            if (score >= 500) {
                reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'highscore', { score });
            } else {
                reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'scoredPoints', { score });
            }
            
            if (reaction && window.addChatMessage) window.addChatMessage(aiPlayer.type, reaction);
            
            setTimeout(() => endTurn(true), 2000);
        }
    } else {
        // This shouldn't happen if rollScore > 0, but just in case
        const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'farkle');
        if (reaction && window.addChatMessage) window.addChatMessage(aiPlayer.type, reaction);
        window.addChatMessage && window.addChatMessage('system', `${aiPlayer.name} neměl žádné bodující kostky! Tah končí.`);
        
        setTimeout(() => endTurn(false), 2000);
    }
    
    updateGameDisplay();
}

/**
 * Rozhoduje, zda má AI pokračovat v házení nebo ukončit tah
 * @param {Object} aiPlayer - AI hráč
 * @returns {boolean} True pokud má pokračovat
 */
function decideAIAction(aiPlayer) {
    const currentScore = gameState.currentTurnScore;
    const rollsLeft = gameState.rollsLeft;
    const diceLeft = gameState.dice.length;
    const totalScore = gameState.players[gameState.currentPlayer].score;
    const targetScore = gameState.targetScore;
    const isCloseToWinning = totalScore + currentScore >= targetScore * 0.8;
    
    // Faktory ovlivňující rozhodnutí
    const riskFactor = calculateRiskFactor(diceLeft, rollsLeft);
    const scorePressure = isCloseToWinning ? 0.8 : 1.0; // Méně rizika, když jsme blízko vítězství
    
    // Finální kolo - konzervatizmus
    if (gameState.finalRound) {
        const leadingScore = Math.max(...gameState.players.map(p => p.score));
        const neededScore = leadingScore - totalScore + 50; // Pokusit se být o 50 bodů lepší
        
        if (currentScore >= neededScore) {
            return false; // Končit, máme dost bodů
        }
        return currentScore < neededScore && rollsLeft > 0 && diceLeft >= 2;
    }
    
    // Různé strategie pro různé AI typy
    switch (aiPlayer.type) {
        case 'gemini':
            // Konzervativní, data-driven přístup
            const geminiThreshold = Math.max(300, targetScore * 0.05) * scorePressure;
            return currentScore < geminiThreshold && 
                   rollsLeft > 0 && 
                   diceLeft >= 3 && 
                   riskFactor < 0.7;
            
        case 'chatgpt':
            // Mírně rizikový, přátelský přístup
            const chatgptThreshold = Math.max(400, targetScore * 0.04) * scorePressure;
            return currentScore < chatgptThreshold && 
                   rollsLeft > 0 && 
                   diceLeft >= 2 && 
                   riskFactor < 0.8;
            
        case 'claude':
            // Filozofický, vyvážený přístup - adaptivní strategie
            const claudeThreshold = adaptiveThreshold(totalScore, targetScore) * scorePressure;
            return currentScore < claudeThreshold && 
                   rollsLeft > 0 && 
                   diceLeft >= 2 && 
                   riskFactor < 0.75;
            
        default:
            return currentScore < 300 && rollsLeft > 0 && diceLeft >= 2;
    }
}

/**
 * Vypočítá rizikový faktor na základě počtu kostek a hodů
 * @param {number} diceLeft - Počet zbývajících kostek
 * @param {number} rollsLeft - Počet zbývajících hodů
 * @returns {number} Rizikový faktor 0-1 (0=bezpečné, 1=velmi rizikové)
 */
function calculateRiskFactor(diceLeft, rollsLeft) {
    if (diceLeft <= 1) return 0.9; // Velmi rizikové
    if (diceLeft === 2) return 0.6; // Středně rizikové
    if (diceLeft >= 4) return 0.2; // Relativně bezpečné
    return 0.4; // Mírně rizikové
}

/**
 * Adaptivní práh pro Claude AI na základě pozice ve hře
 * @param {number} currentTotal - Současné celkové skóre
 * @param {number} target - Cílové skóre
 * @returns {number} Doporučený práh pro ukončení tahu
 */
function adaptiveThreshold(currentTotal, target) {
    const progress = currentTotal / target;
    
    if (progress < 0.3) return 500; // Začátek hry - agresivnější
    if (progress < 0.6) return 400; // Střed hry - vyvážené
    if (progress < 0.8) return 350; // Pozdní hra - opatrnější
    return 250; // Konec hry - velmi opatrné
}
