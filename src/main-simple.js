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
                { name: 'Hráč', score: 0, isHuman: true, hasEnteredGame: false },
                { name: 'AI Sarah', score: 0, isHuman: false, hasEnteredGame: false },
                { name: 'AI Marcus', score: 0, isHuman: false, hasEnteredGame: false },
                { name: 'AI Luna', score: 0, isHuman: false, hasEnteredGame: false }
            ],
            currentPlayerIndex: 0,
            targetScore: 5000,
            gameEntryMinimum: 300 // Minimální skóre pro vstup do hry
        };
        
        // Mapování hráčských jmen na AI identity
        this.aiIdentityMap = {
            'AI Sarah': 'Gemini',
            'AI Marcus': 'ChatGPT', 
            'AI Luna': 'Claude'
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

    // Získání AI identity z hráčského jména
    getAIIdentity(playerName) {
        return this.aiIdentityMap[playerName] || playerName;
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

            // Přidání uvítacích zpráv do chatu
            setTimeout(() => {
                this.addChatMessage('Systém', 'Vítejte v AI Kostkové Výzvě! 🎲', 'system');
            }, 500);
            
            setTimeout(() => {
                this.addChatMessage('Gemini', 'Ah, další člověček se odvážil vyzvat nás! 😏 Připrav se na porážku!', 'ai');
            }, 1200);
            
            setTimeout(() => {
                this.addChatMessage('ChatGPT', 'Gemini, nebuď tak drzý! 💅 Ale člověče, opravdu si myslíš, že nás porazíš?', 'ai');
            }, 2000);
            
            setTimeout(() => {
                this.addChatMessage('Claude', 'Kolegové, uklidněte se! 🧡 I když... člověče, tvoje šance jsou docela malé! 😈', 'ai');
            }, 2800);

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
            else if (isButton('#sendChatBtn, #sendChatBtnMobile')) {
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
                
                // Určení barvy a třídy podle odesílatele
                let color = 'neon-green'; // default pro hráče
                let messageClass = 'msg-human'; // default
                
                if (sender === 'Systém') {
                    color = 'neon-yellow';
                    messageClass = 'msg-system';
                } else if (sender === 'Gemini') {
                    color = 'neon-blue';
                    messageClass = 'msg-gemini';
                } else if (sender === 'ChatGPT') {
                    color = 'neon-pink';
                    messageClass = 'msg-chatgpt';
                } else if (sender === 'Claude') {
                    color = 'neon-orange';
                    messageClass = 'msg-claude';
                } else if (type === 'ai') {
                    color = 'neon-blue'; // fallback pro AI
                    messageClass = 'msg-gemini';
                }
                
                messageDiv.className = `chat-message ${messageClass} ${type} new-message`;
                
                messageDiv.innerHTML = `
                    <div class="chat-content">
                        <div class="chat-text ${color}">${message}</div>
                    </div>
                `;
                
                container.appendChild(messageDiv);
                container.scrollTop = container.scrollHeight;
                
                // Odstranění animace po dokončení
                setTimeout(() => {
                    messageDiv.classList.remove('new-message');
                }, 800);
            }
        });
    }

    // Simulace AI odpovědi na hráčovu zprávu
    addAIResponse(userMessage) {
        const responses = {
            'Gemini': [
                "Člověče, to je zajímavé pozorování! 🤔",
                "Hmm, strategie člověka... docela primitivní! 😏",
                "Dobře řečeno! Ale činy jsou důležitější než slova!",
                "Tvoje logika má mezery, člověče! 🎯",
                "Analyticky zajímavé, ale prakticky neužitečné!"
            ],
            'ChatGPT': [
                "Ooh, jak chytré od tebe, člověček! 💅✨",
                "To je sladké, že si myslíš, že máš šanci! 😘",
                "Aww, člověče, to je roztomilé! Ale naivní! 💖",
                "Krásně řečeno! Škoda, že to nic nezmění! 🌟",
                "Tak poetické! Ale realita bude krutá! 💫"
            ],
            'Claude': [
                "Zajímavý pohled, člověče! Ale nesprávný! 🧡",
                "Chápu tvou logiku, ale je chybná! 🤓",
                "Respektuji tvou snahu, člověče! Marnou snahu! 😊",
                "Dobře strukturovaná myšlenka! Špatný závěr! 📚",
                "Tvoje úvahy jsou... lidské. To je problém! 🎭"
            ]
        };
        
        const aiNames = ['Gemini', 'ChatGPT', 'Claude'];
        const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
        const aiResponses = responses[randomAI];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        this.addChatMessage(randomAI, randomResponse, 'ai');
    }
    
    // AI štěkání před hodem kostkami
    addAITrashTalk() {
        const trashTalk = {
            'Gemini': [
                "Člověče, připrav se na FARKLE! 🎲😈",
                "Tvoje kosti nebudou poslouchat! 🤖",
                "Matematika je proti tobě, člověče! 📊",
                "Pravděpodobnost tvé výhry: 0.001%! 💀",
                "Člověčí štěstí končí... TERAZ! ⚡"
            ],
            'ChatGPT': [
                "Člověčku, připrav si kapesníčky! 😭💅",
                "Budeš plakat jako malé dítě! 👶✨",
                "Tvoje kostky budou poslouchat MĚ! 💖👑",
                "Já už vidím tvůj FARKLE! Je krásný! 🌈",
                "Člověče, budeš litovat této hry! 💔"
            ],
            'Claude': [
                "Člověče, statistiky jsou jasné - prohraješ! 📈🧡",
                "Připrav se na lekci z pravděpodobnosti! 🎯",
                "Tvoje lidské intuice tě zklame! 🧠",
                "Čekám tvůj epicový FARKLE! 🎭",
                "Člověče, hra už je rozhodnuta! 📚"
            ]
        };
        
        const aiNames = ['Gemini', 'ChatGPT', 'Claude'];
        const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
        const aiMessages = trashTalk[randomAI];
        const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
        
        this.addChatMessage(randomAI, randomMessage, 'ai');
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
                player.hasEnteredGame = false;
            });
            this.gameState.currentPlayerIndex = 0;
            console.log('👥 Players reset - all players out of game');
            
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
            mustBankDice: false,
            bankedDice: []
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

        // AI štěkání před hodem kostkami
        if (Math.random() < 0.7) { // 70% šance na štěkání
            setTimeout(() => {
                this.addAITrashTalk();
            }, 200);
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

    // Výpočet skóre podle pravidel Farkle
    calculateScore(diceValues) {
        if (!Array.isArray(diceValues) || diceValues.length === 0) {
            console.log('🔍 calculateScore: No dice values provided');
            return 0;
        }
        
        console.log('🧮 calculateScore: Calculating score for dice:', diceValues);
        
        let score = 0;
        let counts = [0, 0, 0, 0, 0, 0, 0]; // index 0 unused, 1-6 for die values
        
        diceValues.forEach(die => counts[die]++);
        
        console.log('🔢 calculateScore: Dice counts:', counts);
        
        // Speciální kombinace - POSTUPKA (1-2-3-4-5-6)
        if (diceValues.length === 6 && counts.every(count => count === 1)) {
            console.log('🎯 calculateScore: POSTUPKA = 1500 bodů');
            return 1500;
        }
        
        // Speciální kombinace - TŘI PÁRY
        if (diceValues.length === 6) {
            let pairs = 0;
            for (let i = 1; i <= 6; i++) {
                if (counts[i] === 2) pairs++;
            }
            if (pairs === 3 && counts.filter(count => count > 0).length === 3) {
                console.log('🎯 calculateScore: TŘI PÁRY = 1500 bodů');
                return 1500;
            }
        }
        
        // Zpracování trojic a víc (s multiplikátorem)
        for (let i = 1; i <= 6; i++) {
            if (counts[i] >= 3) {
                let multiplier = counts[i] - 2; // 3=1x, 4=2x, 5=4x, 6=8x
                if (counts[i] >= 4) {
                    multiplier = Math.pow(2, counts[i] - 3);
                }
                
                let partialScore = 0;
                if (i === 1) {
                    partialScore = 1000 * multiplier; // Trojice jedniček
                    console.log(`🎯 calculateScore: ${counts[i]}×1 = 1000 × ${multiplier} = ${partialScore}`);
                } else {
                    partialScore = i * 100 * multiplier; // Trojice ostatních
                    console.log(`🎯 calculateScore: ${counts[i]}×${i} = ${i}×100 × ${multiplier} = ${partialScore}`);
                }
                score += partialScore;
                counts[i] = 0; // Spotřebované kostky
            }
        }
        
        // Jednotlivé 1s a 5s (pouze pokud nebyly spotřebované v trojicích)
        if (counts[1] > 0) {
            const partialScore = counts[1] * 100;
            score += partialScore;
            console.log(`🎯 calculateScore: ${counts[1]}×1 (individual) = ${partialScore}`);
        }
        if (counts[5] > 0) {
            const partialScore = counts[5] * 50;
            score += partialScore;
            console.log(`🎯 calculateScore: ${counts[5]}×5 (individual) = ${partialScore}`);
        }
        
        console.log(`🎊 calculateScore: Total score = ${score}`);
        return score;
    }

    // Pomocná funkce pro kontrolu, zda kostka může být součástí validní kombinace
    canBePartOfValidCombination(diceValue, currentSelection) {
        // Spočítej kolikrát se každá hodnota vyskytuje ve výběru
        const counts = {};
        currentSelection.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });
        
        // Jednotlivé 1s a 5s jsou vždy validní
        if (diceValue === 1 || diceValue === 5) {
            return true;
        }
        
        // Pro ostatní kostky (2,3,4,6) - musíme už mít alespoň 2 stejné kostky
        // NELZE vybrat jedinou kostku 2,3,4,6 - musí být alespoň 3 pro trojici
        const currentCount = counts[diceValue] || 0;
        
        // Zkontroluj, jestli už nemáme jiné kostky ve výběru
        const hasOtherValues = Object.keys(counts).some(value => 
            parseInt(value) !== diceValue && counts[value] > 0
        );
        
        if (hasOtherValues) {
            // Už máme jiné kostky - nelze přidat kostku, která není 1 nebo 5
            return false;
        }
        
        // Pro kostky 2,3,4,6: povolíme je pouze pokud:
        // 1. Už máme alespoň 2 stejné (budujeme k trojici) - OPRAVENO z 1 na 2
        // 2. A celkový počet bude max 6
        return currentCount >= 2 && currentCount < 6;
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
        const diceValue = this.gameState.currentTurn.diceValues[index];
        
        console.log(`🎯 Dice selection: index=${index}, value=${diceValue}`);
        
        if (selectedDice.includes(index)) {
            // Odznačit kostku
            selectedDice.splice(selectedDice.indexOf(index), 1);
            diceElement.classList.remove('selected');
            console.log(`➖ Dice deselected: index=${index}, value=${diceValue}`);
        } else {
            // Označit kostku - nejprve zkontroluj, jestli může být součástí validní kombinace
            const testSelection = [...selectedDice, index];
            const testValues = testSelection.map(i => this.gameState.currentTurn.diceValues[i]);
            const testScore = this.calculateScore(testValues);
            
            console.log(`🧪 Testing selection: indices=${testSelection}, values=${testValues}, score=${testScore}`);
            
            // Povolíme výběr POUZE pokud:
            // 1. Aktuální výběr je prázdný a nová kostka má skóre (1 nebo 5, nebo začíná trojici)
            // 2. NEBO nová kostka skutečně přispívá ke skóre (zvyšuje celkové skóre)
            let canSelect = false;
            
            if (selectedDice.length === 0) {
                // Prázdný výběr - povolíme pouze 1, 5, nebo kostky pro budoucí trojici
                canSelect = testScore > 0 || this.canBePartOfValidCombination(diceValue, []);
            } else {
                // Už něco vybráno - zkontroluj, jestli nová kostka přispívá ke skóre
                const currentValues = selectedDice.map(i => this.gameState.currentTurn.diceValues[i]);
                const currentScore = this.calculateScore(currentValues);
                
                // Nová kostka musí buď zvýšit skóre, nebo být součástí platné kombinace
                canSelect = testScore > currentScore || this.canBePartOfValidCombination(diceValue, currentValues);
            }
            
            if (canSelect) {
                // Validní výběr - označit kostku
                selectedDice.push(index);
                diceElement.classList.add('selected');
                console.log(`➕ Dice selected: index=${index}, value=${diceValue}`);
            } else {
                // Nevalidní výběr - NEoznačovat kostku a zobrazit chybu
                console.warn(`❌ Invalid selection: adding dice ${diceValue} would make selection worthless`);
                this.addChatMessage('Systém', `❌ Nelze vybrat kostku ${diceValue} - výběr by neměl žádné body!`, 'system');
                return; // Výstup z funkce - kostka nebude označena
            }
        }

        // Kontrola aktuálního výběru
        const currentSelection = selectedDice.map(i => this.gameState.currentTurn.diceValues[i]);
        const currentScore = this.calculateScore(currentSelection);
        console.log(`🎯 Current selection: indices=${selectedDice}, values=${currentSelection}, score=${currentScore}`);

        this.updateGameButtons();
    }

    // Odložení vybraných kostek
    bankDice() {
        console.log('🏦 Banking dice...');
        
        if (!this.gameState.currentTurn || this.gameState.currentTurn.selectedDice.length === 0) {
            console.warn('🏦 No dice selected to bank');
            this.addChatMessage('Systém', '❌ Nejsou vybrány žádné kostky k odložení!', 'system');
            return;
        }

        const selectedIndices = this.gameState.currentTurn.selectedDice;
        const selectedValues = selectedIndices.map(i => this.gameState.currentTurn.diceValues[i]);
        const score = this.calculateScore(selectedValues);
        
        console.log(`🏦 Banking: indices=${selectedIndices}, values=${selectedValues}, score=${score}`);
        
        if (score === 0) {
            console.warn('🏦 Selected dice have no score');
            this.addChatMessage('Systém', '❌ Vybrané kostky nemají žádné body!', 'system');
            return;
        }

        // Přidání skóre
        this.gameState.currentTurn.turnScore += score;
        this.gameState.currentTurn.availableDice -= selectedIndices.length;
        
        // Přidání odložených kostek pro zobrazení
        if (!this.gameState.currentTurn.bankedDice) {
            this.gameState.currentTurn.bankedDice = [];
        }
        this.gameState.currentTurn.bankedDice.push(...selectedValues);
        
        console.log(`🏦 Banked ${selectedIndices.length} dice for ${score} points`);
        console.log(`🏦 New turn score: ${this.gameState.currentTurn.turnScore}`);
        console.log(`🏦 Available dice: ${this.gameState.currentTurn.availableDice}`);
        console.log(`🏦 Banked dice: ${this.gameState.currentTurn.bankedDice}`);
        
        // Hot dice - pokud se použily všechny kostky
        if (this.gameState.currentTurn.availableDice === 0) {
            this.gameState.currentTurn.availableDice = 6;
            console.log('🔥 HOT DICE! All dice used, getting 6 new dice');
            this.addChatMessage('Systém', '🔥 HOT DICE! Všechny kostky použity, dostáváte 6 nových!', 'system');
        }

        // Reset pro další hod
        this.gameState.currentTurn.diceValues = [];
        this.gameState.currentTurn.selectedDice = [];
        this.gameState.currentTurn.mustBankDice = false;
        
        console.log('💰 Banked dice for score:', score, 'Total turn score:', this.gameState.currentTurn.turnScore);
        this.addChatMessage('Systém', `💰 Získali jste ${score} bodů. Celkem v tahu: ${this.gameState.currentTurn.turnScore}`, 'system');
        
        this.updateDiceDisplay();
        this.updateBankedDiceDisplay();
        this.updateGameButtons();
        this.updateScore();
    }

    // Zobrazení odložených kostek
    updateBankedDiceDisplay() {
        const bankedDice = this.gameState.currentTurn?.bankedDice || [];
        
        // Desktop verze - správné ID elementy
        const bankedContainer = document.getElementById('bankedDiceContainer');
        
        if (bankedContainer) {
            bankedContainer.innerHTML = '';
            
            if (bankedDice.length > 0) {
                // Přidat odložené kostky zprava doleva
                bankedDice.forEach(value => {
                    const diceEl = document.createElement('div');
                    diceEl.className = 'dice banked';
                    diceEl.textContent = value;
                    diceEl.style.order = bankedDice.length - bankedDice.indexOf(value); // Reverse order
                    bankedContainer.appendChild(diceEl);
                });
            }
        }
        
        // Mobilní verze - správné ID elementy
        const bankedContainerMobile = document.getElementById('bankedDiceContainerMobile');
        
        if (bankedContainerMobile) {
            bankedContainerMobile.innerHTML = '';
            
            if (bankedDice.length > 0) {
                // Přidat odložené kostky zprava doleva
                bankedDice.forEach(value => {
                    const diceEl = document.createElement('div');
                    diceEl.className = 'dice banked';
                    diceEl.textContent = value;
                    diceEl.style.order = bankedDice.length - bankedDice.indexOf(value); // Reverse order
                    bankedContainerMobile.appendChild(diceEl);
                });
            }
        }
        
        console.log(`🎲 Updated banked dice display: ${bankedDice}`);
    }

    // Ukončení tahu
    endTurn() {
        console.log('✋ Ending turn...');
        
        if (!this.gameState.currentTurn) {
            console.warn('No active turn to end');
            return;
        }

        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const turnScore = this.gameState.currentTurn.turnScore;
        
        console.log(`📊 Player ${currentPlayer.name} turn summary:`);
        console.log(`📊 - Turn score: ${turnScore}`);
        console.log(`📊 - Has entered game: ${currentPlayer.hasEnteredGame}`);
        console.log(`📊 - Current total score: ${currentPlayer.score}`);
        
        // Kontrola vstupu do hry
        if (!currentPlayer.hasEnteredGame) {
            if (turnScore >= this.gameState.gameEntryMinimum) {
                // Hráč vstupuje do hry
                currentPlayer.hasEnteredGame = true;
                currentPlayer.score += turnScore;
                console.log(`🎉 ${currentPlayer.name} enters the game with ${turnScore} points!`);
                this.addChatMessage('Systém', `🎉 ${currentPlayer.name} vstoupil do hry s ${turnScore} body!`, 'system');
            } else {
                // Nedostatečné skóre pro vstup
                console.log(`❌ ${currentPlayer.name} needs ${this.gameState.gameEntryMinimum} points to enter game (got ${turnScore})`);
                this.addChatMessage('Systém', `❌ ${currentPlayer.name} potřebuje alespoň ${this.gameState.gameEntryMinimum} bodů pro vstup do hry (získal ${turnScore})`, 'system');
            }
        } else {
            // Hráč již je ve hře - normální přičtení bodů
            currentPlayer.score += turnScore;
            console.log(`💰 ${currentPlayer.name} adds ${turnScore} points to total score`);
        }
        
        const finalScore = currentPlayer.score;
        console.log(`📊 Turn ended - final score: ${finalScore}`);
        
        this.addChatMessage('Systém', `🏁 Tah ukončen! Celkové skóre: ${finalScore}`, 'system');
        
        // Zkontroluj výhru (pouze pokud je hráč ve hře)
        if (currentPlayer.hasEnteredGame && finalScore >= this.gameState.targetScore) {
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
            mustBankDice: false,
            bankedDice: []
        };
        
        this.updateDiceDisplay();
        this.updateBankedDiceDisplay();
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
        this.updateBankedDiceDisplay();
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
        const aiIdentity = this.getAIIdentity(currentPlayer.name);
        
        this.addChatMessage(aiIdentity, `🤖 Přemýšlím o svém tahu...`, 'ai');
        
        console.log(`🤖 AI Turn: ${currentPlayer.name} (${aiIdentity})`);
        console.log(`🤖 Has entered game: ${currentPlayer.hasEnteredGame}`);
        
        // Simulace AI tahu s platným Farkle skóre
        setTimeout(() => {
            let aiScore;
            
            if (!currentPlayer.hasEnteredGame) {
                // AI musí získat alespoň 300 bodů pro vstup
                // Použijeme platné Farkle skóre kombinace
                const entryScores = [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000];
                aiScore = entryScores[Math.floor(Math.random() * entryScores.length)];
                currentPlayer.hasEnteredGame = true;
                console.log(`🤖 ${currentPlayer.name} enters game with ${aiScore} points`);
                this.addChatMessage(aiIdentity, `🎉 Vstoupil jsem do hry s ${aiScore} body!`, 'ai');
            } else {
                // Normální AI tah - použijeme pouze platné Farkle skóre
                const validScores = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1100, 1200, 1300, 1400, 1500];
                aiScore = validScores[Math.floor(Math.random() * validScores.length)];
                console.log(`🤖 ${currentPlayer.name} scores ${aiScore} points`);
                this.addChatMessage(aiIdentity, `🎯 Získal jsem ${aiScore} bodů!`, 'ai');
            }
            
            currentPlayer.score += aiScore;
            
            // Aktualizace UI
            this.updateScore();
            
            // Zkontroluj výhru
            if (currentPlayer.hasEnteredGame && currentPlayer.score >= this.gameState.targetScore) {
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
        // Používáme nové kontejnery - aktivní kostky do správného kontejneru
        const activeContainers = [
            { id: 'activeDiceContainer', mobile: false },
            { id: 'activeDiceContainerMobile', mobile: true }
        ];
        
        activeContainers.forEach(containerInfo => {
            const container = document.getElementById(containerInfo.id);
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
        
        // Aktualizujeme i odložené kostky
        this.updateBankedDiceDisplay();
    }

    // Aktualizace stavu tlačítek
    updateGameButtons() {
        console.log('🔄 updateGameButtons: Updating button states');
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const currentTurn = this.gameState.currentTurn;
        
        // Podmínky pro tlačítka
        const canRoll = !currentTurn?.mustBankDice && currentTurn?.availableDice > 0;
        const canBank = currentTurn?.mustBankDice && currentTurn?.selectedDice.length > 0;
        
        // Pro ukončení tahu: musí mít nějaké body V TOMTO TAHU a nesmí mít povinnost banknout
        // PLUS: pokud hráč není ve hře, musí mít alespoň 300 bodů
        let canEndTurn = currentTurn?.turnScore > 0 && !currentTurn?.mustBankDice;
        
        if (!currentPlayer.hasEnteredGame && currentTurn?.turnScore < this.gameState.gameEntryMinimum) {
            canEndTurn = false;
            console.log(`🚫 updateGameButtons: Cannot end turn - need ${this.gameState.gameEntryMinimum} points to enter game (have ${currentTurn?.turnScore})`);
        }
        
        console.log('🔄 updateGameButtons: Button conditions:', {
            canRoll,
            canBank,
            canEndTurn,
            turnScore: currentTurn?.turnScore,
            hasEnteredGame: currentPlayer.hasEnteredGame,
            mustBankDice: currentTurn?.mustBankDice,
            selectedDice: currentTurn?.selectedDice?.length
        });
        
        const buttons = [
            { id: 'rollBtn', condition: canRoll },
            { id: 'bankBtn', condition: canBank },
            { id: 'endTurnBtn', condition: canEndTurn }
        ];
        
        buttons.forEach(button => {
            const elements = [document.getElementById(button.id), document.getElementById(button.id + 'Mobile')];
            elements.forEach(element => {
                if (element) {
                    element.disabled = !button.condition;
                    console.log(`🔄 updateGameButtons: ${button.id} = ${button.condition ? 'enabled' : 'disabled'}`);
                }
            });
        });
    }

    // Aktualizace skóre
    updateScore() {
        console.log('📊 updateScore: Updating all score displays');
        
        const scoreElements = [
            { id: 'humanScore', index: 0 },
            { id: 'geminiScore', index: 1 }, 
            { id: 'chatgptScore', index: 2 },
            { id: 'claudeScore', index: 3 }
        ];
        
        scoreElements.forEach(element => {
            const scoreElement = document.getElementById(element.id);
            const scoreElementMobile = document.getElementById(element.id + 'Mobile');
            
            if (this.gameState.players[element.index]) {
                const player = this.gameState.players[element.index];
                const displayText = `${player.score}`;
                
                if (scoreElement) scoreElement.textContent = displayText;
                if (scoreElementMobile) scoreElementMobile.textContent = displayText;
                
                console.log(`📊 updateScore: Player ${player.name}: ${displayText}`);
            }
        });
        
        // Aktualizace skóre tahu
        const turnScoreElements = ['currentTurnScore', 'currentTurnScoreMobile'];
        turnScoreElements.forEach(id => {
            const element = document.getElementById(id);
            if (element && this.gameState.currentTurn) {
                const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
                const needsEntry = !currentPlayer.hasEnteredGame;
                const turnScore = this.gameState.currentTurn.turnScore;
                
                let displayText = `Skóre tahu: ${turnScore}`;
                if (needsEntry) {
                    const needed = this.gameState.gameEntryMinimum - turnScore;
                    if (needed > 0) {
                        displayText += ` (potřeba ${needed} pro vstup)`;
                    } else {
                        displayText += ` (vstup do hry!)`;
                    }
                }
                
                element.textContent = displayText;
                console.log(`📊 updateScore: Turn score display: ${displayText}`);
            }
        });
        
        // Aktualizace informace o tahu
        const turnInfoElements = ['turnInfo', 'turnInfoMobile'];
        turnInfoElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
                let displayText = currentPlayer.isHuman ? 'Váš tah!' : `Tah: ${currentPlayer.name}`;
                
                if (!currentPlayer.hasEnteredGame) {
                    displayText += ` (mimo hru - potřeba ${this.gameState.gameEntryMinimum})`;
                }
                
                element.textContent = displayText;
                console.log(`📊 updateScore: Turn info display: ${displayText}`);
            }
        });
    }

    // ============================================
    // TESTOVACÍ FUNKCE
    // ============================================

    // Testovací funkce pro nastavení konkrétních hodnot kostek
    testSetDiceValues(values) {
        console.log('🧪 TEST: Setting dice values:', values);
        
        if (!this.gameState.currentTurn) {
            this.initGameVariables();
        }
        
        // Nastav konkrétní hodnoty kostek
        this.gameState.currentTurn.diceValues = [...values];
        this.gameState.currentTurn.availableDice = values.length;
        this.gameState.currentTurn.selectedDice = [];
        this.gameState.currentTurn.mustBankDice = true;
        
        // Aktualizuj UI
        this.updateDiceDisplay();
        this.updateGameButtons();
        
        console.log('🧪 TEST: Dice values set successfully');
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
