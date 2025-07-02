/**
 * 💬 Chat Controller - Modernized with Functional Programming
 * Enhanced with Ramda + Lodash-ES for optimal chat performance
 */

import { pipe, when, unless, cond, always, T, curry, compose } from 'ramda';
import { debounce, throttle, memoize, isEmpty, escape } from 'lodash-es';
import { aiPersonalities } from '../ai/personalities.js';
import { generateAIChatResponse } from '../ai/aiController.js';
import { gameState } from '../game/gameState.js';
import { safeGetElement, safeExecute } from '../utils/gameUtils.js';
import { emitter, EVENTS } from '../utils/optimizedEvents.js';

// 🎨 CHAT STYLING MAP - Functional color/icon assignment
const chatStyleMap = {
    system: { color: 'var(--neon-yellow)', icon: '🎲', border: 'var(--neon-yellow)' },
    human: { color: 'var(--neon-blue)', icon: '👤', border: 'var(--neon-blue)' },
    gemini: { color: 'var(--neon-green)', icon: '🤖', border: 'var(--neon-orange)' },
    chatgpt: { color: 'var(--neon-green)', icon: '🧠', border: 'var(--neon-blue)' },
    claude: { color: 'var(--neon-green)', icon: '⚡', border: 'var(--neon-orange)' }
};

// 📜 CHAT HISTORY - Functional storage
let chatHistory = [];
const maxChatHistory = 100;

// 🎯 INITIALIZE CHAT SYSTEM - Functional setup
export const initializeChat = pipe(
    () => console.log('💬 Initializing modernized chat system...'),
    () => {
        const chatHandlers = [
            ['chatInput', 'keypress', handleChatKeyPress],
            ['sendMessageBtn', 'click', sendMessage],
            ['chatToggle', 'click', toggleChat]
        ];
        
        chatHandlers.forEach(([id, event, handler]) => {
            when(
                Boolean,
                (element) => element.addEventListener(event, debounce(handler, 200))
            )(safeGetElement(id));
        });
    },
    () => loadChatHistory(),
    () => addChatMessage('system', '🎲 Vítejte v AI Kostkové Výzvě! Nastavte své cílové skóre a začněte hrát!'),
    () => console.log('✅ Modernized chat system ready!')
);

// 💬 MESSAGE CREATOR - Functional message rendering
const createChatMessage = curry((senderType, message) => {
    const messageDiv = document.createElement('div');
    const style = chatStyleMap[senderType] || chatStyleMap.system;
    
    messageDiv.className = `chat-message ${senderType}-message`;
    messageDiv.style.borderLeft = `3px solid ${style.border}`;
    
    messageDiv.innerHTML = `
        <div class="chat-message-header">
            <span class="chat-icon">${style.icon}</span>
            <span class="chat-sender" style="color: ${style.color};">
                ${getSenderName(senderType)}
            </span>
            <span class="chat-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="chat-message-content" style="color: ${style.color};">
            ${escape(message)}
        </div>
    `;
    
    return messageDiv;
});

// 🏷️ SENDER NAME RESOLVER - Functional name mapping
const getSenderName = cond([
    [(type) => type === 'system', always('Systém')],
    [(type) => type === 'human', always('Vy')],
    [(type) => type === 'gemini', always('Gemini')],
    [(type) => type === 'chatgpt', always('ChatGPT')],
    [(type) => type === 'claude', always('Claude')],
    [T, (type) => type.charAt(0).toUpperCase() + type.slice(1)]
]);

// 📤 ADD CHAT MESSAGE - Enhanced with functional composition
export const addChatMessage = curry((senderType, message) => {
    const chatMessages = safeGetElement('chatMessages');
    
    unless(
        Boolean,
        () => {
            console.warn('⚠️ Chat messages container not found');
            return;
        }
    )(chatMessages);
    
    when(
        Boolean,
        (container) => {
            const messageElement = createChatMessage(senderType, message);
            container.appendChild(messageElement);
            
            // Add to history
            chatHistory.push({ senderType, message, timestamp: new Date() });
            
            // Limit history size
            if (chatHistory.length > maxChatHistory) {
                chatHistory = chatHistory.slice(-maxChatHistory);
            }
            
            // Auto-scroll to bottom with smooth animation
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
            
            // Emit chat event
            emitter.emit(EVENTS.CHAT_MESSAGE, { senderType, message });
        }
    )(chatMessages);
    
    // Save to localStorage
    saveChatHistory();
});

