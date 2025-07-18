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
            () => gameState.updateState({ gamePhase: 'menu' }),
            'px-4 py-2 mx-auto d-block w-auto text-center d-flex align-items-center justify-content-center fw-bold');
        container.appendChild(backBtn);

        if (gameArea) {
            gameArea.innerHTML = '';
            gameArea.appendChild(container);
        }
    }

    /**
     * Vykreslí síň slávy
     */
    async renderHallOfFame(gameArea, state = null) {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column h-100 p-1';

        const title = document.createElement('h1');
        title.className = 'text-neon-orange fs-fluid-1 mb-2 text-center';
        title.innerHTML = '<i class="bi bi-trophy-fill"></i> Síň slávy';
        container.appendChild(title);

        // Zkontrolujeme, jestli se má zobrazit formulář pro uložení
        if (state && state.showSaveForm && state.lastGameWinner) {
            const saveForm = this.createSaveToHallOfFameForm(state.lastGameWinner);
            container.appendChild(saveForm);

            if (gameArea) {
                gameArea.innerHTML = '';
                gameArea.appendChild(container);
            }
            return;
        }

        const table = document.createElement('div');

        try {
            // Načteme reálná data ze síně slavy
            const { getHallOfFame, clearHallOfFame } = await import('../utils/hallOfFame.js');
            let hallOfFameData = getHallOfFame();

            // Vyfiltrujeme AI a obecné hráče z existujících dat
            const aiNames = ['Gemini', 'ChatGPT', 'Claude', 'AI'];
            const genericNames = ['Hráč', 'Player', 'User'];
            const validEntries = hallOfFameData.filter(entry =>
                !aiNames.includes(entry.name) && !genericNames.includes(entry.name)
            );

            // Pokud se data změnila, aktualizujeme localStorage
            if (validEntries.length !== hallOfFameData.length) {
                clearHallOfFame();
                // Znovu uložíme jen validní záznamy
                const { addScoreToHallOfFame } = await import('../utils/hallOfFame.js');
                for (const entry of validEntries) {
                    addScoreToHallOfFame(entry.name, entry.score);
                }
                hallOfFameData = validEntries;
            }

            let tableContent;
            if (hallOfFameData.length === 0) {
                // Prázdná síň slavy
                tableContent = `
                    <div class="text-center p-4">
                        <i class="bi bi-trophy text-neon-orange fs-1 mb-3 d-block"></i>
                        <p class="text-neon-blue">Zatím žádné záznamy</p>
                        <p class="text-neon-green small">Dokončete hru a staňte se prvním v síni slavy!</p>
                    </div>
                `;
            } else {
                // Zobrazíme reálná data
                const rows = hallOfFameData.map((entry, index) =>
                    `<tr>
                        <td class="text-neon-blue fw-bold">${index + 1}. ${entry.name}</td>
                        <td class="text-neon-green fw-bold">${entry.score.toLocaleString()}</td>
                    </tr>`
                ).join('');

                tableContent = `
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-sm">
                            <thead>
                                <tr>
                                    <th class="text-neon-orange"><i class="bi bi-person-fill me-1"></i>Hráč</th>
                                    <th class="text-neon-green"><i class="bi bi-bar-chart-fill me-1"></i>Skóre</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            table.innerHTML = tableContent;
        } catch (error) {
            console.error('❌ Chyba při načítání síně slavy:', error);
            table.innerHTML = `
                <div class="text-center p-4">
                    <i class="bi bi-exclamation-triangle text-neon-red fs-1 mb-3 d-block"></i>
                    <p class="text-neon-red">Chyba při načítání síně slavy</p>
                </div>
            `;
        }

        container.appendChild(table);

        const backBtn = createNeonButton('ZPĚT', 'orange', 'bi-arrow-left',
            () => gameState.updateState({ gamePhase: 'menu' }),
            'px-4 py-2 mx-auto d-block w-auto text-center d-flex align-items-center justify-content-center fw-bold');
        container.appendChild(backBtn);

        if (gameArea) {
            gameArea.innerHTML = '';
            gameArea.appendChild(container);
        }
    }

    /**
     * Vykreslí obrazovku konce hry s výsledky a možností uložení do síně slávy
     */
    renderGameOver(gameArea, state) {
        if (!gameArea) {
            console.error('❌ GameScreens.renderGameOver: gameArea není dostupný!');
            return;
        }

        const container = document.createElement('div');
        container.className = 'h-100 d-flex flex-column p-3';

        // Najdeme vítěze
        const winner = state.players.find(p => p.score >= state.targetScore) ||
            state.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);

        // Seřadíme hráče podle skóre
        const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);

        // Header s výsledkem
        const header = document.createElement('div');
        header.className = 'text-center mb-3';
        header.innerHTML = `
            <h3 class="text-neon-yellow mb-2">
                🏁 KONEC HRY
            </h3>
            <h4 class="text-neon-green mb-2">🏆 Vítěz: ${winner.name}</h4>
            <h5 class="text-neon-blue">📊 Finální skóre: ${winner.score} bodů</h5>
        `;

        // Tabulka výsledků
        const resultsCard = createNeonCard('📊 FINÁLNÍ VÝSLEDKY', 'blue');
        resultsCard.className += ' mb-4';

        let resultsTable = `
            <div class="table-responsive">
                <table class="table table-dark table-striped table-sm">
                    <thead class="text-neon-yellow">
                        <tr>
                            <th class="text-neon-orange"><i class="bi bi-trophy-fill me-1"></i>Pozice</th>
                            <th class="text-neon-blue"><i class="bi bi-person-fill me-1"></i>Hráč</th>
                            <th class="text-neon-green"><i class="bi bi-bar-chart-fill me-1"></i>Skóre</th>
                            <th class="text-neon-purple"><i class="bi bi-info-circle-fill me-1"></i>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        sortedPlayers.forEach((player, index) => {
            const position = index + 1;
            const isWinner = player === winner;
            const isHuman = !player.isAI;

            let rowClass = '';
            let positionIcon = '';
            let statusBadge = '';

            if (isWinner) {
                rowClass = 'text-neon-yellow fw-bold';
                positionIcon = '<i class="bi bi-trophy-fill text-neon-yellow"></i>';
                statusBadge = '<span class="badge bg-warning text-dark"><i class="bi bi-crown me-1"></i>VÍTĚZ</span>';
            } else if (position === 2) {
                positionIcon = '<i class="bi bi-award-fill text-neon-orange"></i>';
                statusBadge = '<span class="badge bg-secondary text-neon-orange"><i class="bi bi-star me-1"></i>2. MÍSTO</span>';
            } else if (position === 3) {
                positionIcon = '<i class="bi bi-star-fill text-neon-purple"></i>';
                statusBadge = '<span class="badge bg-info text-dark"><i class="bi bi-star me-1"></i>3. MÍSTO</span>';
            } else {
                positionIcon = `<span class="text-neon-blue fw-bold">${position}.</span>`;
                statusBadge = isHuman ?
                    `<span class="badge bg-primary text-neon-yellow"><i class="bi bi-person-fill me-1"></i>${position}. MÍSTO</span>` :
                    `<span class="badge bg-success text-dark"><i class="bi bi-cpu me-1"></i>${position}. MÍSTO</span>`;
            }

            resultsTable += `
                <tr class="${rowClass}">
                    <td>${positionIcon}</td>
                    <td class="text-neon-${player.color}">${player.name}</td>
                    <td class="text-neon-green fw-bold">${player.score}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
        });

        resultsTable += `
                    </tbody>
                </table>
            </div>
        `;

        resultsCard.querySelector('.card-body').innerHTML = resultsTable;

        // Tlačítka akcí
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'd-flex flex-wrap justify-content-center gap-2 mt-auto';

        // Tlačítko pro uložení do síně slávy (pouze pro lidské hráče)
        if (!winner.isAI) {
            const saveToHallBtn = createNeonButton(
                'ULOŽIT DO SÍNĚ SLÁVY',
                'yellow',
                'bi-trophy-fill',
                () => {
                    // Přesměruj na síň slávy s možností uložení
                    gameState.updateState({
                        gamePhase: 'halloffame',
                        lastGameWinner: winner,
                        showSaveForm: true
                    });
                },
                'px-3 py-2'
            );
            actionsDiv.appendChild(saveToHallBtn);
        }

        // Nová hra
        const newGameBtn = createNeonButton(
            'NOVÁ HRA',
            'green',
            'bi-play-circle-fill',
            () => {
                // Reset stavu a spuštění nové hry
                gameState.resetGame();
                gameState.updateState({ gamePhase: 'menu' });
            },
            'px-3 py-2'
        );

        // Síň slávy
        const hallOfFameBtn = createNeonButton(
            'SÍŇ SLÁVY',
            'purple',
            'bi-building-fill',
            () => gameState.updateState({ gamePhase: 'halloffame' }),
            'px-3 py-2'
        );

        // Hlavní menu
        const mainMenuBtn = createNeonButton(
            'MENU',
            'orange',
            'bi-house-fill',
            () => {
                // Import chatSystem pro vymazání zpráv
                import('../ai/chatSystem.js').then(({ default: chatSystem }) => {
                    chatSystem.clearMessages();
                }).catch(console.error);

                gameState.updateState({ gamePhase: 'menu' });
            },
            'px-3 py-2'
        );

        actionsDiv.appendChild(newGameBtn);
        actionsDiv.appendChild(hallOfFameBtn);
        actionsDiv.appendChild(mainMenuBtn);

        // Sestavení celé obrazovky
        container.appendChild(header);
        container.appendChild(resultsCard);
        container.appendChild(actionsDiv);

        gameArea.innerHTML = '';
        gameArea.appendChild(container);

        console.log(`🏁 Hra skončena. Vítěz: ${winner.name} (${winner.isAI ? 'AI' : 'Human'})`);
    }

    /**
     * Vytvoří formulář pro uložení do síně slávy
     */
    createSaveToHallOfFameForm(winner) {
        const formContainer = document.createElement('div');
        formContainer.className = 'flex-grow-1 d-flex flex-column justify-content-center';

        const card = createNeonCard('🏆 GRATULUJI K VÍTĚZSTVÍ!', 'yellow');
        card.className += ' mx-auto';
        card.style.maxWidth = '500px';

        const cardBody = card.querySelector('.card-body');
        cardBody.innerHTML = `
            <div class="text-center mb-4">
                <i class="bi bi-trophy-fill text-neon-yellow display-4 mb-3"></i>
                <h4 class="text-neon-green mb-2">Výborně zahráno!</h4>
                <p class="text-neon-blue mb-2">Skóre: <strong class="text-neon-yellow">${winner.score} bodů</strong></p>
                <p class="text-neon-orange mb-0">Chcete se zapsat do síně slávy?</p>
            </div>
            
            <form id="hallOfFameForm" class="mb-3">
                <div class="mb-3">
                    <label for="playerName" class="form-label text-neon-green">
                        <i class="bi bi-person-fill me-1"></i>Vaše jméno:
                    </label>
                    <input 
                        type="text" 
                        class="form-control bg-dark text-neon-blue border-neon-blue" 
                        id="playerName" 
                        value="${winner.name || ''}"
                        placeholder="Zadejte své jméno..."
                        maxlength="20"
                        required
                    >
                </div>
                
                <div class="d-flex gap-2 justify-content-center">
                    <button type="submit" class="btn btn-neon" data-neon-color="green">
                        <i class="bi bi-check-circle-fill me-1"></i>ULOŽIT
                    </button>
                    <button type="button" class="btn btn-neon" data-neon-color="orange" id="skipSave">
                        <i class="bi bi-x-circle-fill me-1"></i>PŘESKOČIT
                    </button>
                </div>
            </form>
        `;

        // Event handlers pro formulář
        const form = cardBody.querySelector('#hallOfFameForm');
        const skipBtn = cardBody.querySelector('#skipSave');
        const nameInput = cardBody.querySelector('#playerName');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const playerName = nameInput.value.trim();

            if (playerName) {
                try {
                    const { addScoreToHallOfFame } = await import('../utils/hallOfFame.js');
                    await addScoreToHallOfFame(playerName, winner.score);

                    // Zobrazíme potvrzení
                    cardBody.innerHTML = `
                        <div class="text-center">
                            <i class="bi bi-check-circle-fill text-neon-green display-4 mb-3"></i>
                            <h4 class="text-neon-green mb-2">Úspěšně uloženo!</h4>
                            <p class="text-neon-blue mb-3">${playerName} je teď v síni slávy</p>
                            <button type="button" class="btn btn-neon" data-neon-color="blue" id="viewHallOfFame">
                                <i class="bi bi-trophy-fill me-1"></i>ZOBRAZIT SÍŇ SLÁVY
                            </button>
                        </div>
                    `;

                    // Handler pro zobrazení síně slávy
                    cardBody.querySelector('#viewHallOfFame').addEventListener('click', () => {
                        gameState.updateState({
                            gamePhase: 'halloffame',
                            showSaveForm: false,
                            lastGameWinner: null
                        });
                    });

                } catch (error) {
                    console.error('❌ Chyba při ukládání do síně slávy:', error);
                    alert('Chyba při ukládání do síně slávy!');
                }
            }
        });

        skipBtn.addEventListener('click', () => {
            gameState.updateState({
                gamePhase: 'halloffame',
                showSaveForm: false,
                lastGameWinner: null
            });
        });

        // Focus na input
        setTimeout(() => nameInput.focus(), 100);

        formContainer.appendChild(card);
        return formContainer;
    }
}

export default GameScreens;
