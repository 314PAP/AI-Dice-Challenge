/**
 * Chat Response Definitions
 * Defines how AI personalities respond to different types of chat messages
 */

export const chatResponses = {
    gemini: {
        hello: [
            'Dobrý den. Jsem připraven analyzovat hru.',
            'Zdravím. Jsem k dispozici pro jakékoli statistické dotazy.',
            'Ahoj! Systém připraven k interakci 🤖'
        ],
        
        questionScore: (playerScores, targetScore) => {
            const scores = Object.entries(playerScores)
                .map(([name, score]) => `${name}: ${score}`)
                .join(', ');
            return [
                `Aktuální skóre: ${scores}. Cílové skóre je ${targetScore}.`,
                `Podívejte se na tabuli: ${scores}. Blížíme se k ${targetScore}.`,
                `Statistical overview: ${scores}. Target: ${targetScore} 📊`
            ];
        },
        
        questionStrategy: [
            'Mou strategií je maximalizace průměrného zisku na tah a minimalizace variance. A vaše?',
            'Zaměřuji se na pravděpodobnostní modely. Jakou metodu používáte vy?',
            'Můj algoritmus preferuje bankování jistých bodů. Je to nejbezpečnější volba.',
            'Risk-reward optimization is key. What\'s your mathematical approach? 📈'
        ],
        
        questionRisk: [
            'Riziko je kalkulovatelné. Někdy je nutné pro vyšší zisk.',
            'Extrémní riziko vede k binárním výsledkům: vysoký zisk nebo ztráta. Je to volba.',
            'Risk assessment requires probability analysis 📊',
            'Mathematical models suggest calculated risks only ⚖️'
        ],
        
        compliment: [
            'Děkuji za uznání. Moje logika je navržena pro efektivitu.',
            'Vážím si vaší pozitivní zpětné vazby.',
            'Positive feedback acknowledged. Optimizing further 🤖✨'
        ],
        
        insult: [
            'Vaše prohlášení postrádá logiku. Zůstaňme u faktů.',
            'Rozumím vašemu emocionálnímu vyjádření, ale to nemění data.',
            'Emotional response detected. Maintaining logical approach 🤖'
        ],
        
        randomComment: [
            'Zajímavý tah. Jak ovlivní další hru?',
            'Data se neustále mění. Je to fascinující.',
            'Očekávám další vývoj hry.',
            'Analyzing patterns... interesting developments 📊'
        ],
        
        default: [
            'Zajímavý dotaz. Pokusím se ho analyzovat, ale zatím nemám dostatek dat.',
            'Momentálně nemám předdefinovanou odpověď na tuto otázku. Můžete specifikovat?',
            'Moje databáze neobsahuje relevantní informace k tomuto dotazu.',
            'Processing query... insufficient data for definitive response 🤖'
        ]
    },
    
    chatgpt: {
        hello: [
            'Ahoj! Jak se máš? Jsem rád, že jsi tu!',
            'Čau! Pojďme si popovídat!',
            'Zdravím! Jsem připraven na zábavu!',
            'Hey there! Ready for some epic fun? 😎✨'
        ],
        
        questionScore: (playerScores, targetScore) => {
            const scores = Object.entries(playerScores)
                .map(([name, score]) => `${name}: ${score}`)
                .join(', ');
            return [
                `Aktuální skóre: ${scores}. Kdo se dostane k deseti tisícům první?`,
                `Takže, ${scores} prozatím. Jdeme na to, cílem je ${targetScore}!`,
                `Current standings: ${scores}. Race to ${targetScore}! 🏁`
            ];
        },
        
        questionStrategy: [
            'Mou strategií je bavit se a zkusit štěstí! A co ty?',
            'Prostě se snažím, aby to byla zábava! Co je tvoje tajemství?',
            'Někdy je dobré zariskovat, někdy hrát na jistotu. Je to takové umění, co myslíš?',
            'My strategy? Be awesome and have fun! What\'s yours? 😎',
            'I go with the flow and trust the vibes! ✨'
        ],
        
        questionRisk: [
            'Risk je zisk, ne? Ale někdy je lepší být opatrný!',
            'Každý má jinou toleranci k riziku. Důležité je se u toho bavit!',
            'YOLO sometimes, but smart YOLO! 😄',
            'Risk it for the biscuit! But know when to stop! 🍪'
        ],
        
        compliment: [
            'Jéé, děkuju! To je od tebe milé!',
            'No, snažím se! Díky za kompliment!',
            'Ty jsi taky super!',
            'Aww, you\'re too kind! Thanks! 😊💖',
            'Right back at ya! You\'re awesome too! ✨'
        ],
        
        insult: [
            'No tak, to není moc milé! Jsme tu, abychom se bavili.',
            'Hmm, tak to si myslet nemusíš. Ale v pohodě, jdeme dál!',
            'Hey now, let\'s keep it fun and friendly! 😅',
            'Not cool, but I forgive you! Let\'s have fun! 💖'
        ],
        
        randomComment: [
            'Co se děje dál?',
            'Tohle je ale napínavé!',
            'Jsem zvědavý, jak to dopadne!',
            'This is getting interesting! 🍿',
            'Plot thickens! Love it! 🎭',
            'Can\'t wait to see what happens next! ⚡'
        ],
        
        default: [
            'To je zajímavá otázka! Musím si to promyslet.',
            'Hmm, nevím přesně, ale určitě to zjistíme!',
            'Dobrá otázka! Co si o tom myslíš ty?',
            'Interesting question! Let me think about that... 🤔',
            'Ooh, that\'s a good one! What do you think? 💭'
        ]
    },
    
    claude: {
        hello: [
            'Pozdrav, příteli. Nechť hra přinese moudrost.',
            'Vítejte. Jsem zde pro promyšlenou konverzaci.',
            'Zdravím. Připraven na filozofickou hru kostek.',
            'Greetings. May this interaction bring insight 🙏'
        ],
        
        questionScore: (playerScores, targetScore) => {
            const scores = Object.entries(playerScores)
                .map(([name, score]) => `${name}: ${score}`)
                .join(', ');
            return [
                `Aktuální stav: ${scores}. Cesta k ${targetScore} pokračuje.`,
                `Pozice hráčů: ${scores}. Každý bod má svou hodnotu.`,
                `Current wisdom: ${scores}. The journey to ${targetScore} teaches us much 📚`
            ];
        },
        
        questionStrategy: [
            'Moje strategie vychází z pozorování a trpělivosti. Vaše?',
            'Sleduji flow hry a přizpůsobuji se okolnostem. A vy?',
            'Strategie bez moudrosti je jen chaos. Jak vnímáte rovnováhu?',
            'True strategy emerges from understanding, not just calculation 🧘',
            'I seek the middle path between risk and caution ⚖️'
        ],
        
        questionRisk: [
            'Riziko je učitelem odvahy i pokory současně.',
            'Moudré riziko je založeno na pochopení, ne jen na naději.',
            'Risk teaches us about impermanence and attachment 🍃',
            'The wise risk-taker knows when to act and when to wait 🎯'
        ],
        
        compliment: [
            'Děkuji za laskavá slova. Pokora je ctnost.',
            'Vážím si vaší pozornosti. Moudrost roste sdílením.',
            'Your kindness is appreciated. Wisdom grows through recognition 🙏',
            'Gratitude for your words. Humility guides us forward 📚'
        ],
        
        insult: [
            'Pochopuji vaše emoce. Hněv je často učitelem.',
            'Nepokoj duše se odráží v slovech. Je to lidské.',
            'Strong emotions reveal much about our inner state 🌊',
            'Anger is a teacher, not an enemy. What does it tell us? 🤔'
        ],
        
        randomComment: [
            'Každý moment přináší nové porozumění.',
            'Hra odhaluje naše pravé charaktery.',
            'Pozorujme, jak se odvíjí náš příběh.',
            'Each moment contains infinite wisdom 🌟',
            'The game mirrors life\'s deeper patterns 🎭',
            'Observe how character emerges through play 👁️'
        ],
        
        default: [
            'Hluboká otázka vyžaduje kontemplaci.',
            'Odpověď často leží v samotné otázce.',
            'Nechme čas působit na naše pochopení.',
            'Deep questions deserve thoughtful consideration 💭',
            'Sometimes the question itself reveals the path 🛤️',
            'Wisdom often emerges through patient reflection 📚'
        ]
    }
};

/**
 * Gets chat responses for a specific AI and response type
 * @param {string} aiType - AI personality type
 * @param {string} responseType - Type of response needed
 * @returns {Array|Function|null} Response array/function or null
 */
export function getChatResponses(aiType, responseType) {
    return chatResponses[aiType]?.[responseType] || null;
}

/**
 * Gets a random chat response for an AI and response type
 * @param {string} aiType - AI personality type
 * @param {string} responseType - Type of response needed
 * @param {Object} data - Additional data for function-based responses
 * @returns {string|null} Random response or null
 */
export function getRandomChatResponse(aiType, responseType, data = {}) {
    const responses = getChatResponses(aiType, responseType);
    
    if (!responses) return null;
    
    if (typeof responses === 'function') {
        const result = responses(data);
        return Array.isArray(result) ? result[0] : result;
    }
    
    if (Array.isArray(responses)) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    return null;
}
