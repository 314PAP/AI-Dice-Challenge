/**
 * 🎲 AI Dice Challenge - Simplified Main
 * Zjednodušená verze bez externích core modulů
 */

console.log('🎲 AI Dice Challenge - Starting simplified version...');

// Jednoduchá implementace bez externích závislostí
class SimpleDiceGame {
    constructor() {
        this.gameState = {
            gameStarted: false,
            gameEnded: false,
            players: [
                { name: 'Hráč', score: 0, isHuman: true },
                { name: 'AI Sarah', score: 0, isHuman: false },
                { name: 'AI Marcus', score: 0, isHuman: false },
                { name: 'AI Luna', score: 0, isHuman: false }
            ],
            currentPlayerIndex: 0,
            targetScore: 5000
        };
        
        this.templates = new Map();
        this.initialized = false;
    }

    // Jednoduchý template loader
    async loadTemplate(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return await response.text();
        } catch (error) {
            console.error('Template load error:', error);
            return `<div class="alert alert-warning">Template ${url} could not be loaded</div>`;
        }
    }

    // Inicializace aplikace
    async initialize() {
        try {
            console.log('🚀 Loading templates...');
            
            // Načtení šablon
            const templates = [
                { id: 'gameContent', file: '/src/templates/game-menu.html' },
                { id: 'gameMobileContent', file: '/src/templates/game-menu-mobile.html' },
                { id: 'chatPanel', file: '/src/templates/chat.html' },
                { id: 'chatPanelMobileContainer', file: '/src/templates/chat-mobile.html' },
                { id: 'gameControls', file: '/src/templates/game-controls.html' },
                { id: 'gameControlsMobile', file: '/src/templates/game-controls-mobile.html' }
            ];

            // Načtení všech šablon
            for (const template of templates) {
                try {
                    console.log(`📄 Loading template: ${template.file}`);
                    const html = await this.loadTemplate(template.file);
                    const container = document.getElementById(template.id);
                    if (container) {
                        container.innerHTML = html;
                        console.log(`✅ Template ${template.file} loaded into ${template.id}`);
                    } else {
                        console.warn(`⚠️ Container ${template.id} not found for template ${template.file}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to load template ${template.file}:`, error);
                }
            }

            // Načtení modálů
            await this.loadModals();

            // Nastavení event listenerů
            this.setupEventListeners();

            // Inicializace AOS (pokud je dostupná)
            if (typeof AOS !== 'undefined') {
                console.log('🎨 Initializing AOS animations...');
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out'
                });
            }

            // Přidání uvítací zprávy do chatu
            setTimeout(() => {
                this.addChatMessage('AI Sarah', 'Vítej v AI Kostkové Výzvě! 🎲 Jsem připravena na souboj!', 'ai');
            }, 1000);

            this.initialized = true;
            console.log('✅ Application initialized');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Chyba při načítání aplikace. Zkuste obnovit stránku.');
        }
    }

    // Načtení modálů
    async loadModals() {
        const modals = [
            '/src/templates/modals/rules-modal.html',
            '/src/templates/modals/hall-of-fame-modal.html',
            '/src/templates/modals/game-over-modal.html'
        ];

        const container = document.getElementById('modalsContainer') || document.body;
        
        for (const modal of modals) {
            try {
                const html = await this.loadTemplate(modal);
                container.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                console.error(`Failed to load modal ${modal}:`, error);
            }
        }
    }

    // Nastavení event listenerů
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Delegování událostí na document
        document.addEventListener('click', (e) => {
            console.log('👆 Click detected on element:', e.target.tagName, 'ID:', e.target.id, 'Classes:', e.target.className);
            
            // Pomocná funkce pro kontrolu tlačítek - zkontroluje jak target tak closest parent
            const isButton = (selectors) => {
                return e.target.matches(selectors) || e.target.closest(selectors);
            };
            
            // Start game buttons
            if (isButton('#startGameBtn, #startGameBtnMobile')) {
                e.preventDefault();
                console.log('🎮 Start game button clicked');
                this.startGame();
            }
            
            // Quit game buttons
            else if (isButton('#quitGameBtn, #quitGameBtnMobile')) {
                e.preventDefault();
                console.log('🚪 Quit game button clicked');
                this.quitGame();
            }
            
            // Hall of Fame buttons
            else if (isButton('#hallOfFameBtn, #hallOfFameBtnMobile')) {
                e.preventDefault();
                console.log('🏆 Hall of Fame button clicked');
                this.showHallOfFame();
            }
            
            // Rules buttons
            else if (isButton('#rulesBtn, #rulesBtnMobile')) {
                e.preventDefault();
                console.log('📖 Rules button clicked');
                this.showRules();
            }
            
            // Target score arrows
            else if (isButton('#scoreUpBtn, #scoreUpBtnMobile')) {
                e.preventDefault();
                console.log('⬆️ Score up button clicked');
                this.adjustTargetScore(1000);
            }
            
            else if (isButton('#scoreDownBtn, #scoreDownBtnMobile')) {
                e.preventDefault();
                console.log('⬇️ Score down button clicked');
                this.adjustTargetScore(-1000);
            }
            
            // Chat send button
            else if (isButton('#sendMessageBtn, #sendMessageBtnMobile')) {
                e.preventDefault();
                console.log('💬 Chat send button clicked');
                this.sendChatMessage();
            }
            
            // HERNÍ TLAČÍTKA
            // Roll dice button
            else if (isButton('#rollBtn, #rollBtnMobile')) {
                e.preventDefault();
                console.log('🎲 Roll dice button clicked');
                this.rollDice();
            }
            
            // Bank dice button
            else if (isButton('#bankBtn, #bankBtnMobile')) {
                e.preventDefault();
                console.log('🏦 Bank dice button clicked');
                this.bankDice();
            }
            
            // End turn button
            else if (isButton('#endTurnBtn, #endTurnBtnMobile')) {
                e.preventDefault();
                console.log('✋ End turn button clicked');
                this.endTurn();
            }
            
            // Dice selection
            else if (e.target.matches('.dice') || e.target.closest('.dice')) {
                console.log('🎯 Dice clicked');
                const diceElement = e.target.closest('.dice') || e.target;
                this.selectDice(diceElement);
            }
            
            // Modal close buttons
            else if (isButton('.modal-close, .modal-overlay')) {
                console.log('❌ Modal close clicked');
                this.closeModal(e.target);
            }
            
            // Pokud nebyla detekována žádná akce, log to
            else {
                console.log('🤷 No action detected for this click');
            }
        });
        
        console.log('✅ Event listeners set up successfully');

        // Escape key pro zavření modálů
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
            
            // Enter key pro odeslání zprávy
            if (e.key === 'Enter' && e.target.matches('#chatInput, #chatInputMobile')) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Úprava cílového skóre
    adjustTargetScore(amount) {
        const inputs = ['targetScoreInput', 'targetScoreInputMobile'];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                let currentValue = parseInt(input.value) || 5000;
                let newValue = currentValue + amount;
                
                // Minimum 1000
                if (newValue < 1000) {
                    newValue = 1000;
                }
                
                // Maximum 100000
                if (newValue > 100000) {
                    newValue = 100000;
                }
                
                input.value = newValue;
            }
        });
    }

    // Odeslání chat zprávy
    sendChatMessage() {
        const inputs = ['chatInput', 'chatInputMobile'];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input && input.value.trim()) {
                const message = input.value.trim();
                
                // Přidání zprávy do chatu
                this.addChatMessage('Hráč', message, 'user');
                
                // Vymazání inputu
                input.value = '';
                
                // Simulace AI odpovědi
                setTimeout(() => {
                    this.addAIResponse(message);
                }, 500);
            }
        });
    }

    // Přidání zprávy do chatu
    addChatMessage(sender, message, type = 'user') {
        const chatContainers = ['chatMessages', 'chatMessagesMobile'];
        
        chatContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${type} mb-2`;
                
                const color = type === 'user' ? 'text-neon-green' : 'text-neon-blue';
                
                messageDiv.innerHTML = `
                    <div class="d-flex align-items-start">
                        <div class="chat-avatar me-2">
                            <span class="badge bg-secondary">${sender.charAt(0)}</span>
                        </div>
                        <div class="chat-content">
                            <div class="chat-sender ${color} fw-bold small">${sender}</div>
                            <div class="chat-text text-light">${message}</div>
                        </div>
                    </div>
                `;
                
                container.appendChild(messageDiv);
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    // Simulace AI odpovědi
    addAIResponse(userMessage) {
        const responses = [
            "Zajímavé! Co si o tom myslíš?",
            "Dobře zahráno! Pokračuj!",
            "Strategie je klíčová v této hře.",
            "Zkus to jinak, možná to bude lepší.",
            "Skvělý tah! Jsem napjatá, jak to dopadne.",
            "Hmm, to je tricky situace...",
            "Rozhodně máš talent na tuto hru!",
            "Jaký je tvůj další plán?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiNames = ['AI Sarah', 'AI Marcus', 'AI Luna'];
        const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
        
        this.addChatMessage(randomAI, randomResponse, 'ai');
    }

    // Spuštění hry
    async startGame() {
        try {
            console.log('🎮 Starting game...');
            console.log('🔍 Current game state before start:', {
                gameStarted: this.gameState.gameStarted,
                gameEnded: this.gameState.gameEnded,
                initialized: this.initialized
            });
            
            // Získání cílového skóre
            const targetInput = document.getElementById('targetScoreInput') || 
                              document.getElementById('targetScoreInputMobile');
            
            if (targetInput) {
                const target = parseInt(targetInput.value) || 5000;
                this.gameState.targetScore = target;
                console.log('🎯 Target score set to:', target);
            }
            
            // Reset hráčů
            this.gameState.players.forEach(player => {
                player.score = 0;
            });
            this.gameState.currentPlayerIndex = 0;
            console.log('👥 Players reset');
            
            // Inicializace herních proměnných
            this.initGameVariables();
            
            // Skrytí menu
            console.log('🫥 Hiding menus...');
            this.hideMenus();
            
            // Zobrazení herních ovládání
            console.log('🎮 Showing game controls...');
            this.showGameControls();
            
            // Aktualizace stavu
            this.gameState.gameStarted = true;
            this.gameState.gameEnded = false;
            console.log('✅ Game state updated:', {
                gameStarted: this.gameState.gameStarted,
                gameEnded: this.gameState.gameEnded
            });
            
            // Aktualizace UI
            this.updateDiceDisplay();
            this.updateGameButtons();
            this.updateScore();
            console.log('🖼️ UI updated');
            
            // Zobrazení úspěšné zprávy
            this.showNotification('Hra byla spuštěna!', 'success');
            this.addChatMessage('Systém', '🎮 Hra začala! Hoďte kostky pro začátek.', 'system');
            
            console.log('✅ Game started successfully!');
            
        } catch (error) {
            console.error('❌ Failed to start game:', error);
            this.showError('Chyba při spuštění hry');
        }
    }

    // Ukončení hry
    async quitGame() {
        try {
            console.log('🔚 Quitting game...');
            console.log('🔍 Current game state before quit:', {
                gameStarted: this.gameState.gameStarted,
                gameEnded: this.gameState.gameEnded
            });
            
            // Skrytí herních ovládání
            console.log('🫥 Hiding game controls...');
            this.hideGameControls();
            
            // Zobrazení menu
            console.log('🏠 Showing menus...');
            this.showMenus();
            
            // Reset stavu
            this.gameState.gameStarted = false;
            this.gameState.gameEnded = false;
            console.log('🔄 Game state reset:', {
                gameStarted: this.gameState.gameStarted,
                gameEnded: this.gameState.gameEnded
            });
            
            // Zobrazení zprávy
            this.showNotification('Hra byla ukončena', 'info');
            
            console.log('✅ Game quit successfully!');
            
        } catch (error) {
            console.error('❌ Failed to quit game:', error);
        }
    }

    // Zobrazení Hall of Fame
    showHallOfFame() {
        const modal = document.getElementById('hallOfFameModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Zobrazení pravidel
    showRules() {
        const modal = document.getElementById('rulesModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Skrytí menu
    hideMenus() {
        console.log('🫥 hideMenus() called');
        const elements = [
            document.getElementById('gameContent'),
            document.getElementById('gameMobileContent')
        ];
        
        elements.forEach((el, index) => {
            if (el) {
                el.classList.add('hidden');
                console.log(`✅ Hidden menu element ${index + 1}`);
            } else {
                console.warn(`⚠️ Menu element ${index + 1} not found`);
            }
        });
    }

    // Zobrazení menu
    showMenus() {
        console.log('🏠 showMenus() called');
        const elements = [
            document.getElementById('gameContent'),
            document.getElementById('gameMobileContent')
        ];
        
        elements.forEach((el, index) => {
            if (el) {
                el.classList.remove('hidden');
                console.log(`✅ Shown menu element ${index + 1}`);
            } else {
                console.warn(`⚠️ Menu element ${index + 1} not found`);
            }
        });
    }

    // Skrytí herních ovládání
    hideGameControls() {
        console.log('🫥 hideGameControls() called');
        const elements = [
            document.getElementById('gameControls'),
            document.getElementById('gameControlsMobile')
        ];
        
        elements.forEach((el, index) => {
            if (el) {
                el.classList.add('hidden');
                console.log(`✅ Hidden game control element ${index + 1}`);
            } else {
                console.warn(`⚠️ Game control element ${index + 1} not found`);
            }
        });
    }

    // Zobrazení herních ovládání
    showGameControls() {
        console.log('🎮 showGameControls() called');
        const elements = [
            document.getElementById('gameControls'),
            document.getElementById('gameControlsMobile')
        ];
        
        elements.forEach((el, index) => {
            if (el) {
                el.classList.remove('hidden');
                console.log(`✅ Shown game control element ${index + 1}`);
            } else {
                console.warn(`⚠️ Game control element ${index + 1} not found`);
            }
        });
    }

    // Zavření modálního okna
    closeModal(target) {
        const modal = target.closest('.modal-overlay');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Zavření vrchního modálního okna
    closeTopModal() {
        const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
        if (modals.length > 0) {
            modals[modals.length - 1].classList.add('hidden');
        }
    }

    // Zobrazení notifikace
    showNotification(message, type = 'info') {
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
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Zobrazení chyby
    showError(message) {
        this.showNotification(message, 'danger');
    }

    // Zpracování resize
    handleResize() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // ============================================
    // HERNÍ LOGIKA
    // ============================================

    // Inicializace herních proměnných
    initGameVariables() {
        this.gameState.currentTurn = {
            diceValues: [],
            selectedDice: [],
            availableDice: 6,
            turnScore: 0,
            mustBankDice: false
        };
        
        console.log('🎮 Game variables initialized');
    }

    // Hození kostkami
    rollDice() {
        console.log('🎲 Rolling dice...');
        
        if (!this.gameState.gameStarted) {
            console.warn('Game not started');
            return;
        }

        // Inicializace herních proměnných pokud nejsou
        if (!this.gameState.currentTurn) {
            this.initGameVariables();
        }

        const availableDice = this.gameState.currentTurn.availableDice;
        
        if (availableDice <= 0) {
            console.warn('No dice available to roll');
            return;
        }

        // Hození kostkami
        const diceValues = [];
        for (let i = 0; i < availableDice; i++) {
            diceValues.push(Math.floor(Math.random() * 6) + 1);
        }

        console.log('🎲 Dice rolled:', diceValues);
        
        // Uložení výsledků
        this.gameState.currentTurn.diceValues = diceValues;
        this.gameState.currentTurn.selectedDice = [];
        
        // Aktualizace UI
        this.updateDiceDisplay();
        this.updateGameButtons();
        
        // Zkontroluj FARKLE
        const score = this.calculateScore(diceValues);
        if (score === 0) {
            console.log('❌ FARKLE! No scoring dice');
            this.handleFarkle();
        } else {
            console.log('✅ Scoring dice available, score:', score);
            this.gameState.currentTurn.mustBankDice = true;
            this.addChatMessage('Systém', `🎲 Hodil jste: ${diceValues.join(', ')}. Možné body: ${score}`, 'system');
        }
    }

    // Výpočet skóre
    calculateScore(diceValues) {
        if (!Array.isArray(diceValues)) return 0;
        
        // Jednoduchý výpočet Farkle skóre
        const counts = {};
        diceValues.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });

        let score = 0;
        
        // Jedničky (100 bodů za kus, 1000 za triple)
        if (counts[1]) {
            if (counts[1] >= 3) {
                score += 1000;
                counts[1] -= 3;
            }
            score += counts[1] * 100;
        }

        // Pětky (50 bodů za kus, 500 za triple)
        if (counts[5]) {
            if (counts[5] >= 3) {
                score += 500;
                counts[5] -= 3;
            }
            score += counts[5] * 50;
        }

        // Ostatní triple kombinace
        [2, 3, 4, 6].forEach(num => {
            if (counts[num] >= 3) {
                score += num * 100;
            }
        });

        return score;
    }

    // Výběr kostky
    selectDice(diceElement) {
        console.log('🎯 Selecting dice');
        
        if (!this.gameState.currentTurn || !this.gameState.currentTurn.mustBankDice) {
            console.warn('Cannot select dice - must roll first or bank dice');
            return;
        }

        const index = parseInt(diceElement.dataset.index);
        const selectedDice = this.gameState.currentTurn.selectedDice;
        
        if (selectedDice.includes(index)) {
            // Odznačit
            selectedDice.splice(selectedDice.indexOf(index), 1);
            diceElement.classList.remove('selected');
            console.log('➖ Dice deselected:', index);
        } else {
            // Označit
            selectedDice.push(index);
            diceElement.classList.add('selected');
            console.log('➕ Dice selected:', index);
        }

        this.updateGameButtons();
    }

    // Odložení vybraných kostek
    bankDice() {
        console.log('🏦 Banking dice...');
        
        if (!this.gameState.currentTurn || this.gameState.currentTurn.selectedDice.length === 0) {
            console.warn('No dice selected to bank');
            return;
        }

        const selectedIndices = this.gameState.currentTurn.selectedDice;
        const selectedValues = selectedIndices.map(i => this.gameState.currentTurn.diceValues[i]);
        const score = this.calculateScore(selectedValues);
        
        if (score === 0) {
            console.warn('Selected dice have no score');
            return;
        }

        // Přidání skóre
        this.gameState.currentTurn.turnScore += score;
        this.gameState.currentTurn.availableDice -= selectedIndices.length;
        
        // Hot dice - pokud se použily všechny kostky
        if (this.gameState.currentTurn.availableDice === 0) {
            this.gameState.currentTurn.availableDice = 6;
            this.addChatMessage('Systém', '🔥 HOT DICE! Všechny kostky použity, dostáváte 6 nových!', 'system');
        }

        // Reset pro další hod
        this.gameState.currentTurn.diceValues = [];
        this.gameState.currentTurn.selectedDice = [];
        this.gameState.currentTurn.mustBankDice = false;
        
        console.log('💰 Banked dice for score:', score, 'Total turn score:', this.gameState.currentTurn.turnScore);
        this.addChatMessage('Systém', `💰 Získali jste ${score} bodů. Celkem v tahu: ${this.gameState.currentTurn.turnScore}`, 'system');
        
        this.updateDiceDisplay();
        this.updateGameButtons();
        this.updateScore();
    }

    // Ukončení tahu
    endTurn() {
        console.log('✋ Ending turn...');
        
        if (!this.gameState.currentTurn) {
            console.warn('No active turn to end');
            return;
        }

        // Přidání skóre k celkovému skóre hráče
        this.gameState.players[this.gameState.currentPlayerIndex].score += this.gameState.currentTurn.turnScore;
        
        const finalScore = this.gameState.players[this.gameState.currentPlayerIndex].score;
        console.log('📊 Turn ended with score:', this.gameState.currentTurn.turnScore, 'Total score:', finalScore);
        
        this.addChatMessage('Systém', `🏁 Tah ukončen! Celkové skóre: ${finalScore}`, 'system');
        
        // Zkontroluj výhru
        if (finalScore >= this.gameState.targetScore) {
            this.handleGameWin();
            return;
        }

        // Přechod na dalšího hráče
        this.nextPlayer();
    }

    // Zpracování FARKLE
    handleFarkle() {
        console.log('💥 FARKLE!');
        this.addChatMessage('Systém', '💥 FARKLE! Žádné bodující kostky! Tah končí s 0 body.', 'system');
        
        // Reset tahu
        this.gameState.currentTurn = {
            diceValues: [],
            selectedDice: [],
            availableDice: 6,
            turnScore: 0,
            mustBankDice: false
        };
        
        this.updateDiceDisplay();
        this.updateGameButtons();
        
        // Přechod na dalšího hráče po chvilce
        setTimeout(() => {
            this.nextPlayer();
        }, 2000);
    }

    // Přechod na dalšího hráče
    nextPlayer() {
        this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
        
        // Reset tahu
        this.initGameVariables();
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        console.log('👤 Next player:', currentPlayer.name);
        
        this.updateDiceDisplay();
        this.updateGameButtons();
        this.updateScore();
        
        // AI tah
        if (!currentPlayer.isHuman) {
            this.handleAITurn();
        } else {
            this.addChatMessage('Systém', `🎮 ${currentPlayer.name}, je váš tah!`, 'system');
        }
    }

    // Zpracování AI tahu
    handleAITurn() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        this.addChatMessage(currentPlayer.name, `🤖 Přemýšlím o svém tahu...`, 'ai');
        
        // Simulace AI tahu
        setTimeout(() => {
            const aiScore = Math.floor(Math.random() * 500) + 100;
            this.gameState.players[this.gameState.currentPlayerIndex].score += aiScore;
            
            this.addChatMessage(currentPlayer.name, `🎯 Získal jsem ${aiScore} bodů!`, 'ai');
            
            // Zkontroluj výhru
            if (this.gameState.players[this.gameState.currentPlayerIndex].score >= this.gameState.targetScore) {
                this.handleGameWin();
            } else {
                this.nextPlayer();
            }
        }, 2000);
    }

    // Zpracování výhry
    handleGameWin() {
        const winner = this.gameState.players[this.gameState.currentPlayerIndex];
        console.log('🏆 Game won by:', winner.name);
        
        this.gameState.gameEnded = true;
        this.addChatMessage('Systém', `🏆 ${winner.name} vyhrál hru se skóre ${winner.score}!`, 'system');
        
        // Zobrazit modal výhry
        setTimeout(() => {
            this.showGameOverModal(winner);
        }, 2000);
    }

    // Zobrazení modalu konce hry
    showGameOverModal(winner) {
        const modal = document.getElementById('gameOverModal');
        if (modal) {
            // Aktualizace textu výhry
            const winnerText = modal.querySelector('#winnerText');
            if (winnerText) {
                winnerText.textContent = `${winner.name} vyhrál se skóre ${winner.score}!`;
            }
            
            modal.classList.remove('hidden');
        }
    }

    // Aktualizace zobrazení kostek
    updateDiceDisplay() {
        const containers = ['diceContainer', 'diceContainerMobile'];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            if (this.gameState.currentTurn && this.gameState.currentTurn.diceValues.length > 0) {
                this.gameState.currentTurn.diceValues.forEach((value, index) => {
                    const diceElement = document.createElement('div');
                    diceElement.className = 'dice';
                    diceElement.dataset.index = index;
                    diceElement.textContent = value;
                    
                    // Označení vybraných kostek
                    if (this.gameState.currentTurn.selectedDice.includes(index)) {
                        diceElement.classList.add('selected');
                    }
                    
                    container.appendChild(diceElement);
                });
            }
        });
    }

    // Aktualizace stavu tlačítek
    updateGameButtons() {
        const buttons = [
            { id: 'rollBtn', condition: !this.gameState.currentTurn?.mustBankDice && this.gameState.currentTurn?.availableDice > 0 },
            { id: 'bankBtn', condition: this.gameState.currentTurn?.mustBankDice && this.gameState.currentTurn?.selectedDice.length > 0 },
            { id: 'endTurnBtn', condition: this.gameState.currentTurn?.turnScore > 0 && !this.gameState.currentTurn?.mustBankDice }
        ];
        
        buttons.forEach(button => {
            const elements = [document.getElementById(button.id), document.getElementById(button.id + 'Mobile')];
            elements.forEach(element => {
                if (element) {
                    element.disabled = !button.condition;
                }
            });
        });
    }

    // Aktualizace skóre
    updateScore() {
        const scoreElements = [
            { id: 'humanScore', index: 0 },
            { id: 'geminiScore', index: 1 },
            { id: 'chatgptScore', index: 2 },
            { id: 'claudeScore', index: 3 }
        ];
        
        scoreElements.forEach(element => {
            const scoreElement = document.getElementById(element.id);
            if (scoreElement && this.gameState.players[element.index]) {
                scoreElement.textContent = this.gameState.players[element.index].score;
            }
        });
        
        // Aktualizace skóre tahu
        const turnScoreElements = ['currentTurnScore', 'currentTurnScoreMobile'];
        turnScoreElements.forEach(id => {
            const element = document.getElementById(id);
            if (element && this.gameState.currentTurn) {
                element.textContent = `Skóre tahu: ${this.gameState.currentTurn.turnScore}`;
            }
        });
        
        // Aktualizace informace o tahu
        const turnInfoElements = ['turnInfo', 'turnInfoMobile'];
        turnInfoElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
                element.textContent = currentPlayer.isHuman ? 'Váš tah!' : `Tah: ${currentPlayer.name}`;
            }
        });
    }
}

// Inicializace aplikace
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 DOM loaded, initializing simple dice game...');
    
    try {
        const game = new SimpleDiceGame();
        await game.initialize();
        
        // Zpřístupnění pro debugging
        window.simpleDiceGame = game;
        
        console.log('✅ Simple dice game initialized successfully!');
        
    } catch (error) {
        console.error('❌ Failed to initialize simple dice game:', error);
        
        // Fallback error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed top-0 start-0 w-100 text-center';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `
            <h4>❌ Chyba aplikace</h4>
            <p>Aplikace se nepodařila načíst. Zkuste obnovit stránku.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Obnovit</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
});

export default SimpleDiceGame;
