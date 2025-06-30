/**
 * AI Dice Challenge - Main Application Entry Point
 * Hlavní vstupní bod aplikace - čistá modulární verze
 */

console.log('🎲 AI Kostková Výzva - Loading...');

// Import UI controlleru pro řízení celé aplikace
import { GameUIController } from './ui/gameUIController.js';

/**
 * Inicializace aplikace po načtení DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ DOM loaded, initializing application...');
    
    try {
        // Vytvoř a inicializuj hlavní UI controller
        const uiController = new GameUIController();
        await uiController.initialize();
        
        // Zpřístupni globálně pro debugging
        window.uiController = uiController;
        window.gameController = uiController.gameController;
        
        console.log('✅ AI Kostková Výzva ready!');
        
    } catch (error) {
        console.error('❌ Critical error during initialization:', error);
        
        // Fallback - základní funkcionalita bez modulů
        setupEmergencyFallback();
    }
});

/**
 * Emergency fallback pro případ selhání modulárního systému
 */
function setupEmergencyFallback() {
    console.log('🔧 Setting up emergency fallback...');
    
    // Základní start game funkcionalita
    const startBtn = document.getElementById('startGameBtn');
    const gameControls = document.getElementById('gameControls');
    const targetScoreSetup = document.getElementById('targetScoreSetup');
    
    if (startBtn && gameControls && targetScoreSetup) {
        startBtn.addEventListener('click', () => {
            console.log('🚀 Emergency start game');
            targetScoreSetup.style.display = 'none';
            gameControls.classList.remove('hidden');
            gameControls.style.display = 'block';
        });
    }
    
    // Základní quit game funkcionalita
    const quitBtn = document.getElementById('quitGameBtn');
    if (quitBtn) {
        quitBtn.addEventListener('click', () => {
            if (confirm('Opravdu chcete opustit hru?')) {
                gameControls.style.display = 'none';
                gameControls.classList.add('hidden');
                targetScoreSetup.style.display = 'block';
            }
        });
    }
    
    // Základní chat message funkce
    window.addChatMessage = (sender, message) => {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${sender}</span>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    // Uvítací zpráva
    setTimeout(() => {
        if (window.addChatMessage) {
            window.addChatMessage('Systém', '🔧 Spuštěno v nouzovém režimu');
        }
    }, 1000);
}

/**
 * Debug funkce pro development
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugMode = true;
    console.log('🧪 Debug mode enabled');
    
    // Přidej debug menu po 3 sekundách
    setTimeout(() => {
        if (window.addDebugMenu && typeof window.addDebugMenu === 'function') {
            window.addDebugMenu();
            console.log('🧪 Debug menu added');
        }
    }, 3000);
}
