# Modularizační strategie pro AI Dice Game

Tento dokument poskytuje podrobné pokyny pro efektivní modularizaci kódu v projektu AI Dice Game.

## Principy modularizace

### Jeden modul, jedna odpovědnost
- Každý modul by měl řešit pouze jednu konkrétní část funkcionality
- Moduly by měly být nezávislé a snadno testovatelné
- Preferujte více menších modulů nad jedním velkým

### Čisté rozhraní
- Definujte jasné veřejné API pro každý modul
- Používejte JSDoc komentáře pro dokumentaci rozhraní
- Minimalizujte závislosti mezi moduly

### Konzistentní struktura
- Dodržujte konzistentní jmenné konvence
- Organizujte podobné moduly do společných adresářů
- Používejte index soubory pro sjednocení exportů

## Strategie rozdělování velkých souborů

### Identifikace odpovědností
1. Analyzujte soubor a identifikujte různé odpovědnosti
2. Seskupte související funkce a proměnné
3. Vytvořte samostatné moduly pro každou skupinu

### Postupné refaktorování
1. Začněte s extrakcí nejlépe izolovaných částí
2. Vytvořte nové moduly a postupně do nich přesouvejte kód
3. Upravte importy a závislosti v existujících souborech

### Příklad rozdělení velkého JS souboru

Před:
```javascript
// gameLogic.js - 300 řádků různých funkcí
function rollDice() { /* ... */ }
function calculateScore() { /* ... */ }
function updateUI() { /* ... */ }
function handlePlayerTurn() { /* ... */ }
function saveGameState() { /* ... */ }
function displayResults() { /* ... */ }
```

Po:
```javascript
// diceController.js
export function rollDice() { /* ... */ }

// scoreCalculator.js
export function calculateScore() { /* ... */ }

// gameUiController.js
export function updateUI() { /* ... */ }
export function displayResults() { /* ... */ }

// turnManager.js
import { rollDice } from './diceController.js';
import { calculateScore } from './scoreCalculator.js';
import { updateUI } from './gameUiController.js';

export function handlePlayerTurn() { /* ... */ }

// stateManager.js
export function saveGameState() { /* ... */ }
```

## Modularizace HTML a CSS

### HTML modularizace
- Rozdělte HTML na logické šablony (`header.html`, `game-board.html`, `chat.html`)
- Dynamicky načítejte šablony pomocí JavaScriptu
- Používejte komentáře pro označení modulů v hlavním HTML

```javascript
// Příklad načítání HTML šablon
async function loadTemplate(name) {
  const response = await fetch(`/src/templates/${name}.html`);
  return await response.text();
}

async function initializeUI() {
  document.querySelector('#header').innerHTML = await loadTemplate('header');
  document.querySelector('#game-board').innerHTML = await loadTemplate('game-board');
  document.querySelector('#chat').innerHTML = await loadTemplate('chat');
}
```

### CSS modularizace
- Vytvářejte samostatné CSS soubory pro každou komponentu
- Používejte CSS proměnné pro sdílené hodnoty
- Importujte pouze potřebné CSS moduly

```css
/* Příklad modularizovaného CSS */
/* main.css */
@import './variables/colors.css';
@import './variables/sizes.css';
@import './variables/animations.css';
@import './components/header.css';
@import './components/game-board.css';
@import './components/chat.css';
```

## Praktické příklady modularizace

### Modularizace herní logiky
```javascript
// Před: Vše v jednom souboru game.js
// Po: Rozděleno do logických modulů

// gameState.js - správa stavu hry
export class GameState {
  constructor() {
    this.players = [];
    this.currentPlayer = 0;
    this.score = 0;
    // ...
  }
  
  updateScore(points) { /* ... */ }
  nextPlayer() { /* ... */ }
  // ...
}

// diceManager.js - logika kostek
import { GameState } from './gameState.js';

export class DiceManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.dice = [];
    // ...
  }
  
  rollDice() { /* ... */ }
  lockDice(index) { /* ... */ }
  // ...
}

// scoreCalculator.js - výpočet skóre
export class ScoreCalculator {
  calculateScore(dice) { /* ... */ }
  checkFarkle(dice) { /* ... */ }
  // ...
}

// gameController.js - řízení hry
import { GameState } from './gameState.js';
import { DiceManager } from './diceManager.js';
import { ScoreCalculator } from './scoreCalculator.js';

export class GameController {
  constructor() {
    this.gameState = new GameState();
    this.diceManager = new DiceManager(this.gameState);
    this.scoreCalculator = new ScoreCalculator();
    // ...
  }
  
  startGame() { /* ... */ }
  endTurn() { /* ... */ }
  // ...
}
```

### Modularizace UI
```javascript
// Před: Vše v ui.js
// Po: Rozděleno do logických komponent

// diceRenderer.js
export class DiceRenderer {
  constructor(container) {
    this.container = container;
  }
  
  renderDice(diceValues) { /* ... */ }
  animateRoll() { /* ... */ }
  // ...
}

// scoreboardView.js
export class ScoreboardView {
  constructor(container) {
    this.container = container;
  }
  
  updateScores(players) { /* ... */ }
  highlightCurrentPlayer(index) { /* ... */ }
  // ...
}

// chatInterface.js
export class ChatInterface {
  constructor(container) {
    this.container = container;
    this.messages = [];
  }
  
  addMessage(message) { /* ... */ }
  clearChat() { /* ... */ }
  // ...
}

// uiController.js
import { DiceRenderer } from './diceRenderer.js';
import { ScoreboardView } from './scoreboardView.js';
import { ChatInterface } from './chatInterface.js';

export class UIController {
  constructor() {
    this.diceRenderer = new DiceRenderer(document.getElementById('dice-container'));
    this.scoreboard = new ScoreboardView(document.getElementById('scoreboard'));
    this.chat = new ChatInterface(document.getElementById('chat'));
    // ...
  }
  
  setupEventListeners() { /* ... */ }
  updateUI() { /* ... */ }
  // ...
}
```

## Checklist pro modularizaci

1. Identifikujte velké soubory (>150 řádků)
2. Analyzujte soubor a určete různé odpovědnosti
3. Navrhněte moduly pro každou odpovědnost
4. Vytvořte nové soubory pro každý modul
5. Extrahujte související kód do příslušných modulů
6. Upravte importy a exporty
7. Testujte každý modul samostatně
8. Aktualizujte dokumentaci
