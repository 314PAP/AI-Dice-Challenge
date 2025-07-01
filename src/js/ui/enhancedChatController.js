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
        this.chatPanel = document.getElementById('chatPanel');
        this.chatToggle = document.getElementById('chatToggle');
        this.isCollapsed = false;
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
        
        if (this.chatToggle) {
            this.chatToggle.addEventListener('click', () => this.toggleChat());
        }
    }
    
    toggleChat() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.chatPanel) {
            if (this.isCollapsed) {
                this.chatPanel.classList.add('collapsed');
                this.chatToggle.textContent = '+';
                this.chatToggle.title = 'Rozbalit chat';
            } else {
                this.chatPanel.classList.remove('collapsed');
                this.chatToggle.textContent = '−';
                this.chatToggle.title = 'Sbalit chat';
            }
        }
    }
    
    sendMessage() {
        const message = this.chatInput?.value.trim();
        if (message) {
            this.addMessage('human', message);
            this.chatInput.value = '';
            
            // Simulace AI odpovědi po chvilce
            setTimeout(() => {
                this.generateAIResponse(message);
            }, 1000 + Math.random() * 2000);
        }
    }
    
    generateAIResponse(userMessage) {
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const randomAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const responses = {
            gemini: ['Analýza dokončena! 🔍', 'Zajímavé pozorování...', 'Data potvrzují trend.', 'Probabilisticky výhodné!'],
            chatgpt: ['Super zpráva! 😄', 'To je zajímavé! 🤔', 'Skvělý nápad! 💡', 'Hmm, zkusme to! 🎯'],
            claude: ['Moudrá úvaha...', 'Přemýšlím o tom.', 'Strategicky zajímavé.', 'Uvážlivě řečeno.']
        };
        
        const aiResponses = responses[randomAI];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        this.addMessage(randomAI, randomResponse);
    }
    
    addMessage(sender, message) {
        if (!this.chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
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
