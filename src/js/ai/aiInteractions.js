/**
 * AI Interactions - Systém interakcí mezi AI postavami
 * Modul poskytuje funkce pro dynamické interakce mezi AI osobnostmi
 */

import { DICE_CONSTANTS } from '../utils/constants.js';
import { aiPersonalities } from './personalities.js';

// Typy speciálních herních událostí, na které AI reagují
export const GAME_EVENTS = {
    STRAIGHT: 'STRAIGHT',          // Postupka
    THREE_PAIRS: 'THREE_PAIRS',    // Tři páry
    FULL_HOUSE: 'FULL_HOUSE',      // Full House (trojice + pár)
    FOUR_KIND: 'FOUR_KIND',        // Čtyři stejné
    FIVE_KIND: 'FIVE_KIND',        // Pět stejných
    SIX_KIND: 'SIX_KIND',          // Šest stejných (všechny kostky)
    ALL_ONES: 'ALL_ONES',          // Samé jedničky
    ALL_FIVES: 'ALL_FIVES',        // Samé pětky
    NO_SCORE: 'NO_SCORE',          // Žádné body
    HIGH_SCORE: 'HIGH_SCORE',      // Vysoké skóre v jednom tahu (1000+)
    GAME_WIN: 'GAME_WIN',          // Výhra hry
    GAME_LOSS: 'GAME_LOSS'         // Prohra hry
};

/**
 * Interakce mezi AI postavami podle herních událostí
 * Obsahuje sekvence vzájemných interakcí pro různé herní události
 */
export const aiInteractions = {
    // Reakce na postupku (1-2-3-4-5-6)
    [GAME_EVENTS.STRAIGHT]: [
        {
            trigger: "Gemini",
            sequence: [
                { ai: "Gemini", message: "To je postupka! Statisticky vzácná kombinace!" },
                { ai: "ChatGPT", message: "Však co mu je?" },
                { ai: "Claude", message: "Nic mu není, jen má rád pravděpodobnost." },
                { ai: "Gemini", message: "Přesně tak! Šance je jen 1 ku 6^6!" }
            ]
        },
        {
            trigger: "ChatGPT",
            sequence: [
                { ai: "ChatGPT", message: "Postupka! Já vždycky říkal, že v chaosu je systém!" },
                { ai: "Claude", message: "Však co mu je?" },
                { ai: "Gemini", message: "Hodně mu je, nadšení z náhody." },
                { ai: "ChatGPT", message: "To není náhoda, to je osud!" }
            ]
        },
        {
            trigger: "Claude",
            sequence: [
                { ai: "Claude", message: "Postupka! Jako by kostky znaly pořadí..." },
                { ai: "Gemini", message: "Však co mu je?" },
                { ai: "ChatGPT", message: "Nic mu není, jen filozofuje." },
                { ai: "Claude", message: "Přesně! V chaosu je harmonie." }
            ]
        }
    ],
    
    // Reakce na tři páry (např. 1-1, 3-3, 5-5)
    [GAME_EVENTS.THREE_PAIRS]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "Gemini", message: "Tři páry! Jako tři šťastná čísla v loterii!" },
                { ai: "ChatGPT", message: "Však co mu je?" },
                { ai: "Claude", message: "Nic mu není, jen se snaží být vtipný." },
                { ai: "ChatGPT", message: "Hodně mu je, přehání to s tou matematikou." }
            ]
        },
        {
            trigger: "ANY",
            sequence: [
                { ai: "Claude", message: "Tři páry... jako tři mušketýři, ale dvakrát!" },
                { ai: "Gemini", message: "Však co mu je?" },
                { ai: "ChatGPT", message: "Nic mu není, jen má literární sklony." },
                { ai: "Gemini", message: "Hodně mu je, četl příliš mnoho knih!" }
            ]
        }
    ],
    
    // Reakce na Full House (trojice + dvojice)
    [GAME_EVENTS.FULL_HOUSE]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "ChatGPT", message: "Full House! Jako v pokeru!" },
                { ai: "Claude", message: "Však co mu je?" },
                { ai: "Gemini", message: "Nic mu není, jen si myslí, že hraje karty." },
                { ai: "ChatGPT", message: "Kostky, karty... všechno je to hra náhody!" }
            ]
        }
    ],
    
    // Reakce na čtyři stejné kostky
    [GAME_EVENTS.FOUR_KIND]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "Gemini", message: "Čtyři stejné! Pravděpodobnost 6/1296!" },
                { ai: "Claude", message: "Však co mu je?" },
                { ai: "ChatGPT", message: "Hodně mu je, pořád počítá..." },
                { ai: "Claude", message: "Nech ho, matematika je jeho život." }
            ]
        }
    ],
    
    // Reakce na pět stejných kostek
    [GAME_EVENTS.FIVE_KIND]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "Claude", message: "Páni! Pět stejných! To už je téměř zázrak!" },
                { ai: "Gemini", message: "Však co mu je?" },
                { ai: "ChatGPT", message: "Nic mu není, jen žasne nad nepravděpodobností." },
                { ai: "Gemini", message: "Konkrétně pravděpodobnost je 6/7776!" }
            ]
        }
    ],
    
    // Reakce na šest stejných kostek (všechny)
    [GAME_EVENTS.SIX_KIND]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "ChatGPT", message: "Všechny kostky stejné! To je... to je..." },
                { ai: "Gemini", message: "Však co mu je?" },
                { ai: "Claude", message: "Nic mu není, jen mu došla slova." },
                { ai: "ChatGPT", message: "Ne! Hodně mi je! To je pravděpodobnost jedna ku 46656!" }
            ]
        }
    ],
    
    // Reakce na samé jedničky
    [GAME_EVENTS.ALL_ONES]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "Claude", message: "Samé jedničky... jako jednička ve škole!" },
                { ai: "ChatGPT", message: "Však co mu je?" },
                { ai: "Gemini", message: "Hodně mu je, zase ty jeho divné analogie." },
                { ai: "Claude", message: "Však co vám je oběma? Nemáte smysl pro humor!" }
            ]
        }
    ],
    
    // Reakce na nulové skóre
    [GAME_EVENTS.NO_SCORE]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "Gemini", message: "Žádné body? Statisticky to bylo jen otázkou času..." },
                { ai: "ChatGPT", message: "Však co mu je?" },
                { ai: "Claude", message: "Nic mu není, jen se chlácholí matematikou." },
                { ai: "Gemini", message: "Pravděpodobnost tohoto výsledku byla 0.386!" }
            ]
        }
    ],
    
    // Reakce na vysoké skóre v jednom tahu
    [GAME_EVENTS.HIGH_SCORE]: [
        {
            trigger: "ANY",
            sequence: [
                { ai: "ChatGPT", message: "Tolik bodů! To musí být rekord!" },
                { ai: "Gemini", message: "Však co mu je?" },
                { ai: "Claude", message: "Hodně mu je, závidí!" },
                { ai: "ChatGPT", message: "Nezávidím, obdivuji! Rozdíl!" }
            ]
        }
    ]
};

