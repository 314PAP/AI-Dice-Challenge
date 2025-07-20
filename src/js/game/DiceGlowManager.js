/**
 * 🌟 AI Dice Challenge - Dice Glow Manager
 * 
 * Modul pro správu neon glow efektů kostek
 * Umožňuje přepínání mezi custom keyframes a library-based efekty
 */

/**
 * Třída pro správu glow efektů kostek
 */
export class DiceGlowManager {
    constructor() {
        this.glowMode = 'custom'; // 'custom' nebo 'library'
        this.init();
    }

    /**
     * Inicializace glow manageru
     */
    init() {
        // Žádné toggle tlačítko - pouze jednoduché glow efekty
        console.log('🌟 DiceGlowManager inicializován bez UI prvků');
    }

    /**
     * Aplikuje speciální glow efekt na kostku
     * @param {HTMLElement} diceElement - Element kostky
     * @param {string} effectType - Typ efektu ('soft', 'pulse', 'shimmer', 'neon')
     */
    applySpecialGlow(diceElement, effectType = 'soft') {
        if (!diceElement) return;

        // Pouze custom keyframes - žádné library třídy
        console.log(`🌟 Aplikuji glow efekt: ${effectType}`);
    }

    /**
     * Aplikuje glow na nové kostky
     * @param {HTMLElement[]} newDiceElements - Nové kostky
     */
    applyNewDiceGlow(newDiceElements) {
        if (!Array.isArray(newDiceElements)) return;

        newDiceElements.forEach(dice => {
            this.applySpecialGlow(dice, 'shimmer');

            // Po 2 sekundách přejdeme na normální glow
            setTimeout(() => {
                this.applySpecialGlow(dice, 'soft');
            }, 2000);
        });
    }

    /**
     * Aplikuje glow na vybrané kostky
     * @param {HTMLElement[]} selectedDiceElements - Vybrané kostky
     */
    applySelectedDiceGlow(selectedDiceElements) {
        if (!Array.isArray(selectedDiceElements)) return;

        selectedDiceElements.forEach(dice => {
            this.applySpecialGlow(dice, 'neon');
        });
    }

    /**
     * Aplikuje glow na kostky při hoveru
     * @param {HTMLElement} diceElement - Element kostky
     */
    applyHoverGlow(diceElement) {
        if (!diceElement) return;

        // Library glow se řeší přes CSS třídy automaticky
        if (this.glowMode === 'custom') {
            // Custom hover se řeší přes CSS automaticky
        }
    }

    /**
     * Resetuje všechny glow efekty
     */
    resetAllGlow() {
        const diceElements = document.querySelectorAll('.dice');
        const glowClasses = ['glow-soft', 'glow-pulse', 'glow-shimmer', 'glow-neon',
            'glow-variant-1', 'glow-hover', 'glow-variant'];

        diceElements.forEach(dice => {
            dice.classList.remove(...glowClasses);
        });
    }

    /**
     * Získá aktuální glow režim
     * @returns {string} Aktuální režim ('custom' nebo 'library')
     */
    getCurrentMode() {
        return this.glowMode;
    }
}

// Export singleton instance
export default new DiceGlowManager();
