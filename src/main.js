// main.js - Hlavní vstupní bod aplikace
// Importy CSS - nová modulární struktura
import './styles/base/reset.css';
import './styles/base/layout.css';
import './styles/components/buttons.css';
import './styles/components/players.css';
import './styles/components/chat.css';
import './styles/components/dice.css';
import './styles/themes/neon.css';

// Základní inicializace bez komplikovaných importů
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎲 AI Kostková Výzva - Inicializace...');
    
    try {
        // Inicializace modulů postupně s error handlingem
        console.log('📦 Načítám main game controller...');
        const { MainGameController } = await import('./game/mainGameController.js');
        
        console.log('🎨 Načítám UI controller...');
        const { setupUI } = await import('./js/ui/uiController.js');
        
        console.log('💬 Načítám enhanced chat controller...');
        const { EnhancedChatController } = await import('./ui/chat/enhancedChatController.js');
        
        // Inicializace jednotlivých modulů s novou architekturou
        const mainGameController = new MainGameController();
        const chatController = new EnhancedChatController();
        
        // Inicializace systému
        await mainGameController.initialize();
        await chatController.initialize();
        setupUI();
        
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
