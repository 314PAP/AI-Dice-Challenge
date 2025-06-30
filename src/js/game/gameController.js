/**
 * Game Controller
 * Hlavní řídící logika hry
 */

import { gameState, resetGameState, nextPlayer, getCurrentPlayer, checkForWinner } from './gameState.js';
import { rollDice, calculateScore, hasScoringDice, validateDiceSelection, findBestScoringCombination } from './diceLogic.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer } from '../ui/gameUI.js';
import { enhancedAI } from '../ai/enhancedAIController.js';
import { playAITurn } from '../ai/aiPlayer.js';
import { saveGameResult, displayHallOfFame, createGameResult } from '../utils/hallOfFame.js';

/**
 * Inicializuje herní logiku
 */
export function initializeGame() {
    console.log('🎮 Inicializace herní logiky...');
    updateScoreboard();
    updateGameDisplay();
}

/**
 * Spustí novou hru
 */
export function startGame() {
    console.log('🎮 Spouštím hru...');
    const targetScoreInput = document.getElementById('targetScoreInput');
    gameState.targetScore = parseInt(targetScoreInput.value);
    gameState.gameStarted = true;
    gameState.gameStartTime = new Date(); // Nastavit čas začátku hry
     // Aktualizovat target score display
    const targetScoreDisplay = document.getElementById('targetScoreDisplay');
    if (targetScoreDisplay) {
        targetScoreDisplay.textContent = gameState.targetScore;
    }

    document.getElementById('targetScoreSetup').style.display = 'none';
    document.getElementById('gameControls').style.display = 'block';
    console.log('✅ Zobrazeny herní ovládací prvky');

    window.addChatMessage('system', `🎮 Hra začala! První hráč, který dosáhne ${gameState.targetScore} bodů, vyhrává!`);
    
    // AI starting messages
    const aiTypes = ['gemini', 'chatgpt', 'claude'];
    aiTypes.forEach((aiType, index) => {
        setTimeout(() => {
            const reaction = enhancedAI.generateAIResponse(aiType, 'hello');
            if (reaction) window.addChatMessage(aiType, reaction);
        }, 1000 + (index * 1500));
    });
    
    updateGameDisplay();
    updateScoreboard();
    updateActivePlayer();
    playerTurn();
}

/**
 * Spustí tah hráče
 */
export function playerTurn() {
    updateActivePlayer();
    
    // Aktualizovat status hráčů
    const humanStatus = document.getElementById('humanPlayerStatus');
    const aiStatus = document.getElementById('aiPlayerStatus');
    
    if (gameState.currentPlayer === 0) {
        if (humanStatus) humanStatus.textContent = 'Váš tah';
        if (aiStatus) aiStatus.textContent = 'Čeká na váš tah';
    } else {
        if (humanStatus) humanStatus.textContent = 'Čeká na AI';
        if (aiStatus) aiStatus.textContent = 'AI hraje';
    }
    
    // Reset any farkle markers from previous dice
    gameState.dice.forEach(die => delete die.farkle);
    
    if (gameState.currentPlayer === 0) {
        // Lidský hráč - status už je nastavený výše
    } else {
        // AI hráč
        const aiPlayer = getCurrentPlayer();
        
        // AI reakce na začátek tahu
        setTimeout(() => {
            const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'playerTurnStart');
            if (reaction) window.addChatMessage(aiPlayer.type, reaction);
        }, 500);
        
        // Spustí AI tah
        setTimeout(() => playAITurn(), 1500);
    }
}

/**
 * Hod kostkami pro lidského hráče
 */
