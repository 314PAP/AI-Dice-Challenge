/**
 * Event Setup Controller
 * Manages all event listeners and DOM event bindings for the game
 */

import { startGame, saveScore, startNewGame, returnToMainMenu, endTurn } from './gameFlowController.js';
import { rollDiceForPlayer, selectDie, bankSelectedDice } from './turnActionsController.js';
import { displayHallOfFame } from '../../utils/hallOfFame.js';

// Globální flag pro zabezpečení proti opakovanému nastavování event listenerů
let eventListenersSetup = false;

/**
 * Quit game function - return to main menu
 */
function quitGame() {
    console.log('🚪 Ukončuji hru...');
    if (window.confirm('Opravdu chcete ukončit hru?')) {
        returnToMainMenu();
    }
}

/**
 * Show rules modal
 */
export function showRules() {
    console.log('📖 Zobrazuji pravidla...');
    const rulesModal = document.getElementById('rulesModal');
    if (rulesModal) {
        rulesModal.classList.remove('hidden');
    }
}

/**
 * Hide rules modal
 */
export function hideRules() {
    console.log('🔙 Skrývám pravidla...');
    const rulesModal = document.getElementById('rulesModal');
    if (rulesModal) {
        rulesModal.classList.add('hidden');
    }
}

/**
 * Nastavuje event listenery pro herní prvky
 */