// 📨 SEND MESSAGE HANDLER - Functional message processing
const sendMessage = pipe(
    () => safeGetElement('chatInput'),
    unless(Boolean, () => {
        console.warn('⚠️ Chat input not found');
        return '';
    }),
    (input) => {
        const message = input.value.trim();
        input.value = '';
        return message;
    },
    when(
        (message) => !isEmpty(message),
        (message) => {
            addChatMessage('human', message);
            triggerAIResponses(message);
        }
    )
);

// 🤖 AI RESPONSE TRIGGER - Enhanced response system
const triggerAIResponses = throttle((userMessage) => {
    const aiTypes = ['gemini', 'chatgpt', 'claude'];
    
    aiTypes.forEach((aiType, index) => {
        setTimeout(() => {
            safeExecute(() => {
                const response = generateAIChatResponse(aiType, userMessage);
                if (response) {
                    addChatMessage(aiType, response);
                }
            }, null, `AI Response ${aiType}`);
        }, 800 + (index * 400));
    });
}, 1000);

// ⌨️ KEYBOARD HANDLER - Functional key handling
const handleChatKeyPress = (event) => {
    when(
        () => event.key === 'Enter' && !event.shiftKey,
        () => {
            event.preventDefault();
            sendMessage();
        }
    )();
};

// 🔄 CHAT TOGGLE - Functional visibility management
const toggleChat = () => {
    const chatContainer = safeGetElement('chatContainer');
    
    when(
        Boolean,
        (container) => {
            const isHidden = container.classList.contains('hidden');
            container.classList.toggle('hidden', !isHidden);
            
            // Focus input when opening
            when(
                () => !isHidden,
                () => {
                    const input = safeGetElement('chatInput');
                    when(Boolean, (el) => el.focus())(input);
                }
            )();
        }
// 🔄 CHAT TOGGLE - Functional visibility management
const toggleChat = () => {
    const chatContainer = safeGetElement('chatContainer');
    
    when(
        Boolean,
        (container) => {
            const isHidden = container.classList.contains('hidden');
            container.classList.toggle('hidden', !isHidden);
            
            // Focus input when opening
            when(
                () => !isHidden,
                () => {
                    const input = safeGetElement('chatInput');
                    when(Boolean, (el) => el.focus())(input);
                }
            )();
        }
    )(chatContainer);
};

// 💾 CHAT STORAGE - Functional persistence
const saveChatHistory = throttle(() => {
    safeExecute(() => {
        localStorage.setItem('aiDiceChatHistory', JSON.stringify(chatHistory));
    }, null, 'Save Chat History');
}, 1000);

const loadChatHistory = () => {
    safeExecute(() => {
        const stored = localStorage.getItem('aiDiceChatHistory');
        if (stored) {
            chatHistory = JSON.parse(stored);
            // Restore messages to UI
            chatHistory.forEach(({ senderType, message }) => {
                const messageElement = createChatMessage(senderType, message);
                const chatMessages = safeGetElement('chatMessages');
                when(Boolean, (container) => container.appendChild(messageElement))(chatMessages);
            });
        }
    }, null, 'Load Chat History');
};

// 🧹 CLEAR CHAT - Functional chat cleanup
export const clearChat = () => {
    chatHistory = [];
    const chatMessages = safeGetElement('chatMessages');
    
    when(
        Boolean,
        (container) => {
            container.innerHTML = '';
            saveChatHistory();
        }
    )(chatMessages);
};

// 📤 EXPORT MODERNIZED FUNCTIONS
export {
    sendMessage,
    handleChatKeyPress,
    toggleChat,
    saveChatHistory,
    loadChatHistory,
    createChatMessage,
    getSenderName
};

// 🌐 GLOBAL WINDOW FUNCTIONS - Legacy support
if (typeof window !== 'undefined') {
    window.addChatMessage = addChatMessage;
    window.sendMessage = sendMessage;
    window.toggleChat = toggleChat;
    window.clearChat = clearChat;
    window.initializeChat = initializeChat;
}

// 📊 DEFAULT EXPORT - Complete chat controller
export default {
    initializeChat,
    addChatMessage,
    sendMessage,
    handleChatKeyPress,
    toggleChat,
    saveChatHistory,
    loadChatHistory,
    createChatMessage,
    getSenderName,
    clearChat
};
