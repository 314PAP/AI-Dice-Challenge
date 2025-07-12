/**
 * AI Player Controller - Automatické hraní za AI hráče
 * 
 * OBSAH MODULU:
 * - Automatické hraní za AI hráče
 * - AI rozhodování o dalších tazích
 * - Vyhodnocování nejlepších kombinací
 * - AI reakce na herní události
 * - Simulace lidského hraní (delay, komentáře)
 * 
 * FUNKCE PŘESUNUTÉ Z gameUI.js:
 * - playAiTurn() - automatické hraní AI
 * - makeAiDecision() - rozhodování AI
 * - findBestDiceToSave() - hledání nejlepších kostek
 * - triggerAiReactions() - reakce AI na události
 */

/**
 * SEZNAM POUŽÍVANÝCH CSS TŘÍD:
 * Bootstrap: (žádné přímé CSS třídy - AI logika)
 * Neon třídy: (žádné - čistá AI logika)  
 * Vlastní: (žádné - logika bez UI)
 */

/**
 * SEZNAM PROMĚNNÝCH (lokální v metodách):
 * state, attempts, maxAttempts, currentState, hasScoring, decision, selectedValues, points, bestDice, currentTurnPoints,
 * newPoints, totalPoints, riskFactor, diceRisk, pointsRisk, combinations, aPointsPerDie, bPointsPerDie, used, counts
 * 
 * MOŽNÉ DUPLICITY: 
 * - state/currentState (používá se ve více metodách - OK, lokální scope)
 * - points (používá se v executeAiAction a findBestDiceToSave)
 * - combinations (používá se v findBestDiceToSave a findAllValidCombinations)
 */

import { calculatePoints, hasScoringDice } from '../game/diceMechanics.js';
import gameState from '../game/gameState.js';
import chatSystem from './chatSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';

