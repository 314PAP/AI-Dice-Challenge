#!/usr/bin/env node

/**
 * 🎮 REAL-GAME SIMULATION TEST
 * 
 * Simuluje skutečné dlouhé hry Farkle s AI:
 * - Kompletní herní session s AI vs Hráč
 * - Testuje edge-cases v reálném kontextu
 * - Validuje AI decision making
 * - Měří performance a stability
 * - Detekuje AI zaseknutí a nekonečné smyčky
 */

import { calculatePoints, hasScoringDice } from './src/js/game/diceMechanics.js';

// Simulace kompletní hry
class RealGameSimulator {
    constructor() {
        this.reset();
        this.gameStats = {
            totalGames: 0,
            completedGames: 0,
            aiStuckGames: 0,
            avgGameLength: 0,
            maxTurns: 0,
            totalTurns: 0,
            farkleCount: 0,
            hotDiceCount: 0,
            aiDecisionTime: []
        };
    }

    reset() {
        this.gameState = {
            players: [
                { name: 'Hráč', score: 0, isAI: false, turns: 0 },
                { name: 'AI_Agresivní', score: 0, isAI: true, personality: 'aggressive', turns: 0 },
                { name: 'AI_Konzervativní', score: 0, isAI: true, personality: 'conservative', turns: 0 }
            ],
            currentPlayerIndex: 0,
            turnScore: 0,
            currentRoll: [],
            gamePhase: 'playing',
            finalRound: false,
            targetScore: 1000,
            turnCount: 0,
            maxTurnsPerGame: 300 // Ochrana proti nekonečným hrám
        };
    }

    // Simulace kostky (6-stěnná)
    rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // Simulace hodu 6 kostek
    rollDice(count = 6) {
        return Array.from({ length: count }, () => this.rollDie());
    }

    // AI rozhodování podle osobnosti
    makeAiDecision(aiPlayer, currentRoll, turnScore, playerScore) {
        const startTime = Date.now();
        
        if (!hasScoringDice(currentRoll)) {
            // FARKLE - automaticky ukončit
            const decisionTime = Date.now() - startTime;
            this.gameStats.aiDecisionTime.push(decisionTime);
            return { action: 'farkle', decisionTime };
        }

        // Najdi nejlepší kombinaci kostek
        const bestDice = this.findBestDiceToSave(currentRoll);
        if (!bestDice || bestDice.indices.length === 0) {
            const decisionTime = Date.now() - startTime;
            this.gameStats.aiDecisionTime.push(decisionTime);
            return { action: 'farkle', decisionTime };
        }

        const points = bestDice.points;
        const wouldHaveTotalPoints = turnScore + points;
        const riskFactor = this.calculateRiskFactor(currentRoll.length - bestDice.indices.length);

        let decision;
        
        // Rozhodování podle osobnosti
        if (aiPlayer.personality === 'aggressive') {
            // Agresivní AI - více riskuje
            if (wouldHaveTotalPoints >= 400 && riskFactor > 0.7) {
                decision = { action: 'endTurn', diceToSave: bestDice.indices, points };
            } else if (wouldHaveTotalPoints >= 250 && riskFactor > 0.8) {
                decision = { action: 'endTurn', diceToSave: bestDice.indices, points };
            } else {
                decision = { action: 'continue', diceToSave: bestDice.indices, points };
            }
        } else {
            // Konzervativní AI - méně riskuje
            if (wouldHaveTotalPoints >= 300 && riskFactor > 0.5) {
                decision = { action: 'endTurn', diceToSave: bestDice.indices, points };
            } else if (wouldHaveTotalPoints >= 200 && riskFactor > 0.7) {
                decision = { action: 'endTurn', diceToSave: bestDice.indices, points };
            } else {
                decision = { action: 'continue', diceToSave: bestDice.indices, points };
            }
        }

        const decisionTime = Date.now() - startTime;
        this.gameStats.aiDecisionTime.push(decisionTime);
        decision.decisionTime = decisionTime;
        
        return decision;
    }

