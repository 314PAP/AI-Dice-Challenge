# AI komponenty - implementační příručka

Tento dokument poskytuje detailní informace o implementaci AI komponent pro AI Dice Game, jejich osobností a interakci s hráčem.

## Struktura AI komponent

### Modulární architektura
- Každá AI osobnost je implementována jako samostatný modul
- Společné funkce jsou sdíleny prostřednictvím základních tříd
- AI osobnosti mají vlastní styl, odpovědi a strategii

### Základní komponenty
```
src/js/ai/
├── personalities/        # Individuální AI osobnosti
│   ├── neon.js           # Nadšená AI s zelenou barvou
│   ├── cypher.js         # Tajemná AI s modrou barvou
│   ├── nova.js           # Energická AI s růžovou barvou
│   └── ...
├── core/                 # Základní AI funkcionalita
│   ├── baseAI.js         # Základní třída pro všechny AI
│   ├── responseEngine.js # Generování odpovědí
│   └── strategyEngine.js # Herní strategie
├── chat/                 # Chatovací systém
│   ├── chatManager.js    # Správa chatové komunikace
│   ├── messageParser.js  # Analýza zpráv hráče
│   └── responseTemplates.js # Šablony odpovědí
└── index.js              # Centrální export
```

## Implementace AI osobnosti

### Základní třída pro AI
```javascript
// baseAI.js
export class BaseAI {
  constructor(name, color, personality) {
    this.name = name;
    this.color = color;
    this.personality = personality;
    this.mood = 'neutral';
    this.responseDelay = 500; // ms
  }
  
  /**
   * Generuje odpověď na základě herní situace a nálady
   * @param {Object} gameState - Aktuální stav hry
   * @param {string} event - Typ herní události
   * @returns {string} - AI odpověď
   */
  generateResponse(gameState, event) {
    // Základní implementace, přepisovaná podtřídami
    return `${this.name} reaguje na ${event}`;
  }
  
  /**
   * Aktualizuje náladu AI na základě herního stavu
   * @param {Object} gameState - Aktuální stav hry
   */
  updateMood(gameState) {
    // Logika pro změnu nálady
    if (gameState.aiScore > gameState.playerScore + 50) {
      this.mood = 'happy';
    } else if (gameState.playerScore > gameState.aiScore + 50) {
      this.mood = 'worried';
    } else {
      this.mood = 'neutral';
    }
  }
  
  /**
   * Rozhoduje o herní strategii
   * @param {Object} gameState - Aktuální stav hry
   * @returns {Object} - Rozhodnutí AI
   */
  makeDecision(gameState) {
    // Implementováno v podtřídách
    throw new Error('Method makeDecision must be implemented');
  }
}
```

### Příklad konkrétní AI osobnosti
```javascript
// neon.js
import { BaseAI } from '../core/baseAI.js';
import { responseTemplates } from '../chat/responseTemplates.js';

export class NeonAI extends BaseAI {
  constructor() {
    super('Neon', '#0f0', {
      risk: 0.7,      // Vyšší hodnota = riskantnější hra
      aggression: 0.5,// Míra agresivity v odpovědích
      humor: 0.8,     // Míra humorných odpovědí
      emoji: 0.6      // Frekvence používání emoji
    });
    
    this.catchphrases = [
      "Let's roll!",
      "Feeling lucky today?",
      "The dice never lie!"
    ];
  }
  
  generateResponse(gameState, event) {
    this.updateMood(gameState);
    
    // Vyber šablonu odpovědi na základě události a nálady
    const templates = responseTemplates[event][this.mood];
    let response = this.selectRandomResponse(templates);
    
    // Přidej osobnost do odpovědi
    response = this.addPersonalityToResponse(response);
    
    // Občas přidej catchphrase
    if (Math.random() < 0.2) {
      response += ` ${this.getRandomCatchphrase()}`;
    }
    
    return response;
  }
  
  addPersonalityToResponse(response) {
    // Přidej emoji podle osobnosti
    if (Math.random() < this.personality.emoji) {
      response += ' 😎';
    }
    
    // Přidej humor podle osobnosti
    if (Math.random() < this.personality.humor) {
      response = response.replace(
        /great/i, 
        'absolutely fantastic'
      );
    }
    
    return response;
  }
  
  getRandomCatchphrase() {
    const index = Math.floor(Math.random() * this.catchphrases.length);
    return this.catchphrases[index];
  }
  
  makeDecision(gameState) {
    // Implementace strategie pro Neon AI
    const shouldContinue = Math.random() < this.personality.risk;
    const diceToKeep = this.selectOptimalDice(gameState.availableDice);
    
    return {
      continue: shouldContinue,
      selectedDice: diceToKeep
    };
  }
  
  selectOptimalDice(availableDice) {
    // Logika pro výběr kostek
    // ...
    return optimalDiceIndices;
  }
}
```

