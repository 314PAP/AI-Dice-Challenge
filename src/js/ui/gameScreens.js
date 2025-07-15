/**
 * Game Screens - Obrazovky pro herní módy
 * Přesunuto z gameUI.js pro zmenšení velikosti
 */

import { createNeonButton, createNeonCard } from './uiComponents.js';
import gameState from '../game/gameState.js';

export class GameScreens {
    /**
     * Vytvoří obrazovku pravidel
     */
    static createRulesScreen(callbacks) {
        const container = document.createElement('div');
        container.className = 'h-100 d-flex flex-column p-3';
        
        const header = document.createElement('div');
        header.className = 'text-center mb-3';
        header.innerHTML = '<h2 class="text-neon-blue mb-0"><i class="bi bi-book-fill me-2"></i>PRAVIDLA HRY</h2>';
        
        const content = document.createElement('div');
        content.className = 'flex-grow-1 overflow-auto text-neon-green';
        content.innerHTML = `
            <div class="mb-3">
                <h4 class="text-neon-yellow">🎯 CÍL HRY</h4>
                <p>Dosáhněte jako první hráč cílového skóre (výchozí 5000 bodů).</p>
            </div>
            <div class="mb-3">
                <h4 class="text-neon-yellow">🎲 ZÁKLADNÍ HRANÍ</h4>
                <ul>
                    <li>Házíte 6 kostkami</li>
                    <li>Vybíráte bodující kostky a odložíte je</li>
                    <li>Můžete pokračovat nebo ukončit tah</li>
                    <li>První zápis: minimálně 300 bodů</li>
                </ul>
            </div>
            <div class="mb-3">
                <h4 class="text-neon-yellow">💎 BODOVÁNÍ</h4>
                <ul>
                    <li><strong>1</strong> = 100 bodů</li>
                    <li><strong>5</strong> = 50 bodů</li>
                    <li><strong>Tři stejné:</strong> hodnota × 100 (tři 1 = 1000)</li>
                    <li><strong>Čtyři stejné:</strong> × 2</li>
                    <li><strong>Pět stejných:</strong> × 4</li>
                    <li><strong>Šest stejných:</strong> × 8</li>
                </ul>
            </div>
            <div class="mb-3">
                <h4 class="text-neon-orange">🔥 HOT DICE</h4>
                <p>Pokud odložíte všech 6 kostek, získáváte je zpět a můžete pokračovat!</p>
            </div>
            <div class="mb-3">
                <h4 class="text-neon-red">💥 FARKLE</h4>
                <p>Nehodíte-li žádné bodující kostky, přicházíte o všechny body v tahu!</p>
            </div>
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-center mt-3';
        
        const backBtn = createNeonButton('ZPĚT DO MENU', 'orange', 'bi-arrow-left-circle-fill', 
            callbacks.showMainMenu, 'btn w-100');
        buttonContainer.appendChild(backBtn);
        
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(buttonContainer);
        
        return container;
    }

    /**
     * Vytvoří obrazovku síně slávy
     */
    static createHallOfFameScreen(callbacks) {
        const container = document.createElement('div');
        container.className = 'h-100 d-flex flex-column p-3';
        
        const header = document.createElement('div');
        header.className = 'text-center mb-3';
        header.innerHTML = '<h2 class="text-neon-purple mb-0"><i class="bi bi-trophy-fill me-2"></i>SÍŇ SLÁVY</h2>';
        
        const content = document.createElement('div');
        content.className = 'flex-grow-1 overflow-auto text-center text-neon-yellow';
        content.innerHTML = `
            <div class="py-5">
                <i class="bi bi-trophy display-1 text-neon-yellow mb-3"></i>
                <h3>Zatím žádní vítězové</h3>
                <p class="text-neon-green">Buďte první, kdo dokončí hru!</p>
            </div>
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-center mt-3';
        
        const backBtn = createNeonButton('ZPĚT DO MENU', 'orange', 'bi-arrow-left-circle-fill', 
            callbacks.showMainMenu, 'btn w-100');
        buttonContainer.appendChild(backBtn);
        
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(buttonContainer);
        
        return container;
    }

