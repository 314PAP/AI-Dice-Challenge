/**
 * 🎲 Dice Rendering Module - Zjednodušená implementace
 */

import { gameState } from '../../game/gameState.js';
import { calculateScore } from '../../game/diceLogic.js';

// 🎲 DICE ELEMENT CREATION - Simplified implementation
export const createDiceElement = (value, index, type = 'current') => {
    const dieElement = document.createElement('div');
    
    // Build CSS classes
    const classes = ['dice'];
    
    if (type === 'banked') {
        classes.push('banked');
    }
    
    if (type === 'current') {
        if (gameState.selectedDice && gameState.selectedDice.includes(index)) {
            classes.push('selected');
        }
        
        if (!gameState.selectedDice.includes(index) && 
            gameState.currentPlayer === 0 && 
            calculateScore([value]) > 0) {
            classes.push('scoring');
        }
    }
    
    dieElement.className = classes.join(' ');
    dieElement.textContent = value;
    
    // Add click handler for current dice only
    if (type === 'current' && gameState.currentPlayer === 0) {
        dieElement.addEventListener('click', async () => {
            console.log(`🎲 Die ${index} clicked (value: ${value})`);
            try {
                const { selectDie } = await import('../../game/controllers/turnActionsController.js');
                selectDie(index);
            } catch (error) {
                console.error('Error selecting die:', error);
            }
        });
        dieElement.style.cursor = 'pointer';
        console.log(`✅ Click handler added to die ${index} with value ${value}`);
    }
    
    return dieElement;
};

// 🎯 DICE CONTAINER UPDATER - Simplified and reliable
export const updateDiceContainer = () => {
    console.log('🎲 Updating dice container...');
    const container = document.getElementById('diceContainer');
    
    if (!container) {
        console.warn('🚫 Dice container not found');
        return null;
    }
    
    // Clear container
    container.innerHTML = '';
    
    const allDiceContainer = document.createElement('div');
    allDiceContainer.className = 'all-dice-container';
    
    // Render banked dice first (if any)
    if (gameState.bankedDiceThisTurn && gameState.bankedDiceThisTurn.length > 0) {
        console.log('🏦 Rendering banked dice:', gameState.bankedDiceThisTurn);
        gameState.bankedDiceThisTurn.forEach(value => {
            const dieElement = createDiceElement(value, -1, 'banked');
            allDiceContainer.appendChild(dieElement);
        });
    }
    
    // Render current dice roll
    if (gameState.diceValues && gameState.diceValues.length > 0) {
        console.log('🎲 Rendering current dice:', gameState.diceValues);
        gameState.diceValues.forEach((value, index) => {
            const dieElement = createDiceElement(value, index, 'current');
            allDiceContainer.appendChild(dieElement);
        });
    }
    
    container.appendChild(allDiceContainer);
    console.log('✅ Dice container updated successfully');
    return container;
};
