/**
 * 🕵️ DOM Ready Observer
 * Sleduje stav DOM a zajišťuje spolehlivé načítání elementů
 */

import { once, debounce } from 'lodash-es';

/**
 * Kontroluje, zda jsou klíčové elementy dostupné v DOM
 * @returns {boolean} True pokud jsou všechny elementy dostupné
 */
export const areKeyElementsReady = () => {
  const requiredElements = [
    'startGameBtn',
    'rollBtn', 
    'bankBtn', 
    'endTurnBtn',
    'chatInput',
    'sendMessageBtn',
    'hallOfFameBtn'
  ];
  
  const missingElements = [];
  
  for (const elementId of requiredElements) {
    const element = document.getElementById(elementId);
    if (!element) {
      missingElements.push(elementId);
    }
  }
  
  if (missingElements.length > 0) {
    console.warn('⚠️ Některé elementy stále nejsou dostupné:', missingElements);
    return false;
  }
  
  console.log('✅ Všechny klíčové elementy jsou dostupné v DOM');
  return true;
};

/**
 * Čeká, dokud nejsou dostupné klíčové elementy
 * @param {Function} callback - Funkce, která se má zavolat, když jsou elementy dostupné
 * @param {number} maxAttempts - Maximální počet pokusů (výchozí: 10)
 * @param {number} delay - Prodleva mezi pokusy v ms (výchozí: 100ms)
 */
export const waitForElements = (callback, maxAttempts = 10, delay = 100) => {
  let attempts = 0;
  
  const checkElements = () => {
    if (areKeyElementsReady()) {
      console.log('🎯 Elementy jsou připraveny, volám callback');
      callback();
      return true;
    }
    
    attempts++;
    if (attempts >= maxAttempts) {
      console.error(`❌ Po ${maxAttempts} pokusech stále nejsou dostupné všechny elementy`);
      return false;
    }
    
    console.log(`⏱️ Čekám na elementy... Pokus ${attempts}/${maxAttempts}`);
    setTimeout(checkElements, delay);
    return false;
  };
  
  // Začneme kontrolovat elementy
  checkElements();
};

/**
 * Sleduje změny v DOM pomocí MutationObserver a spustí callback, když jsou dostupné klíčové elementy
 * @param {Function} callback - Funkce, která se má zavolat, když jsou elementy dostupné
 */
export const observeDOM = (callback) => {
  // Nejdřív zkontrolujeme, jestli už nejsou elementy dostupné
  if (areKeyElementsReady()) {
    callback();
    return;
  }
  
  // Pokud ne, nastavíme observer
  const observer = new MutationObserver(
    debounce(() => {
      if (areKeyElementsReady()) {
        observer.disconnect();
        callback();
      }
    }, 100)
  );
  
  // Začneme sledovat změny v DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Záložní řešení - pokud se observer nespustí, zkusíme počkat pevný čas
  setTimeout(() => {
    if (areKeyElementsReady()) {
      observer.disconnect();
      callback();
    } else {
      // Pokud stále nejsou dostupné, zkusíme čekat aktivně
      waitForElements(callback);
    }
  }, 1000);
};

/**
 * Zajistí, že callback se spustí až po načtení DOM a klíčových elementů
 * @param {Function} callback - Funkce, která se má zavolat po načtení
 * @returns {Function} Funkce, kterou lze zavolat pro spuštění procesu
 */
export const whenDOMReady = (callback) => {
  const safeCallback = once(callback);
  
  // Kontrola, zda je DOM již načtený
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observeDOM(safeCallback);
  } else {
    // Pokud není, přidáme event listener
    document.addEventListener('DOMContentLoaded', () => {
      observeDOM(safeCallback);
    });
  }
  
  return safeCallback;
};

export default {
  areKeyElementsReady,
  waitForElements,
  observeDOM,
  whenDOMReady
};
