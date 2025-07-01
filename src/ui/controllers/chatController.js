/**
 * Chat Functionality Controller
 * Handles chat interface, message sending, and AI responses
 */

export class ChatController {
    constructor() {
        this.messageHistory = [];
    }

    /**
     * Nastavuje chat funkcionalita
     */
    setupChatFunctionality() {
        const sendBtn = document.getElementById('sendMessageBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', () => {
                this.handleSendMessage(chatInput);
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSendMessage(chatInput);
                }
            });
        }
    }

    /**
     * Handles sending chat message
     * @param {HTMLElement} chatInput - Chat input element
     */
    handleSendMessage(chatInput) {
        const message = chatInput.value.trim();
        if (message) {
            this.addChatMessage('Vy', message);
            chatInput.value = '';
            
            // Store message in history
            this.messageHistory.push({
                sender: 'human',
                message: message,
                timestamp: new Date()
            });
            
            // Simulate AI response
            this.triggerAIResponse(message);
        }
    }

    /**
     * Triggers AI response to human message
     * @param {string} humanMessage - Human message to respond to
     */
    triggerAIResponse(humanMessage) {
        setTimeout(() => {
            const responses = [
                '📊 Zajímavá statistika! Analyzuji data...',
                '⚡ O tom právě mluvím! Připrav se na porážku!',
                '🧘 Zamysli se nad hlubším významem své strategie...',
                '🎲 Nech kostky rozhodnout o tvém osudu!',
                '🤖 Processing your request... Error: Human logic not found!',
                '💎 Moudrost se skrývá v jednoduchosti...',
                '🔥 That\'s what I\'m talking about! Game on!',
                '📈 Podle mých výpočtů máš 42% šanci na úspěch...'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const aiNames = ['Gemini', 'ChatGPT', 'Claude'];
            const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
            
            this.addChatMessage(randomAI, randomResponse);
            
            // Store AI response in history
            this.messageHistory.push({
                sender: randomAI.toLowerCase(),
                message: randomResponse,
                timestamp: new Date(),
                isResponse: true,
                originalMessage: humanMessage
            });
        }, 1000 + Math.random() * 1000);
    }

    /**
     * Přidá zprávu do chatu
     * @param {string} sender - Sender name
     * @param {string} message - Message content
     */
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${sender}</span>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Clears chat history
     */
    clearChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        this.messageHistory = [];
    }

    /**
     * Gets chat message history
     * @returns {Array} Message history array
     */
    getMessageHistory() {
        return this.messageHistory;
    }

    /**
     * Exports chat history to JSON
     * @returns {string} JSON string of chat history
     */
    exportChatHistory() {
        return JSON.stringify(this.messageHistory, null, 2);
    }

    /**
     * Loads chat history from storage
     */
    loadChatHistory() {
        const stored = localStorage.getItem('diceGameChatHistory');
        if (stored) {
            try {
                this.messageHistory = JSON.parse(stored);
                this.renderStoredMessages();
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }

    /**
     * Saves chat history to storage
     */
    saveChatHistory() {
        localStorage.setItem('diceGameChatHistory', JSON.stringify(this.messageHistory));
    }

    /**
     * Renders stored messages in chat UI
     */
    renderStoredMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages || this.messageHistory.length === 0) return;
        
        chatMessages.innerHTML = '';
        
        this.messageHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${msg.sender}</span>
                    <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="message-content">${msg.message}</div>
            `;
            chatMessages.appendChild(messageDiv);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Sends system message
     * @param {string} message - System message
     */
    sendSystemMessage(message) {
        this.addChatMessage('Systém', message);
        
        this.messageHistory.push({
            sender: 'system',
            message: message,
            timestamp: new Date(),
            isSystem: true
        });
    }

    /**
     * Auto-save chat history periodically
     */
    enableAutoSave() {
        setInterval(() => {
            this.saveChatHistory();
        }, 30000); // Save every 30 seconds
    }
}

// Export singleton instance
export const chatController = new ChatController();
