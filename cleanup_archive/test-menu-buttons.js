// Testovací skript pro ověření funkčnosti menu tlačítek
// Spustit v DevTools konzoli po načtení aplikace

function testMenuButtons() {
    console.log('🧪 Testování menu tlačítek...');
    
    // Získání všech tlačítek
    const buttons = {
        desktop: {
            start: document.getElementById('startGameBtn'),
            rules: document.getElementById('rulesBtn'),
            hall: document.getElementById('hallOfFameBtn'),
            exit: document.getElementById('exitGameBtn')
        },
        mobile: {
            start: document.getElementById('startGameBtnMobile'),
            rules: document.getElementById('rulesBtnMobile'),
            hall: document.getElementById('hallOfFameBtnMobile'),
            exit: document.getElementById('exitGameBtnMobile')
        }
    };
    
    // Kontrola existence tlačítek
    console.log('📋 Kontrola existence tlačítek:');
    Object.entries(buttons).forEach(([device, deviceButtons]) => {
        console.log(`${device.toUpperCase()}:`);
        Object.entries(deviceButtons).forEach(([name, button]) => {
            const exists = button !== null;
            const hasListeners = button && button.onclick !== null;
            console.log(`  ${name}: ${exists ? '✅ Existuje' : '❌ Neexistuje'} | Event listeners: ${hasListeners ? '✅' : '❓'}`);
        });
    });
    
    // Test kliknutí (simulace)
    console.log('🖱️ Test simulace kliknutí:');
    
    // Test Start Game tlačítka
    const startBtn = buttons.desktop.start || buttons.mobile.start;
    if (startBtn) {
        console.log('Testování Start Game tlačítka...');
        try {
            startBtn.click();
            console.log('✅ Start Game tlačítko reaguje');
        } catch (error) {
            console.error('❌ Chyba při kliknutí na Start Game:', error);
        }
    }
    
    // Test Rules tlačítka
    const rulesBtn = buttons.desktop.rules || buttons.mobile.rules;
    if (rulesBtn) {
        console.log('Testování Rules tlačítka...');
        try {
            rulesBtn.click();
            console.log('✅ Rules tlačítko reaguje');
        } catch (error) {
            console.error('❌ Chyba při kliknutí na Rules:', error);
        }
    }
    
    // Test Hall of Fame tlačítka
    const hallBtn = buttons.desktop.hall || buttons.mobile.hall;
    if (hallBtn) {
        console.log('Testování Hall of Fame tlačítka...');
        try {
            hallBtn.click();
            console.log('✅ Hall of Fame tlačítko reaguje');
        } catch (error) {
            console.error('❌ Chyba při kliknutí na Hall of Fame:', error);
        }
    }
    
    console.log('🧪 Test dokončen');
}

// Spustit test po načtení
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testMenuButtons, 1000);
    });
} else {
    setTimeout(testMenuButtons, 1000);
}
