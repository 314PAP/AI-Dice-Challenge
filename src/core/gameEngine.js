/**
 * AI Dice Challenge - Core Game Engine
 * Hlavní herní engine koordinující všechny systémy
 */

import { gameState } from './gameState.js';
import { GAME_CONSTANTS, GAME_EVENTS, TIMINGS } from './constants.js';
import { EventSystem } from '../game/events/eventSystem.js';
import { TurnManager } from '../game/turns/turnManager.js';
import { UIManager } from '../ui/components/uiManager.js';
import { ChatManager } from '../ui/chat/chatManager.js';
import { AIManager } from '../ai/controllers/aiManager.js';

export class GameEngine {
    constructor() {
        this.events = new EventSystem();
        this.turnManager = new TurnManager(this.events);
        this.uiManager = new UIManager(this.events);
        this.chatManager = new ChatManager(this.events);
        this.aiManager = new AIManager(this.events);
        
        this.initialized = false;
    }

    /**
     * Inicializuje celý herní systém
     */
    async initialize() {
        console.log('🎮 Inicializuji Game Engine...');
        
        try {
            // Inicializuj všechny subsystémy
            await this.events.initialize();
            await this.uiManager.initialize();
            await this.chatManager.initialize();
            await this.aiManager.initialize();
            await this.turnManager.initialize();
            
            // Nastav event listenery
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('✅ Game Engine inicializován');
            
            // Úvodní zpráva
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci Game Engine:', error);
            throw error;
        }
    }

    /**
     * Spustí novou hru
     */
    startGame(targetScore = GAME_CONSTANTS.DEFAULT_TARGET_SCORE) {
        if (!this.initialized) {
            throw new Error('Game Engine není inicializován!');
        }

        console.log(`🚀 Spouštím novou hru s cílem ${targetScore} bodů`);
        
        // Resetuj stav hry
        gameState.reset();
        gameState.targetScore = targetScore;
        gameState.gameStarted = true;
        gameState.gameStartTime = new Date();
        
        // Emituj start event
        this.events.emit(GAME_EVENTS.GAME_START, { targetScore });
        
        // Spusť první tah
        this.turnManager.startPlayerTurn(0);
        
        return true;
    }

    /**
     * Ukončí hru
     */
    endGame(winner = null) {
        console.log('🏁 Ukončuji hru');
        
        gameState.gameEnded = true;
        gameState.winner = winner;
        
        this.events.emit(GAME_EVENTS.GAME_END, { winner });
    }

    /**
     * Resetuje hru do původního stavu
     */
    resetGame() {
        console.log('🔄 Resetuji hru');
        
        gameState.reset();
        this.events.emit(GAME_EVENTS.GAME_START, { reset: true });
    }

    /**
     * Nastavuje event listenery pro herní události
     */
    setupEventListeners() {
        // DOM je připravený, nastav UI listenery s mírným zpožděním
        setTimeout(() => {
            this.uiManager.setupDOMListeners();
        }, TIMINGS.DOM_READY_DELAY);

        // Game events
        this.events.on(GAME_EVENTS.GAME_START, (data) => {
            this.uiManager.showGameInterface(data.targetScore);
            this.chatManager.addSystemMessage(
                `🎮 Hra začala! Cíl: ${data.targetScore} bodů!`
            );
        });

        this.events.on(GAME_EVENTS.GAME_END, (data) => {
            this.uiManager.showGameOverModal(data.winner);
        });

        this.events.on(GAME_EVENTS.FARKLE, (data) => {
            this.chatManager.addSystemMessage('❌ FARKLE! Žádné bodující kostky!');
            this.aiManager.triggerFarkleReactions(data.player);
        });

        this.events.on(GAME_EVENTS.HOT_DICE, () => {
            this.chatManager.addSystemMessage(
                '🔥 HOT DICE! Všechny kostky odloženy!'
            );
        });
    }

    /**
     * Zobrazí úvodní zprávu
     */
    showWelcomeMessage() {
        setTimeout(() => {
            this.chatManager.addSystemMessage(
                '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!'
            );
        }, TIMINGS.DOM_READY_DELAY);
    }

    /**
     * Vrátí aktuální stav hry
     */
    getGameState() {
        return {
            ...gameState,
            initialized: this.initialized
        };
    }

    /**
     * Kontrola, zda je hra inicializovaná
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Cleanup při zničení instance
     */
    destroy() {
        this.events.removeAllListeners();
        this.initialized = false;
        console.log('🗑️ Game Engine zničen');
    }
}

// Singleton instance
export const gameEngine = new GameEngine();
