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
                messageDiv.className = `chat-message ${type} mb-2`;
                
                // Určení barvy podle odesílatele
                let color = 'neon-green'; // default pro hráče
                if (sender === 'Systém') {
                    color = 'neon-yellow';
                } else if (sender === 'Gemini') {
                    color = 'neon-blue';
                } else if (sender === 'ChatGPT') {
                    color = 'neon-pink';
                } else if (sender === 'Claude') {
                    color = 'neon-orange';
                } else if (type === 'ai') {
                    color = 'neon-blue'; // fallback pro AI
                }
                
                messageDiv.innerHTML = `
                    <div class="chat-content">
                        <div class="chat-sender ${color} fw-bold small">${sender}</div>
                        <div class="chat-text ${color}">${message}</div>
                    </div>
                `;
                
                container.appendChild(messageDiv);
                container.scrollTop = container.scrollHeight;
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
        
        // Spočítej frekvenci každého čísla
        const counts = {};
        diceValues.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });
        
        console.log('🔢 calculateScore: Dice counts:', counts);
        
        let score = 0;
        
        // Zpracuj každé číslo
        Object.entries(counts).forEach(([number, count]) => {
            const num = parseInt(number);
            let partialScore = 0;
            
            if (num === 1) {
                // Jedničky: 3+ = 1000 bodů, jednotlivé = 100 bodů
                if (count >= 3) {
                    partialScore += 1000; // Triple jedniček
                    partialScore += (count - 3) * 100; // Zbývající jedničky
                    console.log(`🎯 calculateScore: ${count}×1 = 1000 (triple) + ${count - 3}×100 = ${partialScore}`);
                } else {
                    partialScore += count * 100; // Jednotlivé jedničky
                    console.log(`🎯 calculateScore: ${count}×1 = ${count}×100 = ${partialScore}`);
                }
            } else if (num === 5) {
                // Pětky: 3+ = 500 bodů, jednotlivé = 50 bodů
                if (count >= 3) {
                    partialScore += 500; // Triple pětek
                    partialScore += (count - 3) * 50; // Zbývající pětky
                    console.log(`🎯 calculateScore: ${count}×5 = 500 (triple) + ${count - 3}×50 = ${partialScore}`);
                } else {
                    partialScore += count * 50; // Jednotlivé pětky
                    console.log(`🎯 calculateScore: ${count}×5 = ${count}×50 = ${partialScore}`);
                }
            } else {
                // Ostatní čísla (2,3,4,6): pouze 3+ kostky bodují
                if (count >= 3) {
                    partialScore += num * 100; // Základní triple
                    partialScore += (count - 3) * 100; // Další kostky stejné hodnoty
                    console.log(`🎯 calculateScore: ${count}×${num} = ${num}×100 (triple) + ${count - 3}×100 = ${partialScore}`);
                } else {
                    console.log(`🎯 calculateScore: ${count}×${num} = 0 (no triple, no individual scoring)`);
                }
            }
            
            score += partialScore;
        });
        
        // TODO: Implementovat speciální kombinace (straight, 3 páry, atd.)
        
        console.log(`🎊 calculateScore: Total score = ${score}`);
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
        const diceValue = this.gameState.currentTurn.diceValues[index];
        
        console.log(`🎯 Dice selection: index=${index}, value=${diceValue}`);
        
        if (selectedDice.includes(index)) {
            // Odznačit kostku
            selectedDice.splice(selectedDice.indexOf(index), 1);
            diceElement.classList.remove('selected');
            console.log(`➖ Dice deselected: index=${index}, value=${diceValue}`);
        } else {
            // Označit kostku - ale nejdříve zkontroluj, jestli nový výběr bude validní
            const testSelection = [...selectedDice, index];
            const testValues = testSelection.map(i => this.gameState.currentTurn.diceValues[i]);
            const testScore = this.calculateScore(testValues);
            
            console.log(`🧪 Testing selection: indices=${testSelection}, values=${testValues}, score=${testScore}`);
            
            if (testScore > 0) {
                // Validní výběr
                selectedDice.push(index);
                diceElement.classList.add('selected');
                console.log(`➕ Dice selected: index=${index}, value=${diceValue}`);
            } else {
                // Nevalidní výběr
                console.warn(`❌ Invalid selection: adding dice ${diceValue} would make selection worthless`);
                this.addChatMessage('Systém', `❌ Nelze vybrat kostku ${diceValue} - výběr by neměl žádné body!`, 'system');
                return;
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
        
        console.log(`🏦 Banked ${selectedIndices.length} dice for ${score} points`);
        console.log(`🏦 New turn score: ${this.gameState.currentTurn.turnScore}`);
        console.log(`🏦 Available dice: ${this.gameState.currentTurn.availableDice}`);
        
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
        
        console.log(`🤖 AI Turn: ${currentPlayer.name}`);
        console.log(`🤖 Has entered game: ${currentPlayer.hasEnteredGame}`);
        
        // Simulace AI tahu
        setTimeout(() => {
            let aiScore;
            
            if (!currentPlayer.hasEnteredGame) {
                // AI musí získat alespoň 300 bodů pro vstup
                aiScore = Math.floor(Math.random() * 400) + 300; // 300-699 bodů
                currentPlayer.hasEnteredGame = true;
                console.log(`🤖 ${currentPlayer.name} enters game with ${aiScore} points`);
                this.addChatMessage(currentPlayer.name, `🎉 Vstoupil jsem do hry s ${aiScore} body!`, 'ai');
            } else {
                // Normální AI tah
                aiScore = Math.floor(Math.random() * 500) + 100; // 100-599 bodů
                console.log(`🤖 ${currentPlayer.name} scores ${aiScore} points`);
                this.addChatMessage(currentPlayer.name, `🎯 Získal jsem ${aiScore} bodů!`, 'ai');
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
                const displayText = player.hasEnteredGame ? 
                    `${player.score}` : 
                    `${player.score} (mimo hru)`;
                
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
