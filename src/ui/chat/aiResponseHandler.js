/**
 * AI Response Handler
 * Manages AI responses to chat messages
 */

export class AIResponseHandler {
    constructor(messageHandler, enhancedAI, realAI = null) {
        this.messageHandler = messageHandler;
        this.enhancedAI = enhancedAI;
        this.realAI = realAI;
        this.useRealAI = false;
        this.responseDelay = { min: 500, max: 2000 };
    }

    /**
     * Generates AI responses to a user message
     * @param {string} message - User message
     */
    async generateResponses(message) {
        try {
            // Check for easter eggs first
            if (this.enhancedAI.easterEggSystem.checkAndTriggerEasterEggs(message)) {
                return; // Easter eggs handle their own responses
            }

            // Determine which AIs should respond
            const respondingAIs = this.determineRespondingAIs(message);
            
            // Generate responses with staggered timing
            for (const [index, aiType] of respondingAIs.entries()) {
                setTimeout(async () => {
                    await this.generateSingleAIResponse(aiType, message);
                }, (index + 1) * this.getRandomDelay());
            }
            
        } catch (error) {
            console.error('Error generating AI responses:', error);
            this.messageHandler.addMessage('system', 'Chyba při generování AI odpovědí.', {
                isError: true
            });
        }
    }

    /**
     * Generates a response from a single AI
     * @param {string} aiType - AI personality type
     * @param {string} message - User message
     */
    async generateSingleAIResponse(aiType, message) {
        try {
            let response;

            if (this.useRealAI && this.realAI) {
                // Use real AI API
                response = await this.generateRealAIResponse(aiType, message);
            } else {
                // Use enhanced AI system
                response = this.enhancedAI.generateChatResponse(aiType, message);
            }

            if (response) {
                this.messageHandler.addMessage(aiType, response);
            }
            
        } catch (error) {
            console.error(`Error generating ${aiType} response:`, error);
            
            // Fallback to enhanced AI if real AI fails
            if (this.useRealAI) {
                try {
                    const fallbackResponse = this.enhancedAI.generateChatResponse(aiType, message);
                    if (fallbackResponse) {
                        this.messageHandler.addMessage(aiType, fallbackResponse);
                    }
                } catch (fallbackError) {
                    console.error(`Fallback also failed for ${aiType}:`, fallbackError);
                }
            }
        }
    }

    /**
     * Generates response using real AI API
     * @param {string} aiType - AI personality type
     * @param {string} message - User message
     * @returns {Promise<string>} AI response
     */
    async generateRealAIResponse(aiType, message) {
        if (!this.realAI) {
            throw new Error('Real AI not available');
        }

        return await this.realAI.generateResponse(aiType, message);
    }

    /**
     * Determines which AIs should respond to a message
     * @param {string} message - User message
     * @returns {Array} Array of AI types that should respond
     */
    determineRespondingAIs(message) {
        const allAIs = ['gemini', 'chatgpt', 'claude'];
        const msg = message.toLowerCase();
        
        // Direct mentions
        const mentionedAIs = allAIs.filter(ai => {
            const aliases = this.getAIAliases(ai);
            return aliases.some(alias => msg.includes(alias));
        });
        
        if (mentionedAIs.length > 0) {
            return mentionedAIs;
        }
        
        // Questions get responses from all AIs with lower probability
        if (msg.includes('?')) {
            return allAIs.filter(() => Math.random() < 0.6);
        }
        
        // General messages get random subset of AIs
        const numResponders = Math.random() < 0.5 ? 1 : Math.random() < 0.8 ? 2 : 3;
        const shuffled = [...allAIs].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, numResponders);
    }

    /**
     * Gets aliases for an AI type
     * @param {string} aiType - AI personality type
     * @returns {Array} Array of aliases
     */
    getAIAliases(aiType) {
        const aliases = {
            gemini: ['gemini', 'google', 'g'],
            chatgpt: ['chatgpt', 'gpt', 'openai', 'chat'],
            claude: ['claude', 'anthropic', 'c']
        };
        
        return aliases[aiType] || [aiType];
    }

    /**
     * Gets a random delay for response timing
     * @returns {number} Delay in milliseconds
     */
    getRandomDelay() {
        const { min, max } = this.responseDelay;
        return Math.random() * (max - min) + min;
    }

    /**
     * Handles game event responses
     * @param {string} eventType - Type of game event
     * @param {Object} eventData - Event data
     */
    async handleGameEvent(eventType, eventData = {}) {
        try {
            // Determine which AIs should react to this event
            const reactingAIs = this.determineGameEventReactors(eventType, eventData);
            
            for (const [index, aiType] of reactingAIs.entries()) {
                setTimeout(() => {
                    const reaction = this.enhancedAI.generateGameReaction(aiType, eventType, eventData);
                    if (reaction) {
                        this.messageHandler.addMessage(aiType, reaction);
                    }
                }, (index + 1) * this.getRandomDelay());
            }
            
        } catch (error) {
            console.error('Error handling game event:', error);
        }
    }

    /**
     * Determines which AIs should react to a game event
     * @param {string} eventType - Type of game event
     * @param {Object} eventData - Event data
     * @returns {Array} Array of AI types that should react
     */
    determineGameEventReactors(eventType, eventData) {
        const allAIs = ['gemini', 'chatgpt', 'claude'];
        
        // High-impact events get more reactions
        const highImpactEvents = ['gameOver', 'finalRound', 'highScore'];
        if (highImpactEvents.includes(eventType)) {
            return allAIs; // All AIs react
        }
        
        // Medium-impact events get some reactions
        const mediumImpactEvents = ['farkle', 'hotDice'];
        if (mediumImpactEvents.includes(eventType)) {
            return allAIs.filter(() => Math.random() < 0.6);
        }
        
        // Low-impact events get occasional reactions
        return allAIs.filter(() => Math.random() < 0.3);
    }

    /**
     * Sets whether to use real AI
     * @param {boolean} useReal - Whether to use real AI
     */
    setUseRealAI(useReal) {
        this.useRealAI = useReal && this.realAI !== null;
    }

    /**
     * Sets response delay range
     * @param {number} min - Minimum delay in milliseconds
     * @param {number} max - Maximum delay in milliseconds
     */
    setResponseDelay(min, max) {
        this.responseDelay = { min: Math.max(0, min), max: Math.max(min, max) };
    }

    /**
     * Forces all AIs to respond to a message
     * @param {string} message - Message to respond to
     */
    async forceAllAIResponses(message) {
        const allAIs = ['gemini', 'chatgpt', 'claude'];
        
        for (const [index, aiType] of allAIs.entries()) {
            setTimeout(async () => {
                await this.generateSingleAIResponse(aiType, message);
            }, (index + 1) * this.getRandomDelay());
        }
    }

    /**
     * Gets configuration info
     * @returns {Object} Configuration object
     */
    getConfig() {
        return {
            useRealAI: this.useRealAI,
            hasRealAI: this.realAI !== null,
            responseDelay: this.responseDelay
        };
    }
}
