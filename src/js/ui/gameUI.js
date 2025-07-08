/**
 * Game UI Manager - Správa herního UI
 * Stará se o vykreslování a aktualizaci herního rozhraní
 */

import gameState from '../game/gameState.js';
import { createNeonButton, createDiceElement } from './uiComponents.js';

/**
 * GameUI třída - Zajišťuje veškeré renderování herní plochy
 */
export class GameUI {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.initEventListeners();
    }

    /**
     * Inicializuje event listenery pro UI
     */
    initEventListeners() {
        // Listener pro změny herního stavu
        gameState.addListener(this.renderUI.bind(this));
    }

    /**
     * Hlavní render funkce - rozhoduje, co se má zobrazit
     * @param {Object} state - Aktuální herní stav
     */
    renderUI(state) {
        if (!this.gameArea) return;
        
        // Vyčistíme herní plochu
        this.gameArea.innerHTML = '';
        
        // Zobrazíme správný obsah podle fáze hry
        switch (state.gamePhase) {
            case 'menu':
                this.renderMainMenu();
                break;
            case 'game':
                this.renderGameScreen(state);
                break;
            case 'gameover':
                this.renderGameOver(state);
                break;
            case 'rules':
                this.renderRules();
                break;
            case 'halloffame':
                this.renderHallOfFame();
                break;
            default:
                this.renderMainMenu();
        }
    }

    /**
     * Vykreslí hlavní menu
     */
    renderMainMenu() {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column justify-content-center align-items-center h-100';
        
        // Nadpis
        const title = document.createElement('h1');
        title.className = 'text-neon-green fs-fluid-1 mb-4 text-center';
        title.innerHTML = '<i class="bi bi-star-fill"></i> Cílové skóre';
        container.appendChild(title);
        
        // Selector pro cílové skóre
        const scoreSelector = document.createElement('div');
        scoreSelector.className = 'mb-5 d-flex align-items-center justify-content-center fs-fluid-2';
        
        const minusBtn = createNeonButton('-', 'blue', null, () => this.adjustTargetScore(-1000));
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'px-5 text-neon-yellow';
        scoreValue.textContent = gameState.getState().targetScore;
        scoreValue.id = 'targetScoreValue';
        
        const plusBtn = createNeonButton('+', 'blue', null, () => this.adjustTargetScore(1000));
        
        scoreSelector.appendChild(minusBtn);
        scoreSelector.appendChild(scoreValue);
        scoreSelector.appendChild(plusBtn);
        
        container.appendChild(scoreSelector);
        
        // Tlačítka akcí
        const startBtn = createNeonButton('ZAČÍT HRU', 'green', 'bi-play-fill', () => this.startGame(), 'mb-3 fs-5 w-75');
        container.appendChild(startBtn);
        
        const rulesBtn = createNeonButton('PRAVIDLA', 'blue', 'bi-book-fill', () => this.showRules(), 'mb-3 fs-5 w-75');
        container.appendChild(rulesBtn);
        
        const hallOfFameBtn = createNeonButton('SÍŇ SLÁVY', 'orange', 'bi-trophy-fill', () => this.showHallOfFame(), 'mb-3 fs-5 w-75');
        container.appendChild(hallOfFameBtn);
        
        this.gameArea.appendChild(container);
    }

    /**
     * Upraví cílové skóre
     * @param {number} change - O kolik změnit skóre
     */
    adjustTargetScore(change) {
        const currentScore = gameState.getState().targetScore;
        const newScore = Math.max(1000, Math.min(50000, currentScore + change));
        
        gameState.updateState({ targetScore: newScore });
        
        // Aktualizujeme zobrazení
        const scoreValueEl = document.getElementById('targetScoreValue');
        if (scoreValueEl) {
            scoreValueEl.textContent = newScore;
        }
    }

    /**
     * Spustí hru
     */
    startGame() {
        gameState.updateState({ 
            gameStarted: true,
            gamePhase: 'game',
            currentPlayerIndex: 0,
            players: gameState.getState().players.map(p => ({ ...p, score: 0 }))
        });
    }

    /**
     * Zobrazí pravidla
     */
    showRules() {
        gameState.updateState({ gamePhase: 'rules' });
    }

    /**
     * Zobrazí síň slávy
     */
    showHallOfFame() {
        gameState.updateState({ gamePhase: 'halloffame' });
    }

    /**
     * Vykreslí herní obrazovku
     * @param {Object} state - Aktuální herní stav
     */
    renderGameScreen(state) {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100';
        
        // Header s informacemi o hře
        const header = document.createElement('div');
        header.className = 'mb-2 mb-md-3';
        
        // Další komponenty herní obrazovky...
        
        this.gameArea.appendChild(container);
    }

    /**
     * Vykreslí obrazovku konce hry
     * @param {Object} state - Aktuální herní stav
     */
    renderGameOver(state) {
        // Implementace obrazovky konce hry
    }

    /**
     * Vykreslí pravidla
     */
    renderRules() {
        // Implementace obrazovky pravidel
    }

    /**
     * Vykreslí síň slávy
     */
    renderHallOfFame() {
        // Implementace obrazovky síně slávy
    }
}

// Exportujeme třídu GameUI
export default GameUI;
