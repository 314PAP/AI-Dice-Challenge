/**
 * Speech Bubbles Controller
 * Řídí zobrazení bublinek nad hlavami hráčů
 */

import { aiPersonalities } from '../ai/enhancedPersonalities.js';

/**
 * Zobrazí bublinu s textem nad hráčem
 * @param {number} playerIndex - Index hráče (0-3)
 * @param {string} message - Zpráva k zobrazení
 */
export function showSpeechBubble(playerIndex, message) {
    const bubbleId = ['humanBubble', 'geminiBubble', 'chatgptBubble', 'claudeBubble'][playerIndex];
    const bubble = document.getElementById(bubbleId);
    
    if (!bubble) return;
    
    bubble.textContent = message;
    bubble.classList.add('show');
    
    // Nastavení barvy podle hráče
    const playerTypes = ['human', 'gemini', 'chatgpt', 'claude'];
    const playerType = playerTypes[playerIndex];
    const personality = aiPersonalities[playerType];
    
    if (personality && personality.color) {
        bubble.style.backgroundColor = personality.color;
        bubble.style.color = '#000000'; // Černý text na neonové barvy pro lepší čitelnost
    }
    
    setTimeout(() => {
        bubble.classList.remove('show');
        // Po vyblednutí odstranit dynamické styly
        bubble.style.backgroundColor = '';
        bubble.style.color = '';
    }, 3000);
}

/**
 * Zobrazí FARKLE zprávu nad hráčem s speciálním stylem
 * @param {number} playerIndex - Index hráče (0-3)
 */
export function showFarkleMessage(playerIndex) {
    // Přidáme červený efekt na hráče
    const playerClasses = ['.human-player', '.gemini-player', '.chatgpt-player', '.claude-player'];
    const playerElement = document.querySelector(playerClasses[playerIndex]);
    
    if (!playerElement) {
        console.error(`🔴 Nelze najít element pro hráče ${playerIndex}`);
        return;
    }
    
    // Přidáme speciální element pro FARKLE zprávu (velký a výrazný)
    const existingMessage = playerElement.querySelector('.farkle-overlay-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const farkleMessage = document.createElement('div');
    farkleMessage.className = 'farkle-overlay-message';
    farkleMessage.innerHTML = '💥 FARKLE!';
    farkleMessage.style.cssText = `
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(255, 0, 40, 0.9);
        color: white;
        font-weight: bold;
        padding: 5px 15px;
        border-radius: 5px;
        box-shadow: 0 0 20px #ff0040, 0 0 40px #ff0040;
        z-index: 1000;
        animation: farkle-message-pulse 1s infinite alternate;
        font-size: 16px;
        white-space: nowrap;
        pointer-events: none;
    `;
    
    // Zobrazit klasickou bublinu jako zálohu
    showSpeechBubble(playerIndex, '💥 FARKLE!');
    
    // Zajistíme, že player element má relativní pozici pro správné umístění zprávy
    playerElement.style.position = 'relative';
    playerElement.appendChild(farkleMessage);
    
    // Přidat třídu pro FARKLE efekt
    playerElement.classList.add('farkle-effect');
    
    // Zvýrazníme avatar a zajistíme, že bude zpráva viditelná
    const playerAvatars = ['.player-head'];
    const avatarElement = playerElement.querySelector(playerAvatars);
    if (avatarElement) {
        avatarElement.classList.add('farkle-glow');
    }
    
    // Synchronizujeme dobu trvání - minimálně 5 sekund pro dobrou viditelnost
    setTimeout(() => {
        playerElement.classList.remove('farkle-effect');
        if (avatarElement) {
            avatarElement.classList.remove('farkle-glow');
        }
        if (farkleMessage.parentNode) {
            farkleMessage.remove();
        }
    }, 5000);
}
