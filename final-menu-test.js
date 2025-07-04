// 🧪 Finální test všech menu funkcí - spustit v DevTools konzoli

console.log('🚀 Spouštím finální test menu funkcí...');

// Testovací data
const testResults = {
    buttonsFound: 0,
    buttonsWorking: 0,
    modalsWorking: 0,
    errors: []
};

// 1. Test existence tlačítek
console.log('1️⃣ Test existence tlačítek:');
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

Object.entries(buttons).forEach(([device, btns]) => {
    console.log(`${device.toUpperCase()}:`);
    Object.entries(btns).forEach(([name, btn]) => {
        if (btn) {
            testResults.buttonsFound++;
            console.log(`  ✅ ${name}: Nalezeno`);
        } else {
            console.log(`  ❌ ${name}: Nenalezeno`);
            testResults.errors.push(`${device}_${name}_not_found`);
        }
    });
});

// 2. Test existence modalů
console.log('2️⃣ Test existence modalů:');
const modals = {
    rules: document.getElementById('rulesModal'),
    hallOfFame: document.getElementById('hallOfFameModal'),
    gameOver: document.getElementById('gameOverModal')
};

Object.entries(modals).forEach(([name, modal]) => {
    if (modal) {
        console.log(`  ✅ ${name}Modal: Nalezen`);
    } else {
        console.log(`  ❌ ${name}Modal: Nenalezen`);
        testResults.errors.push(`${name}_modal_not_found`);
    }
});

// 3. Funkční test tlačítek
console.log('3️⃣ Test funkčnosti tlačítek:');

// Test Rules tlačítka
function testRulesButton() {
    const rulesBtn = buttons.desktop.rules || buttons.mobile.rules;
    if (rulesBtn) {
        console.log('Testování Rules tlačítka...');
        rulesBtn.click();
        
        setTimeout(() => {
            const rulesModal = document.getElementById('rulesModal');
            if (rulesModal && !rulesModal.classList.contains('hidden')) {
                console.log('  ✅ Rules modal se otevřel');
                testResults.buttonsWorking++;
                testResults.modalsWorking++;
                
                // Test zavření
                const closeBtn = document.getElementById('closeRulesBtn');
                if (closeBtn) {
                    closeBtn.click();
                    setTimeout(() => {
                        if (rulesModal.classList.contains('hidden')) {
                            console.log('  ✅ Rules modal se zavřel');
                        } else {
                            console.log('  ❌ Rules modal se nezavřel');
                            testResults.errors.push('rules_modal_not_closing');
                        }
                    }, 100);
                }
            } else {
                console.log('  ❌ Rules modal se neotevřel');
                testResults.errors.push('rules_modal_not_opening');
            }
        }, 100);
    }
}

// Test Hall of Fame tlačítka
function testHallOfFameButton() {
    const hallBtn = buttons.desktop.hall || buttons.mobile.hall;
    if (hallBtn) {
        console.log('Testování Hall of Fame tlačítka...');
        hallBtn.click();
        
        setTimeout(() => {
            const hallModal = document.getElementById('hallOfFameModal');
            if (hallModal && !hallModal.classList.contains('hidden')) {
                console.log('  ✅ Hall of Fame modal se otevřel');
                testResults.buttonsWorking++;
                testResults.modalsWorking++;
                
                // Test zavření
                const closeBtn = document.getElementById('closeHallOfFameBtn');
                if (closeBtn) {
                    closeBtn.click();
                    setTimeout(() => {
                        if (hallModal.classList.contains('hidden')) {
                            console.log('  ✅ Hall of Fame modal se zavřel');
                        } else {
                            console.log('  ❌ Hall of Fame modal se nezavřel');
                            testResults.errors.push('hall_modal_not_closing');
                        }
                    }, 100);
                }
            } else {
                console.log('  ❌ Hall of Fame modal se neotevřel');
                testResults.errors.push('hall_modal_not_opening');
            }
        }, 100);
    }
}

// Test Start Game tlačítka
function testStartGameButton() {
    const startBtn = buttons.desktop.start || buttons.mobile.start;
    if (startBtn) {
        console.log('Testování Start Game tlačítka...');
        try {
            startBtn.click();
            console.log('  ✅ Start Game tlačítko reaguje');
            testResults.buttonsWorking++;
        } catch (error) {
            console.log('  ❌ Start Game tlačítko nereaguje:', error);
            testResults.errors.push('start_button_error');
        }
    }
}

// Test Exit Game tlačítka  
function testExitGameButton() {
    const exitBtn = buttons.desktop.exit || buttons.mobile.exit;
    if (exitBtn) {
        console.log('Testování Exit Game tlačítka...');
        
        // Mockujeme confirm aby se neotevřelo
        const originalConfirm = window.confirm;
        window.confirm = () => false; // Simuluje "Ne" v confirm dialogu
        
        try {
            exitBtn.click();
            console.log('  ✅ Exit Game tlačítko reaguje');
            testResults.buttonsWorking++;
        } catch (error) {
            console.log('  ❌ Exit Game tlačítko nereaguje:', error);
            testResults.errors.push('exit_button_error');
        } finally {
            window.confirm = originalConfirm; // Obnoví původní confirm
        }
    }
}

// Spuštění testů postupně
testRulesButton();
setTimeout(testHallOfFameButton, 500);
setTimeout(testStartGameButton, 1000);
setTimeout(testExitGameButton, 1500);

// Výsledky po 2 sekundách
setTimeout(() => {
    console.log('📊 FINÁLNÍ VÝSLEDKY:');
    console.log(`Tlačítka nalezena: ${testResults.buttonsFound}/8`);
    console.log(`Tlačítka funkční: ${testResults.buttonsWorking}/4`);
    console.log(`Modály funkční: ${testResults.modalsWorking}/2`);
    
    if (testResults.errors.length > 0) {
        console.log('❌ Chyby:');
        testResults.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    const allWorking = testResults.buttonsFound >= 8 && 
                      testResults.buttonsWorking >= 4 && 
                      testResults.modalsWorking >= 2 &&
                      testResults.errors.length === 0;
    
    console.log(allWorking ? '🎉 VŠECHNA MENU TLAČÍTKA FUNGUJÍ!' : '⚠️ NĚKTERÉ FUNKCE STÁLE NEFUNGUJÍ');
    
    return testResults;
}, 2000);
