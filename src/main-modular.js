/**
 * Inicializační skript pro modularizovanou aplikaci
 * Tento skript načítá komponenty a obsluhuje jejich inicializaci
 */

import ComponentManager from './js/ui/components/ComponentManager.js';

// Vytvoření správce komponent
const componentManager = new ComponentManager();

// Registrace komponent a jejich šablon
function registerComponents() {
  // Desktop komponenty
  componentManager.registerComponent(
    'gameMenu', 
    '/src/templates/game-menu.html',
    initializeGameMenu
  );
  
  componentManager.registerComponent(
    'gameControls', 
    '/src/templates/game-controls.html',
    initializeGameControls
  );
  
  componentManager.registerComponent(
    'chat', 
    '/src/templates/chat.html',
    initializeChat
  );
  
  // Mobilní komponenty
  componentManager.registerComponent(
    'gameMobileMenu', 
    '/src/templates/game-menu-mobile.html',
    initializeGameMobileMenu
  );
  
  componentManager.registerComponent(
    'gameMobileControls', 
    '/src/templates/game-controls-mobile.html',
    initializeGameMobileControls
  );
  
  componentManager.registerComponent(
    'chatMobile', 
    '/src/templates/chat-mobile.html',
    initializeMobileChat
  );
  
  // Modální okna
  componentManager.registerComponent(
    'rulesModal', 
    '/src/templates/modals/rules-modal.html',
    initializeRulesModal
  );
  
  componentManager.registerComponent(
    'hallOfFameModal', 
    '/src/templates/modals/hall-of-fame-modal.html',
    initializeHallOfFameModal
  );
  
  componentManager.registerComponent(
    'gameOverModal', 
    '/src/templates/modals/game-over-modal.html',
    initializeGameOverModal
  );
}

// Inicializace aplikace - načtení potřebných komponent
async function initializeApp() {
  try {
    // Nejprve registrovat komponenty
    registerComponents();
    
    // Načíst základní komponenty pro desktop
    await componentManager.loadComponents([
      { name: 'gameMenu', target: '#gameContent' },
      { name: 'chat', target: '#chatPanel' },
      { name: 'rulesModal', target: '#modalsContainer', append: true },
      { name: 'hallOfFameModal', target: '#modalsContainer', append: true },
      { name: 'gameOverModal', target: '#modalsContainer', append: true }
    ]);
    
    // Načíst mobilní komponenty
    await componentManager.loadComponents([
      { name: 'gameMobileMenu', target: '#gameMobileContent' },
      { name: 'chatMobile', target: '#chatPanelMobileContainer' }
    ]);
    
    // Po načtení všech komponent inicializujeme aplikaci
    initializeEventListeners();
    
  } catch (error) {
    console.error('Chyba při inicializaci aplikace:', error);
  }
}

// Inicializační funkce pro jednotlivé komponenty
function initializeGameMenu() {
  console.log('Inicializace desktop game menu');
  // Kód pro inicializaci menu
}

function initializeGameControls() {
  console.log('Inicializace desktop game controls');
  // Kód pro inicializaci herních ovládacích prvků
}

function initializeChat() {
  console.log('Inicializace chat komponenty');
  // Kód pro inicializaci chatu
}

function initializeGameMobileMenu() {
  console.log('Inicializace mobilního menu');
  // Kód pro inicializaci mobilního menu
}

function initializeGameMobileControls() {
  console.log('Inicializace mobilních herních ovládacích prvků');
  // Kód pro inicializaci mobilních herních ovládacích prvků
}

function initializeMobileChat() {
  console.log('Inicializace mobilního chatu');
  // Kód pro inicializaci mobilního chatu
}

function initializeRulesModal() {
  console.log('Inicializace modálního okna s pravidly');
  // Kód pro inicializaci modálního okna s pravidly
}

function initializeHallOfFameModal() {
  console.log('Inicializace modálního okna se síní slávy');
  // Kód pro inicializaci modálního okna se síní slávy
}

function initializeGameOverModal() {
  console.log('Inicializace modálního okna pro konec hry');
  // Kód pro inicializaci modálního okna pro konec hry
}

// Inicializace event listenerů
function initializeEventListeners() {
  console.log('Inicializace globálních event listenerů');
  // Kód pro inicializaci globálních event listenerů
}

// Přepnutí mezi herním menu a herními ovládacími prvky
async function switchToGameControls() {
  // Skrytí menu
  document.getElementById('gameHeader').classList.add('hidden');
  document.getElementById('gameHeaderMobile').classList.add('hidden');
  
  // Zobrazení herních ovládacích prvků
  if (!componentManager.isLoaded('gameControls')) {
    await componentManager.loadComponent('gameControls', '#gameContent');
  }
  document.getElementById('gameControls').classList.remove('hidden');
  
  // Načtení mobilních herních ovládacích prvků
  if (!componentManager.isLoaded('gameMobileControls')) {
    await componentManager.loadComponent('gameMobileControls', '#gameMobileContent');
  }
  document.getElementById('gameControlsMobile').classList.remove('hidden');
}

// Přepnutí zpět do herního menu
function switchToGameMenu() {
  // Skrytí herních ovládacích prvků
  document.getElementById('gameControls').classList.add('hidden');
  document.getElementById('gameControlsMobile').classList.add('hidden');
  
  // Zobrazení menu
  document.getElementById('gameHeader').classList.remove('hidden');
  document.getElementById('gameHeaderMobile').classList.remove('hidden');
}

// Spuštění inicializace po načtení dokumentu
document.addEventListener('DOMContentLoaded', initializeApp);

// Export funkcí pro použití v dalších modulech
export { componentManager, switchToGameControls, switchToGameMenu };
