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
    console.log('🏠 Vracím se do hlavního menu...');
    
    // Skrytí game over modalu
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.style.display = 'none';
        gameOverModal.classList.add('hidden');
    }
    
    // Desktop elementy
    const gameHeader = document.getElementById('gameHeader');
    const gameControls = document.getElementById('gameControls');
    
    if (gameControls) {
        gameControls.classList.add('hidden');
        gameControls.style.display = 'none';
        console.log('🖥️ Skryl jsem desktop game controls');
    }
    
    if (gameHeader) {
        // Kompletní reset a force zobrazení
        gameHeader.classList.remove('hidden', 'd-none');
        gameHeader.style.display = '';
        
        // Detekce viewport velikosti
        const isDesktopSize = window.innerWidth >= 768;
        console.log(`🔍 Viewport: ${window.innerWidth}x${window.innerHeight}, isDesktop: ${isDesktopSize}`);
        
        if (isDesktopSize) {
            // Desktop velikost - force zobrazení
            gameHeader.classList.add('d-block');
            gameHeader.classList.remove('d-none');
            console.log('🖥️ Force desktop menu zobrazení');
        } else {
            // Mobile velikost - použít Bootstrap třídy
            gameHeader.classList.add('d-none', 'd-md-block');
            console.log('🖥️ Mobile viewport - desktop menu skryto');
        }
        
        console.log('🔍 Desktop menu třídy:', gameHeader.className);
        console.log('🔍 Desktop menu computed display:', window.getComputedStyle(gameHeader).display);
    }
    
    // Mobilní elementy
    const gameMobileContent = document.getElementById('gameMobileContent');
    const gameControlsMobile = document.getElementById('gameControlsMobile');
    
    if (gameControlsMobile) {
        gameControlsMobile.classList.add('hidden');
        gameControlsMobile.style.display = 'none';
        console.log('📱 Skryl jsem mobile game controls');
    }
    
    if (gameMobileContent) {
        gameMobileContent.classList.remove('hidden', 'd-none');
        gameMobileContent.style.display = '';
        console.log('📱 Zobrazil jsem mobile game menu');
        console.log('🔍 Mobile menu třídy:', gameMobileContent.className);
        console.log('🔍 Mobile menu computed display:', window.getComputedStyle(gameMobileContent).display);
    }
    
    // Obnovení stavu hry
    if (window.gameState) {
        window.gameState.gameState = 'menu';
        console.log('🎮 Nastavil jsem game state na menu');
    }
}

// Dice selection helper
export function selectDie(index) {
    const dice = document.querySelectorAll('.die');
    if (dice[index]) {
        dice[index].style.background = dice[index].style.background === 'rgb(255, 102, 0)' ? '#000' : '#ff6600';
    }
}
