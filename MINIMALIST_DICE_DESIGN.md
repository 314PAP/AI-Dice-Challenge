# 🎲 Minimalistický design kostek - Změny

## Co bylo změněno

### ❌ ODSTRANĚNO - Rozvláčné zobrazení s popisky:
```
┌─ Odložené kostky tohoto tahu: ─┐
│  [1] [5] [1]                   │
└────────────────────────────────┘

┌─ Aktuální hod: ─┐  
│  [2] [3] [6]     │
└──────────────────┘
```

### ✅ NOVÉ - Minimalistické zobrazení v jedné řadě:
```
[1] [5] [1] [2] [3] [6]
 ↑   ↑   ↑   ↑   ↑   ↑
ztlumené   aktivní kostky
odložené
```

## Technické změny

### 1. **gameUI.js** - Zjednodušená logika zobrazení
```javascript
// PŘED: Sekce s popisky
const bankedSection = document.createElement('div');
bankedSection.innerHTML = `
    <div class="banked-dice-label">Odložené kostky tohoto tahu:</div>
    <div class="banked-dice-container">...`

// PO: Jednoduchý kontejner
const allDiceContainer = document.createElement('div');
allDiceContainer.className = 'all-dice-container';
// Všechny kostky přímo do jednoho kontejneru
```

### 2. **CSS změny**
- **Nový:** `.all-dice-container` - flexbox v jedné řadě
- **Aktualizované:** `.dice.banked` - více ztlumené, šedé
- **Odstraněné:** `.banked-dice-section`, `.current-dice-section`, labels

### 3. **Vizuální vylepšení**
- Odložené kostky: `opacity: 0.5`, šedá barva, žádný glow
- Aktivní kostky: plná barva, hover efekty, klikatelné
- Responzivní design pro všechny velikosti obrazovek

## Výhody nového designu

✅ **Minimalistické** - žádné zbytečné popisky  
✅ **Rychlejší orientace** - vše na jednom místě  
✅ **Méně kódu** - jednodušší struktura DOM  
✅ **Lepší UX** - okamžitě viditelný stav všech kostek  
✅ **Responzivní** - funguje na všech zařízeních  

## Testování
- Vytvořen test page: `test_minimalist_dice.html`
- Ověřena funkcionalita v hlavní hře
- Potvrzena responzivita na různých velikostech obrazovek
