/**
 * Test náhodnosti kostek - kontrola, zda jsou všichni hráči spravedlivě hodnoceni
 */

// Simulace funkce rollDie
const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
};

// Simulace funkce rollDice
const rollDice = (count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(rollDie());
    }
    return result;
};

// Simulace funkce hasScoringDice (zjednodušená)
const hasScoringDice = (dice) => {
    return dice.some(die => die === 1 || die === 5);
};

// Test náhodnosti
function testRandomness() {
    console.log('🎲 Test náhodnosti kostek...\n');
    
    const players = ['Hráč', 'Gemini', 'ChatGPT', 'Claude'];
    const testRounds = 1000;
    const stats = {};
    
    // Inicializace statistik
    players.forEach(player => {
        stats[player] = {
            totalRolls: 0,
            farkleCount: 0,
            averagePoints: 0,
            totalPoints: 0
        };
    });
    
    // Simulace hodů
    for (let round = 0; round < testRounds; round++) {
        players.forEach(player => {
            const dice = rollDice(6);
            stats[player].totalRolls++;
            
            // Počítání Farkle (zjednodušené - pouze když nejsou 1 nebo 5)
            if (!hasScoringDice(dice)) {
                stats[player].farkleCount++;
            } else {
                // Zjednodušené počítání bodů (1=100, 5=50)
                let points = 0;
                dice.forEach(die => {
                    if (die === 1) points += 100;
                    if (die === 5) points += 50;
                });
                stats[player].totalPoints += points;
            }
        });
    }
    
    // Výpočet průměrů
    players.forEach(player => {
        stats[player].averagePoints = stats[player].totalPoints / stats[player].totalRolls;
        stats[player].farklePercentage = (stats[player].farkleCount / stats[player].totalRolls) * 100;
    });
    
    // Výsledky
    console.log(`📊 Výsledky testů náhodnosti (${testRounds} kol):\n`);
    
    players.forEach(player => {
        const s = stats[player];
        console.log(`${player}:`);
        console.log(`  🎯 Hodů celkem: ${s.totalRolls}`);
        console.log(`  💥 Farkle: ${s.farkleCount} (${s.farklePercentage.toFixed(1)}%)`);
        console.log(`  📈 Průměrné body: ${s.averagePoints.toFixed(1)}`);
        console.log(`  📊 Celkové body: ${s.totalPoints}`);
        console.log('');
    });
    
    // Analýza spravedlnosti
    const farklePercentages = players.map(p => stats[p].farklePercentage);
    const minFarkle = Math.min(...farklePercentages);
    const maxFarkle = Math.max(...farklePercentages);
    const farkleSpread = maxFarkle - minFarkle;
    
    const averagePoints = players.map(p => stats[p].averagePoints);
    const minPoints = Math.min(...averagePoints);
    const maxPoints = Math.max(...averagePoints);
    const pointsSpread = ((maxPoints - minPoints) / minPoints * 100);
    
    console.log('🔍 Analýza spravedlnosti:');
    console.log(`  💥 Farkle rozsah: ${farkleSpread.toFixed(1)}% (spravedlivé < 5%)`);
    console.log(`  📈 Body rozsah: ${pointsSpread.toFixed(1)}% (spravedlivé < 20%)`);
    
    if (farkleSpread < 5 && pointsSpread < 20) {
        console.log('✅ Náhodnost je SPRAVEDLIVÁ!');
    } else {
        console.log('❌ Náhodnost může být NESPRAVEDLIVÁ!');
    }
}

// Spuštění testu
testRandomness();
