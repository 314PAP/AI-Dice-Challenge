// Jednoduchý test pro ověření správného mapování barev avatarů
// Tento test můžeme spustit v konzoli prohlížeče

console.log('🧪 Test mapování barev avatarů');

// Simulujeme stav hry s různými hráči
const testPlayers = [
    { name: 'Vy', type: 'human', score: 0 },
    { name: 'Gemini', type: 'gemini', score: 0 },
    { name: 'ChatGPT', type: 'chatgpt', score: 0 },
    { name: 'Claude', type: 'claude', score: 0 }
];

// Testujeme mapování barev pro každého hráče
testPlayers.forEach((player, index) => {
    console.log(`\n🎯 Testuje se hráč ${index}: ${player.name} (${player.type})`);
    
    // Očekávané barvy
    const expectedColors = {
        'human': '--neon-green',
        'gemini': '--neon-blue',
        'chatgpt': '--neon-pink',
        'claude': '--neon-orange'
    };
    
    const expectedColor = expectedColors[player.type];
    console.log(`   Očekávaná barva: ${expectedColor}`);
    
    // Testujeme CSS třídy
    const playerClasses = {
        'human': 'human-player',
        'gemini': 'gemini-player',
        'chatgpt': 'chatgpt-player',
        'claude': 'claude-player'
    };
    
    const expectedClass = playerClasses[player.type];
    console.log(`   Očekávaná třída: ${expectedClass}`);
    
    // Ověříme, jestli elementy existují
    const desktopPlayer = document.querySelector(`.${expectedClass}`);
    const mobilePlayer = document.querySelector(`.player-mobile.${expectedClass}`);
    
    console.log(`   Desktop element: ${desktopPlayer ? '✅ Nalezen' : '❌ Nenalezen'}`);
    console.log(`   Mobile element: ${mobilePlayer ? '✅ Nalezen' : '❌ Nenalezen'}`);
    
    // Zkontrolujeme barvy v CSS
    if (desktopPlayer) {
        const computedStyle = window.getComputedStyle(desktopPlayer);
        console.log(`   Desktop border-color: ${computedStyle.borderColor}`);
    }
    
    if (mobilePlayer) {
        const computedStyle = window.getComputedStyle(mobilePlayer);
        console.log(`   Mobile border-color: ${computedStyle.borderColor}`);
    }
});

console.log('\n🎯 Závěr testu:');
console.log('✅ ChatGPT by měl mít RŮŽOVOU barvu (--neon-pink)');
console.log('✅ Claude by měl mít ORANŽOVOU barvu (--neon-orange)');
console.log('\n📱 Pokud chcete otestovat mobilní verzi, změňte velikost okna prohlížeče');
