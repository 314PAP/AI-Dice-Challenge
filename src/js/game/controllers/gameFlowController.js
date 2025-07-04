/**
 * Game Flow Controller
 * Manages game lifecycle: initialization, start, end, and player turns
 */

import { gameState, resetGameState, nextPlayer as _nextPlayer, getCurrentPlayer } from '../gameState.js';
import { updateGameDisplay, updateScoreboard, updateActivePlayer, updateGameInfo } from '../../ui/gameUI.js';
import { enhancedAI } from '../../ai/enhancedAIController.js';
import { playAITurn, clearAllAITimeouts, createAITimeout, endAITurn } from '../../ai/aiPlayer.js';
import { saveGameResult, createGameResult } from '../../utils/hallOfFame.js';
import { resetEventListeners } from './eventSetupController.js';
import { showFarkleMessage } from '../../ui/speechBubbles.js';

// Re-export potřebných funkcí pro použití v jiných modulech
export { _nextPlayer as nextPlayer };

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
    if (!targetScoreInput) {
        console.error('❌ Element targetScoreInput nenalezen!');
        throw new Error('Element targetScoreInput nenalezen! Ujistěte se, že je v DOM.');
    }
    gameState.targetScore = parseInt(targetScoreInput.value);
    gameState.gameStarted = true;
    gameState.gameStartTime = new Date(); // Nastavit čas začátku hry
    
    // Reset stavu hry pro nový začátek
    gameState.currentTurnScore = 0;
    gameState.availableDice = 6;
    gameState.diceValues = [];
    gameState.selectedDice = [];
    gameState.bankedDiceThisTurn = [];
    
    // Přidej game-active třídu pro skrytí avatarů
    document.body.classList.add('game-active');
    
     // Aktualizovat target score display
    const targetScoreDisplay = document.getElementById('targetScoreDisplay');
    if (targetScoreDisplay) {
        targetScoreDisplay.textContent = gameState.targetScore;
    }

    // Hide menu and show game controls
    const gameHeader = document.getElementById('gameHeader');
    const gameControls = document.getElementById('gameControls');
    
    if (gameHeader) gameHeader.classList.add('hidden');
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
    
    // Bezpečné volání UI funkcí s try-catch
    try {
        updateGameDisplay();
        console.log('✅ updateGameDisplay called');
    } catch (error) {
        console.error('❌ updateGameDisplay error:', error);
    }
    
    try {
        updateScoreboard();
        console.log('✅ updateScoreboard called');
    } catch (error) {
        console.error('❌ updateScoreboard error:', error);
    }
    
    try {
        updateActivePlayer();
        console.log('✅ updateActivePlayer called');
    } catch (error) {
        console.error('❌ updateActivePlayer error:', error);
    }
    
    try {
        updateGameInfo();
        console.log('✅ updateGameInfo called');
    } catch (error) {
        console.error('❌ updateGameInfo error:', error);
    }
    
    try {
        playerTurn();
        console.log('✅ playerTurn called');
    } catch (error) {
        console.error('❌ playerTurn error:', error);
    }
}

/**
 * Spustí tah hráče
 */
