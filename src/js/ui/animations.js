/**
 * UI Animations - Animace a vizuální efekty
 * Modul poskytuje funkce pro animace a vizuální zpětnou vazbu
 */

/**
 * Animuje hod kostkami
 * @param {Array<number>} diceValues - Hodnoty kostek k animaci
 * @param {HTMLElement} container - HTML element, kde se má animace zobrazit
 * @param {Function} onComplete - Callback funkce po dokončení animace
 */
export function animateDiceRoll(diceValues, container, onComplete = null) {
    // Implementace animace hodu kostkami
    console.log('Animace hodu kostkami:', diceValues);
    
    // Zde by byla implementace animace
    
    // Po dokončení zavoláme callback, pokud byl předán
    if (onComplete && typeof onComplete === 'function') {
        setTimeout(() => onComplete(), 300);
    }
}

/**
 * Zobrazí úspěšnou zprávu s animací
 * @param {string} message - Zpráva k zobrazení
 * @param {string} [type='success'] - Typ zprávy (success, warning, error)
 */
export function showSuccessMessage(message, type = 'success') {
    // Implementace zobrazení zprávy
    console.log(`Zpráva (${type}):`, message);
    
    // Zde by byla implementace zobrazení zprávy, např. s využitím SweetAlert2
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: type === 'success' ? 'Úspěch!' : 'Upozornění',
            text: message,
            icon: type,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#000',
            color: '#fff'
        });
    }
}