export function rollDiceForPlayer() {
    if (gameState.rollsLeft <= 0 || gameState.currentPlayer !== 0) return;
    
    const diceToRoll = 6 - gameState.bankedDice.length;
    gameState.dice = rollDice(diceToRoll);
    gameState.rollsLeft--;
    gameState.mustBankDice = false; // Reset flag
    
    // Vymazat předchozí farkle značky
    gameState.dice.forEach(die => delete die.farkle);
    
    const diceValues = gameState.dice.map(d => d.value);
    const rollScore = calculateScore(diceValues);
    
    // Debug log
    console.log('🎲 Hod kostek:', diceValues, 'Skóre:', rollScore);
    
    window.addChatMessage('system', `Hod: ${diceValues.join(', ')} - Možné body z hodu: ${rollScore}`);
    
    if (rollScore === 0) {
        // Farkle - žádné bodující kostky
        console.log('❌ FARKLE detekován! Ukončuji tah...');
        window.addChatMessage('system', `❌ FARKLE! Žádné bodující kostky! Tah končí s 0 body.`);
        
        // Označit kostky jako farkle pro vizuální efekt
        gameState.dice.forEach(die => die.farkle = true);
        
        // Aktualizovat UI pro zobrazení farkle
        const humanStatus = document.getElementById('humanPlayerStatus');
        const aiStatus = document.getElementById('aiPlayerStatus');
        
        if (gameState.currentPlayer === 0) {
            if (humanStatus) {
                humanStatus.textContent = 'FARKLE! Tah končí s 0 body!';
                humanStatus.style.color = 'var(--neon-orange)';
            }
        } else {
            if (aiStatus) {
                aiStatus.textContent = 'FARKLE! Tah končí s 0 body!';
                aiStatus.style.color = 'var(--neon-orange)';
            }
        }
        
        // AI reakce na farkle (pouze pokud je to lidský hráč)
        if (gameState.currentPlayer === 0) {
            triggerFarkleHeckling('Vy');
        }
        
        // Zpoždění před automatickým ukončením tahu
        setTimeout(() => {
            console.log('🔄 Automaticky ukončuji tah po farkle...');
            gameState.currentTurnScore = 0; // Zrušit všechny body z tohoto tahu
            nextPlayer();
            playerTurn();
        }, 2000);
        
        updateGameDisplay();
        return;
    } else {
        // Máme bodující kostky - musíme odložit alespoň něco před dalším hodem
        gameState.mustBankDice = true;
        window.addChatMessage('system', `🎯 Máte bodující kostky! Musíte odložit alespoň jednu bodující kombinaci před dalším hodem.`);
    }
    
    updateGameDisplay();
}

/**
 * Vybere/odznačí kostku
 */
export function selectDie(index) {
    if (gameState.currentPlayer !== 0) return;
    
    gameState.dice[index].selected = !gameState.dice[index].selected;
    updateGameDisplay();
}

/**
 * Odloží vybrané kostky
 */
export function bankSelectedDice() {
    const selectedDice = gameState.dice.filter(d => d.selected);
    if (selectedDice.length === 0) {
        window.addChatMessage('system', "Vyberte kostky, které chcete odložit.");
        return;
    }
    
    const selectedValues = selectedDice.map(d => d.value);
    const score = calculateScore(selectedValues);
    
    if (score === 0) {
        window.addChatMessage('system', "Vybrané kostky nenesou žádné body! Vyberte platné bodující kosty.");
        return;
    }
    
    gameState.currentTurnScore += score;
    gameState.bankedDice = gameState.bankedDice.concat(selectedValues);
    gameState.dice = gameState.dice.filter(d => !d.selected);
    gameState.mustBankDice = false; // Reset after banking
    
    window.addChatMessage('system', `Odloženo: ${selectedValues.join(', ')} za ${score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`);
    
    // HOT DICE: Kontrola, zda jsou všechny kostky odložené
    if (gameState.bankedDice.length === 6) {
        gameState.bankedDice = [];
        gameState.rollsLeft = Math.max(gameState.rollsLeft, 1); // Zajistit alespoň jeden hod
        window.addChatMessage('system', "🔥 HOT DICE! Všechny kostky odloženy! Můžete pokračovat v házení všech 6 kostek.");
    }
    
    updateGameDisplay();
}

/**
 * Ukončí tah hráče
 */
export function endTurn(scored = true) {
    if (scored && gameState.currentTurnScore >= 250) {
        gameState.players[gameState.currentPlayer].score += gameState.currentTurnScore;
        window.addChatMessage('system', `${getCurrentPlayer().name} získal ${gameState.currentTurnScore} bodů tento tah! Celkem: ${gameState.players[gameState.currentPlayer].score}.`);
        
        // AI reakce na skóre (pouze pokud je to lidský hráč)
        if (gameState.currentPlayer === 0) {
            if (gameState.currentTurnScore >= 300) {
                triggerAIAfterGoodRoll(gameState.currentTurnScore, 'Vy');
            } else if (gameState.currentTurnScore < 200) {
                triggerAIAfterBadRoll(gameState.currentTurnScore, 'Vy');
            }
            
            // Aktivovat náhodné aktivity
            triggerRandomAITrashTalk();
            triggerAIBanter();
            triggerAIHighTensionComment();
        }
        
        // Kontrola dosažení cílového skóre
        if (gameState.players[gameState.currentPlayer].score >= gameState.targetScore && !gameState.finalRound) {
            gameState.finalRound = true;
            gameState.finalRoundInitiator = gameState.currentPlayer;
            window.addChatMessage('system', `🏆 ${getCurrentPlayer().name} dosáhl cílového skóre ${gameState.targetScore}! Ostatní hráči mají ještě jednu šanci!`);
            
            // AI reakce na finální kolo
            gameState.players.forEach(player => {
                if (player.type !== 'human') {
                    const reaction = enhancedAI.generateAIResponse(player.type, 'finalRound');
                    if (reaction) {
                        setTimeout(() => window.addChatMessage(player.type, reaction), 1000 + Math.random() * 500);
                    }
                }
            });
        }
        
        // Kontrola konce finálního kola
        if (gameState.finalRound && gameState.currentPlayer === gameState.finalRoundInitiator) {
            // Dokončeno finální kolo, najdeme vítěze
            const winner = gameState.players.reduce((prev, current) => 
                (prev.score > current.score) ? prev : current);
            endGame(winner);
            return;
        }
    } else if (scored) {
        window.addChatMessage('system', `${getCurrentPlayer().name} nezískal minimálních 250 bodů. Tah končí s 0 body.`);
    }
    
    updateScoreboard();
    nextPlayer();
    updateGameDisplay();
    playerTurn();
}

