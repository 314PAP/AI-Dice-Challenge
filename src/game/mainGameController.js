/**
 * Main Game Controller - Funkční implementace hry
 * Spojuje všechny moduly a implementuje kompletní herní logiku
 */

import { gameState } from '../core/gameState.js';
import { GAME_CONSTANTS, CSS_CLASSES, MESSAGES } from '../core/constants.js';

export class MainGameController {
    constructor() {
        this.isInitialized = false;
        this.currentDice = [];
        this.selectedDice = [];
        this.turnScore = 0;
        this.rollCount = 0;
        this.gameStarted = false;
        this.gameStartTime = null;
        this.totalTurns = 0;
        this.hasRolledThisTurn = false; // Nová proměnná pro sledování stavu tahu
    }

    /**
     * Inicializuje hlavní herní controller
     */
    initialize() {
        console.log('🎮 Inicializuji Main Game Controller...');
        
        this.setupEventListeners();
        this.createInitialDice();
        this.isInitialized = true;
        
        console.log('✅ Main Game Controller inicializován');
    }

    /**
     * Nastavuje event listenery pro herní prvky
     */
    setupEventListeners() {
        // Start game button
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        // Roll dice button
        const rollBtn = document.getElementById('rollBtn');
        if (rollBtn) {
            rollBtn.addEventListener('click', () => this.rollDice());
        }

        // Bank score button
        const bankBtn = document.getElementById('bankBtn');
        if (bankBtn) {
            bankBtn.addEventListener('click', () => this.bankSelectedDice());
        }

        // End turn button
        const endTurnBtn = document.getElementById('endTurnBtn');
        if (endTurnBtn) {
            endTurnBtn.addEventListener('click', () => this.endTurn());
        }

        // Quit game button
        const quitBtn = document.getElementById('quitGameBtn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => this.quitGame());
        }

        // Hall of Fame button
        const hallBtn = document.querySelector('[onclick="displayHallOfFame()"]');
        if (hallBtn) {
            hallBtn.addEventListener('click', () => this.showHallOfFame());
        }
    }

    /**
     * Spustí novou hru
     */
    startGame() {
        console.log('🚀 Spouštím novou hru...');
        
        const targetScoreInput = document.getElementById('targetScoreInput');
        const targetScore = parseInt(targetScoreInput?.value) || GAME_CONSTANTS.DEFAULT_TARGET_SCORE;
        
        // Nastav herní stav
        gameState.reset();
        gameState.targetScore = targetScore;
        gameState.gameStarted = true;
        gameState.gameStartTime = new Date();
        this.gameStarted = true;
        this.gameStartTime = new Date();
        this.totalTurns = 0;
        
        // Store game controller globally for access from other functions
        window.gameController = this;
        
        // Skryj setup, zobraz herní rozhraní
        document.getElementById('targetScoreSetup').style.display = 'none';
        document.getElementById('gameControls').style.display = 'block';
        
        // Aktualizuj UI
        this.updateTargetScoreDisplay();
        this.updateScoreboard();
        this.updateTurnInfo();
        this.resetTurn();
        
        // Přidej systémovou zprávu
        this.addChatMessage('Systém', MESSAGES.GAME_START.replace('{targetScore}', targetScore));
        
        console.log(`✅ Hra spuštěna s cílem ${targetScore} bodů`);
    }

    /**
     * Vytvoří počáteční kostky
     */
    createInitialDice() {
        const container = document.getElementById('diceContainer');
        if (!container) return;

        container.innerHTML = '';
        this.currentDice = [];
        
        for (let i = 0; i < GAME_CONSTANTS.DICE_COUNT; i++) {
            const dice = this.createDiceElement(i, 1);
            container.appendChild(dice);
            this.currentDice.push({ id: i, value: 1, selected: false, banked: false });
        }
    }

    /**
     * Vytvoří element kostky
     */
    createDiceElement(id, value) {
        const dice = document.createElement('div');
        dice.className = CSS_CLASSES.DICE.BASE;
        dice.dataset.id = id;
        dice.dataset.value = value;
        dice.textContent = value;
        
        // Přidej třídu pro neaktivní kostky na začátku tahu
        if (!this.hasRolledThisTurn) {
            dice.classList.add('dice-inactive');
        }
        
        dice.addEventListener('click', () => this.selectDice(id));
        
        return dice;
    }

