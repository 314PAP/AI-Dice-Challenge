/**
 * Enhanced Chat Controller
 * Main orchestrator for the modular chat system
 */

import { ChatMessageHandler } from './chatMessageHandler.js';
import { ChatInputHandler } from './chatInputHandler.js';
import { AIResponseHandler } from './aiResponseHandler.js';
import { enhancedAI } from '../../ai/controllers/enhancedAIController.js';

// Configuration
const USE_REAL_AI = false; // Set to true when backend API is available

export class EnhancedChatController {
    constructor() {
        this.messageHandler = new ChatMessageHandler();
        this.aiResponseHandler = new AIResponseHandler(this.messageHandler, enhancedAI);
        this.inputHandler = new ChatInputHandler(this.messageHandler, this.aiResponseHandler);
        
        this.isInitialized = false;
        this.config = {
            useRealAI: USE_REAL_AI,
            maxMessages: 100,
            responseDelay: { min: 500, max: 2000 }
        };
    }

    /**
     * Initializes the chat system
     */
    initialize() {
        try {
            console.log('💬 Initializing Enhanced Chat Controller...');
            
            // Setup event listeners
            this.inputHandler.setupEventListeners();
            
            // Configure AI response handler
            this.aiResponseHandler.setUseRealAI(this.config.useRealAI);
            this.aiResponseHandler.setResponseDelay(
                this.config.responseDelay.min,
                this.config.responseDelay.max
            );
            
            // Configure message handler
            this.messageHandler.setMaxMessages(this.config.maxMessages);
            
            // Setup global chat functions for backward compatibility
            this.setupGlobalFunctions();
            
            this.isInitialized = true;
            console.log('✅ Chat system ready');
            
            // Send welcome message
            this.sendWelcomeMessage();
            
        } catch (error) {
            console.error('Error initializing chat controller:', error);
        }
    }

    /**
     * Sets up global functions for backward compatibility
     */
    setupGlobalFunctions() {
        // Make addChatMessage available globally for legacy compatibility
        window.addChatMessage = (senderType, message, options = {}) => {
            this.messageHandler.addMessage(senderType, message, options);
        };
        
        // Make AI personalities available globally
        if (!window.aiPersonalities) {
            import('../../ai/personalities/aiPersonalities.js').then(module => {
                window.aiPersonalities = module.aiPersonalities;
            }).catch(console.warn);
        }
    }

    /**
     * Sends a welcome message when chat is initialized
     */
    sendWelcomeMessage() {
        this.messageHandler.addMessage('system', 'Chat systém připraven! Napište zprávu a AI vám odpoví. 💬', {
            isSystemMessage: true
        });
    }

    /**
     * Handles game events and generates AI reactions
     * @param {string} eventType - Type of game event
     * @param {Object} eventData - Event data
     */
    async handleGameEvent(eventType, eventData = {}) {
        if (!this.isInitialized) return;
        
        await this.aiResponseHandler.handleGameEvent(eventType, eventData);
    }

    /**
     * Sends a system message
     * @param {string} message - System message content
     * @param {Object} options - Additional options
     */
    sendSystemMessage(message, options = {}) {
        this.messageHandler.addMessage('system', message, {
            isSystemMessage: true,
            ...options
        });
    }

    /**
     * Sends a message programmatically
     * @param {string} message - Message to send
     */
    async sendMessage(message) {
        await this.inputHandler.sendProgrammaticMessage(message);
    }

    /**
     * Forces all AIs to respond to a specific message
     * @param {string} message - Message to respond to
     */
    async forceAllAIResponses(message) {
        await this.aiResponseHandler.forceAllAIResponses(message);
    }

    /**
     * Clears the chat
     */
    clearChat() {
        this.messageHandler.clearChat();
        this.inputHandler.clearInputHistory();
    }

    /**
     * Gets chat history
     * @returns {Array} Chat history
     */
    getChatHistory() {
        return this.messageHandler.getChatHistory();
    }

    /**
     * Gets input history
     * @returns {Array} Input history
     */
    getInputHistory() {
        return this.inputHandler.getInputHistory();
    }

    /**
     * Updates configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Apply configuration changes
        if (newConfig.useRealAI !== undefined) {
            this.aiResponseHandler.setUseRealAI(newConfig.useRealAI);
        }
        
        if (newConfig.responseDelay) {
            this.aiResponseHandler.setResponseDelay(
                newConfig.responseDelay.min,
                newConfig.responseDelay.max
            );
        }
        
        if (newConfig.maxMessages) {
            this.messageHandler.setMaxMessages(newConfig.maxMessages);
        }
    }

    /**
     * Gets current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
        return {
            ...this.config,
            ...this.aiResponseHandler.getConfig()
        };
    }

    /**
     * Sets processing state for input
     * @param {boolean} processing - Whether processing is active
     */
    setProcessing(processing) {
        this.inputHandler.setProcessing(processing);
    }

    /**
     * Adds an AI response manually (for testing)
     * @param {string} aiType - AI personality type
     * @param {string} message - AI message
     */
    addAIResponse(aiType, message) {
        this.messageHandler.addMessage(aiType, message);
    }

    /**
     * Tests the chat system with sample messages
     */
    async testChatSystem() {
        console.log('🧪 Testing chat system...');
        
        const testMessages = [
            'Ahoj všichni! Jak se máte?',
            'Jaká je vaše strategie ve hře?',
            'Kdo myslíte, že vyhraje?'
        ];
        
        for (const [index, message] of testMessages.entries()) {
            setTimeout(async () => {
                console.log(`Sending test message ${index + 1}: ${message}`);
                await this.sendMessage(message);
            }, index * 3000);
        }
    }

    /**
     * Destroys the chat controller and cleans up
     */
    destroy() {
        // Clean up global functions
        if (window.addChatMessage) {
            delete window.addChatMessage;
        }
        
        this.isInitialized = false;
        console.log('Chat controller destroyed');
    }
}

// Export singleton instance for backward compatibility
export const enhancedChatController = new EnhancedChatController();

// Legacy compatibility exports
export default enhancedChatController;
