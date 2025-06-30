/**
 * AI Dice Challenge - Main Game UI Controller
 * Hlavní controller pro UI a game flow
 */

import { MainGameController } from '../game/mainGameController.js';

class GameUIController {
    constructor() {
        this.gameController = null;
        this.isInitialized = false;
    }

    /**
     * Inicializuje UI controller
     */
    async initialize() {
        console.log('🎮 Inicializuji UI Controller...');
        
        try {
            // Inicializuj hlavní game controller
            this.gameController = new MainGameController();
            await this.gameController.initialize();
            
            // Nastav UI event listenery
            this.setupUIEventListeners();
            this.setupChatFunctionality();
            
            // Zpřístupni globálně pro debugging
            window.gameController = this.gameController;
            window.uiController = this;
            window.addChatMessage = (sender, message) => this.addChatMessage(sender, message);
            
            console.log('✅ UI Controller inicializován');
            
            // Uvítací zpráva
            setTimeout(() => {
                this.addChatMessage('Systém', '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!');
            }, 500);
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci UI:', error);
            this.setupBasicFallback();
        }
    }

    /**
     * Nastavuje základní UI event listenery
     */
    setupUIEventListeners() {
        // Start game button
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('🚀 Start game button clicked!');
                const setup = document.getElementById('targetScoreSetup');
                const controls = document.getElementById('gameControls');
                if (setup && controls) {
                    setup.style.display = 'none';
                    controls.classList.remove('hidden');
                    controls.style.display = 'block';
                    this.addChatMessage('Systém', '🎮 Hra spuštěna!');
                }
            });
        }

        // Hall of Fame button
        const hallOfFameBtn = document.getElementById('hallOfFameBtn');
        if (hallOfFameBtn) {
            hallOfFameBtn.addEventListener('click', () => {
                console.log('🏆 Hall of Fame button clicked!');
                this.displayHallOfFame();
            });
        }

        // Quit game button
        const quitBtn = document.getElementById('quitGameBtn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => {
                if (confirm('Opravdu chcete opustit hru?')) {
                    const setup = document.getElementById('targetScoreSetup');
                    const controls = document.getElementById('gameControls');
                    if (setup && controls) {
                        controls.style.display = 'none';
                        controls.classList.add('hidden');
                        setup.style.display = 'block';
                        this.addChatMessage('Systém', '🚪 Hra byla opuštěna');
                    }
                }
            });
        }

        // Modal buttons
        this.setupModalEventListeners();
    }

    /**
     * Nastavuje chat funkcionalitu
     */
    setupChatFunctionality() {
        const sendBtn = document.getElementById('sendMessageBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.addChatMessage('Vy', message);
                    chatInput.value = '';
                    
                    // Simulace AI odpovědi
                    setTimeout(() => {
                        const responses = [
                            '📊 Zajímavá statistika! Analyzuji data...',
                            '⚡ O tom právě mluvím! Připrav se na porážku!',
                            '🧘 Zamysli se nad hlubším významem své strategie...',
                            '🎲 Nech kostky rozhodnout o tvém osudu!'
                        ];
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        const aiNames = ['Gemini', 'ChatGPT', 'Claude'];
                        const randomAI = aiNames[Math.floor(Math.random() * aiNames.length)];
                        this.addChatMessage(randomAI, randomResponse);
                    }, 1000 + Math.random() * 1000);
                }
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendBtn.click();
                }
            });
        }
    }

    /**
     * Nastavuje event listenery pro modály
     */
    setupModalEventListeners() {
        // Game Over modal buttons
        const showHallOfFameBtn = document.getElementById('showHallOfFameBtn');
        if (showHallOfFameBtn) {
            showHallOfFameBtn.addEventListener('click', () => {
                this.displayHallOfFame();
            });
        }

        const startNewGameBtn = document.getElementById('startNewGameBtn');
        if (startNewGameBtn) {
            startNewGameBtn.addEventListener('click', () => {
                this.startNewGame();
            });
        }

        const returnToMenuBtn = document.getElementById('returnToMenuBtn');
        if (returnToMenuBtn) {
            returnToMenuBtn.addEventListener('click', () => {
                this.returnToMainMenu();
            });
        }

        const saveScoreBtn = document.getElementById('saveScoreBtn');
        if (saveScoreBtn) {
            saveScoreBtn.addEventListener('click', () => {
                this.saveScore();
            });
        }

        // Hall of Fame modal buttons
        const closeHallOfFameBtn = document.getElementById('closeHallOfFameBtn');
        if (closeHallOfFameBtn) {
            closeHallOfFameBtn.addEventListener('click', () => {
                this.closeHallOfFame();
            });
        }
    }

    /**
     * Zobrazí síň slávy
     */
    displayHallOfFame() {
        console.log('🏆 Zobrazuji síň slávy...');
        const modal = document.getElementById('hallOfFameModal');
        const list = document.getElementById('hallOfFameList');
        
        if (modal && list) {
            // Načti data ze síně slávy
            const hallOfFame = JSON.parse(localStorage.getItem('diceGameHallOfFame') || '[]');
            
            if (hallOfFame.length === 0) {
                list.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--neon-green);">
                        <h3>🏆 Síň slávy je prázdná</h3>
                        <p>Zatím žádné záznamy...</p>
                        <p style="font-size: 14px; opacity: 0.7;">Vyhrajte hru a zapište se do historie!</p>
                    </div>
                `;
            } else {
                list.innerHTML = hallOfFame.map((game, index) => `
                    <div class="hall-of-fame-entry" style="
                        border: 1px solid var(--neon-green);
                        margin: 10px 0;
                        padding: 15px;
                        border-radius: 5px;
                        background: rgba(0,255,0,0.1);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 18px; font-weight: bold; color: var(--neon-orange);">
                                    #${index + 1} 🏆 ${game.signature || 'Anonym'}
                                </span>
                                <div style="margin-top: 5px; color: var(--neon-green);">
                                    🎯 Skóre: ${game.score}/${game.targetScore} | 
                                    ⏱️ Trvání: ${game.duration} | 
                                    🎲 Tahů: ${game.turns}
                                </div>
                            </div>
                            <div style="text-align: right; color: var(--neon-blue);">
                                📅 ${game.date}<br>
                                🕐 ${game.time}
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            
            modal.classList.remove('hidden');
            modal.classList.add('visible');
            modal.style.display = 'block';
            this.addChatMessage('Systém', '🏆 Síň slávy zobrazena');
        }
    }

    /**
     * Zavře síň slávy
     */
    closeHallOfFame() {
        const modal = document.getElementById('hallOfFameModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            modal.style.display = 'none';
        }
    }

    /**
     * Spustí novou hru
     */
    startNewGame() {
        console.log('🔄 Starting new game...');
        this.closeGameOverModal();
        
        // Reset UI
        const gameControls = document.getElementById('gameControls');
        const targetScoreSetup = document.getElementById('targetScoreSetup');
        
        if (gameControls && targetScoreSetup) {
            gameControls.style.display = 'none';
            gameControls.classList.add('hidden');
            targetScoreSetup.style.display = 'block';
        }
        
        // Reset all player scores
        document.getElementById('humanScore').textContent = '0';
        document.getElementById('geminiScore').textContent = '0';
        document.getElementById('chatgptScore').textContent = '0';
        document.getElementById('claudeScore').textContent = '0';
        
        // Reset dice container
        const diceContainer = document.getElementById('diceContainer');
        if (diceContainer) {
            diceContainer.innerHTML = '';
        }
        
        // Reset turn info
        const turnInfo = document.getElementById('turnInfo');
        const currentTurnScore = document.getElementById('currentTurnScore');
        if (turnInfo) turnInfo.textContent = 'Váš tah!';
        if (currentTurnScore) currentTurnScore.textContent = 'Skóre tahu: 0';
        
        // Clear chat
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        this.addChatMessage('Systém', '🎮 Připraveno pro novou hru! Nastavte cílové skóre a začněte.');
    }

    /**
     * Návrat do hlavního menu
     */
    returnToMainMenu() {
        console.log('🏠 Returning to main menu...');
        this.startNewGame(); // Same as new game for now
    }

    /**
     * Zavře game over modal
     */
    closeGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            modal.style.display = 'none';
        }
    }

    /**
     * Uloží skóre do síně slávy
     */
    saveScore() {
        const signatureInput = document.getElementById('winnerSignature');
        const signature = signatureInput?.value?.trim();
        
        if (!signature) {
            alert('Prosím zadejte svůj podpis!');
            return;
        }
        
        // Get actual game data if available
        let score = 10000; // default
        let targetScore = 10000; // default
        let turns = 15; // default
        let duration = '5:30'; // default
        
        // Try to get real game data
        const humanScoreEl = document.getElementById('humanScore');
        const targetScoreEl = document.getElementById('targetScoreDisplay');
        
        if (humanScoreEl) {
            score = parseInt(humanScoreEl.textContent) || score;
        }
        if (targetScoreEl) {
            targetScore = parseInt(targetScoreEl.textContent) || targetScore;
        }
        
        // Create game result object
        const gameResult = {
            signature: signature,
            score: score,
            targetScore: targetScore,
            turns: turns,
            duration: duration,
            date: new Date().toLocaleDateString('cs-CZ'),
            time: new Date().toLocaleTimeString('cs-CZ')
        };
        
        // Save to localStorage
        const hallOfFame = JSON.parse(localStorage.getItem('diceGameHallOfFame') || '[]');
        hallOfFame.push(gameResult);
        hallOfFame.sort((a, b) => b.score - a.score); // Sort by score desc
        localStorage.setItem('diceGameHallOfFame', JSON.stringify(hallOfFame));
        
        this.addChatMessage('Systém', `🏆 Skóre ${gameResult.score} uloženo do síně slávy s podpisem "${signature}"!`);
        
        // Hide signature section
        const signatureSection = document.getElementById('signatureSection');
        if (signatureSection) {
            signatureSection.classList.add('hidden');
            signatureSection.style.display = 'none';
        }
        
        // Show hall of fame
        setTimeout(() => {
            this.displayHallOfFame();
        }, 1000);
    }

    /**
     * Fallback funkcionalita
     */
    setupBasicFallback() {
        console.log('🔄 Setting up basic fallback functionality...');
        
        document.getElementById('startGameBtn')?.addEventListener('click', () => {
            document.getElementById('targetScoreSetup').style.display = 'none';
            document.getElementById('gameControls').style.display = 'block';
            this.addChatMessage('Systém', '🎮 Hra spuštěna (základní režim)!');
        });
        
        document.getElementById('quitGameBtn')?.addEventListener('click', () => {
            if (confirm('Opravdu chcete opustit hru?')) {
                document.getElementById('gameControls').style.display = 'none';
                document.getElementById('targetScoreSetup').style.display = 'block';
                this.addChatMessage('Systém', '🚪 Hra byla opuštěna');
            }
        });
    }

    /**
     * Přidá zprávu do chatu
     */
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${sender}</span>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

export { GameUIController };
