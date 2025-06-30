/**
 * Game Controller
 * Hlavní řídící logika hry
 */

import { gameState, resetGameState, nextPlayer, getCurrentPlayer, checkForWinner } from './gameState.js';
import { rollDice, calculateScore, hasScoringDice, validateDiceSelection, findBestScoringCombination } from './diceLogic.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer } from '../ui/gameUI.js';
import { addChatMessage } from '../ui/enhancedChatController.js';
import { generateAIGameReaction, generateFinalRoundReaction, enhancedAI } from '../ai/enhancedAIController.js';
import { playAITurn } from '../ai/aiPlayer.js';
import { saveGameResult, displayHallOfFame } from '../utils/hallOfFame.js';

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
    const targetScoreInput = document.getElementById('targetScore');
    gameState.targetScore = parseInt(targetScoreInput.value);
    gameState.gameStarted = true;
    gameState.gameStartTime = new Date(); // Nastavit čas začátku hry
    
    document.getElementById('targetScoreSetup').style.display = 'none';
    document.getElementById('gameControls').style.display = 'block';
    
    // Nastavit jméno hráče
    const playerNameInput = document.getElementById('playerName');
    const humanPlayerName = document.getElementById('humanPlayerName');
    if (playerNameInput && humanPlayerName) {
        gameState.playerName = playerNameInput.value || 'Hráč';
        humanPlayerName.textContent = gameState.playerName;
    }
    
    addChatMessage('system', `🎮 Hra začala! První hráč, který dosáhne ${gameState.targetScore} bodů, vyhrává!`);
    
    // AI starting message
    setTimeout(() => {
        const aiReaction = generateAIGameReaction('ai', 'hello');
        if (aiReaction) addChatMessage(aiReaction.senderType, aiReaction.message);
    }, 1000);
    
    updateGameDisplay();
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
            const reaction = generateAIGameReaction(aiPlayer.type, 'playerTurnStart', aiPlayer.name);
            if (reaction) addChatMessage(reaction.senderType, reaction.message);
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
    
    addChatMessage('system', `Hod: ${diceValues.join(', ')} - Možné body z hodu: ${rollScore}`);
    
    if (rollScore === 0) {
        // Farkle - žádné bodující kostky
        console.log('❌ FARKLE detekován! Ukončuji tah...');
        addChatMessage('system', `❌ FARKLE! Žádné bodující kostky! Tah končí s 0 body.`);
        
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
        addChatMessage('system', `🎯 Máte bodující kostky! Musíte odložit alespoň jednu bodující kombinaci před dalším hodem.`);
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
        addChatMessage('system', "Vyberte kostky, které chcete odložit.");
        return;
    }
    
    const selectedValues = selectedDice.map(d => d.value);
    const score = calculateScore(selectedValues);
    
    if (score === 0) {
        addChatMessage('system', "Vybrané kostky nenesou žádné body! Vyberte platné bodující kostky.");
        return;
    }
    
    gameState.currentTurnScore += score;
    gameState.bankedDice = gameState.bankedDice.concat(selectedValues);
    gameState.dice = gameState.dice.filter(d => !d.selected);
    gameState.mustBankDice = false; // Reset after banking
    
    addChatMessage('system', `Odloženo: ${selectedValues.join(', ')} za ${score} bodů. Aktuální skóre tahu: ${gameState.currentTurnScore}.`);
    
    // HOT DICE: Kontrola, zda jsou všechny kostky odložené
    if (gameState.bankedDice.length === 6) {
        gameState.bankedDice = [];
        gameState.rollsLeft = Math.max(gameState.rollsLeft, 1); // Zajistit alespoň jeden hod
        addChatMessage('system', "🔥 HOT DICE! Všechny kostky odloženy! Můžete pokračovat v házení všech 6 kostek.");
    }
    
    updateGameDisplay();
}

/**
 * Ukončí tah hráče
 */
