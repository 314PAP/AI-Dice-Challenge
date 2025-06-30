/**
 * Chat Input Handler
 * Handles user input and message sending
 */

export class ChatInputHandler {
    constructor(messageHandler, aiResponseHandler) {
        this.messageHandler = messageHandler;
        this.aiResponseHandler = aiResponseHandler;
        this.inputHistory = [];
        this.historyIndex = -1;
        this.isProcessing = false;
    }

    /**
     * Sets up event listeners for chat input
     */
    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
            chatInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
            chatInput.addEventListener('input', (e) => this.handleInput(e));
        }
        
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => this.sendMessage());
        }
    }

    /**
     * Handles key press events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    /**
     * Handles key down events for input history navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        const chatInput = event.target;
        
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.navigateHistory(-1, chatInput);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory(1, chatInput);
                break;
            case 'Escape':
                chatInput.value = '';
                this.historyIndex = -1;
                break;
        }
    }

    /**
     * Handles input events for real-time feedback
     * @param {InputEvent} event - Input event
     */
    handleInput(event) {
        const message = event.target.value;
        
        // Update send button state
        this.updateSendButtonState(message);
        
        // Show typing indicator if needed
        this.handleTypingIndicator(message);
    }

    /**
     * Sends a message from the user
     */
    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message || this.isProcessing) return;
        
        try {
            this.isProcessing = true;
            this.updateSendButtonState('', true);
            
            // Add to input history
            this.addToInputHistory(message);
            
            // Clear input
            chatInput.value = '';
            this.historyIndex = -1;
            
            // Display user message
            this.messageHandler.addMessage('human', message);
            
            // Generate AI responses
            await this.aiResponseHandler.generateResponses(message);
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.messageHandler.addMessage('system', 'Chyba při odesílání zprávy.', {
                isError: true
            });
        } finally {
            this.isProcessing = false;
            this.updateSendButtonState('');
        }
    }

    /**
     * Navigates through input history
     * @param {number} direction - Direction to navigate (-1 for up, 1 for down)
     * @param {HTMLInputElement} chatInput - Chat input element
     */
    navigateHistory(direction, chatInput) {
        if (this.inputHistory.length === 0) return;
        
        const newIndex = this.historyIndex + direction;
        
        if (newIndex >= -1 && newIndex < this.inputHistory.length) {
            this.historyIndex = newIndex;
            
            if (this.historyIndex === -1) {
                chatInput.value = '';
            } else {
                chatInput.value = this.inputHistory[this.inputHistory.length - 1 - this.historyIndex];
            }
            
            // Move cursor to end
            setTimeout(() => {
                chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
            }, 0);
        }
    }

    /**
     * Adds message to input history
     * @param {string} message - Message to add
     */
    addToInputHistory(message) {
        // Avoid duplicates
        if (this.inputHistory[this.inputHistory.length - 1] !== message) {
            this.inputHistory.push(message);
            
            // Limit history size
            if (this.inputHistory.length > 50) {
                this.inputHistory.shift();
            }
        }
    }

    /**
     * Updates send button state
     * @param {string} message - Current input message
     * @param {boolean} isProcessing - Whether processing is in progress
     */
    updateSendButtonState(message, isProcessing = false) {
        const sendButton = document.getElementById('sendMessageBtn');
        if (!sendButton) return;
        
        const hasMessage = message.trim().length > 0;
        const canSend = hasMessage && !isProcessing;
        
        sendButton.disabled = !canSend;
        sendButton.textContent = isProcessing ? '⏳' : '📤';
        
        // Update styling
        if (canSend) {
            sendButton.classList.add('enabled');
            sendButton.classList.remove('disabled');
        } else {
            sendButton.classList.remove('enabled');
            sendButton.classList.add('disabled');
        }
    }

    /**
     * Shows/hides typing indicator
     * @param {string} message - Current input message
     */
    handleTypingIndicator(message) {
        // This could be enhanced to show a typing indicator
        // For now, we just update the send button
        this.updateSendButtonState(message);
    }

    /**
     * Programmatically sends a message (for testing or automation)
     * @param {string} message - Message to send
     */
    async sendProgrammaticMessage(message) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = message;
            await this.sendMessage();
        }
    }

    /**
     * Clears input history
     */
    clearInputHistory() {
        this.inputHistory = [];
        this.historyIndex = -1;
    }

    /**
     * Gets input history
     * @returns {Array} Input history array
     */
    getInputHistory() {
        return [...this.inputHistory];
    }

    /**
     * Sets processing state
     * @param {boolean} processing - Whether processing is active
     */
    setProcessing(processing) {
        this.isProcessing = processing;
        this.updateSendButtonState(
            document.getElementById('chatInput')?.value || '',
            processing
        );
    }
}
