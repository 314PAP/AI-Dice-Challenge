/**
 * Manual Button Test Script
 * Test všech hlavních tlačítek a funkcionalit
 */

console.log('🧪 Manual Button Test - Loading...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM ready - starting button tests');
    
    // Test existence of key elements
    const elements = {
        startGameBtn: document.getElementById('startGameBtn'),
        hallOfFameBtn: document.getElementById('hallOfFameBtn'),
        chatInput: document.getElementById('chatInput'),
        sendMessageBtn: document.getElementById('sendMessageBtn'),
        targetScoreSetup: document.getElementById('targetScoreSetup'),
        gameControls: document.getElementById('gameControls'),
        rollDiceBtn: document.getElementById('rollDiceBtn'),
        bankDiceBtn: document.getElementById('bankDiceBtn'),
        endTurnBtn: document.getElementById('endTurnBtn')
    };

    console.log('🔍 Element check:', elements);

    // Test start game button
    if (elements.startGameBtn) {
        console.log('🧪 Testing Start Game button...');
        elements.startGameBtn.addEventListener('click', () => {
            console.log('🚀 Start Game button clicked!');
            // Check if the function is available
            if (window.uiController && window.uiController.gameController) {
                console.log('✅ UI Controller available, attempting to start game...');
                try {
                    window.uiController.gameController.startGame();
                } catch (error) {
                    console.error('❌ Error starting game:', error);
                }
            } else {
                console.warn('⚠️ UI Controller not available, showing controls manually...');
                if (elements.targetScoreSetup && elements.gameControls) {
                    elements.targetScoreSetup.style.display = 'none';
                    elements.gameControls.classList.remove('hidden');
                }
            }
        });
    }

    // Test hall of fame button
    if (elements.hallOfFameBtn) {
        console.log('🧪 Testing Hall of Fame button...');
        elements.hallOfFameBtn.addEventListener('click', () => {
            console.log('🏆 Hall of Fame button clicked!');
            if (window.uiController && window.uiController.hallOfFame) {
                console.log('✅ Hall of Fame controller available');
                try {
                    window.uiController.hallOfFame.showHallOfFame();
                } catch (error) {
                    console.error('❌ Error showing hall of fame:', error);
                }
            } else {
                console.warn('⚠️ Hall of Fame controller not available');
            }
        });
    }

    // Test chat functionality
    if (elements.chatInput && elements.sendMessageBtn) {
        console.log('🧪 Testing Chat functionality...');
        
        const sendMessage = () => {
            const message = elements.chatInput.value.trim();
            if (message) {
                console.log('💬 Sending chat message:', message);
                
                if (window.addChatMessage) {
                    window.addChatMessage('Hráč', message);
                } else if (window.uiController && window.uiController.chat) {
                    try {
                        window.uiController.chat.handleSendMessage(elements.chatInput);
                    } catch (error) {
                        console.error('❌ Error sending chat message:', error);
                    }
                } else {
                    console.warn('⚠️ Chat system not available');
                }
                
                elements.chatInput.value = '';
            }
        };

        elements.sendMessageBtn.addEventListener('click', sendMessage);
        elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Test game control buttons
    if (elements.rollDiceBtn) {
        console.log('🧪 Testing Roll Dice button...');
        elements.rollDiceBtn.addEventListener('click', () => {
            console.log('🎲 Roll Dice button clicked!');
            if (window.gameController && window.gameController.rollDiceForPlayer) {
                try {
                    window.gameController.rollDiceForPlayer();
                } catch (error) {
                    console.error('❌ Error rolling dice:', error);
                }
            } else {
                console.warn('⚠️ Game controller not available for dice roll');
            }
        });
    }

    console.log('✅ Manual button test setup complete');
    console.log('🔍 Available global objects:', {
        uiController: !!window.uiController,
        gameController: !!window.gameController,
        addChatMessage: !!window.addChatMessage,
        enhancedAI: !!window.enhancedAI
    });
});

console.log('🔚 Manual button test script loaded');
