/**
 * Chat Controller
 * Řídí chat systém a AI komunikaci
 */

import { aiPersonalities } from '../ai/personalities.js';
import { generateAIChatResponse } from '../ai/aiController.js';
import { gameState } from '../game/gameState.js';

/**
 * Inicializuje chat systém
 */
export function initializeChat() {
    console.log('💬 Inicializace chatu...');
    
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', handleChatKeyPress);
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    // Load chat history
    loadChatHistory();
    
    // Welcome message
    addChatMessage('system', '🎲 Vítejte v AI Kostkové Výzvě! Nastavte své cílové skóre a začněte hrát!');
    
    console.log('✅ Chat systém inicializován');
}

/**
 * Přidá zprávu do chatu
 * @param {string} senderType - Typ odesílatele
 * @param {string} message - Zpráva
 */
export function addChatMessage(senderType, message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
    
    // Získání informací o odesílateli
    const personality = aiPersonalities[senderType.toLowerCase()];
    const senderName = personality ? personality.name : (senderType.charAt(0).toUpperCase() + senderType.slice(1));
    
    // Mapování na nové ikony
    const getIconPath = (type) => {
        switch(type.toLowerCase()) {
            case 'human': return '/ai-icons/mind.jpeg';
            case 'gemini': return '/ai-icons/gemini.jpeg';
            case 'chatgpt': return '/ai-icons/gpt.jpeg';
            case 'claude': return '/ai-icons/claude.jpeg';
            case 'system': return '/ai-icons/system.jpeg';
            default: return '';
        }
    };
    
    const iconPath = getIconPath(senderType);
    
    messageDiv.className = 'chat-message';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            ${iconPath ? `<img src="${iconPath}" style="width:20px; height:20px; border-radius:50%; object-fit:cover;" alt="${senderName}">` : ''}
            <span class="message-sender">${senderName}</span>
            <span class="message-time">${timestamp}</span>
        </div>
        <div class="message-content">${message}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Uložení do localStorage pro zachování historie
    saveChatMessage(senderType, message, timestamp);
}

/**
 * Odešle zprávu od uživatele
 */
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('human', message);
        input.value = '';
        
        // Nech AI reagovat s malým zpožděním
        const aiToRespondIds = ['gemini', 'chatgpt', 'claude'];
        const respondingAIId = aiToRespondIds[Math.floor(Math.random() * aiToRespondIds.length)];

        const aiResponseDelay = 800 + Math.random() * 1500;
        
        // Získání aktuálních skóre pro předání AI
        const currentPlayersScores = {};
        gameState.players.forEach(p => {
            currentPlayersScores[p.name] = p.score;
        });

        setTimeout(() => {
            const aiResponse = generateAIChatResponse(respondingAIId, message, currentPlayersScores, gameState.targetScore);
            if (aiResponse) {
                addChatMessage(aiResponse.senderType, aiResponse.message);
            }
        }, aiResponseDelay);

        // Volitelné: Nech další AI reagovat s delším zpožděním
        aiToRespondIds.forEach(aiId => {
            if (aiId !== respondingAIId && Math.random() < 0.4) {
                const followUpDelay = aiResponseDelay + 1000 + Math.random() * 1000;
                setTimeout(() => {
                    const aiResponse = generateAIChatResponse(aiId, "random comment trigger", currentPlayersScores, gameState.targetScore);
                    if (aiResponse && aiResponse.message) {
                        addChatMessage(aiResponse.senderType, aiResponse.message);
                    }
                }, followUpDelay);
            }
        });
    }
}

/**
 * Zpracovává stisk klávesy v chat inputu
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * Uloží zprávu do localStorage
 * @param {string} senderType - Typ odesílatele
 * @param {string} message - Zpráva
 * @param {string} timestamp - Časová značka
 */
function saveChatMessage(senderType, message, timestamp) {
    const chatHistory = JSON.parse(localStorage.getItem('diceGameChat') || '[]');
    chatHistory.push({
        senderType: senderType,
        message: message,
        timestamp: timestamp
    });
    
    // Udržování max 50 zpráv v historii
    if (chatHistory.length > 50) {
        chatHistory.shift();
    }
    
    localStorage.setItem('diceGameChat', JSON.stringify(chatHistory));
}

/**
 * Načte historii chatu z localStorage
 */
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('diceGameChat') || '[]');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatMessages) return;
    
    chatHistory.slice(-20).forEach(msg => {
        const messageDiv = document.createElement('div');
        
        let actualSenderType = msg.senderType || msg.sender;
        const personality = aiPersonalities[actualSenderType.toLowerCase()];
        const senderName = personality ? personality.name : (actualSenderType.charAt(0).toUpperCase() + actualSenderType.slice(1));
        
        // Mapování na nové ikony
        const getIconPath = (type) => {
            switch(type.toLowerCase()) {
                case 'human': return '/ai-icons/mind.jpeg';
                case 'gemini': return '/ai-icons/gemini.jpeg';
                case 'chatgpt': return '/ai-icons/gpt.jpeg';
                case 'claude': return '/ai-icons/claude.jpeg';
                case 'system': return '/ai-icons/system.jpeg';
                default: return '';
            }
        };
        
        const iconPath = getIconPath(actualSenderType);

        messageDiv.className = 'chat-message';
        
        messageDiv.innerHTML = `
            <div class="message-header">
                ${iconPath ? `<img src="${iconPath}" style="width:20px; height:20px; border-radius:50%; object-fit:cover;" alt="${senderName}">` : ''}
                <span class="message-sender">${senderName}</span>
                <span class="message-time">${msg.timestamp}</span>
            </div>
            <div class="message-content">${msg.message}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
    });
    
    if (chatHistory.length > 0) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
