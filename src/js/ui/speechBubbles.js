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
