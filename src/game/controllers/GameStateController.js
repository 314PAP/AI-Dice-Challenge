/**
 * Game State Controller
 * Spravuje stav hry a přechody mezi stavy
 */

import { gameState } from '../../core/gameState.js';
import { GAME_CONSTANTS, MESSAGES } from '../../core/constants.js';

export class GameStateController {
    constructor(gameController) {
        this.gameController = gameController;
    }

    /**
     * Spustí novou hru
     */
    startGame() {
        console.log('🚀 Spouštím novou hru...');
        
        const targetScoreInput = document.getElementById('targetScoreInput');
        const targetScore = parseInt(targetScoreInput?.value) || GAME_CONSTANTS.DEFAULT_TARGET_SCORE;
        
        // Nastav herní stav
        gameState.reset();
        gameState.targetScore = targetScore;
        gameState.gameStarted = true;
        gameState.gameStartTime = new Date();
        
        this.gameController.gameStarted = true;
        this.gameController.gameStartTime = new Date();
        this.gameController.totalTurns = 0;
        this.gameController.targetScore = targetScore;
        
        // Store game controller globally for access from other functions
        window.gameController = this.gameController;
        
        // Skryj setup, zobraz herní rozhraní
        document.getElementById('targetScoreSetup').style.display = 'none';
        document.getElementById('gameControls').style.display = 'block';
        
        // Aktualizuj UI
        this.gameController.uiController.updateTargetScoreDisplay();
        this.gameController.scoreController.updateScoreboard();
        this.gameController.uiController.updateTurnInfo();
        this.gameController.turnController.resetTurn();
        
        // Přidej systémovou zprávu
        this.gameController.addChatMessage('Systém', MESSAGES.GAME_START.replace('{targetScore}', targetScore));
        
        console.log(`✅ Hra spuštěna s cílem ${targetScore} bodů`);
    }

    /**
     * Ukončí hru
     */
    endGame(winner) {
        console.log('🏆 Konec hry!', winner);
        
        const endTime = new Date();
        const duration = Math.round((endTime - this.gameController.gameStartTime) / 1000);
        
        const gameData = {
            winner: winner.name,
            score: winner.score,
            duration: this.formatDuration(duration),
            turns: this.gameController.totalTurns,
            date: endTime
        };
        
        // Ulož do Hall of Fame
        this.saveToHallOfFame(gameData);
        
        // Zobraz výsledky
        this.gameController.uiController.showGameResults(winner, gameData);
        
        // Přidej zprávu do chatu
        this.gameController.addChatMessage('Systém', `🏆 ${winner.name} vyhrál s ${winner.score} body!`);
        
        // Resetuj hru
        this.resetGame();
    }

    /**
     * Ukončí hru předčasně
     */
    quitGame() {
        console.log('❌ Předčasné ukončení hry');
        
        const confirmQuit = confirm('Opravdu chcete ukončit současnou hru?');
        if (!confirmQuit) return;
        
        this.gameController.addChatMessage('Systém', MESSAGES.GAME_QUIT);
        this.resetGame();
    }

    /**
     * Resetuje hru do počátečního stavu
     */
    resetGame() {
        // Resetuj game state
        gameState.reset();
        
        // Resetuj controller
        this.gameController.gameStarted = false;
        this.gameController.gameStartTime = null;
        this.gameController.totalTurns = 0;
        this.gameController.turnScore = 0;
        this.gameController.rollCount = 0;
        this.gameController.hasRolledThisTurn = false;
        
        // Zobraz setup, skryj hru
        document.getElementById('targetScoreSetup').style.display = 'block';
        document.getElementById('gameControls').style.display = 'none';
        
        // Resetuj UI
        this.gameController.turnController.resetTurn();
        this.gameController.uiController.updateButtons();
        
        console.log('✅ Hra resetována');
    }

    /**
     * Získá aktuálního hráče
     */
    getCurrentPlayer() {
        if (gameState.players && gameState.players.length > 0) {
            return gameState.players[gameState.currentPlayerIndex || 0];
        }
        return { name: 'Hráč 1', score: 0 };
    }

    /**
     * Formátuje dobu trvání
     */
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Uloží do Hall of Fame
     */
    saveToHallOfFame(gameData) {
        try {
            let hallOfFame = JSON.parse(localStorage.getItem('diceGameHallOfFame') || '[]');
            hallOfFame.push(gameData);
            
            // Seřaď podle skóre (sestupně)
            hallOfFame.sort((a, b) => b.score - a.score);
            
            // Ponechej jen top 10
            hallOfFame = hallOfFame.slice(0, 10);
            
            localStorage.setItem('diceGameHallOfFame', JSON.stringify(hallOfFame));
            console.log('✅ Výsledek uložen do Hall of Fame');
        } catch (error) {
            console.error('❌ Chyba při ukládání do Hall of Fame:', error);
        }
    }
}
