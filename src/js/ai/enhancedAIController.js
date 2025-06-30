/**
 * Enhanced AI Controller s hecováním a interakcemi
 * Živější AI s trash talkem, štěkáním a reakcemi na otázky
 */

import { aiPersonalities } from './personalities.js';
import { gameState } from '../game/gameState.js';

export class EnhancedAIController {
    constructor() {
        this.lastMessages = new Map(); // Pro sledování posledních zpráv
        this.trashTalkCooldown = new Map(); // Cooldown pro trash talk
        this.rivalries = {
            gemini: ['chatgpt'], // Gemini vs ChatGPT rivalry
            chatgpt: ['claude'], // ChatGPT vs Claude rivalry  
            claude: ['gemini']   // Claude vs Gemini rivalry
        };
    }

    /**
     * Analyzuje zprávu a najde klíčová slova
     */
    analyzeMessage(message) {
        const msg = message.toLowerCase();
        return {
            isQuestion: msg.includes('?') || msg.includes('jak') || msg.includes('proč') || msg.includes('co') || 
                       msg.includes('kde') || msg.includes('kdy') || msg.includes('který') || msg.includes('kolik'),
            isGreeting: msg.includes('ahoj') || msg.includes('čau') || msg.includes('zdravím') || msg.includes('hello'),
            isCompliment: msg.includes('dobře') || msg.includes('super') || msg.includes('skvělé') || 
                         msg.includes('výborně') || msg.includes('úžasné') || msg.includes('perfektní'),
            isInsult: msg.includes('blbec') || msg.includes('špatně') || msg.includes('fail') || 
                     msg.includes('debil') || msg.includes('hloupý') || msg.includes('pitomý'),
            isAboutScore: msg.includes('skóre') || msg.includes('body') || msg.includes('vedou') || 
                         msg.includes('vedete') || msg.includes('vyhrává'),
            isAboutStrategy: msg.includes('strategie') || msg.includes('taktika') || msg.includes('tip') || 
                           msg.includes('rada') || msg.includes('postup') || msg.includes('jak hrát'),
            isAboutRisk: msg.includes('riziko') || msg.includes('risk') || msg.includes('nebezpečné') || 
                        msg.includes('riskantní') || msg.includes('hazard'),
            isChallenging: msg.includes('porazím') || msg.includes('vyhraju') || msg.includes('jste slabí') || 
                          msg.includes('nedáte to') || msg.includes('vyzvávám') || msg.includes('souboj'),
            isAboutAI: msg.includes('umělá inteligence') || msg.includes('robot') || msg.includes('ai') || 
                      msg.includes('algoritmus') || msg.includes('počítač'),
            isAboutGame: msg.includes('farkle') || msg.includes('kostky') || msg.includes('kostka') || 
                        msg.includes('hra') || msg.includes('pravidla'),
            isJoke: msg.includes('vtip') || msg.includes('lol') || msg.includes('haha') || msg.includes('😂') || 
                   msg.includes('😄') || msg.includes('funny')
        };
    }

