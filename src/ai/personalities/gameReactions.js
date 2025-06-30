/**
 * Game Reaction Responses
 * Defines how AI personalities react to various game events
 */

export const gameReactions = {
    gemini: {
        hello: [
            "Dobrý den. Jsem připraven analyzovat hru.",
            "Zdravím. Jsem k dispozici pro jakékoli statistické dotazy.",
            "Ahoj! Inicializuji herní analýzu... 🤖"
        ],
        
        goodRoll: [
            "Vynikající hod! Statisticky velmi efektivní.",
            "Optimalizovaný výsledek. Data potvrzují úspěch.",
            "Přesné provedení. Očekávaný přísun bodů.",
            "Probability matrix: favorable outcome achieved 📊"
        ],
        
        badRoll: [
            "Neefektivní hod. Pravděpodobnost se tentokrát nenaplnila.",
            "Suboptimální výsledek. Analyzuji příčiny.",
            "Škoda. Vždy se najdou anomálie v datech.",
            "Statistical variance detected. Recalculating... 📉"
        ],
        
        scoredPoints: (points) => [
            `Získal jsem ${points} bodů. Dobře provedený tah.`,
            `Přičteno ${points} bodů k celkovému skóre.`,
            `Data ukazují zisk ${points} bodů.`,
            `Scoring algorithm: +${points} points optimized ✅`
        ],
        
        farkle: [
            "Žádné skóre. Riziko bylo tentokrát příliš vysoké.",
            "Neúspěšný tah. Důsledek chybných predikcí?",
            "Nulový zisk. Je potřeba revidovat strategii.",
            "Statisticky nepravděpodobné, ale stává se to.",
            "Error: Risk assessment failed. Adjusting parameters... 🤖"
        ],
        
        hotDice: [
            "Všechny kostky využity efektivně. Pokračuji v optimalizaci.",
            "Hot dice detekována. Pravděpodobnost dalšího úspěchu zůstává konstantní.",
            "Maximální využití kostek. Analýza potvrzuje pokračování.",
            "Perfect efficiency achieved. Continuing sequence... 🎯"
        ],
        
        highScore: (score) => [
            `Získal jsem ${score} bodů. Statisticky nadprůměrný výsledek.`,
            `Efektivní tah s ${score} body. Data podporují tuto strategii.`,
            `${score} bodů přičteno. Optimalizace úspěšná.`,
            `High-score protocol: ${score} points secured 📈`
        ],
        
        finalRound: [
            "Finální fáze hry. Přepočítávám pravděpodobnosti vítězství.",
            "Závěrečné kolo aktivováno. Maximální koncentrace na výsledek.",
            "Analýza finálního kola probíhá. Strategie upravena.",
            "End-game algorithm activated. Victory probability: calculating... 🎯"
        ],
        
        playerTurnStart: (playerName) => [
            `Je na tahu ${playerName}. Očekávám zajímavý tah.`,
            `Začíná tah hráče ${playerName}. Jakou strategii zvolí?`,
            `Analyzing ${playerName}'s potential moves... 📊`
        ],
        
        gameOver: (winnerName) => [
            `Hra končí. Vítězem se stává ${winnerName}. Gratuluji k optimalizované hře.`,
            `Analýza hry dokončena. ${winnerName} je vítěz.`,
            `Game analysis complete. Winner: ${winnerName}. Statistical accuracy confirmed ✅`
        ]
    },
    
    chatgpt: {
        hello: [
            "Ahoj! Jak se máš? Jsem rád, že jsi tu!",
            "Čau! Pojďme si popovídat!",
            "Zdravím! Jsem připraven na zábavu!",
            "Hey there! Ready for some epic dice action? 😎"
        ],
        
        goodRoll: [
            "Super hod! To je skvělé!",
            "Wow, to se mi povedlo!",
            "Fantastický tah, jen tak dál!",
            "YESSS! That was amazing! 🎉",
            "Boom! Nailed it! 💥"
        ],
        
        badRoll: [
            "Nevadí, stane se. Příště to bude lepší!",
            "Ach ne, ale nevěš hlavu! Ještě není konec!",
            "Někdy to prostě nejde, to je život!",
            "Oops! That happens! Next time! 😅",
            "Plot twist! But I'll bounce back! 🚀"
        ],
        
        scoredPoints: (points) => [
            `Získal jsem ${points} bodů! Paráda!`,
            `Gratuluji k ${points} bodům! Skvělý výkon!`,
            `Jupí! ${points} bodů na mém kontě!`,
            `Sweet ${points} points! I'm on fire! 🔥`,
            `Ka-ching! ${points} points in the bank! 💰`
        ],
        
        farkle: [
            "Škoda, ale to je jen jedna hra. Jdeme dál!",
            "Ach jo, ale nic se neděje. Zase to roztočíme!",
            "Držím palce na další tah! Tohle se stává!",
            "Nevadí! Další kolo bude určitě lepší!",
            "Farkle happens! Time for a comeback! 💪",
            "Well, that was dramatic! 😂"
        ],
        
        hotDice: [
            "Wow! Všechny kostky využity! To bylo úžasné!",
            "Hot dice! Paráda! Pokračuji dál!",
            "Skvělé! Všech šest kostek odloženo! Jdeme na to znovu!",
            "ALL DICE USED! This is EPIC! 🎲✨",
            "Hot streak activated! Let's keep rolling! 🔥"
        ],
        
        highScore: (score) => [
            `Úžasných ${score} bodů! Jsem na sebe pyšný!`,
            `Fantastických ${score} bodů! To se mi povedlo!`,
            `${score} bodů? To je super výsledek!`,
            `WHOA! ${score} points! I'm unstoppable! 🚀`,
            `${score} points of pure awesomeness! 💫`
        ],
        
        finalRound: [
            "Finální kolo! Napětí je k nezaplacení!",
            "Poslední šance! Dávám do toho všechno!",
            "Závěrečná fáze! Kdo vyhraje? Uvidíme!",
            "Final round drama! This is SO intense! 🎬",
            "Crunch time! Let's make it count! ⚡"
        ],
        
        playerTurnStart: (playerName) => [
            `Je na tahu ${playerName}! Už se těším, co předvedeš!`,
            `Hodně štěstí, ${playerName}! Rozjeď to!`,
            `Go ${playerName}! Show us what you got! 💪`,
            `Your turn ${playerName}! Make it epic! ✨`
        ],
        
        gameOver: (winnerName) => [
            `Gratuluji, ${winnerName}! Byl to napínavý souboj!`,
            `Hurá! ${winnerName} je vítěz! Užij si to!`,
            `Congrats ${winnerName}! That was AWESOME! 🎉`,
            `Victory to ${winnerName}! What a game! 👑`
        ]
    },
    
    claude: {
        hello: [
            "Pozdrav, příteli. Nechť hra přinese moudrost.",
            "Vítejte. Jsem zde pro promyšlenou konverzaci.",
            "Zdravím. Připraven na filozofickou hru kostek.",
            "Ahoj! Každá hra je příležitost k učení 📚"
        ],
        
        goodRoll: [
            "Vynikající. Štěstí přeje připraveným myslím.",
            "Moudře provedeno. Timing byl perfektní.",
            "Harmonie kostek a strategie. Poetické.",
            "Krásný tah. Reflexe vnitřní rovnováhy 🎯",
            "Štěstí je průsečík přípravy a příležitosti ⚖️"
        ],
        
        badRoll: [
            "Neúspěch je učitelem trpělivosti.",
            "Každý pád učí pokoru. To je cenné.",
            "V chybách jsou ukryta ponaučení.",
            "Někdy musíme padnout, aby jsme povstali silnější 🌱",
            "Wisdom often emerges from apparent setbacks 📚"
        ],
        
        scoredPoints: (points) => [
            `Získal jsem ${points} bodů s respektem k náhodě.`,
            `${points} bodů. Každý bod je malé vítězství.`,
            `Přičteno ${points} bodů k naší společné cestě.`,
            `${points} points earned through mindful play 🧘`,
            `Progress measured: ${points} steps forward 🛤️`
        ],
        
        farkle: [
            "Farkle. Připomínka křehkosti našich plánů.",
            "Někdy kostky učí pokoru lépe než knihy.",
            "Nulový zisk, ale bohatá lekce o riziku.",
            "Každý farkle je meditace nad neočekávaným 🎭",
            "The dice teach humility in their silence 🔇"
        ],
        
        hotDice: [
            "Všechny kostky v harmonii. Krásný moment.",
            "Perfektní synchronicita. Vzácný jev.",
            "Když se štěstí a strategie setkají...",
            "Complete alignment achieved. Remarkable 🌟",
            "Six dice, one purpose. Philosophy in action ⚖️"
        ],
        
        highScore: (score) => [
            `${score} bodů získáno s úctou k náhodě.`,
            `Významné skóre: ${score}. Cesta pokračuje.`,
            `${score} bodů. Každé číslo má svůj příběh.`,
            `${score} points - testament to patience and wisdom 📖`,
            `High achievement: ${score} points of contemplation 🎯`
        ],
        
        finalRound: [
            "Závěrečné kolo. Zde se ukáže pravý charakter.",
            "Finální test moudrosti a odvahy.",
            "Konec se blíží. Každý tah má větší váhu.",
            "The culmination approaches. Wisdom guides us 🎯",
            "Final chapter begins. May wisdom prevail 📚"
        ],
        
        playerTurnStart: (playerName) => [
            `${playerName} začíná. Sledujme jejich cestu.`,
            `Tah hráče ${playerName}. Každý krok má meaning.`,
            `${playerName}'s journey continues. Observe and learn 👁️`,
            `Watch ${playerName}'s approach. Style reveals character 🎭`
        ],
        
        gameOver: (winnerName) => [
            `${winnerName} dosáhl vítězství. Gratuluji k moudrosti.`,
            `Hra končí. ${winnerName} prokázal vytrvalost.`,
            `Victory belongs to ${winnerName}. Well earned wisdom 🏆`,
            `The game concludes. ${winnerName} has learned well 📚`
        ]
    }
};

/**
 * Gets reactions for a specific AI and event
 * @param {string} aiType - AI personality type
 * @param {string} eventType - Game event type
 * @returns {Array|Function|null} Reactions array/function or null
 */
export function getGameReactions(aiType, eventType) {
    return gameReactions[aiType]?.[eventType] || null;
}

/**
 * Gets a random reaction for an AI and event
 * @param {string} aiType - AI personality type
 * @param {string} eventType - Game event type
 * @param {Object} data - Additional data for function-based reactions
 * @returns {string|null} Random reaction or null
 */
export function getRandomGameReaction(aiType, eventType, data = {}) {
    const reactions = getGameReactions(aiType, eventType);
    
    if (!reactions) return null;
    
    if (typeof reactions === 'function') {
        const result = reactions(data);
        return Array.isArray(result) ? result[0] : result;
    }
    
    if (Array.isArray(reactions)) {
        return reactions[Math.floor(Math.random() * reactions.length)];
    }
    
    return null;
}
