/**
 * 🎨 UI Manager
 * Správa uživatelského rozhraní s Bootstrap
 */

import { debounce, throttle } from 'lodash-es';
import { pipe, map, filter, forEach } from 'ramda';

/**
 * Správce uživatelského rozhraní
 */
export class UIManager {
    constructor() {
        this.initialized = false;
        this.breakpoint = 'md';
        this.isMobile = window.innerWidth < 768;
        this.gameState = null;
    }

    /**
     * Inicializace UI managera
     */
    async initialize() {
        this.setupResponsive();
        this.setupBootstrapHelpers();
        this.initialized = true;
        console.log('🎨 UI Manager initialized');
    }

    /**
     * Nastavení responzivního chování
     */
    setupResponsive() {
        const updateBreakpoint = throttle(() => {
            const width = window.innerWidth;
            this.isMobile = width < 768;
            
            // Bootstrap breakpoints
            if (width < 576) this.breakpoint = 'xs';
            else if (width < 768) this.breakpoint = 'sm';
            else if (width < 992) this.breakpoint = 'md';
            else if (width < 1200) this.breakpoint = 'lg';
            else this.breakpoint = 'xl';
            
            this.updateResponsiveClasses();
        }, 100);

        window.addEventListener('resize', updateBreakpoint);
        updateBreakpoint();
    }

    /**
     * Aktualizace responzivních tříd
     */
    updateResponsiveClasses() {
        document.body.classList.toggle('mobile', this.isMobile);
        document.body.classList.toggle('desktop', !this.isMobile);
        document.body.setAttribute('data-breakpoint', this.breakpoint);
    }

    /**
     * Nastavení Bootstrap helperů
     */
    setupBootstrapHelpers() {
        // Automatické inicializace Bootstrap komponent
        if (typeof window.bootstrap !== 'undefined') {
            // Tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

            // Popovers
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
        }
    }

    /**
     * Aktualizace herního displeje
     */
    updateGameDisplay(gameState) {
        if (!this.initialized) return;
        
        this.gameState = gameState;
        
        // Aktualizuj různé části UI
        this.updatePlayerDisplay();
        this.updateDiceDisplay();
        this.updateScoreDisplay();
        this.updateControlsDisplay();
    }

    /**
     * Aktualizace zobrazení hráčů
     */
    updatePlayerDisplay() {
        if (!this.gameState) return;

        const players = this.gameState.players;
        const currentPlayerIndex = this.gameState.currentPlayerIndex;

        // Desktop zobrazení
        const desktopPlayerElements = document.querySelectorAll('.player-card');
        desktopPlayerElements.forEach((element, index) => {
            if (players[index]) {
                this.updatePlayerCard(element, players[index], index === currentPlayerIndex);
            }
        });

        // Mobile zobrazení
        const mobilePlayerElements = document.querySelectorAll('.player-card-mobile');
        mobilePlayerElements.forEach((element, index) => {
            if (players[index]) {
                this.updatePlayerCard(element, players[index], index === currentPlayerIndex);
            }
        });
    }

    /**
     * Aktualizace karty hráče
     */
    updatePlayerCard(element, player, isActive) {
        if (!element) return;

        const nameElement = element.querySelector('.player-name');
        const scoreElement = element.querySelector('.player-score');
        const avatarElement = element.querySelector('.player-avatar');

        if (nameElement) nameElement.textContent = player.name;
        if (scoreElement) scoreElement.textContent = player.score.toLocaleString();
        if (avatarElement) avatarElement.textContent = player.avatar;

        // Aktivní hráč styling
        element.classList.toggle('active', isActive);
        element.classList.toggle('border-neon-green', isActive);
        element.classList.toggle('border-secondary', !isActive);
    }

    /**
     * Aktualizace zobrazení kostek
     */
    updateDiceDisplay() {
        if (!this.gameState) return;

        const { currentRoll, selectedDice, bankedDice } = this.gameState;

        // Aktualizuj současné kostky
        this.updateDiceContainer('current-dice', currentRoll, selectedDice);
        
        // Aktualizuj uložené kostky
        this.updateDiceContainer('banked-dice', bankedDice);
    }

    /**
     * Aktualizace kontejneru kostek
     */
    updateDiceContainer(containerClass, dice, selectedIndices = []) {
        const containers = document.querySelectorAll(`.${containerClass}`);
        
        containers.forEach(container => {
            container.innerHTML = '';
            
            dice.forEach((value, index) => {
                const diceElement = this.createDiceElement(value, index, selectedIndices.includes(index));
                container.appendChild(diceElement);
            });
        });
    }