/**
 * Ukončí hru
 */
export function endGame(winner) {
    gameState.gameEnded = true;
    
    document.getElementById('winnerAnnouncement').innerHTML = 
        winner.type === 'human' ? '🎉 Gratulujeme! Vyhrál(a) jste!' : `🏆 Vítězem se stává ${winner.name}!`;
    
    // Dynamicky vygeneruje zprávu o skóre
    let finalScoresHTML = `<strong>Konečné skóre:</strong><br>`;
    gameState.players.forEach(player => {
        finalScoresHTML += `${player.name}: ${player.score} bodů<br>`;
    });
    document.getElementById('finalScores').innerHTML = finalScoresHTML;
    
    // Zobrazení game stats
    const gameEndTime = new Date();
    const gameDuration = gameEndTime - gameState.gameStartTime;
    const durationMinutes = Math.floor(gameDuration / 60000);
    const durationSeconds = Math.floor((gameDuration % 60000) / 1000);
    
    const gameStatsHTML = `
        <strong>Statistiky hry:</strong><br>
        ⏱️ Doba hry: ${durationMinutes}m ${durationSeconds}s<br>
        🎯 Celkové tahy: ${gameState.totalTurns}<br>
        📊 Průměr bodů/tah: ${Math.round(winner.score / gameState.totalTurns)}
    `;
    document.getElementById('gameStats').innerHTML = gameStatsHTML;
    
    // Zobrazit signature section pouze pro lidské vítěze
    const signatureSection = document.getElementById('signatureSection');
    if (winner.type === 'human') {
        signatureSection.style.display = 'block';
    } else {
        signatureSection.style.display = 'none';
    }
    
    document.getElementById('gameOverModal').style.display = 'flex';
    
    // AI reakce na konec hry
    gameState.players.forEach(player => {
        if (player.type !== 'human') {
            const reaction = enhancedAI.generateAIResponse(player.type, 'gameOver', { winner: winner.name });
            if (reaction) {
                setTimeout(() => window.addChatMessage(player.type, reaction), 1000 + Math.random() * 500);
            }
        }
    });
}

/**
 * Uloží skóre do síně slávy (pouze lidští hráči)
 */
export function saveScore() {
    const signature = document.getElementById('winnerSignature').value.trim();
    if (!signature) {
        alert('Prosím, zadejte svůj podpis!');
        return;
    }
    
    const winner = gameState.players.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current);
    
    // Pouze lidští hráči mohou ukládat do síně slávy
    if (winner.type !== 'human') {
        alert('Do síně slávy se mohou ukládat pouze výsledky lidských hráčů!');
        return;
    }
    
    const gameResult = createGameResult(gameState, signature, gameState.gameStartTime, gameState.totalTurns || 0);
    saveGameResult(gameResult);
    
    // Zavřít modal a automaticky zobrazit síň slávy
    document.getElementById('gameOverModal').style.display = 'none';
    setTimeout(() => {
        displayHallOfFame();
    }, 500);
    
    console.log('🏆 Skóre uloženo do síně slávy!');
}

/**
 * Spustí novou hru s možností vybrat cílové skóre
 */
