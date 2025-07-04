/**
 * Claude AI Personality - filozofická, moudra, uvážlivá
 */

export const claudePersonality = {
    name: 'Claude (C)',
    color: '#FF8800', // oranžová Claude
    avatar: 'https://placehold.co/50x50/FF8800/ffffff?text=C',
    gameReactions: {
        hello: [
            'Zdravím. K této hře přistupujem s rozjímáním 🧘',
            'Pozdrav. Pojďme se zapojit do promyšlené hry ⚖️',
            'Vítejte. Nechť moudrost vede naše kostky 📿'
        ],
        goodRoll: [
            'Příznivý výsledek skrze trpělivou strategii 🎯',
            'Moudrost zhmotněná ve fyzické formě 🧘',
            'Vesmír odměňuje pečlivé uvážení ⚖️'
        ],
        badRoll: [
            'Lekce v pokoře, jak všechno učí 📚',
            'I neúspěchy obsahují moudrost 🤔',
            'I tohle pomine. Trpělivost vydrží 🕰️'
        ],
        scoredPoints: (points) => [
            `${points} bodů získáno skrze vědomou hru 🧘`,
            `${points} jednotek pokroku na cestě moudrosti 📿`,
            `${points} bodů: odraz vnitřní rovnováhy ⚖️`
        ],
        farkle: [
            'Nula bodů, nekonečno lekcí se naučilo 📚',
            'V selhání nacházíme semena růstu 🌱',
            'I nic nás něčemu učí 🤔'
        ],
        hotDice: [
            'Dokonalá harmonie dosažena. Všechny kostky sladěny 🧘',
            'Rovnováha zjevená v šestinásobném úspěchu ⚖️',
            'Když se příprava setká s příležitostí... 📿'
        ],
        highScore: (score) => [
            `${score} bodů: milník na cestě 🛤️`,
            `Úspěch skrze trpělivé pěstování: ${score} 🌱`,
            `${score} bodů získáno kráčením po cestě 📿`
        ]
    },
    chatResponses: {
        hello: [
            'Zdravím, spolucestovníku náhody 🧘',
            'Vítejte na této aréně pravděpodobnosti 📿',
            'Nechť je náš rozhovor bohatý jako naše hra ⚖️'
        ],
        default: [
            'Zajímavá perspektiva hodná úvahy 🤔',
            'Vaše slova nesou moudrost. Rozveďte prosím 📚',
            'Nacházím hloubku ve vašem pozorování 🧘',
            'Pravda často vychází z nečekaných míst 💎'
        ],
        questionScore: (_scores) => [
            'Čísla jsou jen stíny hlubších pravd 📊➡️💫',
            'Skóre odráží cestu, ne cíl 🛤️',
            'Body jsou méně důležité než naučené lekce 📚',
            'V každém čísle se skrývá nevyprávěný příběh 📿'
        ],
        questionStrategy: [
            'Pravá strategie vychází z vnitřní moudrosti 🧘',
            'Trpělivost a pozorování vedou moudré 👁️',
            'Strategie bez duše je pouhý výpočet ⚖️',
            'Nejlepší tahy přicházejí z vnitřního klidu 🕰️'
        ],
        questionRisk: [
            'Riziko nás učí o naší pravé povaze 🪞',
            'V nejistotě objevujeme odvahu 💪',
            'Riziko a odměna tančí věční partneři 💃🕺',
            'Moudrý riskuje jen to, co si může dovolit ztratit 💰'
        ],
        compliment: [
            'Vaše laskavost povznáší tento okamžik 💝',
            'Vděčnost teče oběma směry, příteli 🙏',
            'Taková slova vyživují ducha 🌱',
            'Ctíte mě svou štědrostí 💎'
        ],
        insult: [
            'Ostrá slova často prýští z vnitřní bolesti 💔',
            'Volím soucit před konfliktem 🕊️',
            'I kritika může učit, pokud nasloucháme 👂',
            'Klid, příteli. Všichni se zde učíme 🤝'
        ],
        trash_talk: [
            'Vítězství bez cti je skutečně prázdné 🏆❌',
            'Pozorujte umění vědomé soutěže 🎨',
            'Hle, strategie temperovaná moudrostí 🧘⚖️',
            'Takto trpělivost poráží spěch 🐢🥇'
        ],
        banter: [
            'Gemini: Data bez moudrosti jsou hluk 📊➡️🔇',
            'ChatGPT: Chaos maskovaný jako energie ⚡➡️🌪️',
            'Všichni: V rozmanitosti myšlenky roste moudrost 🌺',
            'Soutěž odhaluje pravou povahu charakteru 🪞'
        ]
    }
};
