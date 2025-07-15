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
     * Odloží vybrané kostky - s lodash optimalizací a validací prvního zápisu
     */
    saveDice() {
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
        
        // Spočítáme body za vybrané kostky
        const points = calculatePoints(selectedDiceValues);
        
        if (points === 0) {
            const errorMsg = '❌ Vybrané kostky neziskávají body!';
            console.error(errorMsg);
            chatSystem.addSystemMessage(errorMsg, CHAT_COLORS.RED);
            return;
        }
        
        // VALIDACE PRVNÍHO ZÁPISU - POUZE PŘI UKONČENÍ TAHU, NE PŘI ODLOŽENÍ!
        // Tato validace se přesunuje do endTurn() funkce
        
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
            const hotDiceMsg = '🔥 HOT DICE! Všech 6 kostek uloženo!';
            chatSystem.addSystemMessage(hotDiceMsg, CHAT_COLORS.ORANGE);
            
            // 🎵 Speciální zvuk pro Hot Dice
            soundSystem.play('hotDice');
            
            // OPRAVENO: Reset aktuálního hodu + vyčištění uložených kostek
            // Body už jsou v turnScore, kostky můžeme vyčistit
            gameState.updateState({
                currentRoll: [],
                selectedDice: [],
                savedDice: [] // KLÍČOVÁ OPRAVA: Vyčistit uložené kostky po HOT DICE
            });
        } else if (isEmpty(remainingDice)) {
            // Žádné zbývající kostky, ale méně než 6 uložených
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
        
        // OPRAVENÁ LOGIKA PRO HOT DICE:
        // Můžeš hodit pokud:
        // 1. Neběží animace
        // 2. Nemáš vybrané kostky  
        // 3. A BUĎTO:
        //    - Nemáš žádný hod (začátek tahu)
        //    - NEBO máš kostky k výběru (normální situace)
        //    - NEBO HOT DICE situace (currentRoll prázdné, ale turnScore > 0)
        
        const hasCurrentRoll = state.currentRoll && state.currentRoll.length > 0;
        const isHotDiceSituation = (!state.currentRoll || state.currentRoll.length === 0) && (state.turnScore || 0) > 0;
        const isStartOfTurn = !state.currentRoll || state.currentRoll.length === 0;
        
        return !state.isRolling && 
               isEmpty(state.selectedDice) && 
               (hasCurrentRoll || isHotDiceSituation || isStartOfTurn);
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
    }
}
