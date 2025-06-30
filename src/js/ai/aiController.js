/**
 * AI Controller
 * Řídí reakce a odpovědi AI
 */

import { aiPersonalities } from './personalities.js';

/**
 * Získá náhodnou odpověď z pole odpovědí
 * @param {Array|string} responses - Pole odpovědí nebo jednotlivá odpověď
 * @returns {string} Náhodná odpověď
 */
function getRandomResponse(responses) {
    if (Array.isArray(responses)) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    return responses;
}

/**
 * Generuje reakci AI na herní událost
 * @param {string} aiType - Typ AI (gemini, chatgpt, claude)
 * @param {string} reactionType - Typ reakce
 * @param {...any} args - Dodatečné argumenty pro reakci
 * @returns {Object|null} Objekt s reaction obsahující senderType a message
 */
export function generateAIGameReaction(aiType, reactionType, ...args) {
    const personality = aiPersonalities[aiType];
    if (personality && personality.gameReactions && personality.gameReactions[reactionType]) {
        let reactionMessages = personality.gameReactions[reactionType];
        
        // Pokud je reakce funkce, zavoláme ji s argumenty
        if (typeof reactionMessages === 'function') {
            reactionMessages = reactionMessages(...args);
        }
        
        const message = getRandomResponse(reactionMessages);
        return { senderType: aiType, message: message };
    }
    return null;
}

/**
 * Generuje odpověď AI na zprávu v chatu
 * @param {string} aiId - ID AI
 * @param {string} message - Zpráva od uživatele
 * @param {Object} playerScores - Skóre hráčů
 * @param {number} targetScore - Cílové skóre
 * @returns {Object|null} Objekt s odpovědí AI
 */
export function generateAIChatResponse(aiId, message, playerScores, targetScore) {
    const personality = aiPersonalities[aiId];
    if (!personality || !personality.chatResponses) return null;

    let response = null;
    const lowerCaseMessage = message.toLowerCase();

    // Prioritizované reakce na klíčová slova
    if (lowerCaseMessage.includes('ahoj') || lowerCaseMessage.includes('zdravím') || lowerCaseMessage.includes('čau')) {
        response = getRandomResponse(personality.chatResponses.hello);
    } else if (lowerCaseMessage.includes('skóre') || lowerCaseMessage.includes('body')) {
        response = getRandomResponse(personality.chatResponses.questionScore(playerScores, targetScore));
    } else if (lowerCaseMessage.includes('strategie') || lowerCaseMessage.includes('jak hrát') || lowerCaseMessage.includes('taktika')) {
        response = getRandomResponse(personality.chatResponses.questionStrategy);
    } else if (lowerCaseMessage.includes('risk') || lowerCaseMessage.includes('riziko')) {
        response = getRandomResponse(personality.chatResponses.questionRisk);
    } else if (lowerCaseMessage.includes('dobře') || lowerCaseMessage.includes('super') || lowerCaseMessage.includes('gratuluji')) {
        response = getRandomResponse(personality.chatResponses.compliment);
    } else if (lowerCaseMessage.includes('špatně') || lowerCaseMessage.includes('prohra') || lowerCaseMessage.includes('blbec') || lowerCaseMessage.includes('idiot')) {
        response = getRandomResponse(personality.chatResponses.insult);
    } else if (lowerCaseMessage.includes('random comment trigger')) {
        response = getRandomResponse(personality.chatResponses.randomComment);
    } else {
        // Pokud žádné klíčové slovo, náhodný komentář nebo default
        response = getRandomResponse(personality.chatResponses.default);
    }

    return { senderType: aiId, message: response };
}

/**
 * Spustí AI reakci na hot dice
 * @param {string} aiType - Typ AI
 */
export function generateHotDiceReaction(aiType) {
    return generateAIGameReaction(aiType, 'hotDice');
}

/**
 * Spustí AI reakci na vysoké skóre
 * @param {string} aiType - Typ AI  
 * @param {number} score - Dosažené skóre
 */
export function generateHighScoreReaction(aiType, score) {
    return generateAIGameReaction(aiType, 'highScore', score);
}

/**
 * Spustí AI reakci na finální kolo
 * @param {string} aiType - Typ AI
 */
export function generateFinalRoundReaction(aiType) {
    return generateAIGameReaction(aiType, 'finalRound');
}