    // Najde nejlepší kostky k odložení
    findBestDiceToSave(dice) {
        if (!dice || dice.length === 0) return null;

        let bestCombination = null;
        let maxPoints = 0;

        // Zkouší všechny možné kombinace
        for (let i = 1; i < (1 << dice.length); i++) {
            const indices = [];
            const values = [];
            
            for (let j = 0; j < dice.length; j++) {
                if (i & (1 << j)) {
                    indices.push(j);
                    values.push(dice[j]);
                }
            }
            
            const points = calculatePoints(values);
            if (points > maxPoints) {
                maxPoints = points;
                bestCombination = { indices, values, points };
            }
        }

        return bestCombination;
    }

    // Výpočet rizikového faktoru
    calculateRiskFactor(remainingDice) {
        if (remainingDice <= 0) return 0;
        
        // Pravděpodobnost FARKLE podle počtu zbývajících kostek
        const farkleRisks = {
            1: 0.33, // 2 z 6 možností (1, 5)
            2: 0.44,
            3: 0.56,
            4: 0.67,
            5: 0.78,
            6: 0.83
        };
        
        return farkleRisks[remainingDice] || 0.9;
    }

    // Simuluje jeden tah AI
    async simulateAiTurn(aiPlayer) {
        let turnScore = 0;
        let currentRoll = this.rollDice(6);
        let attempts = 0;
        const maxAttempts = 10; // Ochrana proti zacyklení
        
        while (attempts < maxAttempts) {
            attempts++;
            
            // AI rozhodnutí
            const decision = this.makeAiDecision(aiPlayer, currentRoll, turnScore, aiPlayer.score);
            
            if (decision.action === 'farkle') {
                this.gameStats.farkleCount++;
                return 0; // Farkle - žádné body
            }
            
            if (decision.action === 'endTurn') {
                turnScore += decision.points;
                return turnScore;
            }
            
            if (decision.action === 'continue') {
                turnScore += decision.points;
                
                // Odstraň použité kostky
                const remainingDice = currentRoll.filter((_, index) => 
                    !decision.diceToSave.includes(index)
                );
                
                // HOT DICE check
                if (remainingDice.length === 0) {
                    this.gameStats.hotDiceCount++;
                    currentRoll = this.rollDice(6); // Nový hod se všemi kostkami
                } else {
                    currentRoll = this.rollDice(remainingDice.length);
                }
                
                // Krátká pauza pro simulaci thinking time
                await this.delay(50);
            }
        }
        
        // AI se zacyklila - force ukončení
        this.gameStats.aiStuckGames++;
        console.warn(`⚠️ AI ${aiPlayer.name} se zacyklila po ${attempts} pokusech`);
        return turnScore;
    }

