/**
 * Chat System - Správa chatovacích funkcí
 * Zajišťuje komunikaci s AI osobnostmi a správu zpráv
 */

import { getAiColor, getRandomAiResponse } from './personalities.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { CHAT_COLORS } from '../utils/colors.js';

/**
 * ChatSystem třída - Zajišťuje veškerou funkcionalitu chatu s AI
 */
export class ChatSystem {
    constructor() {
        this.messages = [];
        this.chatHistory = [];
        this.loadChatHistory();
    }

    /**
     * Načte historii chatu z localStorage
     */
    loadChatHistory() {
        this.chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY) || '[]');
    }

    /**
     * Uloží historii chatu do localStorage
     */
    saveChatHistory() {
        localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(this.chatHistory.slice(-50))); // Ukládáme jen posledních 50 zpráv
    }

    /**
     * Přidá zprávu do chatu
     * @param {string} sender - Odesílatel zprávy
     * @param {string} content - Obsah zprávy
     * @param {string} [color=CHAT_COLORS.GREEN] - Barva zprávy
     * @returns {Object} Vytvořená zpráva
     */
    addMessage(sender, content, color = CHAT_COLORS.GREEN) {
        const message = {
            id: Date.now(),
            sender,
            content,
            color
        };
        
        this.messages.push(message);
        
        // Přidáme zprávu do historie, pokud je od hráče
        if (sender === 'Hráč') {
            this.chatHistory.push(content);
            this.saveChatHistory();
        }
        
        return message;
    }

    /**
     * Přidá systémovou zprávu do chatu
     * @param {string} content - Obsah zprávy
     * @returns {Object} Vytvořená zpráva
     */
    addSystemMessage(content) {
        return this.addMessage('Systém', content, CHAT_COLORS.PURPLE);
    }

    /**
     * Přidá zprávu od AI do chatu
     * @param {string} aiName - Jméno AI (Gemini, ChatGPT, Claude)
     * @param {string} [content=null] - Obsah zprávy (pokud null, vygeneruje se náhodná odpověď)
     * @returns {Object} Vytvořená zpráva
     */
    addAiMessage(aiName, content = null) {
        const messageContent = content || getRandomAiResponse(aiName);
        const color = getAiColor(aiName);
        
        return this.addMessage(aiName, messageContent, color);
    }

    /**
     * Získá všechny zprávy v chatu
     * @returns {Array<Object>} Pole zpráv
     */
    getMessages() {
        return this.messages;
    }

    /**
     * Smaže všechny zprávy v chatu
     */
    clearMessages() {
        this.messages = [];
    }

    /**
     * Získá historii uživatelských zpráv pro autocomplete
     * @returns {Array<string>} Pole zpráv
     */
    getChatHistory() {
        return this.chatHistory;
    }
}

// Exportujeme jedinou instanci ChatSystem
export default new ChatSystem();
