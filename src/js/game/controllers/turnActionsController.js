/**
 * Turn Actions Controller
 * Handles player actions during turns: rolling dice, selecting dice, banking dice
 */

import { gameState } from '../gameState.js';
import { rollDice, calculateScore } from '../diceLogic.js';
import { updateGameDisplay } from '../../ui/gameUI.js';
import { clearDiceState, debouncedChatMessage } from '../../utils/gameUtils.js';

/**
 * Hod kostkami pro lidského hráče
 */
export function rollDiceForPlayer() {
    // Check if player can roll (must have available dice and be current player)
    if (gameState.availableDice <= 0 || gameState.currentPlayer !== 0) {
        console.warn('Cannot roll dice: no available dice or not player turn');
        return;
    }
    
    console.log(`🎲 Rolling ${gameState.availableDice} dice...`);
    
    // Roll available dice
    const diceResults = rollDice(gameState.availableDice);
    gameState.diceValues = diceResults.map(die => die.value);
    gameState.selectedDice = []; // Clear selection
    // Don't reset mustBankDice here - it will be set based on roll result
    
    const rollScore = calculateScore(gameState.diceValues);
    
    // Debug log
    console.log('🎲 Dice rolled:', gameState.diceValues, 'Possible score:', rollScore);
    
    window.addChatMessage('system', `Hod: ${gameState.diceValues.join(', ')} - Možné body z hodu: ${rollScore}`);
    
    if (rollScore === 0) {
        // Farkle - no scoring dice
        console.log('❌ FARKLE detected! Ending turn...');
        window.addChatMessage('system', '❌ FARKLE! Žádné bodující kostky! Tah končí s 0 body.');
        
        // Update UI for farkle display
        const humanStatus = document.getElementById('humanPlayerStatus');
        
        if (gameState.currentPlayer === 0 && humanStatus) {
            humanStatus.textContent = 'FARKLE! Tah končí s 0 body!';
            humanStatus.style.color = 'var(--neon-orange)';
        }
        
        // Update display and end turn after delay
        updateGameDisplay();
        setTimeout(async () => {
            // Only continue if game is still running
            if (!gameState.gameEnded && gameState.gameStarted) {
                // End the turn due to FARKLE, but don't auto-advance to next player
                const { endTurn } = await import('./gameFlowController.js');
                endTurn(false); // false means no score (FARKLE)
            }
        }, 2000);
        
        return;
    }
    
    // Successful roll - player must select dice to bank
    gameState.mustBankDice = true;
    updateGameDisplay();
    
    // Allow dice selection
    console.log('✅ Successful roll, waiting for dice selection...');
    window.addChatMessage('system', 'Musíte odložit alespoň jednu bodující kombinaci! Vyberte kostky k odložení.');
}

/**
 * Vybere/odznačí kostku
 */
export function selectDie(index) {
    if (gameState.currentPlayer !== 0 || !gameState.mustBankDice) return;
    
    if (gameState.selectedDice.includes(index)) {
        // Deselect die
        gameState.selectedDice = gameState.selectedDice.filter(i => i !== index);
    } else {
        // Select die
        gameState.selectedDice.push(index);
    }
    
    updateGameDisplay();
}
    
/**
 * Odloží vybrané kostky
 */
export function bankSelectedDice() {
    console.log('🏦 bankSelectedDice called');
    console.log('🎲 Selected dice:', gameState.selectedDice);
    console.log('🎮 Current player:', gameState.currentPlayer);
    console.log('🎯 Must bank dice:', gameState.mustBankDice);
    
    if (gameState.selectedDice.length === 0) {
        console.log('❌ No dice selected');
        window.addChatMessage('system', 'Vyberte kostky, které chcete odložit.');
        return;
    }
    
    // Get selected dice values
    const selectedValues = gameState.selectedDice.map(index => gameState.diceValues[index]);
    const score = calculateScore(selectedValues);
    
    console.log('🎲 Selected values:', selectedValues);
    console.log('💰 Calculated score:', score);
    
    if (score === 0) {
        console.log('❌ Selected dice have no score');
        window.addChatMessage('system', 'Vybrané kostky nenesou žádné body! Vyberte platné bodující kostky.');
        return;
    }
    
    console.log('✅ Banking dice with score:', score);
    
    // Add score to turn total
    gameState.currentTurnScore += score;
    
    // Store banked dice for visual display
    if (!gameState.bankedDiceThisTurn) {
        gameState.bankedDiceThisTurn = [];
    }
    gameState.bankedDiceThisTurn.push(...selectedValues);
    
    // Remove banked dice from available dice
    gameState.availableDice -= gameState.selectedDice.length;
    
    // Clear current roll and selection
    gameState.diceValues = [];
    gameState.selectedDice = [];
    gameState.mustBankDice = false;
    
    window.addChatMessage('system', `Odloženo: ${selectedValues.join(', ')} za ${score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`);
    
    // HOT DICE: Check if all dice are banked
    if (gameState.availableDice === 0) {
        gameState.availableDice = 6; // Reset to 6 dice
        // Use optimized clear function
        clearDiceState(gameState);
        debouncedChatMessage('system', '🔥 HOT DICE! Všechny kostky odloženy! Můžete pokračovat v házení všech 6 kostek.');
    }
    
    updateGameDisplay();
}
