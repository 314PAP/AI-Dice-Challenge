// 🧪 Konečný test pro ověření oprav avatarů
// Spusťte tento kód v konzoli prohlížeče na http://localhost:5181/

console.log('🎯 === KONEČNÝ TEST OPRAV AVATARŮ ===');

// 1. Test dostupnosti elementů
console.log('\n📋 1. Test dostupnosti elementů:');
const desktopPlayers = document.querySelectorAll('.player');
const mobilePlayers = document.querySelectorAll('.player-mobile');

console.log(`   Desktop hráči: ${desktopPlayers.length}/4`);
console.log(`   Mobile hráči: ${mobilePlayers.length}/4`);

// 2. Test mapování barev
console.log('\n🎨 2. Test mapování barev:');
const playerMapping = {
    'human-player': { expected: '--neon-green', color: 'zelená' },
    'gemini-player': { expected: '--neon-blue', color: 'modrá' },
    'chatgpt-player': { expected: '--neon-pink', color: 'RŮŽOVÁ' },
    'claude-player': { expected: '--neon-orange', color: 'ORANŽOVÁ' }
};

Object.entries(playerMapping).forEach(([className, config]) => {
    const desktopElement = document.querySelector(`.player.${className}`);
    const mobileElement = document.querySelector(`.player-mobile.${className}`);
    
    console.log(`   ${className}:`);
    console.log(`     Desktop: ${desktopElement ? '✅' : '❌'}`);
    console.log(`     Mobile: ${mobileElement ? '✅' : '❌'}`);
    console.log(`     Očekávaná barva: ${config.color}`);
});

// 3. Test aktivních stavů
console.log('\n🎯 3. Test aktivních stavů:');
const activeDesktop = document.querySelector('.player.active');
const activeMobile = document.querySelector('.player-mobile.active');

console.log(`   Aktivní desktop hráč: ${activeDesktop ? '✅' : '❌'}`);
console.log(`   Aktivní mobile hráč: ${activeMobile ? '✅' : '❌'}`);

if (activeDesktop) {
    const computedStyle = window.getComputedStyle(activeDesktop);
    console.log(`   Barva rámečku: ${computedStyle.borderColor}`);
    console.log(`   Box-shadow: ${computedStyle.boxShadow}`);
}

// 4. Test mobilní skóre
console.log('\n📱 4. Test mobilní skóre:');
const mobileScores = ['humanScoreMobile', 'geminiScoreMobile', 'chatgptScoreMobile', 'claudeScoreMobile'];
mobileScores.forEach(id => {
    const element = document.getElementById(id);
    console.log(`   ${id}: ${element ? '✅' : '❌'}`);
});

// 5. Test obrázků
console.log('\n🖼️ 5. Test obrázků avatarů:');
const images = document.querySelectorAll('img[src*="ai-icons"]');
console.log(`   Načtené obrázky: ${images.length}`);

images.forEach(img => {
    console.log(`   ${img.src}: ${img.complete && img.naturalWidth !== 0 ? '✅' : '❌'}`);
});

// 6. Funkce pro testování přepínání hráčů
console.log('\n🔄 6. Funkce pro testování přepínání:');
console.log('   Spusťte: testPlayerSwitch(0) pro test hráče 0');
console.log('   Spusťte: testPlayerSwitch(1) pro test hráče 1');
console.log('   Spusťte: testPlayerSwitch(2) pro test ChatGPT');
console.log('   Spusťte: testPlayerSwitch(3) pro test Claude');

window.testPlayerSwitch = function(playerIndex) {
    console.log(`\n🔄 Testování přepnutí na hráče ${playerIndex}:`);
    
    // Simulace změny currentPlayer
    if (window.gameState) {
        const oldPlayer = window.gameState.currentPlayer;
        window.gameState.currentPlayer = playerIndex;
        console.log(`   Změna z ${oldPlayer} na ${playerIndex}`);
        
        // Zavolání updateActivePlayer
        if (window.updateActivePlayer) {
            window.updateActivePlayer();
            console.log('   ✅ updateActivePlayer zavolán');
        }
    }
};

console.log('\n🎉 === TEST DOKONČEN ===');
console.log('👀 Zkontrolujte vizuálně:');
console.log('   - ChatGPT má RŮŽOVÉ podsvícení');
console.log('   - Claude má ORANŽOVÉ podsvícení');
console.log('   - Aktivní hráč je zvýrazněn');
console.log('   - Mobilní verze funguje při zmenšení okna');
