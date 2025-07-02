/**
 * UI Controller
 * Inicializuje event listenery a UI interakce
 */

import { displayHallOfFame as showHallOfFame } from '../utils/hallOfFame.js';

export function setupUI() {
    console.log('🎨 Inicializace UI...');
    console.log('✅ UI event listenery inicializovány');
}

// Global helper functions pro backward compatibility
export function displayHallOfFame() {
    showHallOfFame();
}

export function closeHallOfFame() {
    console.log('🏆 Zavírání Hall of Fame z UI controlleru');
    
    // Nejprve skryjeme Hall of Fame modal
    const modal = document.getElementById('hallOfFameModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
        modal.classList.remove('visible');
    }
    
    // Kontrola pro Hall of Fame otevřený z game over
    if (window.hallOfFameFromGameOver === true && window.gameState && window.gameState.gameEnded) {
        console.log('🔍 Detekován návrat z Hall of Fame po konci hry');
        
        // Resetovat flag
        window.hallOfFameFromGameOver = false;
        
        // Zobrazit znovu game over modal
        setTimeout(() => {
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                console.log('🎮 Znovu otevírání Game Over modalu');
                gameOverModal.style.display = 'block';
                gameOverModal.classList.remove('hidden');
                gameOverModal.classList.add('visible');
            }
        }, 300);
    }
}

export function saveScore() {
    const signatureInput = document.getElementById('winnerSignature');
    const signature = signatureInput?.value?.trim();
    
    if (!signature) {
        alert('Prosím, zadejte svůj podpis!');
        return;
    }
    
    console.log('Ukládání skóre:', signature);
    // Implementace uložení bude přidána později
}

export function startNewGame() {
    document.getElementById('gameOverModal').style.display = 'none';
    window.location.reload();
}

export function returnToMainMenu() {
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('gameControls').style.display = 'none';
    document.getElementById('targetScoreSetup').style.display = 'block';
}

// Dice selection helper
export function selectDie(index) {
    const dice = document.querySelectorAll('.die');
    if (dice[index]) {
        dice[index].style.background = dice[index].style.background === 'rgb(255, 102, 0)' ? '#000' : '#ff6600';
    }
}
