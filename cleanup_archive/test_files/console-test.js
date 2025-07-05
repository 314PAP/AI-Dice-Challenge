// Rychlé testování menu tlačítek v konzoli prohlížeče
// Použití: zkopíruj do konzole prohlížeče na stránce http://localhost:8000

console.log('🧪 Testování menu tlačítek...');

// Test 1: Ověření existence tlačítek
console.log('🔍 Test 1: Existence tlačítek');
const startBtnDesktop = document.getElementById('startGameBtn');
const startBtnMobile = document.getElementById('startGameBtnMobile');
const rulesBtn = document.getElementById('rulesBtn');
const hallBtn = document.getElementById('hallOfFameBtn');
const exitBtn = document.getElementById('exitGameBtn');

console.log('startGameBtn (desktop):', startBtnDesktop ? '✅ FOUND' : '❌ NOT FOUND');
console.log('startGameBtnMobile:', startBtnMobile ? '✅ FOUND' : '❌ NOT FOUND');
console.log('rulesBtn:', rulesBtn ? '✅ FOUND' : '❌ NOT FOUND');
console.log('hallOfFameBtn:', hallBtn ? '✅ FOUND' : '❌ NOT FOUND');
console.log('exitGameBtn:', exitBtn ? '✅ FOUND' : '❌ NOT FOUND');

// Test 2: Ověření event listenerů
console.log('🔍 Test 2: Event listeners');
function testEventListeners() {
    if (startBtnDesktop) {
        console.log('startGameBtn event listeners:', getEventListeners(startBtnDesktop));
    }
    if (startBtnMobile) {
        console.log('startGameBtnMobile event listeners:', getEventListeners(startBtnMobile));
    }
}

// Test 3: Simulace kliknutí
console.log('🔍 Test 3: Simulace kliknutí');
function testStartGameClick() {
    console.log('🎮 Simuluji kliknutí na Start Game...');
    if (startBtnDesktop) {
        try {
            startBtnDesktop.click();
            console.log('✅ Start Game click - úspěšné');
        } catch (error) {
            console.error('❌ Start Game click - chyba:', error);
        }
    } else if (startBtnMobile) {
        try {
            startBtnMobile.click();
            console.log('✅ Start Game Mobile click - úspěšné');
        } catch (error) {
            console.error('❌ Start Game Mobile click - chyba:', error);
        }
    }
}

function testRulesClick() {
    console.log('📖 Simuluji kliknutí na Pravidla...');
    if (rulesBtn) {
        try {
            rulesBtn.click();
            console.log('✅ Pravidla click - úspěšné');
        } catch (error) {
            console.error('❌ Pravidla click - chyba:', error);
        }
    }
}

function testHallOfFameClick() {
    console.log('🏆 Simuluji kliknutí na Síň slávy...');
    if (hallBtn) {
        try {
            hallBtn.click();
            console.log('✅ Síň slávy click - úspěšné');
        } catch (error) {
            console.error('❌ Síň slávy click - chyba:', error);
        }
    }
}

// Test 4: Ověření importů
console.log('🔍 Test 4: Ověření importů');
async function testImports() {
    try {
        const { attachMenuButtonHandlers } = await import('./src/js/ui/menuButtonHandlers.js');
        console.log('✅ attachMenuButtonHandlers import - úspěšné');
        
        const { startGame } = await import('./src/js/game/controllers/gameFlowController.js');
        console.log('✅ startGame import - úspěšné');
        
        const { showRules } = await import('./src/js/game/controllers/eventSetupController.js');
        console.log('✅ showRules import - úspěšné');
        
        const { displayHallOfFame } = await import('./src/js/utils/hallOfFame.js');
        console.log('✅ displayHallOfFame import - úspěšné');
        
    } catch (error) {
        console.error('❌ Import test - chyba:', error);
    }
}

// Spustit všechny testy
console.log('🏁 Spouštím všechny testy...');
testEventListeners();
testImports();

// Funkce pro ruční testování
window.testMenuFix = {
    testStartGameClick,
    testRulesClick,
    testHallOfFameClick,
    testImports
};

console.log('✅ Testy připraveny. Použij:', 'window.testMenuFix.testStartGameClick()');
