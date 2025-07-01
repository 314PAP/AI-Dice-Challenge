/**
 * Hall of Fame Controller
 * Handles hall of fame display, score saving, and leaderboard management
 */

export class HallOfFameController {
    constructor() {
        this.storageKey = 'diceGameHallOfFame';
    }

    /**
     * Zobrazí síň slávy
     */
    displayHallOfFame() {
        console.log('🏆 Zobrazuji síň slávy...');
        const modal = document.getElementById('hallOfFameModal');
        const list = document.getElementById('hallOfFameList');
        
        if (modal && list) {
            // Načti data ze síně slávy
            const hallOfFame = this.loadHallOfFameData();
            
            if (hallOfFame.length === 0) {
                list.innerHTML = this.renderEmptyHallOfFame();
            } else {
                list.innerHTML = this.renderHallOfFameEntries(hallOfFame);
            }
            
            this.showModal(modal);
            this.addChatMessage('Systém', '🏆 Síň slávy zobrazena');
        }
    }

    /**
     * Renders empty hall of fame message
     * @returns {string} HTML string for empty hall of fame
     */
    renderEmptyHallOfFame() {
        return `
            <div style="text-align: center; padding: 40px; color: var(--neon-green);">
                <h3>🏆 Síň slávy je prázdná</h3>
                <p>Zatím žádné záznamy...</p>
                <p style="font-size: 14px; opacity: 0.7;">Vyhrajte hru a zapište se do historie!</p>
            </div>
        `;
    }

    /**
     * Renders hall of fame entries
     * @param {Array} hallOfFame - Array of game results
     * @returns {string} HTML string for hall of fame entries
     */
    renderHallOfFameEntries(hallOfFame) {
        return hallOfFame.map((game, index) => `
            <div class="hall-of-fame-entry" style="
                border: 1px solid var(--neon-green);
                margin: 10px 0;
                padding: 15px;
                border-radius: 5px;
                background: rgba(0,255,0,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 18px; font-weight: bold; color: var(--neon-orange);">
                            #${index + 1} 🏆 ${game.signature || 'Anonym'}
                        </span>
                        <div style="margin-top: 5px; color: var(--neon-green);">
                            🎯 Skóre: ${game.score}/${game.targetScore} | 
                            ⏱️ Trvání: ${game.duration} | 
                            🎲 Tahů: ${game.turns}
                        </div>
                    </div>
                    <div style="text-align: right; color: var(--neon-blue);">
                        📅 ${game.date}<br>
                        🕐 ${game.time}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Shows the modal
     * @param {HTMLElement} modal - Modal element to show
     */
    showModal(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        modal.style.display = 'block';
    }

    /**
     * Zavře síň slávy
     */
    closeHallOfFame() {
        const modal = document.getElementById('hallOfFameModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            modal.style.display = 'none';
        }
    }

    /**
     * Uloží skóre do síně slávy
     */
    saveScore() {
        const signatureInput = document.getElementById('winnerSignature');
        const signature = signatureInput?.value?.trim();
        
        if (!signature) {
            alert('Prosím zadejte svůj podpis!');
            return;
        }
        
        // Get actual game data if available
        const gameResult = this.createGameResult(signature);
        
        // Save to localStorage
        this.saveGameResult(gameResult);
        
        this.addChatMessage('Systém', `🏆 Skóre ${gameResult.score} uloženo do síně slávy s podpisem "${signature}"!`);
        
        // Hide signature section
        this.hideSignatureSection();
        
        // Show hall of fame
        setTimeout(() => {
            this.displayHallOfFame();
        }, 1000);
    }

    /**
     * Creates game result object from current game state
     * @param {string} signature - Player signature
     * @returns {Object} Game result object
     */
    createGameResult(signature) {
        // Get actual game data if available
        let score = 10000; // default
        let targetScore = 10000; // default
        let turns = 15; // default
        let duration = '5:30'; // default
        
        // Try to get real game data
        const humanScoreEl = document.getElementById('humanScore');
        const targetScoreEl = document.getElementById('targetScoreDisplay');
        
        if (humanScoreEl) {
            score = parseInt(humanScoreEl.textContent) || score;
        }
        if (targetScoreEl) {
            targetScore = parseInt(targetScoreEl.textContent) || targetScore;
        }
        
        return {
            signature: signature,
            score: score,
            targetScore: targetScore,
            turns: turns,
            duration: duration,
            date: new Date().toLocaleDateString('cs-CZ'),
            time: new Date().toLocaleTimeString('cs-CZ')
        };
    }

    /**
     * Saves game result to localStorage
     * @param {Object} gameResult - Game result to save
     */
    saveGameResult(gameResult) {
        const hallOfFame = this.loadHallOfFameData();
        hallOfFame.push(gameResult);
        hallOfFame.sort((a, b) => b.score - a.score); // Sort by score desc
        localStorage.setItem(this.storageKey, JSON.stringify(hallOfFame));
    }

    /**
     * Loads hall of fame data from localStorage
     * @returns {Array} Hall of fame entries
     */
    loadHallOfFameData() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    /**
     * Hides the signature input section
     */
    hideSignatureSection() {
        const signatureSection = document.getElementById('signatureSection');
        if (signatureSection) {
            signatureSection.classList.add('hidden');
            signatureSection.style.display = 'none';
        }
    }

    /**
     * Clears all hall of fame data
     */
    clearHallOfFame() {
        if (confirm('Opravdu chcete vymazat všechny záznamy ze síně slávy?')) {
            localStorage.removeItem(this.storageKey);
            this.addChatMessage('Systém', '🗑️ Síň slávy byla vymazána');
            this.displayHallOfFame(); // Refresh display
        }
    }

    /**
     * Exports hall of fame data as JSON
     * @returns {string} JSON string of hall of fame data
     */
    exportHallOfFame() {
        const hallOfFame = this.loadHallOfFameData();
        return JSON.stringify(hallOfFame, null, 2);
    }

    /**
     * Imports hall of fame data from JSON
     * @param {string} jsonData - JSON string of hall of fame data
     */
    importHallOfFame(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            if (Array.isArray(importedData)) {
                localStorage.setItem(this.storageKey, jsonData);
                this.addChatMessage('Systém', '📥 Síň slávy byla importována');
                this.displayHallOfFame(); // Refresh display
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            alert('Chyba při importu dat: ' + error.message);
        }
    }

    /**
     * Gets statistics from hall of fame
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const hallOfFame = this.loadHallOfFameData();
        
        if (hallOfFame.length === 0) {
            return {
                totalGames: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0
            };
        }
        
        const scores = hallOfFame.map(game => game.score);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        
        return {
            totalGames: hallOfFame.length,
            averageScore: Math.round(totalScore / hallOfFame.length),
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
            totalPlaytime: hallOfFame.length * 5 // Estimate
        };
    }

    /**
     * Helper method to add chat messages
     * @param {string} sender - Message sender
     * @param {string} message - Message content
     */
    addChatMessage(sender, message) {
        if (window.addChatMessage) {
            window.addChatMessage(sender, message);
        }
    }
}

// Export singleton instance
export const hallOfFameController = new HallOfFameController();

// Expose to window for global access
window.hallOfFameController = hallOfFameController;
