/**
 * 📱 Mobile Dice Renderer - Rozšíření pro mobilní zobrazení kostek
 */

import { gameState } from '../../game/gameState.js';
import { createDiceElement } from './diceRenderer.js';

// 📱 MOBILE DICE CONTAINER UPDATER
export const updateMobileDiceContainer = () => {
    console.log('📱 Updating mobile dice container...');
    const containerMobile = document.getElementById('diceContainerMobile');
    
    if (!containerMobile) {
        console.log('📱 Mobile dice container not found (OK if not on mobile)');
        return;
    }
    
    // Clear container
    containerMobile.innerHTML = '';
    
    const allDiceContainer = document.createElement('div');
    allDiceContainer.className = 'all-dice-container';
    
    // Render current dice first
    if (gameState.diceValues && gameState.diceValues.length > 0) {
        console.log('📱 Rendering current dice for mobile:', gameState.diceValues);
        gameState.diceValues.forEach((value, diceIndex) => {
            const dieElement = createDiceElement(value, diceIndex, 'current');
            // Pro mobilní verzi zmenšíme kostky
            dieElement.style.fontSize = '0.8rem';
            dieElement.style.width = '25px';
            dieElement.style.height = '25px';
            allDiceContainer.appendChild(dieElement);
        });
    }
    
    // Render banked dice from right to left after current dice
    if (gameState.bankedDiceThisTurn && gameState.bankedDiceThisTurn.length > 0) {
        console.log('📱 Rendering banked dice for mobile (right to left):', gameState.bankedDiceThisTurn);
        
        // Create a separate container for banked dice so we can control their order
        const bankedContainer = document.createElement('div');
        bankedContainer.className = 'banked-dice-container';
        
        // Using CSS from banked.css for flex-direction: row-reverse
        // Nově odložené kostky se přidají vlevo (díky row-reverse se zobrazují zprava doleva)
        gameState.bankedDiceThisTurn.forEach(value => {
            const dieElement = createDiceElement(value, -1, 'banked');
            // Pro mobilní verzi zmenšíme kostky
            dieElement.style.fontSize = '0.8rem';
            dieElement.style.width = '25px';
            dieElement.style.height = '25px';
            bankedContainer.appendChild(dieElement);
        });
        
        // Banked dice jsou na pravé straně, aktivní kostky na levé
        allDiceContainer.appendChild(bankedContainer);
    }
    
    containerMobile.appendChild(allDiceContainer);
    console.log('✅ Mobile dice container updated successfully');
};
