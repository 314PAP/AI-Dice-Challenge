# 🎨 CSS TŘÍDY - Kompletní přehled modulů

## 🔘 BUTTONS (components/buttons.css)
```html
<!-- Základní tlačítka -->
<button class="btn">Základní</button>
<button class="btn btn-primary">Zelené neonové</button>
<button class="btn btn-secondary">Modré neonové</button>
<button class="btn btn-success">Úspěch</button>
<button class="btn btn-warning">Varování</button>
<button class="btn btn-danger">Nebezpečí</button>

<!-- Velikosti -->
<button class="btn btn-small">Malé</button>
<button class="btn btn-large">Velké</button>

<!-- Speciální -->
<button class="btn btn-ghost">Průhledné</button>
<button class="btn btn-rounded">Kulaté</button>
```

## 🎲 DICE (components/dice.css)
```html
<!-- Základní kostky -->
<div class="dice" data-value="1">1</div>
<div class="dice" data-value="6">6</div>

<!-- Stavy -->
<div class="dice selected">Vybraná</div>
<div class="dice scoring">Bodovací</div>
<div class="dice locked">Zamčená</div>
<div class="dice rolling">Animace házení</div>
<div class="dice farkle">Farkle efekt</div>
```

## 👥 PLAYERS (components/players.css)
```html
<!-- Hráči -->
<div class="player">Základní hráč</div>
<div class="player active">Aktivní hráč</div>

<!-- Typy hráčů -->
<div class="player human-player">Člověk</div>
<div class="player gemini-player">Gemini</div>
<div class="player chatgpt-player">ChatGPT</div>
<div class="player claude-player">Claude</div>
```

## 💬 CHAT (components/chat.css)
```html
<!-- Chat komponenty -->
<div class="chat-panel">Chat panel</div>
<div class="chat-message">Zpráva</div>
<div class="chat-message system">Systémová zpráva</div>
<div class="chat-message ai">AI zpráva</div>
<div class="chat-message player">Hráčova zpráva</div>
```

## ✨ IKONY (icons/neon-icons.css)
```html
<!-- Základní ikony -->
<span class="neon-icon icon-dice">🎲</span>
<span class="neon-icon icon-coffee">☕</span>
<span class="neon-icon icon-gaming">🎮</span>
<span class="neon-icon icon-star">⭐</span>

<!-- Velikosti -->
<span class="neon-icon icon-dice small">Malá</span>
<span class="neon-icon icon-dice large">Velká</span>
<span class="neon-icon icon-dice xl">Extra velká</span>

<!-- Animace -->
<span class="neon-icon icon-dice pulse">Pulzuje</span>
<span class="neon-icon icon-dice spin">Rotuje</span>
<span class="neon-icon icon-dice bounce">Poskakuje</span>
<span class="neon-icon icon-dice sparkle">Jiskří</span>
```

## 📊 SCORES (components/scores.css)
```html
<!-- Skóre displeje -->
<div class="score-display">
  <div class="score-item">
    <div class="score-label">Skóre</div>
    <div class="score-value">2500</div>
  </div>
</div>

<!-- Efekty -->
<div class="score-value score-increase">Zvýšení skóre</div>
```

## 🔲 MODALS (components/modals.css)
```html
<!-- Modální okna -->
<div class="modal-overlay visible">
  <div class="modal-container">
    <div class="modal-header">
      <h2>Nadpis</h2>
    </div>
    <div class="modal-body">
      Obsah modalu
    </div>
  </div>
</div>
```

## 🎨 BARVY (utils/colors.css)
```html
<!-- Neonové barvy -->
<div class="text-neon-green">Zelený text</div>
<div class="text-neon-blue">Modrý text</div>
<div class="text-neon-orange">Oranžový text</div>
<div class="text-neon-red">Červený text</div>
```

## 📐 LAYOUT (layout/grid.css)
```html
<!-- Flex utility -->
<div class="flex flex-center">Flex vystředěný</div>
<div class="flex flex-between">Flex rozprostřený</div>

<!-- Grid utility -->
<div class="grid grid-cols-2">2 sloupce</div>
<div class="grid grid-cols-4">4 sloupce</div>
```

## 📏 SPACING (utils/spacing.css)
```html
<!-- Margin a padding -->
<div class="m-4">Margin 1rem</div>
<div class="p-8">Padding 2rem</div>
<div class="mb-2">Margin bottom 0.5rem</div>
```

---

## 🎯 JAK POUŽÍVAT:

### 1. **Jen kombinovat třídy:**
```html
<button class="btn btn-primary large">
  <span class="neon-icon icon-dice small pulse"></span>
  Velké tlačítko s animovanou kostkou
</button>
```

### 2. **V JavaScriptu přidávat/odebírat:**
```javascript
// Označit kostku jako vybranou
dice.classList.add('selected');

// Aktivovat hráče
player.classList.add('active');

// Přidat animaci
icon.classList.add('pulse');
```

### 3. **CSS proměnné pro vlastní úpravy:**
```css
/* Pokud výjimečně potřebujeme custom CSS */
.moje-specialni-trida {
  color: var(--neon-green);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

**✅ Systém je kompletní - máme hotové třídy pro všechno!**
