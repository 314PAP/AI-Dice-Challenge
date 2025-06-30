/**
 * AI Dice Challenge - Core Game Engine (Simplified)
 * Hlavní herní engine pro koordinaci základních systémů
 */

import { gameState } from './gameState.js';
import { GAME_CONSTANTS, GAME_EVENTS, TIMINGS } from './constants.js';

export class GameEngine {
    constructor() {
        this.initialized = false;
        this.targetScore = GAME_CONSTANTS.DEFAULT_TARGET_SCORE;
        this.eventListeners = new Map();
    }

    /**
     * Inicializuje herní systém
     */
    async initialize() {
        console.log('🎮 Inicializuji Game Engine (Simplified)...');
        
        try {
            // Základní inicializace
            this.setupBasicEventListeners();
            
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
        this.resetGameState();
        gameState.targetScore = targetScore;
        gameState.gameStarted = true;
        gameState.gameStartTime = new Date();
        
        // Emituj start event
        this.emit(GAME_EVENTS.GAME_START, { targetScore });
        
        return true;
    }

    /**
     * Ukončí hru
     */
    endGame(winner = null) {
        console.log('🏁 Ukončuji hru');
        
        gameState.gameEnded = true;
        gameState.winner = winner;
        
        this.emit(GAME_EVENTS.GAME_END, { winner });
    }

    /**
     * Resetuje hru do původního stavu
     */
    resetGame() {
        console.log('🔄 Resetuji hru');
        
        this.resetGameState();
        this.emit(GAME_EVENTS.GAME_START, { reset: true });
    }

    /**
     * Resetuje herní stav
     */
    resetGameState() {
        gameState.gameStarted = false;
        gameState.gameEnded = false;
        gameState.currentPlayer = 0;
        gameState.players.forEach(player => {
            player.score = 0;
            player.turnScore = 0;
        });
        gameState.dice = [];
        gameState.selectedDice = [];
        gameState.lastRoll = [];
    }

    /**
     * Nastavuje základní event listenery
     */
    setupBasicEventListeners() {
        // Start game button
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const targetScoreInput = document.getElementById('targetScoreInput');
                const targetScore = parseInt(targetScoreInput?.value) || GAME_CONSTANTS.DEFAULT_TARGET_SCORE;
                
                // Skryj setup, zobraz game controls
                const setup = document.getElementById('targetScoreSetup');
                const controls = document.getElementById('gameControls');
                
                if (setup) setup.style.display = 'none';
                if (controls) controls.style.display = 'block';
                
                this.startGame(targetScore);
            });
        }

        // Event listenery pro herní události
        this.on(GAME_EVENTS.GAME_START, (data) => {
            this.updateGameInterface(data.targetScore);
            this.addSystemMessage(`🎮 Hra začala! Cíl: ${data.targetScore} bodů!`);
        });

        this.on(GAME_EVENTS.GAME_END, (data) => {
            this.showGameOverModal(data.winner);
        });
    }

    /**
     * Zobrazí úvodní zprávu
     */
    showWelcomeMessage() {
        setTimeout(() => {
            this.addSystemMessage(
                '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!'
            );
        }, TIMINGS.DOM_READY_DELAY);
    }

    /**
     * Aktualizuje herní rozhraní
     */
    updateGameInterface(targetScore) {
        console.log(`🎨 Updating game interface with target score: ${targetScore}`);
    }

    /**
     * Přidá systémovou zprávu do chatu
     */
    addSystemMessage(message) {
        console.log(`💬 System message: ${message}`);
    }

    /**
     * Zobrazí game over modal
     */
    showGameOverModal(winner) {
        console.log(`🏆 Game over! Winner: ${winner?.name || 'Unknown'}`);
    }

    /**
     * Event systém - přidej listener
     */
    on(eventName, callback) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        this.eventListeners.get(eventName).push(callback);
    }

    /**
     * Event systém - emituj událost
     */
    emit(eventName, data) {
        const listeners = this.eventListeners.get(eventName) || [];
        listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        });
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
        this.eventListeners.clear();
        this.initialized = false;
        console.log('🗑️ Game Engine zničen');
    }
}

export default GameEngine;
