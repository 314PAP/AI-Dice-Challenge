/**
 * Enhanced Chat Controller with Real AI Support
 * Podporuje jak přednastavené odpovědi, tak skutečné AI API
 */

import { aiPersonalities } from '../ai/personalities.js';
import { generateAIChatResponse, enhancedAI } from '../ai/enhancedAIController.js';
import { realAI } from '../ai/realAI.js';
import { gameState } from '../game/gameState.js';

// Konfigurace - zapnout/vypnout skutečné AI
const USE_REAL_AI = false; // Změňte na true když máte backend API

export class EnhancedChatController {
    constructor() {
        this.useRealAI = USE_REAL_AI;
        this.chatHistory = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendMessageBtn = document.getElementById('sendChatBtn');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => this.sendMessage());
        }
    }

    /**
     * Odešle zprávu od hráče
     */
    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Zobraz zprávu od hráče
        this.addMessage('human', message);
        chatInput.value = '';
        
        // Generuj AI odpovědi
        await this.generateAIResponses(message);
    }

    /**
     * Generuje odpovědi od všech AI
     */
    async generateAIResponses(userMessage) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        for (const aiType of aiTypes) {
            // Přidej delay pro realističtější konverzaci
            setTimeout(async () => {
                let response;
                
                if (this.useRealAI) {
                    // Aktualizuj kontext pro AI
                    realAI.updateGameContext({
                        currentScore: gameState.getPlayerScore('human'),
                        turnScore: gameState.getCurrentTurnScore(),
                        lastAction: 'chat_message',
                        userMessage: userMessage
                    });
                    
                    // Zavolej skutečné AI
                    response = await realAI.getAIResponse(aiType, 'chat_response', {
                        userMessage: userMessage,
                        gameState: gameState.getGameState()
                    });
                } else {
                    // Použij vylepšené AI odpovědi
                    response = enhancedAI.generateChatResponse(aiType, userMessage);
                }
                
                this.addMessage(aiType, response);
            }, Math.random() * 2000 + 500); // Random delay 0.5-2.5s
        }
    }

    /**
     * Přidá zprávu do chatu
     */
    addMessage(sender, message, isGameEvent = false) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        
        if (isGameEvent) {
            messageElement.classList.add('game-event');
        }

        // Ikona podle typu odesílatele
        const iconPath = this.getIconPath(sender);
        
        messageElement.innerHTML = `
            <div class="message-header">
                <img src="${iconPath}" alt="${sender}" class="message-avatar">
                <span class="message-author" style="color: ${aiPersonalities[sender]?.color || '#39ff14'}">${aiPersonalities[sender]?.name || sender}</span>
                <span class="message-time">${new Date().toLocaleTimeString('cs-CZ', {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            <div class="message-content">${message}</div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Uložit do historie
        this.chatHistory.push({
            sender,
            message,
            timestamp: Date.now(),
            isGameEvent
        });
    }

    /**
     * Získá cestu k ikoně podle typu
     */
    getIconPath(sender) {
        const iconMap = {
            human: '/ai-icons/mind.jpeg',
            system: '/ai-icons/system.jpeg',
            gemini: '/ai-icons/gemini.jpeg',
            chatgpt: '/ai-icons/gpt.jpeg',
            claude: '/ai-icons/claude.jpeg'
        };
        return iconMap[sender] || '/ai-icons/system.jpeg';
    }

    /**
     * AI komentář k herní události
     */
    async addAIGameComment(situation, data = {}) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        
        for (const aiType of aiTypes) {
            setTimeout(async () => {
                let response;
                
                if (this.useRealAI) {
                    realAI.updateGameContext({
                        currentScore: gameState.getPlayerScore(data.player || 'human'),
                        turnScore: gameState.getCurrentTurnScore(),
                        lastAction: situation
                    });
                    
                    response = await realAI.getAIResponse(aiType, situation, data);
                } else {
                    // Použij přednastavené reakce
                    const personality = aiPersonalities[aiType];
                    if (personality?.gameReactions?.[situation]) {
                        const reactions = personality.gameReactions[situation];
                        if (typeof reactions === 'function') {
                            response = reactions(data)[0];
                        } else {
                            response = reactions[Math.floor(Math.random() * reactions.length)];
                        }
                    }
                }
                
                if (response) {
                    this.addMessage(aiType, response, true);
                }
            }, Math.random() * 1500 + 300);
        }
    }

    /**
     * Přepne mezi skutečným AI a přednastavenými odpověďmi
     */
    toggleRealAI(enabled) {
        this.useRealAI = enabled;
        const status = enabled ? "zapnuto" : "vypnuto";
        this.addMessage('system', `Skutečné AI ${status}. ${enabled ? 'Používám API volání.' : 'Používám přednastavené odpovědi.'}`, true);
    }
}

// Export singleton instance
export const chatController = new EnhancedChatController();

// Zpětná kompatibilita s existujícím kódem
export function initializeChat() {
    console.log('💬 Enhanced Chat Controller initialized');
}

export function addChatMessage(sender, message, isGameEvent = false) {
    chatController.addMessage(sender, message, isGameEvent);
}

export function addAIGameComment(situation, data = {}) {
    chatController.addAIGameComment(situation, data);
}
