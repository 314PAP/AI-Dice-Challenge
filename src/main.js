// main.js - Hlavní vstupní bod aplikace
import './styles/main.css';
import './styles/components.css';
import './styles/game.css';
import './styles/chat.css';

// Základní inicializace bez komplikovaných importů
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 AI Kostková Výzva - Inicializace...');
    
    try {
        // Inicializace modulů postupně s error handlingem
        console.log('📦 Načítám game controller...');
        const { initializeGame } = await import('./js/game/gameController.js');
        
        console.log('🎨 Načítám UI controller...');
        const { initializeUI } = await import('./js/ui/uiController.js');
        
        console.log('💬 Načítám chat controller...');
        const { initializeChat } = await import('./js/ui/enhancedChatController.js');
        
        // Inicializace jednotlivých modulů
        initializeGame();
        initializeUI();
        initializeChat();
        
        console.log('✅ Aplikace byla úspěšně inicializována!');
        
    } catch (error) {
        console.error('❌ Chyba při inicializaci:', error);
        
        // Fallback na základní funkcionalita
        console.log('🔄 Spouštím základní režim...');
        
        // Základní funkcionalita pro start hry
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                document.getElementById('targetScoreSetup').style.display = 'none';
                document.getElementById('gameControls').style.display = 'block';
                
                // Základní zpráva
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML = `
                        <div class="chat-message">
                            <div class="message-header">
                                <span class="message-sender">Systém</span>
                                <span class="message-time">${new Date().toLocaleTimeString()}</span>
                            </div>
                            <div class="message-content">🎲 Hra začala! (Základní režim)</div>
                        </div>
                    `;
                }
            });
        }
    }
});
