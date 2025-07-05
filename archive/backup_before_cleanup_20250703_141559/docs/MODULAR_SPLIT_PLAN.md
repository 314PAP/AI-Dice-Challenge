# Plán rozdělení dlouhých souborů na modulární struktura

## Cíl
Rozdělit všechny soubory delší než 100-150 řádků na logické moduly při zachování funkčnosti. Žádné scripty nebo styly v index.html.

## ✅ DOKONČENO V TÉTO FÁZI

### 🔄 Fáze 1: Hlavní game controller (HOTOVO)
- ✅ `src/game/mainGameController.js` (769 řádků) → 7 modulů:
  - `src/game/controllers/GameInitializer.js` (70 řádků)
  - `src/game/controllers/DiceController.js` (120 řádků)  
  - `src/game/controllers/ScoreController.js` (85 řádků)
  - `src/game/controllers/TurnController.js` (115 řádků)
  - `src/game/controllers/UIUpdateController.js` (95 řádků)
  - `src/game/controllers/GameStateController.js` (120 řádků)
  - `src/game/MainGameController.js` (85 řádků) - refaktorovaný hlavní

### 🔄 Fáze 2: CSS moduly (HOTOVO)
- ✅ `src/styles/game.css` (709 řádků) → 6 modulů:
  - `src/styles/game/buttons.css` (85 řádků)
  - `src/styles/game/dice.css` (95 řádků)
  - `src/styles/game/scoreboard.css` (120 řádků)
  - `src/styles/game/gameArea.css` (100 řádků)
  - `src/styles/game/modals.css` (140 řádků)
  - `src/styles/game/animations.css` (90 řádků)

- ✅ `src/styles/main.css` (635 řádků) → 8 modulů:
  - `src/styles/base/variables.css` (85 řádků)
  - `src/styles/base/typography.css` (120 řádků)
  - `src/styles/layout/main.css` (75 řádků)
  - `src/styles/layout/grid.css` (110 řádků)
  - `src/styles/utils/utilities.css` (140 řádků)
  - `src/styles/main.css` (90 řádků) - nový modulární import

### 🔄 Aktualizace importů (HOTOVO)
- ✅ Aktualizovány všechny CSS @import direktivy
- ✅ Aktualizovány JS import/export statements
- ✅ Funkčnost zachována a otestována

## � POKRAČOVÁNÍ - DALŠÍ FÁZE

### 🟡 Fáze 3: Zbývající velké soubory (PŘIPRAVENO)

#### Další prioritní soubory k rozdělení:
1. `src/js/game/gameController.js` (659 řádků) - **PŘIPRAVENO**
2. `src/game/turns/playerTurnController.js` (553 řádků) 
3. `src/ui/gameUIController.js` (412 řádků)
4. `src/styles/base/layout.css` (402 řádků) - **PŘIPRAVENO K ROZDĚLENÍ**
5. `src/game/events/gameEventController.js` (336 řádků)

### 📊 Aktuální stav po rozdělení:

**Úspěšně rozděleno:**
- ✅ `mainGameController.js`: 769 → 7 modulů (≤120 řádků)
- ✅ `game.css`: 709 → 6 modulů (≤140 řádků)  
- ✅ `main.css`: 635 → 6 modulů (≤140 řádků)

**Zbývá rozdělit (nad 150 řádků):**
- `gameController.js`: 659 řádků
- `playerTurnController.js`: 553 řádků  
- `gameUIController.js`: 412 řádků
- `layout.css`: 402 řádků
- `gameEventController.js`: 336 řádků
- `enhancedAIController.js`: 325 řádků

## 🎯 Plán dokončení

### Fáze 3A: JS Game Controllers
1. Rozdělit `gameController.js` → 6 modulů
2. Rozdělit `playerTurnController.js` → 5 modulů  
3. Rozdělit `gameUIController.js` → 4 moduly

### Fáze 3B: CSS Layout
1. Rozdělit `base/layout.css` → 4 moduly
2. Optimalizovat `components.css` (414 řádků)

### Fáze 3C: Události a AI
1. Rozdělit `gameEventController.js` → 4 moduly
2. Rozdělit `enhancedAIController.js` → 4 moduly

### Fáze 4: Finální úklid
1. Odstranit `*_old.js` a `*_old.css` soubory
2. Aktualizovat všechny import cesty
3. Finální test funkčnosti

## 🏗️ Nová modulární struktura (po dokončení)

```
src/
├── game/
│   ├── controllers/         ✅ HOTOVO
│   │   ├── MainGameController.js
│   │   ├── GameInitializer.js  
│   │   ├── DiceController.js
│   │   ├── ScoreController.js
│   │   ├── TurnController.js
│   │   ├── UIUpdateController.js
│   │   └── GameStateController.js
│   ├── legacy/              🔄 PŘIPRAVENO  
│   │   ├── GameController.js
│   │   ├── TurnManager.js
│   │   ├── ScoreManager.js
│   │   └── GameEventController.js
│   └── turns/              🔄 PŘIPRAVENO
│       ├── PlayerTurnController.js
│       ├── TurnValidation.js
│       └── TurnStateManager.js
├── ui/
│   └── controllers/        🔄 PŘIPRAVENO
│       ├── GameUIController.js
│       ├── ModalController.js
│       └── UIStateManager.js
└── styles/
    ├── base/               ✅ HOTOVO
    │   ├── variables.css
    │   ├── typography.css
    │   └── reset.css
    ├── layout/             ✅ HOTOVO
    │   ├── main.css
    │   ├── grid.css
    │   ├── containers.css   🔄 PŘIPRAVENO
    │   └── positioning.css  🔄 PŘIPRAVENO
    ├── game/               ✅ HOTOVO
    │   ├── buttons.css
    │   ├── dice.css
    │   ├── scoreboard.css
    │   ├── gameArea.css
    │   ├── modals.css
    │   └── animations.css
    └── utils/              ✅ HOTOVO
        └── utilities.css
```

## 📋 Kontrolní seznam

### ✅ Dokončeno:
- [x] Rozdělení `mainGameController.js` (769 → 7×≤120)
- [x] Rozdělení `game.css` (709 → 6×≤140) 
- [x] Rozdělení `main.css` (635 → 6×≤140)
- [x] Aktualizace všech importů
- [x] Funkční test aplikace
- [x] CSS moduly fungují správně
- [x] JS moduly fungují správně

### 🔄 Probíhá:
- [ ] Rozdělení `gameController.js` (659 řádků)
- [ ] Rozdělení `playerTurnController.js` (553 řádků)  
- [ ] Rozdělení `gameUIController.js` (412 řádků)

### ⏳ Připraveno:
- [ ] Rozdělení `layout.css` (402 řádků)
- [ ] Rozdělení `gameEventController.js` (336 řádků)
- [ ] Finální úklid a test

## 🔧 Pravidla zachována:

1. ✅ **Žádné inline styly/scripty v HTML**
2. ✅ **Maximální délka souboru: 150 řádků** (cíl 100-120)
3. ✅ **Jasné jmenné konvence** pro moduly
4. ✅ **Zachování funkčnosti** - aplikace funguje
5. ✅ **Clean imports** - žádné cyklické dependencies
