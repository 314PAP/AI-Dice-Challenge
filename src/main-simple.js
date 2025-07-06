/**
 * 🎲 AI Dice Challenge - Simplified Main
 * Zjednodušená verze bez externích core modulů
 */

console.log('🎲 AI Dice Challenge - Starting simplified version...');

// Jednoduchá implementace bez externích závislostí
class SimpleDiceGame {
    constructor() {
        this.gameState = {
            gameStarted: false,
            gameEnded: false,
            players: [
                { name: 'Hráč', score: 0, isHuman: true },
                { name: 'AI Sarah', score: 0, isHuman: false },
                { name: 'AI Marcus', score: 0, isHuman: false },
                { name: 'AI Luna', score: 0, isHuman: false }
            ],
            currentPlayerIndex: 0,
            targetScore: 5000
        };
        
        this.templates = new Map();
        this.initialized = false;
    }

    // Jednoduchý template loader
    async loadTemplate(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return await response.text();
        } catch (error) {
            console.error('Template load error:', error);
            return `<div class="alert alert-warning">Template ${url} could not be loaded</div>`;
        }
    }

    // Inicializace aplikace
    async initialize() {
        try {
            console.log('🚀 Loading templates...');
            
            // Načtení šablon
            const templates = [
                { id: 'gameContent', file: '/src/templates/game-menu.html' },
                { id: 'gameMobileContent', file: '/src/templates/game-menu-mobile.html' },
                { id: 'chatPanel', file: '/src/templates/chat.html' },
                { id: 'chatPanelMobileContainer', file: '/src/templates/chat-mobile.html' },
                { id: 'gameControls', file: '/src/templates/game-controls.html' },
                { id: 'gameControlsMobile', file: '/src/templates/game-controls-mobile.html' }
            ];

            // Načtení všech šablon
            for (const template of templates) {
                try {
                    const html = await this.loadTemplate(template.file);
                    const container = document.getElementById(template.id);
                    if (container) {
                        container.innerHTML = html;
                    }
                } catch (error) {
                    console.error(`Failed to load template ${template.file}:`, error);
                }
            }

            // Načtení modálů
            await this.loadModals();

            // Nastavení event listenerů
            this.setupEventListeners();

            // Inicializace AOS (pokud je dostupná)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out'
                });
            }

            // Přidání uvítací zprávy do chatu
            setTimeout(() => {
                this.addChatMessage('AI Sarah', 'Vítej v AI Kostkové Výzvě! 🎲 Jsem připravena na souboj!', 'ai');
            }, 1000);

            this.initialized = true;
            console.log('✅ Application initialized');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Chyba při načítání aplikace. Zkuste obnovit stránku.');
        }
    }

    // Načtení modálů
    async loadModals() {
        const modals = [
            '/src/templates/modals/rules-modal.html',
            '/src/templates/modals/hall-of-fame-modal.html',
            '/src/templates/modals/game-over-modal.html'
        ];

        const container = document.getElementById('modalsContainer') || document.body;
        
        for (const modal of modals) {
            try {
                const html = await this.loadTemplate(modal);
                container.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                console.error(`Failed to load modal ${modal}:`, error);
            }
        }
    }

    // Nastavení event listenerů
    setupEventListeners() {
        // Delegování událostí na document
        document.addEventListener('click', (e) => {
            // Start game buttons
            if (e.target.matches('#startGameBtn, #startGameBtnMobile')) {
                e.preventDefault();
                this.startGame();
            }
            
            // Quit game buttons
            if (e.target.matches('#quitGameBtn, #quitGameBtnMobile')) {
                e.preventDefault();
                this.quitGame();
            }
            
            // Hall of Fame buttons
            if (e.target.matches('#hallOfFameBtn, #hallOfFameBtnMobile')) {
                e.preventDefault();
                this.showHallOfFame();
            }
            
            // Rules buttons
            if (e.target.matches('#rulesBtn, #rulesBtnMobile')) {
                e.preventDefault();
                this.showRules();
            }
            
            // Target score arrows
            if (e.target.matches('#scoreUpBtn, #scoreUpBtnMobile')) {
                e.preventDefault();
                this.adjustTargetScore(1000);
            }
            
            if (e.target.matches('#scoreDownBtn, #scoreDownBtnMobile')) {
                e.preventDefault();
                this.adjustTargetScore(-1000);
            }
            
            // Chat send button
            if (e.target.matches('#sendMessageBtn, #sendMessageBtnMobile')) {
                e.preventDefault();
                this.sendChatMessage();
            }
            
            // Modal close buttons
            if (e.target.matches('.modal-close, .modal-overlay')) {
                this.closeModal(e.target);
            }
        });

        // Escape key pro zavření modálů
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
            
            // Enter key pro odeslání zprávy
            if (e.key === 'Enter' && e.target.matches('#chatInput, #chatInputMobile')) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Úprava cílového skóre
    adjustTargetScore(amount) {
        const inputs = ['targetScoreInput', 'targetScoreInputMobile'];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                let currentValue = parseInt(input.value) || 5000;
                let newValue = currentValue + amount;
                
                // Minimum 1000
                if (newValue < 1000) {
                    newValue = 1000;
                }
                
                // Maximum 100000
                if (newValue > 100000) {
                    newValue = 100000;
                }
                
                input.value = newValue;
            }
        });
    }

    // Odeslání chat zprávy
    sendChatMessage() {
        const inputs = ['chatInput', 'chatInputMobile'];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input && input.value.trim()) {
                const message = input.value.trim();
                
                // Přidání zprávy do chatu
                this.addChatMessage('Hráč', message, 'user');
                
                // Vymazání inputu
                input.value = '';
                
                // Simulace AI odpovědi
                setTimeout(() => {
                    this.addAIResponse(message);
                }, 500);
            }
        });
    }

    // Přidání zprávy do chatu
    addChatMessage(sender, message, type = 'user') {
        const chatContainers = ['chatMessages', 'chatMessagesMobile'];
        
        chatContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${type} mb-2`;
                
                const color = type === 'user' ? 'text-neon-green' : 'text-neon-blue';
                
                messageDiv.innerHTML = `
                    <div class="d-flex align-items-start">
                        <div class="chat-avatar me-2">
                            <span class="badge bg-secondary">${sender.charAt(0)}</span>
                        </div>
                        <div class="chat-content">
                            <div class="chat-sender ${color} fw-bold small">${sender}</div>
                            <div class="chat-text text-light">${message}</div>
                        </div>
                    </div>
                `;
                
                container.appendChild(messageDiv);
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    // Simulace AI odpovědi
    addAIResponse(userMessage) {
        const responses = [
            "Zajímavé! Co si o tom myslíš?",
            "Dobře zahráno! Pokračuj!",
            "Strategie je klíčová v této hře.",
            "Zkus to jinak, možná to bude lepší.",
            "Skvělý tah! Jsem napjatá, jak to dopadne.",
            "Hmm, to je tricky situace...",
            "Rozhodně máš talent na tuto hru!",
            "Jaký je tvůj další plán?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiNames = ['AI Sarah', 'AI Marcus', 'AI Luna'];
        const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
        
        this.addChatMessage(randomAI, randomResponse, 'ai');
    }

    // Spuštění hry
    async startGame() {
        try {
            console.log('🎮 Starting game...');
            
            // Získání cílového skóre
            const targetInput = document.getElementById('targetScoreInput') || 
                              document.getElementById('targetScoreInputMobile');
            
            if (targetInput) {
                const target = parseInt(targetInput.value) || 5000;
                this.gameState.targetScore = target;
            }
            
            // Skrytí menu
            this.hideMenus();
            
            // Zobrazení herních ovládání
            this.showGameControls();
            
            // Aktualizace stavu
            this.gameState.gameStarted = true;
            this.gameState.gameEnded = false;
            
            // Zobrazení úspěšné zprávy
            this.showNotification('Hra byla spuštěna!', 'success');
            
        } catch (error) {
            console.error('❌ Failed to start game:', error);
            this.showError('Chyba při spuštění hry');
        }
    }

    // Ukončení hry
    async quitGame() {
        try {
            console.log('🔚 Quitting game...');
            
            // Skrytí herních ovládání
            this.hideGameControls();
            
            // Zobrazení menu
            this.showMenus();
            
            // Reset stavu
            this.gameState.gameStarted = false;
            this.gameState.gameEnded = false;
            
            // Zobrazení zprávy
            this.showNotification('Hra byla ukončena', 'info');
            
        } catch (error) {
            console.error('❌ Failed to quit game:', error);
        }
    }

    // Zobrazení Hall of Fame
    showHallOfFame() {
        const modal = document.getElementById('hallOfFameModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Zobrazení pravidel
    showRules() {
        const modal = document.getElementById('rulesModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Skrytí menu
    hideMenus() {
        const elements = [
            document.getElementById('gameContent'),
            document.getElementById('gameMobileContent')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
    }

    // Zobrazení menu
    showMenus() {
        const elements = [
            document.getElementById('gameContent'),
            document.getElementById('gameMobileContent')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.remove('hidden');
        });
    }

    // Skrytí herních ovládání
    hideGameControls() {
        const elements = [
            document.getElementById('gameControls'),
            document.getElementById('gameControlsMobile')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
    }

    // Zobrazení herních ovládání
    showGameControls() {
        const elements = [
            document.getElementById('gameControls'),
            document.getElementById('gameControlsMobile')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.remove('hidden');
        });
    }

    // Zavření modálního okna
    closeModal(target) {
        const modal = target.closest('.modal-overlay');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Zavření vrchního modálního okna
    closeTopModal() {
        const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
        if (modals.length > 0) {
            modals[modals.length - 1].classList.add('hidden');
        }
    }

    // Zobrazení notifikace
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Zobrazení chyby
    showError(message) {
        this.showNotification(message, 'danger');
    }

    // Zpracování resize
    handleResize() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}

// Inicializace aplikace
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 DOM loaded, initializing simple dice game...');
    
    try {
        const game = new SimpleDiceGame();
        await game.initialize();
        
        // Zpřístupnění pro debugging
        window.simpleDiceGame = game;
        
        console.log('✅ Simple dice game initialized successfully!');
        
    } catch (error) {
        console.error('❌ Failed to initialize simple dice game:', error);
        
        // Fallback error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed top-0 start-0 w-100 text-center';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `
            <h4>❌ Chyba aplikace</h4>
            <p>Aplikace se nepodařila načíst. Zkuste obnovit stránku.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Obnovit</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
});

export default SimpleDiceGame;
