/**
 * Chat System - Správa chatovacích funkcí
 * Zajišťuje komunikaci s AI osobnostmi a správu zpráv
 */

import { getAiColor, getRandomAiResponse } from './personalities.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { CHAT_COLORS } from '../utils/colors.js';
// Importujeme nový modul pro AI interakce
import { detectGameEvent, getRandomInteraction, shouldTriggerInteraction } from './aiInteractions.js';

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
     * @param {string} [color=CHAT_COLORS.WHITE] - Barva zprávy
     * @returns {Object} Vytvořená zpráva
     */
    addMessage(sender, content, color = CHAT_COLORS.WHITE) {
        const message = {
            id: Date.now(),
            sender,
            content,
            color,
            timestamp: '' // Prázdný string místo celého časového razítka
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
        return this.addMessage('Systém', content, CHAT_COLORS.YELLOW);
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
     * Zpracuje sekvenci interakcí mezi AI postavami
     * @param {Array} interactionSequence - Sekvence interakcí mezi AI
     * @param {number} [delay=1800] - Prodleva mezi zprávami v ms (zvýšeno pro lepší čitelnost)
     */
    processAiInteractionSequence(interactionSequence, delay = 1800) {
        if (!interactionSequence || interactionSequence.length === 0) return;
        
        // Projdeme každou interakci v sekvenci a přidáme ji do chatu s časovým odstupem
        // Použijeme delší prodlevu mezi zprávami, aby uživatel měl čas si je přečíst
        interactionSequence.forEach((interaction, index) => {
            setTimeout(() => {
                this.addAiMessage(interaction.ai, interaction.message);
                
                // Notifikujeme UI o nové zprávě
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('chat:new-message', { 
                        detail: { 
                            sender: interaction.ai, 
                            message: interaction.message 
                        } 
                    }));
                }
            }, index * delay); // Delší prodleva pro lepší čitelnost dialogů
        });
    }

    /**
     * Zpracuje herní událost a případně spustí interakci mezi AI
     * @param {Array<number>} diceValues - Hodnoty hozených kostek
     * @param {number} score - Dosažené skóre v tahu
     * @param {string} triggerAi - Jméno AI, které má reakci spustit (nebo "ANY")
     */
    processGameEvent(diceValues, score, triggerAi = "ANY") {
        // Detekujeme typ herní události
        const eventType = detectGameEvent(diceValues, score);
        
        // Pokud nebyla detekována žádná událost nebo náhoda rozhodne, že se interakce nemá spustit
        if (!eventType || !shouldTriggerInteraction()) return;
        
        // Získáme náhodnou interakci pro detekovanou událost
        const interactionSequence = getRandomInteraction(eventType, triggerAi);
        
        // Pokud existuje interakce, spustíme sekvenci
        if (interactionSequence) {
            this.processAiInteractionSequence(interactionSequence);
        }
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