export function setupEventListeners() {
    if (eventListenersSetup) {
        console.log('⚠️ Event listenery už jsou nastavené, přeskakuji...');
        return;
    }
    
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

        // Save score button
        const saveScoreBtn = document.getElementById('saveScoreBtn');
        if (saveScoreBtn) {
            console.log('✅ Přidávám event listener pro Save Score');
            saveScoreBtn.addEventListener('click', saveScore);
        }
        
        // Hall of Fame button (main page)
        const hallOfFameBtn = document.getElementById('hallOfFameBtn');
        if (hallOfFameBtn) {
            console.log('✅ Přidávám event listener pro Hall of Fame');
            hallOfFameBtn.addEventListener('click', () => {
                console.log('🏆 Hall of Fame button clicked!');
                // For main page, we don't have a game over modal to return to
                // So we just show hall of fame and let user close it normally
                displayHallOfFame();
            });
        }
        
        // Close Hall of Fame button
        const closeHallOfFameBtn = document.getElementById('closeHallOfFameBtn');
        if (closeHallOfFameBtn) {
            console.log('✅ Přidávám event listener pro Close Hall of Fame');
            closeHallOfFameBtn.addEventListener('click', () => {
                const hallOfFameModal = document.getElementById('hallOfFameModal');
                const gameOverModal = document.getElementById('gameOverModal');
                
                // Hide hall of fame modal
                if (hallOfFameModal) {
                    hallOfFameModal.classList.add('hidden');
                    hallOfFameModal.classList.remove('visible');
                }
                
                // Check if we came from game over (after saving score)
                if (window.hallOfFameFromGameOver && gameOverModal && window.gameState && window.gameState.gameEnded) {
                    // Show game over modal again for other actions
                    gameOverModal.classList.remove('hidden');
                    gameOverModal.classList.add('visible');
                    // Reset the flag
                    window.hallOfFameFromGameOver = false;
                }
                // If opened from main page (game not ended), just close hall of fame
            });
        }
        
        // Show Hall of Fame from game over modal
        const showHallOfFameBtn = document.getElementById('showHallOfFameBtn');
        if (showHallOfFameBtn) {
            console.log('✅ Přidávám event listener pro Show Hall of Fame');
            showHallOfFameBtn.addEventListener('click', () => {
                // Hide game over modal
                const gameOverModal = document.getElementById('gameOverModal');
                if (gameOverModal) {
                    gameOverModal.classList.add('hidden');
                    gameOverModal.classList.remove('visible');
                }
                
                // Mark that we came from game over
                window.hallOfFameFromGameOver = true;
                
                // Show hall of fame modal
                displayHallOfFame();
            });
        }
        
        // Start new game button
        const startNewGameBtn = document.getElementById('startNewGameBtn');
        if (startNewGameBtn) {
            console.log('✅ Přidávám event listener pro Start New Game');
            startNewGameBtn.addEventListener('click', startNewGame);
        }
        
        // Return to menu button  
        const returnToMenuBtn = document.getElementById('returnToMenuBtn');
        if (returnToMenuBtn) {
            console.log('✅ Přidávám event listener pro Return to Menu');
            returnToMenuBtn.addEventListener('click', returnToMainMenu);
        }

        // Custom event listener pro výběr kostek z gameUI
        console.log('✅ Přidávám event listener pro dieSelected');
        document.addEventListener('dieSelected', (event) => {
            const { index } = event.detail;
            selectDie(index);
        });

        // Chat toggle button - vylepšeno pro mobilní layout
        const chatToggle = document.getElementById('chatToggle');
        if (chatToggle) {
            console.log('✅ Přidávám event listener pro Chat Toggle');
            chatToggle.addEventListener('click', () => {
                const chatPanel = document.getElementById('chatPanel');
                const chatBox = chatPanel?.querySelector('.h-100');
                
                if (chatBox) {
                    // Kontrola, zda jsme na mobilu
                    const isMobile = window.innerWidth <= 767.98;
                    
                    if (isMobile) {
                        // Mobilní verze - přepínání mezi sbalený/rozbalený
                        if (chatBox.classList.contains('chat-collapsed')) {
                            chatBox.classList.remove('chat-collapsed');
                            chatBox.classList.add('chat-expanded');
                            chatToggle.textContent = '−';
                            chatToggle.title = 'Sbalit chat';
                            // Scroll to bottom při rozbalení
                            setTimeout(() => {
                                const chatMessages = chatPanel.querySelector('.chat-messages');
                                if (chatMessages) {
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                }
                            }, 100);
                        } else {
                            chatBox.classList.remove('chat-expanded');
                            chatBox.classList.add('chat-collapsed');
                            chatToggle.textContent = '+';
                            chatToggle.title = 'Rozbalit chat';
                            // Zajistit zobrazení posledních zpráv
                            setTimeout(() => {
                                showLastMessages();
                            }, 100);
                        }
                    } else {
                        // Desktop verze - původní funkcionalita
                        chatPanel.classList.toggle('collapsed');
                        chatToggle.textContent = chatPanel.classList.contains('collapsed') ? '+' : '−';
                    }
                }
            });
            
            // Inicializace stavu na základě velikosti obrazovky
            const initializeChatState = () => {
                const chatPanel = document.getElementById('chatPanel');
                const chatBox = chatPanel?.querySelector('.h-100');
                const isMobile = window.innerWidth <= 767.98;
                
                if (isMobile && chatBox) {
                    // Na mobilu začínáme se sbaleným chatem
                    chatBox.classList.add('chat-collapsed');
                    chatToggle.textContent = '+';
                    chatToggle.title = 'Rozbalit chat';
                    // Zajistit zobrazení posledních zpráv
                    setTimeout(() => {
                        showLastMessages();
                    }, 200);
                } else if (chatBox) {
                    // Na desktopu je chat rozbalený
                    chatBox.classList.remove('chat-collapsed', 'chat-expanded');
                    chatToggle.textContent = '−';
                    chatToggle.title = 'Sbalit chat';
                }
            };
            
            // Inicializace při načtení
            initializeChatState();
            
            // Reinicializace při změně velikosti okna
            window.addEventListener('resize', initializeChatState);
        }
        
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

        // Modal close buttons
        setupModalEventListeners();
        
        // Keyboard shortcuts
        setupKeyboardShortcuts();

        console.log('✅ Event listenery nastaveny');
        eventListenersSetup = true; // Označit, že jsou event listenery nastavené
    }, 100);
}

// ========================================
// 📱 MOBILNÍ VERZE TLAČÍTEK
// ========================================

// Mobile Start Game button
const startGameBtnMobile = document.getElementById('startGameBtnMobile');
if (startGameBtnMobile) {
    console.log('✅ Přidávám event listener pro Mobile Start Game');
    startGameBtnMobile.addEventListener('click', () => {
        console.log('🚀 Mobile Start Game button clicked!');
        const targetScoreInputMobile = document.getElementById('targetScoreInputMobile');
        const targetScore = parseInt(targetScoreInputMobile.value);
        
        if (targetScore >= 1000) {
            startGame();
        } else {
            alert('Cílové skóre musí být alespoň 1000 bodů!');
        }
    });
}

