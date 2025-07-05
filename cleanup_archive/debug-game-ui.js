// Debug test pro ověření načtení herních šablon
// Spustit v konzoli na http://localhost:8000

console.log('🧪 Testing Game UI Templates...');

// Test existence herních kontejnerů
console.log('🔍 Testing containers:');
console.log('gameControls:', document.getElementById('gameControls') ? '✅ EXISTS' : '❌ NOT FOUND');
console.log('gameControlsMobile:', document.getElementById('gameControlsMobile') ? '✅ EXISTS' : '❌ NOT FOUND');

// Test existence herních elementů
console.log('🔍 Testing game elements:');
console.log('.human-player:', document.querySelector('.human-player') ? '✅ EXISTS' : '❌ NOT FOUND');
console.log('.gemini-player:', document.querySelector('.gemini-player') ? '✅ EXISTS' : '❌ NOT FOUND');
console.log('.dice-container:', document.querySelector('.dice-container') ? '✅ EXISTS' : '❌ NOT FOUND');
console.log('#rollBtn:', document.getElementById('rollBtn') ? '✅ EXISTS' : '❌ NOT FOUND');
console.log('#bankBtn:', document.getElementById('bankBtn') ? '✅ EXISTS' : '❌ NOT FOUND');

// Test obsahu gameControls
const gameControls = document.getElementById('gameControls');
if (gameControls) {
    console.log('gameControls content:', gameControls.innerHTML.length > 0 ? '✅ HAS CONTENT' : '❌ EMPTY');
    console.log('gameControls visible:', !gameControls.classList.contains('hidden') ? '✅ VISIBLE' : '❌ HIDDEN');
}

// Test obsahu gameControlsMobile
const gameControlsMobile = document.getElementById('gameControlsMobile');
if (gameControlsMobile) {
    console.log('gameControlsMobile content:', gameControlsMobile.innerHTML.length > 0 ? '✅ HAS CONTENT' : '❌ EMPTY');
    console.log('gameControlsMobile visible:', !gameControlsMobile.classList.contains('hidden') ? '✅ VISIBLE' : '❌ HIDDEN');
}

console.log('🏁 Test complete');
