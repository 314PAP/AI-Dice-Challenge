/**
 * Chat UI Manager - Správa rozhraní chatu
 * Stará se o vykreslování a aktualizaci chatovacího rozhraní
 */

import chatSystem from '../ai/chatSystem.js';
import { aiPersonalities } from '../ai/personalities.js';
import { UI_CONSTANTS, CHAT_CONSTANTS } from '../utils/constants.js';
import { pxToRem, CHAT_COLORS } from '../utils/colors.js';

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
        let colorClass = 'text-neon-green';
        let aiClass = '';
        
        // Určení typu zprávy a přidání odpovídajících tříd
        if (message.sender === CHAT_CONSTANTS.PLAYER_NAME) {
            // Zpráva od hráče
            messageClasses += ' chat-message-user';
            colorClass = 'text-neon-green'; // Zelený text pro hráče
        } else if (message.sender === CHAT_CONSTANTS.SYSTEM_NAME) {
            // Systémová zpráva
            messageClasses += ' chat-message-system';
            colorClass = 'text-neon-purple'; // Fialová pro systémové zprávy
        } else if (aiPersonalities[message.sender]) {
            // Zpráva od AI - přidáme specifickou třídu podle AI osobnosti
            // Standardizované mapování AI jmen na CSS třídy
            const aiName = message.sender.toLowerCase();
            let aiClassName = '';
            
            // Optimalizované mapování AI jmen na CSS třídy
            const aiClassMap = {
                'gemini': 'ai-gemini',
                'gpt': 'ai-gpt', 
                'chatgpt': 'ai-gpt',
                'claude': 'ai-claude',
                'llama': 'ai-llama',
                'mistral': 'ai-mistral'
            };
            
            // Použij přímé mapování nebo extrahuj název z textu
            aiClassName = aiClassMap[aiName] || `ai-${aiName.replace(/[^a-z]/g, '')}`;
            messageClasses += ` chat-message-ai ${aiClassName}`;
            
            // Pro AI zprávy nepoužíváme colorClass, barvy jsou definovány v CSS pomocí ai-* tříd
            colorClass = '';
        }
        
        // Bootstrap-first responsive design s neonovými efekty pro chat zprávy
        return `
            <div class="${messageClasses} ${colorClass}">
                <div class="chat-header mb-1 d-flex justify-content-between align-items-center">
                    <strong class="text-truncate flex-grow-1">${message.sender}:</strong>
                    <small class="text-neon-green flex-shrink-0 ms-2 d-none d-md-inline" style="opacity: 0.5">${message.timestamp || ''}</small>
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
        chatSystem.addAiMessage('Llama', '*hýká nadšením* Kostky jsou moje vášeň!');
        chatSystem.addAiMessage('Mistral', '*chladně* Jsem připraven analyzovat vaše tahy.');
        
        this.renderMessages();
        this.scrollToBottom();
    }
}

// Exportujeme třídu ChatUI
export default ChatUI;
