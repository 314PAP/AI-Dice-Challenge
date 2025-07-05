// Debug skript pro kontrolu stavu aplikace
console.log('=== APLIKACE DEBUG ===');

// Kontrola načtení šablon
console.log('\n1. KONTROLA NAČTENÍ ŠABLON:');
const gameContent = document.getElementById('gameContent');
const gameControls = document.getElementById('gameControls');
const gameControlsMobile = document.getElementById('gameControlsMobile');
const gameMobileContent = document.getElementById('gameMobileContent');

console.log('- gameContent:', gameContent ? 'EXISTS' : 'MISSING');
console.log('- gameControls:', gameControls ? 'EXISTS' : 'MISSING');
console.log('- gameControlsMobile:', gameControlsMobile ? 'EXISTS' : 'MISSING');
console.log('- gameMobileContent:', gameMobileContent ? 'EXISTS' : 'MISSING');

// Kontrola obsahu šablon
console.log('\n2. KONTROLA OBSAHU ŠABLON:');
if (gameContent) {
    console.log('- gameContent innerHTML length:', gameContent.innerHTML.length);
    console.log('- gameContent contains startGameBtn:', gameContent.innerHTML.includes('startGameBtn'));
}

if (gameControls) {
    console.log('- gameControls innerHTML length:', gameControls.innerHTML.length);
    console.log('- gameControls contains diceContainer:', gameControls.innerHTML.includes('diceContainer'));
}

// Kontrola tlačítek
console.log('\n3. KONTROLA TLAČÍTEK:');
const startGameBtn = document.getElementById('startGameBtn');
const startGameBtnMobile = document.getElementById('startGameBtnMobile');
const targetScoreInput = document.getElementById('targetScoreInput');

console.log('- startGameBtn:', startGameBtn ? 'EXISTS' : 'MISSING');
console.log('- startGameBtnMobile:', startGameBtnMobile ? 'EXISTS' : 'MISSING');
console.log('- targetScoreInput:', targetScoreInput ? 'EXISTS' : 'MISSING');

if (targetScoreInput) {
    console.log('- targetScoreInput value:', targetScoreInput.value);
}

// Kontrola viditelnosti
console.log('\n4. KONTROLA VIDITELNOSTI:');
console.log('- gameContent visible:', gameContent && !gameContent.classList.contains('hidden'));
console.log('- gameControls visible:', gameControls && !gameControls.classList.contains('hidden'));
console.log('- gameControlsMobile visible:', gameControlsMobile && !gameControlsMobile.classList.contains('hidden'));

// Kontrola event listenerů
console.log('\n5. KONTROLA EVENT LISTENERŮ:');
if (startGameBtn) {
    console.log('- startGameBtn má event listeners:', startGameBtn.onclick !== null || startGameBtn.addEventListener !== undefined);
}

// Test spuštění hry (bez skutečného spuštění)
console.log('\n6. TEST SPUŠTĚNÍ HRY:');
if (startGameBtn && targetScoreInput) {
    console.log('- Simuluji kliknutí na startGameBtn...');
    console.log('- Target score:', targetScoreInput.value);
    
    // Simulujeme proces startGame
    console.log('- Kontrola elementů pro skrytí/zobrazení:');
    const gameHeader = document.getElementById('gameHeader');
    const playersContainer = document.querySelector('.players-container');
    
    console.log('  - gameHeader:', gameHeader ? 'EXISTS' : 'MISSING');
    console.log('  - playersContainer:', playersContainer ? 'EXISTS' : 'MISSING');
    
    if (gameHeader) {
        console.log('  - gameHeader currently hidden:', gameHeader.classList.contains('hidden'));
    }
    if (playersContainer) {
        console.log('  - playersContainer currently hidden:', playersContainer.classList.contains('hidden'));
    }
}

console.log('\n=== DEBUG DOKONČEN ===');
