// Modul pro napojení tlačítek hlavního menu (desktop i mobil)
// Používat po každém načtení šablony menu!

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
    // Preferovaný způsob: přepnout zpět do menu podle layoutu
    // Skryj herní ovládací prvky, zobraz menu
    const gameHeader = document.querySelector('.game-header');
    const gameControls = document.querySelector('.game-controls');
    if (gameHeader && gameControls) {
      gameHeader.classList.remove('hidden');
      gameControls.classList.add('hidden');
    }
    // Fallback pro mobilní layout
    const gameHeaderMobile = document.getElementById('gameHeaderMobile');
    const gameControlsMobile = document.getElementById('gameControlsMobile');
    if (gameHeaderMobile && gameControlsMobile) {
      gameHeaderMobile.classList.remove('hidden');
      gameControlsMobile.classList.add('hidden');
    }
    // Reset skóre a případně další UI prvky
    const setup = document.getElementById('targetScoreSetup');
    if (setup) setup.style.display = 'block';
    const controls = document.getElementById('gameControls');
    if (controls) controls.style.display = 'none';
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
      // Přepnout do herního stavu (skryj menu, zobraz game controls)
      const gameHeader = document.querySelector('.game-header');
      const gameControls = document.querySelector('.game-controls');
      if (gameHeader && gameControls) {
        gameHeader.classList.add('hidden');
        gameControls.classList.remove('hidden');
      }
      // Fallback pro mobilní layout
      const gameHeaderMobile = document.getElementById('gameHeaderMobile');
      const gameControlsMobile = document.getElementById('gameControlsMobile');
      if (gameHeaderMobile && gameControlsMobile) {
        gameHeaderMobile.classList.add('hidden');
        gameControlsMobile.classList.remove('hidden');
      }
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