export function startNewGame() {
    const newTargetScore = parseInt(document.getElementById('newGameTargetScore').value);
    
    resetGameState();
    
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('targetScoreInput').value = newTargetScore;
    
    // Automaticky spustit hru s novým cílovým skóre
    gameState.targetScore = newTargetScore;
    gameState.gameStarted = true;
    
    document.getElementById('targetScoreSetup').style.display = 'none';
    document.getElementById('gameControls').style.display = 'block';
    document.getElementById('targetScoreDisplay').textContent = gameState.targetScore;
    document.getElementById('signatureInput').value = '';
    
    updateScoreboard();
    updateGameDisplay();
    
    // Clear active player styling
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('active');
    });
    
    // Clear chat history in UI and localStorage
    document.getElementById('chatMessages').innerHTML = '';
    localStorage.removeItem('diceGameChat');

    window.addChatMessage('system', `🎮 Nová hra začala! Cíl: ${gameState.targetScore} bodů!`);
    
    // AI starting messages
    setTimeout(() => {
        const geminiReaction = generateAIGameReaction('gemini', 'hello');
        if (geminiReaction) window.addChatMessage(geminiReaction.senderType, geminiReaction.message);
    }, 1000);
    
    setTimeout(() => {
        const chatgptReaction = generateAIGameReaction('chatgpt', 'hello');
        if (chatgptReaction) window.addChatMessage(chatgptReaction.senderType, chatgptReaction.message);
    }, 2000);
    
    setTimeout(() => {
        const claudeReaction = generateAIGameReaction('claude', 'hello');
        if (claudeReaction) window.addChatMessage(claudeReaction.senderType, claudeReaction.message);
    }, 3000);
    
    playerTurn();
}

/**
 * Resetuje hru
 */
export function resetGame() {
    resetGameState();
    
    document.getElementById('targetScoreSetup').style.display = 'block';
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('targetScoreInput').value = 10000;
    document.getElementById('signatureInput').value = '';

    updateScoreboard();
    updateGameDisplay();
    
    // Clear active player styling
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('active');
    });
    
    // Clear chat history in UI and localStorage
    document.getElementById('chatMessages').innerHTML = '';
    localStorage.removeItem('diceGameChat');

    window.addChatMessage('system', '🔄 Hra resetována! Připraveni na novou výzvu?');
}

/**
 * Nastavuje event listenery pro herní prvky
 */
export function setupEventListeners() {
    console.log('🎮 Nastavuji event listenery...');
    
    // Počkej na úplné načtení DOM
    setTimeout(() => {
        // Start game button
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            console.log('✅ Přidávám event listener pro Start Game');
            startGameBtn.addEventListener('click', () => {
                console.log('🚀 Start Game button clicked!');
                const targetScoreInput = document.getElementById('targetScoreInput');
                const targetScore = parseInt(targetScoreInput.value);
                
                if (targetScore >= 1000) {
                    startGame();
                } else {
                    alert('Cílové skóre musí být alespoň 1000 bodů!');
                }
            });
        } else {
            console.error('❌ Start Game button not found!');
        }

        // Roll dice button
        const rollBtn = document.getElementById('rollBtn');
        if (rollBtn) {
            console.log('✅ Přidávám event listener pro Roll Dice');
            rollBtn.addEventListener('click', rollDiceForPlayer);
        }
        
        // Bank dice button
        const bankBtn = document.getElementById('bankBtn');
        if (bankBtn) {
            console.log('✅ Přidávám event listener pro Bank Dice');
            bankBtn.addEventListener('click', bankSelectedDice);
        }
        
        // End turn button
        const endTurnBtn = document.getElementById('endTurnBtn');
        if (endTurnBtn) {
            console.log('✅ Přidávám event listener pro End Turn');
            endTurnBtn.addEventListener('click', () => endTurn(true));
        }
         // Quit game button
        const quitGameBtn = document.getElementById('quitGameBtn');
        if (quitGameBtn) {
            console.log('✅ Přidávám event listener pro Quit Game');
            quitGameBtn.addEventListener('click', quitGame);
        }

        // Custom event listener pro výběr kostek z gameUI
        console.log('✅ Přidávám event listener pro dieSelected');
        document.addEventListener('dieSelected', (event) => {
            const { index } = event.detail;
            selectDie(index);
        });

        // Custom event listener pro výběr kostek z gameUI
        console.log('✅ Přidávám event listener pro dieSelected');
        document.addEventListener('dieSelected', (event) => {
            const { index } = event.detail;
            selectDie(index);
        });

        // Target score input change
        const targetScoreInput = document.getElementById('targetScoreInput');
        if (targetScoreInput) {
            targetScoreInput.addEventListener('change', () => {
                const targetScoreDisplay = document.getElementById('targetScoreDisplay');
                if (targetScoreDisplay) {
                    targetScoreDisplay.textContent = targetScoreInput.value;
                }
            });
        }

        console.log('✅ Event listenery nastaveny');
    }, 100);
}

