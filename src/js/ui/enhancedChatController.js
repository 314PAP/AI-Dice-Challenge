/**
 * Enhanced Chat Controller
 * Jednoduché API pro zprávy v chatu
 */

/**
 * Simple chat controller
 */
export class EnhancedChatController {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendMessageBtn');
    }
    
    initialize() {
        console.log('💬 Inicializace Enhanced Chat Controller...');
        this.setupEventListeners();
        return this;
    }
    
    setupEventListeners() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    sendMessage() {
        const message = this.chatInput?.value.trim();
        if (message) {
            this.addMessage('human', message);
            this.chatInput.value = '';
        }
    }
    
    addMessage(sender, message) {
        if (!this.chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${sender}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <strong>${this.getSenderName(sender)}:</strong> ${message}
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    getSenderName(sender) {
        const names = {
            human: 'Vy',
            gemini: 'Gemini',
            chatgpt: 'ChatGPT',
            claude: 'Claude',
            system: 'Systém'
        };
        return names[sender] || sender;
    }
}

// Globální instance pro legacy kompatibilitu
let globalChatController = null;

/**
 * Legacy inicializační funkce
 */
export function initializeChat() {
    if (!globalChatController) {
        globalChatController = new EnhancedChatController();
        globalChatController.initialize();
    }
    return globalChatController;
}

/**
 * Legacy globální funkce
 */
export function getChatController() {
    return globalChatController || initializeChat();
}

console.log('� Enhanced Chat Controller loaded');