    /**
     * Vytvoří obrazovku konce hry
     */
    static createGameEndScreen(winner, callbacks) {
        const container = document.createElement('div');
        container.className = 'h-100 d-flex flex-column justify-content-center align-items-center p-3 text-center';
        
        container.innerHTML = `
            <div class="mb-4">
                <i class="bi bi-trophy-fill display-1 text-neon-yellow"></i>
                <h1 class="text-neon-green mt-3">VÍTĚZ!</h1>
                <h2 class="text-neon-blue">${winner.name}</h2>
                <p class="text-neon-purple fs-4">Skóre: ${winner.score.toLocaleString()}</p>
            </div>
        `;
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'd-flex gap-3 flex-wrap justify-content-center';
        
        const newGameBtn = createNeonButton(
            'NOVÁ HRA', 
            'green', 
            'bi-arrow-clockwise', 
            callbacks.startNewGame,
            'btn px-4'
        );
        
        const menuBtn = createNeonButton(
            'MENU', 
            'blue', 
            'bi-house-fill', 
            callbacks.showMainMenu,
            'btn px-4'
        );
        
        btnGroup.appendChild(newGameBtn);
        btnGroup.appendChild(menuBtn);
        container.appendChild(btnGroup);
        
        return container;
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
     * Vykreslí pravidla
     */
    renderRules(gameArea) {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100 p-2';
        
        const title = document.createElement('h1');
        title.className = 'text-neon-blue fs-fluid-1 mb-2 text-center';
        title.innerHTML = '<i class="bi bi-book-half"></i> Pravidla';
        container.appendChild(title);
        
        const rulesCard = createNeonCard('', 'blue', `
            <div class="mb-3">
                <h6 class="text-neon-yellow mb-2">🎯 Cíl hry</h6>
                <p class="text-neon-green small mb-0">Získej <strong class="text-neon-blue">10 000 bodů</strong> jako první hráč!</p>
            </div>
            
            <div class="mb-3">
                <h6 class="text-neon-yellow mb-2">🎲 Jak hrát krok za krokem</h6>
                <ol class="text-neon-green small mb-0 ps-3">
                    <li><strong class="text-neon-orange">Klikni "HODIT"</strong> - hodíš všemi dostupnými kostkami</li>
                    <li><strong class="text-neon-orange">Označ kostky</strong> - klikni na kostky s body (rozsvítí se)</li>
                    <li><strong class="text-neon-orange">Klikni "ODLOŽIT"</strong> - odložíš označené kostky</li>
                    <li><strong class="text-neon-orange">Rozhodnutí:</strong> "HODIT" znovu nebo "UKONČIT TAH"</li>
                </ol>
            </div>
            
            <div class="mb-3">
                <h6 class="text-neon-yellow mb-2">💰 Základní bodování</h6>
                <ul class="text-neon-green small mb-0 ps-3">
                    <li><strong class="text-neon-blue">Kostka 1</strong> = 100 bodů</li>
                    <li><strong class="text-neon-blue">Kostka 5</strong> = 50 bodů</li>
                    <li>Ostatní kostky (2, 3, 4, 6) = <strong class="text-neon-red">0 bodů</strong></li>
                </ul>
            </div>
            
            <div class="mb-3">
                <h6 class="text-neon-yellow mb-2">🏆 Kombinace</h6>
                <ul class="text-neon-green small mb-0 ps-3">
                    <li><strong class="text-neon-purple">Tři 1</strong> = 1000 bodů</li>
                    <li><strong class="text-neon-purple">Tři 2</strong> = 200 bodů</li>
                    <li><strong class="text-neon-purple">Tři 3</strong> = 300 bodů</li>
                    <li><strong class="text-neon-purple">Tři 4</strong> = 400 bodů</li>
                    <li><strong class="text-neon-purple">Tři 5</strong> = 500 bodů</li>
                    <li><strong class="text-neon-purple">Tři 6</strong> = 600 bodů</li>
                    <li><strong class="text-neon-blue">Čtyři stejné</strong> = základní body × 2</li>
                    <li><strong class="text-neon-blue">Pět stejných</strong> = základní body × 4</li>
                    <li><strong class="text-neon-blue">Šest stejných</strong> = <strong class="text-neon-yellow">5000 bodů</strong></li>
                </ul>
            </div>
            
            <div class="mb-3">
                <h6 class="text-neon-yellow mb-2">🎰 Speciální kombinace</h6>
                <ul class="text-neon-green small mb-0 ps-3">
                    <li><strong class="text-neon-orange">Tři dvojice</strong> (např. 223344) = <strong class="text-neon-yellow">1500 bodů</strong></li>
                    <li><strong class="text-neon-orange">Postupka</strong> (123456) = <strong class="text-neon-yellow">2000 bodů</strong></li>
                    <li class="text-neon-red small">Pozor: Do tří dvojic se NEPOČÍTAJÍ 1 a 5!</li>
                </ul>
            </div>
            
            <div class="mb-3">
                <h6 class="text-neon-orange mb-2">🔥 HOT DICE</h6>
                <p class="text-neon-green small mb-0">Pokud odložíš <strong>všech 6 kostek</strong>, dostaneš je zpět a můžeš pokračovat v házení!</p>
            </div>
            
            <div class="mb-3">
                <h6 class="text-neon-red mb-2">⚠️ FARKLE (Riziko)</h6>
                <p class="text-neon-red small mb-0">Nehodíš <strong>žádnou 1, 5 nebo kombinaci</strong>? <strong>Ztratíš všechny body z celého tahu!</strong></p>
            </div>
            
            <div class="mb-0">
                <h6 class="text-neon-orange mb-2">🚀 První zápis</h6>
                <p class="text-neon-green small mb-0">Pro první zápis potřebuješ minimálně <strong class="text-neon-yellow">300 bodů</strong> v jednom tahu.</p>
            </div>
        `);
        
        // Wrapper pro scroll a overflow
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'flex-grow-1 overflow-auto mb-2';
        scrollWrapper.appendChild(rulesCard);
        container.appendChild(scrollWrapper);
        
        const backBtn = createNeonButton('ZPĚT', 'orange', 'bi-arrow-left', 
            () => gameState.updateState({ gamePhase: 'menu' }));
        container.appendChild(backBtn);
        
        if (gameArea) {
            gameArea.innerHTML = '';
            gameArea.appendChild(container);
        }
    }

    /**
     * Vykreslí síň slávy
     */
    renderHallOfFame(gameArea) {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100 p-1';
        
        const title = document.createElement('h1');
        title.className = 'text-neon-orange fs-fluid-1 mb-2 text-center';
        title.innerHTML = '<i class="bi bi-trophy-fill"></i> Síň slávy';
        container.appendChild(title);
        
        const table = document.createElement('div');
        table.innerHTML = `
            <table class="table table-sm">
                <thead>
                    <tr><th class="text-neon-orange">Jméno</th><th class="text-neon-orange">Skóre</th></tr>
                </thead>
                <tbody>
                    <tr><td class="text-neon-blue">Hráč</td><td class="text-neon-green">12500</td></tr>
                    <tr><td class="text-neon-blue">Gemini</td><td class="text-neon-green">10800</td></tr>
                </tbody>
            </table>
        `;
        
        container.appendChild(table);
        
        const backBtn = createNeonButton('ZPĚT', 'orange', 'bi-arrow-left', 
            () => gameState.updateState({ gamePhase: 'menu' }));
        container.appendChild(backBtn);
        
        if (gameArea) {
            gameArea.innerHTML = '';
            gameArea.appendChild(container);
        }
    }
}

export default GameScreens;