    /**
     * Hodí kostkami
     */
    rollDice() {
        if (!this.gameStarted) {
            console.warn('Hra není spuštěna');
            return;
        }

        console.log('🎲 Házím kostkami...');
        
        // Odstraň hlášku "Hoďte kostkami"
        this.removeRollFirstMessage();
        
        // Animace a hození
        const availableDice = this.currentDice.filter(d => !d.selected && !d.banked);
        
        if (availableDice.length === 0) {
            console.warn('Žádné dostupné kostky pro hození');
            return;
        }

        // Vymaž výběr
        this.clearSelection();
        
        // Hoď kostkami
        availableDice.forEach(dice => {
            const newValue = Math.floor(Math.random() * 6) + 1;
            dice.value = newValue;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.dataset.value = newValue;
                element.textContent = newValue;
                element.classList.add('rolling');
                
                setTimeout(() => {
                    element.classList.remove('rolling');
                }, 500);
            }
        });

        this.rollCount++;
        this.hasRolledThisTurn = true; // Označí, že byly kostky hozeny
        
        // Aktualizuj vizuální stav kostek
        this.updateDiceVisualState();
        
        // Zkontroluj scoring
        setTimeout(() => {
            this.checkForScoring();
            this.updateButtons();
        }, 600);
        
        this.addChatMessage('Systém', `🎲 Hod číslo ${this.rollCount}`);
    }

    /**
     * Vybere/zruší výběr kostky
     */
    selectDice(diceId) {
        // Nelze vybírat kostky před prvním hodem
        if (!this.hasRolledThisTurn) {
            this.showRollFirstMessage();
            return;
        }

        const dice = this.currentDice.find(d => d.id === diceId);
        if (!dice || dice.banked) return;

        dice.selected = !dice.selected;
        
        const element = document.querySelector(`[data-id="${diceId}"]`);
        if (element) {
            element.classList.toggle(CSS_CLASSES.DICE.SELECTED, dice.selected);
        }

        this.updateButtons();
        this.calculateSelectedScore();
    }

    /**
     * Vymaže výběr kostek
     */
    clearSelection() {
        this.currentDice.forEach(dice => {
            dice.selected = false;
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.SELECTED);
            }
        });
        this.selectedDice = [];
    }

    /**
     * Odloží vybrané kostky
     */
    bankSelectedDice() {
        const selectedDice = this.currentDice.filter(d => d.selected);
        if (selectedDice.length === 0) return;

        const score = this.calculateDiceScore(selectedDice.map(d => d.value));
        if (score === 0) {
            this.addChatMessage('Systém', '❌ Vybrané kostky nemají žádnou hodnotu!');
            return;
        }

        // Odlož kostky
        selectedDice.forEach(dice => {
            dice.banked = true;
            dice.selected = false;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.SELECTED);
                element.classList.add(CSS_CLASSES.DICE.BANKED);
            }
        });

        this.turnScore += score;
        this.updateTurnScore();
        
        // Zkontroluj Hot Dice
        const allBanked = this.currentDice.every(d => d.banked);
        if (allBanked) {
            this.triggerHotDice();
        }

        this.updateButtons();
        this.addChatMessage('Systém', `💰 Odloženo ${score} bodů! Celkem v tahu: ${this.turnScore}`);
    }

    /**
     * Hot Dice - všechny kostky odloženy
     */
    triggerHotDice() {
        this.addChatMessage('Systém', MESSAGES.HOT_DICE);
        
        // Resetuj kostky pro další hod
        this.currentDice.forEach(dice => {
            dice.banked = false;
            dice.selected = false;
            dice.value = 1;
            
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                element.classList.remove(CSS_CLASSES.DICE.BANKED, CSS_CLASSES.DICE.SELECTED);
                element.dataset.value = 1;
                element.textContent = 1;
            }
        });
        
        // Resetuj flag pro nové hození po Hot Dice
        this.hasRolledThisTurn = false;
        this.updateDiceVisualState(); // Nastav kostky jako neaktivní
        this.updateButtons();
    }

    /**
     * Ukončí tah hráče
     */
    endTurn() {
        if (this.turnScore < GAME_CONSTANTS.MIN_SCORING_THRESHOLD) {
            this.addChatMessage('Systém', MESSAGES.MIN_SCORE_NOT_REACHED.replace('{playerName}', 'Vy'));
            this.turnScore = 0;
        }

        // Přidej skóre k celkovému
        gameState.players[0].score += this.turnScore;
        this.updateScoreboard();
        
        // Zvýš počet tahů
        this.totalTurns++;
        
        // Zkontroluj výhru
        if (gameState.players[0].score >= gameState.targetScore) {
            this.triggerFinalRound();
            return;
        }

        // Další hráč (AI)
        this.nextPlayer();
    }

    /**
     * Přejde na dalšího hráče
     */
    nextPlayer() {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
        this.resetTurn();
        
        if (gameState.currentPlayer === 0) {
            // Hráč na řadě
            this.updateTurnInfo();
        } else {
            // AI tah
            this.playAITurn();
        }
    }

    /**
     * Hraje AI tah
     */
    async playAITurn() {
        const currentPlayer = gameState.players[gameState.currentPlayer];
        this.updateTurnInfo(`${currentPlayer.name} je na tahu...`);
        
        // Simulace AI tahu
        await this.delay(1000);
        
        const aiScore = Math.floor(Math.random() * 800) + 200;
        currentPlayer.score += aiScore;
        
        this.addChatMessage(currentPlayer.name, `🎲 Získal jsem ${aiScore} bodů!`);
        this.updateScoreboard();
        
        // Zkontroluj výhru AI
        if (currentPlayer.score >= gameState.targetScore) {
            this.endGame(currentPlayer);
            return;
        }

        // Další hráč
        await this.delay(1000);
        this.nextPlayer();
    }

    /**
     * Resetuje tah
     */
    resetTurn() {
        this.turnScore = 0;
        this.rollCount = 0;
        this.hasRolledThisTurn = false; // Reset flag pro nový tah
        this.updateTurnScore();
        this.createInitialDice();
        this.updateDiceVisualState(); // Aktualizuj vizuální stav kostek
        this.updateButtons();
    }

    /**
     * Zkontroluje scoring možnosti
     */
    checkForScoring() {
        const availableDice = this.currentDice.filter(d => !d.banked);
        const values = availableDice.map(d => d.value);
        
        if (this.calculateDiceScore(values) === 0) {
            this.triggerFarkle();
        } else {
            this.highlightScoringDice();
        }
    }

    /**
     * Zvýrazní bodující kostky
     */
    highlightScoringDice() {
        // Základní implementace - zvýrazní 1ky a 5ky
        this.currentDice.forEach(dice => {
            if (!dice.banked && (dice.value === 1 || dice.value === 5)) {
                const element = document.querySelector(`[data-id="${dice.id}"]`);
                if (element) {
                    element.classList.add(CSS_CLASSES.DICE.SCORING);
                    setTimeout(() => {
                        element.classList.remove(CSS_CLASSES.DICE.SCORING);
                    }, 2000);
                }
            }
        });
    }

    /**
     * Spustí Farkle
     */
    triggerFarkle() {
        this.addChatMessage('Systém', MESSAGES.FARKLE);
        this.turnScore = 0;
        
        setTimeout(() => {
            this.nextPlayer();
        }, 2000);
    }

    /**
     * Vypočítá skóre kostek (základní verze)
     */
    calculateDiceScore(values) {
        let score = 0;
        const counts = [0, 0, 0, 0, 0, 0, 0]; // index 0 nevyužito
        
        // Spočítej četnosti
        values.forEach(val => counts[val]++);
        
        // Trojky a více
        for (let i = 1; i <= 6; i++) {
            if (counts[i] >= 3) {
                if (i === 1) {
                    score += 1000;
                } else {
                    score += i * 100;
                }
                counts[i] -= 3;
            }
        }
        
        // Jednotlivé 1ky a 5ky
        score += counts[1] * 100; // 1ky = 100 bodů
        score += counts[5] * 50;  // 5ky = 50 bodů
        
        return score;
    }

    /**
     * Vypočítá skóre vybraných kostek
     */
    calculateSelectedScore() {
        const selectedValues = this.currentDice
            .filter(d => d.selected)
            .map(d => d.value);
        
        const score = this.calculateDiceScore(selectedValues);
        
        // Zobraz skóre někde v UI
        console.log(`Selected dice score: ${score}`);
        return score;
    }

    /**
     * Aktualizuje tlačítka podle stavu hry
     */
    updateButtons() {
        const rollBtn = document.getElementById('rollBtn');
        const bankBtn = document.getElementById('bankBtn');
        const endTurnBtn = document.getElementById('endTurnBtn');
        
        const availableDice = this.currentDice.filter(d => !d.banked);
        const selectedDice = this.currentDice.filter(d => d.selected);
        const hasValidSelection = selectedDice.length > 0 && this.calculateSelectedScore() > 0;
        
        if (rollBtn) {
            // Roll button je povolen pokud jsou dostupné kostky
            rollBtn.disabled = availableDice.length === 0;
        }
        
        if (bankBtn) {
            // Bank button je povolen pouze pokud:
            // 1. Byly hozeny kostky v tomto tahu
            // 2. Jsou vybrané kostky s platným skóre
            bankBtn.disabled = !this.hasRolledThisTurn || !hasValidSelection;
        }
        
        if (endTurnBtn) {
            // End turn button je povolen pouze pokud bylo odloženo nějaké skóre
            endTurnBtn.disabled = this.turnScore === 0;
        }
    }

    /**
     * Aktualizuje informace o tahu
     */
    updateTurnInfo(text = null) {
        const turnInfo = document.getElementById('turnInfo');
        if (turnInfo) {
            turnInfo.textContent = text || `${gameState.players[gameState.currentPlayer].name} na tahu!`;
        }
    }

    /**
     * Aktualizuje skóre tahu
     */
    updateTurnScore() {
        const turnScoreEl = document.getElementById('currentTurnScore');
        if (turnScoreEl) {
            turnScoreEl.textContent = `Skóre tahu: ${this.turnScore}`;
        }
    }

    /**
     * Aktualizuje cílové skóre
     */
    updateTargetScoreDisplay() {
        const targetDisplay = document.getElementById('targetScoreDisplay');
        if (targetDisplay) {
            targetDisplay.textContent = gameState.targetScore;
        }
    }

    /**
     * Aktualizuje scoreboard
     */
    updateScoreboard() {
        gameState.players.forEach(player => {
            const scoreEl = document.getElementById(`${player.type}Score`);
            if (scoreEl) {
                scoreEl.textContent = player.score;
            }
        });
    }

    /**
     * Spustí finální kolo
     */
    triggerFinalRound() {
        const winner = gameState.players[0];
        this.addChatMessage('Systém', MESSAGES.FINAL_ROUND
            .replace('{playerName}', winner.name)
            .replace('{targetScore}', gameState.targetScore));
        
        gameState.finalRound = true;
        // Pokračuj ve hře až dokončí všichni hráči
        this.nextPlayer();
    }

    /**
     * Ukončí hru
     */
    endGame(winner) {
        console.log('🏁 Konec hry!', winner);
        
        this.gameStarted = false;
        gameState.gameEnded = true;
        gameState.winner = winner;
        
        // Zobraz game over modal
        this.showGameOverModal(winner);
    }

    /**
     * Zobrazí game over modal
     */
    showGameOverModal(winner) {
        const modal = document.getElementById('gameOverModal');
        if (!modal) return;

        // Update winner announcement
        const announcement = document.getElementById('winnerAnnouncement');
        if (announcement) {
            announcement.innerHTML = `
                <h3>🏆 ${winner.name} vyhrává!</h3>
                <p>Finální skóre: <strong>${winner.score}</strong> bodů</p>
            `;
        }

        // Update final scores
        const finalScores = document.getElementById('finalScores');
        if (finalScores) {
            const scoresHtml = gameState.players.map(player => 
                `<div class="score-row ${player.id === winner.id ? 'winner' : ''}">
                    <span>${player.name}:</span> 
                    <span>${player.score} bodů</span>
                </div>`
            ).join('');
            finalScores.innerHTML = `<h4>Konečné výsledky:</h4>${scoresHtml}`;
        }

        // Update game stats
        const gameStats = document.getElementById('gameStats');
        if (gameStats) {
            const duration = this.calculateGameDuration();
            gameStats.innerHTML = `
                <h4>Statistiky hry:</h4>
                <p>⏱️ Doba hry: ${duration}</p>
                <p>🎲 Počet tahů: ${this.totalTurns}</p>
                <p>🎯 Cílové skóre: ${gameState.targetScore}</p>
            `;
        }

        // Show signature section only for human winner
        const signatureSection = document.getElementById('signatureSection');
        if (signatureSection) {
            if (winner.type === 'human') {
                signatureSection.style.display = 'block';
                // Clear previous signature
                const signatureInput = document.getElementById('winnerSignature');
                if (signatureInput) {
                    signatureInput.value = '';
                    signatureInput.focus();
                }
            } else {
                signatureSection.style.display = 'none';
            }
        }

        modal.style.display = 'block';
    }

    /**
     * Vypočítá dobu hry
     */
    calculateGameDuration() {
        if (!gameState.gameStartTime) return '0:00';
        
        const now = new Date();
        const diff = now - gameState.gameStartTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Opustí hru
     */
    quitGame() {
        if (confirm('Opravdu chcete opustit hru?')) {
            document.getElementById('gameControls').style.display = 'none';
            document.getElementById('targetScoreSetup').style.display = 'block';
            this.gameStarted = false;
            gameState.reset();
            this.addChatMessage('Systém', '🚪 Hra byla opuštěna');
        }
    }

    /**
     * Zobrazí síň slávy
     */
    showHallOfFame() {
        console.log('🏆 Zobrazuji síň slávy...');
        
        // Import hall of fame modulu a zobraz
        import('../js/utils/hallOfFame.js').then(({ displayHallOfFame }) => {
            displayHallOfFame();
            this.addChatMessage('Systém', '🏆 Síň slávy zobrazena');
        }).catch(error => {
            console.error('❌ Chyba při načítání síně slávy:', error);
            // Fallback - použij window funkci
            if (window.displayHallOfFame) {
                window.displayHallOfFame();
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

    /**
     * Pomocná funkce pro delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Zobrazí hlášku "Hoďte kostkami"
     */
    showRollFirstMessage() {
        // Odstraň předchozí hlášky
        this.removeRollFirstMessage();
        
        // Najdi kontejner kostek
        const diceContainer = document.getElementById('diceContainer');
        if (!diceContainer) return;
        
        // Vytvoř žlutou hlášku
        const messageDiv = document.createElement('div');
        messageDiv.id = 'rollFirstMessage';
        messageDiv.className = 'roll-first-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                🎲 Nejdříve hoďte kostkami!
            </div>
        `;
        
        // Přidej před kontejner kostek
        diceContainer.parentNode.insertBefore(messageDiv, diceContainer);
        
        // Automaticky odstraň po 2 sekundách
        setTimeout(() => {
            this.removeRollFirstMessage();
        }, 2000);
    }

    /**
     * Odstraní hlášku "Hoďte kostkami"
     */
    removeRollFirstMessage() {
        const message = document.getElementById('rollFirstMessage');
        if (message) {
            message.remove();
        }
    }

    /**
     * Aktualizuje vizuální stav kostek podle toho, zda byly hozeny
     */
    updateDiceVisualState() {
        this.currentDice.forEach(dice => {
            const element = document.querySelector(`[data-id="${dice.id}"]`);
            if (element) {
                if (this.hasRolledThisTurn) {
                    element.classList.remove('dice-inactive');
                } else {
                    element.classList.add('dice-inactive');
                }
            }
        });
    }
}

export default MainGameController;
