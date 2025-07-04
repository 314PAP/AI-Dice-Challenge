// Modul pro napojení tlačítek hlavního menu (desktop i mobil)
// Používat po každém načtení šablony menu!
// Opraveno: robustní selektory, odstraněn chybný import, fallback pro různé šablony

import { handleStartGameButtonClick } from '../game/enhancedGameStarter.js';
import { showRulesModal } from '../ui/uiController.js';
import { displayHallOfFame } from '../utils/hallOfFame.js';

// Pomocná funkce pro získání hodnoty skóre z inputu (desktop/mobil)
function getTargetScore() {
  const inputDesktop = document.getElementById('targetScoreInput');
  const inputMobile = document.getElementById('targetScoreInputMobile');
  return parseInt((inputDesktop?.value || inputMobile?.value || '10000'), 10);
}

// Handler pro opuštění hry
function handleExitGame() {
  if (window.confirm('Opravdu chcete opustit hru?')) {
    // Reset UI přes GameStateController (instance je na window)
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
  // START GAME (desktop i mobil, různé šablony)
  const startBtns = Array.from(document.querySelectorAll('#startGameBtn, #startGameBtnMobile, .btn-start-game'));
  startBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
      const targetScore = getTargetScore();
      handleStartGameButtonClick({ targetScore });
    });
  });

  // PRAVIDLA
  const rulesBtns = Array.from(document.querySelectorAll('#rulesBtn, #rulesBtnMobile, .btn-rules'));
  rulesBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', showRulesModal);
  });

  // SÍŇ SLÁVY
  const hallBtns = Array.from(document.querySelectorAll('#hallOfFameBtn, #hallOfFameBtnMobile, .btn-hall-of-fame'));
  hallBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', displayHallOfFame);
  });

  // OPUSTIT HRU
  const exitBtns = Array.from(document.querySelectorAll('#exitGameBtn, #exitGameBtnMobile, .btn-exit-game'));
  exitBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', handleExitGame);
  });

  // Kup mi kávu je pouze odkaz, není třeba JS
  console.log('✅ Menu button handlers attached (desktop & mobile)');
}
