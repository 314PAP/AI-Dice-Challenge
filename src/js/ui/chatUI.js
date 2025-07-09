/**
 * Chat UI Manager - Správa rozhraní chatu
 * Stará se o vykreslování a aktualizaci chatovacího rozhraní
 */

import chatSystem from '../ai/chatSystem.js';
import { aiPersonalities } from '../ai/personalities.js';

/**
 * ChatUI třída - Zajišťuje veškeré renderování a interakci s chatovacím rozhraním
 */
export class ChatUI {
    constructor() {
        this.chatContainer = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendChatBtn');
        
        this.initEventListeners();
        this.renderMessages();
    }

    /**
     * Inicializuje event listenery pro UI
     */
    initEventListeners() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', this.sendMessage.bind(this));
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    /**
     * Odešle zprávu z inputu
     */
    sendMessage() {
        if (!this.chatInput) return;
        
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Přidáme zprávu od hráče
        chatSystem.addMessage('Hráč', message, 'green');
        
        // Vyčistíme input
        this.chatInput.value = '';
        
        // Aktualizujeme zobrazení
        this.renderMessages();
        
        // Simulujeme odpověď od AI (náhodně vybereme jednu)
        this.simulateAiResponse();
    }

    /**
     * Simuluje odpověď od AI
     */
    simulateAiResponse() {
        setTimeout(() => {
            // Náhodně vybereme AI, která odpoví
            const aiNames = Object.keys(aiPersonalities);
            const randomAi = aiNames[Math.floor(Math.random() * aiNames.length)];
            
            // Přidáme zprávu od AI
            chatSystem.addAiMessage(randomAi);
            
            // Aktualizujeme zobrazení
            this.renderMessages();
        }, 800 + Math.random() * 1200); // Náhodný delay mezi 800ms a 2000ms
    }

    /**
     * Vykreslí všechny zprávy v chatu
     */
    renderMessages() {
        if (!this.chatContainer) return;
        
        const messages = chatSystem.getMessages();
        
        // Zachováme scrollování na konec, pokud je uživatel na konci
        const shouldScroll = this.chatContainer.scrollTop + this.chatContainer.clientHeight >= this.chatContainer.scrollHeight - 50;
        
        // Vytvoříme HTML pro zprávy
        const messagesHTML = messages.map(msg => this.createMessageElement(msg)).join('');
        
        // Aktualizujeme obsah
        this.chatContainer.innerHTML = messagesHTML;
        
        // Scrollujeme na konec, pokud byl uživatel na konci
        if (shouldScroll) {
            this.scrollToBottom();
        }
    }

    /**
     * Vytvoří HTML pro jednu zprávu
     * @param {Object} message - Zpráva k vykreslení
     * @returns {string} HTML kód zprávy
     */
    createMessageElement(message) {
        // Barva podle odesílatele
        let colorClass = 'text-white';
        if (message.sender === 'Hráč') {
            colorClass = 'text-neon-green';
        } else if (message.sender === 'Systém') {
            colorClass = 'text-neon-yellow';
        } else if (aiPersonalities[message.sender]) {
            colorClass = `text-neon-${aiPersonalities[message.sender].color}`;
        }
        
        // Bootstrap-first responsive design pro chat zprávy
        return `
            <div class="chat-message mb-2 p-2 rounded bg-black border border-secondary ${colorClass} overflow-hidden w-100">
                <div class="chat-header mb-1 d-flex justify-content-between align-items-center">
                    <strong class="text-truncate flex-grow-1">${message.sender}:</strong>
                    <small class="text-muted flex-shrink-0 ms-2 d-none d-md-inline">${message.timestamp || ''}</small>
                </div>
                <div class="chat-content small" style="word-wrap: break-word; overflow-wrap: break-word;">
                    ${message.content}
                </div>
            </div>
        `;
    }

    /**
     * Scrolluje chat na konec
     */
    scrollToBottom() {
        if (this.chatContainer) {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    /**
     * Přidá uvítací zprávy do chatu
     */
    addWelcomeMessages() {
        chatSystem.addSystemMessage('Vítejte v AI Kostkové Výzvě!');
        chatSystem.addAiMessage('Gemini', 'Připravte se na analytickou výzvu!');
        chatSystem.addAiMessage('ChatGPT', 'Bude to skvělá hra!');
        chatSystem.addAiMessage('Claude', 'Hodně štěstí!');
        
        this.renderMessages();
        this.scrollToBottom();
    }
}

// Exportujeme třídu ChatUI
export default ChatUI;
