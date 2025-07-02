/**
 * 🎲 Dice Rendering Module - Funkcionální přístup k zobrazování kostek
 */

import { pipe, when, unless } from 'ramda';
// Jednoduchá implementace isEmpty
const isEmpty = (value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return !value;
};

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

// 🎯 DICE CONTAINER UPDATER - Optimized with functional composition
export const updateDiceContainer = pipe(
    () => safeGetElement('diceContainer'),
    unless(Boolean, () => {
        console.warn('🚫 Dice container not found');
        return null;
    }),
    (container) => {
        container.innerHTML = '';
        
        const allDiceContainer = document.createElement('div');
        allDiceContainer.className = 'all-dice-container';
        
        // Render banked dice first (if any)
        when(
            () => !isEmpty(gameState.bankedDiceThisTurn),
            () => {
                gameState.bankedDiceThisTurn.forEach(value => {
                    const dieElement = createDiceElement(value, -1, 'banked');
                    allDiceContainer.appendChild(dieElement);
                });
            }
        )();
        
        // Render current dice roll
        when(
            () => !isEmpty(gameState.diceValues),
            () => {
                gameState.diceValues.forEach((value, index) => {
                    const dieElement = createDiceElement(value, index, 'current');
                    allDiceContainer.appendChild(dieElement);
                });
            }
        )();
        
        container.appendChild(allDiceContainer);
        return container;
    }
);
