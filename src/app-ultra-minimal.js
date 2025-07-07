/**
 * 🎲 AI Dice Challenge - ULTRA-MINIMAL Bootstrap Edition
 * 99% Bootstrap třídy, 1% custom CSS, žádné color overrides!
 */

console.log('🎲 AI Dice Challenge - Ultra-minimal Bootstrap edition');

class UltraMinimalDiceGame {
    constructor() {
        this.gameState = {
            players: [
                { name: 'Hráč', score: 0, isHuman: true, avatar: 'person-circle', color: 'neon-green' },
                { name: 'Gemini', score: 0, isHuman: false, avatar: 'robot', color: 'neon-blue' },
                { name: 'ChatGPT', score: 0, isHuman: false, avatar: 'cpu-fill', color: 'neon-pink' },
                { name: 'Claude', score: 0, isHuman: false, avatar: 'lightning-charge-fill', color: 'neon-orange' }
            ],
            currentPlayerIndex: 0,
            targetScore: 10000,
            gameStarted: false,
            currentRoll: [],
            selectedDice: [],
            turnScore: 0
        };

        this.aiResponses = {
            Gemini: ["Zajímavý tah!", "Myslím analyticky!", "Data ukazují..."],
            ChatGPT: ["Skvělá strategie!", "Hmm, já bych to hrál jinak...", "Počkej na mou řadu!"],
            Claude: ["Dobrá volba!", "Vidím tvou strategii!", "Budu opatrnější..."]
        };

        this.init();
    }

