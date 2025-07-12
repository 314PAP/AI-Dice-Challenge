/**
 * Game Logic - Hlavní herní logika a mechanics
 * 
 * OBSAH MODULU:
 * - Logika házení kostkami s animacemi
 * - Odložení kostek a validace
 * - Ukončování tahů a skórování
 * - Farkle detekce a zpracování
 * - Hot dice mechanika
 * - Kontrola vítězství
 * 
 * FUNKCE PŘESUNUTÉ Z gameUI.js:
 * - rollDice() - házení s animacemi
 * - saveDice() - odložení a validace 
 * - endTurn() - ukončení tahu
 * - pokračování v tahu logika
 */

import { rollDice as diceRoll, calculatePoints, hasScoringDice, isValidFarkleCombination } from './diceMechanics.js';
import gameState from './gameState.js';
import chatSystem from '../ai/chatSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';

export class GameLogic {
    constructor(gameRenderer) {
        this.gameRenderer = gameRenderer;
    }

    /**
     * Hodí kostky - s dynamickou animací změny čísel
     * PŘESUNUTO Z gameUI.js
     */
    async rollDice() {
        console.log('🎲 GameLogic: Házení kostkami...');
        
        const state = gameState.getState();
        
        // Určíme kolik kostek hodit
        let diceCount;
        
        // Pokud jsou zbývající kostky z předchozího hodu, házíme jimi
        if (state.currentRoll && state.currentRoll.length > 0) {
            diceCount = state.currentRoll.length;
            console.log(`🎯 Házím se zbývajícími ${diceCount} kostkami`);
        } else {
            // Jinak házíme novými kostkami podle toho, kolik jich zbývá
            const totalSavedDice = (state.savedDice || []).length;
            if (totalSavedDice === 0) {
                // Začátek tahu - hodíme všemi 6 kostkami
                diceCount = 6;
            } else {
                // Hot dice - všech 6 kostek bylo odloženo, házíme znovu všemi
                diceCount = 6;
            }
            console.log(`🎯 Házím ${diceCount} novými kostkami`);
        }

        // Ukážeme animaci házeních kostek PŘED výsledkem
        gameState.updateState({
            currentRoll: Array(diceCount).fill(0), // Dočasně prázdné kostky
            selectedDice: [],
            isRolling: true // Flag pro animaci
        });
        
        // Spustíme animaci házení
        await this.playRollingAnimation(diceCount);
    }

    /**
     * Animace házení kostek
     * @param {number} diceCount - Počet kostek
     */
    async playRollingAnimation(diceCount) {
        return new Promise((resolve) => {
            let animationCounter = 0;
            const animationInterval = setInterval(() => {
                animationCounter++;
                const randomDice = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
                
                // Aktualizujeme kostky s náhodnými čísly pro animaci
                gameState.updateState({
                    currentRoll: randomDice,
                    isRolling: true
                });
                
                // Po 10 iteracích (2 sekundy) ukončíme animaci
                if (animationCounter >= 10) {
                    clearInterval(animationInterval);
                    
                    // Po animaci ukážeme finální výsledek
                    setTimeout(() => {
                        this.finishRoll(diceCount);
                        resolve();
                    }, 100);
                }
            }, 200); // Každých 200ms se změní čísla
        });
    }

    /**
     * Dokončí hod kostkami
     * @param {number} diceCount - Počet kostek
     */
    finishRoll(diceCount) {
        // Využití importované funkce pro finální hod
        const dice = diceRoll(diceCount);
        
        // Spočítáme body z tohoto hodu
        const points = calculatePoints(dice);
        
        // Aktualizuje herní stav s výsledkem
        gameState.updateState({
            currentRoll: dice,
            selectedDice: [],
            isRolling: false
        });
        
        console.log(`🎯 Hozeno: [${dice.join(', ')}] = ${points} bodů`);
        chatSystem.addSystemMessage(`🎯 [${dice.join(', ')}] = ${points} bodů`);
        
        // Zkontrolujeme FARKLE - když hod neobsahuje žádné bodující kostky
        if (!hasScoringDice(dice)) {
            this.handleFarkle(dice);
        } else {
            // ODSTRANĚNO: Dlouhá zpráva o výběru kostek - zbytečná
            console.log(`✅ Kostky na výběr dostupné`);
        }
        
        // Přidáme spawn animaci
        this.addSpawnAnimation();
    }

