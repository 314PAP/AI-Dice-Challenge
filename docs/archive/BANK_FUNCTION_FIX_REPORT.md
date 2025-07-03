# 🏦 Bank Function Fix Report

## Problém
Kostky se daly vybrat, ale nešly odložit (bank button nefungoval).

## Identifikované příčiny ❌

### 1. Chybná podmínka v `gameControls.js`
```javascript
// PROBLÉM: Chyběla kontrola mustBankDice
const canBank = gameState.selectedDice.length > 0 && calculateScore(selectedValues) > 0;

// OPRAVA: Přidána kontrola mustBankDice
const canBank = gameState.mustBankDice && gameState.selectedDice.length > 0 && calculateScore(selectedValues) > 0;
```

### 2. Neúplný update v `gameUI.js` 
```javascript
// PROBLÉM: updateGameDisplay nevolal updateControlsState
export const updateGameDisplay = debounce(() => {
    updateDiceContainer();
}, 50);

// OPRAVA: Přidán updateControlsState
export const updateGameDisplay = debounce(() => {
    updateDiceContainer();
    updateControlsState();
}, 50);
```

## Výsledek ✅

### Opravená logika bank button:
1. **mustBankDice = true** (po úspěšném hodu)
2. **selectedDice.length > 0** (vybráné kostky)
3. **calculateScore(selected) > 0** (bodující kombinace)
4. **isHumanTurn** (je tah hráče)

### Testované scénáře:
- ✅ **Hod kostkami** → mustBankDice = true
- ✅ **Výběr kostek** → bank button enabled
- ✅ **Odložení kostek** → body přičteny, kostky odloženy
- ✅ **HOT DICE** → reset na 6 kostek při odložení všech

## Test soubory
- `test_bank_function.html` - Detailní test s debugging
- `test_dice_selection_fix.html` - Kompletní dice workflow  
- `index.html` - Hlavní aplikace

## Debugging přidán
Funkce `bankSelectedDice()` nyní loguje:
- 🏦 bankSelectedDice called
- 🎲 Selected dice: [indices]
- 🎮 Current player: 0
- 🎯 Must bank dice: true/false
- 🎲 Selected values: [values] 
- 💰 Calculated score: points

**Status: 🟢 BANK FUNCTION PLNĚ FUNKČNÍ**
