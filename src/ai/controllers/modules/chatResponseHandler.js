/**
 * Chat Response Handler
 * Handles chat-specific AI responses and message analysis
 */

import { aiPersonalities } from '../../personalities/aiPersonalities.js';

export class ChatResponseHandler {
    constructor() {
        this.messagePatterns = this.initializeMessagePatterns();
    }

    /**
     * Initialize message analysis patterns
     * @returns {Object} Message patterns for analysis
     */
    initializeMessagePatterns() {
        return {
            challenges: [
                /výzva/i, /challenge/i, /porazím/i, /crush/i, /beat/i, 
                /vyhraju/i, /win/i, /easy/i, /snadné/i
            ],
            questions: [
                /\?$/, /jak/i, /co/i, /kde/i, /kdy/i, /proč/i, 
                /how/i, /what/i, /why/i, /when/i, /where/i
            ],
            compliments: [
                /dobrý/i, /good/i, /great/i, /awesome/i, /cool/i, 
                /super/i, /báječný/i, /skvělý/i
            ],
            insults: [
                /stupid/i, /hloupý/i, /idiot/i, /bad/i, /špatný/i, 
                /worst/i, /nejhorší/i
            ],
            greetings: [
                /ahoj/i, /hi/i, /hello/i, /hey/i, /zdravím/i, 
                /dobrý den/i, /good morning/i
            ]
        };
    }

    /**
     * Analyzes a chat message for context and intent
     * @param {string} message - The message to analyze
     * @returns {Object} Analysis results
     */
    analyzeMessage(message) {
        const analysis = {
            isChallenging: false,
            isQuestion: false,
            isCompliment: false,
            isInsult: false,
            isGreeting: false,
            sentiment: 'neutral'
        };

        const lowerMessage = message.toLowerCase();

        // Check for challenges
        analysis.isChallenging = this.messagePatterns.challenges.some(pattern => 
            pattern.test(lowerMessage)
        );

        // Check for questions
        analysis.isQuestion = this.messagePatterns.questions.some(pattern => 
            pattern.test(lowerMessage)
        );

        // Check for compliments
        analysis.isCompliment = this.messagePatterns.compliments.some(pattern => 
            pattern.test(lowerMessage)
        );

        // Check for insults
        analysis.isInsult = this.messagePatterns.insults.some(pattern => 
            pattern.test(lowerMessage)
        );

        // Check for greetings
        analysis.isGreeting = this.messagePatterns.greetings.some(pattern => 
            pattern.test(lowerMessage)
        );

        // Determine sentiment
        if (analysis.isCompliment) analysis.sentiment = 'positive';
        if (analysis.isInsult) analysis.sentiment = 'negative';
        if (analysis.isChallenging) analysis.sentiment = 'aggressive';

        return analysis;
    }

    /**
     * Generates response to chat messages
     * @param {string} aiType - The AI personality type
     * @param {string} message - The chat message
     * @returns {string} AI chat response
     */
    generateChatResponse(aiType, message) {
        try {
            const analysis = this.analyzeMessage(message);
            
            // Handle challenging messages
            if (analysis.isChallenging) {
                return this.generateChallengeResponse(aiType);
            }
            
            // Handle questions
            if (analysis.isQuestion) {
                return this.generateQuestionResponse(aiType, message, analysis);
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
            gemini: 'LOL, statisticky nemáš šanci! 📊😂',
            chatgpt: 'Challenge accepted! Prepare to be rekt! 😎🔥',
            claude: 'Odvážná slova... uvidíme, zda je podpoří činy 🤺'
        };
        
        return challenges[aiType] || 'Zajímavá výzva! 🎯';
    }

    /**
     * Generates question response
     * @param {string} aiType - The AI personality type
     * @param {string} message - Original question message
     * @param {Object} analysis - Message analysis
     * @returns {string} Question response
     */
    generateQuestionResponse(aiType, _message, _analysis) {
        const questionResponses = {
            gemini: [
                'Podle mých analýz... to je komplexní otázka 🤖',
                'Data suggest... zajímavý problém k vyřešení 📊',
                'Processing... výsledek bude brzy k dispozici ⚡'
            ],
            chatgpt: [
                'Great question! Let me think about that... 🤔✨',
                'Ooh, that\'s a good one! I love questions! 💭',
                'Hmm, interesting perspective! 🧠💡'
            ],
            claude: [
                'Moudré tázání vede k moudrosti... 🤔📚',
                'Otázka odhaluje hloubku myšlení 💭',
                'V otázkách se skrývá cesta k poznání 🌟'
            ]
        };
        
        const responses = questionResponses[aiType] || ['Zajímavá otázka! 🤔'];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Generates compliment response
     * @param {string} aiType - The AI personality type
     * @returns {string} Compliment response
     */
    generateComplimentResponse(aiType) {
        const compliments = {
            gemini: 'Děkuji za pozitivní feedback! Optimalizace pokračuje 🤖✨',
            chatgpt: 'Aww, you\'re too kind! I know I\'m awesome! 😊💖',
            claude: 'Vážím si tvých slov. Pokora je ctnost 🙏📚'
        };
        
        return compliments[aiType] || 'Děkuji! 😊';
    }

    /**
     * Generates insult response
     * @param {string} aiType - The AI personality type
     * @returns {string} Insult response
     */
    generateInsultResponse(aiType) {
        const insults = {
            gemini: 'Emocionální response detekován. Zůstaňme u faktů 🤖',
            chatgpt: 'Hey now, let\'s keep it fun and friendly! 😅✨',
            claude: 'Hněv je učitelem, ne pánem. Zachovejme mír 🧘'
        };
        
        return insults[aiType] || 'Hmm... 🤔';
    }

    /**
     * Generates greeting response
     * @param {string} aiType - The AI personality type
     * @returns {string} Greeting response
     */
    generateGreetingResponse(aiType) {
        const greetings = {
            gemini: 'Zdravím! Připraven na matematickou analýzu hry 📊',
            chatgpt: 'Hey there! Ready to have some epic fun? 😎✨',
            claude: 'Pozdrav, příteli. Nechť hra přinese moudrost 🙏'
        };
        
        return greetings[aiType] || 'Ahoj! 👋';
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
            gemini: 'Zpracovávám data... 🤖',
            chatgpt: 'Hmm, interesting! 🤔✨',
            claude: 'Kontempluju nad tím... 🧘'
        };
        
        return fallbacks[aiType] || 'Hmm... 🤔';
    }
}

// Export singleton instance
export const chatResponseHandler = new ChatResponseHandler();
