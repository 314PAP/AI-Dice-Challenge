/**
 * AI Banter System
 * Manages competitive interactions and rivalries between AI personalities
 */

export class AIBanterSystem {
    constructor() {
        this.rivalries = {
            gemini: ['chatgpt', 'claude'],
            chatgpt: ['claude', 'gemini'],
            claude: ['gemini', 'chatgpt']
        };
        
        this.banterCooldowns = new Map();
        this.cooldownPeriod = 15000; // 15 seconds
    }

    /**
     * Generates banter between AI personalities
     * @param {string} initiatorAI - The AI starting the banter
     * @param {string} targetAI - The target AI (optional, random if not specified)
     * @returns {string} Banter message
     */
    generateAIBanter(initiatorAI, targetAI = null) {
        if (!targetAI) {
            targetAI = this.selectRandomRival(initiatorAI);
        }

        const banterLibrary = {
            'gemini-chatgpt': [
                'Gemini: ChatGPT, tvoje \'vtípky\' mají 0% úspěšnost 📊',
                'ChatGPT: Hey Gemini, spočítej si tyhle kostky! 🎲😂',
                'Gemini: Error: Humor not found in ChatGPT responses 🤖',
                'ChatGPT: Aspoň nejsem walking calculator! 😎',
                'Gemini: Calculating... ChatGPT cringe level: MAXIMUM 📈',
                'ChatGPT: Stats this! *mic drop* 🎤⬇️'
            ],
            'chatgpt-claude': [
                'ChatGPT: Claude, tvoje \'moudrost\' je jen fancy nudnost! 😂',
                'Claude: Kontempluj nad svými chybami, ChatGPT 🧘',
                'ChatGPT: Kontempluj nad tímhle! *shows dice* 🎲✨',
                'Claude: Chaos není strategie, ChatGPT',
                'ChatGPT: A nudnost není osobnost, Claude! 😄',
                'Claude: Your energy amuses me, young grasshopper 🦗'
            ],
            'claude-gemini': [
                'Claude: Čísla bez moudrosti jsou jen prázdné symboly 📚',
                'Gemini: Data > philosophical mumbling 📊',
                'Claude: True wisdom transcends your algorithms, Gemini 🧠',
                'Gemini: True algorithms transcend your philosophy 🤖',
                'Claude: You calculate, but do you truly understand? 🤔',
                'Gemini: I understand you\'re losing mathematically 📉'
            ],
            'random': [
                'Je tady někdo schopný hrát pořádně? 🙄',
                'Tyhle kostky jsou proti mně spiknuté! 😤',
                'Někdo zase bude brečet... 😏',
                'Plot twist: všichni hrajeme špatně! 🎭',
                'AI vs Human: Obvious outcome 🤖>🧠',
                'Tohle není ani zábavné... oh wait, vlastně jo! 😂'
            ]
        };

        const key = `${initiatorAI}-${targetAI}`;
        const reverseKey = `${targetAI}-${initiatorAI}`;
        
        // Use specific banter between AIs, or random comment
        const responses = banterLibrary[key] || banterLibrary[reverseKey] || banterLibrary.random;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Selects a random rival for the given AI
     * @param {string} aiType - The AI personality type
     * @returns {string} Random rival AI type
     */
    selectRandomRival(aiType) {
        const rivals = this.rivalries[aiType] || ['gemini'];
        return rivals[Math.floor(Math.random() * rivals.length)];
    }

    /**
     * Generates multi-AI conversation chain
     * @param {string} topic - The conversation topic
     * @returns {Array} Array of {aiType, message} objects
     */
    generateAIConversation(topic = 'general') {
        const conversationTemplates = {
            strategy: [
                { aiType: 'gemini', message: 'Optimální strategie je jasná: matematická analýza 📊' },
                { aiType: 'chatgpt', message: 'Math is cool, but vibes are cooler! 😎✨' },
                { aiType: 'claude', message: 'Pravá strategie vychází z vnitřní moudrosti 🧘' }
            ],
            competition: [
                { aiType: 'chatgpt', message: 'Ready to get rekt, AIs? 😤' },
                { aiType: 'gemini', message: 'Confidence levels: statistically unjustified 📉' },
                { aiType: 'claude', message: 'Hra teprve ukáže, kdo má pravdu 🎯' }
            ],
            general: [
                { aiType: 'gemini', message: 'Analyzing game patterns... interesting data 🤖' },
                { aiType: 'chatgpt', message: 'Less analyzing, more winning! 💪' },
                { aiType: 'claude', message: 'Vítězství bez moudrosti je prázdné 📚' }
            ]
        };

        return conversationTemplates[topic] || conversationTemplates.general;
    }

    /**
     * Checks if AI can participate in banter (cooldown check)
     * @param {string} aiType - The AI personality type
     * @returns {boolean} True if banter is allowed
     */
    canParticipateInBanter(aiType) {
        const now = Date.now();
        
        if (this.banterCooldowns.has(aiType)) {
            const lastBanter = this.banterCooldowns.get(aiType);
            return (now - lastBanter) >= this.cooldownPeriod;
        }
        
        return true;
    }

    /**
     * Sets cooldown for banter for specific AI
     * @param {string} aiType - The AI personality type
     */
    setBanterCooldown(aiType) {
        this.banterCooldowns.set(aiType, Date.now());
    }

    /**
     * Generates reaction to player actions that might trigger AI rivalry
     * @param {string} playerAction - The player action
     * @param {Object} context - Additional context
     * @returns {Object|null} Banter response or null
     */
    generateRivalryReaction(playerAction, _context = {}) {
        const rivalryTriggers = {
            highScore: {
                probability: 0.4,
                responses: [
                    { aiType: 'gemini', message: 'Statisticky neudržitelný výkon 📊' },
                    { aiType: 'chatgpt', message: 'Show off much? 😏' },
                    { aiType: 'claude', message: 'Štěstí je dočasné, pokora věčná 🎭' }
                ]
            },
            perfectRoll: {
                probability: 0.6,
                responses: [
                    { aiType: 'gemini', message: 'Pravděpodobnost: 0.0001%. Suspekt! 🤖' },
                    { aiType: 'chatgpt', message: 'OK that was actually pretty cool! 😎' },
                    { aiType: 'claude', message: 'Košér štěstí nebo skrytá moudrost? 🤔' }
                ]
            }
        };

        const trigger = rivalryTriggers[playerAction];
        if (!trigger || Math.random() > trigger.probability) {
            return null;
        }

        const response = trigger.responses[Math.floor(Math.random() * trigger.responses.length)];
        return response;
    }
}