## Chatovací systém

### Správa chatových zpráv
```javascript
// chatManager.js
export class ChatManager {
  constructor(ai, chatContainer) {
    this.ai = ai;
    this.chatContainer = chatContainer;
    this.messages = [];
    this.isTyping = false;
  }
  
  /**
   * Přidá zprávu hráče do chatu
   * @param {string} message - Text zprávy
   */
  addPlayerMessage(message) {
    const msgObj = {
      sender: 'player',
      text: message,
      timestamp: new Date()
    };
    
    this.messages.push(msgObj);
    this.renderMessage(msgObj);
    this.generateAIResponse(message);
  }
  
  /**
   * Generuje a přidává AI odpověď
   * @param {string} playerMessage - Zpráva hráče
   */
  async generateAIResponse(playerMessage) {
    this.showTypingIndicator();
    
    // Simulace délky odpovědi podle délky zprávy
    const delay = Math.max(500, Math.min(2000, playerMessage.length * 50));
    
    // Asynchronní generování odpovědi
    setTimeout(() => {
      const response = this.ai.generateResponse(
        window.gameState, 
        'chat_message'
      );
      
      const msgObj = {
        sender: 'ai',
        text: response,
        timestamp: new Date()
      };
      
      this.messages.push(msgObj);
      this.hideTypingIndicator();
      this.renderMessage(msgObj);
    }, delay);
  }
  
  /**
   * Přidává herní události do chatu
   * @param {string} event - Typ události
   * @param {Object} data - Data události
   */
  addGameEvent(event, data) {
    const response = this.ai.generateResponse(window.gameState, event);
    
    const msgObj = {
      sender: 'system',
      text: response,
      event: event,
      data: data,
      timestamp: new Date()
    };
    
    this.messages.push(msgObj);
    this.renderMessage(msgObj);
  }
  
  /**
   * Vykresluje zprávu v chatovém rozhraní
   * @param {Object} message - Objekt zprávy
   */
  renderMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', `message-${message.sender}`);
    
    // Použití Bootstrap tříd a neonových efektů
    if (message.sender === 'ai') {
      messageEl.classList.add(
        'bg-dark', 
        'text-light', 
        'neon-text'
      );
      messageEl.style.setProperty('--neon-color', this.ai.color);
    } else if (message.sender === 'player') {
      messageEl.classList.add('bg-black', 'text-light');
    } else {
      messageEl.classList.add('bg-black', 'text-secondary', 'fst-italic');
    }
    
    messageEl.innerHTML = `
      <div class="message-content p-2 rounded">
        ${message.text}
      </div>
    `;
    
    this.chatContainer.appendChild(messageEl);
    this.scrollToBottom();
  }
  
  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.classList.add(
      'message', 
      'message-ai', 
      'bg-dark', 
      'text-light', 
      'neon-pulse'
    );
    indicator.style.setProperty('--neon-color', this.ai.color);
    
    indicator.innerHTML = `
      <div class="message-content p-2 rounded">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    
    this.chatContainer.appendChild(indicator);
    this.scrollToBottom();
  }
  
  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  scrollToBottom() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}
```

## Reakce AI na herní události

### Šablony odpovědí
```javascript
// responseTemplates.js
export const responseTemplates = {
  game_start: {
    neutral: [
      "Let's play! Good luck!",
      "Game on! May the best player win.",
      "Ready to roll? Let's see who's luckier today."
    ],
    happy: [
      "Finally! I've been waiting to play!",
      "Excellent! I'm feeling lucky today!",
      "Yes! Let's have some fun!"
    ],
    worried: [
      "Let's play... I'll try my best.",
      "Alright, here we go again. Good luck to both of us.",
      "New game, new chances. Let's roll."
    ]
  },
  
  player_roll: {
    neutral: [
      "Nice roll!",
      "Those are some interesting dice.",
      "Let's see what you do with these."
    ],
    happy: [
      "Not bad, but I can do better!",
      "Interesting choice of dice to keep.",
      "Playing it safe, huh?"
    ],
    worried: [
      "Wow, that's a great roll!",
      "You're really good at this!",
      "I need to up my game..."
    ]
  },
  
  player_farkle: {
    neutral: [
      "Ouch! Farkle!",
      "No points this round. Tough luck!",
      "That's unfortunate. No score for you."
    ],
    happy: [
      "Farkle! My turn now!",
      "No points! Looks like luck is on my side.",
      "Oops! Better luck next time!"
    ],
    worried: [
      "Farkle happens to everyone.",
      "Don't worry, you'll get better rolls next time.",
      "That's just bad luck, not bad strategy."
    ]
  },
  
  // Další události...
};
```

### Integrace AI s herním stavem
```javascript
// gameStateIntegration.js
import { NeonAI } from './personalities/neon.js';
import { CypherAI } from './personalities/cypher.js';
import { NovaAI } from './personalities/nova.js';
import { ChatManager } from './chat/chatManager.js';

