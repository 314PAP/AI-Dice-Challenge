/**
 * 🚀 AI Dice Challenge - ULTRA BOOTSTRAP-FIRST EDITION
 * 100% Bootstrap utility třídy, žádné hardkódované styly!
 */

console.log('🎲 AI Dice Challenge - Ultra Bootstrap-First Edition starting...');

class UltraBootstrapDiceGame {
    constructor() {
        // Herní stav
        this.gameState = {
            players: [
                { name: 'Hráč', score: 0, isHuman: true, avatar: 'bi-person-circle', color: 'green' },
                { name: 'Gemini', score: 0, isHuman: false, avatar: 'bi-robot', color: 'blue' },
                { name: 'ChatGPT', score: 0, isHuman: false, avatar: 'bi-cpu-fill', color: 'purple' },
                { name: 'Claude', score: 0, isHuman: false, avatar: 'bi-lightning-charge-fill', color: 'orange' }
            ],
            currentPlayerIndex: 0,
            targetScore: 10000,
            gameStarted: false,
            currentRoll: [],
            selectedDice: [],
            turnScore: 0,
            gamePhase: 'menu'
        };
        
        // Chat historie pro autocomplete
        this.chatHistory = JSON.parse(localStorage.getItem('aidice-chat-history') || '[]');
        
        // Autocomplete instances
        this.chatAutocomplete = null;
        this.chatAutocompleteMobile = null;

        // AI osobnosti - ČISTÉ, bez emoji
        this.aiPersonalities = {
            Gemini: {
                responses: [
                    "Hmm, zajímavý tah!",
                    "Myslím si, že můžeš být trochu odvážnější!",
                    "Dobrá strategie, ale já budu lepší!",
                    "Wow, to byl riskantní tah!"
                ]
            },
            ChatGPT: {
                responses: [
                    "Ó, to je chytrý tah!",
                    "Hmm, já bych to hrál jinak...",
                    "Zajímavé! Ale počkej, až přijdu na řadu!",
                    "Tvoje štěstí tě brzy opustí!"
                ]
            },
            Claude: {
                responses: [
                    "Skvělá volba!",
                    "Ah, vidím tvou strategii!",
                    "Budu muset být opatrnější...",
                    "Tvoje šance stále rostou!"
                ]
            }
        };

        this.init();
    }

