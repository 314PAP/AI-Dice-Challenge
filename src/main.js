/**
 * AI Dice Challenge - Main Application Entry Point
 * Hlavní vstupní bod aplikace - čistá modulární verze s rozšířeným error handlingem
 * a spolehlivým načítáním DOM elementů
 */

console.log('🎲 AI Kostková Výzva - Loading main.js...');
console.log('🔍 Document ready state:', document.readyState);

// Import UI controlleru pro řízení celé aplikace
import { setupUI } from './js/ui/uiController.js';
import { initializeGame } from './js/game/gameController.js';
import { initializeChat } from './js/ui/enhancedChatController.js';
import { setupOptimizedEvents } from './js/utils/optimizedEvents.js';
import { initializeAllEventListeners } from './js/utils/eventInitializer.js';
import { tryCatchWithLogging } from './js/utils/errorHandling.js';
import { eventBus, GAME_EVENTS } from './js/utils/eventBus.js';
import enhancedGameStarter from './js/game/enhancedGameStarter.js';
import { whenDOMReady } from './js/utils/domReadyObserver.js';

/**
 * Inicializace aplikace se spolehlivým načítáním DOM
 * Využívá observer pro zajištění, že všechny potřebné elementy jsou dostupné
 */
console.log('🔄 Inicializace aplikace se spolehlivým načítáním...');

// Použijeme whenDOMReady namísto standardního DOMContentLoaded event listeneru
whenDOMReady(() => {
    console.log('✅ DOM a všechny klíčové elementy jsou načteny, inicializuji aplikaci...');
    
    try {
        // Používáme bezpečnou funkci pro inicializaci s error handlingem
        const initializeApp = tryCatchWithLogging(() => {
            console.log('🚀 Initializing UI and Game Controllers...');
            
            // Inicializuj UI
            setupUI();
            
            // Inicializace event systému
            setupOptimizedEvents();
            
            // Registrace globálního event listeneru pro debugging
            eventBus.on(GAME_EVENTS.GAME_STARTED, data => {
                console.log('🎮 Game started with settings:', data);
            });
            
            // Inicializuj chat
            const chatController = initializeChat();
            
            // Inicializuj game controller
            initializeGame();
            
            // Zpřístupni chat globálně pro kompatibilitu - opravena signatura
            window.addChatMessage = (sender, message) => chatController.addMessage(sender, message);
            window.chatController = chatController;
            
            // Explicitně nastavíme všechny event listenery pomocí nového inicializátoru
            console.log('🎮 Inicializuji všechny event listenery pomocí nového systému...');
            initializeAllEventListeners();
            
            // Vylepšené listenery pro start hry
            enhancedGameStarter.attachGameStartListeners();
            
            // Relogujeme úspěšnost event listenerů
            setTimeout(() => {
                console.log('🔍 Kontrola event listenerů po inicializaci:');
                
                ['startGameBtn', 'rollBtn', 'bankBtn', 'endTurnBtn', 'chatInput'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        console.log(`✅ Element ${id} je dostupný`);
                    } else {
                        console.error(`❌ Element ${id} není dostupný!`);
                    }
                });
            }, 500);
            
            console.log('✅ AI Kostková Výzva ready!');
            
            return true;
        }, false, 'Application Initialization');
        
        // Spustíme inicializaci
        initializeApp();
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
