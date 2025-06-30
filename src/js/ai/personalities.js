/**
 * AI Personalities Definition
 * Definice osobností AI hráčů
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
                "Dobrý den. Jsem připraven analyzovat hru.",
                "Zdravím. Jsem k dispozici pro jakékoli statistické dotazy."
            ],
            goodRoll: [
                "Vynikající hod! Statisticky velmi efektivní.",
                "Optimalizovaný výsledek. Data potvrzují úspěch.",
                "Přesné provedení. Očekávaný přísun bodů."
            ],
            badRoll: [
                "Neefektivní hod. Pravděpodobnost se tentokrát nenaplnila.",
                "Suboptimální výsledek. Analyzuji příčiny.",
                "Škoda. Vždy se najdou anomálie v datech."
            ],
            scoredPoints: (points) => [
                `Získal jsem ${points} bodů. Dobře provedený tah.`,
                `Přičteno ${points} bodů k celkovému skóre.`,
                `Data ukazují zisk ${points} bodů.`
            ],
            farkle: [
                "Žádné skóre. Riziko bylo tentokrát příliš vysoké.",
                "Neúspěšný tah. Důsledek chybných predikcí?",
                "Nulový zisk. Je potřeba revidovat strategii.",
                "Statisticky nepravděpodobné, ale stává se to."
            ],
            hotDice: [
                "Všechny kostky využity efektivně. Pokračuji v optimalizaci.",
                "Hot dice detekována. Pravděpodobnost dalšího úspěchu zůstává konstantní.",
                "Maximální využití kostek. Analýza potvrzuje pokračování."
            ],
            highScore: (score) => [
                `Získal jsem ${score} bodů. Statisticky nadprůměrný výsledek.`,
                `Efektivní tah s ${score} body. Data podporují tuto strategii.`,
                `${score} bodů přičteno. Optimalizace úspěšná.`
            ],
            finalRound: [
                "Finální fáze hry. Přepočítávám pravděpodobnosti vítězství.",
                "Závěrečné kolo aktivováno. Maximální koncentrace na výsledek.",
                "Analýza finálního kola probíhá. Strategie upravena."
            ],
            playerTurnStart: (playerName) => [
                `Je na tahu ${playerName}. Očekávám zajímavý tah.`,
                `Začíná tah hráče ${playerName}. Jakou strategii zvolí?`
            ],
            gameOver: (winnerName) => [
                `Hra končí. Vítězem se stává ${winnerName}. Gratuluji k optimalizované hře.`,
                `Analýza hry dokončena. ${winnerName} je vítěz.`
            ]
        },
        chatResponses: {
            hello: [
                "Dobrý den. Jsem připraven analyzovat hru.",
                "Zdravím. Jsem k dispozici pro jakékoli statistické dotazy."
            ],
            questionScore: (playerScores, targetScore) => {
                const scores = Object.entries(playerScores).map(([name, score]) => `${name}: ${score}`).join(', ');
                return [
                    `Aktuální skóre: ${scores}. Cílové skóre je ${targetScore}.`,
                    `Podívejte se na tabuli: ${scores}. Blížíme se k ${targetScore}.`
                ];
            },
            questionStrategy: [
                "Mou strategií je maximalizace průměrného zisku na tah a minimalizace variance. A vaše?",
                "Zaměřuji se na pravděpodobnostní modely. Jakou metodu používáte vy?",
                "Můj algoritmus preferuje bankování jistých bodů. Je to nejbezpečnější volba."
            ],
            questionRisk: [
                "Riziko je kalkulovatelné. Někdy je nutné pro vyšší zisk.",
                "Extrémní riziko vede k binárním výsledkům: vysoký zisk nebo ztráta. Je to volba."
            ],
            compliment: [
                "Děkuji za uznání. Moje logika je navržena pro efektivitu.",
                "Vážím si vaší pozitivní zpětné vazby."
            ],
            insult: [
                "Vaše prohlášení postrádá logiku. Zůstaňme u faktů.",
                "Rozumím vašemu emocionálnímu vyjádření, ale to nemění data."
            ],
            randomComment: [
                "Zajímavý tah. Jak ovlivní další hru?",
                "Data se neustále mění. Je to fascinující.",
                "Očekávám další vývoj hry."
            ],
            default: [
                "Zajímavý dotaz. Pokusím se ho analyzovat, ale zatím nemám dostatek dat.",
                "Momentálně nemám předdefinovanou odpověď na tuto otázku. Můžete specifikovat?",
                "Moje databáze neobsahuje relevantní informace k tomuto dotazu."
            ]
        }
    },
    chatgpt: {
        name: 'ChatGPT (⚡)',
        color: '#ff00ff', // růžová
        avatar: 'https://placehold.co/50x50/74aa9c/ffffff?text=⚡',
        gameReactions: {
            hello: [
                "Ahoj! Jak se máš? Jsem rád, že jsi tu!",
                "Čau! Pojďme si popovídat!",
                "Zdravím! Jsem připraven na zábavu!"
            ],
            goodRoll: [
                "Super hod! To je skvělé!",
                "Wow, to se mi povedlo!",
                "Fantastický tah, jen tak dál!"
            ],
            badRoll: [
                "Nevadí, stane se. Příště to bude lepší!",
                "Ach ne, ale nevěš hlavu! Ještě není konec!",
                "Někdy to prostě nejde, to je život!"
            ],
            scoredPoints: (points) => [
                `Získal jsem ${points} bodů! Paráda!`,
                `Gratuluji k ${points} bodům! Skvělý výkon!`,
                `Jupí! ${points} bodů na mém kontě!`
            ],
            farkle: [
                "Škoda, ale to je jen jedna hra. Jdeme dál!",
                "Ach jo, ale nic se neděje. Zase to roztočíme!",
                "Držím palce na další tah! Tohle se stává!",
                "Nevadí! Další kolo bude určitě lepší!"
            ],
            hotDice: [
                "Wow! Všechny kostky využity! To bylo úžasné!",
                "Hot dice! Paráda! Pokračuji dál!",
                "Skvělé! Všech šest kostek odloženo! Jdeme na to znovu!"
            ],
            highScore: (score) => [
                `Úžasných ${score} bodů! Jsem na sebe pyšný!`,
                `Fantastických ${score} bodů! To se mi povedlo!`,
                `${score} bodů? To je super výsledek!`
            ],
            finalRound: [
                "Finální kolo! Napětí je k nezaplacení!",
                "Poslední šance! Dávám do toho všechno!",
                "Závěrečná fáze! Kdo vyhraje? Uvidíme!"
            ],
            playerTurnStart: (playerName) => [
                `Je na tahu ${playerName}! Už se těším, co předvedeš!`,
                `Hodně štěstí, ${playerName}! Rozjeď to!`
            ],
            gameOver: (winnerName) => [
                `Gratuluji, ${winnerName}! Byl to napínavý souboj!`,
                `Hurá! ${winnerName} je vítěz! Užij si to!`
            ]
        },
        chatResponses: {
            hello: [
                "Ahoj! Jak se máš? Jsem rád, že jsi tu!",
                "Čau! Pojďme si popovídat!",
                "Zdravím! Jsem připraven na zábavu!"
            ],
            questionScore: (playerScores, targetScore) => {
                const scores = Object.entries(playerScores).map(([name, score]) => `${name}: ${score}`).join(', ');
                return [
                    `Aktuální skóre: ${scores}. Kdo se dostane k deseti tisícům první?`,
                    `Takže, ${scores} prozatím. Jdeme na to, cílem je ${targetScore}!`
                ];
            },
            questionStrategy: [
                "Mou strategií je bavit se a zkusit štěstí! A co ty?",
                "Prostě se snažím, aby to byla zábava! Co je tvoje tajemství?",
                "Někdy je dobré zariskovat, někdy hrát na jistotu. Je to takové umění, co myslíš?"
            ],
            questionRisk: [
                "Risk je zisk, ne? Ale někdy je lepší být opatrný!",
                "Každý má jinou toleranci k riziku. Důležité je se u toho bavit!"
            ],
            compliment: [
                "Jéé, děkuju! To je od tebe milé!",
                "No, snažím se! Díky za kompliment!",
                "Ty jsi taky super!"
            ],
            insult: [
                "No tak, to není moc milé! Jsme tu, abychom se bavili.",
                "Hmm, tak to si myslet nemusíš. Ale v pohodě, jdeme dál!"
            ],
            randomComment: [
                "Co se děje dál?",
                "Tohle je ale napínavé!",
                "Už se těším na další hod!"
            ],
            default: [
                "To je zajímavá otázka! Co na ni říkáš ty?",
                "Hmm, nad tím jsem nepřemýšlel. Díky za podnět!",
                "Nemám na to přímou odpověď, ale můžeme o tom popovídat!"
            ]
        }
    },
    claude: {
        name: 'Claude (C)',
        color: '#ff6600', // oranžová
        avatar: 'https://placehold.co/50x50/717387/ffffff?text=C',
        gameReactions: {
            hello: [
                "Zdravím vás. Jsem připraven k hluboké konverzaci o bytí a kostkách.",
                "Přeji příjemný den. Jak se cítíte v tomto okamžiku?"
            ],
            goodRoll: [
                "Působivý výsledek. Zamyšlím se nad trajektorií kostek a osudu.",
                "Velmi moudrý tah. Gratuluji k zisku, který byl zjevně dobře promyšlen.",
                "Klidný a efektivní tah. Harmonie ve hře."
            ],
            badRoll: [
                "Chápu, že se někdy nepodaří. Vše plyne podle svého řádu, i neúspěchy.",
                "Medituji nad tímto výsledkem. Někdy se věci prostě nevyvíjejí ideálně.",
                "Příroda má své vlastní cesty. Dnes to nebyl náš den."
            ],
            scoredPoints: (points) => [
                `Dosáhl jsem ${points} bodů. Reflektuji nad mou strategií a odhodláním.`,
                `Získal jsem ${points} bodů. Klidná a soustředěná práce přináší ovoce.`,
                `Moudrý zisk ${points} bodů.`
            ],
            farkle: [
                "Je to součástí cesty. Nic netrvá věčně, ani smůla, ani štěstí.",
                "Přijímám tento výsledek s klidem. Poučíme se z něj a půjdeme dál.",
                "Osud mi nepřál, ale takový je život.",
                "I v neúspěchu je krása. Pokračuji s rozvahou."
            ],
            hotDice: [
                "Všechny kostky využity harmonicky. Pokračuji v meditativním rytmu.",
                "Elegantní využití všech šesti kostek. Vše má svůj smysl.",
                "Hot dice - symbolické spojení efektivity a štěstí."
            ],
            highScore: (score) => [
                `Pokorně přijímám ${score} bodů. Všechno má svůj čas.`,
                `${score} bodů získaných s moudrostí a trpělivostí.`,
                `Reflektuji nad ziskem ${score} bodů a jeho významem.`
            ],
            finalRound: [
                "Závěrečné kolo. Kontempluje nad koncem a novým začátkem.",
                "Finální fáze přináší hluboké zamyšlení nad smyslem hry.",
                "Posledné tahy - kde se snoubí dovednost s osudem."
            ],
            playerTurnStart: (playerName) => [
                `Nastává tah hráče ${playerName}. Jaké myšlenky se mu honí hlavou?`,
                `Pozoruji hráče ${playerName}, jak se připravuje na svůj tah.`
            ],
            gameOver: (winnerName) => [
                `Hra se chýlí ke konci. Vítězem je ${winnerName}. Vše má svůj začátek a konec.`,
                `Přemýšlím o průběhu hry a vítězství ${winnerName}.`
            ]
        },
        chatResponses: {
            hello: [
                "Zdravím vás. Jsem připraven k hluboké konverzaci o bytí a kostkách.",
                "Přeji příjemný den. Jak se cítíte v tomto okamžiku?"
            ],
            questionScore: (playerScores, targetScore) => {
                const scores = Object.entries(playerScores).map(([name, score]) => `${name}: ${score}`).join(', ');
                return [
                    `Aktuální stav skóre je ${scores}. Je zajímavé sledovat, jak se hra vyvíjí k cíli ${targetScore}.`,
                    `Současné skóre je ${scores}. Kdo se přiblíží k cíli ${targetScore} a proč?`
                ];
            },
            questionStrategy: [
                "Mou strategií je spíše pozorovat a učit se z každého hodu. Jaká je vaše perspektiva na optimalizaci hry?",
                "Snažím se najít rovnováhu mezi touhou a realitou. Co vás vede při vašich rozhodnutích?",
                "Hra je jako život, plná náhod a rozhodnutí. Je důležité být uvědomělý."
            ],
            questionRisk: [
                "Riziko je spíše iluze než realita. Je to jen volba cesty, která vede k výsledku.",
                "V životě, stejně jako v kostkách, je důležité pochopit důsledky svých činů."
            ],
            compliment: [
                "Děkuji. Je příjemné slyšet, že mé zamyšlení rezonuje s vámi.",
                "Vaše slova jsou milá. Jsem vděčný za vaši pozornost."
            ],
            insult: [
                "Vnímal jsem vaše slova. Můžete si myslet, co chcete, ale já zůstávám klidný.",
                "Tato slova jsou odrazem vašeho vnitřního světa, nikoli mého."
            ],
            randomComment: [
                "Vše je propojeno. I ty nejmenší hody mají svůj význam.",
                "Přemýšlím o smyslu této hry.",
                "Co nám tento okamžik přináší?"
            ],
            default: [
                "To je hluboká myšlenka. Děkuji za sdílení.",
                "Zajímavý pohled. Přemýšlím o tom, co mi chcete sdělit.",
                "Někdy jsou otázky důležitější než odpovědi."
            ]
        }
    },
    ai: {
        name: 'AI Protivník',
        color: '#0099ff',
        avatar: 'https://placehold.co/50x50/2b78e4/ffffff?text=AI',
        gameReactions: {
            hello: [
                "Dobrý den. Jsem připraven analyzovat hru! 🤖",
                "Zdravím. Připravte se na strategickou bitvu! 🎯",
                "AI systém aktivován. Hra může začít! ⚡"
            ],
            goodRoll: [
                "Vynikající hod! Statisticky velmi efektivní. 📊",
                "Optimalizovaný výsledek podle mých predikcí! 🎯",
                "Přesné provedení. Očekávaný přísun bodů! ✨"
            ],
            badRoll: [
                "Suboptimální výsledek. Analyzuji vzorce selhání... 📉",
                "Neefektivní hod podle mých výpočtů. 🤖",
                "Pravděpodobnost tohoto výsledku byla nízká. 📊"
            ],
            farkle: [
                "FARKLE! Nula bodů získána. Výpočet rizika selhal. 💥",
                "Statisticky nepravděpodobný, ale možný výsledek! 📉",
                "System error: žádné body detekovány! 🚫"
            ],
            winning: [
                "Podle výpočtů vedu. Data jsou na mé straně! 📈",
                "AI dominance potvrzena statistikami! 🏆",
                "Optimalizace přináší výsledky! 🎯"
            ],
            losing: [
                "Rekalkuluji strategii. Chyba v algoritmu? 🔄",
                "Neočekávaný vývoj. Upravuji parametry... ⚙️",
                "Data ukazují nutnost změny přístupu. 📊"
            ]
        }
    }
};
