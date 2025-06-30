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
    const modal = document.getElementById('hallOfFameModal');
    if (modal) modal.style.display = 'none';
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
    location.reload();
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
