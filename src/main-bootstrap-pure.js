/**
 * 🎲 AI Dice Challenge - Bootstrap Pure Edition
 * Kompletně přepsaná verze s 100% Bootstrap přístupem
 */

console.log('🎲 AI Dice Challenge - Bootstrap Pure Edition starting...');

class BootstrapDiceGame {
    constructor() {
        this.gameState = {
            gameStarted: false,
            players: [
                { name: 'Hráč', score: 0, isHuman: true },
                { name: 'AI Gemini', score: 0, isHuman: false },
                { name: 'AI ChatGPT', score: 0, isHuman: false },
                { name: 'AI Claude', score: 0, isHuman: false }
            ],
            currentPlayerIndex: 0,
            targetScore: 10000
        };
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
                { id: 'gameContent', file: '/src/templates/game-menu-simple.html' },
                { id: 'gameMobileContent', file: '/src/templates/game-menu-mobile-simple.html' },
                { id: 'chatPanel', file: '/src/templates/chat-simple.html' },
                { id: 'chatPanelMobileContainer', file: '/src/templates/chat-mobile-simple.html' }
            ];

            // Načtení všech šablon
            for (const template of templates) {
                try {
                    console.log(`📄 Loading template: ${template.file}`);
                    const html = await this.loadTemplate(template.file);
                    const container = document.getElementById(template.id);
                    if (container) {
                        container.innerHTML = html;
                        console.log(`✅ Template ${template.file} loaded into ${template.id}`);
                    } else {
                        console.warn(`⚠️ Container ${template.id} not found for template ${template.file}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to load template ${template.file}:`, error);
                }
            }

            // Nastavení event listenerů
            this.setupEventListeners();

            // Přidání uvítacích zpráv do chatu
            setTimeout(() => {
                this.addChatMessage('Systém', 'Vítejte v AI Kostkové Výzvě! 🎲', 'system');
                this.addChatMessage('Gemini', 'Připrav se na porážku! 😏', 'ai');
                this.addChatMessage('ChatGPT', 'Opravdu si myslíš, že nás porazíš? 💅', 'ai');
                this.addChatMessage('Claude', 'Tvoje šance jsou docela malé! 😈', 'ai');
            }, 1000);

            this.initialized = true;
            console.log('✅ Application initialized');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Chyba při načítání aplikace. Zkuste obnovit stránku.');
        }
    }

    // Nastavení event listenerů
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Delegování událostí na document pro všechny tlačítka
        document.addEventListener('click', (e) => {
            // Start Game Button
            if (e.target.id === 'startGameBtn' || e.target.closest('#startGameBtn')) {
                this.startGame();
            }
            
            // Start Game Button Mobile
            if (e.target.id === 'startGameBtnMobile' || e.target.closest('#startGameBtnMobile')) {
                this.startGame();
            }
            
            // Rules Button
            if (e.target.id === 'rulesBtn' || e.target.closest('#rulesBtn')) {
                this.showRules();
            }
            
            // Rules Button Mobile
            if (e.target.id === 'rulesBtnMobile' || e.target.closest('#rulesBtnMobile')) {
                this.showRules();
            }
            
            // Hall of Fame Button
            if (e.target.id === 'hallOfFameBtn' || e.target.closest('#hallOfFameBtn')) {
                this.showHallOfFame();
            }
            
            // Hall of Fame Button Mobile
            if (e.target.id === 'hallOfFameBtnMobile' || e.target.closest('#hallOfFameBtnMobile')) {
                this.showHallOfFame();
            }
            
            // Chat Send Buttons
            if (e.target.id === 'sendChatBtn' || e.target.closest('#sendChatBtn')) {
                this.sendChatMessage();
            }
            
            if (e.target.id === 'sendChatBtnMobile' || e.target.closest('#sendChatBtnMobile')) {
                this.sendChatMessage();
            }
            
            // Score adjustment buttons
            if (e.target.id === 'scoreUpBtn' || e.target.closest('#scoreUpBtn')) {
                this.adjustTargetScore(1000);
            }
            
            if (e.target.id === 'scoreDownBtn' || e.target.closest('#scoreDownBtn')) {
                this.adjustTargetScore(-1000);
            }
        });

        // Enter key v chat inputech
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.id === 'chatInput' || e.target.id === 'chatInputMobile') {
                    this.sendChatMessage();
                }
            }
        });
    }

    // Úprava cílového skóre
    adjustTargetScore(amount) {
        const inputs = ['targetScoreInput', 'targetScoreInputMobile'];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                let newValue = parseInt(input.value) + amount;
                
                // Minimum 1000
                if (newValue < 1000) {
                    newValue = 1000;
                }
                
                // Maximum 100000
                if (newValue > 100000) {
                    newValue = 100000;
                }
                
                input.value = newValue;
                this.gameState.targetScore = newValue;
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
                this.addChatMessage('Hráč', message, 'user');
                input.value = '';
                
                // Simulace AI odpovědi
                setTimeout(() => {
                    this.addAIResponse(message);
                }, 1000 + Math.random() * 2000);
            }
        });
    }

    // Přidání zprávy do chatu s animate.css animacemi
    addChatMessage(sender, message, type = 'user') {
        const chatContainers = ['chatMessages', 'chatMessagesMobile'];
        
        chatContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const messageDiv = document.createElement('div');
                
                // Určení barvy podle odesílatele
                let colorClass = 'text-neon-green'; // default pro hráče
                
                if (sender === 'Systém') {
                    colorClass = 'text-neon-yellow';
                } else if (sender === 'Gemini') {
                    colorClass = 'text-neon-blue';
                } else if (sender === 'ChatGPT') {
                    colorClass = 'text-neon-pink';
                } else if (sender === 'Claude') {
                    colorClass = 'text-neon-orange';
                }
                
                messageDiv.className = `mb-2 p-2 border border-secondary rounded animate__animated animate__fadeInUp ${colorClass}`;
                messageDiv.innerHTML = `
                    <div class="fw-bold">${sender}:</div>
                    <div>${message}</div>
                `;
                
                container.appendChild(messageDiv);
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    // Simulace AI odpovědi na hráčovu zprávu
    addAIResponse(userMessage) {
        const responses = [
            'To je zajímavé! 🤔',
            'Haha, uvidíme! 😄',
            'Máš pravdu... nebo ne? 🤭',
            'Costky rozhodnou! 🎲',
            'Příprav se na překvapení! ⚡',
            'Tvoje taktika je... zajímavá. 🎯'
        ];
        
        const aiNames = ['Gemini', 'ChatGPT', 'Claude'];
        const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        this.addChatMessage(randomAI, randomResponse, 'ai');
    }

    // Spuštění hry
    async startGame() {
        try {
            console.log('🎮 Starting game...');
            this.gameState.gameStarted = true;
            
            // Aktualizace target score z inputu
            const targetInput = document.getElementById('targetScoreInput') || document.getElementById('targetScoreInputMobile');
            if (targetInput) {
                this.gameState.targetScore = parseInt(targetInput.value);
            }
            
            this.addChatMessage('Systém', `🎮 Hra začala! Cíl: ${this.gameState.targetScore} bodů!`, 'system');
            
            // TODO: Implementovat herní logiku
            this.showNotification('Herní logika bude implementována...', 'info');
            
        } catch (error) {
            console.error('❌ Failed to start game:', error);
            this.showError('Chyba při spuštění hry');
        }
    }

    // Zobrazení pravidel
    showRules() {
        this.showNotification('Pravidla se načítají...', 'info');
        // TODO: Implementovat modal s pravidly
    }

    // Zobrazení Hall of Fame
    showHallOfFame() {
        this.showNotification('Síň slávy se načítá...', 'info');
        // TODO: Implementovat modal se síní slávy
    }

    // Zobrazení notifikace
    showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        // Vytvoření Bootstrap toast notifikace
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type === 'info' ? 'primary' : type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Odstranění po skrytí
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Vytvoření kontejneru pro toast notifikace
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1200';
        document.body.appendChild(container);
        return container;
    }

    // Zobrazení chyby
    showError(message) {
        this.showNotification(message, 'danger');
    }
}

// Inicializace aplikace
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Initializing Bootstrap Dice Game...');
        const game = new BootstrapDiceGame();
        await game.initialize();
        
        // Globální dostupnost pro debugging
        window.game = game;
        
        console.log('✅ Bootstrap dice game initialized successfully!');
    } catch (error) {
        console.error('❌ Failed to initialize bootstrap dice game:', error);
    }
});

export default BootstrapDiceGame;