    // Simuluje jednu kompletní hru
    async simulateGame(gameNumber) {
        this.reset();
        this.gameStats.totalGames++;
        
        console.log(`🎮 Spouštím hru #${gameNumber}...`);
        
        while (this.gameState.gamePhase === 'playing' && 
               this.gameState.turnCount < this.gameState.maxTurnsPerGame) {
            
            this.gameState.turnCount++;
            const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            currentPlayer.turns++;
            
            let turnScore = 0;
            
            if (currentPlayer.isAI) {
                // AI tah
                turnScore = await this.simulateAiTurn(currentPlayer);
            } else {
                // Simulace lidského hráče (náhodná ale rozumná rozhodnutí)
                turnScore = await this.simulateHumanTurn(currentPlayer);
            }
            
            // Přidat skóre
            currentPlayer.score += turnScore;
            
            // Kontrola výhry
            if (currentPlayer.score >= this.gameState.targetScore) {
                if (!this.gameState.finalRound) {
                    this.gameState.finalRound = true;
                    console.log(`🏁 ${currentPlayer.name} dosáhl ${this.gameState.targetScore} bodů! Finální kolo...`);
                } else if (this.gameState.currentPlayerIndex === 0) {
                    // Finální kolo dokončeno
                    this.gameState.gamePhase = 'finished';
                    break;
                }
            }
            
            // Další hráč
            this.gameState.currentPlayerIndex = 
                (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
        }
        
        if (this.gameState.gamePhase === 'finished') {
            this.gameStats.completedGames++;
            console.log(`✅ Hra #${gameNumber} dokončena po ${this.gameState.turnCount} tazích`);
        } else {
            console.log(`⚠️ Hra #${gameNumber} ukončena po dosažení limitu tahu (${this.gameState.maxTurnsPerGame})`);
        }
        
        this.gameStats.totalTurns += this.gameState.turnCount;
        this.gameStats.maxTurns = Math.max(this.gameStats.maxTurns, this.gameState.turnCount);
        
        return this.gameState;
    }

    // Simulace lidského hráče (zjednodušená)
    async simulateHumanTurn(player) {
        let turnScore = 0;
        let currentRoll = this.rollDice(6);
        
        // Jednoduchá strategie - konzervativní hra
        if (!hasScoringDice(currentRoll)) {
            this.gameStats.farkleCount++;
            return 0;
        }
        
        const bestDice = this.findBestDiceToSave(currentRoll);
        if (bestDice) {
            turnScore += bestDice.points;
            
            // Ukončit tah pokud má dostatečné body
            if (turnScore >= 300 || (player.score > 0 && turnScore >= 250)) {
                return turnScore;
            }
        }
        
        return turnScore;
    }

    // Spustí série her
    async runGameSeries(numberOfGames = 5) {
        console.log(`🚀 Spouštím sérii ${numberOfGames} real-game simulací...\n`);
        
        const startTime = Date.now();
        
        for (let i = 1; i <= numberOfGames; i++) {
            await this.simulateGame(i);
            
            // Krátká pauza mezi hrami
            await this.delay(100);
        }
        
        const totalTime = Date.now() - startTime;
        this.gameStats.avgGameLength = this.gameStats.totalTurns / this.gameStats.totalGames;
        
        this.printGameStats(totalTime);
    }

    // Vytiskne statistiky her
    printGameStats(totalTime) {
        console.log('\n📊 STATISTIKY REAL-GAME SIMULACE:');
        console.log('═'.repeat(50));
        
        console.log(`🎮 Celkem her: ${this.gameStats.totalGames}`);
        console.log(`✅ Dokončených: ${this.gameStats.completedGames}`);
        console.log(`⚠️ AI zacyklení: ${this.gameStats.aiStuckGames}`);
        console.log(`📈 Průměrná délka hry: ${this.gameStats.avgGameLength.toFixed(1)} tahů`);
        console.log(`📊 Nejdelší hra: ${this.gameStats.maxTurns} tahů`);
        console.log(`💥 Celkem FARKLE: ${this.gameStats.farkleCount}`);
        console.log(`🔥 Celkem HOT DICE: ${this.gameStats.hotDiceCount}`);
        
        if (this.gameStats.aiDecisionTime.length > 0) {
            const avgDecisionTime = this.gameStats.aiDecisionTime.reduce((a, b) => a + b) / this.gameStats.aiDecisionTime.length;
            const maxDecisionTime = Math.max(...this.gameStats.aiDecisionTime);
            console.log(`⏱️ Průměrný AI decision time: ${avgDecisionTime.toFixed(1)}ms`);
            console.log(`⏱️ Nejpomalejší AI decision: ${maxDecisionTime}ms`);
        }
        
        console.log(`⏳ Celkový čas simulace: ${(totalTime / 1000).toFixed(1)}s`);
        
        // Hodnocení stability
        console.log('\n🔍 HODNOCENÍ STABILITY:');
        console.log('-'.repeat(30));
        
        const successRate = (this.gameStats.completedGames / this.gameStats.totalGames) * 100;
        const aiStuckRate = (this.gameStats.aiStuckGames / this.gameStats.totalGames) * 100;
        
        console.log(`✅ Úspěšnost: ${successRate.toFixed(1)}%`);
        console.log(`⚠️ AI zacyklení: ${aiStuckRate.toFixed(1)}%`);
        
        if (successRate >= 95 && aiStuckRate <= 5) {
            console.log('🎉 VÝBORNÁ STABILITA!');
        } else if (successRate >= 80 && aiStuckRate <= 15) {
            console.log('✅ Dobrá stabilita');
        } else {
            console.log('❌ Potřeba optimalizace AI logiky');
        }
    }

    // Pomocná funkce pro delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Spuštění simulace
console.log('🎲 AI DICE CHALLENGE - REAL-GAME SIMULATION TEST');
console.log('=' .repeat(60));

const simulator = new RealGameSimulator();
simulator.runGameSeries(5) // Spustí 5 simulovaných her
    .then(() => {
        console.log('\n✅ Real-game simulation dokončena!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Chyba v simulaci:', error);
        process.exit(1);
    });
