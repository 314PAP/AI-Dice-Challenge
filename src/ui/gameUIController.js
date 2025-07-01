/**
 * Game UI Controller - Refactored
 * Main UI controller that coordinates all UI modules
 * Replaced 413-line monolithic file with modular architecture
 */

// Import all UI controller modules
import * as gameController from '../js/game/gameController.js';
import { uiEventController } from './controllers/uiEventController.js';
import { chatController } from './controllers/chatController.js';
import { hallOfFameController } from './controllers/hallOfFameController.js';
import { gameStateController } from './controllers/gameStateController.js';

class GameUIController {
    constructor() {
        this.gameController = gameController;
        this.isInitialized = false;
        
        // Initialize controller modules
        this.uiEvents = uiEventController;
        this.chat = chatController;
        this.hallOfFame = hallOfFameController;
        this.gameState = gameStateController;
    }

    /**
     * Inicializuje UI controller
     */
    async initialize() {
        console.log('🎮 Inicializuji UI Controller...');
        
        try {
            // Game controller is already initialized as module import
            
            // Initialize game state controller
            await this.gameState.initialize(this.gameController);
            
            // Setup all UI modules
            this.setupUIModules();
            
            // Zpřístupni globálně pro debugging
            this.exposeGlobally();
            
            this.isInitialized = true;
            console.log('✅ UI Controller inicializován');
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci UI:', error);
            this.gameState.setupBasicFallback();
        }
    }

    /**
     * Sets up all UI modules
     */
    setupUIModules() {
        // Set game controller reference for modules that need it
        this.uiEvents.setGameController(this.gameController);
        
        // Setup UI event listeners
        this.uiEvents.setupUIEventListeners();
        
        // Setup chat functionality
        this.chat.setupChatFunctionality();
        this.chat.enableAutoSave();
        this.chat.loadChatHistory();
        
        // Expose chat functionality globally
        window.addChatMessage = (sender, message) => this.chat.addChatMessage(sender, message);
    }

    /**
     * Expose controllers globally for debugging and compatibility
     */
    exposeGlobally() {
        window.gameController = this.gameController;
        window.uiController = this;
        window.uiEventController = this.uiEvents;
        window.chatController = this.chat;
        window.gameStateController = this.gameState;
        
        // Legacy compatibility
        window.addChatMessage = (sender, message) => this.addChatMessage(sender, message);
    }

    /**
     * Delegates to appropriate controller modules
     */
    
    // Game state management
    startNewGame() {
        return this.gameState.startNewGame();
    }

    returnToMainMenu() {
        return this.gameState.returnToMainMenu();
    }

    // Hall of Fame management  
    displayHallOfFame() {
        return this.hallOfFame.displayHallOfFame();
    }

    closeHallOfFame() {
        return this.hallOfFame.closeHallOfFame();
    }

    saveScore() {
        return this.hallOfFame.saveScore();
    }

    // Chat management
    addChatMessage(sender, message) {
        return this.chat.addChatMessage(sender, message);
    }

    clearChatHistory() {
        return this.chat.clearChatHistory();
    }

    // UI Events management
    setupUIEventListeners() {
        return this.uiEvents.setupUIEventListeners();
    }

    setupChatFunctionality() {
        return this.chat.setupChatFunctionality();
    }

    /**
     * Gets controller status and information
     * @returns {Object} Controller status
     */
    getControllerStatus() {
        return {
            isInitialized: this.isInitialized,
            gameController: !!this.gameController,
            modules: {
                uiEvents: !!this.uiEvents,
                chat: !!this.chat,
                hallOfFame: !!this.hallOfFame,
                gameState: !!this.gameState
            },
            chatHistory: this.chat.getMessageHistory().length,
            hallOfFameEntries: this.hallOfFame.loadHallOfFameData().length
        };
    }

    /**
     * Performs cleanup when controller is destroyed
     */
    cleanup() {
        console.log('🧹 Cleaning up UI Controller...');
        
        // Save chat history before cleanup
        this.chat.saveChatHistory();
        
        // Reset global references
        delete window.gameController;
        delete window.uiController;
        delete window.addChatMessage;
        
        this.isInitialized = false;
        console.log('✅ UI Controller cleanup completed');
    }

    /**
     * Legacy compatibility method - delegates to basic fallback
     */
    setupBasicFallback() {
        return this.gameState.setupBasicFallback();
    }
}

export { GameUIController };
