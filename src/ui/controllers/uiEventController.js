/**
 * UI Event Setup Controller
 * Handles all UI event listeners and DOM event bindings
 */

export class UIEventController {
    constructor() {
        this.gameController = null;
    }

    /**
     * Set reference to main game controller
     * @param {Object} gameController - Main game controller instance
     */
    setGameController(gameController) {
        this.gameController = gameController;
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
                this.handleStartGame();
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
                this.handleQuitGame();
            });
        }

        // Modal buttons
        this.setupModalEventListeners();
    }

    /**
     * Handles start game action
     */
    handleStartGame() {
        const setup = document.getElementById('targetScoreSetup');
        const controls = document.getElementById('gameControls');
        if (setup && controls) {
            setup.style.display = 'none';
            controls.classList.remove('hidden');
            controls.style.display = 'block';
            this.addChatMessage('Systém', '🎮 Hra spuštěna!');
        }
    }

    /**
     * Handles quit game action
     */
    handleQuitGame() {
        if (window.confirm('Opravdu chcete opustit hru?')) {
            const setup = document.getElementById('targetScoreSetup');
            const controls = document.getElementById('gameControls');
            if (setup && controls) {
                controls.style.display = 'none';
                controls.classList.add('hidden');
                setup.style.display = 'block';
                this.addChatMessage('Systém', '🚪 Hra byla opuštěna');
            }
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

        // Modal close on backdrop click
        this.setupModalBackdropClose();
    }

    /**
     * Sets up modal backdrop close functionality
     */
    setupModalBackdropClose() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('visible');
                    modal.style.display = 'none';
                }
            });
        });
    }

    /**
     * Placeholder methods - these will be implemented by other controllers
     */
    displayHallOfFame() {
        if (window.hallOfFameController) {
            window.hallOfFameController.displayHallOfFame();
        }
    }

    startNewGame() {
        if (window.gameFlowController) {
            window.gameFlowController.startNewGame();
        }
    }

    returnToMainMenu() {
        if (window.gameFlowController) {
            window.gameFlowController.returnToMainMenu();
        }
    }

    saveScore() {
        if (window.hallOfFameController) {
            window.hallOfFameController.saveScore();
        }
    }

    closeHallOfFame() {
        if (window.hallOfFameController) {
            window.hallOfFameController.closeHallOfFame();
        }
    }

    addChatMessage(sender, message) {
        if (window.addChatMessage) {
            window.addChatMessage(sender, message);
        }
    }
}

// Export singleton instance
export const uiEventController = new UIEventController();
