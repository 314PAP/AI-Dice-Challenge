/**
 * Test všech JS importů a základní funkcionality
 * Test all JS imports and basic functionality
 */
console.log('🧪 Testing all imports and functionality...');

// Test všech hlavních modulů
try {
    // Test main entry point
    console.log('📍 Testing main entry point...');
    import('./src/main.js')
        .then(() => console.log('✅ Main entry point loaded successfully'))
        .catch(err => console.error('❌ Main entry point failed:', err));

    // Test game modules
    console.log('📍 Testing game modules...');
    import('./src/js/game/gameState.js')
        .then(() => console.log('✅ GameState loaded'))
        .catch(err => console.error('❌ GameState failed:', err));

    import('./src/js/game/gameController.js')
        .then(() => console.log('✅ GameController loaded'))
        .catch(err => console.error('❌ GameController failed:', err));

    import('./src/js/game/diceLogic.js')
        .then(() => console.log('✅ DiceLogic loaded'))
        .catch(err => console.error('❌ DiceLogic failed:', err));

    // Test AI modules
    console.log('📍 Testing AI modules...');
    import('./src/ai/controllers/enhancedAIController.js')
        .then(() => console.log('✅ EnhancedAIController loaded'))
        .catch(err => console.error('❌ EnhancedAIController failed:', err));

    import('./src/js/ai/aiPlayer.js')
        .then(() => console.log('✅ AIPlayer loaded'))
        .catch(err => console.error('❌ AIPlayer failed:', err));

    // Test UI modules
    console.log('📍 Testing UI modules...');
    import('./src/ui/gameUIController.js')
        .then(() => console.log('✅ GameUIController loaded'))
        .catch(err => console.error('❌ GameUIController failed:', err));

    import('./src/js/ui/gameUI.js')
        .then(() => console.log('✅ GameUI loaded'))
        .catch(err => console.error('❌ GameUI failed:', err));

} catch (error) {
    console.error('💥 Critical error during module testing:', error);
}

console.log('🏁 Module testing complete');
