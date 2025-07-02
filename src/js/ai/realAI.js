/**
 * Real AI Integration Module
 * Pro skutečné AI odpovědi místo přednastavených
 */

export class RealAI {
    constructor() {
        this.apiEndpoint = '/api/ai-response'; // Váš backend endpoint
        this.gameContext = {
            currentScore: 0,
            turnScore: 0,
            gamePhase: 'early', // early, middle, late, final
            lastAction: null
        };
    }

    /**
     * Aktualizuje kontext hry pro AI
     */
    updateGameContext(context) {
        this.gameContext = { ...this.gameContext, ...context };
    }

    /**
     * Vytvoří prompt pro AI na základě herní situace
     */
    createGamePrompt(aiType, situation, data = {}) {
        const personality = this.getPersonalityPrompt(aiType);
        const context = this.getGameContextPrompt();
        const situationPrompt = this.getSituationPrompt(situation, data);

        return `${personality}\n\n${context}\n\n${situationPrompt}\n\nOdpověz krátce (max 50 znaků) jako ${aiType} v českém jazyce:`;
    }

    /**
     * Definice osobností pro prompty
     */
    getPersonalityPrompt(aiType) {
        const personalities = {
            gemini: 'Jsi Gemini AI - analytický, faktický, zaměřený na data a statistiky. Používáš vědecký přístup.',
            chatgpt: 'Jsi ChatGPT - kreativní, přátelský, používáš emojis a hry na slova. Jsi optimistický a vtipný.',
            claude: 'Jsi Claude AI - moudrý, uvážlivý, filosofický. Preferuješ strategické myšlení a dlouhodobé plánování.'
        };
        return personalities[aiType] || '';
    }

    /**
     * Kontext aktuální herní situace
     */
    getGameContextPrompt() {
        return `Herní kontext:
- Moje skóre: ${this.gameContext.currentScore}
- Skóre tohoto tahu: ${this.gameContext.turnScore}
- Fáze hry: ${this.gameContext.gamePhase}
- Poslední akce: ${this.gameContext.lastAction || 'žádná'}`;
    }

    /**
     * Specifický prompt pro herní situaci
     */
    getSituationPrompt(situation, data) {
        const prompts = {
            hello: 'Přivítej se do kostičkové hry Farkle.',
            goodRoll: `Hodil jsem dobře: ${data.dice?.join(', ')}. Komentuj můj úspěch.`,
            badRoll: `Hodil jsem špatně: ${data.dice?.join(', ')}. Komentuj neúspěch.`,
            scoredPoints: `Získal jsem ${data.points} bodů. Komentuj můj tah.`,
            farkle: 'Dostal jsem farkle (žádné body). Komentuj to.',
            playerTurn: `Hráč ${data.playerName} je na tahu. Komentuj to.`,
            gameWon: `${data.winner} vyhrál hru! Komentuj výsledek.`,
            strategy: `Mám ${data.dice?.length} kostek k hodu. Poraď strategii.`
        };
        return prompts[situation] || 'Komentuj aktuální herní situaci.';
    }

    /**
     * Zavolá skutečné AI API
     */
    async callRealAI(aiType, prompt) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aiType: aiType,
                    prompt: prompt,
                    maxTokens: 50
                })
            });

            if (!response.ok) {
                throw new Error(`AI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Real AI call failed:', error);
            // Fallback na přednastavené odpovědi
            return this.getFallbackResponse(aiType);
        }
    }

    /**
     * Záložní odpovědi když AI API nefunguje
     */
    getFallbackResponse(aiType) {
        const fallbacks = {
            gemini: 'Analyzuji situaci...',
            chatgpt: 'Zajímavé! 🎲',
            claude: 'Zajímavý vývoj hry.'
        };
        return fallbacks[aiType] || '...';
    }

    /**
     * Hlavní metoda pro získání AI odpovědi
     */
    async getAIResponse(aiType, situation, data = {}) {
        const prompt = this.createGamePrompt(aiType, situation, data);
        const response = await this.callRealAI(aiType, prompt);
        return response;
    }
}

// Export singleton instance
export const realAI = new RealAI();
