// Rychlý test pro tlačítka - spusťte v konzoli prohlížeče

console.log('🧪 Test tlačítek...');

// Test existence tlačítek
const startBtn = document.getElementById('startGameBtn');
const hallBtn = document.getElementById('hallOfFameBtn');

console.log('startGameBtn:', startBtn);
console.log('hallOfFameBtn:', hallBtn);

if (startBtn) {
    console.log('✅ startGameBtn existuje');
    // Přidej dočasný event listener
    startBtn.addEventListener('click', () => {
        console.log('🎮 Start button clicked!');
        alert('Start button funguje!');
    });
} else {
    console.log('❌ startGameBtn neexistuje');
}

if (hallBtn) {
    console.log('✅ hallOfFameBtn existuje');
    hallBtn.addEventListener('click', () => {
        console.log('🏆 Hall of Fame button clicked!');
        alert('Hall of Fame button funguje!');
    });
} else {
    console.log('❌ hallOfFameBtn neexistuje');
}

// Test globálních objektů
console.log('window.uiController:', window.uiController);
console.log('window.gameController:', window.gameController);
console.log('window.addChatMessage:', window.addChatMessage);
