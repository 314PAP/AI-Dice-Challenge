/**
 * Turn Actions Controller
 * Handles player actions during turns: rolling dice, selecting dice, banking dice
 */

import { gameState, nextPlayer, getCurrentPlayer } from '../gameState.js';
import { rollDice, calculateScore, hasScoringDice, validateDiceSelection } from '../diceLogic.js';
import { updateGameDisplay } from '../../ui/gameUI.js';
import { playerTurn } from './gameFlowController.js';

/**
 * Hod kostkami pro lidského hráče
 */
export function rollDiceForPlayer() {
    if (gameState.rollsLeft <= 0 || gameState.currentPlayer !== 0) return;
    
    const diceToRoll = 6 - gameState.bankedDice.length;
    gameState.dice = rollDice(diceToRoll);
    gameState.rollsLeft--;
    gameState.mustBankDice = false; // Reset flag
    
    // Vymazat předchozí farkle značky
    gameState.dice.forEach(die => delete die.farkle);
    
    const diceValues = gameState.dice.map(d => d.value);
    const rollScore = calculateScore(diceValues);
    
    // Debug log
    console.log('🎲 Hod kostek:', diceValues, 'Skóre:', rollScore);
    
    window.addChatMessage('system', `Hod: ${diceValues.join(', ')} - Možné body z hodu: ${rollScore}`);
    
    if (rollScore === 0) {
        // Farkle - žádné bodující kostky
        console.log('❌ FARKLE detekován! Ukončuji tah...');
        window.addChatMessage('system', `❌ FARKLE! Žádné bodující kostky! Tah končí s 0 body.`);
        
        // Označit kostky jako farkle pro vizuální efekt
        gameState.dice.forEach(die => die.farkle = true);
        
        // Aktualizovat UI pro zobrazení farkle
        const humanStatus = document.getElementById('humanPlayerStatus');
        const aiStatus = document.getElementById('aiPlayerStatus');
        
        if (gameState.currentPlayer === 0) {
            if (humanStatus) {
                humanStatus.textContent = 'FARKLE! Tah končí s 0 body!';
                humanStatus.style.color = 'var(--neon-orange)';
            }
        } else {
            if (aiStatus) {
                aiStatus.textContent = 'FARKLE! Tah končí s 0 body!';
                aiStatus.style.color = 'var(--neon-orange)';
            }
        }
        
        // AI reakce na farkle (pouze pokud je to lidský hráč)
        if (gameState.currentPlayer === 0 && window.triggerFarkleHeckling) {
            window.triggerFarkleHeckling('Vy');
        }
        
        // Zpoždění před automatickým ukončením tahu
        setTimeout(() => {
            console.log('🔄 Automaticky ukončuji tah po farkle...');
            gameState.currentTurnScore = 0; // Zrušit všechny body z tohoto tahu
            nextPlayer();
            playerTurn();
        }, 2000);
        
        updateGameDisplay();
        return;
    } else {
        // Máme bodující kostky - musíme odložit alespoň něco před dalším hodem
        gameState.mustBankDice = true;
        window.addChatMessage('system', `🎯 Máte bodující kostky! Musíte odložit alespoň jednu bodující kombinaci před dalším hodem.`);
    }
    
    updateGameDisplay();
}

/**
 * Vybere/odznačí kostku
 */
export function selectDie(index) {
    if (gameState.currentPlayer !== 0) return;
    
    gameState.dice[index].selected = !gameState.dice[index].selected;
    updateGameDisplay();
}

/**
 * Odloží vybrané kostky
 */
export function bankSelectedDice() {
    const selectedDice = gameState.dice.filter(d => d.selected);
    if (selectedDice.length === 0) {
        window.addChatMessage('system', "Vyberte kostky, které chcete odložit.");
        return;
    }
    
    const selectedValues = selectedDice.map(d => d.value);
    const score = calculateScore(selectedValues);
    
    if (score === 0) {
        window.addChatMessage('system', "Vybrané kostky nenesou žádné body! Vyberte platné bodující kosty.");
        return;
    }
    
    gameState.currentTurnScore += score;
    gameState.bankedDice = gameState.bankedDice.concat(selectedValues);
    gameState.dice = gameState.dice.filter(d => !d.selected);
    gameState.mustBankDice = false; // Reset after banking
    
    window.addChatMessage('system', `Odloženo: ${selectedValues.join(', ')} za ${score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`);
    
    // HOT DICE: Kontrola, zda jsou všechny kostky odložené
    if (gameState.bankedDice.length === 6) {
        gameState.bankedDice = [];
        gameState.rollsLeft = Math.max(gameState.rollsLeft, 1); // Zajistit alespoň jeden hod
        window.addChatMessage('system', "🔥 HOT DICE! Všechny kostky odloženy! Můžete pokračovat v házení všech 6 kostek.");
    }
    
    updateGameDisplay();
}
