# 🎨 Barevná paleta AI Dice Game - ✅ DOKONČENO

## 6 přednastavených neonových barev

### ✅ **STATUS: IMPLEMENTOVÁNO**
Všechny barvy jsou implementovány a standardizovány v `src/styles/variables/colors.css`

### 1. 🟢 **Neon Green** - Primární barva hráče
- **Kód**: `#39ff14`
- **RGB**: `57, 255, 20`
- **Použití**: Hráč (člověk), primární tlačítka, úspěch
- **CSS třída**: `.neon-green`, `.btn-neon-green`

### 2. 🔵 **Neon Blue** - Sekundární barva AI
- **Kód**: `#194DD1`
- **RGB**: `25, 77, 209`
- **Použití**: AI Gemini (Sarah), sekundární tlačítka, info
- **CSS třída**: `.neon-blue`, `.btn-neon-blue`

### 3. 🟠 **Neon Orange** - Barva pro AI
- **Kód**: `#FF8800`
- **RGB**: `255, 140, 0`
- **Použití**: AI Claude, upozornění, varování
- **CSS třída**: `.neon-orange`, `.btn-neon-orange`

### 4. 🟣 **Neon Pink** - Barva pro AI
- **Kód**: `#FF00FF`
- **RGB**: `255, 0, 255`
- **Použití**: AI ChatGPT (Marcus), speciální akce
- **CSS třída**: `.neon-pink`, `.btn-neon-pink`

### 5. 🔴 **Neon Red** - Barva pro chyby
- **Kód**: `#ff3131`
- **RGB**: `255, 49, 49`
- **Použití**: Chyby, nebezpečí, FARKLE, quit tlačítka
- **CSS třída**: `.neon-red`, `.btn-neon-red`

### 6. 🟡 **Neon Yellow** - Barva pro systém
- **Kód**: `#ffff00`
- **RGB**: `255, 255, 0`
- **Použití**: Systémové zprávy, informace, zlaté zvýraznění
- **CSS třída**: `.neon-yellow`, `.btn-neon-yellow`

## Mapování barev na herní prvky

### Hráči a AI:
- **Hráč (člověk)**: 🟢 Neon Green
- **AI Sarah (Gemini)**: 🔵 Neon Blue
- **AI Marcus (ChatGPT)**: 🟣 Neon Pink
- **AI Luna (Claude)**: 🟠 Neon Orange

### Herní akce:
- **Roll Dice**: 🟢 Neon Green (hlavní akce)
- **Bank Dice**: 🔵 Neon Blue (sekundární akce)
- **End Turn**: 🟣 Neon Pink (finalizace)
- **Quit Game**: 🔴 Neon Red (destruktivní akce)

### Stavy a zprávy:
- **Úspěch**: 🟢 Neon Green
- **Informace**: 🔵 Neon Blue
- **Varování**: 🟠 Neon Orange
- **Chyba/FARKLE**: 🔴 Neon Red
- **Systémové zprávy**: 🟡 Neon Yellow

## CSS implementace

### Základní proměnné (variables.css):
```css
:root {
  --neon-green: #39ff14;
  --neon-blue: #194DD1;
  --neon-orange: #FF8800;
  --neon-pink: #FF00FF;
  --neon-red: #ff3131;
  --neon-yellow: #ffff00;
}
```

### Textové třídy (neon-effects.css):
```css
.neon-green { color: var(--neon-green); }
.neon-blue { color: var(--neon-blue); }
.neon-orange { color: var(--neon-orange); }
.neon-pink { color: var(--neon-pink); }
.neon-red { color: var(--neon-red); }
.neon-yellow { color: var(--neon-yellow); }
```

### Tlačítka (buttons.css):
```css
.btn-neon-green { /* Zelené tlačítko */ }
.btn-neon-blue { /* Modré tlačítko */ }
.btn-neon-pink { /* Růžové tlačítko */ }
/* + neon-orange, neon-red, neon-yellow */
```

## Doporučené použití

### Priorita barev:
1. **Neon Green** - Primární barva projektu
2. **Neon Blue** - Sekundární barva
3. **Neon Pink** - Akcentová barva
4. **Neon Orange** - Upozornění
5. **Neon Red** - Chyby a nebezpečí
6. **Neon Yellow** - Systémové informace

### Kontrasty a čitelnost:
- Všechny barvy jsou navrženy pro **černé pozadí** (`#000000`)
- Každá barva má **neonový glow efekt**
- **RGB varianty** jsou k dispozici pro průhlednost
- **Box-shadow** efekty pro lepší vizuální dojem

### Accessibility:
- Barvy jsou **jasné a kontrastní**
- Použití **text-shadow** pro lepší čitelnost
- **Hover stavy** s větším glow efektem
- **Focus stavy** pro navigaci klávesnicí

## Rozšíření palety

Pokud budete potřebovat více barev, doporučuji:
- **Neon Cyan**: `#00ffff` - pro speciální funkce
- **Neon Purple**: `#8A2BE2` - pro premium funkce
- **Neon Lime**: `#32CD32` - pro eco/green témata

Tyto barvy už máte připravené a otestované ve všech komponentách hry! 🎨✨
