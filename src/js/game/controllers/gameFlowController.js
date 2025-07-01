/**
 * Game Flow Controller
 * Manages game lifecycle: initialization, start, end, and player turns
 */

import { gameState, resetGameState, nextPlayer, getCurrentPlayer, checkForWinner } from '../gameState.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer } from '../../ui/gameUI.js';
import { enhancedAI } from '../../../ai/controllers/enhancedAIController.js';
import { playAITurn } from '../../ai/aiPlayer.js';
import { saveGameResult, displayHallOfFame, createGameResult } from '../../utils/hallOfFame.js';

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
    // Show players container during game
    const playersContainer = document.querySelector('.players-container');
    if (playersContainer) {
        playersContainer.style.display = 'flex';
    }
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
 * Ukončí tah hráče
 */
export function endTurn(scored = true) {
    if (scored && gameState.currentTurnScore >= 250) {
        gameState.players[gameState.currentPlayer].score += gameState.currentTurnScore;
        window.addChatMessage('system', `${getCurrentPlayer().name} získal ${gameState.currentTurnScore} bodů tento tah! Celkem: ${gameState.players[gameState.currentPlayer].score}.`);
        
        // AI reakce na skóre (pouze pokud je to lidský hráč)
        if (gameState.currentPlayer === 0) {
            // Import these functions when needed from AI reactions controller
            if (window.triggerAIAfterGoodRoll && gameState.currentTurnScore >= 300) {
                window.triggerAIAfterGoodRoll(gameState.currentTurnScore, 'Vy');
            } else if (window.triggerAIAfterBadRoll && gameState.currentTurnScore < 200) {
                window.triggerAIAfterBadRoll(gameState.currentTurnScore, 'Vy');
            }
            
            // Aktivovat náhodné aktivity
            if (window.triggerRandomAITrashTalk) window.triggerRandomAITrashTalk();
            if (window.triggerAIBanter) window.triggerAIBanter();
            if (window.triggerAIHighTensionComment) window.triggerAIHighTensionComment();
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
    // Hide players container on main menu
    const playersContainer = document.querySelector('.players-container');
    if (playersContainer) {
        playersContainer.style.display = 'none';
    }
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
 * Vrátí se do hlavního menu
 */
export function returnToMainMenu() {
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('targetScoreSetup').style.display = 'block';
    // Hide players container on main menu
    const playersContainer = document.querySelector('.players-container');
    if (playersContainer) {
        playersContainer.style.display = 'none';
    }
    
    // Reset game state
    resetGameState();
    updateGameDisplay();
    updateScoreboard();
}
