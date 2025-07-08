/**
 * 🎲 AI Dice Challenge - Bootstrap Pure Edition - FIXED VERSION
 * Kompletní aplikace s Bootstrap ikonami místo emoji a správnou herní logikou
 */

console.log('🎲 AI Dice Challenge starting...');

class DiceGameApp {
    constructor() {
        // Herní stav
        this.gameState = {
            players: [
                { name: 'Hráč', score: 0, isHuman: true, avatar: 'bi-person-circle', color: 'neon-green' },
                { name: 'Gemini', score: 0, isHuman: false, avatar: 'bi-robot', color: 'neon-blue' },
                { name: 'ChatGPT', score: 0, isHuman: false, avatar: 'bi-cpu-fill', color: 'neon-pink' },
                { name: 'Claude', score: 0, isHuman: false, avatar: 'bi-lightning-charge-fill', color: 'neon-orange' }
            ],
            currentPlayerIndex: 0,
            targetScore: 10000,
            gameStarted: false,
            currentRoll: [],
            selectedDice: [],
            turnScore: 0,
            gamePhase: 'menu' // menu, game, gameOver
        };

        // AI osobnosti pro chat - BEZ EMOJI, jen ikony Bootstrap
        this.aiPersonalities = {
            Gemini: {
                responses: [
                    "Hmm, zajímavý tah!",
                    "Myslím si, že můžeš být trochu odvážnější!",
                    "Dobrá strategie, ale já budu lepší!",
                    "Wow, to byl riskantní tah!"
                ],
                style: 'analytical'
            },
            ChatGPT: {
                responses: [
                    "Ó, to je chytrý tah!",
                    "Hmm, já bych to hrál jinak...",
                    "Zajímavé! Ale počkej, až přijdu na řadu!",
                    "Tvoje štěstí tě brzy opustí!"
                ],
                style: 'confident'
            },
            Claude: {
                responses: [
                    "Skvělá volba!",
                    "Ah, vidím tvou strategii!",
                    "Budu muset být opatrnější...",
                    "Tvoje šance stále rostou!"
                ],
                style: 'encouraging'
            }
        };

        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing application...');
            
            // Čekáme na DOM
            await this.waitForDOM();
            
            // Skryjeme loading screen
            this.hideLoadingScreen();
            
            // Inicializujeme UI
            this.initializeUI();
            
            // Nastavíme event listenery
            this.setupEventListeners();
            
            // Přidáme úvodní zprávy
            this.addWelcomeMessages();
            
            console.log('✅ Application initialized successfully!');
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.showError('Chyba při načítání aplikace. Zkuste obnovit stránku.');
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const app = document.getElementById('app');
            
            if (loadingScreen && app) {
                loadingScreen.classList.add('animate__animated', 'animate__fadeOut');
                app.classList.remove('d-none');
                app.classList.add('animate__animated', 'animate__fadeIn');
                
                setTimeout(() => {
                    loadingScreen.remove();
                }, 800);
            }
        }, 1500);
    }

    initializeUI() {
        this.renderGameMenu();
    }

    renderGameMenu() {
        const gameAreaHTML = `
            <div class="text-center h-100 d-flex flex-column justify-content-center">
                <h1 class="text-neon-green mb-4 animate__animated animate__bounceIn">
                    <i class="bi bi-dice-6-fill text-neon-green"></i> AI Kostková Výzva
                </h1>
                
                <div class="mb-4">
                    <h3 class="text-neon-orange mb-3">
                        <i class="bi bi-star-fill text-neon-orange"></i> Cílové skóre
                    </h3>
                    <div class="d-flex justify-content-center align-items-center gap-3 mb-4">
                        <button class="btn btn-neon-blue" onclick="app.adjustTargetScore(-1000)">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        <span class="fs-3 text-neon-yellow fw-bold" id="targetScoreDisplay">${this.gameState.targetScore}</span>
                        <button class="btn btn-neon-blue" onclick="app.adjustTargetScore(1000)">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>

                <div class="d-flex flex-column gap-3 align-items-center">
                    <button class="btn btn-neon-green btn-lg px-5 animate__animated animate__pulse animate__infinite" 
                            onclick="app.startGame()">
                        <i class="bi bi-play-fill"></i> ZAČÍT HRU
                    </button>
                    
                    <button class="btn btn-neon-blue px-4" onclick="app.showRules()">
                        <i class="bi bi-book-fill"></i> Pravidla
                    </button>
                    
                    <button class="btn btn-neon-orange px-4" onclick="app.showHallOfFame()">
                        <i class="bi bi-trophy-fill"></i> Síň slávy
                    </button>
                </div>
            </div>
        `;

        document.getElementById('gameArea').innerHTML = gameAreaHTML;
        document.getElementById('gameAreaMobile').innerHTML = gameAreaHTML;
    }

    adjustTargetScore(change) {
        this.gameState.targetScore = Math.max(1000, this.gameState.targetScore + change);
        this.gameState.targetScore = Math.min(50000, this.gameState.targetScore);
        
        document.querySelectorAll('#targetScoreDisplay').forEach(element => {
            element.textContent = this.gameState.targetScore;
            element.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                element.classList.remove('animate__animated', 'animate__pulse');
            }, 600);
        });
    }

    startGame() {
        this.gameState.gameStarted = true;
        this.gameState.gamePhase = 'game';
        this.gameState.currentPlayerIndex = 0;
        
        // Reset scores
        this.gameState.players.forEach(player => player.score = 0);
        
        this.addChatMessage('Systém', 'Hra začíná! Cíl: ' + this.gameState.targetScore + ' bodů!', 'system');
        this.renderGameBoard();
        this.startPlayerTurn();
    }

    renderGameBoard() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        const gameHTML = `
            <div class="h-100 d-flex flex-column">
                <!-- Player Info - Responzivní avatary v jedné řadě -->
                <div class="row mb-3 g-2">
                    ${this.gameState.players.map((player, index) => `
                        <div class="col-3">
                            <div class="player-card ${index === this.gameState.currentPlayerIndex ? 'active' : ''} ${this.getPlayerCardClass(player)} p-2 text-center">
                                <div class="avatar-container mb-1">
                                    <i class="bi ${player.avatar} text-${player.color} fs-3 fs-md-2 fs-lg-1"></i>
                                </div>
                                <div class="player-name fw-bold text-${player.color} small">${player.name}</div>
                                <div class="player-score text-${player.color} small">${player.score}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Game Controls -->
                <div class="flex-grow-1 d-flex flex-column justify-content-center">
                    <div class="text-center mb-4">
                        <h4 class="text-neon-green mb-2">Na řadě: <i class="bi ${currentPlayer.avatar} text-${currentPlayer.color}"></i> ${currentPlayer.name}</h4>
                        <div class="text-neon-yellow fs-6">Skóre tahu: <span id="turnScore">${this.gameState.turnScore}</span></div>
                    </div>

                    <!-- Dice Area -->
                    <div class="text-center mb-4">
                        <div id="diceContainer" class="d-flex justify-content-center gap-2 gap-md-3 flex-wrap mb-3">
                            ${this.generateDiceHTML()}
                        </div>
                        
                        ${currentPlayer.isHuman ? `
                            <div class="game-buttons d-flex justify-content-center gap-2 flex-wrap">
                                <button class="btn btn-success text-white" onclick="app.rollDice()" id="rollBtn">
                                    <i class="bi bi-dice-6-fill"></i> Hodit
                                </button>
                                <button class="btn btn-primary text-white" onclick="app.holdDice()" id="holdBtn" disabled>
                                    <i class="bi bi-collection-fill"></i> Odložit
                                </button>
                                <button class="btn btn-warning text-white" onclick="app.endTurn()" id="endBtn">
                                    <i class="bi bi-stop-fill"></i> Ukončit tah
                                </button>
                            </div>
                        ` : `
                            <div class="text-center">
                                <div class="spinner-border text-neon-blue" role="status">
                                    <span class="visually-hidden">AI přemýšlí...</span>
                                </div>
                                <div class="mt-2 text-neon-blue">AI přemýšlí...</div>
                            </div>
                        `}
                    </div>

                    <!-- Game Info -->
                    <div class="text-center mt-auto">
                        <button class="btn btn-danger text-white btn-sm" onclick="app.endGame()">
                            <i class="bi bi-stop-circle-fill"></i> Ukončit hru
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('gameArea').innerHTML = gameHTML;
        document.getElementById('gameAreaMobile').innerHTML = gameHTML;
        
        this.setupDiceClickHandlers();
    }

    getPlayerCardClass(player) {
        return `border-${player.color}`;
    }

    generateDiceHTML() {
        if (this.gameState.currentRoll.length === 0) {
            return '<div class="text-muted">Hoďte kostkami pro začátek tahu</div>';
        }

        return this.gameState.currentRoll.map((value, index) => `
            <div class="dice ${this.gameState.selectedDice.includes(index) ? 'selected' : ''}" 
                 data-index="${index}" data-value="${value}">
                ${value}
            </div>
        `).join('');
    }

    setupDiceClickHandlers() {
        document.querySelectorAll('.dice').forEach(dice => {
            dice.addEventListener('click', (e) => {
                if (!this.gameState.players[this.gameState.currentPlayerIndex].isHuman) return;
                
                const index = parseInt(e.target.dataset.index);
                this.toggleDiceSelection(index);
            });
        });
    }

    toggleDiceSelection(index) {
        const selectedIndex = this.gameState.selectedDice.indexOf(index);
        
        if (selectedIndex > -1) {
            // Odznačit kostku
            this.gameState.selectedDice.splice(selectedIndex, 1);
        } else {
            // Označit kostku
            this.gameState.selectedDice.push(index);
        }
        
        // Přepočítat skóre a ověřit validitu výběru
        this.calculateTurnScore();
        this.updateDiceDisplay();
    }

    updateDiceDisplay() {
        document.querySelectorAll('.dice').forEach(dice => {
            const index = parseInt(dice.dataset.index);
            if (this.gameState.selectedDice.includes(index)) {
                dice.classList.add('selected');
            } else {
                dice.classList.remove('selected');
            }
        });
    }

    rollDice() {
        const numDice = this.gameState.currentRoll.length === 0 ? 6 : (6 - this.gameState.selectedDice.length);
        
        if (numDice <= 0) {
            this.showError('Musíte ponechat alespoň jednu kostku!');
            return;
        }

        // Generování náhodných hodnot
        this.gameState.currentRoll = Array.from({length: numDice}, () => 
            Math.floor(Math.random() * 6) + 1
        );
        this.gameState.selectedDice = [];
        
        this.updateGameDisplay();
        this.addChatMessage('Systém', `Hod: ${this.gameState.currentRoll.join(', ')}`, 'system');
        
        // Kontrola na FARKLE
        if (!this.hasValidCombination()) {
            this.handleFarkle();
            return;
        }
    }

    hasValidCombination() {
        const counts = {};
        this.gameState.currentRoll.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });

        // Kontrola speciálních kombinací pro celý hod (6 kostek)
        if (this.gameState.currentRoll.length === 6) {
            // Postupka (Straight): 1-2-3-4-5-6
            const sorted = this.gameState.currentRoll.slice().sort();
            if (sorted.join(',') === '1,2,3,4,5,6') {
                return true;
            }
            
            // Tři páry
            const pairs = Object.values(counts).filter(count => count === 2).length;
            if (pairs === 3 && Object.keys(counts).length === 3) {
                return true;
            }
        }

        // Jedničky a pětky jsou vždy platné
        if (counts[1] || counts[5]) return true;
        
        // Tři nebo více stejných čísel
        for (let value in counts) {
            if (counts[value] >= 3) return true;
        }
        
        return false;
    }

    // Validace výběru kostek podle pravidel Farkle
    isValidSelection() {
        const selectedValues = this.gameState.selectedDice.map(index => 
            this.gameState.currentRoll[index]
        );
        
        if (selectedValues.length === 0) return false;
        
        const counts = {};
        selectedValues.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });
        
        // Kontrola speciálních kombinací pro všech 6 kostek
        if (selectedValues.length === 6) {
            // Postupka (1-2-3-4-5-6)
            const sorted = selectedValues.slice().sort().join(',');
            if (sorted === '1,2,3,4,5,6') return true;
            
            // Tři páry
            const pairs = Object.values(counts).filter(count => count === 2).length;
            if (pairs === 3 && Object.keys(counts).length === 3) return true;
        }
        
        // Validace jednotlivých hodnot
        for (let value in counts) {
            const count = counts[value];
            const num = parseInt(value);
            
            if (num === 1 || num === 5) {
                // Jedničky a pětky jsou vždy platné (jednotlivě i ve skupinách)
                continue;
            } else {
                // Ostatní čísla musí být minimálně 3
                if (count > 0 && count < 3) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    calculateTurnScore() {
        const selectedValues = this.gameState.selectedDice.map(index => 
            this.gameState.currentRoll[index]
        );

        // Pokud nejsou vybrané žádné kostky, skóre je 0
        if (selectedValues.length === 0) {
            this.gameState.turnScore = 0;
            this.updateScoreDisplay();
            return;
        }

        // Zkontroluj validitu výběru
        if (!this.isValidSelection()) {
            this.gameState.turnScore = 0;
            this.updateScoreDisplay();
            return;
        }

        let score = 0;
        const counts = {};
        
        selectedValues.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });

        // Kontrola na speciální kombinace
        if (selectedValues.length === 6) {
            // Postupka (Straight): 1-2-3-4-5-6 = 1500 bodů
            const sorted = selectedValues.slice().sort();
            if (sorted.join(',') === '1,2,3,4,5,6') {
                this.gameState.turnScore = 1500;
                this.updateScoreDisplay();
                return;
            }
            
            // Tři páry = 1500 bodů
            const pairs = Object.values(counts).filter(count => count === 2).length;
            if (pairs === 3 && Object.keys(counts).length === 3) {
                this.gameState.turnScore = 1500;
                this.updateScoreDisplay();
                return;
            }
        }

        // Bodování podle správných Farkle pravidel
        for (let value in counts) {
            const count = counts[value];
            const num = parseInt(value);
            
            if (num === 1) {
                // Jedničky: 3+ = 1000, zbytek × 100
                if (count >= 3) {
                    if (count === 3) score += 1000;
                    else if (count === 4) score += 2000;
                    else if (count === 5) score += 4000;
                    else if (count === 6) score += 8000;
                } else {
                    score += count * 100; // Jednotlivé jedničky
                }
            } else if (num === 5) {
                // Pětky: 3+ = 500, zbytek × 50
                if (count >= 3) {
                    if (count === 3) score += 500;
                    else if (count === 4) score += 1000;
                    else if (count === 5) score += 2000;
                    else if (count === 6) score += 4000;
                } else {
                    score += count * 50; // Jednotlivé pětky
                }
            } else {
                // Ostatní čísla: pouze 3+ kostky bodují
                if (count >= 3) {
                    const baseScore = num * 100;
                    if (count === 3) score += baseScore;
                    else if (count === 4) score += baseScore * 2;
                    else if (count === 5) score += baseScore * 4;
                    else if (count === 6) score += baseScore * 8;
                }
            }
        }

        this.gameState.turnScore = score;
        this.updateScoreDisplay();
        
        // Aktivuj/deaktivuj tlačítko podle pravidel Farkle
        const holdBtn = document.getElementById('holdBtn');
        if (holdBtn) {
            // Musí mít nějaké body a minimálně 300 pro vstup do hry
            const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            const minScore = currentPlayer.score === 0 ? 300 : 0; // Vstup do hry vyžaduje 300
            holdBtn.disabled = score === 0 || this.gameState.turnScore < minScore;
        }
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('turnScore');
        if (scoreElement) {
            scoreElement.textContent = this.gameState.turnScore;
            scoreElement.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                scoreElement.classList.remove('animate__animated', 'animate__pulse');
            }, 600);
        }
    }

    updateGameDisplay() {
        const diceContainer = document.getElementById('diceContainer');
        if (diceContainer) {
            diceContainer.innerHTML = this.generateDiceHTML();
            this.setupDiceClickHandlers();
        }
    }

    // OPRAVENÁ FUNKCE: holdDice místo keepScore
    holdDice() {
        if (this.gameState.turnScore === 0) return;
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        // Farkle pravidlo: Vstup do hry vyžaduje minimálně 300 bodů v jednom tahu
        if (currentPlayer.score === 0 && this.gameState.turnScore < 300) {
            this.showError('Pro vstup do hry potřebujete minimálně 300 bodů v jednom tahu!');
            return;
        }
        
        currentPlayer.score += this.gameState.turnScore;
        
        this.addChatMessage('Systém', `${currentPlayer.name} získal ${this.gameState.turnScore} bodů! Celkem: ${currentPlayer.score}`, 'system');
        
        // Kontrola výhry
        if (currentPlayer.score >= this.gameState.targetScore) {
            this.endGame(currentPlayer);
            return;
        }
        
        // Hot Dice pravidlo: Pokud použil všech 6 kostek, dostává nových 6
        if (this.gameState.selectedDice.length === 6) {
            this.addChatMessage('Systém', 'HOT DICE! Můžete pokračovat s novými 6 kostkami!', 'system');
            this.gameState.currentRoll = [];
            this.gameState.selectedDice = [];
            // NERESTARTUJEME turnScore - body se kumulují v Hot Dice
            this.renderGameBoard();
            return;
        }
        
        this.gameState.turnScore = 0;
        this.gameState.currentRoll = [];
        this.gameState.selectedDice = [];
        this.renderGameBoard();
    }

    endTurn() {
        this.gameState.turnScore = 0;
        this.gameState.currentRoll = [];
        this.gameState.selectedDice = [];
        this.nextPlayer();
    }

    handleFarkle() {
        this.addChatMessage('Systém', 'FARKLE! Všechny body tahu jsou ztraceny!', 'system');
        this.gameState.turnScore = 0;
        this.gameState.currentRoll = [];
        this.gameState.selectedDice = [];
        this.nextPlayer();
    }

    nextPlayer() {
        this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
        this.renderGameBoard();
        this.startPlayerTurn();
    }

    startPlayerTurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        if (!currentPlayer.isHuman) {
            // AI tah
            setTimeout(() => {
                this.playAITurn();
            }, 1500);
        }
    }

    playAITurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        // Simulace AI hry
        this.rollDice();
        
        setTimeout(() => {
            // AI vybere kostky (pokročilejší logika)
            const validIndices = [];
            const counts = {};
            
            this.gameState.currentRoll.forEach((value, index) => {
                counts[value] = (counts[value] || 0) + 1;
                if (value === 1 || value === 5) {
                    validIndices.push(index);
                }
            });

            // Vybrat bezpečné kostky (jedničky a pětky)
            if (validIndices.length > 0) {
                this.gameState.selectedDice = validIndices.slice(0, Math.max(1, Math.floor(validIndices.length / 2)));
                this.calculateTurnScore();
                this.updateDiceDisplay();
                
                setTimeout(() => {
                    // AI rozhodnutí: být konzervativní nebo riskovat
                    const shouldContinue = Math.random() > 0.6;
                    
                    if (shouldContinue && this.gameState.turnScore > 200) {
                        this.holdDice();
                    } else {
                        this.endTurn();
                    }
                    
                    // Přidat AI reakci
                    const responses = this.aiPersonalities[currentPlayer.name].responses;
                    const reaction = responses[Math.floor(Math.random() * responses.length)];
                    this.addChatMessage(currentPlayer.name, reaction, 'ai');
                }, 1000);
            } else {
                // Nemá validní kostky - FARKLE
                this.handleFarkle();
            }
        }, 1500);
    }

    endGame(winner = null) {
        this.gameState.gamePhase = 'gameOver';
        
        if (!winner) {
            // Najít vítěze
            winner = this.gameState.players.reduce((prev, current) => 
                prev.score > current.score ? prev : current
            );
        }
        
        if (winner) {
            const message = `${winner.name} vyhrál s ${winner.score} body!`;
            this.addChatMessage('Systém', message, 'system');
            
            // Zobrazit dialog s výsledky
            this.showGameResults(winner);
        }
        
        // Návrat do menu
        setTimeout(() => {
            this.gameState.gamePhase = 'menu';
            this.renderGameMenu();
        }, 5000);
    }

    showGameResults(winner) {
        Swal.fire({
            title: 'Vítěz!',
            html: `
                <div class="text-center">
                    <div class="fs-1 mb-3"><i class="bi ${winner.avatar} text-${winner.color}"></i></div>
                    <h3 class="text-${winner.color}">${winner.name}</h3>
                    <p>Skóre: ${winner.score} bodů</p>
                    <hr>
                    <h5>Finální pořadí:</h5>
                    ${this.gameState.players
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => `
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>${index + 1}. <i class="bi ${player.avatar} text-${player.color}"></i> ${player.name}</span>
                                <span class="fw-bold">${player.score} bodů</span>
                            </div>
                        `).join('')}
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Nová hra',
            background: '#0d1117',
            color: '#39ff14'
        });
    }

    showRules() {
        Swal.fire({
            title: 'Pravidla hry',
            html: `
                <div class="text-start">
                    <h5><i class="bi bi-target text-neon-green"></i> Cíl hry:</h5>
                    <p>Dosáhněte cílového skóre jako první!</p>
                    
                    <h5><i class="bi bi-dice-6-fill text-neon-blue"></i> Bodování:</h5>
                    <ul>
                        <li><strong>1</strong> = 100 bodů (3× = 1000 bodů)</li>
                        <li><strong>5</strong> = 50 bodů (3× = 500 bodů)</li>
                        <li><strong>3× stejná čísla</strong> = číslo × 100 bodů</li>
                        <li><strong>4× stejná</strong> = dvojnásobek</li>
                        <li><strong>5× stejná</strong> = čtyřnásobek</li>
                        <li><strong>6× stejná</strong> = osminásobek</li>
                    </ul>
                    
                    <h5><i class="bi bi-stars text-neon-orange"></i> Speciální kombinace:</h5>
                    <ul>
                        <li><strong>Postupka (1-2-3-4-5-6)</strong> = 1500 bodů</li>
                        <li><strong>Tři páry</strong> = 1500 bodů</li>
                    </ul>
                    
                    <h5><i class="bi bi-fire text-neon-red"></i> Hot Dice:</h5>
                    <p>Pokud odložíte všech 6 kostek, dostanete nových 6 a můžete pokračovat!</p>
                    
                    <h5><i class="bi bi-x-circle text-neon-red"></i> FARKLE:</h5>
                    <p>Pokud nehodíte žádnou bodující kostku, přicházíte o všechny body tahu!</p>
                </div>
            `,
            confirmButtonText: 'Rozumím',
            background: '#0d1117',
            color: '#39ff14'
        });
    }

    showHallOfFame() {
        Swal.fire({
            title: 'Síň slávy',
            html: `
                <div class="text-center">
                    <div class="fs-1 mb-3"><i class="bi bi-trophy-fill text-neon-yellow"></i></div>
                    <p>Zatím žádní šampioni!</p>
                    <p class="text-muted">Vyhrajte první hru a stanete se legendou!</p>
                </div>
            `,
            confirmButtonText: 'Zavřít',
            background: '#0d1117',
            color: '#39ff14'
        });
    }

    setupEventListeners() {
        // Chat input handlers
        ['chatInput', 'chatInputMobile'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendChatMessage();
                    }
                });
            }
        });

        // Chat send button handlers
        ['sendChatBtn', 'sendChatBtnMobile'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.sendChatMessage();
                });
            }
        });
    }

    sendChatMessage() {
        const inputs = ['chatInput', 'chatInputMobile'];
        let message = '';
        let activeInput = null;

        for (const inputId of inputs) {
            const input = document.getElementById(inputId);
            if (input && input.value.trim()) {
                message = input.value.trim();
                activeInput = input;
                break;
            }
        }

        if (message) {
            this.addChatMessage('Hráč', message, 'player');
            activeInput.value = '';
            
            // AI odpověď
            setTimeout(() => {
                const aiPlayers = this.gameState.players.filter(p => !p.isHuman);
                if (aiPlayers.length > 0) {
                    const randomAI = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
                    const responses = this.aiPersonalities[randomAI.name].responses;
                    const response = responses[Math.floor(Math.random() * responses.length)];
                    this.addChatMessage(randomAI.name, response, 'ai');
                }
            }, 1000 + Math.random() * 2000);
        }
    }

    addChatMessage(sender, message, type) {
        const messageHTML = `
            <div class="chat-message ${type}">
                <strong>${sender}:</strong> ${message}
            </div>
        `;

        ['chatMessages', 'chatMessagesMobile'].forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML += messageHTML;
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    addWelcomeMessages() {
        setTimeout(() => {
            this.addChatMessage('Systém', 'Vítejte v AI Kostkové Výzvě!', 'system');
        }, 2000);

        setTimeout(() => {
            this.addChatMessage('Gemini', 'Připravte se na analytickou výzvu!', 'ai');
        }, 3000);

        setTimeout(() => {
            this.addChatMessage('ChatGPT', 'Bude to skvělá hra!', 'ai');
        }, 4000);

        setTimeout(() => {
            this.addChatMessage('Claude', 'Bude to zábava! Hodně štěstí!', 'ai');
        }, 5000);
    }

    showError(message) {
        Swal.fire({
            title: 'Chyba',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            background: '#0d1117',
            color: '#ff3131'
        });
    }
}

// Globální inicializace
window.app = new DiceGameApp();
