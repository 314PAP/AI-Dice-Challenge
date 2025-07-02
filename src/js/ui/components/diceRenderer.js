/**
 * 🎲 Dice Rendering Module - Funkcionální přístup k zobrazování kostek
 */

import { pipe, when, unless } from 'ramda';
import { isEmpty } from 'lodash-es';
import { gameState } from '../../game/gameState.js';
import { calculateScore } from '../../game/diceLogic.js';
import { safeGetElement } from '../../utils/gameUtils.js';

// 🎲 DICE ELEMENT CREATION - Functional approach
export const createDiceElement = (value, index, type = 'current') => {
    const dieElement = document.createElement('div');
    
    const classes = pipe(
        () => ['dice'],
        when(() => type === 'banked', (classes) => [...classes, 'banked']),
        when(() => type === 'current' && gameState.selectedDice.includes(index), 
             (classes) => [...classes, 'selected']),
        when(() => type === 'current' && 
                   !gameState.selectedDice.includes(index) && 
                   gameState.currentPlayer === 0 && 
                   calculateScore([value]) > 0,
             (classes) => [...classes, 'scoring']),
        (classes) => classes.join(' ')
    )();
    
    dieElement.className = classes;
    dieElement.textContent = value;
    
    // Add click handler for current dice only
    when(
        () => type === 'current' && gameState.currentPlayer === 0,
        () => {
            dieElement.addEventListener('click', () => {
                if (window.selectDie) window.selectDie(index);
            });
        }
    )();
    
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
