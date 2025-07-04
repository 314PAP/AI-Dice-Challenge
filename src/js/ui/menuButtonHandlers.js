// Modul pro napojení tlačítek hlavního menu (desktop i mobil)
// Používat po každém načtení šablony menu!

import { handleStartGameButtonClick } from '../game/enhancedGameStarter.js';
import { showRules } from '../game/controllers/eventSetupController.js';
import { displayHallOfFame } from '../utils/hallOfFame.js';
// import { GameStateController } from '../../ui/controllers/gameStateController.js'; // CHYBNÝ IMPORT - ODSTRANĚNO

// Pomocná funkce pro získání hodnoty skóre z inputu (desktop/mobil)
function getTargetScore() {
  const inputDesktop = document.getElementById('targetScoreInput');
  const inputMobile = document.getElementById('targetScoreInputMobile');
  return parseInt((inputDesktop?.value || inputMobile?.value || '10000'), 10);
}

// Handler pro opuštění hry
function handleExitGame() {
  if (window.confirm('Opravdu chcete opustit hru?')) {
    // Reset UI přes GameStateController (instance je na window.gameStateController)
    if (window.gameStateController && typeof window.gameStateController.returnToMainMenu === 'function') {
      window.gameStateController.returnToMainMenu();
    } else {
      // Fallback: skryj herní UI, zobraz menu (robustní pro všechny layouty)
      const controls = document.getElementById('gameControls');
      const setup = document.getElementById('targetScoreSetup');
      if (controls) {
        controls.style.display = 'none';
        controls.classList.add('hidden');
      }
      if (setup) {
        setup.style.display = 'block';
        setup.classList.remove('hidden');
      }
      // Navíc zobrazit menu, pokud existuje
      const menu = document.getElementById('gameMenuContainer');
      if (menu) menu.classList.remove('hidden');
    }
  }
}

export function attachMenuButtonHandlers() {
  // START GAME
  const startBtns = [
    document.getElementById('startGameBtn'),
    document.getElementById('startGameBtnMobile')
  ].filter(Boolean);
  startBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
      // Získat skóre z inputu (desktop/mobil)
      const targetScore = getTargetScore();
      handleStartGameButtonClick({ targetScore });
    });
  });

  // PRAVIDLA
  const rulesBtns = [
    document.getElementById('rulesBtn'),
    document.getElementById('rulesBtnMobile')
  ].filter(Boolean);
  rulesBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', showRules);
  });

  // SÍŇ SLÁVY
  const hallBtns = [
    document.getElementById('hallOfFameBtn'),
    document.getElementById('hallOfFameBtnMobile')
  ].filter(Boolean);
  hallBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', displayHallOfFame);
  });

  // OPUSTIT HRU
  const exitBtns = [
    document.getElementById('exitGameBtn'),
    document.getElementById('exitGameBtnMobile')
  ].filter(Boolean);
  exitBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', handleExitGame);
  });

  // Kup mi kávu je pouze odkaz, není třeba JS
  
  // ZAVŘENÍ RULES MODALU
  const closeRulesBtn = document.getElementById('closeRulesBtn');
  if (closeRulesBtn) {
    closeRulesBtn.addEventListener('click', () => {
      const rulesModal = document.getElementById('rulesModal');
      if (rulesModal) {
        rulesModal.classList.add('hidden');
      }
    });
  }
  
  console.log('✅ Menu button handlers attached (desktop & mobile)');
}
