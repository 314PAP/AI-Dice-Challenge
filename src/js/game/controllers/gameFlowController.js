/**
 * Game Flow Controller
 * Manages game lifecycle: initialization, start, end, and player turns
 */

import { gameState, resetGameState, nextPlayer, getCurrentPlayer, checkForWinner } from '../gameState.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer } from '../../ui/gameUI.js';
import { enhancedAI, generateAIGameReaction } from '../../../ai/controllers/enhancedAIController.js';
import { playAITurn, clearAllAITimeouts, createAITimeout } from '../../ai/aiPlayer.js';
import { saveGameResult, displayHallOfFame, createGameResult } from '../../utils/hallOfFame.js';
import { resetEventListeners } from './eventSetupController.js';

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
    
    // Přidej game-active třídu pro skrytí avatarů
    document.body.classList.add('game-active');
    
     // Aktualizovat target score display
    const targetScoreDisplay = document.getElementById('targetScoreDisplay');
    if (targetScoreDisplay) {
        targetScoreDisplay.textContent = gameState.targetScore;
    }

    // Hide target score setup and show game controls
    const targetScoreSetup = document.getElementById('targetScoreSetup');
    const gameControls = document.getElementById('gameControls');
    
    if (targetScoreSetup) targetScoreSetup.classList.add('hidden');
    if (gameControls) gameControls.classList.remove('hidden');
    
    // Show players container during game
    const playersContainer = document.querySelector('.players-container');
    if (playersContainer) {
        playersContainer.classList.remove('hidden');
    }
    console.log('✅ Zobrazeny herní ovládací prvky');

    window.addChatMessage('system', `🎮 Hra začala! První hráč, který dosáhne ${gameState.targetScore} bodů, vyhrává!`);
    
    // AI starting messages
    const aiTypes = ['gemini', 'chatgpt', 'claude'];
    aiTypes.forEach((aiType, index) => {
        createAITimeout(() => {
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
    
    // Clear any previous dice data and banked dice from previous turn
    gameState.diceValues = [];
    gameState.selectedDice = [];
    gameState.bankedDiceThisTurn = []; // Clear banked dice display at start of new turn

    if (gameState.currentPlayer === 0) {
        // Lidský hráč - clear any leftover UI state and show fresh turn
        console.log('🎮 Human player turn starting');
    } else {
        // AI hráč
        const aiPlayer = getCurrentPlayer();
        console.log(`🤖 AI player turn starting: ${aiPlayer.name}`);
        
        // AI reakce na začátek tahu
        createAITimeout(() => {
            const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'playerTurnStart');
            if (reaction) window.addChatMessage(aiPlayer.type, reaction);
        }, 500);
        
        // Spustí AI tah
        createAITimeout(() => playAITurn(), 1500);
    }
    
    // Update the game display for all players
    updateGameDisplay();
}

/**
 * Ukončí tah hráče
 */
export function endTurn(scored = true) {
    // Zabezpečení proti opakovanému volání
    if (gameState.endTurnProcessing) {
        console.warn('⚠️ endTurn již probíhá, ignoruji další volání');
        return;
    }
    
    gameState.endTurnProcessing = true;
    console.log(`🎯 EndTurn: Player ${gameState.currentPlayer}, Score: ${gameState.currentTurnScore}, FinalRound: ${gameState.finalRound}, Initiator: ${gameState.finalRoundInitiator}`);
    
    try {
        if (scored && gameState.currentTurnScore >= 300) { // FARKLE PRAVIDLO: 300 bodů minimum pro všechny
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
                console.log(`🏆 FINÁLNÍ KOLO SPUŠTĚNO! Iniciátor: ${gameState.finalRoundInitiator} (${getCurrentPlayer().name})`);
                window.addChatMessage('system', `🏆 ${getCurrentPlayer().name} dosáhl cílového skóre ${gameState.targetScore}! Ostatní hráči mají ještě jednu šanci!`);
                
                // AI reakce na finální kolo
                gameState.players.forEach(player => {
                    if (player.type !== 'human') {
                        const reaction = enhancedAI.generateAIResponse(player.type, 'finalRound');
                        if (reaction) {
                            createAITimeout(() => window.addChatMessage(player.type, reaction), 1000 + Math.random() * 500);
                        }
                    }
                });
            }
            
            // Kontrola konce finálního kola
            // POZOR: Tato kontrola se NESMÍ dělat ve stejném tahu, kdy se finální kolo spustilo!
            // Musí se dělat AŽ po nextPlayer()
        } else if (scored) {
            window.addChatMessage('system', `${getCurrentPlayer().name} nezískal minimálních 300 bodů. Tah končí s 0 body.`);
        }
        
        updateScoreboard();
        nextPlayer();
        
        // KONTROLA KONCE FINÁLNÍHO KOLA AŽ PO NEXTPLAYER()
        if (gameState.finalRound) {
            console.log(`🔍 Kontrola konce finálního kola PO nextPlayer(): CurrentPlayer=${gameState.currentPlayer}, Initiator=${gameState.finalRoundInitiator}`);
            // Všichni hráči včetně iniciátora finálního kola už hráli
            // Finální kolo končí po tom, co se vrátíme k iniciátorovi
            if (gameState.currentPlayer === gameState.finalRoundInitiator) {
                console.log('🏁 KONEC FINÁLNÍHO KOLA! Hledám vítěze...');
                // Dokončeno finální kolo, najdeme vítěze
                const winner = gameState.players.reduce((prev, current) => 
                    (prev.score > current.score) ? prev : current);
                console.log(`🏆 VÍTĚZ: ${winner.name} s ${winner.score} body`);
                endGame(winner);
                return;
            }
        }
        
        updateGameDisplay();
        
        // Only automatically continue for AI players
        // For human players, wait for them to start their turn manually
        if (gameState.currentPlayer !== 0) {
            playerTurn();
        } else {
            // Update UI to show it's the human player's turn but don't auto-start
            updateActivePlayer();
            updateGameDisplay();
            
            // Update status for human player
            const humanStatus = document.getElementById('humanPlayerStatus');
            const aiStatus = document.getElementById('aiPlayerStatus');
            if (humanStatus) humanStatus.textContent = 'Váš tah';
            if (aiStatus) aiStatus.textContent = 'Čeká na váš tah';
            
            // Clear banked dice display for new turn
            gameState.bankedDiceThisTurn = [];
            updateGameDisplay();
        }
    } finally {
        // Vždy resetuje flag, i pokud se stane chyba
        gameState.endTurnProcessing = false;
    }
}

/**
 * Ukončí hru
 */
export function endGame(winner) {
    console.log('🏁 Ending game...');
    
    // Clear all AI timeouts
    clearAllAITimeouts();
    
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
        signatureSection.classList.remove('hidden');
        signatureSection.style.display = 'block';
    } else {
        signatureSection.classList.add('hidden');
        signatureSection.style.display = 'none';
    }
    
    // Zobrazit modální okno konce hry
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.classList.remove('hidden');
    gameOverModal.classList.add('visible');
    
    // AI reakce na konec hry
    gameState.players.forEach(player => {
        if (player.type !== 'human') {
            const reaction = enhancedAI.generateAIResponse(player.type, 'gameOver', { winner: winner.name });
            if (reaction) {
                createAITimeout(() => window.addChatMessage(player.type, reaction), 1000 + Math.random() * 500);
            }
        }
    });
}

