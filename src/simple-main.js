// simple-main.js - Zjednodušená verze bez komplikací
import './styles/main.css';
import './styles/components.css';
import './styles/game.css';
import './styles/chat.css';

// Základní inicializace
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎲 Jednoduchá inicializace...');
    
    // Základní UI events
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            console.log('Hra začíná...');
            document.getElementById('targetScoreSetup').style.display = 'none';
            document.getElementById('gameControls').style.display = 'block';
            
            // Jednoduchá zpráva
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="chat-message" style="margin-bottom: 12px; padding: 10px 15px; border-radius: 8px; background: #000; border: 1px solid #39ff14; color: #39ff14;">
                        <div class="message-header" style="margin-bottom: 8px;">
                            <span style="color: #39ff14;">Systém</span>
                            <span style="color: #666; margin-left: 10px;">${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div class="message-content">
                            🎲 Hra začala! Hodíte kostky?
                        </div>
                    </div>
                `;
            }
        });
    }
    
    // Hod kostky
    const rollBtn = document.getElementById('rollBtn');
    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            console.log('Házím kostky...');
            const diceContainer = document.getElementById('diceContainer');
            if (diceContainer) {
                // Simulace hodu kostek
                const dice = [];
                for (let i = 0; i < 6; i++) {
                    dice.push(Math.floor(Math.random() * 6) + 1);
                }
                
                diceContainer.innerHTML = dice.map((value, index) => `
                    <div class="die" style="display: inline-block; width: 50px; height: 50px; margin: 5px; background: #000; border: 2px solid #39ff14; border-radius: 8px; text-align: center; line-height: 46px; color: #39ff14; font-size: 24px; cursor: pointer;">
                        ${value}
                    </div>
                `).join('');
                
                // Zpráva do chatu
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML += `
                        <div class="chat-message" style="margin-bottom: 12px; padding: 10px 15px; border-radius: 8px; background: #000; border: 1px solid #39ff14; color: #39ff14;">
                            <div class="message-header" style="margin-bottom: 8px;">
                                <span style="color: #39ff14;">Systém</span>
                                <span style="color: #666; margin-left: 10px;">${new Date().toLocaleTimeString()}</span>
                            </div>
                            <div class="message-content">
                                🎲 Hodil jste: ${dice.join(', ')}
                            </div>
                        </div>
                    `;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        });
    }
    
    // Chat
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    const sendMessage = () => {
        if (!chatInput.value.trim()) return;
        
        const message = chatInput.value.trim();
        const chatMessages = document.getElementById('chatMessages');
        
        if (chatMessages) {
            // Lidská zpráva
            chatMessages.innerHTML += `
                <div class="chat-message" style="margin-bottom: 12px; padding: 10px 15px; border-radius: 8px; background: #000; border: 1px solid #39ff14; color: #39ff14;">
                    <div class="message-header" style="margin-bottom: 8px;">
                        <span style="color: #39ff14;">Vy</span>
                        <span style="color: #666; margin-left: 10px;">${new Date().toLocaleTimeString()}</span>
                    </div>
                    <div class="message-content">
                        ${message}
                    </div>
                </div>
            `;
            
            // AI odpověď
            setTimeout(() => {
                const aiResponses = [
                    "Gemini: Zajímavé pozorování! 📊",
                    "ChatGPT: Haha, to bylo vtipné! 😂",
                    "Claude: Hluboká myšlenka... 🤔"
                ];
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                
                chatMessages.innerHTML += `
                    <div class="chat-message" style="margin-bottom: 12px; padding: 10px 15px; border-radius: 8px; background: #000; border: 1px solid #0099ff; color: #0099ff;">
                        <div class="message-header" style="margin-bottom: 8px;">
                            <span style="color: #0099ff;">AI</span>
                            <span style="color: #666; margin-left: 10px;">${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div class="message-content">
                            ${randomResponse}
                        </div>
                    </div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        chatInput.value = '';
    };
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('✅ Jednoduchá aplikace inicializována!');
});
