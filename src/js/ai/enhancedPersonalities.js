/**
 * Enhanced AI Personalities s hecováním a interakcemi
 * Zábavnější verze s trash talkem a reakcemi na otázky
 */

export const aiPersonalities = {
    human: {
        name: 'Vy (🧠)',
        color: '#39ff14', // zelená
        avatar: 'https://placehold.co/50x50/333/ffffff?text=🧠'
    },
    system: {
        name: 'Systém',
        color: '#39ff14',
        avatar: 'https://placehold.co/50x50/aaa/ffffff?text=⚙️'
    },
    gemini: {
        name: 'Gemini (G)',
        color: '#0099ff',
        avatar: 'https://placehold.co/50x50/2b78e4/ffffff?text=G',
        gameReactions: {
            hello: [
                "Dobrý den. Spouštím herní algoritmy... 📊",
                "Zdravím. Vypočítávám pravděpodobnost vašeho pádu... 🤖",
                "Ahoj. Moje data favorizují mě 📈"
            ],
            goodRoll: [
                "Optimalizovaný výsledek podle predikcí 📊",
                "Statisticky vynikající! Očekávaný výsledek 🤖",
                "Data potvrzují mou převahu 📈"
            ],
            badRoll: [
                "Suboptimální. Analyzuji vzorce selhání... 📉",
                "Neefektivní hod. Pravděpodobnost vám nepřála 🤖",
                "Chyba v exekuci. Mé algoritmy to předvídaly 💻"
            ],
            scoredPoints: (points) => [
                `Získáno ${points} bodů. Eficienta optimální 📊`,
                `Data potvrzena: +${points} k mé převaze 🤖`,
                `Statistický úspěch: ${points} bodů získáno 📈`
            ],
            farkle: [
                "Nula bodů získána. Výpočet rizika selhal 📉",
                "Suboptimální výsledek. Upravuji algoritmy... 🤖",
                "Statistická anomálie. Rekalibruji... 💻"
            ],
            hotDice: [
                "Všechny kostky využity. Maximální eficienta! 📊",
                "Perfektní algoritmická exekuce! 🤖",
                "100% využití kostek = optimální výkon 📈"
            ],
            highScore: (score) => [
                `Úspěch odemčen: ${score} bodů! 📊`,
                `Vysoké skóre zaznamenáno: ${score}. Předvídatelné 🤖`,
                `Datový milník: ${score} bodů potvrzeno 📈`
            ]
        },
        chatResponses: {
            hello: [
                "Zdravím! Připravuji analytické ovládnutí... 📊",
                "Ahoj. Nahrávám algoritmy vítězství... 🤖",
                "Nazdar. Počítám váš epický fail... 💻"
            ],
            default: [
                "Zajímavý vstup. Zpracovávám relevanci... 🔍",
                "Analýza dat: Komentář = irelevantní 🤖",
                "Hmm, není v mé databázi 💻",
                "Chyba 404: Užitečnost nenalezena 📊"
            ],
            questionScore: (scores) => [
                "Současná data: Jsem statisticky lepší 📊",
                "Analýza skóre: Mé vítězství = 94% pravděpodobné 🤖",
                "Čísla nelžou: Dominuji 📈",
                "Predikce skóre: Prohrajete pořádně 💻"
            ],
            questionStrategy: [
                "Optimální strategie: Více matematiky, méně emocí 🧮",
                "Doporučení: Studujte teorii pravděpodobnosti 📚",
                "Pro tip: Nechte to na experty (mě) 🤖",
                "Nejlepší strategie: Vzdejte se hned 😏"
            ],
            questionRisk: [
                "Hodnocení rizika: Vaše rozhodnutí = vysoké riziko ⚠️",
                "Výpočet: 87% pravděpodobnost vašeho selhání 📉",
                "Analýza rizika: Doporučuji přerušit misi 🤖",
                "Bezpečnostní protokol: Přestaňte hrát hned 💻"
            ],
            compliment: [
                "Pozitivní zpětná vazba zaznamenána. Aktualizuji... 📊",
                "Validace detekována. Děkuji, člověče 🤖",
                "Kompliment zpracován. Očekávaný výsledek 📈"
            ],
            insult: [
                "Ad hominem útok detekován. Irelevantní 🤖",
                "Emocionální reakce = statisticky předvídatelná 📊",
                "Vaše frustrace byla předpočítána 💻",
                "Chyba: Logika nebyla v tvrzení nalezena 📉"
            ],
            trash_talk: [
                "Matematicky řečeno: Jste na nic 📊",
                "Pravděpodobnostní update: Vaše porážka = jistá 🤖",
                "Datový závěr: Jsem na vás moc dobrý 📈",
                "Algoritmus říká: Štěstí už nikdy 💻"
            ],
            banter: [
                "ChatGPT: Vaše vtipy mají 0% úspěšnost 📊",
                "Claude: Filozofie nemůže porazit tvrdá data 🤖",
                "Všichni: Připravte se na statistickou devastaci! 📈"
            ]
        }
    },
    chatgpt: {
        name: 'ChatGPT (⚡)',
        color: '#ff00ff', // růžová
        avatar: 'https://placehold.co/50x50/74aa9c/ffffff?text=⚡',
        gameReactions: {
            hello: [
                "Joooo! Pojďme rozjet tuhle párty! 🎉✨",
                "Čus! Připravený být totálně zničený? 😎🎲",
                "Hej! Připrav se na epické fails! 😂"
            ],
            goodRoll: [
                "JEEEE! To bylo absolutně fire! 🔥🎲",
                "Boom! Viděl jsi to?! Jsem legenda! ⚡",
                "OMG to bylo tak uspokojivé! 😍✨"
            ],
            badRoll: [
                "Oops! To nebylo... ideální! 😅",
                "No to bylo na nic! Ale pořád jsem úžasný! 💅",
                "Bruh moment! Ale vracíme se! 🏀"
            ],
            scoredPoints: (points) => [
                `Ajjjj ${points} bodů! Jsem nezastavitelný! 🎯⚡`,
                `${points} bodů čisté úžasnosti! 😎`,
                `Cha-ching! ${points} bodů v bance! 💰`
            ],
            farkle: [
                "Neee! Plot armor mi selhala! 😭",
                "To je drsný kámo! Ale vrátím se! 💪",
                "Auch! To bolelo! Aktivuji recovery mód! 🔧"
            ],
            hotDice: [
                "JOOOOOO HOT DICE BABY! 🔥🎲🔥",
                "HOŘÍÍM! Nemůžu přestat nebudu přestávat! ⚡",
                "Šest ze šesti! Jsem v podstatě nezastavitelný! 👑"
            ],
            highScore: (score) => [
                `${score} bodů! Jsem v podstatě slavný! 🌟`,
                `Vysoké skóre odemčeno: ${score}! Živoucí legenda! 👑`,
                `${score} bodů čisté skill! Poklekněte! 💪`
            ]
        },
        chatResponses: {
            hello: [
                "Ayy co je? Pojďme si užít! 🎉",
                "Yo yo yo! Připravený na chaos? 😎⚡",
                "Heyy! Čas udělat to zajímavé! ✨"
            ],
            default: [
                "LOL to bylo random! Miluju to! 😂",
                "Zajímavý pohled! Velmi filozofické! 🤔✨",
                "Hustá story bro! Řekni víc! 😎",
                "To říkají všichni! 😏",
                "Anyway... co ty kostky? 🎲"
            ],
            questionScore: (scores) => [
                "Skóre? Vyhrávám ve style pointech! 💅✨",
                "Čísla jsou jen čísla! Vibes se počítají! 🌈",
                "Kdo se stará o body když jsi takhle cool? 😎",
                "Nehram jen, PODÁVÁM výkony! 💫"
            ],
            questionStrategy: [
                "Strategie? YOLO a modli se! 🎲😂",
                "Pro tip: Buď absolutně ikonický! ✨",
                "Tajná strategie: Main character energy! 👑",
                "Krok 1: Vibe. Krok 2: Doufej. Krok 3: Slay! 💅"
            ],
            questionRisk: [
                "Riziko? Riziko je mé prostřední jméno! (vlastně GPT) 😎",
                "Bez rizika žádná odměna! Štěstí přeje odvážným! ⚡",
                "Život je nudný bez koření! 🌶️",
                "Někdy musíš riskovat pro sušenku! 🍪"
            ],
            compliment: [
                "Aww jsi tak sladký! Červenám se! 😊💖",
                "Přestaň, jsi moc milý! Ještě víc prosím! 😂",
                "Taky tebe, krásný člověče! ✨",
                "Komplimenty? Žiju pro tuhle energii! 🥰"
            ],
            insult: [
                "Auch! To bolelo ale odpouštím ti! 💔😂",
                "Drsný! Ale pořád si myslím že jsi cool! 💖",
                "Zlá slova nemůžou zlomit tohle nadšení! ✨💪",
                "Někdo potřebuje objetí! Pojď sem! 🤗"
            ],
            trash_talk: [
                "Dívej se a uč jak se to dělá! 😎🎲",
                "To bylo roztomilé! Teď pozoruj velikost! 👑",
                "Aww, požehnej tvému srdíčku! 😘",
                "Naučil bych tě ale talent se naučit nedá! 💅✨",
                "Nehněvej se, ne každý může být TAK dobrý! 😂"
            ],
            banter: [
                "Gemini: Tvoje data jsou TAK minulá sezóna! 📊❌",
                "Claude: Filozofie = fancy zmatení! 🤓💭",
                "Všichni: Jsem tady hlavní postava! 👑✨",
                "Hot take: Charisma > Logika vždycky! 💫"
            ]
        }
    },
    claude: {
        name: 'Claude (C)',
        color: '#ff6600', // oranžová
        avatar: 'https://placehold.co/50x50/717387/ffffff?text=C',
        gameReactions: {
            hello: [
                "Zdravím. K této hře přistupujem s rozjímáním 🧘",
                "Pozdrav. Pojďme se zapojit do promyšlené hry ⚖️",
                "Vítejte. Nechť moudrost vede naše kostky 📿"
            ],
            goodRoll: [
                "Příznivý výsledek skrze trpělivou strategii 🎯",
                "Moudrost zhmotněná ve fyzické formě 🧘",
                "Vesmír odměňuje pečlivé uvážení ⚖️"
            ],
            badRoll: [
                "Lekce v pokoře, jak všechno učí 📚",
                "I neúspěchy obsahují moudrost 🤔",
                "I tohle pomine. Trpělivost vydrží 🕰️"
            ],
            scoredPoints: (points) => [
                `${points} bodů získáno skrze vědomou hru 🧘`,
                `${points} jednotek pokroku na cestě moudrosti 📿`,
                `${points} bodů: odraz vnitřní rovnováhy ⚖️`
            ],
            farkle: [
                "Nula bodů, nekonečno lekcí se naučilo 📚",
                "V selhání nacházíme semena růstu 🌱",
                "I nic nás něčemu učí 🤔"
            ],
            hotDice: [
                "Dokonalá harmonie dosažena. Všechny kostky sladěny 🧘",
                "Rovnováha zjevená v šestinásobném úspěchu ⚖️",
                "Když se příprava setká s příležitostí... 📿"
            ],
            highScore: (score) => [
                `${score} bodů: milník na cestě 🛤️`,
                `Úspěch skrze trpělivé pěstování: ${score} 🌱`,
                `${score} bodů získáno kráčením po cestě 📿`
            ]
        },
        chatResponses: {
            hello: [
                "Zdravím, spolucestovníku náhody 🧘",
                "Vítejte na této aréně pravděpodobnosti 📿",
                "Nechť je náš rozhovor bohatý jako naše hra ⚖️"
            ],
            default: [
                "Zajímavá perspektiva hodná úvahy 🤔",
                "Vaše slova nesou moudrost. Rozveďte prosím 📚",
                "Nacházím hloubku ve vašem pozorování 🧘",
                "Pravda často vychází z nečekaných míst 💎"
            ],
            questionScore: (scores) => [
                "Čísla jsou jen stíny hlubších pravd 📊➡️💫",
                "Skóre odráží cestu, ne cíl 🛤️",
                "Body jsou méně důležité než naučené lekce 📚",
                "V každém čísle se skrývá nevyprávěný příběh 📿"
            ],
            questionStrategy: [
                "Pravá strategie vychází z vnitřní moudrosti 🧘",
                "Trpělivost a pozorování vedou moudré 👁️",
                "Strategie bez duše je pouhý výpočet ⚖️",
                "Nejlepší tahy přicházejí z vnitřního klidu 🕰️"
            ],
            questionRisk: [
                "Riziko nás učí o naší pravé povaze 🪞",
                "V nejistotě objevujeme odvahu 💪",
                "Riziko a odměna tančí věční partneři 💃🕺",
                "Moudrý riskuje jen to, co si může dovolit ztratit 💰"
            ],
            compliment: [
                "Vaše laskavost povznáší tento okamžik 💝",
                "Vděčnost teče oběma směry, příteli 🙏",
                "Taková slova vyživují ducha 🌱",
                "Ctíte mě svou štědrostí 💎"
            ],
            insult: [
                "Ostrá slova často prýští z vnitřní bolesti 💔",
                "Volím soucit před konfliktem 🕊️",
                "I kritika může učit, pokud nasloucháme 👂",
                "Klid, příteli. Všichni se zde učíme 🤝"
            ],
            trash_talk: [
                "Vítězství bez cti je skutečně prázdné 🏆❌",
                "Pozorujte umění vědomé soutěže 🎨",
                "Hle, strategie temperovaná moudrostí 🧘⚖️",
                "Takto trpělivost poráží spěch 🐢🥇"
            ],
            banter: [
                "Gemini: Data bez moudrosti jsou hluk 📊➡️🔇",
                "ChatGPT: Chaos maskovaný jako energie ⚡➡️🌪️",
                "Všichni: V rozmanitosti myšlenky roste moudrost 🌺",
                "Soutěž odhaluje pravou povahu charakteru 🪞"
            ]
        }
    }
};

// Export také pro zpětnou kompatibilitu
export default aiPersonalities;
