import { calculatePoints, hasScoringDice } from '../game/diceMechanics.js';
import gameState from '../game/gameState.js';
import chatSystem from './chatSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';
import { AiDecisionEngine } from './aiDecisionEngine.js';
import { AiStrategies } from './aiStrategies.js';

export class AiPlayerController {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.decisionEngine = new AiDecisionEngine();
        this.strategies = new AiStrategies();
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
        
        // Speciální zpráva pro HOT DICE (všechny kostky odloženy)
        if (decision.diceToSave.length === currentState.currentRoll.length) {
            chatSystem.addAiMessage(aiPlayer.name, `🔥 HOT DICE! Odložím všechny kostky [${selectedValues.join(', ')}] za ${points} bodů! Házím znovu se všemi kostkami! 🎲🔥`);
        } else {
            chatSystem.addAiMessage(aiPlayer.name, `Odkládám kostky [${selectedValues.join(', ')}] za ${points} bodů! 💎`);
        }
        
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
     * AI rozhodování o dalším tahu - deleguje na AiDecisionEngine
     * @param {Object} aiPlayer - AI hráč
     * @param {Object} state - Aktuální herní stav
     * @returns {Object} Rozhodnutí AI
     */
    makeAiDecision(aiPlayer, state) {
        return this.decisionEngine.makeDecision(aiPlayer, state);
    }

    /**
     * Analyzuje herní situaci - deleguje na AiStrategies
     */
    analyzeGameSituation(aiPlayer, state, turnPoints) {
        return this.strategies.analyzeGameSituation(aiPlayer, state, turnPoints);
    }
            }
        }
        
        return {
            gamePhase,
            myPosition,
            gap,
            riskTolerance,
            remainingDice: state.currentRoll?.length || 6,
            turnPoints
        };
    }

    /**
     * Určí fázi hry - deleguje na AiStrategies
     */
    determineGamePhase(myScore, leadingScore, targetScore) {
        return this.strategies.determineGamePhase(myScore, leadingScore, targetScore);
    }

    /**
     * Učiní strategické rozhodnutí - deleguje na AiStrategies
     */
    makeStrategicDecision(aiPlayer, strategy, bestDice, totalPoints) {
        return this.strategies.makeStrategicDecision(aiPlayer, strategy, bestDice, totalPoints);
    }
    /**
     * Vypočítá riziko FARKLE - deleguje na AiStrategies
     */
    calculateFarkleRisk(remainingDice) {
        return this.strategies.calculateFarkleRisk(remainingDice);
    }

    /**
     * Oznámí rozhodnutí AI - deleguje na AiStrategies
     */
    announceDecision(aiPlayer, decision, totalPoints, strategy) {
        return this.strategies.announceDecision(aiPlayer, decision, totalPoints, strategy);
    }

    /**
     * Vypočítá rizikový faktor - deleguje na AiStrategies
     */
    calculateRiskFactor(remainingDice, currentPoints) {
        return this.strategies.calculateRiskFactor(remainingDice, currentPoints);
    }

    /**
     * Najde nejlepší kostky k odložení - deleguje na AiDecisionEngine
     */
    findBestDiceToSave(dice) {
        return this.decisionEngine.findBestDiceToSave(dice);
    }
    /**
     * Najde všechny platné kombinace - deleguje na AiDecisionEngine
     */
    findAllValidCombinations(dice) {
        return this.decisionEngine.findAllValidCombinations(dice);
    }

    /**
     * Vypočítá body pro více stejných kostek - deleguje na AiDecisionEngine
     */
    calculateMultiplePoints(value, count) {
        return this.decisionEngine.calculateMultiplePoints(value, count);
    }

    /**
     * Vyvolá AI reakce na herní událost
     * @param {string} eventType - Typ události
     * @param {Object} eventData - Data o události
     */
    triggerAiReactions(eventType, eventData = {}) {
        const state = gameState.getState();
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        // POUZE pro lidského hráče
        if (!currentPlayer.isHuman) return;
        
        const aiPlayers = state.players.filter(player => !player.isHuman);
        const reactingAI = aiPlayers.sort(() => Math.random() - 0.5).slice(0, 1);
        
        reactingAI.forEach((aiPlayer, index) => {
            setTimeout(() => {
                const reaction = this.generateReaction(eventType, eventData, currentPlayer, aiPlayer);
                chatSystem.addAiMessage(aiPlayer.name, reaction);
            }, (index + 1) * 1000);
        });
    }

    /**
     * Generuje reakci AI na událost
     */
    generateReaction(eventType, eventData, currentPlayer, aiPlayer) {
        const reactions = {
            roll: [`Pěkný hod, ${currentPlayer.name}! 🎲`, `Zajímavé kostky! 🤔`],
            farkle: [`Ouch! To bolí! 💥`, `Farkle! Smůla! 😅`],
            save: [`Dobrá volba! 👍`, `Solidní taktika! 💡`],
            endTurn: [`Bezpečná hra! ✅`, `${eventData.points} bodů - není špatné! 📊`]
        };
        
        const possibleReactions = reactions[eventType] || [`Zajímavý tah! 🎮`];
        return possibleReactions[Math.floor(Math.random() * possibleReactions.length)];
    }

    /**
     * Pomocná funkce pro zpoždění
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