// Mobile Rules button
const rulesBtnMobile = document.getElementById('rulesBtnMobile');
if (rulesBtnMobile) {
    console.log('✅ Přidávám event listener pro Mobile Rules');
    rulesBtnMobile.addEventListener('click', showRules);
}

// Mobile Hall of Fame button
const hallOfFameBtnMobile = document.getElementById('hallOfFameBtnMobile');
if (hallOfFameBtnMobile) {
    console.log('✅ Přidávám event listener pro Mobile Hall of Fame');
    hallOfFameBtnMobile.addEventListener('click', () => {
        console.log('🏆 Mobile Hall of Fame button clicked!');
        displayHallOfFame();
    });
}

// Mobile Exit Game button
const exitGameBtnMobile = document.getElementById('exitGameBtnMobile');
if (exitGameBtnMobile) {
    console.log('✅ Přidávám event listener pro Mobile Exit Game');
    exitGameBtnMobile.addEventListener('click', () => {
        console.log('🚪 Mobile Exit Game clicked!');
        window.location.href = 'https://github.com/pipap';
    });
}

// Mobile Quit Game button (během hry)
const quitGameBtnMobile = document.getElementById('quitGameBtnMobile');
if (quitGameBtnMobile) {
    console.log('✅ Přidávám event listener pro Mobile Quit Game');
    quitGameBtnMobile.addEventListener('click', quitGame);
}

// Mobile Chat toggle button
const toggleChatBtn = document.getElementById('toggleChatBtn');
if (toggleChatBtn) {
    console.log('✅ Přidávám event listener pro Mobile Chat Toggle');
    toggleChatBtn.addEventListener('click', toggleMobileChat);
}

// Mobile Chat send button
const sendChatBtnMobile = document.getElementById('sendChatBtnMobile');
const chatInputMobile = document.getElementById('chatInputMobile');
if (sendChatBtnMobile && chatInputMobile) {
    console.log('✅ Přidávám event listener pro Mobile Chat Send');
    sendChatBtnMobile.addEventListener('click', () => sendMobileChatMessage());
    chatInputMobile.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMobileChatMessage();
        }
    });
}

/**
 * Nastavuje event listenery pro modální okna
 */
function setupModalEventListeners() {
    // Game over modal close
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.addEventListener('click', (e) => {
            if (e.target === gameOverModal) {
                gameOverModal.classList.add('hidden');
            }
        });
    }
    
    // Hall of fame modal close
    const hallOfFameModal = document.getElementById('hallOfFameModal');
    if (hallOfFameModal) {
        hallOfFameModal.addEventListener('click', (e) => {
            if (e.target === hallOfFameModal) {
                hallOfFameModal.classList.add('hidden');
            }
        });
    }

    // Rules modal close
    const rulesModal = document.getElementById('rulesModal');
    if (rulesModal) {
        rulesModal.addEventListener('click', (e) => {
            if (e.target === rulesModal) {
                rulesModal.classList.add('hidden');
            }
        });
    }
}

/**
 * Nastavuje klávesové zkratky pro hru
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Pouze když není zaměřený input element
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            switch (e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    rollDiceForPlayer();
                    break;
                case 'b':
                    e.preventDefault();
                    bankSelectedDice();
                    break;
                case 'e':
                    e.preventDefault();
                    endTurn(true);
                    break;
                case 'escape':
                    e.preventDefault();
                    // Zavřít modály
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.classList.add('hidden');
                    });
                    break;
            }
        }
    });
}

/**
 * Resetuje flag pro event listenery (používá se při restartu hry)
 */
export function resetEventListeners() {
    console.log('🔄 Resetuji flag pro event listenery');
    eventListenersSetup = false;
}

