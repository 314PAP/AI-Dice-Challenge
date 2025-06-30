/**
 * Chat Message Handler
 * Handles chat message display and formatting
 */

export class ChatMessageHandler {
    constructor() {
        this.chatHistory = [];
        this.maxChatMessages = 100;
    }

    /**
     * Adds a message to the chat display
     * @param {string} senderType - Type of sender (human, ai, system, etc.)
     * @param {string} message - The message content
     * @param {Object} options - Additional options for message display
     */
    addMessage(senderType, message, options = {}) {
        try {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) {
                console.warn('Chat messages container not found');
                return;
            }

            // Create message element
            const messageElement = this.createMessageElement(senderType, message, options);
            
            // Add to DOM
            chatMessages.appendChild(messageElement);
            
            // Auto-scroll to bottom
            this.scrollToBottom();
            
            // Add to history
            this.addToHistory(senderType, message, options);
            
            // Cleanup old messages if needed
            this.cleanupOldMessages();
            
        } catch (error) {
            console.error('Error adding chat message:', error);
        }
    }

    /**
     * Creates a message DOM element
     * @param {string} senderType - Type of sender
     * @param {string} message - Message content
     * @param {Object} options - Additional options
     * @returns {HTMLElement} Message element
     */
    createMessageElement(senderType, message, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${senderType}-message`;
        
        // Add timestamp if enabled
        const timestamp = options.timestamp || new Date();
        const timeString = this.formatTimestamp(timestamp);
        
        // Create sender info
        const senderInfo = this.getSenderInfo(senderType);
        
        // Build message HTML
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="sender-name" style="color: ${senderInfo.color}">
                    ${senderInfo.name}
                </span>
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-content">${this.formatMessageContent(message)}</div>
        `;
        
        // Add special styling for different message types
        this.applyMessageStyling(messageDiv, senderType, options);
        
        return messageDiv;
    }

    /**
     * Gets sender information
     * @param {string} senderType - Type of sender
     * @returns {Object} Sender info with name and color
     */
    getSenderInfo(senderType) {
        // Import personalities dynamically to avoid circular dependencies
        const defaultInfo = { name: 'Unknown', color: '#999999' };
        
        try {
            // Try to get from aiPersonalities if available
            if (window.aiPersonalities && window.aiPersonalities[senderType]) {
                const personality = window.aiPersonalities[senderType];
                return {
                    name: personality.name || senderType,
                    color: personality.color || defaultInfo.color
                };
            }
            
            // Fallback mapping
            const fallbackMapping = {
                human: { name: 'Vy (🧠)', color: '#39ff14' },
                system: { name: 'Systém', color: '#39ff14' },
                gemini: { name: 'Gemini (G)', color: '#0099ff' },
                chatgpt: { name: 'ChatGPT (⚡)', color: '#ff00ff' },
                claude: { name: 'Claude (📚)', color: '#8B4513' },
                ai: { name: 'AI', color: '#0099ff' }
            };
            
            return fallbackMapping[senderType] || defaultInfo;
            
        } catch (error) {
            console.warn('Error getting sender info:', error);
            return defaultInfo;
        }
    }

    /**
     * Formats message content (handles emojis, links, etc.)
     * @param {string} message - Raw message content
     * @returns {string} Formatted HTML message
     */
    formatMessageContent(message) {
        // Escape HTML to prevent XSS
        let formatted = this.escapeHtml(message);
        
        // Convert URLs to links
        formatted = this.convertUrlsToLinks(formatted);
        
        // Enhance emoji display
        formatted = this.enhanceEmojis(formatted);
        
        return formatted;
    }

    /**
     * Escapes HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Converts URLs to clickable links
     * @param {string} text - Text potentially containing URLs
     * @returns {string} Text with converted URLs
     */
    convertUrlsToLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    /**
     * Enhances emoji display
     * @param {string} text - Text potentially containing emojis
     * @returns {string} Text with enhanced emojis
     */
    enhanceEmojis(text) {
        // Add any emoji enhancement logic here
        return text;
    }

    /**
     * Applies special styling to messages
     * @param {HTMLElement} messageElement - Message element
     * @param {string} senderType - Type of sender
     * @param {Object} options - Styling options
     */
    applyMessageStyling(messageElement, senderType, options) {
        // Add special classes for different message types
        if (options.isSystemMessage) {
            messageElement.classList.add('system-message');
        }
        
        if (options.isImportant) {
            messageElement.classList.add('important-message');
        }
        
        if (options.isError) {
            messageElement.classList.add('error-message');
        }
        
        // Add animations
        if (options.animate !== false) {
            messageElement.classList.add('message-fade-in');
        }
    }

    /**
     * Formats timestamp for display
     * @param {Date} timestamp - Timestamp to format
     * @returns {string} Formatted timestamp
     */
    formatTimestamp(timestamp) {
        return timestamp.toLocaleTimeString('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Scrolls chat to bottom
     */
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    /**
     * Adds message to history
     * @param {string} senderType - Type of sender
     * @param {string} message - Message content
     * @param {Object} options - Additional options
     */
    addToHistory(senderType, message, options = {}) {
        this.chatHistory.push({
            senderType,
            message,
            timestamp: options.timestamp || new Date(),
            ...options
        });
    }

    /**
     * Cleans up old messages to prevent memory issues
     */
    cleanupOldMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messages = chatMessages.children;
        if (messages.length > this.maxChatMessages) {
            const toRemove = messages.length - this.maxChatMessages;
            for (let i = 0; i < toRemove; i++) {
                chatMessages.removeChild(messages[0]);
            }
        }
        
        // Also cleanup history
        if (this.chatHistory.length > this.maxChatMessages) {
            this.chatHistory = this.chatHistory.slice(-this.maxChatMessages);
        }
    }

    /**
     * Clears all chat messages
     */
    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        this.chatHistory = [];
    }

    /**
     * Gets chat history
     * @returns {Array} Chat history array
     */
    getChatHistory() {
        return [...this.chatHistory];
    }

    /**
     * Sets maximum number of chat messages to keep
     * @param {number} max - Maximum number of messages
     */
    setMaxMessages(max) {
        this.maxChatMessages = Math.max(10, max);
    }
}
