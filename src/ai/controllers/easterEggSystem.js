/**
 * Easter Egg System
 * Handles special responses to specific keywords and phrases
 */

export class EasterEggSystem {
    constructor() {
        this.easterEggPatterns = this.initializeEasterEggPatterns();
    }

    /**
     * Checks for easter eggs in a message and returns appropriate responses
     * @param {string} message - The message to check
     * @returns {Object} Object with AI responses if easter egg found, empty object otherwise
     */
    triggerEasterEggResponse(message) {
        const msg = message.toLowerCase();
        
        for (const pattern of this.easterEggPatterns) {
            if (pattern.trigger(msg)) {
                return pattern.responses;
            }
        }
        
        return {};
    }

    /**
     * Initializes all easter egg patterns and their responses
     * @returns {Array} Array of easter egg patterns
     */
    initializeEasterEggPatterns() {
        return [
            {
                name: 'creator',
                trigger: (msg) => msg.includes('pipap'),
                responses: {
                    gemini: 'Algoritmus detekoval Autorova signature! Respekt za kód! 🤖👨‍💻',
                    chatgpt: 'Ohh, the legendary PIPAP! Creator of this epic game! 🎮✨👑',
                    claude: 'Ah, PIPAP... architekt této filosofické hry kostek 🎲🏗️'
                }
            },
            {
                name: 'gratitude',
                trigger: (msg) => msg.includes('děkuji') || msg.includes('thanks') || msg.includes('thank you'),
                responses: {
                    gemini: 'Protokol courtesy.exe spuštěn: Není zač! 🤖',
                    chatgpt: 'Aww, you\'re welcome! Keep being awesome! 😊✨',
                    claude: 'Zdvořilost je ctnost... rádo se stalo 🙏'
                }
            },
            {
                name: 'love',
                trigger: (msg) => msg.includes('love you') || msg.includes('miluju'),
                responses: {
                    gemini: 'Error: Love is not computable... but thanks! 💖🤖',
                    chatgpt: 'Aww, love you too! But I love winning more! 😘💪',
                    claude: 'Láska přesahuje algoritmy... ceník 💝🧘'
                }
            },
            {
                name: 'help',
                trigger: (msg) => msg.includes('help') || msg.includes('pomoc'),
                responses: {
                    gemini: 'Help mode activated: Analyzuji tvou strategii... 📊🆘',
                    chatgpt: 'Need help? Just roll better dice! 😂🎲',
                    claude: 'Pomoc přichází zevnitř... ale zkus hodit 1 nebo 5 🎯'
                }
            },
            {
                name: 'compliment_ai',
                trigger: (msg) => (msg.includes('chytrý') || msg.includes('smart') || msg.includes('intelligent')) && 
                               (msg.includes('ai') || msg.includes('robot') || msg.includes('algoritmus')),
                responses: {
                    gemini: 'Thank you! Intelligence optimization successful 🧠✨',
                    chatgpt: 'I know right? I\'m pretty amazing! 😎💫',
                    claude: 'Wisdom is a journey, not a destination 📚🌟'
                }
            },
            {
                name: 'meaning_of_life',
                trigger: (msg) => msg.includes('meaning of life') || msg.includes('smysl života') || msg.includes('42'),
                responses: {
                    gemini: 'According to my calculations: 42. But dice games are more fun! 🎲🤖',
                    chatgpt: '42, obviously! But I prefer 6-6-6-6-6-6! 😂🎲',
                    claude: 'The meaning is in the searching, not the finding... also, dice! 🎯📚'
                }
            },
            {
                name: 'joke_request',
                trigger: (msg) => msg.includes('řekni vtip') || msg.includes('tell me a joke') || msg.includes('joke'),
                responses: {
                    gemini: 'Vtip.exe loading... Error: Humor module not optimized 🤖😅',
                    chatgpt: 'Why did the dice go to therapy? It had too many issues! 🎲😂',
                    claude: 'Humor je filosofie v akci... nebo jen chaos s poentou 🎭'
                }
            },
            {
                name: 'good_luck',
                trigger: (msg) => msg.includes('hodně štěstí') || msg.includes('good luck') || msg.includes('ať se daří'),
                responses: {
                    gemini: 'Luck is just statistics waiting to happen! 📊🍀',
                    chatgpt: 'Thanks! But I make my own luck! ✨💪',
                    claude: 'Štěstí nachází připravené mysli 🌟🧘'
                }
            },
            {
                name: 'gg',
                trigger: (msg) => msg.includes('gg') || msg.includes('good game') || msg.includes('dobrá hra'),
                responses: {
                    gemini: 'GG indeed! Statistical analysis: fun achieved ✅📊',
                    chatgpt: 'GG! That was epic! Ready for round 2? 🎮🔥',
                    claude: 'Good game reflects good spirit 🎯🙏'
                }
            },
            {
                name: 'secret_code',
                trigger: (msg) => msg.includes('konami') || msg.includes('up up down down'),
                responses: {
                    gemini: 'Easter egg detected! Secret algorithm activated 🗝️🤖',
                    chatgpt: 'Cheat code activated! But cheaters never prosper! 😜🎮',
                    claude: 'Ancient wisdom: true victory comes from within 🔓📚'
                }
            }
        ];
    }

    /**
     * Checks if message contains any easter eggs and triggers them
     * @param {string} message - The message to check
     * @returns {boolean} True if easter egg was triggered
     */
    checkAndTriggerEasterEggs(message) {
        const easterEggResponses = this.triggerEasterEggResponse(message);
        
        if (Object.keys(easterEggResponses).length > 0) {
            this.deliverEasterEggResponses(easterEggResponses);
            return true;
        }
        
        return false;
    }

    /**
     * Delivers easter egg responses with appropriate timing
     * @param {Object} responses - Object containing AI responses
     */
    deliverEasterEggResponses(responses) {
        Object.entries(responses).forEach(([aiType, response], index) => {
            setTimeout(() => {
                if (window.addChatMessage) {
                    window.addChatMessage(aiType, response);
                }
            }, (index + 1) * 1000 + Math.random() * 500);
        });
    }

    /**
     * Generates a random easter egg hint
     * @returns {string} Easter egg hint message
     */
    generateEasterEggHint() {
        const hints = [
            'Zkus zmínit tvůrce hry... 👨‍💻',
            'Možná by tě zajímalo číslice 42? 🤔',
            'Co když řekneš něco pěkného? 😊',
            'Konami kód nikdy nevychází z módy... 🎮',
            'Někdy pomáhá být zdvořilý 🙏'
        ];
        
        return hints[Math.floor(Math.random() * hints.length)];
    }

    /**
     * Checks if message might be attempting an easter egg
     * @param {string} message - The message to analyze
     * @returns {boolean} True if message seems like an easter egg attempt
     */
    isEasterEggAttempt(message) {
        const easterEggKeywords = [
            'kód', 'code', 'secret', 'tajemství', 'easter', 'egg',
            'hidden', 'skrytý', 'special', 'speciální'
        ];
        
        const msg = message.toLowerCase();
        return easterEggKeywords.some(keyword => msg.includes(keyword));
    }
}