export function endTurn(scored = true) {
    if (scored && gameState.currentTurnScore >= 250) {
        gameState.players[gameState.currentPlayer].score += gameState.currentTurnScore;
        addChatMessage('system', `${getCurrentPlayer().name} získal ${gameState.currentTurnScore} bodů tento tah! Celkem: ${gameState.players[gameState.currentPlayer].score}.`);
        
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
            addChatMessage('system', `🏆 ${getCurrentPlayer().name} dosáhl cílového skóre ${gameState.targetScore}! Ostatní hráči mají ještě jednu šanci!`);
            
            // AI reakce na finální kolo
            gameState.players.forEach(player => {
                if (player.type !== 'human') {
                    const reaction = generateFinalRoundReaction(player.type);
                    if (reaction) {
                        setTimeout(() => addChatMessage(reaction.senderType, reaction.message), 1000 + Math.random() * 500);
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
        addChatMessage('system', `${getCurrentPlayer().name} nezískal minimálních 250 bodů. Tah končí s 0 body.`);
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
    
    document.getElementById('gameOverModal').style.display = 'flex';
    
    // AI reakce na konec hry
    gameState.players.forEach(player => {
        if (player.type !== 'human') {
            const reaction = generateAIGameReaction(player.type, 'gameOver', winner.name);
            if (reaction) {
                setTimeout(() => addChatMessage(reaction.senderType, reaction.message), 1000 + Math.random() * 500);
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
    if (winner.name !== 'Hráč') {
        alert('Do síně slávy se mohou ukládat pouze výsledky lidských hráčů!');
        return;
    }
    
    const gameEndTime = new Date();
    const gameDurationMs = gameEndTime - gameState.gameStartTime;
    const gameDurationMinutes = Math.round(gameDurationMs / 60000);
    
    const gameResult = {
        date: gameEndTime.toISOString(),
        signature: signature,
        targetScore: gameState.targetScore,
        finalScore: winner.score,
        gameDuration: gameDurationMinutes,
        totalTurns: gameState.currentTurn,
        pointsPerTurn: Math.round(winner.score / gameState.currentTurn),
        allScores: gameState.players.map(p => ({ name: p.name, score: p.score }))
    };
    
    saveGameResult(gameResult);
    
    // Zavřít modal a automaticky zobrazit síň slávy po 500ms
    document.getElementById('gameOverModal').style.display = 'none';
    setTimeout(() => {
        displayHallOfFame();
    }, 500);
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

    addChatMessage('system', `🎮 Nová hra začala! Cíl: ${gameState.targetScore} bodů!`);
    
    // AI starting messages
    setTimeout(() => {
        const geminiReaction = generateAIGameReaction('gemini', 'hello');
        if (geminiReaction) addChatMessage(geminiReaction.senderType, geminiReaction.message);
    }, 1000);
    
    setTimeout(() => {
        const chatgptReaction = generateAIGameReaction('chatgpt', 'hello');
        if (chatgptReaction) addChatMessage(chatgptReaction.senderType, chatgptReaction.message);
    }, 2000);
    
    setTimeout(() => {
        const claudeReaction = generateAIGameReaction('claude', 'hello');
        if (claudeReaction) addChatMessage(claudeReaction.senderType, claudeReaction.message);
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

    addChatMessage('system', '🔄 Hra resetována! Připraveni na novou výzvu?');
}

/**
 * Aktivuje AI reakce po dobrém hodu
 */
export function triggerAIAfterGoodRoll(score, playerName = 'Vy') {
    if (Math.random() < 0.3) { // 30% šance na komentář
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const randomAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reaction = enhancedAI.generateAIResponse(randomAI, 'goodRoll', { score, playerName });
        if (reaction) {
            setTimeout(() => addChatMessage(randomAI, reaction), 500 + Math.random() * 500);
        }
    }
}

/**
 * Aktivuje AI reakce po špatném hodu
 */
export function triggerAIAfterBadRoll(score, playerName = 'Vy') {
    if (Math.random() < 0.4) { // 40% šance na hecování
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const randomAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reaction = enhancedAI.generateAIResponse(randomAI, 'badRoll', { score, playerName });
        if (reaction) {
            setTimeout(() => addChatMessage(randomAI, reaction), 500 + Math.random() * 500);
        }
    }
}

/**
 * Aktivuje AI reakce při vysokém napětí (někdo blízko výhře)
 */
export function triggerAIHighTensionComment() {
    if (Math.random() < 0.6) { // 60% šance
        const highestScore = Math.max(...gameState.players.map(p => p.score));
        if (highestScore >= gameState.targetScore * 0.8) { // 80% cílového skóre
            const aiTypes = ['gemini', 'chatgpt', 'claude'];
            const randomAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
            
            const reaction = enhancedAI.generateAIResponse(randomAI, 'highTension', { highestScore });
            if (reaction) {
                setTimeout(() => addChatMessage(randomAI, reaction), 1000 + Math.random() * 1000);
            }
        }
    }
}

/**
 * Aktivuje náhodný trash talk během hry
 */
export function triggerRandomAITrashTalk() {
    if (Math.random() < 0.15) { // 15% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const randomAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reaction = enhancedAI.generateTrashTalk(randomAI);
        if (reaction) {
            setTimeout(() => addChatMessage(randomAI, reaction), 2000 + Math.random() * 3000);
        }
    }
}

/**
 * Aktivuje AI banter (štěkání mezi AI)
 */
export function triggerAIBanter() {
    if (Math.random() < 0.2) { // 20% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const initiator = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const banter = enhancedAI.generateAIBanter(initiator);
        if (banter) {
            setTimeout(() => addChatMessage('system', banter), 1500 + Math.random() * 2000);
        }
    }
}

/**
 * Aktivuje farkle hecování (všechny AI se zapojí)
 */
export function triggerFarkleHeckling(playerName = 'Vy') {
    // 100% šance - všechny AI hecují po farkle
    const aiTypes = ['gemini', 'chatgpt', 'claude'];
    
    aiTypes.forEach((aiType, index) => {
        const reaction = enhancedAI.generateAIResponse(aiType, 'farkle', { playerName });
        if (reaction) {
            setTimeout(() => addChatMessage(aiType, reaction), 1000 + (index * 800) + Math.random() * 400);
        }
    });
}

/**
 * Opustí hru a vrátí se na hlavní menu
 */
export function quitGame() {
    if (confirm('Opravdu chcete opustit hru? Všechen pokrok bude ztracen.')) {
        resetGameState();
        
        // Skrýt herní rozhraní
        document.getElementById('gameControls').style.display = 'none';
        document.getElementById('targetScoreSetup').style.display = 'block';
        
        // Vyčistit chat
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // Reset UI
        updateGameDisplay();
        updateScoreboard();
        
        addChatMessage('system', '🚪 Hra byla ukončena. Vítejte zpět na hlavní obrazovce!');
    }
}
