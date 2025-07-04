// Testovací skript pro ověření funkčnosti menu tlačítek
console.log('🧪 Testování menu tlačítek...');

// Funkce pro testování přítomnosti tlačítek
function testButtonPresence() {
    console.log('\n=== TEST: Přítomnost tlačítek v DOM ===');
    
    const buttonsToCheck = [
        'startGameBtn', 'startGameBtnMobile',
        'rulesBtn', 'rulesBtnMobile',
        'hallOfFameBtn', 'hallOfFameBtnMobile',
        'exitGameBtn', 'exitGameBtnMobile'
    ];
    
    buttonsToCheck.forEach(id => {
        const btn = document.getElementById(id);
        console.log(`${id}: ${btn ? '✅ NALEZENO' : '❌ NENALEZENO'}`);
    });
}

// Funkce pro testování event listenerů
function testEventListeners() {
    console.log('\n=== TEST: Event Listeners ===');
    
    // Test start game tlačítek
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
        console.log('🎮 Testuji Start Game...');
        startBtn.click();
    }
    
    // Test pravidla
    const rulesBtn = document.getElementById('rulesBtn');
    if (rulesBtn) {
        console.log('📖 Testuji Pravidla...');
        rulesBtn.click();
        
        // Zkontrolovat, zda se modal zobrazil
        setTimeout(() => {
            const rulesModal = document.getElementById('rulesModal');
            console.log(`Rules modal: ${rulesModal && !rulesModal.classList.contains('hidden') ? '✅ ZOBRAZENO' : '❌ NEZOBRAZENO'}`);
            
            // Zavřít modal
            if (rulesModal && !rulesModal.classList.contains('hidden')) {
                rulesModal.classList.add('hidden');
            }
        }, 100);
    }
    
    // Test síň slávy
    const hallBtn = document.getElementById('hallOfFameBtn');
    if (hallBtn) {
        console.log('🏆 Testuji Síň slávy...');
        hallBtn.click();
        
        // Zkontrolovat, zda se modal zobrazil
        setTimeout(() => {
            const hallModal = document.getElementById('hallOfFameModal');
            console.log(`Hall of Fame modal: ${hallModal && !hallModal.classList.contains('hidden') ? '✅ ZOBRAZENO' : '❌ NEZOBRAZENO'}`);
            
            // Zavřít modal
            if (hallModal && !hallModal.classList.contains('hidden')) {
                hallModal.classList.add('hidden');
            }
        }, 100);
    }
}

// Funkce pro testování mobilních tlačítek
function testMobileButtons() {
    console.log('\n=== TEST: Mobilní tlačítka ===');
    
    const mobileBtns = [
        'startGameBtnMobile',
        'rulesBtnMobile', 
        'hallOfFameBtnMobile',
        'exitGameBtnMobile'
    ];
    
    mobileBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            console.log(`${id}: ✅ NALEZENO - testuji klik...`);
            btn.click();
        } else {
            console.log(`${id}: ❌ NENALEZENO`);
        }
    });
}

// Hlavní test funkce
function runTests() {
    console.log('🚀 Spouštím kompletní test menu tlačítek...');
    
    testButtonPresence();
    
    setTimeout(() => {
        testEventListeners();
    }, 500);
    
    setTimeout(() => {
        testMobileButtons();
    }, 1000);
    
    setTimeout(() => {
        console.log('\n=== SOUHRN TESTŮ ===');
        console.log('✅ Testy dokončeny. Zkontrolujte výstupy výše.');
        console.log('💡 Pokud jsou tlačítka nalezena, ale nereagují, zkontrolujte console chyby.');
    }, 1500);
}

// Spustit testy po načtení stránky
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}

// Export pro ruční spuštění z konzole
window.testMenuButtons = {
    runTests,
    testButtonPresence,
    testEventListeners,
    testMobileButtons
};
