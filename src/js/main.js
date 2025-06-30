// AI Dice Challenge - Main Application
import { initializeGame, setupEventListeners, startGame } from './game/gameController.js';
import { EnhancedChatController } from './ui/enhancedChatController.js';
import { setupUI, displayHallOfFame, closeHallOfFame, saveScore, startNewGame, returnToMainMenu } from './ui/uiController.js';
import { enhancedAI } from './ai/enhancedAIController.js';

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
    window.addChatMessage = chatCtrl.addMessage?.bind(chatCtrl) || function(sender, message) {
        chatCtrl.addMessage(sender, message);
    };
    
    window.selectDie = function(index) {
        const dice = document.querySelectorAll('.die');
        if (dice[index]) {
            dice[index].style.background = dice[index].style.background === 'rgb(255, 102, 0)' ? '#000' : '#ff6600';
        }
    };
    
    window.displayHallOfFame = displayHallOfFame;
    window.closeHallOfFame = closeHallOfFame;
    window.saveScore = saveScore;
    window.startNewGame = startNewGame;
    window.returnToMainMenu = returnToMainMenu;
    
    // Initialize the application
    await gameCtrl.initialize();
    chatCtrl.initialize();
    setupUI();
    
    // Úvodní zpráva
    setTimeout(() => {
        if (window.addChatMessage) {
            window.addChatMessage('system', '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!');
        }
    }, 500);
});