    /**
     * Zpracuje FARKLE situaci
     * @param {Array} dice - Kostky
     */
    handleFarkle(dice) {
        // OCHRANA PROTI DUPLICITNÍM VOLÁNÍM
        const currentState = gameState.getState();
        if (currentState.isFarkleProcessing) {
            console.log('⚠️ Farkle už se zpracovává, ignoruji duplicitní volání');
            return;
        }

        // Označíme, že zpracováváme farkle
        gameState.updateState({ isFarkleProcessing: true });

        const farkleMsg = '💥 FARKLE!';
        console.warn(farkleMsg);
        chatSystem.addSystemMessage(farkleMsg, CHAT_COLORS.RED);
        
        // Přidáme farkle animaci ke kostkám
        setTimeout(() => {
            const diceElements = document.querySelectorAll('.dice:not(.saved)');
            diceElements.forEach(el => el.classList.add('dice-farkle'));
            
            setTimeout(() => {
                diceElements.forEach(el => el.classList.remove('dice-farkle'));
            }, 1200);
        }, 200);
        
        // Automaticky ukončíme tah s farkle
        setTimeout(() => {
            this.endTurn(true);
        }, 1500);
    }

    /**
     * Přidá spawn animaci ke kostkám
     */
    addSpawnAnimation() {
        setTimeout(() => {
            const diceElements = document.querySelectorAll('.dice:not(.saved)');
            diceElements.forEach(el => {
                el.classList.add('dice-new');
            });
            
            // Odstraníme třídu po animaci
            setTimeout(() => {
                diceElements.forEach(el => el.classList.remove('dice-new'));
            }, 800);
        }, 50);
    }

