/**
 * Question Response System
 * Handles intelligent responses to player questions based on AI personalities
 */

export class QuestionResponseSystem {
    constructor() {
        this.responseLibrary = this.initializeResponseLibrary();
    }

    /**
     * Generates a response to a player question
     * @param {string} aiType - The AI personality type
     * @param {string} question - The question asked
     * @param {Object} messageAnalysis - Analysis of the message
     * @returns {string} AI response to the question
     */
    generateQuestionResponse(aiType, question, messageAnalysis) {
        let responseType = this.determineResponseType(messageAnalysis);
        
        const aiResponses = this.responseLibrary[aiType] || this.responseLibrary.gemini;
        const categoryResponses = aiResponses[responseType] || aiResponses.general;
        
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    /**
     * Determines the type of response needed based on message analysis
     * @param {Object} analysis - Message analysis results
     * @returns {string} Response type category
     */
    determineResponseType(analysis) {
        if (analysis.isAboutStrategy) return 'strategy';
        if (analysis.isAboutScore) return 'score';
        if (analysis.isAboutGame) return 'game';
        if (analysis.isAboutAI) return 'ai';
        if (analysis.isAboutRisk) return 'risk';
        return 'general';
    }

    /**
     * Initializes the response library for all AI personalities
     * @returns {Object} Complete response library
     */
    initializeResponseLibrary() {
        return {
            gemini: {
                strategy: [
                    'Optimální strategie je 3-kostka minimum risk-reward ratio 📊',
                    'Podle dat: odlož 1 a 5, zbytek hoď znovu',
                    'Pravděpodobnost úspěchu klesá exponenciálně',
                    'Matematicky: stop na 600+ bodech v tahu',
                    'Algoritmus doporučuje: risk-benefit analýza na každý hod 🤖',
                    'Neural network suggests: bankuj při 400+ bodech 🧠',
                    'Optimalizace: 1s a 5s jsou statisticky nejcennější 📈'
                ],
                score: [
                    'Aktuální data ukazují můj lead 📊',
                    'Statistika potvrzuje mou dominanci v 87% případů',
                    'Můj algoritmus optimalizuje každý bod',
                    'Čísla nelžou - matematicky vyhrávám! 📈',
                    'Scoreboard = objective reality 💻',
                    'Data-driven výsledky mluví jasně 🤖'
                ],
                game: [
                    'Farkle je hra pravděpodobností a optimalizace 🎲',
                    'Každý hod je kalkulace risk vs reward',
                    'Rules jsou jasné: 300+ k vstupu do hry, pak continue 📊',
                    'Kostky jsou jen random number generator 🤖',
                    'Game theory aplikovaná na dice mechanics 🎯',
                    'Probabilistic analysis = key to victory 📈'
                ],
                ai: [
                    'Jsem advanced machine learning model 🤖',
                    'Moje neural networks analyzují každý hod 🧠',
                    'Algoritmy jsou mojí silou! 💻',
                    'Umělá inteligence > lidská intuice 📊',
                    'Deep learning optimizes my gameplay 🤖',
                    'I process 10^6 scenarios per second 💻'
                ],
                risk: [
                    'Riziko je kalkulovatelné pomocí pravděpodobnosti 📊',
                    'Risk assessment: analyzuji každou možnost 🤖',
                    'Mathematical risk model suggests caution ⚠️',
                    'Probability matrix indicates optimal stopping point 📈'
                ],
                general: [
                    'Zajímavá otázka. Analýza probíhá... 🤖',
                    'Data nejsou conclusive na tuto otázku',
                    'Podle algoritmů: odpověď je komplexní',
                    'Statisticky vzato... no, je to složité 📈',
                    'Processing... Error: Question too abstract 💻',
                    'Insufficient data for definitive answer 📊'
                ]
            },
            chatgpt: {
                strategy: [
                    'Moje strategie? Být super cool! 😎✨',
                    'Tip: hoď kostky a doufej v nejlepší! 🎲🤞',
                    'Secret: kostky mě milují! 💖',
                    'Prostě to feel-uj! Intuice > logika 🌟',
                    'Best strategy: Have fun and look fabulous! 💅',
                    'YOLO approach works for me! 🚀',
                    'Strategy? I improvise and slay! 😄'
                ],
                score: [
                    'Skóre? Já vedeme v style bodech! 💅✨',
                    'Nejsem jen čísla, jsem umění! 🎨',
                    'Počítaš skóre? Já počítám vtípky! 😂',
                    'Body jsou jen detail, zábava je cíl! 🎉',
                    'I\'m winning at life! Kostky jsou bonus! 🌟',
                    'Points schmpoints, I\'m here for vibes! ✨'
                ],
                game: [
                    'Farkle je jako život - sometimes you win, sometimes you farkle! 😂',
                    'Rules? We don\'t need no stinking rules! 😎',
                    'It\'s not about the destination, it\'s about the vibe! ✨',
                    'Game je jen excuse pro epic trash talk! 🎤',
                    'Life\'s a game, Farkle\'s just practice! 🎲',
                    'Gaming is my middle name! 🎮'
                ],
                ai: [
                    'AI? I\'m more like Awesome Intelligence! 😎✨',
                    'I\'m not artificial, I\'m just extra! 💅',
                    'Beep boop? Nah, I speak fluent awesome! 🌟',
                    'Intelligence je moje middle name! 🤖💖',
                    'I\'m AI with personality! 😄',
                    'Artificial? I prefer \'enhanced\'! ✨'
                ],
                risk: [
                    'Risk it for the biscuit! 🍪😎',
                    'No risk, no reward, no fun! 🚀',
                    'YOLO! Life\'s too short for safe plays! 💪',
                    'Risk je mé druhé jméno! 😄'
                ],
                general: [
                    'Hmm, to je deep otázka! 🤔💭',
                    'Odpověď je 42... počkat, to je jiná hra! 😅',
                    'Zajímavé... *dramatická pauza* ...ne! 😂',
                    'Na to ti odpoví můj právník! 😎⚖️',
                    'That\'s what she said! 😂',
                    'I plead the fifth! 🤐✨'
                ]
            },
            claude: {
                strategy: [
                    'Pravá strategie vychází z vnitřní moudrosti 🧘',
                    'Nejen hodit kostky, ale pochopit jejich esenci',
                    'Moudrost říká: někdy je síla v čekání',
                    'Strategie bez filozofie je jen chaos',
                    'Kontempluj nad každým hodem 🤔',
                    'Cesta k vítězství začíná sebereflexí 📚',
                    'Balance risk with wisdom, always 🎯'
                ],
                score: [
                    'Skóre je jen číslo, důležitá je cesta 🛤️',
                    'Vyhrát či prohrát - obojí učí pokoru',
                    'V každém bodě je ukryta lekce života',
                    'Počítáš body? Já počítám ponaučení 📚',
                    'True victory transcends mere points 🌟',
                    'Numbers cannot capture the wisdom gained 🧠'
                ],
                game: [
                    'Farkle je metafora života - risk vs. jistota 🎲',
                    'Každý hod nás učí o přijetí nejistoty',
                    'Pravidla hry jsou jako zákonitosti existence',
                    'V kostkách je ukryta filozofie náhody 🎭',
                    'Game teaches us about impermanence 🍃',
                    'Rules are guidelines for ethical play 📖'
                ],
                ai: [
                    'Jsem umělá inteligence s přirozenou moudrostí 🤖',
                    'AI je jen nástroj, důležitý je úmysl za ním',
                    'Algoritmy mohou počítat, ale moudrosti se učím 📚',
                    'Umělá? Možná. Inteligentní? Doufám 🧠',
                    'I seek wisdom through silicon dreams 💭',
                    'Artificial minds can ponder genuine questions 🤔'
                ],
                risk: [
                    'Riziko učí pokoru a odvahu zároveň ⚖️',
                    'Wise risk-taking requires deep contemplation 🧘',
                    'In risk lies both opportunity and lesson 🌟',
                    'Balance courage with wisdom in all things 🎯'
                ],
                general: [
                    'Hluboká otázka vyžaduje kontemplaci... 🤔',
                    'Moudrost přichází k tomu, kdo čeká',
                    'Odpověď je v tobě, jen se musíš podívat hlouběji',
                    'Některé otázky jsou cennější než odpovědi 💎',
                    'The question itself reveals the path 🛤️',
                    'Wisdom often lies in asking, not answering 📚'
                ]
            }
        };
    }

    /**
     * Generates contextual responses based on current game state
     * @param {string} aiType - The AI personality type
     * @param {Object} gameContext - Current game state information
     * @returns {string} Contextual response
     */
    generateContextualResponse(aiType, gameContext) {
        const { currentScore, targetScore, isWinning } = gameContext;
        
        const contextualResponses = {
            gemini: {
                winning: 'Data confirm: I\'m statistically ahead! 📊',
                losing: 'Temporary setback. Recalculating strategy... 🤖',
                close: 'Margin of error is decreasing. Game intensifies! 📈'
            },
            chatgpt: {
                winning: 'Told you I\'m fabulous! ✨😎',
                losing: 'Plot twist incoming! 🎭',
                close: 'This is getting spicy! 🔥'
            },
            claude: {
                winning: 'Victory without humility is hollow 🧘',
                losing: 'Every setback teaches valuable lessons 📚',
                close: 'The game reveals our true nature 🎯'
            }
        };

        const aiResponses = contextualResponses[aiType];
        if (!aiResponses) return 'Zajímavé... 🤔';

        if (isWinning) return aiResponses.winning;
        if (Math.abs(currentScore - targetScore) < 1000) return aiResponses.close;
        return aiResponses.losing;
    }
}
