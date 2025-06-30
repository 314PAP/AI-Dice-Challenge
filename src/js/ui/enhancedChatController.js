/**
 * Legacy Wrapper - Enhanced Chat Controller
 * Pro zpětnou kompatibilitu s původním kódem
 */

// Import nového modulárního systému
import { EnhancedChatController } from '../../ui/chat/enhancedChatController.js';

// Globální instance pro legacy kompatibilitu
let globalChatController = null;

/**
 * Legacy inicializační funkce
 */
export function initializeChat() {
    if (!globalChatController) {
        globalChatController = new EnhancedChatController();
        globalChatController.initialize();
    }
    return globalChatController;
}

/**
 * Legacy export třídy
 */
export { EnhancedChatController };

/**
 * Legacy globální funkce
 */
export function getChatController() {
    return globalChatController || initializeChat();
}

// Pro zpětnou kompatibilitu - automatická inicializace
document.addEventListener('DOMContentLoaded', () => {
    if (!globalChatController) {
        initializeChat();
    }
});

console.log('🔄 Legacy Enhanced Chat Controller wrapper loaded');