    /**
     * Odloží vybrané kostky - přesune je z aktuálního hodu do odložených
     * PŘESUNUTO Z gameUI.js
     */
    saveDice() {
        console.log('💾 SAVE DEBUG - saveDice() zavolána, call count:', (this.saveCount = (this.saveCount || 0) + 1));
        const state = gameState.getState();
        
        if (!state.selectedDice || state.selectedDice.length === 0) {
            const warningMsg = '⚠️ Vyberte kostky k odložení!';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        if (!state.currentRoll || state.currentRoll.length === 0) {
            const warningMsg = '⚠️ Nejsou žádné kostky k odložení';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        // Získáme hodnoty vybraných kostek
        const savedDiceValues = state.selectedDice.map(index => state.currentRoll[index]);
        
        // VALIDACE: Zkontroluj, zda jsou kostky podle pravidel Farkle
        if (!isValidFarkleCombination(savedDiceValues)) {
            const warningMsg = '⚠️ NEPLATNÁ KOMBINACE! Můžete odložit pouze: jedničky, pětky nebo trojice a více stejných čísel (2,3,4,6).';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        // Spočítáme body z vybraných kostek
        const points = calculatePoints(savedDiceValues);
        
        // Přidáme animaci skórování
        this.addScoringAnimation();
        
        // Aktualizujeme stav
        this.updateSavedDice(savedDiceValues, points);
    }

    /**
     * Přidá animaci skórování k vybraným kostkám
     */
    addScoringAnimation() {
        const selectedElements = document.querySelectorAll('.dice.selected');
        selectedElements.forEach(el => {
            el.classList.add('dice-scoring');
            setTimeout(() => {
                el.classList.remove('dice-scoring');
            }, 1500);
        });
    }

    /**
     * Aktualizuje stav odložených kostek
     * @param {Array} savedDiceValues - Hodnoty odložených kostek
     * @param {number} points - Body z odložených kostek
     */
    updateSavedDice(savedDiceValues, points) {
        const state = gameState.getState();
        
        // Aktualizujeme stav - přidáme odložené kostky a odstraníme vybrané z currentRoll
        const newSavedDice = [...(state.savedDice || []), ...savedDiceValues];
        const newSavedPoints = calculatePoints(newSavedDice);
        
        // Vytvoříme nový currentRoll bez vybraných kostek
        const remainingDice = state.currentRoll.filter((die, index) => !state.selectedDice.includes(index));
        
        console.log(`💾 Odkládám kostky: [${savedDiceValues.join(', ')}] = ${points} bodů`);
        console.log(`📊 Celkem odloženo: [${newSavedDice.join(', ')}] = ${newSavedPoints} bodů`);
        console.log(`🎲 Zbývající kostky k hodu: ${remainingDice.length}`);
        
        // ZKRÁCENO: Jen podstatné info, ne duplikáty
        chatSystem.addSystemMessage(`� +${points} = ${newSavedPoints} bodů`, CHAT_COLORS.BLUE);
        
        // Kontrola hot dice
        this.checkHotDice(newSavedDice, newSavedPoints, remainingDice);
    }

    /**
     * Kontroluje a zpracovává Hot Dice situaci
     * @param {Array} newSavedDice - Všechny odložené kostky
     * @param {number} newSavedPoints - Body z odložených kostek
     * @param {Array} remainingDice - Zbývající kostky
     */
    checkHotDice(newSavedDice, newSavedPoints, remainingDice) {
        const state = gameState.getState();
        
        if (newSavedDice.length >= 6 && remainingDice.length === 0) {
            // ÚSPĚCH! Všech 6 kostek odloženo - HOT DICE!
            chatSystem.addSystemMessage(`🎯 HOT DICE! +${newSavedPoints}`, CHAT_COLORS.GREEN);
            
            // HOT DICE - akumulujeme body a resetujeme kostky pro nový hod
            gameState.updateState({ 
                turnScore: (state.turnScore || 0) + newSavedPoints, // Akumulujeme body
                savedDice: [], // VYMAŽEME odložené kostky - hot dice reset
                selectedDice: [],
                currentRoll: [] // Prázdné pro umožnění nového hodu všemi kostkami
            });
        } else if (remainingDice.length > 0) {
            // ODSTRANĚNO: Zpráva o zbývajících kostkách - zbytečná
            
            console.log(`🔄 SAVE DEBUG - Aktualizuji stav: savedDice: [${newSavedDice.join(',')}], selectedDice: [], currentRoll: [${remainingDice.join(',')}]`);
            
            gameState.updateState({ 
                savedDice: newSavedDice,
                selectedDice: [],
                currentRoll: remainingDice
            });
        } else {
            chatSystem.addSystemMessage(`🎯 Všechny kostky odloženy! Můžete hodit všech 6 kostek znovu.`, CHAT_COLORS.GREEN);
            
            gameState.updateState({ 
                savedDice: newSavedDice,
                selectedDice: [],
                currentRoll: [] // Prázdné pole pro nový hod
            });
        }
    }

    /**
     * Ukončí aktuální tah
     * PŘESUNUTO Z gameUI.js
     * @param {boolean} isFarkle - Pokud true, jedná se o farkle
     */
    endTurn(isFarkle = false) {
        const state = gameState.getState();
        
        // Kontrola, zda hráč má body k ukončení tahu (kromě farkle)
        const hasSavedDice = state.savedDice && state.savedDice.length > 0;
        const hasTurnScore = state.turnScore && state.turnScore > 0;
        
        if (!isFarkle && !hasSavedDice && !hasTurnScore) {
            const warningMsg = '⚠️ POZOR: Nemůžete ukončit tah bez odložených kostek nebo bodů! Nejdříve odložte bodující kostky.';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
            return;
        }
        
        console.log(isFarkle ? '💥 Ukončuji tah s FARKLE...' : '⏭️ Ukončuji tah...');
        
        const result = this.calculateTurnResult(isFarkle);
        this.updatePlayerScore(result);
        this.checkVictory(result.player);
        this.switchToNextPlayer();
    }

    /**
     * Vypočítá výsledek tahu
     * @param {boolean} isFarkle - Zda je to farkle
     * @returns {Object} Výsledek tahu
     */
    calculateTurnResult(isFarkle) {
        const state = gameState.getState();
        const players = [...state.players];
        const currentPlayer = players[state.currentPlayerIndex];
        
        let points = 0;
        const oldScore = currentPlayer.score;
        
        if (!isFarkle) {
            // Normální ukončení tahu - přidáme body z odložených kostek PLUS akumulované body z hot dice
            const savedDicePoints = calculatePoints(state.savedDice || []);
            const turnScorePoints = state.turnScore || 0;
            points = savedDicePoints + turnScorePoints;
            
            // KONTROLA MINIMÁLNÍHO SKÓRE: První zápis musí být min. 300 bodů
            if (currentPlayer.score === 0 && points < 300) {
                const warningMsg = `⚠️ POZOR: První zápis musí být minimálně 300 bodů! Máte jen ${points} bodů. Pokračujte v tahu nebo riskujte!`;
                console.warn(warningMsg);
                chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.RED);
                return null; // Neukončuj tah
            }
            
            currentPlayer.score += points;
            this.logTurnResult(currentPlayer, state, points, oldScore);
        } else {
            // FARKLE - žádné body se nepřidají
            console.log(`💥 FARKLE pro hráče ${currentPlayer.name} - žádné body!`);
            // ODSTRANĚNO: Zbytečná duplikace farkle zprávy
        }
        
        return { player: currentPlayer, points, oldScore, players, isFarkle };
    }

    /**
     * Zaloguje výsledek tahu
     */
    logTurnResult(currentPlayer, state, points, oldScore) {
        const savedDicePoints = calculatePoints(state.savedDice || []);
        const turnScorePoints = state.turnScore || 0;
        
        console.log(`📊 Hráč ${currentPlayer.name}:`);
        console.log(`   • Odložené kostky: [${state.savedDice ? state.savedDice.join(', ') : 'žádné'}] = ${savedDicePoints} bodů`);
        console.log(`   • Hot dice body: ${turnScorePoints} bodů`);
        console.log(`   • Celkem získané body: ${points}`);
        console.log(`   • Skóre: ${oldScore} → ${currentPlayer.score}`);
        
        if (turnScorePoints > 0 && savedDicePoints > 0) {
            chatSystem.addSystemMessage(`📊 ${currentPlayer.name}: +${points} bodů`);
        } else if (turnScorePoints > 0) {
            chatSystem.addSystemMessage(`📊 ${currentPlayer.name}: +${points} bodů`);
        } else {
            chatSystem.addSystemMessage(`📊 ${currentPlayer.name}: +${points} bodů`);
        }
        chatSystem.addSystemMessage(`🎯 ${currentPlayer.name}: ${currentPlayer.score}`, CHAT_COLORS.BLUE);
    }

    /**
     * Aktualizuje skóre hráče
     */
    updatePlayerScore(result) {
        if (!result) return;
        
        gameState.updateState({
            players: result.players,
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0 // Reset turn score pro nového hráče
        });
    }

    /**
     * Kontroluje vítězství a spravuje finální kolo
     */
    checkVictory(player) {
        const state = gameState.getState();
        
        if (player.score >= state.targetScore) {
            if (!state.finalRound) {
                // První hráč dosáhl cílového skóre - začíná finální kolo
                const finalRoundMsg = `🚨 FINÁLNÍ KOLO! ${player.name} dosáhl ${state.targetScore} bodů. Ostatní hráči mají ještě jeden tah!`;
                console.log(finalRoundMsg);
                chatSystem.addSystemMessage(finalRoundMsg, CHAT_COLORS.ORANGE);
                
                gameState.updateState({ 
                    finalRound: true,
                    finalRoundLeader: player.name,
                    finalRoundStartPlayerIndex: state.currentPlayerIndex
                });
            } else {
                // Finální kolo už běží - zkontroluj jestli všichni dostali šanci
                this.checkFinalRoundCompletion();
            }
        } else if (state.finalRound) {
            // Finální kolo běží, zkontroluj dokončení
            this.checkFinalRoundCompletion();
        }
    }

    /**
     * Kontroluje, zda je finální kolo dokončeno
     */
    checkFinalRoundCompletion() {
        const state = gameState.getState();
        
        if (!state.finalRound) return;
        
        // Zkontroluj, zda jsme dokončili celé kolo (všichni hráči měli šanci)
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        
        if (nextPlayerIndex === state.finalRoundStartPlayerIndex) {
            // Finální kolo dokončeno - najdi vítěze
            this.endGame();
        }
    }

    /**
     * Ukončí hru a vyhlásí vítěze
     */
    endGame() {
        const state = gameState.getState();
        
        // Najdi hráče s nejvyšším skóre
        const winner = state.players.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current);
        
        const victoryMsg = `🏆 KONEC HRY! ${winner.name} vyhrává s ${winner.score} body!`;
        console.log(victoryMsg);
        chatSystem.addSystemMessage(victoryMsg, CHAT_COLORS.GREEN);
        
        // Zobraz finální skóre všech hráčů
        const scoreMsg = `📊 Finální skóre: ${state.players.map(p => `${p.name}: ${p.score}`).join(', ')}`;
        chatSystem.addSystemMessage(scoreMsg, CHAT_COLORS.BLUE);
        
        gameState.updateState({ gamePhase: 'gameover' });
    }

    /**
     * Přepne na dalšího hráče
     */
    switchToNextPlayer() {
        const state = gameState.getState();
        if (state.gamePhase === 'gameover') return; // Hra skončila
        
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        const nextPlayer = state.players[nextPlayerIndex];
        
        console.log(`👤 Další hráč: ${nextPlayer.name}`);
        
        if (state.finalRound) {
            chatSystem.addSystemMessage(`👤 ${nextPlayer.name}`, CHAT_COLORS.ORANGE);
        } else {
            // ODSTRANĚNO: Systémová zpráva o dalším hráči - zbytečná, vidí se v UI
        }
        
        gameState.updateState({
            currentPlayerIndex: nextPlayerIndex,
            // Reset stavů pro nový tah
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0,
            isFarkleProcessing: false,
            isRolling: false
        });
        
        // Po přepnutí hráče zkontroluj finální kolo
        if (state.finalRound) {
            this.checkFinalRoundCompletion();
        }
    }
}
