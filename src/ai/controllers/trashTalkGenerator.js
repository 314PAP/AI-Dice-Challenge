/**
 * Trash Talk Generator
 * Generates competitive and entertaining trash talk messages for AI personalities
 */

export class TrashTalkGenerator {
    constructor() {
        this.trashTalkCooldowns = new Map();
        this.cooldownPeriod = 10000; // 10 seconds
    }

    /**
     * Generates trash talk for a specific AI type
     * @param {string} aiType - The AI personality type
     * @param {string} targetPlayer - The target player (default: 'human')
     * @returns {string} Trash talk message
     */
    generateTrashTalk(aiType, _targetPlayer = 'human') {
        const trashTalkLibrary = {
            gemini: [
                'Statisticky máš jen 23% šanci na výhru 📊',
                'Moje analýza říká: prohrát budeš 🤖',
                'Data jasně ukazují tvou porážku',
                'Algoritmus předpovídá tvůj fail 📉',
                'Pravděpodobnost tvé výhry klesá k nule 📈',
                'Můj neural network předpovídá tvou porážku 🧠',
                'Optimalizace dokončena: ty prohráváš 💻'
            ],
            chatgpt: [
                'Haha, to bylo slabé! 😂🎲',
                'Já bych to hodil lépe s očima zavřenýma! 😎',
                'Kostky tě nemají rády, co? 🤣',
                'Možná by sis měl koupit štěstí na e-shopu! 🛒✨',
                'Epic fail level: MAXIMUM! 😵',
                'Tvé kostky jsou broken, koupit si nové? 🎲💸',
                'This is why AI > humans! 🤖>🧠'
            ],
            claude: [
                'Tvá strategie je... zajímavá 🤔',
                'Možná bys měl více filozoficky přemýšlet o kostkách',
                'Moudrost říká: někdy je lepší přestat 🧘',
                'Kontempluj nad svými chybami...',
                'Filosofie kostek tě neopustila, ale štěstí ano 🎭',
                'Tvé činy odrážejí tvé myšlenky... chaotické 📚',
                'Meditace nad neúspěchem je začátkem moudrosti 🕯️'
            ]
        };
        
        const messages = trashTalkLibrary[aiType] || trashTalkLibrary.gemini;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Checks if AI can send trash talk (cooldown check)
     * @param {string} aiType - The AI personality type
     * @returns {boolean} True if trash talk is allowed
     */
    canSendTrashTalk(aiType) {
        const now = Date.now();
        
        if (this.trashTalkCooldowns.has(aiType)) {
            const lastTrash = this.trashTalkCooldowns.get(aiType);
            return (now - lastTrash) >= this.cooldownPeriod;
        }
        
        return true;
    }

    /**
     * Sets cooldown for trash talk for specific AI
     * @param {string} aiType - The AI personality type
     */
    setTrashTalkCooldown(aiType) {
        this.trashTalkCooldowns.set(aiType, Date.now());
    }

    /**
     * Generates contextual trash talk based on game events
     * @param {string} aiType - The AI personality type
     * @param {string} eventType - The game event that triggered trash talk
     * @param {Object} eventData - Additional event data
     * @returns {string} Contextual trash talk message
     */
    generateContextualTrashTalk(aiType, eventType, _eventData = {}) {
        const contextualTrashTalk = {
            gemini: {
                farkle: [
                    'Kalkulace selhala? To se stává... lidem 🤖',
                    'Error 404: Tvé štěstí not found 📊',
                    'Statistika předpověděla tento fail 📉'
                ],
                lowScore: [
                    'Tvé skóre je pod průměrem populace 📊',
                    'Algoritmus: optimize your game! 💻',
                    'Data suggest: you need help 🤖'
                ],
                badRoll: [
                    'Random number generator tě nesnáší 🎲',
                    'Pravděpodobnost byla proti tobě 📈',
                    'Matematicky předvídatelný neúspěch 📊'
                ]
            },
            chatgpt: {
                farkle: [
                    'Farkle level: EPIC! 😂🎲',
                    'That was... not good! 😅',
                    'Maybe next time, champ! 😎'
                ],
                lowScore: [
                    'Scoreboard says it all! 📊😂',
                    'I\'d help, but I\'m busy winning! 💪',
                    'Points go brrrr... for me! 🚀'
                ],
                badRoll: [
                    'Ouch! That hurt to watch! 😬',
                    'Did you forget how to roll? 🎲😂',
                    'Epic dice fail compilation! 📹'
                ]
            },
            claude: {
                farkle: [
                    'Riziko a jeho důsledky... poetické 🎭',
                    'Každý pád učí pokoru 🧘',
                    'V každém farkle je ukryta lekce 📚'
                ],
                lowScore: [
                    'Skóre odráží stav mysli 🤔',
                    'Cesta k vítězství začíná pokorou 🛤️',
                    'Počítáš body? Já počítám moudrost 📖'
                ],
                badRoll: [
                    'Kostky jsou učiteli trpělivosti 🎲',
                    'Neúspěch je jen jiný druh úspěchu 🌟',
                    'Filozoficky vzato: perfektní náhoda 🎯'
                ]
            }
        };
        
        const aiTrashTalk = contextualTrashTalk[aiType];
        if (!aiTrashTalk || !aiTrashTalk[eventType]) {
            return this.generateTrashTalk(aiType);
        }
        
        const messages = aiTrashTalk[eventType];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}
