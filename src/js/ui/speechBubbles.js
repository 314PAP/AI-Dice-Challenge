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
    
    // Zobrazit FARKLE zprávu na delší dobu (3 sekundy)
    showSpeechBubble(playerIndex, '💥 FARKLE!');
    
    if (playerElement) {
        // Červené podsvícení na 3 sekundy místo 2 sekund
        playerElement.style.boxShadow = '0 0 20px #ff0040';
        
        // Synchronizujeme dobu trvání se showSpeechBubble (3 sekundy)
        setTimeout(() => {
            playerElement.style.boxShadow = '';
        }, 3000); 
    }
}