/**
 * AI reaktivní funkce pro různé herní události
 */

/**
 * Spustí AI reakce po dobrém hodu
 */
export function triggerAIAfterGoodRoll(score, playerName) {
    if (Math.random() < 0.3) { // 30% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reactions = {
            gemini: [
                `Statisticky máš jen ${Math.round(Math.random() * 40 + 20)}% šanci na výhru 📊`,
                `${score} bodů? Můj algoritmus očekával víc 🤖`,
                `Data ukazují vzestupný trend... zatím 📈`
            ],
            chatgpt: [
                `Nice roll! But I'm still gonna crush you! 😎🎲`,
                `${score} bodů? Not bad, not bad! 💪`,
                `Okay, that was actually pretty good! 👏✨`
            ],
            claude: [
                `Výborný tah! Strategie se ti vyvíjí 🎯`,
                `${score} bodů... moudré rozhodnutí 🧘`,
                `Tak se mi to líbí! Pokračuj v této cestě 🌟`
            ]
        };
        
        const response = reactions[selectedAI][Math.floor(Math.random() * reactions[selectedAI].length)];
        setTimeout(() => window.addChatMessage(selectedAI, response), 500 + Math.random() * 1000);
    }
}

/**
 * Spustí AI hecování po špatném hodu
 */
export function triggerAIAfterBadRoll(score, playerName) {
    if (Math.random() < 0.4) { // 40% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reactions = {
            gemini: [
                `${score} bodů? Error: Expected value too low 📉`,
                `Výpočet rizika selhal. Recalibrating... 🤖`,
                `Suboptimální výsledek podle predikcí 📊`
            ],
            chatgpt: [
                `Ouch! That hurt to watch! 😅🎲`,
                `${score} bodů? Maybe buy some luck online! 🛒✨`,
                `Kostky tě fakt nemají rády, co? 🤣`
            ],
            claude: [
                `${score} bodů... někdy je štěstí proměnlivé 🤔`,
                `Moudrost říká: i z neúspěchu se učíme 📚`,
                `Takové jsou kostky života... 🎭`
            ]
        };
        
        const response = reactions[selectedAI][Math.floor(Math.random() * reactions[selectedAI].length)];
        setTimeout(() => window.addChatMessage(selectedAI, response), 300 + Math.random() * 800);
    }
}

/**
 * Náhodný AI trash talk
 */
export function triggerRandomAITrashTalk() {
    if (Math.random() < 0.15) { // 15% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reaction = enhancedAI.generateTrashTalk(selectedAI, 'human');
        if (reaction) {
            setTimeout(() => window.addChatMessage(selectedAI, reaction), 1500 + Math.random() * 2000);
        }
    }
}

/**
 * AI banter mezi sebou
 */
export function triggerAIBanter() {
    if (Math.random() < 0.2) { // 20% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const initiator = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const banter = enhancedAI.generateAIBanter(initiator);
        if (banter) {
            setTimeout(() => window.addChatMessage('system', banter), 2000 + Math.random() * 3000);
        }
    }
}

/**
 * Komentáře při vysokém napětí
 */
export function triggerAIHighTensionComment() {
    // Najít hráče blízko cíli
    const closeToWin = gameState.players.some(player => 
        player.score >= gameState.targetScore * 0.8
    );
    
    if (closeToWin && Math.random() < 0.6) { // 60% šance při vysokém napětí
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const tensionComments = {
            gemini: [
                "Napětí roste exponenciálně! 📈⚡",
                "Critical phase detected! All systems alert! 🚨",
                "Statistical variance approaching maximum! 📊🔥"
            ],
            chatgpt: [
                "Whoa! Things are getting spicy! 🌶️🔥",
                "Plot twist incoming! 🎬✨",
                "This is where legends are made! 🏆⚡"
            ],
            claude: [
                "Napětí hustne... moment pravdy se blíží 🎭",
                "Ve vzduchu je cítit osud... 🌙⚡",
                "Takové chvíle definují charaktery 💎"
            ]
        };
        
        const comments = tensionComments[selectedAI];
        const response = comments[Math.floor(Math.random() * comments.length)];
        
        setTimeout(() => window.addChatMessage(selectedAI, response), 800 + Math.random() * 1200);
    }
}

/**
 * Vrátí se do hlavního menu
 */
export function returnToMainMenu() {
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('targetScoreSetup').style.display = 'block';
    
    // Reset game state
    resetGameState();
    updateGameDisplay();
    updateScoreboard();
}
