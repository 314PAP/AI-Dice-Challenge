# 📋 POZNÁMKY PRO BUDOUCÍ VÝVOJ - AI Dice Challenge

## 🎯 DŮLEŽITÉ PRAVIDLA - DODRŽOVAT VŽDY!

### 1. CSS SYSTÉM
- **✅ POUŽÍVÁME**: Pouze modulární CSS systém v `src/styles/`
- **❌ NEPOUŽÍVÁME**: Žádné "quick-fix", "emergency" nebo bokem načítané CSS soubory
- **📍 Entrypoint**: `src/styles/main.css` - pouze importy, žádný inline CSS

### 2. ROZMĚR SOUBORŮ - MAX 150 ŘÁDKŮ
**Když soubor přesáhne 150 řádků → ROZDĚLIT INTELIGENTNĚ**

#### CSS Moduly:
```
❌ Špatně: components/game.css (300 řádků)
✅ Správně: 
   components/game/dice.css
   components/game/controls.css  
   components/game/scores.css
   components/game/index.css (importy)
```

#### JS Moduly:
```
❌ Špatně: gameController.js (400 řádků)
✅ Správně:
   game/controllers/gameFlowController.js
   game/controllers/eventSetupController.js
   game/controllers/turnActionsController.js
   game/controllers/index.js (importy + exports)
```

### 3. IMPORT/EXPORT PRAVIDLA

#### CSS:
```css
/* main.css - pouze importy */
@import './base/variables.css';
@import './components/game/index.css';

/* components/game/index.css */
@import './dice.css';
@import './controls.css';
@import './scores.css';
```

#### JavaScript:
```javascript
// controllers/index.js
export { initializeGame, startGame } from './gameFlowController.js';
export { setupEventListeners } from './eventSetupController.js';
export { rollDice, bankScore } from './turnActionsController.js';

// main.js nebo jiný soubor
import { initializeGame, rollDice } from './controllers/index.js';
```

## 🏗️ SOUČASNÁ ARCHITEKTURA

### CSS Struktura (src/styles/)
```
main.css ← ENTRYPOINT
├── base/ (proměnné, reset, typography)
├── layout/ (grid, containers, responsive)
├── components/ (UI komponenty)
├── animations/ (animace a efekty)
├── icons/ (ikony)
├── themes/ (témata)
└── utils/ (utility třídy)
```

### JS Struktura (src/js/)
```
main.js ← ENTRYPOINT
├── game/ (logika hry)
├── ai/ (AI systém)
├── ui/ (DOM manipulace)
└── utils/ (utility funkce)
```

## 🚨 VAROVÁNÍ - KDYŽ VIDÍŠ TOHLE, OPRAV TO!

### CSS Anti-patterns:
- ❌ Inline styly v HTML
- ❌ `<style>` tagy v HTML
- ❌ CSS soubory načítané mimo main.css
- ❌ Soubory nad 150 řádků
- ❌ Duplikovaný CSS kód

### JS Anti-patterns:
- ❌ Globální funkce bez modulů
- ❌ Duplikované funkce (jako byl quitGame)
- ❌ Missing exports/imports
- ❌ Soubory nad 150 řádků
- ❌ Inline JS v HTML (kromě malých event handlerů)

## 🔧 POSTUPY PRO REFACTORING

### Když soubor přesáhne 150 řádků:

1. **Analyzuj odpovědnosti**
   ```
   Například gameController.js:
   - Game lifecycle (init, start, end)
   - Turn management 
   - Event handling
   - Score calculation
   ```

2. **Rozděl logicky**
   ```
   gameFlowController.js    ← lifecycle
   turnController.js        ← turn management  
   eventController.js       ← events
   scoreController.js       ← scoring
   ```

3. **Vytvoř index.js pro exports**
   ```javascript
   // game/controllers/index.js
   export * from './gameFlowController.js';
   export * from './turnController.js';
   // ...atd
   ```

4. **Aktualizuj importy**
   ```javascript
   // Místo:
   import { func1, func2, func3 } from './gameController.js';
   
   // Použij:
   import { func1, func2, func3 } from './controllers/index.js';
   ```

## 🎮 SPECIFIKA PRO AI DICE CHALLENGE

### Build požadavky:
- `npm run build` musí projít bez chyb
- `npm run dev` musí fungovat
- Žádné missing exports/imports

### Design požadavky (SPLNĚNO):
- ✅ Zelené rámečky (#39ff14)
- ✅ Chat na výšku herního prostoru
- ✅ Větší avatary (60px)
- ✅ Responsive layout
- ✅ Neonová šipka pro send

### Git workflow:
- Před každou změnou: `git pull`
- Po změnách: `npm run build` (test)
- Commit s popisnými zprávami
- Push na GitHub

## 📝 CHECKLIST PRO KAŽDOU ZMĚNU

- [ ] CSS pouze přes modulární systém
- [ ] Žádný soubor nad 150 řádků
- [ ] Všechny importy/exporty funkční
- [ ] `npm run build` prochází
- [ ] Responzivita zachována
- [ ] Git commit + push

---

**💡 PAMATUJ SI**: Jeden čistý modulární systém > duplikátní rychlé opravy bokem!
