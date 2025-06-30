// AI Dice Challenge - Main Application
import { gameController } from './game/gameController.js';
import { enhancedChatController } from './ui/enhancedChatController.js';
import { uiController } from './ui/uiController.js';
import { enhancedAIController } from './ai/enhancedAIController.js';

// Pokročilá verze s vylepšenými AI funkcemi
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 AI Kostková Výzva - Načítám pokročilé AI...');
    
    // Initialize controllers
    const gameCtrl = new gameController();
    const chatCtrl = new enhancedChatController();
    const uiCtrl = new uiController();
    const aiCtrl = new enhancedAIController();
    
    // Global functions for backward compatibility
    window.addChatMessage = chatCtrl.addMessage.bind(chatCtrl);
    window.selectDie = uiCtrl.selectDie.bind(uiCtrl);
    window.displayHallOfFame = uiCtrl.displayHallOfFame.bind(uiCtrl);
    window.closeHallOfFame = uiCtrl.closeHallOfFame.bind(uiCtrl);
    window.saveScore = uiCtrl.saveScore.bind(uiCtrl);
    window.startNewGame = uiCtrl.startNewGame.bind(uiCtrl);
    window.returnToMainMenu = uiCtrl.returnToMainMenu.bind(uiCtrl);
    
    // Initialize the application
    await gameCtrl.initialize();
    chatCtrl.initialize();
    uiCtrl.initialize();
    
    // Úvodní zpráva
    setTimeout(() => {
        chatCtrl.addMessage('system', '🎲 Vítejte v AI Kostkové výzvě! Nastavte cílové skóre a začněte hrát!');
    }, 500);
});
