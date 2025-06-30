/**
 * Message Analysis Module
 * Analyzes chat messages and categorizes them by type and content
 */

export class MessageAnalyzer {
    /**
     * Analyzes a message and identifies key patterns and intents
     * @param {string} message - The message to analyze
     * @returns {Object} Analysis results with boolean flags for different message types
     */
    static analyzeMessage(message) {
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
     * Determines the primary intent category of a message
     * @param {Object} analysis - Analysis results from analyzeMessage
     * @returns {string} Primary intent category
     */
    static getPrimaryIntent(analysis) {
        if (analysis.isQuestion) {
            if (analysis.isAboutStrategy) return 'strategy';
            if (analysis.isAboutScore) return 'score';
            if (analysis.isAboutGame) return 'game';
            if (analysis.isAboutAI) return 'ai';
            if (analysis.isAboutRisk) return 'risk';
            return 'question';
        }
        
        if (analysis.isChallenging) return 'challenge';
        if (analysis.isCompliment) return 'compliment';
        if (analysis.isInsult) return 'insult';
        if (analysis.isGreeting) return 'greeting';
        if (analysis.isJoke) return 'joke';
        
        return 'general';
    }
}
