/**
 * AI Dice Challenge - Main Application Entry Point
 * Hlavní vstupní bod aplikace - čistá modulární verze
 */

console.log('🎲 AI Kostková Výzva - Loading main.js...');
console.log('🔍 Document ready state:', document.readyState);

// Import UI controlleru pro řízení celé aplikace
import { setupUI } from './js/ui/uiController.js';
import { initializeGame } from './js/game/gameController.js';
import { initializeChat } from './js/ui/enhancedChatController.js';
import { setupOptimizedEvents } from './js/utils/optimizedEvents.js';

/**
 * Inicializace aplikace po načtení DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ DOM loaded, initializing application...');
    console.log('🔍 Checking elements...');
    
    // Test existence důležitých elementů
    const startBtn = document.getElementById('startGameBtn');
    const hallBtn = document.getElementById('hallOfFameBtn');
    const chatInput = document.getElementById('chatInput');
    
    console.log('🔍 startGameBtn:', !!startBtn);
    console.log('🔍 hallOfFameBtn:', !!hallBtn);
    console.log('🔍 chatInput:', !!chatInput);
    
    try {
        console.log('🚀 Initializing UI and Game Controllers...');
        
        // Inicializuj UI
        setupUI();
        setupOptimizedEvents(); // <-- Přidáno: inicializace event systému
        
        // Inicializuj chat
        const chatController = initializeChat();
        
        // Inicializuj game controller
        initializeGame();
        
        // Zpřístupni chat globálně
        window.addChatMessage = chatController.addMessage.bind(chatController);
        
        console.log('✅ AI Kostková Výzva ready!');
        console.log('🔍 Global objects:', {
            gameController: !!window.gameController,
            addChatMessage: !!window.addChatMessage
        });
        
    } catch (error) {
        console.error('❌ Critical error during initialization:', error);
        console.error('❌ Error stack:', error.stack);
        
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
    const hallBtn = document.getElementById('hallOfFameBtn');
    const gameControls = document.getElementById('gameControls');
    const targetScoreSetup = document.getElementById('targetScoreSetup');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    
    console.log('🔧 Found elements:', {
        startBtn: !!startBtn,
        hallBtn: !!hallBtn,
        gameControls: !!gameControls,
        targetScoreSetup: !!targetScoreSetup,
        chatInput: !!chatInput,
        sendBtn: !!sendBtn
    });
    
    if (startBtn) {
        console.log('🔧 Adding start button listener...');
        startBtn.addEventListener('click', () => {
            console.log('🚀 Emergency start game');
            alert('Start Game button clicked! (Emergency mode)');
            
            if (targetScoreSetup && gameControls) {
                targetScoreSetup.style.display = 'none';
                gameControls.classList.remove('hidden');
            }
        });
    }
    
    if (hallBtn) {
        console.log('🔧 Adding hall of fame button listener...');
        hallBtn.addEventListener('click', () => {
            console.log('🏆 Emergency hall of fame');
            alert('Hall of Fame button clicked! (Emergency mode)');
        });
    }
    
    if (chatInput && sendBtn) {
        console.log('🔧 Adding chat listeners...');
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                console.log('💬 Emergency chat:', message);
                alert(`Chat message: ${message} (Emergency mode)`);
                chatInput.value = '';
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Přidej základní chat zprávu
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '<div style="color: #ff6600; padding: 10px;">🔧 Emergency mode active - modular system failed to load</div>';
    }
    
    console.log('✅ Emergency fallback setup complete');
    
    // Expose emergency fallback functions globally
    window.emergencyFallback = true;
    window.addChatMessage = (sender, message) => {
        console.log(`💬 Emergency chat from ${sender}: ${message}`);
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.style.color = '#39ff14';
            messageDiv.style.padding = '5px';
            messageDiv.textContent = `${sender}: ${message}`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };
}

/**
 * Fallback pro celkové selhání
 */
window.addEventListener('error', (e) => {
    console.error('🚨 Global error caught:', e.error);
    if (!window.emergencyFallback) {
        setupEmergencyFallback();
    }
});

console.log('🔚 main.js loaded completely');
