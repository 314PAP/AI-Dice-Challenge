/**
 * Menu UI Components - Komponenty pro menu
 * Přesunuto z gameUI.js pro zmenšení velikosti
 */

import { createNeonButton, createNeonCard } from './uiComponents.js';

export class MenuComponents {
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
            'btn w-100'
        );
        
        buttons.rulesBtn = createNeonButton(
            'PRAVIDLA', 
            'blue', 
            'bi-book-fill', 
            callbacks.showRules,
            'btn w-100'
        );
        
        buttons.hallOfFameBtn = createNeonButton(
            'SÍŇ SLÁVY', 
            'purple', 
            'bi-trophy-fill', 
            callbacks.showHallOfFame,
            'btn w-100'
        );
        
        buttons.exitBtn = createNeonButton(
            'UKONČIT HRU', 
            'red', 
            'bi-power', 
            () => window.close(),
            'btn w-100'
        );
        
        return buttons;
    }

    /**
     * Vytvoří layout pro menu tlačítka
     */
    static createMenuLayout(buttons) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'row g-2 px-2';
        
        const col1 = document.createElement('div');
        col1.className = 'col-12 col-sm-6 mb-2 px-2';
        col1.appendChild(buttons.startBtn);
        
        const col2 = document.createElement('div');
        col2.className = 'col-12 col-sm-6 mb-2 px-2';
        col2.appendChild(buttons.rulesBtn);
        
        const col3 = document.createElement('div');
        col3.className = 'col-12 col-sm-6 mb-2 px-2';
        col3.appendChild(buttons.hallOfFameBtn);
        
        const col4 = document.createElement('div');
        col4.className = 'col-12 col-sm-6 mb-2 px-2';
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
        
        const minusBtn = createNeonButton('-', 'blue', null, () => callbacks.adjustScore(-1000), 'btn px-3 py-2 fs-4 lh-1');
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'text-neon-yellow fs-3 fw-bold px-3';
        scoreDisplay.textContent = currentTarget.toLocaleString();
        scoreDisplay.id = 'targetScoreDisplay';
        
        const plusBtn = createNeonButton('+', 'blue', null, () => callbacks.adjustScore(1000), 'btn px-3 py-2 fs-4 lh-1');
        
        selector.appendChild(minusBtn);
        selector.appendChild(scoreDisplay);
        selector.appendChild(plusBtn);
        
        return selector;
    }
}

export default MenuComponents;
