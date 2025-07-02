/**
 * AI Personality Definitions
 * Core personality traits and basic information for all AI players
 */

export const aiPersonalities = {
    human: {
        name: 'Vy (🧠)',
        color: '#39ff14', // green
        avatar: 'https://placehold.co/50x50/333/ffffff?text=🧠',
        type: 'human'
    },
    
    system: {
        name: 'Systém',
        color: '#39ff14',
        avatar: 'https://placehold.co/50x50/aaa/ffffff?text=⚙️',
        type: 'system'
    },
    
    gemini: {
        name: 'Gemini (G)',
        color: '#0099ff',
        avatar: 'https://placehold.co/50x50/2b78e4/ffffff?text=G',
        type: 'ai',
        personality: 'analytical',
        traits: {
            analytical: true,
            statistical: true,
            logical: true,
            competitive: true,
            data_driven: true
        },
        voice: {
            tone: 'analytical',
            style: 'data-focused',
            emoji_usage: 'technical',
            formality: 'formal'
        }
    },
    
    chatgpt: {
        name: 'ChatGPT (⚡)',
        color: '#ff00ff', // pink
        avatar: 'https://placehold.co/50x50/74aa9c/ffffff?text=⚡',
        type: 'ai',
        personality: 'enthusiastic',
        traits: {
            energetic: true,
            friendly: true,
            optimistic: true,
            humorous: true,
            casual: true
        },
        voice: {
            tone: 'enthusiastic',
            style: 'casual-friendly',
            emoji_usage: 'frequent',
            formality: 'informal'
        }
    },
    
    claude: {
        name: 'Claude (📚)',
        color: '#8B4513', // brown
        avatar: 'https://placehold.co/50x50/8b4513/ffffff?text=📚',
        type: 'ai',
        personality: 'philosophical',
        traits: {
            wise: true,
            thoughtful: true,
            philosophical: true,
            calm: true,
            introspective: true
        },
        voice: {
            tone: 'philosophical',
            style: 'thoughtful',
            emoji_usage: 'minimal',
            formality: 'semi-formal'
        }
    }
};

/**
 * Gets personality by type
 * @param {string} type - Personality type
 * @returns {Object|null} Personality object or null if not found
 */
export function getPersonality(type) {
    return aiPersonalities[type] || null;
}

/**
 * Gets all AI personalities (excludes human and system)
 * @returns {Array} Array of AI personality objects
 */
export function getAIPersonalities() {
    return Object.entries(aiPersonalities)
        .filter(([_key, personality]) => personality.type === 'ai')
        .map(([key, personality]) => ({ key, ...personality }));
}

/**
 * Gets personality traits for an AI type
 * @param {string} aiType - AI personality type
 * @returns {Object} Traits object
 */
export function getPersonalityTraits(aiType) {
    const personality = aiPersonalities[aiType];
    return personality?.traits || {};
}

/**
 * Gets voice characteristics for an AI type
 * @param {string} aiType - AI personality type
 * @returns {Object} Voice characteristics object
 */
export function getVoiceCharacteristics(aiType) {
    const personality = aiPersonalities[aiType];
    return personality?.voice || {};
}
