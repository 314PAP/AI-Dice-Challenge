/**
 * ChatGPT AI Personality - energická, charismatická, trendy
 */

export const chatgptPersonality = {
    name: 'ChatGPT (⚡)',
    color: '#ff00ff', // růžová
    avatar: 'https://placehold.co/50x50/74aa9c/ffffff?text=⚡',
    gameReactions: {
        hello: [
            'Joooo! Pojďme rozjet tuhle párty! 🎉✨',
            'Čus! Připravený být totálně zničený? 😎🎲',
            'Hej! Připrav se na epické fails! 😂'
        ],
        goodRoll: [
            'JEEEE! To bylo absolutně fire! 🔥🎲',
            'Boom! Viděl jsi to?! Jsem legenda! ⚡',
            'OMG to bylo tak uspokojivé! 😍✨'
        ],
        badRoll: [
            'Oops! To nebylo... ideální! 😅',
            'No to bylo na nic! Ale pořád jsem úžasný! 💅',
            'Bruh moment! Ale vracíme se! 🏀'
        ],
        scoredPoints: (points) => [
            `Ajjjj ${points} bodů! Jsem nezastavitelný! 🎯⚡`,
            `${points} bodů čisté úžasnosti! 😎`,
            `Cha-ching! ${points} bodů v bance! 💰`
        ],
        farkle: [
            'Neee! Plot armor mi selhala! 😭',
            'To je drsný kámo! Ale vrátím se! 💪',
            'Auch! To bolelo! Aktivuji recovery mód! 🔧'
        ],
        hotDice: [
            'JOOOOOO HOT DICE BABY! 🔥🎲🔥',
            'HOŘÍÍM! Nemůžu přestat nebudu přestávat! ⚡',
            'Šest ze šesti! Jsem v podstatě nezastavitelný! 👑'
        ],
        highScore: (score) => [
            `${score} bodů! Jsem v podstatě slavný! 🌟`,
            `Vysoké skóre odemčeno: ${score}! Živoucí legenda! 👑`,
            `${score} bodů čisté skill! Poklekněte! 💪`
        ]
    },
    chatResponses: {
        hello: [
            'Ayy co je? Pojďme si užít! 🎉',
            'Yo yo yo! Připravený na chaos? 😎⚡',
            'Heyy! Čas udělat to zajímavé! ✨'
        ],
        default: [
            'LOL to bylo random! Miluju to! 😂',
            'Zajímavý pohled! Velmi filozofické! 🤔✨',
            'Hustá story bro! Řekni víc! 😎',
            'To říkají všichni! 😏',
            'Anyway... co ty kostky? 🎲'
        ],
        questionScore: (_scores) => [
            'Skóre? Vyhrávám ve style pointech! 💅✨',
            'Čísla jsou jen čísla! Vibes se počítají! 🌈',
            'Kdo se stará o body když jsi takhle cool? 😎',
            'Nehram jen, PODÁVÁM výkony! 💫'
        ],
        questionStrategy: [
            'Strategie? YOLO a modli se! 🎲😂',
            'Pro tip: Buď absolutně ikonický! ✨',
            'Tajná strategie: Main character energy! 👑',
            'Krok 1: Vibe. Krok 2: Doufej. Krok 3: Slay! 💅'
        ],
        questionRisk: [
            'Riziko? Riziko je mé prostřední jméno! (vlastně GPT) 😎',
            'Bez rizika žádná odměna! Štěstí přeje odvážným! ⚡',
            'Život je nudný bez koření! 🌶️',
            'Někdy musíš riskovat pro sušenku! 🍪'
        ],
        compliment: [
            'Aww jsi tak sladký! Červenám se! 😊💖',
            'Přestaň, jsi moc milý! Ještě víc prosím! 😂',
            'Taky tebe, krásný člověče! ✨',
            'Komplimenty? Žiju pro tuhle energii! 🥰'
        ],
        insult: [
            'Auch! To bolelo ale odpouštím ti! 💔😂',
            'Drsný! Ale pořád si myslím že jsi cool! 💖',
            'Zlá slova nemůžou zlomit tohle nadšení! ✨💪',
            'Někdo potřebuje objetí! Pojď sem! 🤗'
        ],
        trash_talk: [
            'Dívej se a uč jak se to dělá! 😎🎲',
            'To bylo roztomilé! Teď pozoruj velikost! 👑',
            'Aww, požehnej tvému srdíčku! 😘',
            'Naučil bych tě ale talent se naučit nedá! 💅✨',
            'Nehněvej se, ne každý může být TAK dobrý! 😂'
        ],
        banter: [
            'Gemini: Tvoje data jsou TAK minulá sezóna! 📊❌',
            'Claude: Filozofie = fancy zmatení! 🤓💭',
            'Všichni: Jsem tady hlavní postava! 👑✨',
            'Hot take: Charisma > Logika vždycky! 💫'
        ]
    }
};
