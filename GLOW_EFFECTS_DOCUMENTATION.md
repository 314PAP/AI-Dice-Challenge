# 🌟 AI Dice Challenge - Glow Effects Documentation

## 📋 Přehled implementovaných efektů

### 🎨 Custom Keyframes (výchozí)
**Lokace:** `src/styles/components/dice.css`

#### Dostupné keyframes:
- `gentle-glow` - Jemné pulzující záření (idle kostky)
- `neon-flash` - Rychlý záblesk (hover efekt)  
- `neon-swirl` - Světelné víření (házení kostek)
- `blue-neon-pulse` - Modrý pulz (vybrané kostky)
- `neon-dawn` - Postupné rozsvícení (nové kostky)
- `golden-flash` - Zlatý záblesk (skórování)
- `red-warning-blink` - Červený varující blik (farkle)

#### CSS aplikace:
```css
.dice:not(.selected):not(.saved):not(.dice-rolling) {
  animation: gentle-glow 3s ease-in-out infinite !important;
}

.dice:hover:not(.selected):not(.saved):not(.dice-rolling) {
  animation: neon-flash 1.5s ease-in-out infinite !important;
}

.dice.selected {
  animation: blue-neon-pulse 2s ease-in-out infinite !important;
}
```

### 🌟 Library Glow Effects
**Lokace:** `index.html` (custom style block) + `DiceGlowManager.js`

#### Dostupné třídy:
- `.glow-soft` - Jemné pulzující záření pomocí filter
- `.glow-pulse` - Dýchání s box-shadow + transform
- `.glow-shimmer` - Přelétávající světelný efekt (::before pseudo-element)
- `.glow-neon` - Intenzivní vícevrstvé neonové záření

#### CSS implementace:
```css
.glow-soft {
  filter: drop-shadow(0 0 8px var(--neon-green));
  animation: glow-soft-pulse 3s ease-in-out infinite;
}

.glow-shimmer::before {
  content: '';
  position: absolute;
  background: linear-gradient(45deg, transparent, rgba(57, 255, 20, 0.4), transparent);
  animation: glow-shimmer-move 3s linear infinite;
}
```

### 🎮 DiceGlowManager.js
**Lokace:** `src/js/game/DiceGlowManager.js`

#### Funkcionality:
- **Singleton instance** - automatická inicializace
- **Toggle tlačítko** - přepínání režimů v pravém horním rohu
- **Aplikace efektů** - programové přidávání glow tříd
- **Režimy**: `custom` (keyframes) / `library` (CSS třídy)

#### API metody:
```javascript
// Přepnutí režimu
diceGlowManager.toggleGlowMode();

// Aplikace speciálního efektu
diceGlowManager.applySpecialGlow(diceElement, 'shimmer');

// Aplikace na nové kostky
diceGlowManager.applyNewDiceGlow(newDiceElements);

// Reset všech efektů
diceGlowManager.resetAllGlow();
```

## 🔧 Použití v kódu

### Integrace do hry:
1. **main.js** - Import DiceGlowManager
2. **ComponentManager.js** - Inicializace při startu GameUI
3. **CSS varianty** - Přidány alternativní třídy pro library režim

### Toggle mezi režimy:
```css
/* Custom režim (výchozí) */
.dice {
  animation: gentle-glow 3s ease-in-out infinite;
}

/* Library režim */
.dice.glow-variant-1 {
  animation: none; /* vypne custom */
}
.dice.glow-variant-1:after {
  /* aplikuje library glow */
  filter: blur(8px);
  animation: glow-shimmer 3s linear infinite;
}
```

## 🧪 Testování

### Test stránky:
- **test-glow-effects.html** - Vizuální porovnání všech efektů
- **test-glow-effects.sh** - Rychlý start lokálního serveru

### Spuštění testů:
```bash
# Spustit test server
./test-glow-effects.sh

# Otevřít v prohlížeči
http://localhost:8000/test-glow-effects.html
```

### V hlavní hře:
1. Spustit hru: `http://localhost:8000/index.html`
2. Kliknout na **"Glow"** tlačítko (pravý horní roh)
3. Pozorovat změnu efektů kostek

## 📊 Porovnání výkonu

### Custom Keyframes:
- ✅ **Rychlé** - nativní CSS animace
- ✅ **Jednoduché** - méně DOM manipulace  
- ✅ **Kompatibilní** - funguje všude
- ❌ **Omezené** - pevně dané efekty

### Library Glow:
- ✅ **Flexibilní** - programové ovládání
- ✅ **Kombinovatelné** - více efektů najednou
- ✅ **Rozšiřitelné** - snadné přidání nových
- ❌ **Složitější** - více CSS a JS kódu

## 🎯 Doporučené použití

### Pro výkon:
- **Custom keyframes** pro základní stavy (idle, hover, selected)
- **Library glow** pro speciální akce (scoring, new dice, special events)

### Pro flexibilitu:
- **Toggle možnost** nechte uživateli vybrat
- **Kombinace** - custom jako základ, library pro rozšíření

### Pro údržbu:
- **Konzistentní barvy** - používejte CSS proměnné
- **Centrální správa** - vše přes DiceGlowManager
- **Fallback** - custom efekty jako default

## 🔮 Budoucí rozšíření

### Možné dodatky:
- **Uživatelské nastavení** - uložení preference do localStorage
- **Více efektů** - particle effects, gradient animations
- **Kontextové glow** - různé efekty podle herní situace
- **Performance monitoring** - adaptivní kvalita efektů
