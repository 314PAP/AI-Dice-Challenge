// Modul pro napojení tlačítek hlavního menu (desktop i mobil)
// Používat po každém načtení šablony menu!

import { handleStartGameButtonClick } from '../game/enhancedGameStarter.js';
import { showRulesModal } from '../ui/uiController.js';
import { displayHallOfFame } from '../utils/hallOfFame.js';
import { GameStateController } from '../ui/controllers/gameStateController.js';

// Pomocná funkce pro získání hodnoty skóre z inputu (desktop/mobil)
function getTargetScore() {
  const inputDesktop = document.getElementById('targetScoreInput');
  const inputMobile = document.getElementById('targetScoreInputMobile');
  return parseInt((inputDesktop?.value || inputMobile?.value || '10000'), 10);
}

// Handler pro opuštění hry
function handleExitGame() {
  if (window.confirm('Opravdu chcete opustit hru?')) {
    // Reset UI přes GameStateController
    if (window.gameStateController instanceof GameStateController) {
      window.gameStateController.returnToMainMenu();
    } else {
      // Fallback: skryj herní UI, zobraz menu
      const controls = document.getElementById('gameControls');
      const setup = document.getElementById('targetScoreSetup');
      if (controls && setup) {
        controls.style.display = 'none';
        controls.classList.add('hidden');
        setup.style.display = 'block';
      }
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
    newBtn.addEventListener('click', showRulesModal);
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
  console.log('✅ Menu button handlers attached (desktop & mobile)');
}
