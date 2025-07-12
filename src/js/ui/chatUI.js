/**
 * Chat UI Manager - Správa rozhraní chatu
 * Stará se o vykreslování a aktualizaci chatovacího rozhraní
 */

/**
 * SEZNAM POUŽÍVANÝCH CSS TŘÍD:
 * Bootstrap: container-fluid, h-100, d-flex, flex-column, overflow-auto, mb-2, p-2, rounded, small, fw-bold
 * Neon třídy: text-neon-green, text-neon-blue, text-neon-purple, text-neon-orange, text-neon-red, text-neon-yellow, bg-neon-black, border-neon-*
 * Vlastní: chat-messages, chat-message, message-system, message-ai
 */

/**
 * SEZNAM PROMĚNNÝCH (lokální v metodách):
 * container, messagesContainer, message, messageEl, timestamp, timeEl, senderEl, contentEl
 * 
 * MOŽNÉ DUPLICITY: 
 * - messageEl (používá se v renderMessages - OK, lokální scope)
 * - container (používá se v renderChatScreen)
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
        this.lastRenderTime = 0; // Throttling pro renderování
        
        this.initEventListeners();
        this.renderMessages();
        
        // Registrujeme se jako listener pro změny zpráv BEZ throttling
        chatSystem.addListener(() => this.renderMessages());
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
        
        // Aktualizujeme zobrazení - FORCE render pro uživatelské zprávy
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
            
            // Aktualizujeme zobrazení - FORCE render pro AI odpovědi
            this.renderMessages();
        }, UI_CONSTANTS.AI_RESPONSE_MIN_DELAY + Math.random() * UI_CONSTANTS.AI_RESPONSE_RANDOM_DELAY); // Náhodný delay mezi 800ms a 2000ms
    }

    /**
     * Throttled verze renderMessages - omezí četnost renderování
     */
    throttledRenderMessages() {
        const now = Date.now();
        if (now - this.lastRenderTime < 200) { // Max každých 200ms
            return;
        }
        this.lastRenderTime = now;
        this.renderMessages();
    }

    /**
     * Vykreslí všechny zprávy v chatu
     */
    renderMessages() {
        if (!this.chatContainer) return;
        
        const messages = chatSystem.getMessages();
        
        // DEBUG: Logování zpráv
        console.log(`💬 ChatUI: Renderuji ${messages.length} zpráv`);
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            console.log(`📝 Poslední zpráva: ${lastMessage.sender}: ${lastMessage.content}`);
        }
        
        // Uložíme si předchozí počet zpráv pro detekci nových zpráv
        const previousMessageCount = this.previousMessageCount || 0;
        const hasNewMessages = messages.length > previousMessageCount;
        this.previousMessageCount = messages.length;
        
        // Zachováme scrollování na konec, pokud je uživatel na konci NEBO pokud jsou nové zprávy
        const isAtBottom = this.chatContainer.scrollTop + this.chatContainer.clientHeight >= 
            this.chatContainer.scrollHeight - UI_CONSTANTS.SCROLL_THRESHOLD;
        const shouldScroll = isAtBottom || hasNewMessages;
        
        // Vytvoříme HTML pro zprávy
        const messagesHTML = messages.map(msg => this.createMessageElement(msg)).join('');
        
        // Aktualizujeme obsah
        this.chatContainer.innerHTML = messagesHTML;
        
        // Scrollujeme na konec, pokud by se mělo scrollovat
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
        // Základní třídy pro zprávu - optimální mezery
        let messageClasses = 'chat-message mb-1 py-1 px-2 rounded bg-black overflow-hidden w-100';
        let colorClass = 'text-neon-green';
        let aiClass = '';
        
        // Určení typu zprávy a přidání odpovídajících tříd
        if (message.sender === CHAT_CONSTANTS.PLAYER_NAME) {
            // Zpráva od hráče - barvu definuje CSS komponenta chat-message-user
            messageClasses += ' chat-message-user';
            colorClass = ''; // Nepoužíváme Bootstrap utility třídu, barvu definuje CSS komponenta
        } else if (message.sender === CHAT_CONSTANTS.SYSTEM_NAME) {
            // Systémová zpráva
            messageClasses += ' chat-message-system';
            colorClass = ''; // Barvu definuje CSS komponenta
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
                'claude': 'ai-claude'
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
                <strong>${message.sender}:</strong> ${message.content}
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
