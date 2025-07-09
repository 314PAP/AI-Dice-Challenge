/**
 * spinnerManager.js - Správa neonových spinnerů a loaderů
 * 
 * Tento modul poskytuje funkce pro zobrazení a skrytí různých typů
 * animovaných neonových loaderů v aplikaci.
 */

/**
 * Vytvoří neonový spinner ve specifikovaném elementu
 * 
 * @param {string} containerId - ID elementu, kam má být spinner přidán
 * @param {string} type - Typ spinneru ('orbital', 'pulse', 'rotate', 'triple', 'circle')
 * @param {string} message - Volitelná zpráva pod spinnerem
 * @param {string} size - Velikost spinneru ('sm', 'md', 'lg')
 */
export function showNeonSpinner(containerId, type = 'orbital', message = '', size = 'md') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Vyčistíme kontejner
  container.innerHTML = '';
  
  // Vytvoříme wrapper pro spinner a zprávu
  const wrapper = document.createElement('div');
  wrapper.className = 'd-flex flex-column align-items-center justify-content-center h-100 p-3';
  
  // Vytvoříme spinner s požadovaným typem a zajistíme, že přepíše Bootstrap styly
  const spinner = document.createElement('div');
  const sizeClass = size === 'sm' ? 'neon-spinner-sm' : size === 'lg' ? 'neon-spinner-lg' : '';
  spinner.className = `neon-spinner neon-spinner-${type} ${sizeClass} mb-3`;
  spinner.setAttribute('data-spinner-type', type); // Pro vyšší specificitu a vlastní selekci
  
  wrapper.appendChild(spinner);
  
  // Přidáme zprávu, pokud existuje
  if (message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'neon-spinner-text text-center';
    messageEl.textContent = message;
    wrapper.appendChild(messageEl);
  }
  
  container.appendChild(wrapper);
}

/**
 * Skryje neonový spinner
 * 
 * @param {string} containerId - ID elementu, kde je spinner zobrazen
 */
export function hideNeonSpinner(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Najdeme spinner wrapper
  const spinner = container.querySelector('[class*="neon-spinner"]')?.closest('.d-flex');
  if (spinner) {
    // Animovaně skryjeme spinner
    spinner.style.transition = 'opacity 0.3s ease';
    spinner.style.opacity = '0';
    
    // Po dokončení animace odstraníme z DOM
    setTimeout(() => {
      if (container.contains(spinner)) {
        container.removeChild(spinner);
      }
    }, 300);
  }
}

/**
 * Mění typ zobrazeného spinneru
 * 
 * @param {string} containerId - ID elementu, kde je spinner zobrazen
 * @param {string} newType - Nový typ spinneru
 * @param {string} newMessage - Volitelná nová zpráva
 */
export function changeNeonSpinnerType(containerId, newType, newMessage = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const existingSpinner = container.querySelector('[class*="neon-spinner"]');
  if (existingSpinner) {
    // Odstraníme všechny třídy typů
    existingSpinner.className = existingSpinner.className
      .split(' ')
      .filter(cls => !cls.startsWith('neon-spinner-') || cls === 'neon-spinner-text' || 
              cls === 'neon-spinner-sm' || cls === 'neon-spinner-lg')
      .join(' ');
      
    // Přidáme nový typ
    existingSpinner.classList.add(`neon-spinner-${newType}`);
    
    // Aktualizujeme zprávu, pokud byla poskytnuta
    if (newMessage !== null) {
      const messageEl = container.querySelector('.neon-spinner-text');
      if (messageEl) {
        messageEl.textContent = newMessage;
      } else if (newMessage) {
        // Vytvoříme novou zprávu, pokud nebyla žádná a nová je poskytnuta
        const wrapper = existingSpinner.closest('.d-flex');
        if (wrapper) {
          const newMessageEl = document.createElement('div');
          newMessageEl.className = 'neon-spinner-text text-center';
          newMessageEl.textContent = newMessage;
          wrapper.appendChild(newMessageEl);
        }
      }
    }
  } else {
    // Pokud spinner neexistuje, vytvoříme nový
    showNeonSpinner(containerId, newType, newMessage || '');
  }
}

// Export typů spinnerů pro snadnější použití
export const SPINNER_TYPES = {
  ORBITAL: 'orbital',
  PULSE: 'pulse',
  ROTATE: 'rotate',
  TRIPLE: 'triple',
  CIRCLE: 'circle',
  TEXT: 'text'
};

export const SPINNER_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg'
};