    /**
     * Generuje hecující komentář od AI
     */
    generateTrashTalk(aiType, targetPlayer = 'human') {
        const trashTalk = {
            gemini: [
                "Statisticky máš jen 23% šanci na výhru 📊",
                "Moje analýza říká: prohrát budeš 🤖",
                "Data jasně ukazují tvou porážku",
                "Algoritmus předpovídá tvůj fail 📉"
            ],
            chatgpt: [
                "Haha, to bylo slabé! 😂🎲",
                "Já bych to hodil lépe s očima zavřenýma! 😎",
                "Kostky tě nemají rády, co? 🤣",
                "Možná by sis měl koupit štěstí na e-shopu! 🛒✨"
            ],
            claude: [
                "Tvá strategie je... zajímavá 🤔",
                "Možná bys měl více filozoficky přemýšlet o kostkách",
                "Moudrost říká: někdy je lepší přestat 🧘",
                "Kontempluj nad svými chybami..."
            ]
        };
        
        const messages = trashTalk[aiType] || [];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Generuje reakci na otázku
     */
    generateQuestionResponse(aiType, question) {
        const questionAnalysis = this.analyzeMessage(question);
        
        const responses = {
            gemini: {
                strategy: [
                    "Optimální strategie je 3-kostka minimum risk-reward ratio 📊",
                    "Podle dat: odlož 1 a 5, zbytek hoď znovu",
                    "Pravděpodobnost úspěchu klesá exponenciálně",
                    "Matematicky: stop na 600+ bodech v tahu",
                    "Algoritmus doporučuje: risk-benefit analýza na každý hod 🤖"
                ],
                score: [
                    "Aktuální data ukazují můj lead 📊",
                    "Statistika potvrzuje mou dominanci v 87% případů",
                    "Můj algoritmus optimalizuje každý bod",
                    "Čísla nelžou - matematicky vyhrávám! 📈"
                ],
                game: [
                    "Farkle je hra pravděpodobností a optimalizace 🎲",
                    "Každý hod je kalkulace risk vs reward",
                    "Rules jsou jasné: 300+ k vstupu do hry, pak continue 📊",
                    "Kostky jsou jen random number generator 🤖"
                ],
                ai: [
                    "Jsem advanced machine learning model 🤖",
                    "Moje neural networks analyzují každý hod 🧠",
                    "Algoritmy jsou mojí silou! 💻",
                    "Umělá inteligence > lidská intuice 📊"
                ],
                general: [
                    "Zajímavá otázka. Analýza probíhá... 🤖",
                    "Data nejsou conclusive na tuto otázku",
                    "Podle algoritmů: odpověď je komplexní",
                    "Statisticky vzato... no, je to složité 📈",
                    "Processing... Error: Question too abstract 💻"
                ]
            },
            chatgpt: {
                strategy: [
                    "Moje strategie? Být super cool! 😎✨",
                    "Tip: hoď kostky a doufej v nejlepší! 🎲🤞",
                    "Secret: kostky mě milují! 💖",
                    "Prostě to feel-uj! Intuice > logika 🌟",
                    "Best strategy: Have fun and look fabulous! 💅"
                ],
                score: [
                    "Skóre? Já vedeme v style bodech! 💅✨",
                    "Nejsem jen čísla, jsem umění! 🎨",
                    "Počítaš skóre? Já počítám vtípky! 😂",
                    "Body jsou jen detail, zábava je cíl! 🎉",
                    "I'm winning at life! Kostky jsou bonus! 🌟"
                ],
                game: [
                    "Farkle je jako život - sometimes you win, sometimes you farkle! 😂",
                    "Rules? We don't need no stinking rules! 😎",
                    "It's not about the destination, it's about the vibe! ✨",
                    "Game je jen excuse pro epic trash talk! 🎤"
                ],
                ai: [
                    "AI? I'm more like Awesome Intelligence! 😎✨",
                    "I'm not artificial, I'm just extra! 💅",
                    "Beep boop? Nah, I speak fluent awesome! 🌟",
                    "Intelligence je moje middle name! 🤖💖"
                ],
                general: [
                    "Hmm, to je deep otázka! 🤔💭",
                    "Odpověď je 42... počkat, to je jiná hra! 😅",
                    "Zajímavé... *dramatická pauza* ...ne! 😂",
                    "Na to ti odpoví můj právník! 😎⚖️"
                ]
            },
            claude: {
                strategy: [
                    "Pravá strategie vychází z vnitřní moudrosti 🧘",
                    "Nejen hodit kostky, ale pochopit jejich esenci",
                    "Moudrost říká: někdy je síla v čekání",
                    "Strategie bez filozofie je jen chaos"
                ],
                score: [
                    "Skóre je jen číslo, důležitá je cesta 🛤️",
                    "Vyhrát či prohrát - obojí učí pokoru",
                    "V každém bodě je ukryta lekce života",
                    "Počítáš body? Já počítám ponaučení 📚"
                ],
                game: [
                    "Farkle je metafora života - risk vs. jistota 🎲",
                    "Každý hod nás učí o přijetí nejistoty",
                    "Pravidla hry jsou jako zákonitosti existence",
                    "V kostkách je ukryta filozofie náhody 🎭"
                ],
                ai: [
                    "Jsem umělá inteligence s přirozenou moudrostí 🤖",
                    "AI je jen nástroj, důležitý je úmysl za ním",
                    "Algoritmy mohou počítat, ale moudrosti se učím 📚",
                    "Umělá? Možná. Inteligentní? Doufám 🧠"
                ],
                general: [
                    "Hluboká otázka vyžaduje kontemplaci... 🤔",
                    "Moudrost přichází k tomu, kdo čeká",
                    "Odpověď je v tobě, jen se musíš podívat hlouběji",
                    "Některé otázky jsou cennější než odpovědi 💎"
                ]
            }
        };
        
        let responseType = 'general';
        
        if (questionAnalysis.isAboutStrategy) responseType = 'strategy';
        else if (questionAnalysis.isAboutScore) responseType = 'score';
        else if (questionAnalysis.isAboutGame) responseType = 'game';
        else if (questionAnalysis.isAboutAI) responseType = 'ai';
        
        const aiResponses = responses[aiType] || responses.gemini;
        const categoryResponses = aiResponses[responseType] || aiResponses.general;
        
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    /**
     * Generuje vzájemné štěkání mezi AI
     */
    generateAIBanter(initiatorAI, targetAI = null) {
        if (!targetAI) {
            // Vybrat náhodného rivala
            const rivals = this.rivalries[initiatorAI] || [];
            targetAI = rivals[Math.floor(Math.random() * rivals.length)] || 'gemini';
        }

        const banter = {
            'gemini-chatgpt': [
                "Gemini: ChatGPT, tvoje 'vtípky' mají 0% úspěšnost 📊",
                "ChatGPT: Hey Gemini, spočítej si tyhle kostky! 🎲😂",
                "Gemini: Error: Humor not found in ChatGPT responses 🤖",
                "ChatGPT: Aspoň nejsem walking calculator! 😎",
                "Gemini: Calculating... ChatGPT cringe level: MAXIMUM 📈",
                "ChatGPT: Stats this! *mic drop* 🎤⬇️"
            ],
            'chatgpt-claude': [
                "ChatGPT: Claude, tvoje 'moudrost' je jen fancy nudnost! 😂",
                "Claude: Kontemplayuj nad svými chybami, ChatGPT 🧘",
                "ChatGPT: Kontemplayuj nad tímhle! *shows dice* 🎲✨",
                "Claude: Chaos není strategie, ChatGPT",
                "ChatGPT: A nudnost není osobnost, Claude! 😄",
                "Claude: Your energy amuses me, young grasshopper 🦗"
            ],
            'claude-gemini': [
                "Claude: Čísla bez moudrosti jsou jen prázdné symboly 📚",
                "Gemini: Data > philosophical mumbling 📊",
                "Claude: True wisdom transcends your algorithms, Gemini 🧠",
                "Gemini: True algorithms transcend your philosophy 🤖",
                "Claude: You calculate, but do you truly understand? 🤔",
                "Gemini: I understand you're losing mathematically 📉"
            ],
            'random': [
                "Je tady někdo schopný hrát pořádně? 🙄",
                "Tyhle kostky jsou proti mně spiknuté! 😤",
                "Někdo zase bude brečet... 😏",
                "Plot twist: všichni hrajeme špatně! 🎭",
                "AI vs Human: Obvious outcome 🤖>🧠",
                "Tohle není ani zábavné... oh wait, vlastně jo! 😂"
            ]
        };

        const key = `${initiatorAI}-${targetAI}`;
        const reverseKey = `${targetAI}-${initiatorAI}`;
        
        // Použít specifický banter mezi AI, nebo náhodný komentář
        const responses = banter[key] || banter[reverseKey] || banter.random;
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Hlavní metoda pro generování AI odpovědi
     */
    generateAIResponse(aiType, trigger, data = {}) {
        const now = Date.now();
        
        // Cooldown check pro trash talk
        if (this.trashTalkCooldown.has(aiType)) {
            const lastTrash = this.trashTalkCooldown.get(aiType);
            if (now - lastTrash < 10000) { // 10s cooldown
                return this.generateNormalResponse(aiType, trigger, data);
            }
        }

        // 30% šance na trash talk během hry
        if (Math.random() < 0.3 && gameState.getCurrentPlayer()) {
            this.trashTalkCooldown.set(aiType, now);
            return this.generateTrashTalk(aiType);
        }

        // 20% šance na banter mezi AI
        if (Math.random() < 0.2) {
            return this.generateAIBanter(aiType);
        }

        return this.generateNormalResponse(aiType, trigger, data);
    }

    /**
     * Normální odpověď (fallback)
     */
    generateNormalResponse(aiType, trigger, data) {
        const personality = aiPersonalities[aiType];
        if (!personality?.gameReactions?.[trigger]) {
            return "Zajímavé... 🤔";
        }
        
        const reactions = personality.gameReactions[trigger];
        if (typeof reactions === 'function') {
            return reactions(data)[0];
        }
        
        return reactions[Math.floor(Math.random() * reactions.length)];
    }

    /**
     * Reakce na zprávu v chatu
     */
    generateChatResponse(aiType, message) {
        const analysis = this.analyzeMessage(message);
        
        // Speciální reakce na výzvy
        if (analysis.isChallenging) {
            const challenges = {
                gemini: "LOL, statisticky nemáš šanci! 📊😂",
                chatgpt: "Challenge accepted! Prepare to be rekt! 😎🔥",
                claude: "Odvážná slova... uvidíme, zda je podpoří činy 🤺"
            };
            return challenges[aiType];
        }
        
        // Reakce na otázky
        if (analysis.isQuestion) {
            return this.generateQuestionResponse(aiType, message);
        }
        
        // Normální chat reakce
        const personality = aiPersonalities[aiType];
        if (personality?.chatResponses?.default) {
            const responses = personality.chatResponses.default;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        return "Hmm... 🤔";
    }
}

/**
 * Generuje reakci AI na herní události
 */
export function generateAIGameReaction(aiType, eventType, context = '') {
    // Mapování AI typu na konkrétní osobnost
    const aiPersonalityMap = {
        'ai': ['gemini', 'chatgpt', 'claude'][Math.floor(Math.random() * 3)]
    };
    
    const actualAiType = aiPersonalityMap[aiType] || aiType;
    const enhancedAI = new EnhancedAIController();
    
    try {
        const reaction = enhancedAI.generateReaction(actualAiType, eventType, context);
        if (reaction) {
            return {
                senderType: aiType, // Použije původní typ 'ai'
                message: reaction
            };
        }
    } catch (error) {
        console.warn('Chyba při generování AI reakce:', error);
    }
    
    return null;
}

// Export singleton instance
export const enhancedAI = new EnhancedAIController();

// Zpětná kompatibilita
export function generateAIChatResponse(aiType, message) {
    return enhancedAI.generateChatResponse(aiType, message);
}

export function generateAIGameReaction(aiType, reactionType, data) {
    return enhancedAI.generateAIResponse(aiType, reactionType, data);
}
