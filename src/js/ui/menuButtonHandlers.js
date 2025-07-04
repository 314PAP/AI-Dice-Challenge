// Modul pro napojení tlačítek hlavního menu (desktop i mobil)
// Používat po každém načtení šablony menu!

import { showRules } from '../game/controllers/eventSetupController.js';
import { displayHallOfFame } from '../utils/hallOfFame.js';
import { startGame } from '../game/controllers/gameFlowController.js';
// import { GameStateController } from '../../ui/controllers/gameStateController.js'; // CHYBNÝ IMPORT - ODSTRANĚNO

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

// Pomocná funkce pro získání hodnoty skóre z inputu (desktop/mobil)
function getTargetScore() {
  const inputDesktop = document.getElementById('targetScoreInput');
  const inputMobile = document.getElementById('targetScoreInputMobile');
  return parseInt((inputDesktop?.value || inputMobile?.value || '10000'), 10);
}

// Jednoduchá funkce pro spuštění hry
function handleStartGame() {
  console.log('🎮 Spouštím hru...');
  const targetScore = getTargetScore();
  
  if (targetScore < 1000) {
    alert('Cílové skóre musí být alespoň 1000 bodů!');
    return;
  }
  
  try {
    startGame();
    console.log('✅ Hra byla úspěšně spuštěna');
  } catch (error) {
    console.error('❌ Chyba při spouštění hry:', error);
    alert('Při spouštění hry došlo k chybě. Zkuste to znovu.');
  }
}

export function attachMenuButtonHandlers() {
  console.log('🔗 Připojuji menu button handlery...');
  
  // START GAME
  console.log('🎮 Hledám START GAME tlačítka...');
  const startBtns = [
    document.getElementById('startGameBtn'),
    document.getElementById('startGameBtnMobile')
  ].filter(Boolean);
  console.log(`🎮 Nalezeno ${startBtns.length} START GAME tlačítek`);
  startBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', handleStartGame);
  });

  // PRAVIDLA
  console.log('📖 Hledám PRAVIDLA tlačítka...');
  const rulesBtns = [
    document.getElementById('rulesBtn'),
    document.getElementById('rulesBtnMobile')
  ].filter(Boolean);
  console.log(`📖 Nalezeno ${rulesBtns.length} PRAVIDLA tlačítek`);
  rulesBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', showRules);
  });

  // SÍŇ SLÁVY
  console.log('🏆 Hledám SÍŇ SLÁVY tlačítka...');
  const hallBtns = [
    document.getElementById('hallOfFameBtn'),
    document.getElementById('hallOfFameBtnMobile')
  ].filter(Boolean);
  console.log(`🏆 Nalezeno ${hallBtns.length} SÍŇ SLÁVY tlačítek`);
  hallBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', displayHallOfFame);
  });

  // OPUSTIT HRU
  console.log('🚪 Hledám OPUSTIT HRU tlačítka...');
  const exitBtns = [
    document.getElementById('exitGameBtn'),
    document.getElementById('exitGameBtnMobile')
  ].filter(Boolean);
  console.log(`🚪 Nalezeno ${exitBtns.length} OPUSTIT HRU tlačítek`);
  exitBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', handleExitGame);
  });

  // Kup mi kávu je pouze odkaz, není třeba JS
  
  // ZAVŘENÍ RULES MODALU
  console.log('❌ Hledám ZAVŘENÍ RULES MODALU tlačítko...');
  const closeRulesBtn = document.getElementById('closeRulesBtn');
  if (closeRulesBtn) {
    console.log('❌ Nalezeno ZAVŘENÍ RULES MODALU tlačítko');
    closeRulesBtn.addEventListener('click', () => {
      const rulesModal = document.getElementById('rulesModal');
      if (rulesModal) {
        rulesModal.classList.add('hidden');
      }
    });
  }
  
  // ZAVŘENÍ HALL OF FAME MODALU
  console.log('❌ Hledám ZAVŘENÍ HALL OF FAME MODALU tlačítko...');
  const closeHallOfFameBtn = document.getElementById('closeHallOfFameBtn');
  if (closeHallOfFameBtn) {
    console.log('❌ Nalezeno ZAVŘENÍ HALL OF FAME MODALU tlačítko');
    closeHallOfFameBtn.addEventListener('click', () => {
      const hallOfFameModal = document.getElementById('hallOfFameModal');
      if (hallOfFameModal) {
        hallOfFameModal.classList.add('hidden');
      }
    });
  }
  
  console.log('✅ Menu button handlers attached (desktop & mobile)');
}
