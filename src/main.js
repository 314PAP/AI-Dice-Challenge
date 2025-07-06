/**
 * 🎲 AI Dice Challenge - Main Application
 * Hlavní vstupní bod aplikace s maximálním využitím npm knihoven
 */

// Import základních knihoven
import { debounce, throttle } from 'lodash-es';
import { EventEmitter } from 'events';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import modulů aplikace
import { GameStateManager } from './core/GameStateManager.js';
import { UIManager } from './core/UIManager.js';
import { TemplateLoader } from './core/TemplateLoader.js';
import { EventManager } from './core/EventManager.js';

console.log('🎲 AI Dice Challenge - Starting application...');

/**
 * Hlavní třída aplikace
 */
class DiceGameApp {
    constructor() {
        this.gameState = new GameStateManager();
        this.uiManager = new UIManager();
        this.templateLoader = new TemplateLoader();
        this.eventManager = new EventManager();
        this.initialized = false;
    }

    /**
     * Inicializace aplikace
     */
    async initialize() {
        try {
            console.log('🚀 Initializing application...');
            
            // Načtení šablon
            await this.loadTemplates();
            
            // Inicializace UI
            await this.initializeUI();
            
            // Nastavení event listenerů
            this.setupEventListeners();
            
            // Inicializace animací
            this.initializeAnimations();
            
            this.initialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Načtení HTML šablon
     */
    async loadTemplates() {
        const templates = [
            { id: 'gameContent', file: '/src/templates/game-menu.html' },
            { id: 'gameMobileContent', file: '/src/templates/game-menu-mobile.html' },
            { id: 'chatPanel', file: '/src/templates/chat.html' },
            { id: 'chatPanelMobileContainer', file: '/src/templates/chat-mobile.html' },
            { id: 'gameControls', file: '/src/templates/game-controls.html' },
            { id: 'gameControlsMobile', file: '/src/templates/game-controls-mobile.html' }
        ];

        for (const template of templates) {
            try {
                const html = await this.templateLoader.load(template.file);
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
    }

    /**
     * Načtení modálních oken
     */
    async loadModals() {
        const modals = [
            '/src/templates/modals/rules-modal.html',
            '/src/templates/modals/hall-of-fame-modal.html',
            '/src/templates/modals/game-over-modal.html'
        ];

        const container = document.getElementById('modalsContainer') || document.body;
        
        for (const modal of modals) {
            try {
                const html = await this.templateLoader.load(modal);
                container.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                console.error(`Failed to load modal ${modal}:`, error);
            }
        }
    }

    /**
     * Inicializace UI
     */
    async initializeUI() {
        await this.uiManager.initialize();
    }

    /**
     * Nastavení event listenerů
     */
    setupEventListeners() {
        // Globální event listenery
        this.setupGlobalEvents();
        
        // Herní event listenery
        this.setupGameEvents();
        
        // UI event listenery
        this.setupUIEvents();
    }

    /**
     * Nastavení globálních event listenerů
     */
    setupGlobalEvents() {
        // Resize handler s throttle
        const resizeHandler = throttle(() => {
            this.handleResize();
        }, 100);
        
        window.addEventListener('resize', resizeHandler);
        
        // Error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event.error);
        });
    }

    /**
     * Nastavení herních event listenerů
     */
    setupGameEvents() {
        // Start game
        document.addEventListener('click', (e) => {
            if (e.target.matches('#startGameBtn, #startGameBtnMobile')) {
                this.startGame();
            }
        });

        // Quit game
        document.addEventListener('click', (e) => {
            if (e.target.matches('#quitGameBtn, #quitGameBtnMobile')) {
                this.quitGame();
            }
        });

        // Hall of Fame
        document.addEventListener('click', (e) => {
            if (e.target.matches('#hallOfFameBtn, #hallOfFameBtnMobile')) {
                this.showHallOfFame();
            }
        });

        // Rules
        document.addEventListener('click', (e) => {
            if (e.target.matches('#rulesBtn, #rulesBtnMobile')) {
                this.showRules();
            }
        });
    }

    /**
     * Nastavení UI event listenerů
     */
    setupUIEvents() {
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close, .modal-overlay')) {
                this.closeModal(e.target);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
    }

    /**
     * Inicializace animací
     */
    initializeAnimations() {
        // AOS animace
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: true,
            anchorPlacement: 'top-bottom'
        });

        // Refresh AOS po načtení šablon
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }

