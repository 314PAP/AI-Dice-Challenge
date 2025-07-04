// 🧪 Kompletní test menu funkcí po opravách
// Spustit v DevTools konzoli

function runCompleteMenuTest() {
    console.log('🚀 Spouštím kompletní test menu funkcí...');
    
    const results = {
        buttonsFound: 0,
        buttonsWorking: 0,
        modalsLoaded: 0,
        errors: []
    };
    
    // Test existence tlačítek
    console.log('📋 Kontrola existence menu tlačítek:');
    const menuButtons = {
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
    
    Object.entries(menuButtons).forEach(([device, buttons]) => {
        console.log(`${device.toUpperCase()} tlačítka:`);
        Object.entries(buttons).forEach(([name, btn]) => {
            if (btn) {
                results.buttonsFound++;
                console.log(`  ✅ ${name}: Nalezeno`);
            } else {
                console.log(`  ❌ ${name}: Nenalezeno`);
                results.errors.push(`${device} ${name} button not found`);
            }
        });
    });
    
    // Test existence modalů
    console.log('🔲 Kontrola existence modalů:');
    const modals = {
        rules: document.getElementById('rulesModal'),
        hallOfFame: document.getElementById('hallOfFameModal'),
        gameOver: document.getElementById('gameOverModal')
    };
    
    Object.entries(modals).forEach(([name, modal]) => {
        if (modal) {
            results.modalsLoaded++;
            console.log(`  ✅ ${name}Modal: Načten`);
        } else {
            console.log(`  ❌ ${name}Modal: Nenačten`);
            results.errors.push(`${name} modal not loaded`);
        }
    });
    
    // Test funkčnosti tlačítek
    console.log('🖱️ Testování kliknutí:');
    
    // Test pravidla tlačítka
    if (menuButtons.desktop.rules) {
        try {
            console.log('Testování Rules tlačítka...');
            menuButtons.desktop.rules.click();
            
            setTimeout(() => {
                const rulesModal = document.getElementById('rulesModal');
                if (rulesModal && !rulesModal.classList.contains('hidden')) {
                    console.log('  ✅ Rules modal se otevřel');
                    results.buttonsWorking++;
                    
                    // Test zavření
                    const closeBtn = document.getElementById('closeRulesBtn');
                    if (closeBtn) {
                        closeBtn.click();
                        setTimeout(() => {
                            if (rulesModal.classList.contains('hidden')) {
                                console.log('  ✅ Rules modal se zavřel');
                            } else {
                                console.log('  ❌ Rules modal se nezavřel');
                            }
                        }, 100);
                    }
                } else {
                    console.log('  ❌ Rules modal se neotevřel');
                }
            }, 100);
        } catch (error) {
            console.error('  ❌ Chyba při testování Rules:', error);
            results.errors.push(`Rules button error: ${error.message}`);
        }
    }
    
    // Test síň slávy tlačítka
    setTimeout(() => {
        if (menuButtons.desktop.hall) {
            try {
                console.log('Testování Hall of Fame tlačítka...');
                menuButtons.desktop.hall.click();
                
                setTimeout(() => {
                    const hallModal = document.getElementById('hallOfFameModal');
                    if (hallModal && !hallModal.classList.contains('hidden')) {
                        console.log('  ✅ Hall of Fame modal se otevřel');
                        results.buttonsWorking++;
                        
                        // Test zavření
                        const closeBtn = document.getElementById('closeHallOfFameBtn');
                        if (closeBtn) {
                            closeBtn.click();
                            setTimeout(() => {
                                if (hallModal.classList.contains('hidden')) {
                                    console.log('  ✅ Hall of Fame modal se zavřel');
                                } else {
                                    console.log('  ❌ Hall of Fame modal se nezavřel');
                                }
                            }, 100);
                        }
                    } else {
                        console.log('  ❌ Hall of Fame modal se neotevřel');
                    }
                }, 100);
            } catch (error) {
                console.error('  ❌ Chyba při testování Hall of Fame:', error);
                results.errors.push(`Hall of Fame button error: ${error.message}`);
            }
        }
    }, 500);
    
    // Výsledky
    setTimeout(() => {
        console.log('📊 VÝSLEDKY TESTU:');
        console.log(`Tlačítka nalezena: ${results.buttonsFound}/8`);
        console.log(`Tlačítka funkční: ${results.buttonsWorking}/2`);
        console.log(`Modály načteny: ${results.modalsLoaded}/3`);
        
        if (results.errors.length > 0) {
            console.log('❌ Chyby:');
            results.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        const success = results.buttonsFound >= 8 && results.modalsLoaded >= 2 && results.errors.length === 0;
        console.log(success ? '🎉 VŠECHNY TESTY PROŠLY!' : '⚠️ NĚKTERÉ TESTY SELHALY');
    }, 1500);
}

// Automatické spuštění pokud je stránka už načtená
if (document.readyState === 'complete') {
    setTimeout(runCompleteMenuTest, 1000);
} else {
    window.addEventListener('load', () => {
        setTimeout(runCompleteMenuTest, 1000);
    });
}
