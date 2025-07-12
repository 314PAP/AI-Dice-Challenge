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
        this.listeners = []; // Přidáme listeners pro UI aktualizace
        this.loadChatHistory();
    }

    /**
     * Přidá listener pro změny zpráv
     * @param {Function} listener - Callback funkce
     */
    addListener(listener) {
        this.listeners.push(listener);
    }

    /**
     * Odstraní listener
     * @param {Function} listener - Callback funkce
     */
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Notifikuje všechny listenery o změně
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.error('Chyba v ChatSystem listener:', error);
            }
        });
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
        
        // Notifikujeme UI o nové zprávě
        this.notifyListeners();
        
        return message;
    }

    /**
     * Přidá systémovou zprávu do chatu
     * @param {string} content - Obsah zprávy
     * @param {string} [color=CHAT_COLORS.PURPLE] - Barva zprávy
     * @returns {Object} Vytvořená zpráva
     */
    addSystemMessage(content, color = CHAT_COLORS.PURPLE) {
        return this.addMessage('Systém', content, color);
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
        this.notifyListeners(); // Notifikujeme UI o změně
    }

    /**
     * Získá historii uživatelských zpráv pro autocomplete
     * @returns {Array<string>} Pole zpráv
     */
    getChatHistory() {
        return this.chatHistory;
    }

    /**
     * Přidá systémovou zprávu do chatu
     * @param {string} content - Obsah zprávy
     * @param {string} [color=CHAT_COLORS.YELLOW] - Barva zprávy
     */
    addSystemMessage(content, color = CHAT_COLORS.YELLOW) {
        this.addMessage('Systém', content, color);
    }
}

// Exportujeme jedinou instanci ChatSystem
export default new ChatSystem();