export function playerTurn() {
    console.log('🎮 === PLAYER TURN START ===');
    console.log(`🎮 Current player: ${gameState.currentPlayer} (${gameState.players[gameState.currentPlayer]?.name})`);
    console.log(`🎮 Turn score at start: ${gameState.currentTurnScore}`);
    
    // BEZPEČNOSTNÍ RESET - ujistíme se, že turn score je 0 na začátku tahu
    if (gameState.currentTurnScore !== 0) {
        console.warn(`⚠️ WARNING: currentTurnScore was ${gameState.currentTurnScore}, resetting to 0`);
        gameState.currentTurnScore = 0;
    }
    
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
    gameState.availableDice = 6;
    gameState.mustBankDice = false;
    
    console.log(`🎮 Turn state reset complete. Available dice: ${gameState.availableDice}`);

    console.log(`🔍 Current player check: ${gameState.currentPlayer} === 0? ${gameState.currentPlayer === 0}`);
    
    if (gameState.currentPlayer === 0) {
        // Lidský hráč - clear any leftover UI state and show fresh turn
        console.log('🎮 Human player turn starting');
    } else {
        // AI hráč - ale akce AI se provádějí v endTurn, ne zde
        const aiPlayer = getCurrentPlayer();
        console.log(`🤖 AI player turn setup: ${aiPlayer.name}`);
        console.log('🔍 AI Player object:', aiPlayer);
    }
    
    // Update the game display for all players
    updateGameDisplay();
    console.log('🎮 === PLAYER TURN END ===');
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
    
    // Nastavení příznaku zpracování
    gameState.endTurnProcessing = true;
    
    // Bezpečnostní mechanismus - resetujeme příznak po určitém čase v každém případě
    // abychom předešli "zaseknutí" stavu
    setTimeout(() => {
        if (gameState.endTurnProcessing) {
            console.warn('⚠️ Bezpečnostní reset endTurnProcessing po timeoutu');
            gameState.endTurnProcessing = false;
        }
    }, 2000);
    
    console.log('🎯 === ENDTURN START ===');
    console.log(`🎯 Player: ${gameState.currentPlayer} (${gameState.players[gameState.currentPlayer]?.name})`);
    console.log(`🎯 Scored: ${scored}`); 
    console.log(`🎯 Current turn score: ${gameState.currentTurnScore}`);
    console.log(`🎯 Player total BEFORE: ${gameState.players[gameState.currentPlayer]?.score}`);
    console.log(`🎯 Final Round: ${gameState.finalRound}, Initiator: ${gameState.finalRoundInitiator}`);
    
    try {
        // Přidání skóre - kontrola vstupního minima pouze pro první vstup do hry
        if (scored && gameState.currentTurnScore > 0) {
            const currentPlayer = gameState.players[gameState.currentPlayer];
            
            // Důležitý debug log pro sledování hráče a jeho skóre
            console.log(`🔍 Aktuální hráč: ${currentPlayer.name} (${currentPlayer.type}), 
                         Skóre tahu: ${gameState.currentTurnScore}, 
                         Celkové skóre: ${currentPlayer.score}, 
                         Vstoupil do hry: ${currentPlayer.hasEnteredGame}`);
            
            // Pro vstup do hry je potřeba minimálně 300 bodů
            if (!currentPlayer.hasEnteredGame && gameState.currentTurnScore < 300) {
                console.log(`❌ ENTRY GAME: ${gameState.currentTurnScore} < 300 (first entry requires 300+)`);
                window.addChatMessage('system', `${currentPlayer.name} potřebuje minimálně 300 bodů pro vstup do hry. Tah končí s 0 body.`);
            } else {
                // Hráč může bankovat - buď už je v hře, nebo má >= 300 bodů
                const previousScore = currentPlayer.score;
                currentPlayer.score += gameState.currentTurnScore;
                
                // Důkladné logování aktualizace skóre
                console.log(`💰 SKÓRE AKTUALIZOVÁNO: ${previousScore} + ${gameState.currentTurnScore} = ${currentPlayer.score} (hráč: ${currentPlayer.name})`);
                
                // Označit jako vstoupivší do hry (pokud dosud nebyl)
                if (!currentPlayer.hasEnteredGame) {
                    currentPlayer.hasEnteredGame = true;
                    console.log(`🎮 ENTRY GAME: ${currentPlayer.name} vstoupil do hry s ${gameState.currentTurnScore} body!`);
                    window.addChatMessage('system', `🎮 ${currentPlayer.name} vstoupil do hry!`);
                    
                    // Dodatečná vizuální indikace pro lidského hráče
                    if (currentPlayer.type === 'human') {
                        const humanPlayerElement = document.getElementById('humanPlayer');
                        if (humanPlayerElement) {
                            // Krátká animace "záblesku" pro vstup do hry - bez změny velikosti
                            const originalTransition = humanPlayerElement.style.transition;
                            humanPlayerElement.style.transition = 'border-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out';
                            humanPlayerElement.style.borderColor = 'var(--neon-green)';
                            humanPlayerElement.style.boxShadow = '0 0 15px var(--neon-green), 0 0 25px var(--neon-green)';
                            
                            setTimeout(() => {
                                humanPlayerElement.style.boxShadow = '';
                                humanPlayerElement.style.borderColor = '';
                                humanPlayerElement.style.transition = originalTransition;
                            }, 800);
                        }
                    }
                }
                
                console.log(`💰 SCORE ADDED: ${gameState.currentTurnScore} to player ${gameState.currentPlayer}`);
                console.log(`💰 Player total AFTER: ${currentPlayer.score} (was ${previousScore})`);
                
                window.addChatMessage('system', `${currentPlayer.name} získal ${gameState.currentTurnScore} bodů tento tah! Celkem: ${currentPlayer.score}.`);
                
                // Okamžitě aktualizovat skóre v UI
                updateScoreboard();
                
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
                if (currentPlayer.score >= gameState.targetScore && !gameState.finalRound) {
                    gameState.finalRound = true;
                    gameState.finalRoundInitiator = gameState.currentPlayer;
                    console.log(`🏆 FINÁLNÍ KOLO SPUŠTĚNO! Iniciátor: ${gameState.finalRoundInitiator} (${currentPlayer.name})`);
                    window.addChatMessage('system', `🏆 ${currentPlayer.name} dosáhl cílového skóre ${gameState.targetScore}! Ostatní hráči mají ještě jednu šanci!`);
                    
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
            }
        } else if (scored) {
            console.log(`❌ NO SCORE: Turn score is ${gameState.currentTurnScore}`);
            window.addChatMessage('system', `${gameState.players[gameState.currentPlayer].name} nezískal žádné body. Tah končí.`);
        } else {
            console.log('💀 FARKLE: No score added');
            window.addChatMessage('system', `💀 FARKLE! ${gameState.players[gameState.currentPlayer].name} nezískal žádné body a končí tah.`);
            
            // Show FARKLE message above player avatar
            console.log(`🎯 Showing FARKLE message for player ${gameState.currentPlayer}`);
            showFarkleMessage(gameState.currentPlayer);
        }
        
        // Reset current turn score
        console.log(`🔄 Resetting currentTurnScore from ${gameState.currentTurnScore} to 0`);
        // Reset turn score, dice state, and banked dice
        gameState.currentTurnScore = 0;
        gameState.availableDice = 6;
        gameState.diceValues = [];
        gameState.selectedDice = [];
        gameState.bankedDiceThisTurn = [];
        gameState.mustBankDice = false;
        
        // Aktualizujeme scoreboard a herní informace před změnou hráče
        updateScoreboard();
        updateGameInfo(); // Zajistí aktualizaci skóre tahu na 0
        console.log('🔄 Moving to next player...');
        _nextPlayer();
        console.log(`🔄 Next player is: ${gameState.currentPlayer} (${gameState.players[gameState.currentPlayer]?.name})`);
        
        // Aktualizujeme scoreboard ještě jednou po změně hráče
        updateActivePlayer();
        updateScoreboard();
        
        // KONTROLA KONCE FINÁLNÍHO KOLA SPUŠTĚNO
        if (gameState.finalRound) {
            console.log(`🔍 Kontrola konce finálního kola: CurrentPlayer=${gameState.currentPlayer}, Initiator=${gameState.finalRoundInitiator}`);
            
            // Zdůrazněné logování pro debug
            console.log(`🔄 FINÁLNÍ KOLO STATUS: currentPlayer=${gameState.currentPlayer}, initiator=${gameState.finalRoundInitiator}`);
            console.log(`🔄 Hráč který začal finální kolo: ${gameState.players[gameState.finalRoundInitiator]?.name}`);
            console.log(`🔄 Aktuální hráč: ${gameState.players[gameState.currentPlayer]?.name}`);
            
            // Všichni hráči včetně iniciátora finálního kola už hráli
            // Finální kolo končí po tom, co se vrátíme k iniciátorovi
            if (gameState.currentPlayer === gameState.finalRoundInitiator) {
                console.log('🏁 KONEC FINÁLNÍHO KOLA! Hledám vítěze...');
                // Dokončeno finální kolo, najdeme vítěze
                const winner = gameState.players.reduce((prev, current) => 
                    (prev.score > current.score) ? prev : current);
                console.log(`🏆 VÍTĚZ: ${winner.name} s ${winner.score} body`);
                
                // Důležité: Zajistíme okamžitou aktualizaci skóre a resetování endTurnProcessing
                // aby nedocházelo k "zaseknutí" stavu při přechodu do konečných obrazovek
                gameState.endTurnProcessing = false;
                
                // Aktualizujeme skóre ještě před ukončením hry
                updateScoreboard();
                
                // Voláme endGame až po všech aktualizacích s mírným zpožděním
                setTimeout(() => {
                    endGame(winner);
                }, 100);
                return;
            }
        }
        
        // Důležité: resetujeme příznak zpracování tahu až po všech operacích
        setTimeout(() => {
            gameState.endTurnProcessing = false;
            console.log('🎯 === ENDTURN COMPLETE ===');
        }, 100); // Krátké zpoždění pro zajištění dokončení ostatních operací
        
        updateGameDisplay();
        
        // Only automatically continue for AI players
        // For human players, wait for them to start their turn manually
        if (gameState.currentPlayer !== 0) {
            console.log(`🤖 AI player turn starting for: ${gameState.players[gameState.currentPlayer].name}`);
            // Start AI player turn immediately
            playerTurn();
            
            // Schedule AI actions after playerTurn sets up the turn
            const aiPlayer = getCurrentPlayer();
            console.log('🔍 Scheduling AI actions for:', aiPlayer.name);
            
            // Only use the gameFlowController timeouts for AI reactions, not AI gameplay
            setTimeout(() => {
                console.log('🤖 AI reaction timeout fired');
                const reaction = enhancedAI.generateAIResponse(aiPlayer.type, 'playerTurnStart');
                if (reaction) window.addChatMessage(aiPlayer.type, reaction);
            }, 500);
            
            setTimeout(() => {
                console.log('🤖 AI turn timeout fired, calling playAITurn...');
                playAITurn();
            }, 1500);
            
        } else {
            console.log('👤 Human player turn - waiting for manual action');
            // End any active AI turn when switching to human player
            endAITurn();
            
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
            
            // Start human player turn
            playerTurn();
        }
        
        console.log('🎯 === ENDTURN END ===');
    } finally {
        // Vždy resetuje flag, i pokud se stane chyba
        gameState.endTurnProcessing = false;
    }
}

/**
 * Ukončí hru a zobrazí vítěze
 */
export function endGame(winner) {
    console.log('🏁 Hra skončila!');
    gameState.gameEnded = true;
    
    // Zajistíme, že endTurnProcessing je resetován
    gameState.endTurnProcessing = false;
    
    console.log(`🏆 Vítěz: ${winner.name} (${winner.type}) s ${winner.score} body`);
    
    // Vyčistíme všechny AI timeouty
    clearAllAITimeouts();
    
    // Resetování aktivního hráče - zajistíme, že žádný hráč není označen jako aktivní
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('active');
        player.style.boxShadow = '';
        player.style.borderColor = '';
        player.style.animation = '';
        player.style.transform = '';
    });
    
    // Získáme typ vítěze a příslušný element
    const winnerType = winner.type;
    const winnerSelector = winnerType === 'human' ? '.human-player' : 
                          winnerType === 'gemini' ? '.gemini-player' : 
                          winnerType === 'chatgpt' ? '.chatgpt-player' : 
                          winnerType === 'claude' ? '.claude-player' : null;
    
    const winnerElement = winnerSelector ? document.querySelector(winnerSelector) : null;
    
    if (winnerElement) {
        winnerElement.classList.add('winner');
        // Přidáme speciální zvýraznění pro vítěze
        const winnerColors = {
            'human': 'var(--neon-green)',
            'gemini': 'var(--neon-blue)',
            'chatgpt': 'var(--neon-pink)',
            'claude': 'var(--neon-orange)'
        };
        
        const color = winnerColors[winnerType] || 'var(--neon-yellow)';
        winnerElement.style.cssText = `
            background: rgba(0, 0, 0, 0.8) !important;
            border-color: ${color} !important;
            box-shadow: 0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color} !important;
            transform: scale(1.05) !important;
            z-index: 10 !important;
            animation: winner-pulse 1.5s ease-in-out infinite !important;
        `;
        
        // Zkontrolujeme, že animace a styly byly správně aplikovány
        console.log('🎯 Styly vítěze aplikovány na element:', winnerElement);
        console.log(`🎯 Barva vítěze: ${color}`);
    } else {
        console.error(`⚠️ Nepodařilo se najít element vítěze pro typ: ${winnerType}`);
    }
    
    document.getElementById('winnerAnnouncement').innerHTML = 
        winner.type === 'human' ? '🎉 Gratulujeme! Vyhrál(a) jste!' : `🏆 Vítězem se stává ${winner.name}!`;
    
    // Dynamicky vygeneruje zprávu o skóre
    let finalScoresHTML = '<strong>Konečné skóre:</strong><br>';
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
    
    try {
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
        
        // Show menu and hide game controls
        const gameHeader = document.getElementById('gameHeader');
        const gameControls = document.getElementById('gameControls');
        
        if (gameHeader) gameHeader.classList.remove('hidden');
        if (gameControls) gameControls.classList.add('hidden');
        
        // Remove game-active class to show avatars
        document.body.classList.remove('game-active');
        
        // Reset target score input to default
        const targetScoreInput = document.getElementById('targetScoreInput');
        if (targetScoreInput) {
            targetScoreInput.value = '10000';
        }
        
        // Resetování jakýchkoliv zůstatkových stavů tlačítek
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.disabled = false;
        });
        
        // Vyčistíme chat
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            // Ponecháme jen základní systémové zprávy pro začátek
            const systemMessages = chatContainer.querySelectorAll('.system-message');
            const otherMessages = chatContainer.querySelectorAll('.message:not(.system-message)');
            
            // Odstraníme zprávy, které nejsou systémové
            otherMessages.forEach(msg => msg.remove());
            
            // Ponecháme pouze první systémovou zprávu, pokud existuje
            if (systemMessages.length > 1) {
                for (let i = 1; i < systemMessages.length; i++) {
                    systemMessages[i].remove();
                }
            }
        }
        
        // Reset kostky
        const diceContainer = document.getElementById('diceContainer');
        if (diceContainer) {
            diceContainer.innerHTML = '';
        }
        
        // Reset banked dice
        const bankedDiceContainer = document.getElementById('bankedDiceContainer');
        if (bankedDiceContainer) {
            bankedDiceContainer.innerHTML = '';
        }
        
        console.log('✅ Návrat do hlavního menu dokončen');
    } catch (error) {
        console.error('⚠️ Chyba při návratu do menu:', error);
        // I při chybě se pokusíme vrátit do menu
        resetGameState();
    }
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
    
    // Clear signature input after saving
    const signatureInput = document.getElementById('winnerSignature');
    if (signatureInput) {
        signatureInput.value = '';
    }
    
    // Hide signature section since score is now saved
    const signatureSection = document.getElementById('signatureSection');
    if (signatureSection) {
        signatureSection.classList.add('hidden');
    }
    
    // Show success message
    window.addChatMessage('system', `🏆 Skóre uloženo do síně slávy jako "${signature}"!`);
    
    // Show success feedback in the modal
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        const modalBody = gameOverModal.querySelector('.modal-body');
        if (modalBody) {
            // Add success message to modal
            let successMsg = modalBody.querySelector('.save-success');
            if (!successMsg) {
                successMsg = document.createElement('div');
                successMsg.className = 'save-success';
                successMsg.style.cssText = `
                    color: var(--neon-green);
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid var(--neon-green);
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px 0;
                    text-align: center;
                    animation: neon-glow 2s ease-in-out infinite;
                `;
                modalBody.insertBefore(successMsg, modalBody.querySelector('.modal-actions'));
            }
            successMsg.innerHTML = `🏆 Skóre úspěšně uloženo do Síně slávy jako "<strong>${signature}</strong>"!<br><small>Můžete si nyní vybrat další akci:</small>`;
        }
    }
    
    console.log('🏆 Skóre uloženo do síně slávy!');
}

