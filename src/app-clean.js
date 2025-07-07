/**
 * 🎲 AI Dice Challenge - Bootstrap Pure Edition
 * Kompletní aplikace s využitím externích knihoven
 */

console.log('🎲 AI Dice Challenge starting...');

class DiceGameApp {
    constructor() {
        // Herní stav
        this.gameState = {
            players: [
                { name: 'Hráč', score: 0, isHuman: true, avatar: '👤' },
                { name: 'Gemini', score: 0, isHuman: false, avatar: '🤖' },
                { name: 'ChatGPT', score: 0, isHuman: false, avatar: '🧠' },
                { name: 'Claude', score: 0, isHuman: false, avatar: '⚡' }
            ],
            currentPlayerIndex: 0,
            targetScore: 10000,
            gameStarted: false,
            currentRoll: [],
            selectedDice: [],
            turnScore: 0,
            gamePhase: 'menu' // menu, game, gameOver
        };

        // AI osobnosti pro chat
        this.aiPersonalities = {
            Gemini: {
                responses: [
                    "Hmm, zajímavý tah! 🔍",
                    "Myslím si, že můžeš být trochu odvážnější! ⚡",
                    "Dobrá strategie, ale já budu lepší! 🎯",
                    "Wow, to byl riskantní tah! ⚠️"
                ],
                style: 'analytical'
            },
            ChatGPT: {
                responses: [
                    "Ó, to je chytrý tah! 🧠",
                    "Hmm, já bych to hrál jinak... �",
                    "Zajímavé! Ale počkej, až přijdu na řadu! ✨",
                    "Tvoje štěstí tě brzy opustí! 👑"
                ],
                style: 'confident'
            },
            Claude: {
                responses: [
                    "Skvělá volba! 👍",
                    "Ah, vidím tvou strategii! ⚡",
                    "Budu muset být opatrnější... 🤔",
                    "Tvoje šance stále rostou! 📈"
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
                    🎲 AI Kostková Výzva
                </h1>
                
                <div class="mb-4">
                    <h3 class="text-neon-orange mb-3">⭐ Cílové skóre</h3>
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
                        <i class="bi bi-book"></i> Pravidla
                    </button>
                    
                    <button class="btn btn-neon-orange px-4" onclick="app.showHallOfFame()">
                        <i class="bi bi-trophy"></i> Síň slávy
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
        
        this.addChatMessage('Systém', '🎮 Hra začíná! Cíl: ' + this.gameState.targetScore + ' bodů!', 'system');
        this.renderGameBoard();
        this.startPlayerTurn();
    }

    renderGameBoard() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        const gameHTML = `
            <div class="h-100 d-flex flex-column">
                <!-- Player Info -->
                <div class="row mb-3">
                    ${this.gameState.players.map((player, index) => `
                        <div class="col-lg-3 col-md-6 col-6 mb-2">
                            <div class="player-card ${index === this.gameState.currentPlayerIndex ? 'active' : ''} ${player.isHuman ? 'human' : ''}">
                                <div class="text-center">
                                    <div class="fs-4 mb-1">${player.avatar}</div>
                                    <div class="fw-bold ${index === this.gameState.currentPlayerIndex ? 'text-neon-green' : 'text-light'}">${player.name}</div>
                                    <div class="text-neon-blue">${player.score} bodů</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Game Controls -->
                <div class="flex-grow-1 d-flex flex-column justify-content-center">
                    <div class="text-center mb-4">
                        <h3 class="text-neon-green">Na řadě: ${currentPlayer.avatar} ${currentPlayer.name}</h3>
                        <div class="text-neon-yellow fs-5">Aktuální skóre tahu: <span id="turnScore">${this.gameState.turnScore}</span></div>
                    </div>

                    <!-- Dice Area -->
                    <div class="text-center mb-4">
                        <div id="diceContainer" class="d-flex justify-content-center gap-3 flex-wrap mb-3">
                            ${this.generateDiceHTML()}
                        </div>
                        
                        ${currentPlayer.isHuman ? `
                            <div class="d-flex justify-content-center gap-3 flex-wrap">
                                <button class="btn btn-neon-green" onclick="app.rollDice()" id="rollBtn">
                                    <i class="bi bi-dice-6"></i> Hodit kostky
                                </button>
                                <button class="btn btn-neon-blue" onclick="app.keepScore()" id="keepBtn" disabled>
                                    <i class="bi bi-check-lg"></i> Ponechat skóre
                                </button>
                                <button class="btn btn-neon-orange" onclick="app.endTurn()" id="endBtn">
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
                        <button class="btn btn-neon-red btn-sm" onclick="app.endGame()">
                            <i class="bi bi-stop-circle"></i> Ukončit hru
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('gameArea').innerHTML = gameHTML;
        document.getElementById('gameAreaMobile').innerHTML = gameHTML;
        
        this.setupDiceClickHandlers();
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
            this.gameState.selectedDice.splice(selectedIndex, 1);
        } else {
            this.gameState.selectedDice.push(index);
        }
        
        this.updateDiceDisplay();
        this.calculateTurnScore();
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
        this.addChatMessage('Systém', `🎲 Hod: ${this.gameState.currentRoll.join(', ')}`, 'system');
        
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

    calculateTurnScore() {
        const selectedValues = this.gameState.selectedDice.map(index => 
            this.gameState.currentRoll[index]
        );

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
        const keepBtn = document.getElementById('keepBtn');
        if (keepBtn) {
            // Musí mít nějaké body a minimálně 300 pro vstup do hry
            const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            const minScore = currentPlayer.score === 0 ? 300 : 0; // Vstup do hry vyžaduje 300
            keepBtn.disabled = score === 0 || this.gameState.turnScore < minScore;
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

    keepScore() {
        if (this.gameState.turnScore === 0) return;
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        // Farkle pravidlo: Vstup do hry vyžaduje minimálně 300 bodů v jednom tahu
        if (currentPlayer.score === 0 && this.gameState.turnScore < 300) {
            this.showError('Pro vstup do hry potřebujete minimálně 300 bodů v jednom tahu!');
            return;
        }
        
        currentPlayer.score += this.gameState.turnScore;
        
        this.addChatMessage('Systém', `✅ ${currentPlayer.name} získal ${this.gameState.turnScore} bodů! Celkem: ${currentPlayer.score}`, 'system');
        
        // Kontrola výhry
        if (currentPlayer.score >= this.gameState.targetScore) {
            this.endGame(currentPlayer);
            return;
        }
        
        // Hot Dice pravidlo: Pokud použil všech 6 kostek, dostává nových 6
        if (this.gameState.selectedDice.length === 6) {
            this.addChatMessage('Systém', '🔥 HOT DICE! Můžete pokračovat s novými 6 kostkami!', 'system');
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
        this.addChatMessage('Systém', '💥 FARKLE! Všechny body tahu jsou ztraceny!', 'system');
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
            });
            
            // AI vybírá kostky podle priority:
            // 1. Nejprv trojice
            for (let i = 1; i <= 6; i++) {
                if (counts[i] >= 3) {
                    this.gameState.currentRoll.forEach((value, index) => {
                        if (value === i) validIndices.push(index);
                    });
                    break; // Vybere pouze jednu trojici za tah
                }
            }
            
            // 2. Pokud žádná trojice, vybere jedničky a pětky
            if (validIndices.length === 0) {
                this.gameState.currentRoll.forEach((value, index) => {
                    if (value === 1 || value === 5) {
                        validIndices.push(index);
                    }
                });
            }
            
            if (validIndices.length > 0) {
                this.gameState.selectedDice = validIndices;
                this.calculateTurnScore();
                
                setTimeout(() => {
                    // AI rozhodování podle osobnosti a pravidel Farkle
                    const minRequired = currentPlayer.score === 0 ? 300 : 0; // Vstup do hry
                    const shouldContinue = this.shouldAIContinue(currentPlayer, this.gameState.turnScore, minRequired);
                    
                    if (shouldContinue && this.gameState.currentRoll.length > validIndices.length) {
                        // Odstraň vybrané kostky a pokračuj
                        const remainingDice = [];
                        this.gameState.currentRoll.forEach((value, index) => {
                            if (!this.gameState.selectedDice.includes(index)) {
                                remainingDice.push(value);
                            }
                        });
                        this.gameState.currentRoll = remainingDice;
                        this.gameState.selectedDice = [];
                        this.playAITurn(); // Pokračuj s menšími kostkami
                    } else {
                        this.keepScore(); // Vezmi body
                    }
                    
                    // Přidej AI reakci
                    this.addRandomAIResponse(currentPlayer.name);
                }, 1000);
            } else {
                this.handleFarkle();
            }
        }, 1000);
    }

    shouldAIContinue(player, currentScore, minRequired) {
        const remainingDice = this.gameState.currentRoll.length - this.gameState.selectedDice.length;
        
        // DŮLEŽITÉ: Pokud hráč není v hře a nemá 300+ bodů, MUSÍ pokračovat
        if (player.score === 0 && currentScore < 300 && remainingDice > 0) {
            return true; // POVINNĚ pokračovat, dokud nemá 300 bodů
        }
        
        // Pokud už splňuje minimum nebo je v hře, rozhoduje podle osobnosti
        switch(player.name) {
            case 'Gemini':
                // Konzervativní - ale respektuje 300 bodové minimum
                const geminiThreshold = Math.max(300, 400);
                return currentScore < geminiThreshold && remainingDice >= 3 && Math.random() > 0.6;
            
            case 'ChatGPT':
                // Riskantní - ale respektuje 300 bodové minimum
                const chatgptThreshold = Math.max(300, 600);
                return currentScore < chatgptThreshold && remainingDice >= 2 && Math.random() > 0.4;
            
            case 'Claude':
                // Vyvážený - ale respektuje 300 bodové minimum
                const leadingScore = Math.max(...this.gameState.players.map(p => p.score));
                const isLeading = player.score >= leadingScore;
                const claudeThreshold = Math.max(300, isLeading ? 350 : 500);
                return currentScore < claudeThreshold && remainingDice >= 2 && Math.random() > 0.5;
            
            default:
                return false;
        }
    }

    addRandomAIResponse(aiName) {
        if (this.aiPersonalities[aiName]) {
            const responses = this.aiPersonalities[aiName].responses;
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setTimeout(() => {
                this.addChatMessage(aiName, randomResponse, 'ai');
            }, 500);
        }
    }

    endGame(winner = null) {
        this.gameState.gamePhase = 'gameOver';
        
        if (winner) {
            const message = `🏆 ${winner.name} vyhrál s ${winner.score} body!`;
            this.addChatMessage('Systém', message, 'system');
            this.showWinModal(winner);
        } else {
            this.addChatMessage('Systém', '🛑 Hra byla ukončena.', 'system');
        }
        
        setTimeout(() => {
            this.renderGameMenu();
        }, 3000);
    }

    showWinModal(winner) {
        Swal.fire({
            title: '🏆 Vítěz!',
            html: `
                <div class="text-center">
                    <div style="font-size: 4rem; margin: 20px 0;">${winner.avatar}</div>
                    <h3>${winner.name}</h3>
                    <p class="text-muted">Vítězí s ${winner.score} body!</p>
                </div>
            `,
            icon: 'success',
            background: '#1a1a1a',
            color: '#39ff14',
            confirmButtonText: 'Nová hra',
            confirmButtonColor: '#39ff14',
            showCancelButton: true,
            cancelButtonText: 'Hlavní menu'
        }).then((result) => {
            if (result.isConfirmed) {
                this.startGame();
            } else {
                this.renderGameMenu();
            }
        });
    }

    showRules() {
        Swal.fire({
            title: '📖 Pravidla Farkle',
            html: `
                <div class="text-start">
                    <h5>🎯 Cíl hry:</h5>
                    <p>Získejte ${this.gameState.targetScore} bodů jako první!</p>
                    
                    <h5>🚪 Vstup do hry:</h5>
                    <p><strong>Musíte získat minimálně 300 bodů v jednom tahu!</strong><br>
                    Dokud nezískáte 300+ bodů, vaše skóre se neuchovává.</p>
                    
                    <h5>🎲 Bodování:</h5>
                    <ul>
                        <li><strong>Jedničky:</strong> 100 bodů (3× = 1000, 4× = 2000, 5× = 4000, 6× = 8000)</li>
                        <li><strong>Pětky:</strong> 50 bodů (3× = 500, 4× = 1000, 5× = 2000, 6× = 4000)</li>
                        <li><strong>Ostatní čísla:</strong> pouze 3+ kostky bodují</li>
                        <li>3×2 = 200, 3×3 = 300, 3×4 = 400, 3×6 = 600</li>
                        <li>4+ kostky: základní × 2, 5+ × 4, 6+ × 8</li>
                    </ul>
                    
                    <h5>✨ Speciální kombinace:</h5>
                    <ul>
                        <li><strong>Postupka (1-2-3-4-5-6):</strong> 1500 bodů</li>
                        <li><strong>Tři páry:</strong> 1500 bodů</li>
                    </ul>
                    
                    <h5>🔥 Hot Dice:</h5>
                    <p>Pokud použijete všech 6 kostek, dostanete nových 6 a můžete pokračovat!</p>
                    
                    <h5>💥 FARKLE:</h5>
                    <p>Pokud nehodíte žádnou bodovací kombinaci, ztratíte všechny body tahu!</p>
                </div>
            `,
            background: '#1a1a1a',
            color: '#39ff14',
            confirmButtonText: 'Rozumím',
            confirmButtonColor: '#007bff',
            width: '600px'
        });
    }

    showHallOfFame() {
        const scores = JSON.parse(localStorage.getItem('diceGameScores') || '[]');
        
        Swal.fire({
            title: '🏆 Síň slávy',
            html: `
                <div class="text-start">
                    ${scores.length > 0 ? scores.slice(0, 10).map((score, index) => `
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span>${index + 1}. ${score.name}</span>
                            <span class="text-neon-yellow">${score.score} bodů</span>
                        </div>
                    `).join('') : '<p class="text-muted text-center">Zatím žádné záznamy</p>'}
                </div>
            `,
            background: '#1a1a1a',
            color: '#39ff14',
            confirmButtonText: 'Zavřít',
            confirmButtonColor: '#007bff'
        });
    }

    setupEventListeners() {
        // Chat functionality
        ['chatInput', 'chatInputMobile'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendChatMessage(inputId);
                    }
                });
            }
        });

        ['sendChatBtn', 'sendChatBtnMobile'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    const inputId = btnId.includes('Mobile') ? 'chatInputMobile' : 'chatInput';
                    this.sendChatMessage(inputId);
                });
            }
        });
    }

    sendChatMessage(inputId) {
        const input = document.getElementById(inputId);
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        this.addChatMessage('Hráč', message, 'user');
        input.value = '';

        // Simulace AI odpovědi
        setTimeout(() => {
            const aiNames = ['Gemini', 'ChatGPT', 'Claude'];
            const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
            this.addRandomAIResponse(randomAI);
        }, 1000);
    }

    addChatMessage(sender, message, type = 'user') {
        const messageHTML = `
            <div class="chat-message ${type} animate__animated animate__fadeInUp">
                <strong class="text-${this.getChatColor(type)}">${sender}:</strong>
                <span class="text-light">${message}</span>
            </div>
        `;

        ['chatMessages', 'chatMessagesMobile'].forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.insertAdjacentHTML('beforeend', messageHTML);
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    getChatColor(type) {
        switch(type) {
            case 'system': return 'neon-yellow';
            case 'ai': return 'neon-orange';
            case 'user': return 'neon-pink';
            default: return 'light';
        }
    }

    addWelcomeMessages() {
        setTimeout(() => {
            this.addChatMessage('Systém', 'Vítejte v AI Kostkové Výzvě! 🎲', 'system');
        }, 2000);

        setTimeout(() => {
            this.addChatMessage('Gemini', 'Ahoj! Připraven na výzvu? 🤖', 'ai');
        }, 3000);

        setTimeout(() => {
            this.addChatMessage('ChatGPT', 'Doufám, že jsi připraven prohrát! 😏', 'ai');
        }, 4000);

        setTimeout(() => {
            this.addChatMessage('Claude', 'Bude to zábava! Hodně štěstí! ⚡', 'ai');
        }, 5000);
    }

    showError(message) {
        Swal.fire({
            title: '❌ Chyba',
            text: message,
            icon: 'error',
            background: '#1a1a1a',
            color: '#ff3333',
            confirmButtonColor: '#ff3333'
        });
    }
}

// Inicializace aplikace
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DiceGameApp();
    window.app = app; // Pro přístup z HTML onclick handlerů
});

export default DiceGameApp;
