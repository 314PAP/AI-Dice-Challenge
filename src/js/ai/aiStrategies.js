/**
 * AI Strategies - Strategické algoritmy pro AI hráče
 * Přesunuto z aiPlayerController.js pro zmenšení velikosti
 */

export class AiStrategies {
    /**
     * Konzervativní strategie - bezpečné hraní
     * @param {Object} state - Stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {Object} Doporučená akce
     */
    static conservativeStrategy(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        
        if (turnScore >= 300) {
            return { action: 'endTurn', reason: 'Bezpečné ukončení s 300+ body' };
        }
        
        if (turnScore >= 150 && Math.random() < 0.7) {
            return { action: 'endTurn', reason: 'Konzervativní ukončení' };
        }
        
        return { action: 'continue', reason: 'Pokračovat opatrně' };
    }

    /**
     * Agresivní strategie - riskantní hraní
     * @param {Object} state - Stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {Object} Doporučená akce
     */
    static aggressiveStrategy(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        const currentScore = state.players[state.currentPlayerIndex].score;
        const targetScore = state.targetScore;
        const remainingPoints = targetScore - currentScore;
        
        if (remainingPoints <= turnScore) {
            return { action: 'endTurn', reason: 'Vítězství na dosah!' };
        }
        
        if (turnScore >= 1000) {
            return { action: 'endTurn', reason: 'Výborný tah s 1000+ body' };
        }
        
        if (turnScore >= 500 && Math.random() < 0.3) {
            return { action: 'endTurn', reason: 'Občasné ukončení' };
        }
        
        return { action: 'continue', reason: 'Riskujeme dál!' };
    }

    /**
     * Vyrovnaná strategie - střední cesta
     * @param {Object} state - Stav hry
     * @param {Object} aiPlayer - AI hráč
     * @returns {Object} Doporučená akce
     */
    static balancedStrategy(state, aiPlayer) {
        const turnScore = state.turnScore || 0;
        
        if (turnScore >= 600) {
            return { action: 'endTurn', reason: 'Slušný zisk' };
        }
        
        if (turnScore >= 300 && Math.random() < 0.5) {
            return { action: 'endTurn', reason: 'Náhodné ukončení' };
        }
        
        return { action: 'continue', reason: 'Ještě pokračujeme' };
    }

    /**
     * Vybere strategii podle osobnosti AI
     * @param {Object} aiPlayer - AI hráč
     * @returns {Function} Strategická funkce
     */
    static getStrategy(aiPlayer) {
        const riskLevel = aiPlayer.personality?.riskLevel || 'medium';
        
        switch (riskLevel) {
            case 'low':
                return this.conservativeStrategy;
            case 'high':
                return this.aggressiveStrategy;
            default:
                return this.balancedStrategy;
        }
    }
}

export default AiStrategies;
