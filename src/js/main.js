// AI Dice Challenge - Main Application
import { initializeGame, setupEventListeners, startGame, saveScore as saveGameScore, startNewGame as startNewGameController, returnToMainMenu as returnToMainMenuController } from './game/gameController.js';
import { endAITurn } from './ai/aiPlayer.js';
import { EnhancedChatController } from './ui/enhancedChatController.js';
import { setupUI, displayHallOfFame, closeHallOfFame } from './ui/uiController.js';
import { updateScoreboard, updateActivePlayer } from './ui/gameUI.js';
import { showFarkleMessage } from './ui/speechBubbles.js';

// Wrapper class for game controller
class GameController {
    async initialize() {
        initializeGame();
        setupEventListeners();
    }
    
    startGame() {
        return startGame();
    }
}

// Pokročilá verze s vylepšenými AI funkcemi
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 AI Kostková Výzva - Načítám pokročilé AI...');
    
    // Initialize controllers
    const gameCtrl = new GameController();
    const chatCtrl = new EnhancedChatController();
    
    // Global functions for backward compatibility
    window.addChatMessage = function(sender, message, isGameEvent = false) {
        console.log(`💬 Chat message: ${sender} -> ${message}`);
        if (chatCtrl && chatCtrl.addMessage) {
            chatCtrl.addMessage(sender, message, isGameEvent);
        } else {
            console.error('❌ Chat controller not available');
        }
    };
    
    window.selectDie = function(index) {
        const dice = document.querySelectorAll('.die');
        if (dice[index]) {
            dice[index].style.background = dice[index].style.background === 'rgb(255, 102, 0)' ? '#000' : '#ff6600';
        }
    };
    
    window.displayHallOfFame = displayHallOfFame;
    window.closeHallOfFame = closeHallOfFame;
    window.saveScore = saveGameScore;
    window.startNewGame = startNewGameController;
    window.returnToMainMenu = returnToMainMenuController;
    window.endAITurn = endAITurn; // AI turn cleanup function
    
    // Initialize the application
    await gameCtrl.initialize();
    chatCtrl.initialize();
    setupUI();
    
    // Inicializuj zobrazení hráčů
    updateScoreboard();
    updateActivePlayer();
    
    // Přidej přímý event listener pro Start Game (backup)
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        console.log('🚀 Přidávám backup event listener pro Start Game');
        startGameBtn.addEventListener('click', () => {
            console.log('🎮 Start Game clicked - backup handler!');
            const targetScoreInput = document.getElementById('targetScoreInput');
            const targetScore = parseInt(targetScoreInput.value);
            
            if (targetScore >= 1000) {
                // Přidej game-active třídu pro skrytí avatarů
                document.body.classList.add('game-active');
                gameCtrl.startGame();
            } else {
                alert('Cílové skóre musí být alespoň 1000 bodů!');
            }
        });
    }
    
    // Úvodní zpráva
    setTimeout(() => {
        if (window.addChatMessage) {
            window.addChatMessage('system', '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!');
        }
    }, 500);
});
