/**
 * 🎲 AI Dice Challenge - Template Test Version
 * Testovací verze pro ověření načítání šablon
 */

console.log('🎲 AI Dice Challenge - Template test version starting...');

// Testovací načítání šablony
async function testTemplateLoading() {
    console.log('🧪 Testing template loading...');
    
    try {
        // Test 1: Zkusit načíst šablonu
        console.log('📄 Attempting to load game menu template...');
        const response = await fetch('/src/templates/game-menu.html');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const templateHtml = await response.text();
        console.log('✅ Template loaded successfully, length:', templateHtml.length);
        console.log('📝 Template content preview:', templateHtml.substring(0, 200) + '...');
        
        // Test 2: Vložit šablonu do DOM
        const gameContent = document.getElementById('gameContent');
        if (gameContent) {
            gameContent.innerHTML = templateHtml;
            console.log('✅ Template inserted into gameContent');
            
            // Pokusit se zobrazit menu bez ohledu na responzivní třídy
            const gameHeader = document.getElementById('gameHeader');
            if (gameHeader) {
                gameHeader.classList.remove('d-none');
                gameHeader.classList.add('d-block');
                console.log('✅ Force showed game header');
            }
        } else {
            console.log('❌ gameContent element not found');
        }
        
        // Test 3: Zkusit načíst chat šablonu
        console.log('📄 Attempting to load chat template...');
        const chatResponse = await fetch('/src/templates/chat.html');
        
        if (chatResponse.ok) {
            const chatHtml = await chatResponse.text();
            console.log('✅ Chat template loaded, length:', chatHtml.length);
            
            const chatPanel = document.getElementById('chatPanel');
            if (chatPanel) {
                chatPanel.innerHTML = chatHtml;
                console.log('✅ Chat template inserted into chatPanel');
            }
        } else {
            console.log('❌ Chat template failed to load');
        }
        
        // Test 4: Zkontrolovat CSS styly
        const computedStyle = window.getComputedStyle(document.documentElement);
        const neonGreen = computedStyle.getPropertyValue('--neon-green');
        
        if (neonGreen && neonGreen.trim()) {
            console.log('✅ CSS variables loaded, --neon-green:', neonGreen);
        } else {
            console.log('❌ CSS variables not loaded or empty');
        }
        
        console.log('🎯 Template test complete!');
        
    } catch (error) {
        console.error('❌ Template loading error:', error);
    }
}

// Spustit test po načtení DOM
document.addEventListener('DOMContentLoaded', testTemplateLoading);

// Spustit test také okamžitě pro případy, kdy už je DOM načten
if (document.readyState === 'loading') {
    console.log('⏳ DOM is still loading, waiting...');
} else {
    console.log('✅ DOM is already loaded, running test immediately');
    testTemplateLoading();
}
