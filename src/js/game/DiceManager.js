/**
 * 🎲 AI Dice Challenge - Dice Manager Module
 * 
 * Modul pro správu kostek oddělený z GameLogic.js  
 * Používá lodash pro optimalizaci práce s kostkami
 */

// Lodash utilities (načteno z CDN)
const { filter, map, sum, isEmpty, clone } = _;

import gameState from './gameState.js';
import { calculatePoints, hasScoringDice } from './diceMechanics.js';
import chatSystem from '../ai/chatSystem.js';
import { CHAT_COLORS } from '../utils/colors.js';
import soundSystem from '../utils/soundSystem.js';

/**
 * Třída pro správu kostek
 */
export class DiceManager {
    constructor(animationManager) {
        this.animationManager = animationManager;
    }

    /**
     * Odloží vybrané kostky - s lodash optimalizací
     */
    saveDice() {
        console.log('💾 DiceManager: saveDice() zavolána');
        const state = gameState.getState();
        
        if (isEmpty(state.selectedDice)) {
            const warningMsg = '⚠️ Vyberte kostky k odložení!';
            console.warn(warningMsg);
            chatSystem.addSystemMessage(warningMsg, CHAT_COLORS.YELLOW);
            return;
        }
        
        // Lodash filter a map pro získání hodnot vybraných kostek
        const selectedDiceValues = map(
            filter(state.currentRoll, (_, index) => state.selectedDice.includes(index)),
            (value) => value
        );
        
        console.log(`💾 Ukládám kostky: [${selectedDiceValues.join(', ')}]`);
        
        // Spočítáme body za vybrané kostky
        const points = calculatePoints(selectedDiceValues);
        
        if (points === 0) {
            const errorMsg = '❌ Vybrané kostky nezískávají body!';
            console.error(errorMsg);
            chatSystem.addSystemMessage(errorMsg, CHAT_COLORS.RED);
            return;
        }
        
        // Přidáme skórovací animaci
        this.animationManager.addScoringAnimation();
        
        // 🎵 Zvuk pro uložení kostek
        soundSystem.play('saveDice');
        
        // Aktualizujeme stav s uloženými kostkami
        this.updateSavedDice(selectedDiceValues, points);
    }

    /**
     * Aktualizuje uložené kostky - s lodash optimalizací
     * @param {Array} savedDiceValues - Hodnoty kostek k uložení
     * @param {number} points - Body za kostky
     */
    updateSavedDice(savedDiceValues, points) {
        const state = gameState.getState();
        
        // Lodash clone pro bezpečnou kopii
        const newSavedDice = [...(state.savedDice || []), ...savedDiceValues];
        const newTurnScore = (state.turnScore || 0) + points;
        
        // Filtrujeme zbývající kostky (nevy brané)
        const remainingDice = filter(state.currentRoll, (_, index) => 
            !state.selectedDice.includes(index)
        );
        
        console.log(`💰 +${points} bodů (celkem v tahu: ${newTurnScore})`);
        console.log(`📦 Uložené kostky: [${newSavedDice.join(', ')}] (${newSavedDice.length}/6)`);
        
        // Aktualizujeme herní stav
        gameState.updateState({
            savedDice: newSavedDice,
            turnScore: newTurnScore,
            currentRoll: remainingDice,
            selectedDice: []
        });
        
        // Kontrola Hot Dice
        this.checkHotDice(newSavedDice, newTurnScore, remainingDice);
        
        const message = `💾 Uloženo ${savedDiceValues.length} kostek za ${points} bodů`;
        chatSystem.addSystemMessage(message, CHAT_COLORS.BLUE);
    }

    /**
     * Kontrola Hot Dice - všech 6 kostek uloženo
     * @param {Array} newSavedDice - Nové uložené kostky
     * @param {number} newSavedPoints - Nové body
     * @param {Array} remainingDice - Zbývající kostky
     */
    checkHotDice(newSavedDice, newSavedPoints, remainingDice) {
        if (newSavedDice.length === 6) {
            console.log('🔥 HOT DICE! Všech 6 kostek uloženo - můžete hodit znovu všemi kostkami!');
            
            const hotDiceMsg = '🔥 HOT DICE! Všech 6 kostek uloženo!';
            chatSystem.addSystemMessage(hotDiceMsg, CHAT_COLORS.ORANGE);
            
            // 🎵 Speciální zvuk pro Hot Dice
            soundSystem.play('hotDice');
            
            // Reset aktuálního hodu - hráč může hodit znovu všemi kostkami
            gameState.updateState({
                currentRoll: [],
                selectedDice: []
            });
        } else if (isEmpty(remainingDice)) {
            // Žádné zbývající kostky, ale méně než 6 uložených
            console.log('✅ Všechny kostky z tohoto hodu uloženy');
        }
    }

    /**
     * Určí kolik kostek hodit - s lodash optimalizací
     */
    getDiceCountToRoll() {
        const state = gameState.getState();
        
        // Pokud jsou zbývající kostky z předchozího hodu, házíme jimi
        if (!isEmpty(state.currentRoll)) {
            return state.currentRoll.length;
        }
        
        // Jinak házíme podle počtu uložených kostek
        const totalSavedDice = (state.savedDice || []).length;
        
        if (totalSavedDice === 0) {
            // Začátek tahu - hodíme všemi 6 kostkami
            return 6;
        } else if (totalSavedDice === 6) {
            // Hot dice - všech 6 kostek bylo odloženo, házíme znovu všemi
            return 6;
        } else {
            // Házíme zbývajícími kostkami
            return 6 - totalSavedDice;
        }
    }

    /**
     * Kontrola, zda můžeme hodit kostky
     */
    canRollDice() {
        const state = gameState.getState();
        
        return !state.isRolling && 
               isEmpty(state.selectedDice) && 
               (!state.currentRoll || state.currentRoll.length > 0 || (state.savedDice || []).length < 6);
    }

    /**
     * Získá informace o aktuálním stavu kostek
     */
    getDiceStatus() {
        const state = gameState.getState();
        
        return {
            currentRoll: state.currentRoll || [],
            selectedDice: state.selectedDice || [],
            savedDice: state.savedDice || [],
            turnScore: state.turnScore || 0,
            canRoll: this.canRollDice(),
            diceToRoll: this.getDiceCountToRoll(),
            isRolling: state.isRolling || false
        };
    }

    /**
     * Reset stavu kostek pro nový tah
     */
    resetDiceForNewTurn() {
        gameState.updateState({
            currentRoll: [],
            selectedDice: [],
            savedDice: [],
            turnScore: 0,
            isRolling: false
        });
        
        console.log('🔄 Kostky resetovány pro nový tah');
    }
}