export class AiPlayerController {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
    }

    /**
     * Hraje automatický tah za AI hráče
     * PŘESUNUTO Z gameUI.js
     * @param {Object} aiPlayer - AI hráč na tahu
     */
    async playAiTurn(aiPlayer) {
        console.log(`🤖 AiController: ${aiPlayer.name} hraje automaticky...`);
        // ODSTRANĚNO: Systémová zpráva "přemýšlí" - ruší AI chat
        
        const state = gameState.getState();
        
        // Pokud AI není na tahu, ukončíme
        if (state.players[state.currentPlayerIndex].name !== aiPlayer.name) {
            console.warn('⚠️ AI není na tahu!');
            return;
        }
        
        try {
            // Pokud nejsou kostky na stole, začneme hodem
            if (!state.currentRoll || state.currentRoll.length === 0) {
                await this.delay(1000);
                chatSystem.addAiMessage(aiPlayer.name, "Začínám tah! 🎲");
                await this.gameLogic.rollDice();
                await this.delay(3000); // Delší čekání po hodu
            }
            
            // AI rozhodování loop
            await this.aiDecisionLoop(aiPlayer);
            
        } catch (error) {
            console.error('❌ Chyba v AI tahu:', error);
            // Backup - ukončíme tah pokud se něco pokazí
            this.gameLogic.endTurn();
        }
    }

    /**
     * Hlavní smyčka rozhodování AI
     * @param {Object} aiPlayer - AI hráč
     */
    async aiDecisionLoop(aiPlayer) {
        let attempts = 0;
        const maxAttempts = 10; // Ochrana proti nekonečné smyčce
        
        while (attempts < maxAttempts) {
            attempts++;
            const currentState = gameState.getState();
            
            // KONTROLA ZRUŠENÉHO TAHU - pokud se zpracovává farkle, ukončíme
            if (currentState.isFarkleProcessing) {
                console.log(`🤖 AI ${aiPlayer.name} - farkle se už zpracovává, ukončuji rozhodování`);
                break;
            }
            
            // Kontrola, zda je AI stále na tahu
            if (currentState.players[currentState.currentPlayerIndex].name !== aiPlayer.name) {
                console.log(`🤖 AI ${aiPlayer.name} už není na tahu, ukončuji rozhodování`);
                break;
            }
            
            // Pokud není co odložit a nejsou ani odložené kostky ani turnScore, může to být konec tahu
            if (!currentState.currentRoll || currentState.currentRoll.length === 0) {
                // Kontrola HOT DICE - pokud máme turnScore ale žádné kostky, znamená to HOT DICE reset
                if (currentState.turnScore > 0) {
                    console.log(`🤖 AI ${aiPlayer.name} má HOT DICE (turnScore: ${currentState.turnScore}), házím znovu všemi kostkami`);
                    // Ještě jednou zkontrolujeme, že AI je stále na tahu před HOT DICE hodem
                    const recentState = gameState.getState();
                    if (recentState.players[recentState.currentPlayerIndex].name === aiPlayer.name) {
                        this.gameLogic.rollDice();
                        await this.delay(3000); // Čekáme na dokončení animace
                        continue; // Pokračujeme v rozhodování
                    } else {
                        console.log(`🤖 AI ${aiPlayer.name} už není na tahu během HOT DICE, ukončuji rozhodování`);
                        break;
                    }
                } else {
                    console.log(`🤖 AI ${aiPlayer.name} nemá kostky na stole, ukončuji rozhodování`);
                    break;
                }
            }
            
            // KONTROLA FARKLE - pokud jsou na stole kostky, ale žádné nejsou bodující
            if (currentState.currentRoll && currentState.currentRoll.length > 0) {
                console.log(`🎲 AI ${aiPlayer.name} kontroluje FARKLE na kostkách:`, currentState.currentRoll);
                const hasScoring = hasScoringDice(currentState.currentRoll);
                console.log(`🎲 hasScoringDice(${JSON.stringify(currentState.currentRoll)}) =`, hasScoring);
                
                if (!hasScoring) {
                    console.log(`🤖 AI ${aiPlayer.name} detekoval FARKLE - spouštím handleFarkle() pro automatické zpracování`);
                    chatSystem.addAiMessage(aiPlayer.name, "Oh ne, FARKLE! 💥😱");
                    
                    // FORCE spuštění handleFarkle() pro zpracování FARKLE - s kontrolou, zda je AI stále na tahu
                    setTimeout(() => {
                        const currentState = gameState.getState();
                        if (currentState.players[currentState.currentPlayerIndex].name === aiPlayer.name) {
                            this.gameLogic.handleFarkle(currentState.currentRoll);
                        } else {
                            console.log(`🤖 AI ${aiPlayer.name} už není na tahu, nebudu volat handleFarkle()`);
                        }
                    }, 1000); // Krátké zpoždění pro lepší UX
                    
                    console.log(`🤖 AI ${aiPlayer.name} ukončuje rozhodování - FARKLE bude zpracován`);
                    return; // UKONČUJEME CELOU FUNKCI, NE POUZE SMYČKU!
                } else {
                    console.log(`✅ AI ${aiPlayer.name} našel bodující kostky, pokračuje...`);
                }
            }
            
            // AI rozhodování
            const decision = this.makeAiDecision(aiPlayer, currentState);
            
            if (decision.action === 'save') {
                const result = await this.executeSaveDecision(aiPlayer, decision, currentState);
                if (result === 'endTurn') {
                    break; // Ukončit smyčku - tah je dokončen
                } else if (result === 'continue') {
                    continue; // Pokračovat ve smyčce - AI už hodil
                }
                // Jinak pokračovat normálně ve smyčce
            } else if (decision.action === 'endTurn') {
                await this.executeEndTurnDecision(aiPlayer);
                break;
            } else if (decision.action === 'continue') {
                await this.executeContinueDecision(aiPlayer);
            } else {
                console.warn('⚠️ AI nerozpoznalo akci, ukončuji tah');
                this.gameLogic.endTurn();
                break;
            }
            
            await this.delay(1500); // Pauza mezi akcemi
        }
        
        if (attempts >= maxAttempts) {
            console.warn('⚠️ AI dosáhlo maximálního počtu pokusů');
            this.gameLogic.endTurn();
        }
    }

    /**
     * Provede rozhodnutí o odložení kostek
     * @param {Object} aiPlayer - AI hráč
     * @param {Object} decision - Rozhodnutí AI
     * @param {Object} currentState - Aktuální stav
     */
    async executeSaveDecision(aiPlayer, decision, currentState) {
        console.log(`🤖 AI ${aiPlayer.name} vybírá kostky:`, decision.diceToSave);
        gameState.updateState({ selectedDice: decision.diceToSave });
        await this.delay(500);
        
        const selectedValues = decision.diceToSave.map(i => currentState.currentRoll[i]);
        const points = calculatePoints(selectedValues);
        
        chatSystem.addAiMessage(aiPlayer.name, `Odkládám kostky [${selectedValues.join(', ')}] za ${points} bodů! 💎`);
        
        this.gameLogic.saveDice();
        await this.delay(1000);
        
        // ZPRACOVÁNÍ NEXT ACTION - co dělat po uložení kostek
        if (decision.nextAction === 'endTurn') {
            console.log(`🤖 AI ${aiPlayer.name} rozhodl ukončit tah po uložení kostek`);
            await this.executeEndTurnDecision(aiPlayer);
            return 'endTurn'; // Signál pro ukončení smyčky
        } else if (decision.nextAction === 'continue') {
            console.log(`🤖 AI ${aiPlayer.name} rozhodl pokračovat v házení`);
            await this.executeContinueDecision(aiPlayer);
            return 'continue'; // Signál pro pokračování
        }
        
        return 'save'; // Pouze uložení, pokračovat v rozhodování
    }

    /**
     * Provede rozhodnutí o ukončení tahu
     * @param {Object} aiPlayer - AI hráč
     */
    async executeEndTurnDecision(aiPlayer) {
        chatSystem.addAiMessage(aiPlayer.name, "Ukončuji tah. Solidní výsledek! ✅");
        await this.delay(1000);
        this.gameLogic.endTurn();
    }

    /**
     * Provede rozhodnutí o pokračování
     * @param {Object} aiPlayer - AI hráč
     */
    async executeContinueDecision(aiPlayer) {
        // Zkontrolujeme, že AI je stále na tahu před pokračováním
        const currentState = gameState.getState();
        if (currentState.players[currentState.currentPlayerIndex].name !== aiPlayer.name) {
            console.log(`🤖 AI ${aiPlayer.name} už není na tahu, nemohu pokračovat`);
            return;
        }
        
        chatSystem.addAiMessage(aiPlayer.name, "Zkusím hodit znovu! 🎯");
        await this.delay(1000);
        await this.gameLogic.rollDice();
        await this.delay(3000);
    }

    /**
     * AI rozhodování o dalším tahu
     * PŘESUNUTO Z gameUI.js
     * @param {Object} aiPlayer - AI hráč
     * @param {Object} state - Aktuální herní stav
     * @returns {Object} Rozhodnutí AI
     */
    makeAiDecision(aiPlayer, state) {
        // Jednoduchá AI logika - odložit nejlepší kostky, pak rozhodnout
        const bestDice = this.findBestDiceToSave(state.currentRoll);
        
        if (bestDice.length === 0) {
            // Žádné validní kostky - bude farkle
            return { action: 'wait' }; // Počkáme, až se farkle zpracuje automaticky
        }
        
        // Spočítáme aktuální body v tahu
        const currentTurnPoints = calculatePoints(state.savedDice || []) + (state.turnScore || 0);
        const newPoints = calculatePoints(bestDice.map(i => state.currentRoll[i]));
        const totalPoints = currentTurnPoints + newPoints;
        
        // DŮLEŽITÉ: Pokud je to první zápis a nemáme dost bodů, MUSÍME pokračovat
        if (aiPlayer.score === 0 && totalPoints < 300) {
            console.log(`🤖 AI ${aiPlayer.name}: První zápis, potřebuji min 300 bodů (mám ${totalPoints})`);
            return { action: 'save', diceToSave: bestDice, nextAction: 'continue' };
        }
        
        // AI rozhodování podle získaných bodů a risk/reward
        if (totalPoints >= 300) {
            // Máme solidní body
            const riskFactor = this.calculateRiskFactor(state.currentRoll.length, totalPoints);
            
            if (riskFactor > 0.7 || totalPoints >= 600) {
                // Vysoké riziko nebo dostatečné body - ukončíme tah
                console.log(`🤖 AI ${aiPlayer.name}: Mám ${totalPoints} bodů, riziko ${riskFactor.toFixed(2)} - ukončuji tah`);
                return { action: 'save', diceToSave: bestDice, nextAction: 'endTurn' };
            } else {
                // Střední riziko - odložíme a pokračujeme
                console.log(`🤖 AI ${aiPlayer.name}: Mám ${totalPoints} bodů, riziko ${riskFactor.toFixed(2)} - pokračuji`);
                return { action: 'save', diceToSave: bestDice, nextAction: 'continue' };
            }
        } else {
            // Málo bodů - musíme riskovat
            console.log(`🤖 AI ${aiPlayer.name}: Pouze ${totalPoints} bodů - musím riskovat`);
            return { action: 'save', diceToSave: bestDice, nextAction: 'continue' };
        }
    }

    /**
     * Vypočítá rizikový faktor pro AI rozhodování
     * @param {number} remainingDice - Počet zbývajících kostek
     * @param {number} currentPoints - Aktuální body
     * @returns {number} Rizikový faktor 0-1
     */
    calculateRiskFactor(remainingDice, currentPoints) {
        // Čím méně kostek, tím vyšší riziko
        const diceRisk = (6 - remainingDice) / 6;
        
        // Čím více bodů máme, tím je škoda o ně přijít
        const pointsRisk = Math.min(currentPoints / 1000, 1);
        
        return (diceRisk + pointsRisk) / 2;
    }

    /**
     * Najde nejlepší kostky k odložení
     * PŘESUNUTO Z gameUI.js
     * @param {Array} dice - Kostky na stole
     * @returns {Array} Indexy nejlepších kostek
     */
    findBestDiceToSave(dice) {
        if (!dice || dice.length === 0) return [];
        
        const combinations = this.findAllValidCombinations(dice);
        
        if (combinations.length === 0) return [];
        
        // Seřadíme kombinace podle hodnoty bodů na kostku
        combinations.sort((a, b) => {
            const aPointsPerDie = a.points / a.indices.length;
            const bPointsPerDie = b.points / b.indices.length;
            return bPointsPerDie - aPointsPerDie;
        });
        
        // Vrátíme nejlepší kombinaci
        return combinations[0].indices;
    }

    /**
     * Najde všechny platné kombinace v hodu
     * @param {Array} dice - Kostky na stole
     * @returns {Array} Pole kombinací s body a indexy
     */
    findAllValidCombinations(dice) {
        const combinations = [];
        const used = new Array(dice.length).fill(false);
        
        // Najdeme všechny stejné hodnoty a jejich počty
        const counts = {};
        dice.forEach((die, index) => {
            if (!counts[die]) counts[die] = [];
            counts[die].push(index);
        });
        
        // Kontrolujeme trojice a více (2,3,4,6)
        for (const value of [2, 3, 4, 6]) {
            if (counts[value] && counts[value].length >= 3) {
                const points = this.calculateMultiplePoints(value, counts[value].length);
                combinations.push({
                    points: points,
                    indices: [...counts[value]],
                    type: `${counts[value].length}x${value}`
                });
            }
        }
        
        // Kontrolujeme trojice a více jedniček (speciální pravidlo)
        if (counts[1] && counts[1].length >= 3) {
            const points = this.calculateMultiplePoints(1, counts[1].length);
            combinations.push({
                points: points,
                indices: [...counts[1]],
                type: `${counts[1].length}x1`
            });
        }
        
        // Jednotlivé jedničky (100 bodů)
        if (counts[1]) {
            for (let i = 0; i < Math.min(counts[1].length, 2); i++) { // Max 2 jednotlivé
                combinations.push({
                    points: 100,
                    indices: [counts[1][i]],
                    type: '1x1'
                });
            }
        }
        
        // Jednotlivé pětky (50 bodů)
        if (counts[5]) {
            for (let i = 0; i < Math.min(counts[5].length, 2); i++) { // Max 2 jednotlivé
                combinations.push({
                    points: 50,
                    indices: [counts[5][i]],
                    type: '1x5'
                });
            }
        }
        
        return combinations.filter(combo => combo.points > 0);
    }

    /**
     * Vypočítá body pro více stejných kostek
     * @param {number} value - Hodnota kostky
     * @param {number} count - Počet kostek
     * @returns {number} Body
     */
    calculateMultiplePoints(value, count) {
        if (count < 3) return 0;
        
        const basePoints = value === 1 ? 1000 : value * 100;
        const multipliers = [0, 0, 0, 1, 2, 4, 8]; // index = počet kostek
        
        return basePoints * (multipliers[count] || 8);
    }

    /**
     * Vyvolá AI reakce na herní událost
     * PŘESUNUTO Z gameUI.js
     * @param {string} eventType - Typ události ('roll', 'save', 'endTurn', 'farkle')
     * @param {Object} eventData - Data o události
     */
    triggerAiReactions(eventType, eventData = {}) {
        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        // POUZE pro lidského hráče - AI nekomentuje své vlastní tahy
        if (!currentPlayer.isHuman) {
            console.log(`🤖 AI reakce přeskočeny - na tahu je AI hráč ${currentPlayer.name}`);
            return;
        }
        
        // Získáme AI hráče (všichni kromě aktuálního)
        const aiPlayers = state.players.filter(player => !player.isHuman);
        
        // Náhodně vybereme 1 AI pro reakci (ne všichni najednou)
        const reactingAI = aiPlayers
            .sort(() => Math.random() - 0.5)
            .slice(0, 1);
        
        // Reakce s prodlevou pro realističnost
        reactingAI.forEach((aiPlayer, index) => {
            setTimeout(() => {
                const reaction = this.generateReaction(eventType, eventData, currentPlayer, aiPlayer);
                chatSystem.addAiMessage(aiPlayer.name, reaction);
            }, (index + 1) * 1000);
        });
    }

    /**
     * Generuje reakci AI na událost
     * @param {string} eventType - Typ události
     * @param {Object} eventData - Data události
     * @param {Object} currentPlayer - Aktuální hráč
     * @param {Object} aiPlayer - AI hráč reagující
     * @returns {string} Reakce AI
     */
    generateReaction(eventType, eventData, currentPlayer, aiPlayer) {
        const reactions = {
            roll: [
                `Pěkný hod, ${currentPlayer.name}! 🎲`,
                `Zajímavé kostky na stole! 🤔`,
                `Co si z toho vybereš? 👀`
            ],
            farkle: [
                `Ouch! To bolí! 💥`,
                `Farkle! Smůla ${currentPlayer.name}! 😅`,
                `Riziko se nevyplatilo! 🤷‍♂️`
            ],
            save: [
                `Dobrá volba! 👍`,
                `Solidní taktika! 💡`,
                `Zajímavé rozhodnutí! 🎯`
            ],
            endTurn: [
                `Bezpečná hra! ✅`,
                `Moudré ukončení! 🧠`,
                `${eventData.points} bodů - není špatné! 📊`
            ]
        };
        
        const possibleReactions = reactions[eventType] || [`Zajímavý tah, ${currentPlayer.name}! 🎮`];
        return possibleReactions[Math.floor(Math.random() * possibleReactions.length)];
    }

    /**
     * Pomocná funkce pro zpoždění
     * @param {number} ms - Milisekundy
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
