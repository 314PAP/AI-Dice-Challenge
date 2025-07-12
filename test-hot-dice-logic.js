/**
 * Test Hot Dice - simuluje situaci kdy AI odloží všech 6 kostek
 */

// Spustíme test v prohlížeči
console.log('🎯 Test Hot Dice situace');

// Simulujeme stav po hot dice
const simulatedState = {
    players: [
        { name: 'Hráč', score: 0, isHuman: true },
        { name: 'Gemini', score: 0, isHuman: false }
    ],
    currentPlayerIndex: 1, // Gemini
    currentRoll: [], // Prázdné - všechny kostky odloženy
    savedDice: [], // Prázdné - hot dice reset
    turnScore: 850, // Akumulované body
    selectedDice: [],
    isRolling: false,
    gameStarted: true
};

console.log('📊 Simulovaný stav po Hot Dice:', simulatedState);

// Kontrola podmínek
console.log('🔍 Kontroly:');
console.log('  - currentRoll.length:', simulatedState.currentRoll.length);
console.log('  - turnScore > 0:', simulatedState.turnScore > 0);
console.log('  - savedDice.length:', simulatedState.savedDice.length);

// Logika pro AI rozhodování
if (!simulatedState.currentRoll || simulatedState.currentRoll.length === 0) {
    if (simulatedState.turnScore > 0) {
        console.log('✅ HOT DICE detekován - AI by měl házet znovu');
        console.log(`   turnScore: ${simulatedState.turnScore} bodů`);
    } else {
        console.log('❌ Žádné kostky ani body - AI by ukončil');
    }
} else {
    console.log('🎲 Kostky na stole:', simulatedState.currentRoll);
}
