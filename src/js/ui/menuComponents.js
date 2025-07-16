/**
 * Menu UI Components - Komponenty pro menu
 * Přesunuto z gameUI.js pro zmenšení velikosti
 */

import { createNeonButton, createNeonCard } from './uiComponents.js';
import gameState from '../game/gameState.js';
import chatSystem from '../ai/chatSystem.js';

export class MenuComponents {
    /**
     * Zobrazí menu s potvrzovacím dialogem
     */
    showMenuWithConfirmation(onConfirm) {
        this.showStyledConfirmation(
            'Opravdu chcete odejít do menu?',
            'Rozehraná hra bude ztracena.',
            onConfirm
        );
    }

    /**
     * Zobrazí stylovaný potvrzovací dialog
     */
    showStyledConfirmation(title, message, onConfirm) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show position-fixed top-0 start-0 w-100 h-100';

        const modal = document.createElement('div');
        modal.className = 'modal d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100';

        modal.innerHTML = `
            <div class="modal-dialog modal-sm">
                <div class="modal-content bg-black border-3 border-neon-red shadow-lg">
                    <div class="modal-header border-bottom border-neon-red">
                        <h5 class="modal-title text-neon-red fw-bold">${title}</h5>
                    </div>
                    <div class="modal-body text-center">
                        <p class="text-neon-yellow mb-3">${message}</p>
                        <div class="d-flex gap-2 justify-content-center">
                            <button type="button" class="btn btn-neon btn-sm" data-neon-color="green" id="confirm-yes">Ano</button>
                            <button type="button" class="btn btn-neon btn-sm" data-neon-color="red" id="confirm-no">Ne</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        const yesBtn = modal.querySelector('#confirm-yes');
        const noBtn = modal.querySelector('#confirm-no');

        const closeModal = () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        };

        yesBtn.addEventListener('click', () => { closeModal(); onConfirm(); });
        noBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
    }

    /**
     * Zobrazí herní menu
     */
    showMenu() {
        chatSystem.clearMessages();
        gameState.updateState({ gamePhase: 'menu', gameStarted: false });
    }

    // ...existing code...
    /**
     * Vytvoří hlavní menu tlačítka
     */
    static createMenuButtons(callbacks) {
        const buttons = {};
        
        buttons.startBtn = createNeonButton(
            'ZAČÍT HRU', 
            'green', 
            'bi-play-fill', 
            callbacks.startGame,
            'btn w-100 btn-no-scale'
        );
        
        buttons.rulesBtn = createNeonButton(
            'PRAVIDLA', 
            'blue', 
            'bi-book-fill', 
            callbacks.showRules,
            'btn w-100 btn-no-scale'
        );
        
        buttons.hallOfFameBtn = createNeonButton(
            'SÍŇ SLÁVY', 
            'purple', 
            'bi-trophy-fill', 
            callbacks.showHallOfFame,
            'btn w-100 btn-no-scale'
        );
        
        buttons.exitBtn = createNeonButton(
            'UKONČIT', // Zkráceno pro lepší fit na mobilu
            'red', 
            'bi-power', 
            () => window.close(),
            'btn w-100 btn-no-scale'
        );
        
        return buttons;
    }

    /**
     * Vytvoří layout pro menu tlačítka
     */
    static createMenuLayout(buttons) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'row g-3 px-3 justify-content-center';
        
        const col1 = document.createElement('div');
        col1.className = 'col-12 col-sm-6 col-lg-5 menu-button-spacing';
        col1.appendChild(buttons.startBtn);
        
        const col2 = document.createElement('div');
        col2.className = 'col-12 col-sm-6 col-lg-5 menu-button-spacing';
        col2.appendChild(buttons.rulesBtn);
        
        const col3 = document.createElement('div');
        col3.className = 'col-12 col-sm-6 col-lg-5 menu-button-spacing';
        col3.appendChild(buttons.hallOfFameBtn);
        
        const col4 = document.createElement('div');
        col4.className = 'col-12 col-sm-6 col-lg-5 menu-button-spacing';
        col4.appendChild(buttons.exitBtn);
        
        buttonsContainer.appendChild(col1);
        buttonsContainer.appendChild(col2);
        buttonsContainer.appendChild(col3);
        buttonsContainer.appendChild(col4);
        
        return buttonsContainer;
    }

    /**
     * Vytvoří score selector
     */
    static createScoreSelector(currentTarget, callbacks) {
        const selector = document.createElement('div');
        selector.className = 'd-flex align-items-center justify-content-center gap-3 my-3';
        
        const minusBtn = createNeonButton('-', 'blue', null, () => callbacks.adjustScore(-1000), 'btn px-3 py-2 fs-4 lh-1 btn-no-scale');
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'text-neon-yellow fs-3 fw-bold px-3';
        scoreDisplay.textContent = currentTarget.toLocaleString();
        scoreDisplay.id = 'targetScoreDisplay';
        
        const plusBtn = createNeonButton('+', 'blue', null, () => callbacks.adjustScore(1000), 'btn px-3 py-2 fs-4 lh-1 btn-no-scale');
        
        selector.appendChild(minusBtn);
        selector.appendChild(scoreDisplay);
        selector.appendChild(plusBtn);
        
        return selector;
    }
}

export default MenuComponents;
