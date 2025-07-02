/**
 * Enhanced AI Personalities - Modularized
 * Kombinuje personality z jednotlivých modulů pro lepší maintainability
 */

import { basePersonalities } from './personalities/basePersonalities.js';
import { geminiPersonality } from './personalities/geminiPersonality.js';
import { chatgptPersonality } from './personalities/chatgptPersonality.js';
import { claudePersonality } from './personalities/claudePersonality.js';

export const aiPersonalities = {
    ...basePersonalities,
    gemini: geminiPersonality,
    chatgpt: chatgptPersonality,
    claude: claudePersonality
};

// Export také pro zpětnou kompatibilitu
export default aiPersonalities;
