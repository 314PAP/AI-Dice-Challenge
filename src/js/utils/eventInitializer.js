/**
 * 🎮 Event Initializer - Zajištuje správné nastavení všech event handlerů v aplikaci
 * Tento soubor řeší problémy s event handlery po refaktoringu
 */

import { startGame, nextPlayer, resetGame, returnToMainMenu } from '../game/controllers/gameFlowController.js';
import { rollDiceForPlayer, bankSelectedDice } from '../game/controllers/turnActionsController.js';
import { displayHallOfFame } from '../utils/hallOfFame.js';
import { setupEventListeners as setupGameEventListeners } from '../game/controllers/eventSetupController.js';

let eventInitialized = false;

/**
 * Inicializuje všechny event listenery pro celou aplikaci
 * Používá se jako záchranná síť pro zajištění funkčnosti všech tlačítek
 */
export function initializeAllEventListeners() {
    if (eventInitialized) {
        console.log('⚠️ Event listenery už byly inicializovány, přeskakuji...');
        return;
    }

    console.log('🚀 Inicializuji všechny event listenery aplikace...');
    
    // Nejdřív zkusíme použít standardní inicializaci
    setupGameEventListeners();
    
    // Potom přidáme záložní event listenery pro případ, že by něco nefungovalo
    setupBackupEventListeners();
    
    // Inicializace chatu
    setupChatListeners();
    
    eventInitialized = true;
    console.log('✅ Všechny event listenery úspěšně inicializovány!');
}

/**
 * Nastaví záložní event listenery pro případ, že by původní implementace selhala
 */
function setupBackupEventListeners() {
    console.log('🔧 Nastavuji záložní event listenery...');
    
    // Start Game Button - použijeme robustní přístup s náhradou elementu
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
        // Vytvoříme kopii tlačítka
        const newStartBtn = startBtn.cloneNode(true);
        // Přidáme event listener
        newStartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎮 Start Game button clicked (backup listener)');
            const targetScoreInput = document.getElementById('targetScoreInput');
            const targetScore = parseInt(targetScoreInput?.value || '1000');
            
            if (targetScore >= 1000) {
                startGame();
            } else {
                alert('Cílové skóre musí být alespoň 1000 bodů!');
            }
        });
        // Nahradíme původní tlačítko naším novým
        startBtn.parentNode.replaceChild(newStartBtn, startBtn);
        console.log('✅ Záložní listener přidán k Start Game Button (kompletní náhrada)');
    } else {
        console.error('❌ Start Game Button nenalezen!');
    }
    
    // Roll Button
    const rollBtn = document.getElementById('rollBtn');
    if (rollBtn && !rollBtn._hasClickListener) {
        rollBtn.addEventListener('click', () => {
            console.log('🎲 Roll button clicked (backup listener)');
            rollDiceForPlayer();
        });
        rollBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k Roll Button');
    }
    
    // Bank Button
    const bankBtn = document.getElementById('bankBtn');
    if (bankBtn && !bankBtn._hasClickListener) {
        bankBtn.addEventListener('click', () => {
            console.log('💰 Bank button clicked (backup listener)');
            bankSelectedDice();
        });
        bankBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k Bank Button');
    }
    
    // End Turn Button
    const endTurnBtn = document.getElementById('endTurnBtn');
    if (endTurnBtn && !endTurnBtn._hasClickListener) {
        endTurnBtn.addEventListener('click', () => {
            console.log('⏭️ End Turn button clicked (backup listener)');
            nextPlayer(); // Používáme importovanou funkci nextPlayer
        });
        endTurnBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k End Turn Button');
    }
    
    // Hall of Fame Button
    const hallBtn = document.getElementById('hallOfFameBtn');
    if (hallBtn && !hallBtn._hasClickListener) {
        hallBtn.addEventListener('click', () => {
            console.log('🏆 Hall of Fame button clicked (backup listener)');
            displayHallOfFame();
        });
        hallBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k Hall of Fame Button');
    }
    
    // Reset Game Button
    const resetBtn = document.getElementById('resetGameBtn');
    if (resetBtn && !resetBtn._hasClickListener) {
        resetBtn.addEventListener('click', () => {
            console.log('🔄 Reset Game button clicked (backup listener)');
            resetGame();
        });
        resetBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k Reset Game Button');
    }
    
    // Return to Main Menu Button
    const menuBtn = document.getElementById('mainMenuBtn');
    if (menuBtn && !menuBtn._hasClickListener) {
        menuBtn.addEventListener('click', () => {
            console.log('🏠 Return to Main Menu button clicked (backup listener)');
            returnToMainMenu();
        });
        menuBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k Return to Main Menu Button');
    }
}

/**
 * Nastaví event listenery pro chat
 */
function setupChatListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    
    if (chatInput && !chatInput._hasKeyListener) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
        chatInput._hasKeyListener = true;
        console.log('✅ Záložní listener přidán k Chat Input');
    }
    
    if (sendBtn && !sendBtn._hasClickListener) {
        sendBtn.addEventListener('click', () => {
            sendChatMessage();
        });
        sendBtn._hasClickListener = true;
        console.log('✅ Záložní listener přidán k Send Button');
    }
}

/**
 * Pomocná funkce pro odeslání zprávy z chatu
 */
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !chatInput.value.trim()) return;
    
    const message = chatInput.value.trim();
    console.log('📤 Sending chat message:', message);
    
    // Zkusíme najít funkci pro přidání zprávy různými způsoby
    if (typeof window.addChatMessage === 'function') {
        window.addChatMessage('Hráč', message, 'player');
    } else if (window.chatController && typeof window.chatController.addMessage === 'function') {
        window.chatController.addMessage('Hráč', message, 'player');
    } else if (window.enhancedChatController && typeof window.enhancedChatController.addMessage === 'function') {
        window.enhancedChatController.addMessage('Hráč', message, 'player');
    } else {
        console.error('❌ Nenalezena funkce pro přidání zprávy do chatu!');
    }
    
    chatInput.value = '';
}
