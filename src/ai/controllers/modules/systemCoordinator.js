/**
 * AI System Coordinator
 * Coordinates all AI modules and provides central management
 */

import { aiResponseGenerator } from './responseGenerator.js';
import { chatResponseHandler } from './chatResponseHandler.js';

export class AISystemCoordinator {
    constructor() {
        this.responseGenerator = aiResponseGenerator;
        this.chatHandler = chatResponseHandler;
        
        // System state
        this.cooldowns = new Map();
        this.systemStats = {
            responsesGenerated: 0,
            chatResponsesGenerated: 0,
            errorsEncountered: 0
        };
    }

    /**
     * Main entry point for AI system
     * @param {string} aiType - AI personality type
     * @param {string} trigger - Event trigger
     * @param {Object} data - Context data
     * @returns {string} AI response
     */
    generateAIResponse(aiType, trigger, data = {}) {
        try {
            this.systemStats.responsesGenerated++;
            
            // Handle chat messages specially
            if (trigger === 'chat_message' && data.message) {
                this.systemStats.chatResponsesGenerated++;
                return this.chatHandler.generateChatResponse(aiType, data.message);
            }
            
            // Use response generator for game events
            return this.responseGenerator.generateAIResponse(aiType, trigger, data);
            
        } catch (error) {
            console.error('AI System error:', error);
            this.systemStats.errorsEncountered++;
            return this.getErrorFallback(aiType);
        }
    }

    /**
     * Generates game reaction through response generator
     * @param {string} aiType - AI personality type
     * @param {string} eventType - Game event type
     * @param {Object} context - Event context
     * @returns {string} Game reaction
     */
    generateGameReaction(aiType, eventType, context = {}) {
        try {
            return this.responseGenerator.generateGameReaction(aiType, eventType, context);
        } catch (error) {
            console.error('Game reaction error:', error);
            this.systemStats.errorsEncountered++;
            return this.getErrorFallback(aiType);
        }
    }

    /**
     * Generates chat response through chat handler
     * @param {string} aiType - AI personality type
     * @param {string} message - Chat message
     * @returns {string} Chat response
     */
    generateChatResponse(aiType, message) {
        try {
            this.systemStats.chatResponsesGenerated++;
            return this.chatHandler.generateChatResponse(aiType, message);
        } catch (error) {
            console.error('Chat response error:', error);
            this.systemStats.errorsEncountered++;
            return this.getErrorFallback(aiType);
        }
    }

    /**
     * Checks if AI can respond (respects cooldowns)
     * @param {string} aiType - AI personality type
     * @param {string} responseType - Type of response
     * @returns {boolean} Whether AI can respond
     */
    canRespond(aiType, responseType = 'default') {
        const cooldownKey = `${aiType}_${responseType}`;
        const now = Date.now();
        const lastResponse = this.cooldowns.get(cooldownKey);
        
        // Default cooldown: 5 seconds
        const cooldownTime = this.getCooldownTime(responseType);
        
        return !lastResponse || (now - lastResponse) > cooldownTime;
    }

    /**
     * Sets cooldown for AI response type
     * @param {string} aiType - AI personality type
     * @param {string} responseType - Type of response
     */
    setCooldown(aiType, responseType = 'default') {
        const cooldownKey = `${aiType}_${responseType}`;
        this.cooldowns.set(cooldownKey, Date.now());
    }

    /**
     * Gets cooldown time for response type
     * @param {string} responseType - Type of response
     * @returns {number} Cooldown time in milliseconds
     */
    getCooldownTime(responseType) {
        const cooldownTimes = {
            'default': 5000,
            'trash_talk': 10000,
            'banter': 8000,
            'chat': 3000,
            'game_event': 2000
        };
        
        return cooldownTimes[responseType] || 5000;
    }

    /**
     * Gets error fallback response
     * @param {string} aiType - AI personality type
     * @returns {string} Error fallback response
     */
    getErrorFallback(aiType) {
        const errorFallbacks = {
            gemini: 'System error. Restarting protocols... 🤖⚠️',
            chatgpt: 'Oops! Something went wrong! Let me recalibrate... 😅🔧',
            claude: 'Něco se pokazilo... meditace nad chybou... 🧘⚠️'
        };
        
        return errorFallbacks[aiType] || 'Error... 🤖❌';
    }

    /**
     * Clears all cooldowns
     */
    clearCooldowns() {
        this.cooldowns.clear();
        this.responseGenerator.clearCache();
    }

    /**
     * Gets comprehensive system statistics
     * @returns {Object} System statistics
     */
    getSystemStats() {
        return {
            ...this.systemStats,
            activeCooldowns: this.cooldowns.size,
            responseGeneratorStats: this.responseGenerator.getStats()
        };
    }

    /**
     * Resets system statistics
     */
    resetStats() {
        this.systemStats = {
            responsesGenerated: 0,
            chatResponsesGenerated: 0,
            errorsEncountered: 0
        };
    }

    /**
     * Performs system maintenance
     */
    performMaintenance() {
        // Clear old cooldowns (older than 1 hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const [key, timestamp] of this.cooldowns.entries()) {
            if (timestamp < oneHourAgo) {
                this.cooldowns.delete(key);
            }
        }
        
        // Clear caches
        this.responseGenerator.clearCache();
        
        console.log('AI System maintenance completed');
    }
}

// Export singleton instance
export const aiSystemCoordinator = new AISystemCoordinator();
