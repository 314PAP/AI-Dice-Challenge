/**
 * 🎲 AI Dice Challenge - Hlavní aplikační soubor
 * 
 * Hlavní vstupní bod aplikace, který propojuje všechny moduly
 * 100% Bootstrap utility třídy, modulární struktura, žádné hardcoded styly
 */

// Importy z herních modulů
import gameState from './js/game/gameState.js';
import * as diceMechanics from './js/game/diceMechanics.js';

// Importy z AI modulů
import chatSystem from './js/ai/chatSystem.js';
import { aiPersonalities, getAiDecision } from './js/ai/personalities.js';

// Importy z UI modulů
import GameUI from './js/ui/gameUI.js';
import ChatUI from './js/ui/chatUI.js';
import UltraBootstrapAutocomplete from './js/ui/autocomplete.js';

// Importy z utility modulů
import { GAME_CONSTANTS, STORAGE_KEYS } from './js/utils/constants.js';
import { sleep, loadFromLocalStorage, saveToLocalStorage } from './js/utils/helpers.js';

/**
 * Hlavní třída aplikace, která propojuje všechny komponenty
 */
class AIDiceGame {
    constructor() {
        console.log('🎲 AI Dice Challenge - Bootstrap-First Modular Edition starting...');
        
        this.gameUI = null;
        this.chatUI = null;
        this.chatAutocomplete = null;
        
        this.init();
    }

    /**
     * Inicializuje aplikaci
     */
    async init() {
        try {
            await this.waitForDOM();
            this.hideLoadingScreen();
            this.initializeComponents();
            this.setupEventListeners();
            console.log('✅ AI Dice Challenge initialized!');
        } catch (error) {
            console.error('❌ App init failed:', error);
            this.showError('Chyba při načítání aplikace.');
        }
    }

    /**
     * Čeká na načtení DOM
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Skryje úvodní načítací obrazovku
     */
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const app = document.getElementById('app');
            
            if (loadingScreen && app) {
                loadingScreen.classList.add('animate__animated', 'animate__fadeOut');
                app.classList.remove('d-none');
                app.classList.add('animate__animated', 'animate__fadeIn');
                
                setTimeout(() => loadingScreen.remove(), 800);
            }
        }, 500);
    }

    /**
     * Inicializuje komponenty aplikace
     */
    initializeComponents() {
        // Inicializace UI komponent
        this.gameUI = new GameUI();
        this.chatUI = new ChatUI();
        
        // Inicializace autocomplete
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            const chatHistory = chatSystem.getChatHistory();
            this.chatAutocomplete = new UltraBootstrapAutocomplete(chatInput, {
                suggestions: chatHistory,
                maxResults: 8,
                neonColor: 'blue',
                storageKey: STORAGE_KEYS.CHAT_HISTORY
            });
        }
        
        // Načtení uložených nastavení
        this.loadGameSettings();
        
        // Přidání uvítacích zpráv
        this.chatUI.addWelcomeMessages();
    }

    /**
     * Nastaví event listenery pro aplikaci
     */
    setupEventListeners() {
        // Příklad globálního event listeneru
        document.addEventListener('game-end', this.handleGameEnd.bind(this));
    }

    /**
     * Zpracuje událost konce hry
     * @param {CustomEvent} event - Událost konce hry
     */
    handleGameEnd(event) {
        const { winner } = event.detail;
        console.log(`Hra skončila! Vítěz: ${winner}`);
        
        // Aktualizace síně slávy
        this.updateHallOfFame(winner);
    }

    /**
     * Načte herní nastavení z localStorage
     */
    loadGameSettings() {
        const settings = loadFromLocalStorage(STORAGE_KEYS.GAME_SETTINGS, {
            targetScore: GAME_CONSTANTS.DEFAULT_TARGET_SCORE
        });
        
        gameState.updateState({ targetScore: settings.targetScore });
    }

    /**
     * Uloží herní nastavení do localStorage
     */
    saveGameSettings() {
        const state = gameState.getState();
        
        saveToLocalStorage(STORAGE_KEYS.GAME_SETTINGS, {
            targetScore: state.targetScore
        });
    }

    /**
     * Aktualizuje síň slávy
     * @param {string} winner - Jméno vítěze
     */
    updateHallOfFame(winner) {
        const hallOfFame = loadFromLocalStorage(STORAGE_KEYS.HALL_OF_FAME, []);
        
        hallOfFame.push({
            name: winner,
            date: new Date().toISOString(),
            score: gameState.getState().targetScore
        });
        
        // Seřazení podle data (nejnovější první)
        hallOfFame.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Omezení na 10 záznamů
        const limitedHallOfFame = hallOfFame.slice(0, 10);
        
        saveToLocalStorage(STORAGE_KEYS.HALL_OF_FAME, limitedHallOfFame);
    }

    /**
     * Zobrazí chybovou hlášku
     * @param {string} message - Text chybové hlášky
     */
    showError(message) {
        // Použijeme SweetAlert2 pro zobrazení chyby
        if (window.Swal) {
            window.Swal.fire({
                title: 'Chyba!',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#000',
                color: '#fff',
                iconColor: '#ff3131',
                confirmButtonColor: '#194DD1'
            });
        } else {
            alert(`Chyba: ${message}`);
        }
    }
}

// Spuštění aplikace
const app = new AIDiceGame();
