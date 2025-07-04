/**
 * 🎲 Dice Rendering Module - Zjednodušená implementace
 */

import { gameState } from '../../game/gameState.js';
import { calculateScore } from '../../game/diceLogic.js';
import { selectDie } from '../../game/controllers/turnActionsController.js';

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
        dieElement.addEventListener('click', () => {
            console.log(`🎲 Die ${index} clicked (value: ${value})`);
            try {
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
    
    // Render current dice first
    if (gameState.diceValues && gameState.diceValues.length > 0) {
        console.log('� Rendering current dice:', gameState.diceValues);
        gameState.diceValues.forEach((value, index) => {
            const dieElement = createDiceElement(value, index, 'current');
            allDiceContainer.appendChild(dieElement);
        });
    }
    
    // Render banked dice from right to left after current dice
    if (gameState.bankedDiceThisTurn && gameState.bankedDiceThisTurn.length > 0) {
        console.log('🎲 Rendering banked dice (right to left):', gameState.bankedDiceThisTurn);
        
        // Create a separate container for banked dice so we can control their order
        const bankedContainer = document.createElement('div');
        bankedContainer.className = 'banked-dice-container';
        
        // Using CSS from banked.css for flex-direction: row-reverse
        // Nově odložené kostky se přidají vlevo (díky row-reverse se zobrazují zprava doleva)
        gameState.bankedDiceThisTurn.forEach(value => {
            const dieElement = createDiceElement(value, -1, 'banked');
            bankedContainer.appendChild(dieElement);
        });
        
        // Banked dice jsou na pravé straně, aktivní kostky na levé
        allDiceContainer.appendChild(bankedContainer);
    }
    
    container.appendChild(allDiceContainer);
    console.log('✅ Dice container updated successfully');
    return container;
};
