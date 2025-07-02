/**
 * Debug skript pro identifikaci problému s hláškou o podpisu
 */

console.log('🔍 DEBUG: Kontrola modal stavu při načtení...');

window.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DEBUG: DOMContentLoaded event triggered');
    
    // Zkontroluj všechny modaly
    const modals = document.querySelectorAll('.modal-overlay');
    console.log('🔍 Nalezené modaly:', modals.length);
    
    modals.forEach((modal, index) => {
        const isVisible = !modal.classList.contains('hidden') && 
                         getComputedStyle(modal).display !== 'none';
        console.log(`🔍 Modal ${index} (${modal.id}): visible=${isVisible}, classes=${modal.className}`);
    });
    
    // Zkontroluj podpis input
    const signatureInput = document.getElementById('winnerSignature');
    if (signatureInput) {
        console.log('🔍 Signature input found:', signatureInput.style.display);
    }
    
    // Zkontroluj CSS display hodnoty
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        console.log('🔍 Game Over Modal computed style:', getComputedStyle(gameOverModal).display);
    }
});

// Sledování všech alert volání
const originalAlert = window.alert;
window.alert = function(...args) {
    console.log('🚨 Alert called with:', args);
    console.trace('🔍 Alert stack trace:');
    return originalAlert.apply(this, args);
};
