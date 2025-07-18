# 🎮 KOMPLEXNÍ TESTOVACÍ DOKUMENTACE - AI DICE CHALLENGE

## 📋 PŘEHLED TESTŮ

Tato dokumentace popisuje kompletní testovací suite pro AI Dice Challenge, která pokrývá všechny aspekty hry od základní logiky po pokročilé UI interakce.

## 🚀 RYCHLÝ START

```bash
# Spustit všechny testy najednou
npm run test:master

# Nebo jednotlivé kategorie
npm run test:quick        # Rychlé základní testy
npm run test:ui          # UI komponenty a interakce
npm run test:interactive # Interaktivní testy s DOM
npm run test:all         # Kombinace všech testů
```

## 📊 STRUKTURA TESTŮ

### 1. **Systémová validace** (KRITICKÁ)
- `verify-copilot-system.sh` - Validace systému a dodržování pravidel
- `smart-css-validation.sh` - Validace CSS a Bootstrap kompatibility

### 2. **Herní logika a mechaniky**
- `test-farkle-comprehensive.js` - Všechny herní kombinace a pravidla
- `test-real-game-simulation.js` - Realistická herní simulace

### 3. **UI komponenty a interakce**
- `test-kompletni-ui-interakce.js` - Kompletní UI testy
- `test-interaktivni-ui.js` - Interaktivní DOM testy

### 4. **AI a pokročilé funkce**
- `test-chat-system-debug.js` - AI chat systém
- `test-hot-dice-fix.js` - Hot dice mechaniky

### 5. **Bootstrap a CSS komponenty**
- Validace Bootstrap grid systému
- Kontrola neon CSS tříd
- Detekce zakázaných inline stylů

### 6. **Kompletní herní simulace**
- `test-extended-suite.sh` - Rozšířená testovací suite
- `test-game-functionality.sh` - Funkční testy hry

## 🎯 DETAILNÍ POPIS TESTŮ

### `test-kompletni-ui-interakce.js`

**Cíl**: Testování všech UI komponent a jejich správného chování

**Pokrývá**:
- ✅ Existence všech UI komponent
- ✅ Herní fáze a přechody mezi nimi
- ✅ Stavy tlačítek během různých herních situací
- ✅ Výběr kostek a validace
- ✅ Komplexní gameplay scénáře
- ✅ Bootstrap komponenty a CSS třídy

**Klíčové testy**:
```javascript
// Test existence komponent
testUIComponentsExistence()

// Test herních fází
testGamePhasesAndTransitions()

// Test tlačítek
testButtonStatesAndInteractions()

// Test kostek
testDiceSelectionAndValidation()

// Test herních scénářů
testComplexGameplayScenarios()

// Test Bootstrap
testBootstrapAndCSSComponents()
```

### `test-interaktivni-ui.js`

**Cíl**: Simulace reálných herních akcí s DOM manipulací

**Pokrývá**:
- 🎮 Klikání na tlačítka a jejich odezva
- 🎲 Změny stavu během herního flow
- ❌ Chybové stavy a jejich zpracování
- 📱 Responsivní layout a Bootstrap
- 🎯 Kompletní herní session

**Klíčové funkce**:
```javascript
// DOM simulator
class InteractiveDOMSimulator {
  simulateClick(elementId)
  updateElementState(id, updates)
  getClickHistory()
  getStateHistory()
}

// Herní event handlery
handleRollDice()
handleSaveDice()
handleEndTurn()
handleDiceClick(index)
```

### `master-test-runner.sh`

**Cíl**: Orchestrace všech testů v logickém pořadí

**Fáze testování**:
1. **Systémová validace** (kritická) - pokud selže, zastaví se
2. **Herní logika** - základní mechaniky
3. **UI komponenty** - interaktivní elementy
4. **AI funkce** - pokročilé funkce
5. **Bootstrap/CSS** - styling a layout
6. **Kompletní simulace** - celková integrace

**Statistiky**:
- Celkový počet testů
- Úspěšnost v %
- Čas běhu
- Detailní výsledky každé fáze

## 🔧 TECHNICKÉ DETAILY

### Mock DOM Environment

Pro testování UI bez reálného browseru:

```javascript
class MockDOMEnvironment {
  // Simulace DOM elementů
  elements = new Map()
  
  // Event handling
  eventHandlers = new Map()
  
  // Historie akcí
  clickHistory = []
  stateHistory = []
}
```

### Herní simulátor

```javascript
class GameStateSimulator {
  // Simulace herního stavu
  canSaveDice(selectedIndices, currentRoll)
  canEndTurn(turnScore)
  
  // Validace pravidel
  validateFirstEntry()
  validateFarkle()
  validateHotDice()
}
```

### Testovací vzory

```javascript
// Struktura testu
runTest(name, testFunction) {
  try {
    const result = testFunction()
    if (result.success) {
      // Test prošel
    } else {
      // Test selhal
    }
  } catch (error) {
    // Chyba v testu
  }
}
```

## 📈 OČEKÁVANÉ VÝSLEDKY

### Při úspěšném dokončení:
```
🎯 CELKOVÉ VÝSLEDKY
════════════════════════════════════════════════════════════════════════════════════
📊 Celkem testů: 15-20
✅ Úspěšné: 15-20
❌ Neúspěšné: 0
💥 Chyby: 0
📈 Úspěšnost: 100%
⏱️  Celkový čas: 2-5 minut

🎉 VŠECHNY TESTY ÚSPĚŠNÉ!
```

### Při chybách:
```
🚨 NĚKTERÉ TESTY SELHALY!
════════════════════════════════════════════════════════════════════════════════════
❌ Neúspěšné testy: X
💥 Chyby: Y

🔧 DOPORUČENÉ KROKY:
1. Zkontrolujte logy výše pro podrobnosti chyb
2. Opravte identifikované problémy
3. Spusťte znovu: npm run test:master
```

## 🎯 CHECKLIST PŘED SPUŠTĚNÍM

- [ ] Projekt je v `src/` adresáři
- [ ] `package.json` obsahuje všechny npm skripty
- [ ] Všechny test soubory mají spustitelná oprávnění
- [ ] Bootstrap CSS je správně načten
- [ ] Herní moduly jsou správně importovány
- [ ] GameState je inicializován

## 🔍 DEBUGGING TIPŮ

### Při selhání testů:

1. **Zkontroluj console.log výstupy**
2. **Ověř importy modulů**
3. **Zkontroluj gameState.js**
4. **Validuj Bootstrap CSS**
5. **Zkontroluj event handlery**

### Časté problémy:

- **Import chyby**: Zkontroluj cesty k modulům
- **DOM chyby**: Ověř mock DOM setup
- **State chyby**: Zkontroluj gameState management
- **CSS chyby**: Ověř Bootstrap třídy

## 🎮 POUŽITÍ

### Během vývoje:
```bash
# Rychlé testy po změnách
npm run test:quick

# UI testy po změnách v UI
npm run test:ui

# Kompletní testy před commitem
npm run test:master
```

### Před nasazením:
```bash
# Kompletní validace
npm run test:master

# Pokud vše prošlo
npm run commit
```

## 📚 DALŠÍ DOKUMENTACE

- `KOMPLETNI_DOKUMENTACE_SYSTEMU.md` - Celková dokumentace
- `QUICK_REFERENCE.md` - Rychlý přehled
- `dokumentybtrap/` - Bootstrap dokumentace
- `.github/copilot-instructions.md` - Pravidla pro vývoj

---

**✨ Tento testovací systém zajišťuje 100% funkčnost a kvalitu hry před každým nasazením!**
