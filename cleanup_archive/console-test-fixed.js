// Quick test in browser console
// Paste this into browser console at http://localhost:8000

console.log('🧪 Testing fixed startGame...');

// Create target score input if it doesn't exist
if (!document.getElementById('targetScoreInput')) {
    const input = document.createElement('input');
    input.id = 'targetScoreInput';
    input.value = '10000';
    input.style.display = 'none';
    document.body.appendChild(input);
    console.log('✅ Created targetScoreInput');
}

// Test startGame
import('./src/js/game/controllers/gameFlowController.js').then(module => {
    console.log('✅ Module imported');
    
    try {
        module.startGame();
        console.log('✅ startGame called successfully');
    } catch (error) {
        console.error('❌ startGame error:', error);
    }
}).catch(error => {
    console.error('❌ Import error:', error);
});
