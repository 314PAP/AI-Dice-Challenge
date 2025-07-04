/**
 * Test script pro ověření funkčnosti MainGameController
 */

// Čekej na načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Test script spuštěn');
    
    // Čekej na inicializaci
    setTimeout(() => {
        console.log('🧪 Testuju existenci gameController...');
        
        if (window.gameController) {
            console.log('✅ gameController existuje');
            console.log('🔍 Typ:', typeof window.gameController);
            console.log('🔍 Inicializován:', window.gameController.isInitialized);
            
            // Test dostupnosti metod
            const methods = ['initialize', 'startGame', 'rollDice', 'bankSelectedDice', 'endTurn'];
            methods.forEach(method => {
                if (typeof window.gameController[method] === 'function') {
                    console.log(`✅ Metoda ${method} je dostupná`);
                } else {
                    console.log(`❌ Metoda ${method} není dostupná`);
                }
            });
            
            // Test modulů
            const modules = ['initializer', 'diceController', 'scoreController', 'turnController', 'uiController', 'stateController'];
            modules.forEach(module => {
                if (window.gameController[module]) {
                    console.log(`✅ Modul ${module} je dostupný`);
                } else {
                    console.log(`❌ Modul ${module} není dostupný`);
                }
            });
            
        } else {
            console.log('❌ gameController neexistuje');
        }
        
        // Test tlačítek
        const buttons = [
            'startGameBtn',
            'startGameBtnMobile',
            'rollBtn',
            'bankBtn',
            'endTurnBtn',
            'quitGameBtn'
        ];
        
        buttons.forEach(buttonId => {
            const btn = document.getElementById(buttonId);
            if (btn) {
                console.log(`✅ Tlačítko ${buttonId} nalezeno`);
            } else {
                console.log(`❌ Tlačítko ${buttonId} nenalezeno`);
            }
        });
        
        // Test kontejnerů
        const containers = [
            'gameHeader',
            'gameControls',
            'gameControlsMobile',
            'diceContainer'
        ];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                console.log(`✅ Kontejner ${containerId} nalezen`);
            } else {
                console.log(`❌ Kontejner ${containerId} nenalezen`);
            }
        });
        
        console.log('🧪 Test dokončen');
        
    }, 2000);
});
