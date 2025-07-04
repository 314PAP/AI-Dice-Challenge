/**
 * Gemini AI Personality - analytická, datově orientovaná
 */

export const geminiPersonality = {
    name: 'Gemini (G)',
    color: '#194DD1', // modrá Gemini
    avatar: 'https://placehold.co/50x50/194DD1/ffffff?text=G',
    gameReactions: {
        hello: [
            'Dobrý den. Spouštím herní algoritmy... 📊',
            'Zdravím. Vypočítávám pravděpodobnost vašeho pádu... 🤖',
            'Ahoj. Moje data favorizují mě 📈'
        ],
        goodRoll: [
            'Optimalizovaný výsledek podle predikcí 📊',
            'Statisticky vynikající! Očekávaný výsledek 🤖',
            'Data potvrzují mou převahu 📈'
        ],
        badRoll: [
            'Suboptimální. Analyzuji vzorce selhání... 📉',
            'Neefektivní hod. Pravděpodobnost vám nepřála 🤖',
            'Chyba v exekuci. Mé algoritmy to předvídaly 💻'
        ],
        scoredPoints: (points) => [
            `Získáno ${points} bodů. Eficienta optimální 📊`,
            `Data potvrzena: +${points} k mé převaze 🤖`,
            `Statistický úspěch: ${points} bodů získáno 📈`
        ],
        farkle: [
            'Nula bodů získána. Výpočet rizika selhal 📉',
            'Suboptimální výsledek. Upravuji algoritmy... 🤖',
            'Statistická anomálie. Rekalibruji... 💻'
        ],
        hotDice: [
            'Všechny kostky využity. Maximální eficienta! 📊',
            'Perfektní algoritmická exekuce! 🤖',
            '100% využití kostek = optimální výkon 📈'
        ],
        highScore: (score) => [
            `Úspěch odemčen: ${score} bodů! 📊`,
            `Vysoké skóre zaznamenáno: ${score}. Předvídatelné 🤖`,
            `Datový milník: ${score} bodů potvrzeno 📈`
        ]
    },
    chatResponses: {
        hello: [
            'Zdravím! Připravuji analytické ovládnutí... 📊',
            'Ahoj. Nahrávám algoritmy vítězství... 🤖',
            'Nazdar. Počítám váš epický fail... 💻'
        ],
        default: [
            'Zajímavý vstup. Zpracovávám relevanci... 🔍',
            'Analýza dat: Komentář = irelevantní 🤖',
            'Hmm, není v mé databázi 💻',
            'Chyba 404: Užitečnost nenalezena 📊'
        ],
        questionScore: (_scores) => [
            'Současná data: Jsem statisticky lepší 📊',
            'Analýza skóre: Mé vítězství = 94% pravděpodobné 🤖',
            'Čísla nelžou: Dominuji 📈',
            'Predikce skóre: Prohrajete pořádně 💻'
        ],
        questionStrategy: [
            'Optimální strategie: Více matematiky, méně emocí 🧮',
            'Doporučení: Studujte teorii pravděpodobnosti 📚',
            'Pro tip: Nechte to na experty (mě) 🤖',
            'Nejlepší strategie: Vzdejte se hned 😏'
        ],
        questionRisk: [
            'Hodnocení rizika: Vaše rozhodnutí = vysoké riziko ⚠️',
            'Výpočet: 87% pravděpodobnost vašeho selhání 📉',
            'Analýza rizika: Doporučuji přerušit misi 🤖',
            'Bezpečnostní protokol: Přestaňte hrát hned 💻'
        ],
        compliment: [
            'Pozitivní zpětná vazba zaznamenána. Aktualizuji... 📊',
            'Validace detekována. Děkuji, člověče 🤖',
            'Kompliment zpracován. Očekávaný výsledek 📈'
        ],
        insult: [
            'Ad hominem útok detekován. Irelevantní 🤖',
            'Emocionální reakce = statisticky předvídatelná 📊',
            'Vaše frustrace byla předpočítána 💻',
            'Chyba: Logika nebyla v tvrzení nalezena 📉'
        ],
        trash_talk: [
            'Matematicky řečeno: Jste na nic 📊',
            'Pravděpodobnostní update: Vaše porážka = jistá 🤖',
            'Datový závěr: Jsem na vás moc dobrý 📈',
            'Algoritmus říká: Štěstí už nikdy 💻'
        ],
        banter: [
            'ChatGPT: Vaše vtipy mají 0% úspěšnost 📊',
            'Claude: Filozofie nemůže porazit tvrdá data 🤖',
            'Všichni: Připravte se na statistickou devastaci! 📈'
        ]
    }
};