/**
 * Uloží výsledek hry do síně slávy (Hall of Fame)
 */
export function saveToHallOfFame() {
    console.log('🏆 Ukládání výsledku do síně slávy...');
    
    try {
        // Získat podpis vítěze
        const signatureInput = document.getElementById('winnerSignature');
        if (!signatureInput) {
            console.error('⚠️ Element podpisu nenalezen!');
            return;
        }
        
        const signature = signatureInput.value.trim();
        if (!signature) {
            alert('Prosím zadejte své jméno!');
            return;
        }
        
        // Ochrana proti XSS
        const sanitizedSignature = signature
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        
        // Zkontrolujeme, zda hra již skončila a máme platné skóre
        if (!gameState.gameEnded) {
            console.error('⚠️ Pokus o uložení skóre před koncem hry!');
            return;
        }
        
        const winner = gameState.players.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current);
        
        // Pouze lidští hráči mohou ukládat do síně slávy
        if (winner.type !== 'human') {
            alert('Do síně slávy se mohou ukládat pouze výsledky lidských hráčů!');
            return;
        }
        
        // Vytvoření objektu výsledku
        const gameResult = createGameResult(gameState, sanitizedSignature, gameState.gameStartTime, gameState.totalTurns || 0);
        
        // Uložení výsledku
        saveGameResult(gameResult);
        
        // Clear signature input after saving
        if (signatureInput) {
            signatureInput.value = '';
        }
        
        // Hide signature section since score is now saved
        const signatureSection = document.getElementById('signatureSection');
        if (signatureSection) {
            signatureSection.classList.add('hidden');
        }
        
        // Show success message
        window.addChatMessage('system', `🏆 Skóre uloženo do síně slávy jako "${sanitizedSignature}"!`);
        
        // Show success feedback in the modal
        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal) {
            const modalBody = gameOverModal.querySelector('.modal-body');
            if (modalBody) {
                // Add success message to modal
                let successMsg = modalBody.querySelector('.save-success');
                if (!successMsg) {
                    successMsg = document.createElement('div');
                    successMsg.className = 'save-success';
                    successMsg.style.cssText = `
                        color: var(--neon-green);
                        background: rgba(57, 255, 20, 0.1);
                        border: 1px solid var(--neon-green);
                        border-radius: 5px;
                        padding: 10px;
                        margin: 10px 0;
                        text-align: center;
                        animation: neon-glow 2s ease-in-out infinite;
                    `;
                    modalBody.insertBefore(successMsg, modalBody.querySelector('.modal-actions'));
                }
                successMsg.innerHTML = `🏆 Skóre úspěšně uloženo do Síně slávy jako "<strong>${sanitizedSignature}</strong>"!<br><small>Můžete si nyní vybrat další akci:</small>`;
            }
        }
        
        console.log('🏆 Skóre uloženo do síně slávy!');
    } catch (error) {
        console.error('⚠️ Chyba při ukládání do síně slávy:', error);
        alert('Nastala chyba při ukládání výsledku. Zkuste to prosím znovu.');
    }
}