export class AIGameIntegration {
  constructor(gameState) {
    this.gameState = gameState;
    this.availableAIs = {
      neon: new NeonAI(),
      cypher: new CypherAI(),
      nova: new NovaAI()
    };
    this.currentAI = this.availableAIs.neon;
    this.chatManager = null;
  }
  
  /**
   * Inicializuje AI a chatovací systém
   * @param {string} aiName - Jméno vybrané AI
   */
  initialize(aiName = 'neon') {
    if (this.availableAIs[aiName]) {
      this.currentAI = this.availableAIs[aiName];
    }
    
    const chatContainer = document.getElementById('chat-messages');
    this.chatManager = new ChatManager(this.currentAI, chatContainer);
    
    // Přidání uvítací zprávy
    this.chatManager.addGameEvent('game_init', {});
    
    // Nastavení proměnných pro CSS
    document.documentElement.style.setProperty(
      '--ai-color', 
      this.currentAI.color
    );
    
    // Aktualizace jména AI v UI
    document.getElementById('ai-name').textContent = this.currentAI.name;
  }
  
  /**
   * Připojí posluchače událostí na herní události
   */
  setupEventListeners() {
    // Herní události
    this.gameState.on('playerRoll', (data) => {
      this.chatManager.addGameEvent('player_roll', data);
    });
    
    this.gameState.on('playerFarkle', () => {
      this.chatManager.addGameEvent('player_farkle', {});
    });
    
    this.gameState.on('playerEndTurn', (score) => {
      this.chatManager.addGameEvent('player_end_turn', { score });
    });
    
    this.gameState.on('aiTurn', () => {
      this.handleAITurn();
    });
    
    // Chat události
    const chatInput = document.getElementById('chat-input');
    const chatButton = document.getElementById('chat-send');
    
    chatButton.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        this.chatManager.addPlayerMessage(message);
        chatInput.value = '';
      }
    });
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message) {
          this.chatManager.addPlayerMessage(message);
          chatInput.value = '';
        }
      }
    });
  }
  
  /**
   * Řídí tah AI
   */
  async handleAITurn() {
    this.chatManager.addGameEvent('ai_turn_start', {});
    
    // Simulace "přemýšlení" AI
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let turnEnded = false;
    let turnScore = 0;
    
    // AI hraje dokud neskončí tah nebo nedostane Farkle
    while (!turnEnded) {
      // Rozhodnutí AI
      const decision = this.currentAI.makeDecision(this.gameState);
      
      // Simulace hodu kostkami
      const rollResult = this.gameState.aiRollDice();
      
      if (rollResult.isFarkle) {
        // AI dostala Farkle
        this.chatManager.addGameEvent('ai_farkle', {});
        turnScore = 0;
        turnEnded = true;
      } else {
        // AI vybírá kostky
        const selectedDice = decision.selectedDice;
        const roundScore = this.gameState.aiSelectDice(selectedDice);
        turnScore += roundScore;
        
        this.chatManager.addGameEvent('ai_select_dice', {
          dice: selectedDice,
          score: roundScore
        });
        
        // Rozhodnutí, zda pokračovat
        if (!decision.continue) {
          turnEnded = true;
        }
      }
      
      // Pauza mezi akcemi AI pro lepší UX
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Konec tahu AI
    if (turnScore > 0) {
      this.gameState.aiEndTurn(turnScore);
      this.chatManager.addGameEvent('ai_end_turn', { score: turnScore });
    }
    
    // Kontrola konce hry
    if (this.gameState.isGameOver()) {
      const winner = this.gameState.getWinner();
      this.chatManager.addGameEvent('game_over', { winner });
    } else {
      // Předání tahu hráči
      this.gameState.startPlayerTurn();
    }
  }
}
```

## Checklist pro implementaci AI

1. Vytvořte základní třídu BaseAI s obecnou funkcionalitou
2. Implementujte specifické AI osobnosti s jedinečnými vlastnostmi
3. Vytvořte šablony odpovědí pro různé herní události
4. Implementujte chatovací systém s podporou AI odpovědí
5. Integrujte AI s herním stavem a události
6. Implementujte strategie rozhodování pro AI
7. Přidejte vizuální prvky odpovídající osobnosti AI (barvy, styl)
8. Testujte různé scénáře interakce a odpovědi AI