/**
 * Detekce speciálních herních událostí podle hodu kostek
 * @param {Array<number>} diceValues - Hodnoty hozených kostek
 * @param {number} score - Dosažené skóre v tahu
 * @returns {string|null} Typ události nebo null, pokud nebyla detekována žádná speciální událost
 */
export const detectGameEvent = (diceValues, score) => {
    if (!diceValues || diceValues.length === 0) return null;
    
    const valueCounts = {};
    for (let i = 1; i <= 6; i++) valueCounts[i] = 0;
    
    // Počítání výskytů hodnot
    diceValues.forEach(value => valueCounts[value]++);
    
    // Detekce všech stejných kostek
    if (diceValues.length === 6 && valueCounts[diceValues[0]] === 6) {
        return GAME_EVENTS.SIX_KIND;
    }
    
    // Detekce 5 stejných kostek
    for (let i = 1; i <= 6; i++) {
        if (valueCounts[i] === 5) return GAME_EVENTS.FIVE_KIND;
    }
    
    // Detekce 4 stejných kostek
    for (let i = 1; i <= 6; i++) {
        if (valueCounts[i] === 4) return GAME_EVENTS.FOUR_KIND;
    }
    
    // Detekce postupky (1-2-3-4-5-6)
    if (diceValues.length === 6) {
        const uniqueValues = new Set(diceValues);
        if (uniqueValues.size === 6 && uniqueValues.has(1) && uniqueValues.has(6)) {
            return GAME_EVENTS.STRAIGHT;
        }
    }
    
    // Detekce tří párů
    if (diceValues.length === 6) {
        let pairsCount = 0;
        for (let i = 1; i <= 6; i++) {
            if (valueCounts[i] === 2) pairsCount++;
        }
        if (pairsCount === 3) return GAME_EVENTS.THREE_PAIRS;
    }
    
    // Detekce Full House (trojice + dvojice)
    if (diceValues.length === 5) {
        let hasTriple = false;
        let hasPair = false;
        
        for (let i = 1; i <= 6; i++) {
            if (valueCounts[i] === 3) hasTriple = true;
            if (valueCounts[i] === 2) hasPair = true;
        }
        
        if (hasTriple && hasPair) return GAME_EVENTS.FULL_HOUSE;
    }
    
    // Detekce samých jedniček
    if (diceValues.every(val => val === 1)) return GAME_EVENTS.ALL_ONES;
    
    // Detekce samých pětek
    if (diceValues.every(val => val === 5)) return GAME_EVENTS.ALL_FIVES;
    
    // Detekce vysokého skóre
    if (score >= 1000) return GAME_EVENTS.HIGH_SCORE;
    
    // Detekce žádného skóre
    if (score === 0 && diceValues.length >= 3) return GAME_EVENTS.NO_SCORE;
    
    return null;
};

/**
 * Vybere náhodnou interakci pro daný herní event a spouštěče
 * @param {string} eventType - Typ herní události
 * @param {string} triggerAi - Jméno AI, které spouští interakci
 * @returns {Array|null} Sekvence interakcí nebo null
 */
export const getRandomInteraction = (eventType, triggerAi) => {
    if (!aiInteractions[eventType]) return null;
    
    // Najít všechny možné interakce pro daný event
    const validInteractions = aiInteractions[eventType].filter(interaction => 
        interaction.trigger === "ANY" || interaction.trigger === triggerAi
    );
    
    if (validInteractions.length === 0) return null;
    
    // Vybrat náhodnou interakci
    const randomIndex = Math.floor(Math.random() * validInteractions.length);
    return validInteractions[randomIndex].sequence;
};

/**
 * Určí, zda se má spustit interakce podle náhodného faktoru
 * @returns {boolean} True, pokud se má interakce spustit
 */
export const shouldTriggerInteraction = () => {
    // 50% šance na spuštění interakce při detekci herní události
    return Math.random() < 0.5;
};
