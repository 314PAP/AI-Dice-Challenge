/**
 * 🎲 AI Dice Challenge - Test Version
 * Testovací verze pouze pro ověření načítání
 */

console.log('🎲 AI Dice Challenge - Test version starting...');

// Základní test
function testBasicFunctionality() {
    console.log('🧪 Testing basic functionality...');
    
    // Test 1: Jsou k dispozici základní DOM elementy?
    const gameContent = document.getElementById('gameContent');
    const chatPanel = document.getElementById('chatPanel');
    
    if (gameContent) {
        console.log('✅ gameContent element found');
        gameContent.innerHTML = '<h1 class="game-title neon-text">AI Kostková Výzva</h1><p class="neon-text">Test načítání</p>';
    } else {
        console.log('❌ gameContent element not found');
    }
    
    if (chatPanel) {
        console.log('✅ chatPanel element found');
        chatPanel.innerHTML = '<div class="chat-box"><p class="neon-text">Chat test</p></div>';
    } else {
        console.log('❌ chatPanel element not found');
    }
    
    // Test 2: Jsou k dispozici CSS styly?
    const computedStyle = window.getComputedStyle(document.documentElement);
    const neonGreen = computedStyle.getPropertyValue('--neon-green');
    
    if (neonGreen) {
        console.log('✅ CSS variables loaded, --neon-green:', neonGreen);
    } else {
        console.log('❌ CSS variables not loaded');
    }
    
    // Test 3: Nastavení základních stylů
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#39ff14';
    
    console.log('🎯 Test complete!');
}

// Spustit test po načtení DOM
document.addEventListener('DOMContentLoaded', testBasicFunctionality);

// Spustit test také okamžitě pro případy, kdy už je DOM načten
if (document.readyState === 'loading') {
    console.log('⏳ DOM is still loading, waiting...');
} else {
    console.log('✅ DOM is already loaded, running test immediately');
    testBasicFunctionality();
}
