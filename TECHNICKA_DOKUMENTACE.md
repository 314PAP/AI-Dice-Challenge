# 🔧 AI Dice Challenge Verze 1.0 - Technická dokumentace

## 🏗️ Architektura

### Technický stack

- **Frontend**: Bootstrap 5.3.2 + ES6 moduly
- **Animace**: Animate.css, Magic.css, CSShake
- **Build**: Vite (dev server)
- **Persistence**: LocalStorage

### Modularní struktura

```
src/js/
├── ai/               # AI logika
│   ├── personalities.js       # 6 AI osobností
│   ├── aiPlayerController.js  # AI herní logika
│   ├── aiDecisionEngine.js    # AI rozhodování
│   ├── aiStrategies.js        # AI strategie
│   └── chatSystem.js          # AI chat systém
│
├── app/              # Aplikační vrstva
│   ├── AppInitializer.js      # Inicializace aplikace
│   ├── LayoutManager.js       # Správa layoutu
│   └── ComponentManager.js    # Správa komponent
│
├── game/             # Herní logika
│   ├── gameState.js           # Centrální stav hry
│   ├── gameLogic.js           # Hlavní herní logika
│   ├── diceMechanics.js       # Mechaniky kostek a bodování
│   ├── DiceManager.js         # Správa kostek
│   ├── TurnManager.js         # Správa tahů
│   └── DiceAnimationManager.js # Animace kostek
│
├── ui/               # Uživatelské rozhraní
│   ├── gameUI.js              # Hlavní UI
│   ├── gameScreens.js         # Obrazovky (menu, pravidla)
│   ├── gameRenderer.js        # Vykreslování kostek
│   ├── uiComponents.js        # UI komponenty
│   ├── chatUI.js              # Chat rozhraní
│   └── menuComponents.js      # Menu komponenty
│
└── utils/            # Pomocné moduly
    ├── constants.js           # Konstanty
    ├── helpers.js             # Pomocné funkce
    ├── colors.js              # Barevný systém
    ├── soundSystem.js         # Zvukový systém
    └── hallOfFame.js          # Síň slávy
```

## 🎮 Klíčové systémy

### 1. Herní stav (gameState.js)

```javascript
const gameState = {
    currentPlayer: 0,
    players: [],
    dice: [],
    selectedDice: [],
    turnScore: 0,
    gamePhase: 'menu',
    isHotDice: false
}
```

### 2. AI systém

- **Personalities**: 3 různé AI typy s vlastnostmi
- **Decision Engine**: Rozhodování na základě pravděpodobnosti
- **Strategies**: Konzervativní vs. agresivní přístupy
- **Chat System**: Kontextové reakce AI

### 3. Bodovací systém (diceMechanics.js)

```javascript
calculatePoints(dice) {
    // 1. Postupka (1,2,3,4,5,6) = 2000
    // 2. Tři páry = 1500
    // 3. Více stejných (3+) 
    // 4. Jednotlivé 1 a 5
}
```

### 4. Hot Dice mechanika

```javascript
isHotDiceState() {
    return selectedDice.length === 6 && 
           calculatePoints(selectedDice) > 0;
}
```

## 🎨 CSS systém

### Neon barvy

```css
:root {
    --neon-green: #39ff14;
    --neon-blue: #194dd1;
    --neon-purple: #ff00ff;
    --neon-orange: #ff8800;
    --neon-red: #ff3131;
    --neon-yellow: #ffff00;
    --neon-black: #000000;
}
```

### Bootstrap rozšíření

- `.text-neon-*` - textové barvy
- `.border-neon-*` - okraje
- `.btn-neon[data-neon-color="*"]` - tlačítka
- `.bg-neon-black` - pozadí

### Animace kostek

- **Házení**: `animate__rollIn` + `shake-slow`
- **Výběr**: `glow-soft` efekt
- **Hot Dice**: `magictime puffIn`

## 🔄 Workflow a skripty

### Automatizace

```bash
skripty/
├── automatizace/
│   ├── auto-watcher.sh       # Sleduje změny v kódu
│   ├── smart-commit.sh       # Validace + commit + push
│   └── auto-selfcheck.sh     # Self-check při startu
│
├── testy/
│   ├── master-test-runner.sh # Kompletní test suite
│   ├── test-*.js             # Unit testy
│   └── test-extended-suite.sh # Rozšířené testy
│
└── validace/
    ├── css-validation.sh     # CSS pravidla kontrola
    ├── smart-css-validation.sh # Smart validace
    └── verify-copilot-system.sh # Copilot integrace
```

### NPM skripty

```json
{
  "dev": "vite",
  "build": "vite build",
  "test": "./skripty/testy/master-test-runner.sh",
  "watch": "./skripty/automatizace/auto-watcher.sh",
  "commit": "./skripty/automatizace/smart-commit.sh",
  "validate": "./skripty/validace/smart-css-validation.sh"
}
```

## 🤖 AI rozhodovací systém

### Personality traits

```javascript
const personalities = {
    marcus: {
        riskTolerance: 0.3,    // Nízké riziko
        aggressiveness: 0.2,   // Konzervativní
        chatStyle: 'analytical'
    },
    blaze: {
        riskTolerance: 0.8,    # Vysoké riziko  
        aggressiveness: 0.9,   # Velmi agresivní
        chatStyle: 'emotional'
    }
}
```

### Decision engine

1. **Analýza stavu**: Aktuální skóre, pozice, riziko
2. **Strategické rozhodnutí**: Na základě personality
3. **Výběr kostek**: Optimalizace podle strategie
4. **Chat reakce**: Kontextová zpráva

## 📊 Persistence

### LocalStorage

- `aidice_hall_of_fame` - Top 10 výsledků
- `aidice_settings` - Uživatelská nastavení
- `aidice_statistics` - Herní statistiky

### Hall of Fame struktura

```javascript
{
    name: "Hráč",
    score: 12450,
    date: "2025-01-20",
    duration: "15:30",
    aiOpponents: ["Marcus", "Blaze"]
}
```

## 🔧 Debugging

### Console výstupy

- `🎯 calculatePoints` - Bodování
- `🤖 AI rozhodnutí` - AI logika
- `🎲 Dice state` - Stav kostek
- `🔄 Game phase` - Fáze hry

### Test nástroje

- Browser debug soubory v `skripty/testy/`
- Real-time monitoring přes Console Ninja
- Live validace CSS pravidel

---

**Pro další detaily konzultujte zdrojový kód - je dobře komentovaný!**
