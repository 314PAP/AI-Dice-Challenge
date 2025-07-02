/**
 * 🎮 Enhanced Game Starter
 * Vylepšený startovací mechanismus hry s validací a error handlingem
 */

import { pipe, curry, tap } from 'ramda';
import { createValidator, tryCatchWithLogging, GameError } from '../utils/errorHandling.js';
import { eventBus, GAME_EVENTS } from '../utils/eventBus.js';
import { startGame as startGameOriginal } from './controllers/gameFlowController.js';

/**
 * Schema pro validaci cílového skóre
 */
const targetScoreSchema = {
  type: 'number',
  min: 1000,
  max: 100000
};

/**
 * Validátor pro cílové skóre
 */
const validateTargetScore = createValidator(targetScoreSchema);

/**
 * Vylepšená funkce pro start hry s validací vstupu
 * @param {Object} options - Nastavení hry
 * @returns {boolean} True pokud se hra úspěšně spustila
 */
export const startGameEnhanced = tryCatchWithLogging((options = {}) => {
  console.log('🎮 Starting game with options:', options);
  
  // Získáme cílové skóre
  let targetScore = options.targetScore;
  
  // Pokud není definováno, zkusíme ho získat z UI
  if (targetScore === undefined) {
    const targetScoreInput = document.getElementById('targetScoreInput');
    if (targetScoreInput) {
      targetScore = parseInt(targetScoreInput.value);
    } else {
      targetScore = 1000; // Výchozí hodnota
    }
  }
  
  try {
    // Validujeme cílové skóre
    validateTargetScore(targetScore);
    
    // Spustíme hru
    startGameOriginal();
    
    // Vyšleme událost o spuštění hry
    eventBus.emit(GAME_EVENTS.GAME_STARTED, {
      targetScore,
      timestamp: new Date().toISOString(),
      players: options.players || []
    });
    
    return true;
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      alert(`Neplatné cílové skóre: ${error.message}`);
    } else {
      throw error; // Pokud jde o jinou chybu, předáme ji dále
    }
    
    return false;
  }
}, false, 'Start Game');

/**
 * Funkce pro validaci a zpracování akce tlačítka Start Game
 */
export const handleStartGameButtonClick = () => {
  console.log('🚀 Start Game button clicked');
  
  const targetScoreInput = document.getElementById('targetScoreInput');
  const targetScore = parseInt(targetScoreInput?.value || '1000');
  
  try {
    // Validujeme cílové skóre
    validateTargetScore(targetScore);
    
    // Spustíme hru s validovaným skóre
    return startGameEnhanced({ targetScore });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      alert(`Neplatné cílové skóre: ${error.message}`);
    } else {
      console.error('❌ Chyba při startu hry:', error);
      alert('Při spouštění hry došlo k neočekávané chybě.');
    }
    
    return false;
  }
};

/**
 * Připojí event listenery k tlačítkům
 */
export const attachGameStartListeners = () => {
  const startBtn = document.getElementById('startGameBtn');
  if (startBtn) {
    // Odstranění starých listenerů, pokud existují
    const newBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newBtn, startBtn);
    
    // Přidání nových listenerů
    newBtn.addEventListener('click', handleStartGameButtonClick);
    console.log('✅ Start Game button listener attached');
  }
};

// Exportujeme vylepšené rozhraní pro start hry
export default {
  startGame: startGameEnhanced,
  handleStartGameButtonClick,
  attachGameStartListeners
};