// New Game from Hall of Fame
        const newGameFromHallBtn = document.getElementById('newGameFromHallBtn');
        if (newGameFromHallBtn) {
            console.log('✅ Přidávám event listener pro New Game from Hall');
            newGameFromHallBtn.addEventListener('click', () => {
                // Hide hall of fame modal
                const hallOfFameModal = document.getElementById('hallOfFameModal');
                if (hallOfFameModal) {
                    hallOfFameModal.classList.add('hidden');
                    hallOfFameModal.classList.remove('visible');
                }
                // Start new game
                startNewGame();
                // Reset the flag
                window.hallOfFameFromGameOver = false;
            });
        }
        
        // Main Menu from Hall of Fame
        const mainMenuFromHallBtn = document.getElementById('mainMenuFromHallBtn');
        if (mainMenuFromHallBtn) {
            console.log('✅ Přidávám event listener pro Main Menu from Hall');
            mainMenuFromHallBtn.addEventListener('click', () => {
                // Hide hall of fame modal
                const hallOfFameModal = document.getElementById('hallOfFameModal');
                if (hallOfFameModal) {
                    hallOfFameModal.classList.add('hidden');
                    hallOfFameModal.classList.remove('visible');
                }
                // Return to main menu
                returnToMainMenu();
                // Reset the flag
                window.hallOfFameFromGameOver = false;
            });
        }
        
        /**
 * Show last messages in collapsed chat on mobile
 */
function showLastMessages() {
    // Pro mobilní chat
    const chatMessagesMobile = document.getElementById('chatMessagesMobile');
    if (chatMessagesMobile) {
        const messagesMobile = chatMessagesMobile.querySelectorAll('.chat-message');
        if (messagesMobile.length <= 2) return;
        
        // Hide all but last 2 messages
        messagesMobile.forEach((message, index) => {
            if (index < messagesMobile.length - 2) {
                message.style.display = 'none';
            } else {
                message.style.display = 'block';
            }
        });
    }
    
    // Pro desktop chat
    const chatMessages = document.querySelector('#chatPanel .chat-messages');
    if (!chatMessages) return;
    
    const messages = chatMessages.querySelectorAll('.chat-message');
    if (messages.length <= 2) return;
    
    // Hide all but last 2 messages
    messages.forEach((message, index) => {
        if (index < messages.length - 2) {
            message.style.display = 'none';
        } else {
            message.style.display = 'block';
        }
    });
}

/**
 * Toggle mobile chat - přepíná mezi sbaleným a rozbaleným chatem na mobilních zařízeních
 */
function toggleMobileChat() {
    console.log('📱 Přepínám mobilní chat');
    const chatBox = document.getElementById('chatPanelMobile');
    const toggleIcon = document.getElementById('toggleChatIcon');
    
    if (!chatBox || !toggleIcon) return;
    
    if (chatBox.classList.contains('chat-collapsed')) {
        // Rozbalení chatu
        chatBox.classList.remove('chat-collapsed');
        chatBox.classList.add('chat-expanded');
        toggleIcon.classList.remove('ri-arrow-up-line');
        toggleIcon.classList.add('ri-arrow-down-line');
        
        // Zobrazit všechny zprávy
        const messages = chatBox.querySelectorAll('.chat-message');
        messages.forEach(message => {
            message.style.display = 'block';
        });
        
        // Scroll na konec
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessagesMobile');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 100);
    } else {
        // Sbalení chatu
        chatBox.classList.remove('chat-expanded');
        chatBox.classList.add('chat-collapsed');
        toggleIcon.classList.remove('ri-arrow-down-line');
        toggleIcon.classList.add('ri-arrow-up-line');
        
        // Zobrazit jen poslední zprávy
        setTimeout(() => {
            showLastMessages();
        }, 100);
    }
}

/**
 * Odeslat zprávu z mobilního chatu
 */
function sendMobileChatMessage() {
    const chatInput = document.getElementById('chatInputMobile');
    if (!chatInput || !chatInput.value.trim()) return;
    
    // Zde by byla logika pro odeslání zprávy do chatu
    // TODO: Implementovat správnou logiku pro AI chat
    
    const message = chatInput.value.trim();
    console.log('📱 Odesílám zprávu z mobilního chatu:', message);
    
    // Přidat zprávu do chatu
    const chatMessages = document.getElementById('chatMessagesMobile');
    if (chatMessages) {
        const newMessage = document.createElement('div');
        newMessage.className = 'chat-message text-light mb-1';
        newMessage.style.fontSize = '0.75rem';
        newMessage.innerHTML = `<strong>Vy:</strong> ${message}`;
        chatMessages.appendChild(newMessage);
        
        // Vyčistit input
        chatInput.value = '';
        
        // Scroll na konec
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
