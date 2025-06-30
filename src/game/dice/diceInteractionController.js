/**
 * Dice Interaction Controller
 * Handles dice selection and interaction logic
 */

import { gameState } from '../gameState.js';
import { calculateScore } from '../diceLogic.js';
import { updateGameDisplay } from '../../ui/gameUI.js';

export class DiceInteractionController {
    constructor() {
        this.selectedDiceIndices = new Set();
    }

    /**
     * Handles dice selection/deselection
     * @param {number} index - Index of the die to select
     */
    selectDie(index) {
        if (!gameState.gameStarted || !gameState.diceValues[index]) {
            return;
        }

        try {
            // Toggle selection
            if (this.selectedDiceIndices.has(index)) {
                this.deselectDie(index);
            } else {
                this.selectDieAtIndex(index);
            }

            // Update game state
            gameState.selectedDice = Array.from(this.selectedDiceIndices);
            
            // Update UI
            this.updateDiceDisplay();
            this.updateBankButtonState();
            
        } catch (error) {
            console.error('Error selecting die:', error);
        }
    }

    /**
     * Selects a die at given index
     * @param {number} index - Die index to select
     */
    selectDieAtIndex(index) {
        this.selectedDiceIndices.add(index);
        
        // Add visual feedback
        const dieElement = document.querySelector(`[data-dice-index="${index}"]`);
        if (dieElement) {
            dieElement.classList.add('selected');
        }

        console.log(`🎲 Selected die ${index + 1} with value ${gameState.diceValues[index]}`);
    }

    /**
     * Deselects a die at given index
     * @param {number} index - Die index to deselect
     */
    deselectDie(index) {
        this.selectedDiceIndices.delete(index);
        
        // Remove visual feedback
        const dieElement = document.querySelector(`[data-dice-index="${index}"]`);
        if (dieElement) {
            dieElement.classList.remove('selected');
        }

        console.log(`🎲 Deselected die ${index + 1}`);
    }

    /**
     * Clears all dice selections
     */
    clearSelection() {
        this.selectedDiceIndices.clear();
        gameState.selectedDice = [];
        
        // Clear visual feedback
        document.querySelectorAll('.dice.selected').forEach(die => {
            die.classList.remove('selected');
        });

        this.updateBankButtonState();
    }

    /**
     * Updates dice display
     */
    updateDiceDisplay() {
        updateGameDisplay();
        
        // Update score preview
        this.updateScorePreview();
    }

    /**
     * Updates score preview for selected dice
     */
    updateScorePreview() {
        const selectedValues = Array.from(this.selectedDiceIndices)
            .map(index => gameState.diceValues[index]);
        
        const previewScore = selectedValues.length > 0 ? calculateScore(selectedValues) : 0;
        
        // Update preview display
        const scorePreview = document.getElementById('scorePreview');
        if (scorePreview) {
            if (previewScore > 0) {
                scorePreview.textContent = `Možný zisk: ${previewScore} bodů`;
                scorePreview.style.color = '#39ff14';
            } else if (selectedValues.length > 0) {
                scorePreview.textContent = 'Neplatná kombinace!';
                scorePreview.style.color = '#ff3333';
            } else {
                scorePreview.textContent = 'Vyberte kostky pro skórování';
                scorePreview.style.color = '#ffffff';
            }
        }
    }

    /**
     * Updates bank button state based on selection
     */
    updateBankButtonState() {
        const bankButton = document.getElementById('bankDiceBtn');
        if (!bankButton) return;

        const selectedValues = Array.from(this.selectedDiceIndices)
            .map(index => gameState.diceValues[index]);
        
        const canBank = selectedValues.length > 0 && calculateScore(selectedValues) > 0;
        
        bankButton.disabled = !canBank;
        bankButton.textContent = canBank ? 
            `Odložit (${calculateScore(selectedValues)} bodů)` : 
            'Vyberte kostky';
    }

    /**
     * Gets currently selected dice values
     * @returns {Array} Array of selected dice values
     */
    getSelectedValues() {
        return Array.from(this.selectedDiceIndices)
            .map(index => gameState.diceValues[index]);
    }

    /**
     * Gets selection score
     * @returns {number} Score for current selection
     */
    getSelectionScore() {
        const selectedValues = this.getSelectedValues();
        return selectedValues.length > 0 ? calculateScore(selectedValues) : 0;
    }

    /**
     * Auto-selects best scoring combination
     */
    autoSelectBest() {
        try {
            this.clearSelection();
            
            // Find best combination (this would need to be implemented)
            const bestCombination = this.findBestScoringCombination();
            
            bestCombination.forEach(index => {
                this.selectDieAtIndex(index);
            });

            gameState.selectedDice = Array.from(this.selectedDiceIndices);
            this.updateDiceDisplay();
            
        } catch (error) {
            console.error('Error auto-selecting dice:', error);
        }
    }

    /**
     * Finds best scoring combination (simplified implementation)
     * @returns {Array} Array of dice indices for best combination
     */
    findBestScoringCombination() {
        // This is a simplified version - in a full implementation,
        // this would analyze all possible combinations
        const scoringIndices = [];
        
        for (let i = 0; i < gameState.diceValues.length; i++) {
            const value = gameState.diceValues[i];
            if (value === 1 || value === 5) {
                scoringIndices.push(i);
            }
        }
        
        return scoringIndices;
    }

    /**
     * Resets controller state
     */
    reset() {
        this.clearSelection();
        this.updateScorePreview();
    }

    /**
     * Gets controller status
     * @returns {Object} Controller status
     */
    getStatus() {
        return {
            selectedCount: this.selectedDiceIndices.size,
            selectedIndices: Array.from(this.selectedDiceIndices),
            selectedValues: this.getSelectedValues(),
            selectionScore: this.getSelectionScore()
        };
    }
}

// Export singleton instance
export const diceInteractionController = new DiceInteractionController();

// Legacy compatibility function
export function selectDie(index) {
    return diceInteractionController.selectDie(index);
}