    async init() {
        try {
            await this.waitForDOM();
            this.hideLoadingScreen();
            this.initializeUI();
            this.setupEventListeners();
            this.initializeAutocomplete();
            this.addWelcomeMessages();
            console.log('✅ Ultra Bootstrap-First App initialized!');
        } catch (error) {
            console.error('❌ App init failed:', error);
            this.showError('Chyba při načítání aplikace.');
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
                // 100% Bootstrap classes pro animace
                loadingScreen.classList.add('animate__animated', 'animate__fadeOut');
                app.classList.remove('d-none');
                app.classList.add('animate__animated', 'animate__fadeIn');
                
                setTimeout(() => loadingScreen.remove(), 800);
            }
        }, 1500);
    }

    initializeUI() {
        this.renderGameMenu();
    }

    renderGameMenu() {
        // KONFIGURAČNÍ OBJEKTY - mnohem čitelnější než template literály
        const menuConfig = {
            container: {
                tag: 'div',
                classes: 'text-center h-100 d-flex flex-column justify-content-center'
            },
            title: {
                tag: 'h1',
                classes: 'text-neon-green mb-4 animate__animated animate__bounceIn',
                icon: 'bi-dice-6-fill text-neon-green',
                text: 'AI Kostková Výzva'
            },
            targetScore: {
                section: {
                    tag: 'div',
                    classes: 'mb-4'
                },
                title: {
                    tag: 'h3', 
                    classes: 'text-neon-orange mb-3',
                    icon: 'bi-star-fill text-neon-orange',
                    text: 'Cílové skóre'
                },
                controls: {
                    container: 'd-flex justify-content-center align-items-center mb-4',
                    decrease: {
                        classes: 'btn btn-neon-blue me-3',
                        icon: 'bi-dash-lg',
                        action: -1000
                    },
                    display: {
                        classes: 'fs-3 text-neon-yellow fw-bold mx-3',
                        id: 'targetScoreDisplay'
                    },
                    increase: {
                        classes: 'btn btn-neon-blue ms-3', 
                        icon: 'bi-plus-lg',
                        action: 1000
                    }
                }
            },
            buttons: {
                container: 'd-flex flex-column align-items-center',
                items: [
                    {
                        classes: 'btn btn-neon-green btn-lg px-5 mb-3 animate__animated animate__pulse animate__infinite',
                        icon: 'bi-play-fill',
                        text: 'ZAČÍT HRU',
                        action: 'startGame'
                    },
                    {
                        classes: 'btn btn-neon-blue px-4 mb-3',
                        icon: 'bi-book-fill', 
                        text: 'Pravidla',
                        action: 'showRules'
                    },
                    {
                        classes: 'btn btn-neon-orange px-4',
                        icon: 'bi-trophy-fill',
                        text: 'Síň slávy', 
                        action: 'showHallOfFame'
                    }
                ]
            }
        };

        const gameAreaHTML = this.buildMenuFromConfig(menuConfig);
        this.setGameAreaContent(gameAreaHTML);
    }

    buildMenuFromConfig(config) {
        return `
            <${config.container.tag} class="${config.container.classes}">
                <${config.title.tag} class="${config.title.classes}">
                    <i class="bi ${config.title.icon}"></i> ${config.title.text}
                </${config.title.tag}>
                
                <${config.targetScore.section.tag} class="${config.targetScore.section.classes}">
                    <${config.targetScore.title.tag} class="${config.targetScore.title.classes}">
                        <i class="bi ${config.targetScore.title.icon}"></i> ${config.targetScore.title.text}
                    </${config.targetScore.title.tag}>
                    <div class="${config.targetScore.controls.container}">
                        <button class="${config.targetScore.controls.decrease.classes}" onclick="app.adjustTargetScore(${config.targetScore.controls.decrease.action})">
                            <i class="bi ${config.targetScore.controls.decrease.icon}"></i>
                        </button>
                        <span class="${config.targetScore.controls.display.classes}" id="${config.targetScore.controls.display.id}">
                            ${this.gameState.targetScore}
                        </span>
                        <button class="${config.targetScore.controls.increase.classes}" onclick="app.adjustTargetScore(${config.targetScore.controls.increase.action})">
                            <i class="bi ${config.targetScore.controls.increase.icon}"></i>
                        </button>
                    </div>
                </${config.targetScore.section.tag}>

                <div class="${config.buttons.container}">
                    ${config.buttons.items.map(button => `
                        <button class="${button.classes}" onclick="app.${button.action}()">
                            <i class="bi ${button.icon}"></i> ${button.text}
                        </button>
                    `).join('')}
                </div>
            </${config.container.tag}>
        `;
    }

    setGameAreaContent(html) {
        // Utility funkce pro nastavení obsahu
        const gameArea = document.getElementById('gameArea');
        const gameAreaMobile = document.getElementById('gameAreaMobile');
        
        if (gameArea) gameArea.innerHTML = html;
        if (gameAreaMobile) gameAreaMobile.innerHTML = html;
    }

    adjustTargetScore(change) {
        this.gameState.targetScore = Math.max(1000, this.gameState.targetScore + change);
        this.gameState.targetScore = Math.min(50000, this.gameState.targetScore);
        
        // 100% Bootstrap animace
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
        
        this.gameState.players.forEach(player => player.score = 0);
        
        this.addChatMessage('Systém', 'Hra začíná! Cíl: ' + this.gameState.targetScore + ' bodů!', 'system');
        this.renderGameBoard();
        this.startPlayerTurn();
    }

    renderGameBoard() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        // OFICIÁLNÍ Bootstrap 5.2 layout - responzivní avatary 90% šířky!
        const gameHTML = `
            <div class="h-100 d-flex flex-column">
                <!-- Player Cards - 90% šířky, Bootstrap oficiální responsive flexbox -->
                <div class="d-flex justify-content-center mb-3">
                    <div class="d-flex flex-wrap justify-content-center w-neon-90">
                        ${this.gameState.players.map((player, index) => `
                            <div class="flex-fill mx-1 mb-2 avatar-card-container">
                                <div class="card bg-black border-neon-${player.color} ${index === this.gameState.currentPlayerIndex ? 'border-3' : 'border-2'} h-100">
                                    <div class="card-body text-center p-2">
                                        <div class="mb-2">
                                            <i class="bi ${player.avatar} text-neon-${player.color} fs-2 d-none d-md-inline"></i>
                                            <i class="bi ${player.avatar} text-neon-${player.color} fs-3 d-md-none"></i>
                                        </div>
                                        <div class="fw-bold text-neon-${player.color} small">${player.name}</div>
                                        <div class="text-neon-${player.color} small">${player.score} bodů</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Game Controls - Bootstrap oficiální flexbox -->
                <div class="flex-grow-1 d-flex flex-column justify-content-center">
                    <div class="text-center mb-4">
                        <h3 class="text-neon-green mb-3 fs-3 d-none d-md-block">
                            <i class="bi ${currentPlayer.avatar} text-neon-${currentPlayer.color}"></i> 
                            Na řadě: <span class="text-neon-${currentPlayer.color}">${currentPlayer.name}</span>
                        </h3>
                        <h4 class="text-neon-green mb-3 fs-4 d-md-none">
                            <i class="bi ${currentPlayer.avatar} text-neon-${currentPlayer.color}"></i> 
                            Na řadě: <span class="text-neon-${currentPlayer.color}">${currentPlayer.name}</span>
                        </h4>
                        <div class="text-neon-yellow fs-5 d-none d-md-block mb-3">
                            Skóre tahu: <span id="turnScore" class="fw-bold">${this.gameState.turnScore}</span>
                        </div>
                        <div class="text-neon-yellow fs-6 d-md-none mb-3">
                            Skóre tahu: <span id="turnScore" class="fw-bold">${this.gameState.turnScore}</span>
                        </div>
                    </div>

                    <!-- Dice Area - Bootstrap oficiální flexbox s margin spacery -->
                    <div class="text-center mb-4">
                        <div id="diceContainer" class="d-flex justify-content-center flex-wrap mb-4">
                            ${this.generateDiceHTML()}
                        </div>
                        
                        ${currentPlayer.isHuman ? `
                            <!-- Bootstrap oficiální button layout - responsive -->
                            <div class="d-flex justify-content-center flex-wrap">
                                <div class="d-flex flex-wrap justify-content-center">
                                    <button class="btn btn-neon btn-sm mx-1 mb-2 d-md-none" data-neon-color="green" onclick="app.rollDice()" id="rollBtnMobile">
                                        <i class="bi bi-dice-6-fill"></i> Hodit
                                    </button>
                                    <button class="btn btn-neon mx-1 mb-2 d-none d-md-inline-block" data-neon-color="green" onclick="app.rollDice()" id="rollBtnDesktop">
                                        <i class="bi bi-dice-6-fill"></i> Hodit
                                    </button>
                                    
                                    <button class="btn btn-neon btn-sm mx-1 mb-2 d-md-none" data-neon-color="blue" onclick="app.holdDice()" id="holdBtnMobile" disabled>
                                        <i class="bi bi-collection-fill"></i> Odložit
                                    </button>
                                    <button class="btn btn-neon mx-1 mb-2 d-none d-md-inline-block" data-neon-color="blue" onclick="app.holdDice()" id="holdBtnDesktop" disabled>
                                        <i class="bi bi-collection-fill"></i> Odložit
                                    </button>
                                
                                    <button class="btn btn-neon btn-sm mx-1 mb-2 d-md-none" data-neon-color="orange" onclick="app.endTurn()" id="endBtnMobile">
                                        <i class="bi bi-stop-fill"></i> Ukončit tah
                                    </button>
                                    <button class="btn btn-neon mx-1 mb-2 d-none d-md-inline-block" data-neon-color="orange" onclick="app.endTurn()" id="endBtnDesktop">
                                        <i class="bi bi-stop-fill"></i> Ukončit tah
                                    </button>
                                </div>
                            </div>
                        ` : `
                            <div class="text-center">
                                <div class="spinner-border text-neon-blue mb-3" role="status">
                                    <span class="visually-hidden">AI přemýšlí...</span>
                                </div>
                                <div class="text-neon-blue">AI přemýšlí...</div>
                            </div>
                        `}
                    </div>

                    <!-- Bottom Controls - Bootstrap oficiální utilities -->
                    <div class="text-center mt-auto">
                        <button class="btn btn-neon btn-sm" data-neon-color="red" onclick="app.endGame()">
                            <i class="bi bi-stop-circle-fill"></i> Ukončit hru
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setGameAreaContent(gameHTML);
        this.setupDiceClickHandlers();
    }

    generateDiceHTML() {
        if (this.gameState.currentRoll.length === 0) {
            return '<div class="text-muted">Hoďte kostkami pro začátek tahu</div>';
        }

        return this.gameState.currentRoll.map((value, index) => `
            <div class="dice d-flex align-items-center justify-content-center fs-4 fw-bold ${this.gameState.selectedDice.includes(index) ? 'selected' : ''}" 
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

        this.gameState.currentRoll = Array.from({length: numDice}, () => 
            Math.floor(Math.random() * 6) + 1
        );
        this.gameState.selectedDice = [];
        
        this.updateGameDisplay();
        this.addChatMessage('Systém', `Hod: ${this.gameState.currentRoll.join(', ')}`, 'system');
        
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

        // Speciální kombinace pro 6 kostek
        if (this.gameState.currentRoll.length === 6) {
            const sorted = this.gameState.currentRoll.slice().sort();
            if (sorted.join(',') === '1,2,3,4,5,6') return true;
            
            const pairs = Object.values(counts).filter(count => count === 2).length;
            if (pairs === 3 && Object.keys(counts).length === 3) return true;
        }

        // Jedničky a pětky
        if (counts[1] || counts[5]) return true;
        
        // Tři nebo více stejných
        for (let value in counts) {
            if (counts[value] >= 3) return true;
        }
        
        return false;
    }

    isValidSelection() {
        const selectedValues = this.gameState.selectedDice.map(index => 
            this.gameState.currentRoll[index]
        );
        
        if (selectedValues.length === 0) return false;
        
        const counts = {};
        selectedValues.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });
        
        // Speciální kombinace
        if (selectedValues.length === 6) {
            const sorted = selectedValues.slice().sort().join(',');
            if (sorted === '1,2,3,4,5,6') return true;
            
            const pairs = Object.values(counts).filter(count => count === 2).length;
            if (pairs === 3 && Object.keys(counts).length === 3) return true;
        }
        
        // Validace hodnot
        for (let value in counts) {
            const count = counts[value];
            const num = parseInt(value);
            
            if (num === 1 || num === 5) {
                continue;
            } else {
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

        if (selectedValues.length === 0 || !this.isValidSelection()) {
            this.gameState.turnScore = 0;
            this.updateScoreDisplay();
            return;
        }

        let score = 0;
        const counts = {};
        
        selectedValues.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });

        // Speciální kombinace
        if (selectedValues.length === 6) {
            const sorted = selectedValues.slice().sort();
            if (sorted.join(',') === '1,2,3,4,5,6') {
                this.gameState.turnScore = 1500;
                this.updateScoreDisplay();
                return;
            }
            
            const pairs = Object.values(counts).filter(count => count === 2).length;
            if (pairs === 3 && Object.keys(counts).length === 3) {
                this.gameState.turnScore = 1500;
                this.updateScoreDisplay();
                return;
            }
        }

        // Farkle bodování
        for (let value in counts) {
            const count = counts[value];
            const num = parseInt(value);
            
            if (num === 1) {
                if (count >= 3) {
                    if (count === 3) score += 1000;
                    else if (count === 4) score += 2000;
                    else if (count === 5) score += 4000;
                    else if (count === 6) score += 8000;
                } else {
                    score += count * 100;
                }
            } else if (num === 5) {
                if (count >= 3) {
                    if (count === 3) score += 500;
                    else if (count === 4) score += 1000;
                    else if (count === 5) score += 2000;
                    else if (count === 6) score += 4000;
                } else {
                    score += count * 50;
                }
            } else {
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
        
        // Bootstrap button state management
        // Aktualizace obou variant holdBtn (desktop i mobilní)
        const holdBtns = [
            document.getElementById('holdBtnMobile'),
            document.getElementById('holdBtnDesktop')
        ];
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const minScore = currentPlayer.score === 0 ? 300 : 0;
        const isDisabled = score === 0 || this.gameState.turnScore < minScore;
        
        holdBtns.forEach(btn => {
            if (btn) btn.disabled = isDisabled;
        });
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('turnScore');
        if (scoreElement) {
            scoreElement.textContent = this.gameState.turnScore;
            // Bootstrap animace
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

    holdDice() {
        if (this.gameState.turnScore === 0) return;
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        if (currentPlayer.score === 0 && this.gameState.turnScore < 300) {
            this.showError('Pro vstup do hry potřebujete minimálně 300 bodů!');
            return;
        }
        
        currentPlayer.score += this.gameState.turnScore;
        
        this.addChatMessage('Systém', `${currentPlayer.name} získal ${this.gameState.turnScore} bodů! Celkem: ${currentPlayer.score}`, 'system');
        
        if (currentPlayer.score >= this.gameState.targetScore) {
            this.endGame(currentPlayer);
            return;
        }
        
        // Hot Dice
        if (this.gameState.selectedDice.length === 6) {
            this.addChatMessage('Systém', 'HOT DICE! Můžete pokračovat s novými 6 kostkami!', 'system');
            this.gameState.currentRoll = [];
            this.gameState.selectedDice = [];
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
            setTimeout(() => this.playAITurn(), 1500);
        }
    }

    playAITurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        this.rollDice();
        
        setTimeout(() => {
            const validIndices = [];
            
            this.gameState.currentRoll.forEach((value, index) => {
                if (value === 1 || value === 5) {
                    validIndices.push(index);
                }
            });

            if (validIndices.length > 0) {
                this.gameState.selectedDice = validIndices.slice(0, Math.max(1, Math.floor(validIndices.length / 2)));
                this.calculateTurnScore();
                this.updateDiceDisplay();
                
                setTimeout(() => {
                    const shouldContinue = Math.random() > 0.6;
                    
                    if (shouldContinue && this.gameState.turnScore > 200) {
                        this.holdDice();
                    } else {
                        this.endTurn();
                    }
                    
                    const responses = this.aiPersonalities[currentPlayer.name].responses;
                    const reaction = responses[Math.floor(Math.random() * responses.length)];
                    this.addChatMessage(currentPlayer.name, reaction, 'ai');
                }, 1000);
            } else {
                this.handleFarkle();
            }
        }, 1500);
    }

    endGame(winner = null) {
        this.gameState.gamePhase = 'gameOver';
        
        if (!winner) {
            winner = this.gameState.players.reduce((prev, current) => 
                prev.score > current.score ? prev : current
            );
        }
        
        if (winner) {
            const message = `${winner.name} vyhrál s ${winner.score} body!`;
            this.addChatMessage('Systém', message, 'system');
            this.showGameResults(winner);
        }
        
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
                    <div class="fs-1 mb-3"><i class="bi ${winner.avatar} text-neon-${winner.color}"></i></div>
                    <h3 class="text-neon-${winner.color}">${winner.name}</h3>
                    <p>Skóre: ${winner.score} bodů</p>
                    <hr>
                    <h5>Finální pořadí:</h5>
                    ${this.gameState.players
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => `
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>${index + 1}. <i class="bi ${player.avatar} text-neon-${player.color}"></i> ${player.name}</span>
                                <span class="fw-bold">${player.score} bodů</span>
                            </div>
                        `).join('')}
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Nová hra',
            customClass: {
                popup: 'bg-black text-neon-green'
            }
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
                    <ul class="list-unstyled">
                        <li><strong>1</strong> = 100 bodů (3× = 1000 bodů)</li>
                        <li><strong>5</strong> = 50 bodů (3× = 500 bodů)</li>
                        <li><strong>3× stejná čísla</strong> = číslo × 100 bodů</li>
                    </ul>
                    
                    <h5><i class="bi bi-stars text-neon-orange"></i> Speciální kombinace:</h5>
                    <ul class="list-unstyled">
                        <li><strong>Postupka (1-2-3-4-5-6)</strong> = 1500 bodů</li>
                        <li><strong>Tři páry</strong> = 1500 bodů</li>
                    </ul>
                    
                    <h5><i class="bi bi-fire text-neon-red"></i> Hot Dice:</h5>
                    <p>Pokud odložíte všech 6 kostek, dostanete nových 6!</p>
                </div>
            `,
            confirmButtonText: 'Rozumím',
            customClass: {
                popup: 'bg-black text-neon-green border-wide-neon-blue',
                confirmButton: 'btn btn-neon',
                customClass: {
                    popup: 'border-wide-neon-blue'
                },
                buttonsStyling: false
            }
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
            customClass: {
                popup: 'bg-black text-neon-green border-wide-neon-yellow',
                confirmButton: 'btn btn-neon',
                customClass: {
                    popup: 'border-wide-neon-yellow'
                },
                buttonsStyling: false
            }
        });
    }

    setupEventListeners() {
        // Chat Bootstrap event handlers
        ['chatInput', 'chatInputMobile'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendChatMessage();
                });
            }
        });

        ['sendChatBtn', 'sendChatBtnMobile'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.sendChatMessage());
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
            // Přidat do historie
            this.addToChatHistory(message);
            
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
        // 100% neonové Bootstrap třídy s barvami podle hráče
        let textColor = '';
        let borderColor = '';
        
        if (type === 'system') {
            // Systémové zprávy mají být žluté podle dokumentace
            textColor = 'text-neon-yellow';
            borderColor = 'border-neon-yellow';
        } else if (type === 'player') {
            textColor = 'text-neon-green';
            borderColor = 'border-neon-green';
        } else if (type === 'ai') {
            // Specifické barvy pro každého AI podle jména
            if (sender === 'Gemini') {
                textColor = 'text-neon-blue';
                borderColor = 'border-neon-blue';
            } else if (sender === 'ChatGPT') {
                // Používáme purple místo pink pro konzistenci s CSS definicí
                textColor = 'text-neon-purple';
                borderColor = 'border-neon-purple';
            } else if (sender === 'Claude') {
                textColor = 'text-neon-orange';
                borderColor = 'border-neon-orange';
            } else {
                // Fallback pro neznámé AI
                textColor = 'text-neon-blue';
                borderColor = 'border-neon-blue';
            }
        }

        const messageHTML = `
            <div class="py-2 mb-2 bg-black border-start border-3 ${borderColor} animate__animated animate__fadeInUp">
                <small class="${textColor} neon-text-glow"><strong>${sender}:</strong> ${message}</small>
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
        setTimeout(() => this.addChatMessage('Systém', 'Vítejte v AI Kostkové Výzvě!', 'system'), 2000);
        setTimeout(() => this.addChatMessage('Gemini', 'Připravte se na analytickou výzvu!', 'ai'), 3000);
        setTimeout(() => this.addChatMessage('ChatGPT', 'Bude to skvělá hra!', 'ai'), 4000);
        setTimeout(() => this.addChatMessage('Claude', 'Hodně štěstí všem!', 'ai'), 5000);
    }

    showError(message) {
        Swal.fire({
            title: 'Chyba',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'bg-black text-neon-red'
            }
        });
    }

    // Chat historie management
    addToChatHistory(message) {
        const trimmedMessage = message.trim();
        if (trimmedMessage && trimmedMessage.length > 2) {
            // Odstranit pokud už existuje
            const index = this.chatHistory.indexOf(trimmedMessage);
            if (index > -1) {
                this.chatHistory.splice(index, 1);
            }
            
            // Přidat na začátek
            this.chatHistory.unshift(trimmedMessage);
            
            // Omezit na 20 zpráv
            if (this.chatHistory.length > 20) {
                this.chatHistory = this.chatHistory.slice(0, 20);
            }
            
            // Uložit do localStorage
            localStorage.setItem('aidice-chat-history', JSON.stringify(this.chatHistory));
            
            // Aktualizovat autocomplete instance
            if (this.chatAutocomplete) {
                this.chatAutocomplete.setSuggestions([...this.chatHistory]);
            }
            if (this.chatAutocompleteMobile) {
                this.chatAutocompleteMobile.setSuggestions([...this.chatHistory]);
            }
        }
    }

    initializeAutocomplete() {
        // Inicializovat autocomplete pro desktop chat
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            this.chatAutocomplete = new UltraBootstrapAutocomplete(chatInput, {
                suggestions: [...this.chatHistory],
                neonColor: 'blue', // Konzistentní s neon-blue (#194DD1)
                storageKey: 'aidice-chat-history',
                maxResults: 8,
                placeholder: 'Napište zprávu AI...'
            });
        }
        
        // Inicializovat autocomplete pro mobilní chat
        const chatInputMobile = document.getElementById('chatInputMobile');
        if (chatInputMobile) {
            this.chatAutocompleteMobile = new UltraBootstrapAutocomplete(chatInputMobile, {
                suggestions: [...this.chatHistory],
                neonColor: 'blue', // Konzistentní s neon-blue (#194DD1)
                storageKey: 'aidice-chat-history-mobile',
                maxResults: 6,
                placeholder: 'Zpráva...'
            });
        }
        
        console.log('✅ Ultra Bootstrap Autocomplete initialized');
    }
}

// Globální inicializace - 100% Bootstrap-first!
window.app = new UltraBootstrapDiceGame();
