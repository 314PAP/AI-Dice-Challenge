/**
 * Test chat functionality
 */
console.log('🧪 Chat functionality test');

// Simulace kliknutí na tlačítko
setTimeout(() => {
    console.log('🔍 Looking for chat elements...');
    
    const chatInput = document.getElementById('chatInput');
    const chatBtn = document.getElementById('sendChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatInput) {
        console.log('✅ Chat input found');
    } else {
        console.log('❌ Chat input NOT found');
    }
    
    if (chatBtn) {
        console.log('✅ Chat button found');
        console.log('🎯 Chat button classes:', chatBtn.className);
        console.log('🎯 Chat button ID:', chatBtn.id);
    } else {
        console.log('❌ Chat button NOT found');
    }
    
    if (chatMessages) {
        console.log('✅ Chat messages container found');
    } else {
        console.log('❌ Chat messages container NOT found');
    }
    
    // Test event listener
    if (chatBtn) {
        console.log('🧪 Testing chat button click...');
        chatBtn.addEventListener('click', () => {
            console.log('💬 Chat button clicked!');
        });
    }
    
}, 2000);

// Global test function
window.testChatSend = function() {
    console.log('🧪 Manual chat test...');
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = 'Test zpráva';
        console.log('✅ Test message set');
        
        // Simulate click
        const chatBtn = document.getElementById('sendChatBtn');
        if (chatBtn) {
            chatBtn.click();
            console.log('✅ Button clicked');
        }
    }
};

console.log('🎯 Test loaded. Use window.testChatSend() in console to test manually.');
