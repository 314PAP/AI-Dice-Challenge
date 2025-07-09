/**
 * Chat UI Manager - Správa rozhraní chatu
 * Stará se o vykreslování a aktualizaci chatovacího rozhraní
 */

import chatSystem from '../ai/chatSystem.js';
import { aiPersonalities } from '../ai/personalities.js';
import { UI_CONSTANTS, CHAT_CONSTANTS } from '../utils/constants.js';
import { CHAT_COLORS } from '../utils/colors.js';

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
        chatSystem.addMessage(CHAT_CONSTANTS.PLAYER_NAME, message, 'green');
        
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
        }, UI_CONSTANTS.AI_RESPONSE_MIN_DELAY + Math.random() * UI_CONSTANTS.AI_RESPONSE_RANDOM_DELAY); // Náhodný delay mezi 800ms a 2000ms
    }

    /**
     * Vykreslí všechny zprávy v chatu
     */
    renderMessages() {
        if (!this.chatContainer) return;
        
        const messages = chatSystem.getMessages();
        
        // Zachováme scrollování na konec, pokud je uživatel na konci
        const shouldScroll = this.chatContainer.scrollTop + this.chatContainer.clientHeight >= 
            this.chatContainer.scrollHeight - UI_CONSTANTS.SCROLL_THRESHOLD;
        
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
        // Základní třídy pro zprávu
        let messageClasses = 'chat-message mb-2 p-2 rounded bg-black overflow-hidden w-100';
        let colorClass = 'text-light';
        let aiClass = '';
        
        // Určení typu zprávy a přidání odpovídajících tříd
        if (message.sender === CHAT_CONSTANTS.PLAYER_NAME) {
            // Zpráva od hráče
            messageClasses += ' chat-message-user';
            colorClass = ''; // Barva definována v CSS
        } else if (message.sender === CHAT_CONSTANTS.SYSTEM_NAME) {
            // Systémová zpráva
            messageClasses += ' chat-message-system';
            colorClass = ''; // Barva definována v CSS
        } else if (aiPersonalities[message.sender]) {
            // Zpráva od AI - přidáme specifickou třídu podle AI osobnosti
            // Standardizované mapování AI jmen na CSS třídy
            let aiClassName = '';
            switch(message.sender.toLowerCase()) {
                case 'gemini':
                    aiClassName = 'ai-gemini';
                    break;
                case 'chatgpt':
                case 'gpt':
                    aiClassName = 'ai-gpt';
                    break;
                case 'claude':
                    aiClassName = 'ai-claude';
                    break;
                default:
                    // Pokud je neznámé jméno, použijeme výchozí třídu
                    aiClassName = 'ai-gemini';
            }
            messageClasses += ` chat-message-ai ${aiClassName}`;
            
            // V případě AI zpráv nemusíme nastavovat colorClass
            // barvy jsou automaticky aplikovány pomocí CSS tříd ai-gemini, ai-gpt, ai-claude
            colorClass = '';
        }
        
        // Bootstrap-first responsive design pro chat zprávy
        return `
            <div class="${messageClasses}">
                <div class="chat-header mb-1 d-flex align-items-center">
                    <strong class="text-truncate flex-grow-1">${message.sender}:</strong>
                </div>
                <div class="chat-content small text-break">
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
