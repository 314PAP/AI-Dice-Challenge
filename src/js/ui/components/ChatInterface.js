/**
 * ChatInterface.js
 * Komponenta pro správu chatovacího rozhraní
 */

export class ChatInterface {
  /**
   * @param {Object} config - Konfigurace chatovacího rozhraní
   * @param {string} config.chatContainerId - ID kontejneru pro chat
   * @param {string} config.messagesContainerId - ID kontejneru pro zprávy
   * @param {string} config.inputId - ID vstupního pole
   * @param {string} config.sendButtonId - ID tlačítka pro odeslání zprávy
   */
  constructor(config) {
    this.config = config;
    this.chatContainer = document.getElementById(config.chatContainerId);
    this.messagesContainer = document.getElementById(config.messagesContainerId);
    this.input = document.getElementById(config.inputId);
    this.sendButton = document.getElementById(config.sendButtonId);
    
    this.init();
  }
  
  /**
   * Inicializace chatu
   */
  init() {
    // Nastavení event listenerů
    this.setupEventListeners();
    
    // Nastavení MutationObserver pro automatické scrollování
    this.setupAutoScroll();
    
    // Počáteční scrollování
    this.scrollToBottom();
  }
  
  /**
   * Nastavení event listenerů
   */
  setupEventListeners() {
    // Tlačítko odeslání
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Enter na vstupním poli
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }
  
  /**
   * Nastavení automatického scrollování
   */
  setupAutoScroll() {
    const observer = new MutationObserver(() => this.scrollToBottom());
    
    if (this.messagesContainer) {
      observer.observe(this.messagesContainer, { childList: true });
    }
  }
  
  /**
   * Odeslání zprávy
   */
  sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;
    
    // Vytvoření zprávy uživatele
    this.addUserMessage(message);
    
    // Vyčištění vstupu
    this.input.value = '';
    
    // Trigger pro AI odpověď
    this.triggerAIResponse(message);
  }
  
  /**
   * Přidání zprávy uživatele do chatu
   * @param {string} message - Text zprávy
   */
  addUserMessage(message) {
    const newMessage = document.createElement('div');
    newMessage.className = 'chat-message mb-2 small';
    newMessage.innerHTML = `<strong class="neon-green">Vy:</strong> <span class="neon-green">${message}</span>`;
    
    this.messagesContainer.appendChild(newMessage);
    this.scrollToBottom();
  }
  
  /**
   * Přidání zprávy systému do chatu
   * @param {string} message - Text zprávy
   */
  addSystemMessage(message) {
    const newMessage = document.createElement('div');
    newMessage.className = 'chat-message mb-2 small';
    newMessage.innerHTML = `<strong class="neon-yellow">Systém:</strong> <span class="neon-yellow">${message}</span>`;
    
    this.messagesContainer.appendChild(newMessage);
    this.scrollToBottom();
  }
  
  /**
   * Přidání zprávy AI do chatu
   * @param {string} aiName - Jméno AI (Gemini, ChatGPT, Claude)
   * @param {string} message - Text zprávy
   * @param {string} colorClass - CSS třída pro barvu (neon-blue, neon-pink, neon-orange)
   */
  addAIMessage(aiName, message, colorClass = 'neon-blue') {
    const newMessage = document.createElement('div');
    newMessage.className = 'chat-message mb-2 small';
    newMessage.innerHTML = `<strong class="${colorClass}">${aiName}:</strong> <span class="${colorClass}">${message}</span>`;
    
    this.messagesContainer.appendChild(newMessage);
    this.scrollToBottom();
  }
  
  /**
   * Spustí AI odpověď (simulace, později napojení na skutečné AI)
   * @param {string} userMessage - Zpráva od uživatele
   */
  triggerAIResponse(userMessage) {
    // Simulace odpovědi AI
    setTimeout(() => {
      const response = this.generateDemoResponse(userMessage);
      const aiName = 'Gemini';
      this.addAIMessage(aiName, response, 'neon-blue');
    }, 500);
  }
  
  /**
   * Generuje demo odpověď pro testování
   * @param {string} userMessage - Zpráva od uživatele
   * @returns {string} - Odpověď AI
   */
  generateDemoResponse(userMessage) {
    const responses = [
      'Zajímavá strategie!',
      'To je dobrý tah.',
      'Zvládáš to velmi dobře!',
      'Měl bys zkusit hodit znovu.',
      'Věřím, že máš štěstí na kostky!',
      'Opatrně, riskuješ Farkle!',
      'To je zajímavý přístup ke hře.',
      'Vsadím se, že ti padne 1 nebo 5.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  /**
   * Scrollování na konec chatu
   */
  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

/**
 * Vytvoří a inicializuje chat pro desktop i mobilní zobrazení
 */
export function initializeChats() {
  // Desktop chat
  const desktopChat = new ChatInterface({
    chatContainerId: 'chatPanel',
    messagesContainerId: 'chatMessages',
    inputId: 'chatInput',
    sendButtonId: 'sendChatBtn'
  });
  
  // Mobilní chat
  const mobileChat = new ChatInterface({
    chatContainerId: 'chatPanelMobile',
    messagesContainerId: 'chatMessagesMobile',
    inputId: 'chatInputMobile',
    sendButtonId: 'sendChatBtnMobile'
  });
  
  return { desktopChat, mobileChat };
}
