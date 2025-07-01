/**
 * Enhanced AI Controller - Refactored
 * Main orchestrator for all AI personality systems and interactions
 * Replaced 326-line monolithic file with modular architecture
 */

// Import all AI controller modules
import { aiSystemCoordinator } from './modules/systemCoordinator.js';
import { aiResponseGenerator } from './modules/responseGenerator.js';
import { chatResponseHandler } from './modules/chatResponseHandler.js';

export class EnhancedAIController {
    constructor() {
        // Use modular system coordinator
        this.systemCoordinator = aiSystemCoordinator;
        this.responseGenerator = aiResponseGenerator;
        this.chatHandler = chatResponseHandler;
    }

    /**
     * Main method for generating AI responses based on triggers and context
     * @param {string} aiType - The AI personality type
     * @param {string} trigger - The event that triggered the response
     * @param {Object} data - Additional context data
     * @returns {string} Generated AI response
     */
    generateAIResponse(aiType, trigger, data = {}) {
        return this.systemCoordinator.generateAIResponse(aiType, trigger, data);
    }

    /**
     * Generates response to chat messages
     * @param {string} aiType - The AI personality type
     * @param {string} message - The chat message
     * @returns {string} AI chat response
     */
    generateChatResponse(aiType, message) {
        return this.systemCoordinator.generateChatResponse(aiType, message);
    }

    /**
     * Generates contextual game reactions
     * @param {string} aiType - AI personality type
     * @param {string} eventType - Game event type
     * @param {Object} context - Event context
     * @returns {string} Contextual reaction
     */
    generateGameReaction(aiType, eventType, context = {}) {
        return this.systemCoordinator.generateGameReaction(aiType, eventType, context);
    }

    /**
     * Generates trash talk (legacy compatibility)
     * @param {string} aiType - AI personality type
     * @param {string} targetType - Target type
     * @returns {string} Trash talk response
     */
    generateTrashTalk(aiType, targetType = 'human') {
        return this.generateAIResponse(aiType, 'trash_talk', { target: targetType });
    }

    /**
     * Generates AI banter (legacy compatibility)
     * @param {string} initiator - Initiating AI
     * @returns {string} AI banter
     */
    generateAIBanter(initiator) {
        return this.generateAIResponse(initiator, 'banter', {});
    }

    /**
     * Checks if AI can respond (respects cooldowns)
     * @param {string} aiType - AI personality type
     * @param {string} responseType - Type of response
     * @returns {boolean} Whether AI can respond
     */
    canRespond(aiType, responseType = 'default') {
        return this.systemCoordinator.canRespond(aiType, responseType);
    }

    /**
     * Sets cooldown for AI response type
     * @param {string} aiType - AI personality type
     * @param {string} responseType - Type of response
     */
    setCooldown(aiType, responseType = 'default') {
        this.systemCoordinator.setCooldown(aiType, responseType);
    }

    /**
     * Clears all cooldowns (useful for testing or game reset)
     */
    clearCooldowns() {
        this.systemCoordinator.clearCooldowns();
    }

    /**
     * Gets AI system statistics for debugging
     * @returns {Object} System statistics
     */
    getSystemStats() {
        return this.systemCoordinator.getSystemStats();
    }

    /**
     * Performs system maintenance
     */
    performMaintenance() {
        this.systemCoordinator.performMaintenance();
    }

    /**
     * Resets system statistics
     */
    resetStats() {
        this.systemCoordinator.resetStats();
    }

    /**
     * Gets module status information
     * @returns {Object} Module status
     */
    getModuleStatus() {
        return {
            systemCoordinator: !!this.systemCoordinator,
            responseGenerator: !!this.responseGenerator,
            chatHandler: !!this.chatHandler,
            stats: this.getSystemStats()
        };
    }
}

/**
 * Legacy compatibility function for game reactions
 * @param {string} aiType - AI type
 * @param {string} eventType - Event type
 * @param {Object} context - Event context
 * @returns {Object|null} Reaction object or null
 */
export function generateAIGameReaction(aiType, eventType, context = '') {
    const aiPersonalityMap = {
        'ai': ['gemini', 'chatgpt', 'claude'][Math.floor(Math.random() * 3)]
    };
    
    const actualAiType = aiPersonalityMap[aiType] || aiType;
    const enhancedAI = new EnhancedAIController();
    
    try {
        const reaction = enhancedAI.generateGameReaction(actualAiType, eventType, context);
        if (reaction) {
            return {
                senderType: aiType,
                message: reaction
            };
        }
    } catch (error) {
        console.warn('Error generating AI game reaction:', error);
    }
    
    return null;
}

// Export singleton instance
export const enhancedAI = new EnhancedAIController();

// Legacy compatibility functions
export function generateAIChatResponse(aiType, message) {
    return enhancedAI.generateChatResponse(aiType, message);
}

// Expose for global access and debugging
window.enhancedAI = enhancedAI;
