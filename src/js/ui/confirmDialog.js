/**
 * 🎮 AI Dice Challenge - Potvrzovací Dialog
 * 
 * Stylizovaný potvrzovací dialog s neon barvami a animacemi
 * Nahrazuje standardní browser confirm() dialog
 */

import { createNeonButton } from './uiComponents.js';
import soundSystem from '../utils/soundSystem.js';

/**
 * Vytvoří a zobrazí stylizovaný potvrzovací dialog
 * @param {string} message - Zpráva k zobrazení
 * @param {Function} onConfirm - Callback pro potvrzení (null = pouze OK dialog)
 * @param {Function} onCancel - Callback pro zrušení (volitelný)
 * @returns {Promise<boolean>} Promise s výsledkem
 */
export function showConfirmDialog(message, onConfirm = null, onCancel = null) {
    return new Promise((resolve) => {
        // Přehraji varovný zvuk
        soundSystem.play('warning');
        
        // Backdrop (tmavé pozadí)
        const backdrop = document.createElement('div');
        backdrop.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
        backdrop.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            z-index: var(--z-top);
            backdrop-filter: blur(5px);
        `;
        
        // Modal container s animací
        const modal = document.createElement('div');
        modal.className = 'bg-neon-black border border-3 border-neon-yellow p-4 rounded-3 text-center animate__animated animate__bounceIn';
        modal.style.cssText = `
            max-width: 400px;
            width: 90%;
            box-shadow: 0 0 30px var(--neon-yellow), inset 0 0 20px rgba(255, 255, 0, 0.1);
            animation-duration: 0.6s;
        `;
        
        // Ikona varování s majáčkem
        const warningIcon = document.createElement('div');
        warningIcon.className = 'mb-3';
        warningIcon.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill text-neon-yellow fs-1 animate__animated animate__flash animate__infinite"></i>
        `;
        
        // Zpráva
        const messageElement = document.createElement('p');
        messageElement.className = 'text-neon-yellow fs-5 mb-4 lh-base';
        messageElement.textContent = message;
        
        // Container pro tlačítka
        const buttonsContainer = document.createElement('div');
        
        // Pokud není onConfirm (jen info dialog), zobraz pouze OK
        if (onConfirm === null) {
            buttonsContainer.className = 'row';
            
            const okBtn = createNeonButton(
                'OK', 
                'green', 
                'bi-check-circle-fill', 
                () => {
                    soundSystem.play('buttonClick');
                    closeModal();
                    resolve(true);
                }, 
                'btn w-100 fw-bold'
            );
            
            const okCol = document.createElement('div');
            okCol.className = 'col-12';
            okCol.appendChild(okBtn);
            buttonsContainer.appendChild(okCol);
            
        } else {
            // Normální potvrzovací dialog s ANO/NE
            buttonsContainer.className = 'row g-3';
            
            // Tlačítko ANO (červené pro nebezpečí)
            const yesBtn = createNeonButton(
                'ANO', 
                'red', 
                'bi-check-circle-fill', 
                () => {
                    soundSystem.play('buttonClick');
                    closeModal();
                    if (onConfirm) onConfirm();
                    resolve(true);
                }, 
                'btn w-100 fw-bold'
            );
            
            // Tlačítko NE (zelené pro bezpečí)
            const noBtn = createNeonButton(
                'NE', 
                'green', 
                'bi-x-circle-fill', 
                () => {
                    soundSystem.play('buttonClick');
                    closeModal();
                    if (onCancel) onCancel();
                    resolve(false);
                }, 
                'btn w-100 fw-bold'
            );
            
            // Přidáme tlačítka do containeru
            const yesCol = document.createElement('div');
            yesCol.className = 'col-6';
            yesCol.appendChild(yesBtn);
            
            const noCol = document.createElement('div');
            noCol.className = 'col-6';
            noCol.appendChild(noBtn);
            
            buttonsContainer.appendChild(yesCol);
            buttonsContainer.appendChild(noCol);
        }
        
        // Sestavíme modal
        modal.appendChild(warningIcon);
        modal.appendChild(messageElement);
        modal.appendChild(buttonsContainer);
        backdrop.appendChild(modal);
        
        // Funkce pro zavření modalu
        function closeModal() {
            backdrop.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 300);
        }
        
        // ESC klávesa pro zrušení
        function handleKeyPress(event) {
            if (event.key === 'Escape') {
                soundSystem.play('buttonClick');
                closeModal();
                if (onCancel) onCancel();
                resolve(false);
                document.removeEventListener('keydown', handleKeyPress);
            }
        }
        
        // Klik na backdrop pro zrušení
        backdrop.addEventListener('click', (event) => {
            if (event.target === backdrop) {
                soundSystem.play('buttonClick');
                closeModal();
                if (onCancel) onCancel();
                resolve(false);
            }
        });
        
        // Přidáme event listener pro ESC
        document.addEventListener('keydown', handleKeyPress);
        
        // Přidáme modal do DOM
        document.body.appendChild(backdrop);
        
        // Focus na NE tlačítko (bezpečnější volba) - pouze pokud existuje
        setTimeout(() => {
            const focusButton = onConfirm ? noBtn : okBtn;
            if (focusButton) {
                focusButton.focus();
            }
        }, 100);
    });
}

/**
 * Zjednodušená verze pro rychlé použití
 * @param {string} message - Zpráva k zobrazení  
 * @returns {Promise<boolean>} Promise s výsledkem
 */
export async function confirm(message) {
    return showConfirmDialog(message);
}

export default { showConfirmDialog, confirm };