    /**
     * Vytvoření elementu kostky
     */
    createDiceElement(value, index, isSelected = false) {
        const dice = document.createElement('div');
        dice.className = `dice btn btn-outline-light m-1 ${isSelected ? 'selected' : ''}`;
        dice.dataset.index = index;
        dice.textContent = value;
        
        // Neonové efekty
        if (isSelected) {
            dice.classList.add('border-neon-green', 'text-neon-green');
        }
        
        return dice;
    }

    /**
     * Aktualizace skóre
     */
    updateScoreDisplay() {
        if (!this.gameState) return;

        const { currentTurnScore, targetScore } = this.gameState;
        
        // Aktualizuj skóre současného tahu
        const turnScoreElements = document.querySelectorAll('.current-turn-score');
        turnScoreElements.forEach(element => {
            element.textContent = currentTurnScore.toLocaleString();
        });
        
        // Aktualizuj cílové skóre
        const targetScoreElements = document.querySelectorAll('.target-score');
        targetScoreElements.forEach(element => {
            element.textContent = targetScore.toLocaleString();
        });
    }

    /**
     * Aktualizace ovládacích prvků
     */
    updateControlsDisplay() {
        if (!this.gameState) return;

        const { gameStarted, gameEnded, currentTurnScore, currentRoll } = this.gameState;
        
        // Roll button
        const rollButtons = document.querySelectorAll('.roll-btn');
        rollButtons.forEach(button => {
            button.disabled = !gameStarted || gameEnded || currentRoll.length === 0;
        });
        
        // End turn button
        const endTurnButtons = document.querySelectorAll('.end-turn-btn');
        endTurnButtons.forEach(button => {
            button.disabled = !gameStarted || gameEnded || currentTurnScore === 0;
        });
        
        // Bank dice button
        const bankButtons = document.querySelectorAll('.bank-dice-btn');
        bankButtons.forEach(button => {
            button.disabled = !gameStarted || gameEnded;
        });
    }

    /**
     * Zobrazení notifikace
     */
    showNotification(message, type = 'info', duration = 3000) {
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
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Zobrazení loading stavu
     */
    showLoading(container = document.body) {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay d-flex justify-content-center align-items-center';
        loading.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1050;
        `;
        
        loading.innerHTML = `
            <div class="spinner-border text-neon-green" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        
        container.appendChild(loading);
        return loading;
    }

    /**
     * Skrytí loading stavu
     */
    hideLoading(container = document.body) {
        const loading = container.querySelector('.loading-overlay');
        if (loading) {
            loading.remove();
        }
    }

    /**
     * Plynulé přechody mezi stavy
     */
    smoothTransition(fromElements, toElements, duration = 300) {
        // Fade out
        fromElements.forEach(element => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
        });
        
        setTimeout(() => {
            // Hide and show
            fromElements.forEach(element => {
                element.classList.add('hidden');
            });
            
            toElements.forEach(element => {
                element.classList.remove('hidden');
                element.style.opacity = '0';
            });
            
            // Fade in
            setTimeout(() => {
                toElements.forEach(element => {
                    element.style.transition = `opacity ${duration}ms ease`;
                    element.style.opacity = '1';
                });
            }, 50);
        }, duration);
    }

    /**
     * Zpracování resize událostí
     */
    handleResize() {
        this.updateResponsiveClasses();
        
        // Refresh any size-dependent components
        if (this.gameState) {
            this.updateGameDisplay(this.gameState);
        }
    }

    /**
     * Utility funkce pro práci s Bootstrap třídami
     */
    addClass(elements, classes) {
        const elementsArray = Array.isArray(elements) ? elements : [elements];
        const classesArray = Array.isArray(classes) ? classes : [classes];
        
        elementsArray.forEach(element => {
            if (element) {
                classesArray.forEach(cls => element.classList.add(cls));
            }
        });
    }

    removeClass(elements, classes) {
        const elementsArray = Array.isArray(elements) ? elements : [elements];
        const classesArray = Array.isArray(classes) ? classes : [classes];
        
        elementsArray.forEach(element => {
            if (element) {
                classesArray.forEach(cls => element.classList.remove(cls));
            }
        });
    }

    toggleClass(elements, classes) {
        const elementsArray = Array.isArray(elements) ? elements : [elements];
        const classesArray = Array.isArray(classes) ? classes : [classes];
        
        elementsArray.forEach(element => {
            if (element) {
                classesArray.forEach(cls => element.classList.toggle(cls));
            }
        });
    }
}

export default UIManager;