/**
 * Spustí novou hru - resetuje stav a vrátí se na hlavní menu
 */
export function startNewGame() {
    console.log('🔄 Starting new game...');
    
    // Clear all AI timeouts
    clearAllAITimeouts();
    
    // Reset game state
    resetGameState();
    
    // Hide game over modal
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.classList.add('hidden');
    gameOverModal.classList.remove('visible');
    
    // Hide hall of fame modal if open
    const hallOfFameModal = document.getElementById('hallOfFameModal');
    if (hallOfFameModal) {
        hallOfFameModal.classList.add('hidden');
        hallOfFameModal.classList.remove('visible');
    }
    
    // Return to main menu state
    returnToMainMenu();
}

/**
 * Vrátí se na hlavní menu
 */
export function returnToMainMenu() {
    console.log('🏠 Returning to main menu...');
    
    // Clear all AI timeouts
    clearAllAITimeouts();
    
    // Reset game state
    resetGameState();
    
    // Hide all modals
    const gameOverModal = document.getElementById('gameOverModal');
    const hallOfFameModal = document.getElementById('hallOfFameModal');
    
    if (gameOverModal) {
        gameOverModal.classList.add('hidden');
        gameOverModal.classList.remove('visible');
    }
    
    if (hallOfFameModal) {
        hallOfFameModal.classList.add('hidden');
        hallOfFameModal.classList.remove('visible');
    }
    
    // Show target score setup and hide game controls
    const targetScoreSetup = document.getElementById('targetScoreSetup');
    const gameControls = document.getElementById('gameControls');
    const playersContainer = document.querySelector('.players-container');
    
    if (targetScoreSetup) targetScoreSetup.classList.remove('hidden');
    if (gameControls) gameControls.classList.add('hidden');
    if (playersContainer) playersContainer.classList.add('hidden');
    
    // Remove game-active class to show avatars
    document.body.classList.remove('game-active');
    
    // Reset target score input to default
    const targetScoreInput = document.getElementById('targetScoreInput');
    if (targetScoreInput) {
        targetScoreInput.value = '10000';
    }
    
    // Clear chat messages
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    // Update displays
    updateGameDisplay();
    updateScoreboard();
}

/**
 * Resetuje hru
 */
export function resetGame() {
    console.log('🔄 Resetting game...');
    
    // Clear all AI timeouts first
    clearAllAITimeouts();
    
    resetGameState();
    resetEventListeners(); // Resetuj flag pro event listenery
    
    // Odstraň game-active třídu pro zobrazení avatarů
    document.body.classList.remove('game-active');
    
    document.getElementById('targetScoreSetup').style.display = 'block';
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('gameOverModal').style.display = 'none';
    // Hide players container on main menu
    const playersContainer = document.querySelector('.players-container');
    if (playersContainer) {
        playersContainer.classList.add('hidden');
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
    
    // Hide game over modal
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.classList.add('hidden');
        gameOverModal.classList.remove('visible');
    }
    
    // Show success message
    window.addChatMessage('system', `🏆 Skóre uloženo do síně slávy jako "${signature}"!`);
    
    // Show hall of fame and set flag that we came from game over
    setTimeout(() => {
        displayHallOfFame();
        // Mark that we came from game over so close button can return properly
        window.hallOfFameFromGameOver = true;
    }, 500);
    
    console.log('🏆 Skóre uloženo do síně slávy!');
}
