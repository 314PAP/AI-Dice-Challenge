/**
 * Enhanced AI Controller
 * Provizorní implementace pro basic AI responses
 */

/**
 * Základní AI controller s jednoduchými odpověďmi
 */
export const enhancedAI = {
    /**
     * Generuje AI odpověď na základě situace
     * @param {string} aiType - Typ AI ('gemini', 'chatgpt', 'claude')
     * @param {string} situation - Herní situace
     * @param {object} data - Dodatečná data
     * @returns {string} AI odpověď
     */
    generateAIResponse(aiType, situation, data = {}) {
        const responses = {
            gemini: {
                greetings: ['Ahoj! 🔍', 'Začínáme!', 'Data nastavena ✓'],
                turnStart: ['Tvůj tah!', 'Analýza možností...', 'Probabilita rizika...'],
                finalRound: ['Kritická fáze!', 'Finální kalkulace', 'Rozhodující momenty'],
                gameOver: ['Hra ukončena', 'Analýza výsledků', 'Data zpracována'],
                reactions: ['Zajímavé...', 'Počítám...', 'Logické']
            },
            chatgpt: {
                greetings: ['Ahoj! 🎲', 'Pojďme hrát! 😄', 'Super! 🚀'],
                turnStart: ['Tvůj tah! 🎯', 'Ukaž co umíš! 💪', 'Ber riziko! 🔥'],
                finalRound: ['Finále! 🏆', 'Napětí! ⚡', 'Už to bude! 🎊'],
                gameOver: ['GG! 🎮', 'Skvělá hra! 👏', 'Wow! 🤩'],
                reactions: ['Cool! 😎', 'Nice! 👍', 'Hustý! 🔥']
            },
            claude: {
                greetings: ['Zdravím', 'Buďme moudří', 'S rozmyslem...'],
                turnStart: ['Zvážit možnosti', 'Strategicky myslet', 'Opatrnost je ctnost'],
                finalRound: ['Rozhodná chvíle', 'Moudré volby teď', 'Finální strategie'],
                gameOver: ['Poučná hra', 'Zkušenost získána', 'Moudrost přibyla'],
                reactions: ['Zajímavé...', 'Přemýšlím...', 'Hmm...']
            }
        };

        const personality = responses[aiType] || responses.chatgpt;
        
        switch (situation) {
            case 'hello':
                return this.getRandomResponse(personality.greetings);
            case 'playerTurnStart':
                return this.getRandomResponse(personality.turnStart);
            case 'finalRound':
                return this.getRandomResponse(personality.finalRound);
            case 'gameOver':
                if (data.winner) {
                    return `${this.getRandomResponse(personality.gameOver)} Vyhrál ${data.winner}!`;
                }
                return this.getRandomResponse(personality.gameOver);
            default:
                return this.getRandomResponse(personality.reactions);
        }
    },

    /**
     * Získá náhodnou odpověď z pole
     * @param {Array|string} responses 
     * @returns {string}
     */
    getRandomResponse(responses) {
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }
};