    async init() {
        await this.waitForDOM();
        this.hideLoadingScreen();
        this.renderGameMenu();
        this.setupEventListeners();
        this.addWelcomeMessages();
        console.log('✅ Ultra-minimal app initialized');
    }

    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loading = document.getElementById('loadingScreen');
            const app = document.getElementById('app');
            if (loading && app) {
                loading.classList.add('animate__fadeOut');
                app.classList.remove('d-none');
                app.classList.add('animate__fadeIn');
                setTimeout(() => loading.remove(), 800);
            }
        }, 1500);
    }

    renderGameMenu() {
        const html = `
            <div class="h-100 d-flex flex-column justify-content-center text-center">
                <h1 class="text-neon-green mb-4 display-4 fw-bold animate__animated animate__bounceIn">
                    <i class="bi bi-dice-6-fill"></i> AI Kostková Výzva
                </h1>
                
                <div class="mb-4">
                    <h3 class="text-neon-orange mb-3">
                        <i class="bi bi-star-fill"></i> Cílové skóre
                    </h3>
                    <div class="d-flex justify-content-center align-items-center gap-3 mb-4">
                        <button class="btn btn-neon-blue btn-lg" onclick="app.adjustTarget(-1000)">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        <span class="display-5 text-neon-yellow fw-bold" id="targetDisplay">${this.gameState.targetScore}</span>
                        <button class="btn btn-neon-blue btn-lg" onclick="app.adjustTarget(1000)">
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
        
        document.getElementById('gameArea').innerHTML = html;
        document.getElementById('gameAreaMobile').innerHTML = html;
    }

    adjustTarget(change) {
        this.gameState.targetScore = Math.max(1000, Math.min(50000, this.gameState.targetScore + change));
        document.querySelectorAll('#targetDisplay').forEach(el => {
            el.textContent = this.gameState.targetScore;
            el.classList.add('animate__pulse');
            setTimeout(() => el.classList.remove('animate__pulse'), 600);
        });
    }

    startGame() {
        this.gameState.gameStarted = true;
        this.gameState.currentPlayerIndex = 0;
        this.gameState.players.forEach(p => p.score = 0);
        
        this.addChatMessage('Systém', 'Hra začíná! Cíl: ' + this.gameState.targetScore + ' bodů!', 'system');
        this.renderGameBoard();
    }

    renderGameBoard() {
        const current = this.gameState.players[this.gameState.currentPlayerIndex];
        
        const html = `
            <div class="h-100 d-flex flex-column">
                <!-- Players Row - 100% Bootstrap -->
                <div class="row g-2 mb-3">
                    ${this.gameState.players.map((player, index) => `
                        <div class="col-lg-3 col-6">
                            <div class="card bg-dark border border-${player.color} ${index === this.gameState.currentPlayerIndex ? 'border-3' : 'border-2'}">
                                <div class="card-body text-center p-2">
                                    <i class="bi bi-${player.avatar} text-${player.color} fs-3"></i>
                                    <div class="text-${player.color} fw-bold">${player.name}</div>
                                    <div class="text-${player.color}">${player.score} bodů</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Game Area - 100% Bootstrap -->
                <div class="flex-grow-1 d-flex flex-column justify-content-center">
                    <div class="text-center mb-4">
                        <h3 class="text-neon-green">
                            Na řadě: <i class="bi bi-${current.avatar} text-${current.color}"></i> ${current.name}
                        </h3>
                        <div class="text-neon-yellow fs-5">
                            Aktuální skóre: <span id="turnScore" class="fw-bold">${this.gameState.turnScore}</span>
                        </div>
                    </div>

                    <!-- Dice Container - 100% Bootstrap -->
                    <div class="text-center mb-4">
                        <div id="diceContainer" class="d-flex justify-content-center gap-3 flex-wrap mb-3">
                            ${this.generateDiceHTML()}
                        </div>
                        
                        ${current.isHuman ? `
                            <div class="d-flex justify-content-center gap-3 flex-wrap">
                                <button class="btn btn-neon-green" onclick="app.rollDice()" id="rollBtn">
                                    <i class="bi bi-dice-6-fill"></i> Hodit kostky
                                </button>
                                <button class="btn btn-neon-blue" onclick="app.holdDice()" id="holdBtn" disabled>
                                    <i class="bi bi-collection-fill"></i> Odložit pole
                                </button>
                                <button class="btn btn-neon-orange" onclick="app.endTurn()" id="endBtn">
                                    <i class="bi bi-stop-fill"></i> Ukončit tah
                                </button>
                            </div>
                        ` : `
                            <div class="text-center">
                                <div class="spinner-border text-neon-blue" role="status"></div>
                                <div class="mt-2 text-neon-blue">AI přemýšlí...</div>
                            </div>
                        `}
                    </div>

                    <!-- End Game Button - 100% Bootstrap -->
                    <div class="text-center mt-auto">
                        <button class="btn btn-neon-red btn-sm" onclick="app.endGame()">
                            <i class="bi bi-stop-circle-fill"></i> Ukončit hru
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('gameArea').innerHTML = html;
        document.getElementById('gameAreaMobile').innerHTML = html;
        this.setupDiceEvents();
        this.startPlayerTurn();
    }

    generateDiceHTML() {
        if (this.gameState.currentRoll.length === 0) {
            return '<div class="text-muted">Hoďte kostkami pro začátek tahu</div>';
        }

        return this.gameState.currentRoll.map((value, index) => `
            <div class="dice rounded-3 d-flex align-items-center justify-content-center fw-bold user-select-none cursor-pointer
                        ${this.gameState.selectedDice.includes(index) ? 'selected' : ''}" 
                 data-index="${index}" data-value="${value}">
                ${value}
            </div>
        `).join('');
    }

    setupDiceEvents() {
        document.querySelectorAll('.dice').forEach(dice => {
            dice.addEventListener('click', (e) => {
                if (!this.gameState.players[this.gameState.currentPlayerIndex].isHuman) return;
                const index = parseInt(e.target.dataset.index);
                this.toggleDice(index);
            });
        });
    }

    toggleDice(index) {
        const selectedIndex = this.gameState.selectedDice.indexOf(index);
        if (selectedIndex > -1) {
            this.gameState.selectedDice.splice(selectedIndex, 1);
        } else {
            this.gameState.selectedDice.push(index);
        }
        this.calculateScore();
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

        this.gameState.currentRoll = Array.from({length: numDice}, () => Math.floor(Math.random() * 6) + 1);
        this.gameState.selectedDice = [];
        
        this.updateGameDisplay();
        this.addChatMessage('Systém', `Hod: ${this.gameState.currentRoll.join(', ')}`, 'system');
        
        if (!this.hasValidCombination()) {
            this.handleFarkle();
        }
    }

    hasValidCombination() {
        const counts = {};
        this.gameState.currentRoll.forEach(value => counts[value] = (counts[value] || 0) + 1);
        
        // Jedničky a pětky jsou vždy platné
        if (counts[1] || counts[5]) return true;
        
        // Tři nebo více stejných
        for (let value in counts) {
            if (counts[value] >= 3) return true;
        }
        
        return false;
    }

    calculateScore() {
        const selectedValues = this.gameState.selectedDice.map(index => this.gameState.currentRoll[index]);
        
        if (selectedValues.length === 0) {
            this.gameState.turnScore = 0;
            this.updateScoreDisplay();
            return;
        }

        if (!this.isValidSelection(selectedValues)) {
            this.gameState.turnScore = 0;
            this.updateScoreDisplay();
            return;
        }

        let score = 0;
        const counts = {};
        selectedValues.forEach(value => counts[value] = (counts[value] || 0) + 1);

        // Farkle scoring rules
        for (let value in counts) {
            const count = counts[value];
            const num = parseInt(value);
            
            if (num === 1) {
                if (count >= 3) {
                    score += count === 3 ? 1000 : count === 4 ? 2000 : count === 5 ? 4000 : 8000;
                } else {
                    score += count * 100;
                }
            } else if (num === 5) {
                if (count >= 3) {
                    score += count === 3 ? 500 : count === 4 ? 1000 : count === 5 ? 2000 : 4000;
                } else {
                    score += count * 50;
                }
            } else if (count >= 3) {
                const baseScore = num * 100;
                score += count === 3 ? baseScore : count === 4 ? baseScore * 2 : count === 5 ? baseScore * 4 : baseScore * 8;
            }
        }

        this.gameState.turnScore = score;
        this.updateScoreDisplay();
        
        const holdBtn = document.getElementById('holdBtn');
        if (holdBtn) {
            const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            const minScore = currentPlayer.score === 0 ? 300 : 0;
            holdBtn.disabled = score === 0 || this.gameState.turnScore < minScore;
        }
    }

    isValidSelection(selectedValues) {
        const counts = {};
        selectedValues.forEach(value => counts[value] = (counts[value] || 0) + 1);
        
        for (let value in counts) {
            const count = counts[value];
            const num = parseInt(value);
            
            if (num === 1 || num === 5) continue;
            if (count > 0 && count < 3) return false;
        }
        
        return true;
    }

    updateScoreDisplay() {
        const scoreEl = document.getElementById('turnScore');
        if (scoreEl) {
            scoreEl.textContent = this.gameState.turnScore;
            scoreEl.classList.add('animate__pulse');
            setTimeout(() => scoreEl.classList.remove('animate__pulse'), 600);
        }
    }

    updateGameDisplay() {
        const container = document.getElementById('diceContainer');
        if (container) {
            container.innerHTML = this.generateDiceHTML();
            this.setupDiceEvents();
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
        
        if (this.gameState.selectedDice.length === 6) {
            this.addChatMessage('Systém', 'HOT DICE! Můžete pokračovat s novými kostkami!', 'system');
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
        this.endTurn();
    }

    nextPlayer() {
        this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
        this.renderGameBoard();
    }

    startPlayerTurn() {
        const current = this.gameState.players[this.gameState.currentPlayerIndex];
        if (!current.isHuman) {
            setTimeout(() => this.playAITurn(), 1500);
        }
    }

    playAITurn() {
        const current = this.gameState.players[this.gameState.currentPlayerIndex];
        this.rollDice();
        
        setTimeout(() => {
            // AI selects safe dice (1s and 5s)
            const validIndices = [];
            this.gameState.currentRoll.forEach((value, index) => {
                if (value === 1 || value === 5) validIndices.push(index);
            });

            if (validIndices.length > 0) {
                this.gameState.selectedDice = validIndices.slice(0, Math.max(1, Math.floor(validIndices.length / 2)));
                this.calculateScore();
                this.updateDiceDisplay();
                
                setTimeout(() => {
                    if (Math.random() > 0.6 && this.gameState.turnScore > 200) {
                        this.holdDice();
                    } else {
                        this.endTurn();
                    }
                    
                    const responses = this.aiResponses[current.name];
                    this.addChatMessage(current.name, responses[Math.floor(Math.random() * responses.length)], 'ai');
                }, 1000);
            } else {
                this.handleFarkle();
            }
        }, 1500);
    }

    endGame(winner = null) {
        if (!winner) {
            winner = this.gameState.players.reduce((prev, current) => prev.score > current.score ? prev : current);
        }
        
        this.addChatMessage('Systém', `${winner.name} vyhrál s ${winner.score} body!`, 'system');
        
        Swal.fire({
            title: 'Vítěz!',
            html: `
                <div class="text-center">
                    <i class="bi bi-${winner.avatar} text-${winner.color} display-1"></i>
                    <h3 class="text-${winner.color} mt-3">${winner.name}</h3>
                    <p>Skóre: ${winner.score} bodů</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Nová hra',
            background: '#0d1117',
            color: '#39ff14'
        });
        
        setTimeout(() => this.renderGameMenu(), 5000);
    }

    showRules() {
        Swal.fire({
            title: 'Pravidla Farkle',
            html: `
                <div class="text-start">
                    <h5><i class="bi bi-target"></i> Cíl:</h5>
                    <p>Dosáhněte cílového skóre jako první!</p>
                    
                    <h5><i class="bi bi-dice-6-fill"></i> Bodování:</h5>
                    <ul>
                        <li><strong>1</strong> = 100 bodů (3× = 1000)</li>
                        <li><strong>5</strong> = 50 bodů (3× = 500)</li>
                        <li><strong>3× stejná čísla</strong> = číslo × 100</li>
                    </ul>
                    
                    <h5><i class="bi bi-fire"></i> Hot Dice:</h5>
                    <p>Odložíte-li všech 6 kostek, dostanete nových 6!</p>
                    
                    <h5><i class="bi bi-x-circle"></i> FARKLE:</h5>
                    <p>Žádná bodující kostka = ztráta všech bodů tahu!</p>
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
            html: '<div class="text-center"><i class="bi bi-trophy-fill text-warning display-1"></i><p>Zatím žádní šampioni!</p></div>',
            confirmButtonText: 'Zavřít',
            background: '#0d1117',
            color: '#39ff14'
        });
    }

    setupEventListeners() {
        ['chatInput', 'chatInputMobile'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendChat();
                });
            }
        });

        ['sendChatBtn', 'sendChatBtnMobile'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.sendChat());
            }
        });
    }

    sendChat() {
        const inputs = ['chatInput', 'chatInputMobile'];
        let message = '';
        let activeInput = null;

        for (const id of inputs) {
            const input = document.getElementById(id);
            if (input && input.value.trim()) {
                message = input.value.trim();
                activeInput = input;
                break;
            }
        }

        if (message) {
            this.addChatMessage('Hráč', message, 'player');
            activeInput.value = '';
            
            setTimeout(() => {
                const aiPlayers = this.gameState.players.filter(p => !p.isHuman);
                if (aiPlayers.length > 0) {
                    const randomAI = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
                    const responses = this.aiResponses[randomAI.name];
                    this.addChatMessage(randomAI.name, responses[Math.floor(Math.random() * responses.length)], 'ai');
                }
            }, 1000 + Math.random() * 2000);
        }
    }

    addChatMessage(sender, message, type) {
        const typeClass = type === 'system' ? 'neon-green' : type === 'ai' ? 'neon-blue' : 'neon-orange';
        const html = `
            <div class="p-2 mb-2 border-start border-3 border-${typeClass} bg-dark rounded">
                <strong class="text-${typeClass}">${sender}:</strong> 
                <span class="text-${typeClass}">${message}</span>
            </div>
        `;

        ['chatMessages', 'chatMessagesMobile'].forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML += html;
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
            background: '#0d1117',
            color: '#ff3131'
        });
    }
}

// Global initialization
window.app = new UltraMinimalDiceGame();
