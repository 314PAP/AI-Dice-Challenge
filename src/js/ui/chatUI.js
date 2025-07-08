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
        
        // Vytvoříme HTML element
        return `
            <div class="chat-message mb-2 rounded p-2 p-md-3 ${colorClass}">
                <div class="chat-header mb-1 d-flex">
                    <strong>${message.sender}:</strong>
                </div>
                <div class="chat-content">${message.content}</div>
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
