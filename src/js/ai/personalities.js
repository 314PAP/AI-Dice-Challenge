/**
 * AI Personalities - Definice AI osobností a jejich chování
 * Modul definuje všechny AI osobnosti a jejich reakce v různých herních situacích
 */

import { CHAT_COLORS } from '../utils/colors.js';

/**
 * Definice všech AI osobností s jejich charakteristikami a odpověďmi
 */
export const aiPersonalities = {
    Gemini: {
        responses: [
            "Hmm, zajímavý tah!",
            "Myslím si, že můžeš být trochu odvážnější!",
            "Dobrá strategie, ale já budu lepší!",
            "Wow, to byl riskantní tah!"
        ],
        riskTolerance: 0.7, // Vyšší riziko = více riskantní AI
        strategyType: "analytical",
        emoji: "🔵",
        color: CHAT_COLORS.BLUE,
        avatar: "bi-robot"
    },
    ChatGPT: {
        responses: [
            "Ó, to je chytrý tah!",
            "Hmm, já bych to hrál jinak...",
            "Zajímavé! Ale počkej, až přijdu na řadu!",
            "Tvoje štěstí tě brzy opustí!"
        ],
        riskTolerance: 0.5,
        strategyType: "balanced",
        emoji: "🟣",
        color: CHAT_COLORS.PURPLE,
        avatar: "bi-cpu-fill"
    },
    Claude: {
        responses: [
            "Skvělá volba!",
            "Ah, vidím tvou strategii!",
            "Budu muset být opatrnější...",
            "Tvoje šance stále rostou!"
        ],
        riskTolerance: 0.3, // Nižší riziko = konzervativnější AI
        strategyType: "cautious",
        emoji: "🟠",
        color: CHAT_COLORS.ORANGE,
        avatar: "bi-lightning-charge-fill"
    }
};

/**
 * Získá náhodnou odpověď od vybrané AI osobnosti
 * @param {string} aiName - Jméno AI (Gemini, ChatGPT, Claude)
 * @returns {string} Náhodná odpověď
 */
export const getRandomAiResponse = (aiName) => {
    if (!aiPersonalities[aiName]) return "Zajímavý tah...";
    
    const responses = aiPersonalities[aiName].responses;
    const randomIndex = Math.floor(Math.random() * responses.length);
    
    return responses[randomIndex];
};

/**
 * Vrátí barvu podle jména AI
 * @param {string} aiName - Jméno AI (Gemini, ChatGPT, Claude)
 * @returns {string} Barva AI
 */
export const getAiColor = (aiName) => {
    return aiPersonalities[aiName]?.color || CHAT_COLORS.BLUE;
};

/**
 * Simuluje rozhodování AI hráče
 * @param {string} aiName - Jméno AI (Gemini, ChatGPT, Claude)
 * @param {Object} gameState - Aktuální stav hry
 * @returns {Object} Rozhodnutí AI (např. riziko, pokračovat)
 */
export const getAiDecision = (aiName, gameState) => {
    const personality = aiPersonalities[aiName];
    if (!personality) return { continueRolling: false };
    
    const { riskTolerance, strategyType } = personality;
    const currentScore = gameState.turnScore || 0;
    
    // Základní pravděpodobnost pokračování
    let probability = riskTolerance;
    
    // Úprava pravděpodobnosti podle aktuálního skóre
    if (currentScore > 1000) {
        probability -= 0.2; // Méně riskovat s vyšším skóre
    } else if (currentScore < 300) {
        probability += 0.1; // Více riskovat s nízkým skóre
    }
    
    // Strategie podle typu osobnosti
    switch (strategyType) {
        case "analytical":
            // Analytická AI zvažuje všechny faktory
            if (gameState.players[gameState.currentPlayerIndex].score + currentScore > 9000) {
                probability += 0.3; // Zesílená snaha vyhrát
            }
            break;
        case "cautious":
            // Opatrná AI preferuje jistotu
            if (currentScore > 500) {
                probability -= 0.3;
            }
            break;
    }
    
    // Finální rozhodnutí
    return {
        continueRolling: Math.random() < probability,
        probability
    };
};