    /**
     * Spuštění hry
     */
    async startGame() {
        try {
            console.log('🎮 Starting game...');
            
            // Skryj menu, zobraz herní ovládání
            this.hideMenus();
            this.showGameControls();
            
            // Inicializuj herní stav
            await this.gameState.startGame();
            
            // Aktualizuj UI
            this.uiManager.updateGameDisplay();
            
        } catch (error) {
            console.error('❌ Failed to start game:', error);
        }
    }

    /**
     * Ukončení hry
     */
    async quitGame() {
        try {
            console.log('🔚 Quitting game...');
            
            // Skryj herní ovládání, zobraz menu
            this.hideGameControls();
            this.showMenus();
            
            // Reset herního stavu
            await this.gameState.resetGame();
            
            // Aktualizuj UI
            this.uiManager.updateGameDisplay();
            
        } catch (error) {
            console.error('❌ Failed to quit game:', error);
        }
    }

    /**
     * Zobrazení Hall of Fame
     */
    showHallOfFame() {
        const modal = document.getElementById('hallOfFameModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Zobrazení pravidel
     */
    showRules() {
        const modal = document.getElementById('rulesModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Skrytí menu
     */
    hideMenus() {
        const elements = [
            document.getElementById('gameContent'),
            document.getElementById('gameMobileContent')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
    }

    /**
     * Zobrazení menu
     */
    showMenus() {
        const elements = [
            document.getElementById('gameContent'),
            document.getElementById('gameMobileContent')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.remove('hidden');
        });
    }

    /**
     * Skrytí herních ovládání
     */
    hideGameControls() {
        const elements = [
            document.getElementById('gameControls'),
            document.getElementById('gameControlsMobile')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
    }

    /**
     * Zobrazení herních ovládání
     */
    showGameControls() {
        const elements = [
            document.getElementById('gameControls'),
            document.getElementById('gameControlsMobile')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.remove('hidden');
        });
    }

    /**
     * Zavření modálního okna
     */
    closeModal(target) {
        const modal = target.closest('.modal-overlay');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Zavření horního modálního okna
     */
    closeTopModal() {
        const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
        if (modals.length > 0) {
            modals[modals.length - 1].classList.add('hidden');
        }
    }

    /**
     * Zpracování resize událostí
     */
    handleResize() {
        // Refresh AOS při změně velikosti okna
        AOS.refresh();
        
        // Aktualizuj UI layout
        this.uiManager.handleResize();
    }

    /**
     * Zpracování chyb při inicializaci
     */
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Zobraz chybovou zprávu uživateli
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed top-0 start-0 w-100 text-center';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `
            <h4>❌ Chyba při načítání aplikace</h4>
            <p>Došlo k chybě při načítání hry. Zkuste obnovit stránku.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Obnovit stránku</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Zpracování globálních chyb
     */
    handleGlobalError(error) {
        console.error('Global error:', error);
        // Zde můžete implementovat reporting chyb
    }
}

// Inicializace aplikace po načtení DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 DOM loaded, initializing application...');
    
    try {
        const app = new DiceGameApp();
        await app.initialize();
        
        // Zpřístupnění pro debugging
        window.diceGame = app;
        
    } catch (error) {
        console.error('❌ Failed to initialize dice game:', error);
    }
});

export default DiceGameApp;
console.log('🔍 Document ready state:', document.readyState);

// Import UI controlleru pro řízení celé aplikace
import { setupUI } from './js/ui/uiController.js';
import { initializeGame } from './js/game/gameController.js';
import { initializeChat } from './js/ui/enhancedChatController.js';
import { setupOptimizedEvents } from './js/utils/optimizedEvents.js';
import { initializeAllEventListeners } from './js/utils/eventInitializer.js';
import { tryCatchWithLogging } from './js/utils/errorHandling.js';
import { eventBus, GAME_EVENTS } from './js/utils/eventBus.js';
import enhancedGameStarter from './js/game/enhancedGameStarter.js';
import { whenDOMReady } from './js/utils/domReadyObserver.js';

/**
 * Inicializace aplikace se spolehlivým načítáním DOM
 * Využívá observer pro zajištění, že všechny potřebné elementy jsou dostupné
 */
console.log('🔄 Inicializace aplikace se spolehlivým načítáním...');

// Použijeme whenDOMReady namísto standardního DOMContentLoaded event listeneru
whenDOMReady(() => {
    console.log('✅ DOM a všechny klíčové elementy jsou načteny, inicializuji aplikaci...');
    
    try {
        // Používáme bezpečnou funkci pro inicializaci s error handlingem
        const initializeApp = tryCatchWithLogging(() => {
            console.log('🚀 Initializing UI and Game Controllers...');
            
            // Inicializuj UI
            setupUI();
            
            // Inicializace event systému
            setupOptimizedEvents();
            
            // Registrace globálního event listeneru pro debugging
            eventBus.on(GAME_EVENTS.GAME_STARTED, data => {
                console.log('🎮 Game started with settings:', data);
            });
            
            // Inicializuj chat
            const chatController = initializeChat();
            
            // Inicializuj game controller
            initializeGame();
            
            // Zpřístupni chat globálně pro kompatibilitu - opravena signatura
            window.addChatMessage = (sender, message) => chatController.addMessage(sender, message);
            window.chatController = chatController;
            
            // Zpřístupni herní funkce globálně pro kompatibilitu
            window.selectDie = async (index) => {
                const { selectDie } = await import('./js/game/controllers/turnActionsController.js');
                selectDie(index);
            };
            
            window.bankSelectedDice = async () => {
                const { bankSelectedDice } = await import('./js/game/controllers/turnActionsController.js');
                bankSelectedDice();
            };
            
            // Explicitně nastavíme všechny event listenery pomocí nového inicializátoru
            console.log('🎮 Inicializuji všechny event listenery pomocí nového systému...');
            initializeAllEventListeners();
            
            // Vylepšené listenery pro start hry
            enhancedGameStarter.attachGameStartListeners();
            
            // Relogujeme úspěšnost event listenerů
            setTimeout(() => {
                console.log('🔍 Kontrola event listenerů po inicializaci:');
                
                ['startGameBtn', 'rollBtn', 'bankBtn', 'endTurnBtn', 'chatInput'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        console.log(`✅ Element ${id} je dostupný`);
                    } else {
                        console.error(`❌ Element ${id} není dostupný!`);
                    }
                });
            }, 500);
            
            console.log('✅ AI Kostková Výzva ready!');
            
            return true;
        }, false, 'Application Initialization');
        
        // Spustíme inicializaci
        initializeApp();
        console.log('🔍 Global objects:', {
            gameController: !!window.gameController,
            addChatMessage: !!window.addChatMessage
        });
        
    } catch (error) {
        console.error('❌ Critical error during initialization:', error);
        console.error('❌ Error stack:', error.stack);
        
        // Fallback - základní funkcionalita bez modulů
        setupEmergencyFallback();
    }
});

/**
 * Emergency fallback pro případ selhání modulárního systému
 */
function setupEmergencyFallback() {
    console.log('🔧 Setting up emergency fallback...');
    
    // Základní start game funkcionalita
    const startBtn = document.getElementById('startGameBtn');
    const hallBtn = document.getElementById('hallOfFameBtn');
    const gameControls = document.getElementById('gameControls');
    const targetScoreSetup = document.getElementById('targetScoreSetup');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    
    console.log('🔧 Found elements:', {
        startBtn: !!startBtn,
        hallBtn: !!hallBtn,
        gameControls: !!gameControls,
        targetScoreSetup: !!targetScoreSetup,
        chatInput: !!chatInput,
        sendBtn: !!sendBtn
    });
    
    if (startBtn) {
        console.log('🔧 Adding start button listener...');
        startBtn.addEventListener('click', () => {
            console.log('🚀 Emergency start game');
            alert('Start Game button clicked! (Emergency mode)');
            
            if (targetScoreSetup && gameControls) {
                targetScoreSetup.style.display = 'none';
                gameControls.classList.remove('hidden');
            }
        });
    }
    
    if (hallBtn) {
        console.log('🔧 Adding hall of fame button listener...');
        hallBtn.addEventListener('click', () => {
            console.log('🏆 Emergency hall of fame');
            alert('Hall of Fame button clicked! (Emergency mode)');
        });
    }
    
    if (chatInput && sendBtn) {
        console.log('🔧 Adding chat listeners...');
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                console.log('💬 Emergency chat:', message);
                alert(`Chat message: ${message} (Emergency mode)`);
                chatInput.value = '';
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Přidej základní chat zprávu
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '<div style="color: #ff6600; padding: 10px;">🔧 Emergency mode active - modular system failed to load</div>';
    }
    
    console.log('✅ Emergency fallback setup complete');
    
    // Expose emergency fallback functions globally
    window.emergencyFallback = true;
    window.addChatMessage = (sender, message) => {
        console.log(`💬 Emergency chat from ${sender}: ${message}`);
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.style.color = '#39ff14';
            messageDiv.style.padding = '5px';
            messageDiv.textContent = `${sender}: ${message}`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };
}

/**
 * Fallback pro celkové selhání
 */
window.addEventListener('error', (e) => {
    console.error('🚨 Global error caught:', e.error);
    if (!window.emergencyFallback) {
        setupEmergencyFallback();
    }
});

console.log('🔚 main.js loaded completely');
