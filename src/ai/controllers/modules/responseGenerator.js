/**
 * AI Response Generator
 * Core AI response generation and coordination
 */

import { aiPersonalities } from '../../personalities/aiPersonalities.js';
import { gameState } from '../../../core/gameState.js';

export class AIResponseGenerator {
    constructor() {
        this.responseCache = new Map();
        this.lastMessages = new Map();
    }

    /**
     * Main method for generating AI responses based on triggers and context
     * @param {string} aiType - The AI personality type
     * @param {string} trigger - The event that triggered the response
     * @param {Object} data - Additional context data
     * @returns {string} Generated AI response
     */
    generateAIResponse(aiType, trigger, data = {}) {
        try {
            // Special handling for hello messages
            if (trigger === 'hello') {
                return this.generateNormalResponse(aiType, trigger, data);
            }

            // Probability-based response selection
            const randomValue = Math.random();
            
            // 30% chance for trash talk during active game
            if (gameState.gameStarted && randomValue < 0.3) {
                const trashTalk = this.generateTrashTalkResponse(aiType);
                if (trashTalk) return trashTalk;
            }
            
            // 20% chance for AI banter
            if (randomValue < 0.2) {
                const banter = this.generateBanterResponse(aiType);
                if (banter) return banter;
            }

            // Default to normal response
            return this.generateNormalResponse(aiType, trigger, data);
            
        } catch (error) {
            console.warn('Error generating AI response:', error);
            return this.getFallbackResponse(aiType);
        }
    }

    /**
     * Generates normal personality-based response
     * @param {string} aiType - The AI personality type
     * @param {string} trigger - The response trigger
     * @param {Object} data - Additional context data
     * @returns {string} Normal AI response
     */
    generateNormalResponse(aiType, trigger, data) {
        const personality = aiPersonalities[aiType];
        
        if (!personality?.gameReactions?.[trigger]) {
            return this.getFallbackResponse(aiType);
        }
        
        const reactions = personality.gameReactions[trigger];
        
        if (typeof reactions === 'function') {
            return reactions(data)[0];
        }
        
        if (Array.isArray(reactions)) {
            return reactions[Math.floor(Math.random() * reactions.length)];
        }
        
        return this.getFallbackResponse(aiType);
    }

    /**
     * Generates contextual game reactions
     * @param {string} aiType - AI personality type
     * @param {string} eventType - Game event type
     * @param {Object} context - Event context
     * @returns {string} Contextual reaction
     */
    generateGameReaction(aiType, eventType, context = {}) {
        // Check for contextual trash talk opportunities
        if (this.shouldGenerateContextualTrashTalk(eventType, context)) {
            const trashTalk = this.generateContextualTrashTalk(aiType, eventType, context);
            if (trashTalk) return trashTalk;
        }
        
        // Generate normal reaction
        return this.generateNormalResponse(aiType, eventType, context);
    }

    /**
     * Determines if contextual trash talk should be generated
     * @param {string} eventType - Game event type
     * @param {Object} context - Event context
     * @returns {boolean} True if trash talk should be generated
     */
    shouldGenerateContextualTrashTalk(eventType, _context) {
        const trashTalkEvents = ['farkle', 'badRoll', 'lowScore'];
        return trashTalkEvents.includes(eventType) && Math.random() < 0.4;
    }

    /**
     * Gets fallback response when other methods fail
     * @param {string} aiType - The AI personality type
     * @returns {string} Fallback response
     */
    getFallbackResponse(aiType) {
        const fallbacks = {
            gemini: 'Zpracovávám data... 🤖',
            chatgpt: 'Hmm, interesting! 🤔✨',
            claude: 'Kontempluju nad tím... 🧘'
        };
        
        return fallbacks[aiType] || 'Hmm... 🤔';
    }

    /**
     * Placeholder methods - to be implemented by specialized modules
     */
    generateTrashTalkResponse(_aiType) {
        // To be implemented by TrashTalk module
        return null;
    }

    generateBanterResponse(_aiType) {
        // To be implemented by Banter module
        return null;
    }

    generateContextualTrashTalk(_aiType, _eventType, _context) {
        // To be implemented by TrashTalk module
        return null;
    }

    /**
     * Clears response cache
     */
    clearCache() {
        this.responseCache.clear();
        this.lastMessages.clear();
    }

    /**
     * Gets response statistics
     * @returns {Object} Response statistics
     */
    getStats() {
        return {
            cachedResponses: this.responseCache.size,
            lastMessagesTracked: this.lastMessages.size
        };
    }
}

// Export singleton instance
export const aiResponseGenerator = new AIResponseGenerator();
