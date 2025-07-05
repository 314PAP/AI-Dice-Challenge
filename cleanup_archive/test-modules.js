// Test funkčnosti herní logiky
console.log('=== TEST HERNÍ LOGIKY ===');

// Simulace importu a volání funkcí
async function testGameLogic() {
    try {
        console.log('1. Testování importu gameState...');
        const { gameState } = await import('./src/js/game/gameState.js');
        console.log('✅ gameState importován:', gameState);
        
        console.log('2. Testování importu gameUI...');
        const { updateGameDisplay } = await import('./src/js/ui/gameUI.js');
        console.log('✅ updateGameDisplay importován:', typeof updateGameDisplay);
        
        console.log('3. Testování importu gameFlowController...');
        const { startGame, initializeGame } = await import('./src/js/game/controllers/gameFlowController.js');
        console.log('✅ startGame importován:', typeof startGame);
        console.log('✅ initializeGame importován:', typeof initializeGame);
        
        console.log('4. Testování importu menuButtonHandlers...');
        const { attachMenuButtonHandlers } = await import('./src/js/ui/menuButtonHandlers.js');
        console.log('✅ attachMenuButtonHandlers importován:', typeof attachMenuButtonHandlers);
        
        console.log('=== VŠECHNY MODULY ÚSPĚŠNĚ IMPORTOVÁNY ===');
        
    } catch (error) {
        console.error('❌ Chyba při importu modulu:', error);
    }
}

testGameLogic();
