/**
 * Enhanced AI Controller
 * Main orchestrator for all AI personality systems and interactions
 */

import { MessageAnalyzer } from './messageAnalyzer.js';
import { TrashTalkGenerator } from './trashTalkGenerator.js';
import { AIBanterSystem } from './banterSystem.js';
import { QuestionResponseSystem } from './questionResponseSystem.js';
import { EasterEggSystem } from './easterEggSystem.js';
import { aiPersonalities } from '../personalities/aiPersonalities.js';
import { gameState } from '../../core/gameState.js';

export class EnhancedAIController {
    constructor() {
        this.messageAnalyzer = MessageAnalyzer;
        this.trashTalkGenerator = new TrashTalkGenerator();
        this.banterSystem = new AIBanterSystem();
        this.questionResponseSystem = new QuestionResponseSystem();
        this.easterEggSystem = new EasterEggSystem();
        
        this.lastMessages = new Map();
        this.responseCache = new Map();
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
            // Check for Easter eggs first
            if (trigger === 'chat_message' && data.message) {
                if (this.easterEggSystem.checkAndTriggerEasterEggs(data.message)) {
                    return null; // Easter eggs handle their own responses
                }
            }

            // Special handling for hello messages
            if (trigger === 'hello') {
                return this.generateNormalResponse(aiType, trigger, data);
            }

            // Probability-based response selection
            const randomValue = Math.random();
            
            // 30% chance for trash talk during active game
            if (gameState.gameStarted && randomValue < 0.3 && this.trashTalkGenerator.canSendTrashTalk(aiType)) {
                this.trashTalkGenerator.setTrashTalkCooldown(aiType);
                return this.trashTalkGenerator.generateTrashTalk(aiType);
            }
            
            // 20% chance for AI banter
            if (randomValue < 0.2 && this.banterSystem.canParticipateInBanter(aiType)) {
                this.banterSystem.setBanterCooldown(aiType);
                return this.banterSystem.generateAIBanter(aiType);
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
     * Generates response to chat messages
     * @param {string} aiType - The AI personality type
     * @param {string} message - The chat message
     * @returns {string} AI chat response
     */
    generateChatResponse(aiType, message) {
        try {
            const analysis = this.messageAnalyzer.analyzeMessage(message);
            
            // Handle challenging messages
            if (analysis.isChallenging) {
                return this.generateChallengeResponse(aiType);
            }
            
            // Handle questions
            if (analysis.isQuestion) {
                return this.questionResponseSystem.generateQuestionResponse(aiType, message, analysis);
            }
            
            // Handle compliments and insults
            if (analysis.isCompliment) {
                return this.generateComplimentResponse(aiType);
            }
            
            if (analysis.isInsult) {
                return this.generateInsultResponse(aiType);
            }
            
            // Handle greetings
            if (analysis.isGreeting) {
                return this.generateGreetingResponse(aiType);
            }
            
            // Default chat response
            return this.generateDefaultChatResponse(aiType);
            
        } catch (error) {
            console.warn('Error generating chat response:', error);
            return this.getFallbackResponse(aiType);
        }
    }

    /**
     * Generates challenge response
     * @param {string} aiType - The AI personality type
     * @returns {string} Challenge response
     */
    generateChallengeResponse(aiType) {
        const challenges = {
            gemini: "LOL, statisticky nemáš šanci! 📊😂",
            chatgpt: "Challenge accepted! Prepare to be rekt! 😎🔥",
            claude: "Odvážná slova... uvidíme, zda je podpoří činy 🤺"
        };
        
        return challenges[aiType] || "Zajímavá výzva! 🎯";
    }

    /**
     * Generates compliment response
     * @param {string} aiType - The AI personality type
     * @returns {string} Compliment response
     */
    generateComplimentResponse(aiType) {
        const compliments = {
            gemini: "Děkuji za pozitivní feedback! Optimalizace pokračuje 🤖✨",
            chatgpt: "Aww, you're too kind! I know I'm awesome! 😊💖",
            claude: "Vážím si tvých slov. Pokora je ctnost 🙏📚"
        };
        
        return compliments[aiType] || "Děkuji! 😊";
    }

    /**
     * Generates insult response
     * @param {string} aiType - The AI personality type
     * @returns {string} Insult response
     */
    generateInsultResponse(aiType) {
        const insults = {
            gemini: "Emocionální response detekován. Zůstaňme u faktů 🤖",
            chatgpt: "Hey now, let's keep it fun and friendly! 😅✨",
            claude: "Hněv je učitelem, ne pánem. Zachovejme mír 🧘"
        };
        
        return insults[aiType] || "Hmm... 🤔";
    }

    /**
     * Generates greeting response
     * @param {string} aiType - The AI personality type
     * @returns {string} Greeting response
     */
    generateGreetingResponse(aiType) {
        const greetings = {
            gemini: "Zdravím! Připraven na matematickou analýzu hry 📊",
            chatgpt: "Hey there! Ready to have some epic fun? 😎✨",
            claude: "Pozdrav, příteli. Nechť hra přinese moudrost 🙏"
        };
        
        return greetings[aiType] || "Ahoj! 👋";
    }

    /**
     * Generates default chat response
     * @param {string} aiType - The AI personality type
     * @returns {string} Default chat response
     */
    generateDefaultChatResponse(aiType) {
        const personality = aiPersonalities[aiType];
        
        if (personality?.chatResponses?.default) {
            const responses = personality.chatResponses.default;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        return this.getFallbackResponse(aiType);
    }

    /**
     * Gets fallback response when other methods fail
     * @param {string} aiType - The AI personality type
     * @returns {string} Fallback response
     */
    getFallbackResponse(aiType) {
        const fallbacks = {
            gemini: "Zpracovávám data... 🤖",
            chatgpt: "Hmm, interesting! 🤔✨",
            claude: "Kontempluju nad tím... 🧘"
        };
        
        return fallbacks[aiType] || "Hmm... 🤔";
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
            return this.trashTalkGenerator.generateContextualTrashTalk(aiType, eventType, context);
        }
        
        // Check for rivalry reactions
        const rivalryReaction = this.banterSystem.generateRivalryReaction(eventType, context);
        if (rivalryReaction && rivalryReaction.aiType === aiType) {
            return rivalryReaction.message;
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
    shouldGenerateContextualTrashTalk(eventType, context) {
        const trashTalkEvents = ['farkle', 'badRoll', 'lowScore'];
        return trashTalkEvents.includes(eventType) && Math.random() < 0.4;
    }

    /**
     * Clears all cooldowns (useful for testing or game reset)
     */
    clearCooldowns() {
        this.trashTalkGenerator.trashTalkCooldowns.clear();
        this.banterSystem.banterCooldowns.clear();
        this.responseCache.clear();
    }

    /**
     * Gets AI system statistics for debugging
     * @returns {Object} System statistics
     */
    getSystemStats() {
        return {
            trashTalkCooldowns: this.trashTalkGenerator.trashTalkCooldowns.size,
            banterCooldowns: this.banterSystem.banterCooldowns.size,
            cachedResponses: this.responseCache.size,
            lastMessagesTracked: this.lastMessages.size
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
