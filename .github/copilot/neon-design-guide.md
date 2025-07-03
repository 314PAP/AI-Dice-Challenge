# Neonový design - implementační příručka

Tento dokument poskytuje detailní informace o implementaci neonového designu pro AI Dice Game s využitím Bootstrapu a CSS proměnných.

## Základní principy neonového designu

### Barevné schéma
- Používáme tmavé pozadí s neonovými akcenty
- Primární neonové barvy jsou definovány v CSS proměnných
- Každá AI osobnost má svou charakteristickou barvu

### Efekty
- Neonové záře jsou implementovány pomocí `box-shadow` a `text-shadow`
- Animace pulzování pro zvýraznění důležitých prvků
- Gradientní přechody pro tlačítka a aktivní prvky

### Konzistence
- Stejné neonové efekty napříč celou aplikací
- Konzistentní styl tlačítek, okrajů a textů
- Jednotná implementace pomocí tříd a CSS proměnných

## Implementace pomocí CSS proměnných

### Definice barev
```css
:root {
  /* Základní barvy */
  --neon-green: #0f0;
  --neon-blue: #0ff;
  --neon-pink: #f0f;
  --neon-yellow: #ff0;
  --neon-red: #f00;
  
  /* Tlumené varianty pro pozadí a přechody */
  --neon-green-dim: rgba(0, 255, 0, 0.5);
  --neon-blue-dim: rgba(0, 255, 255, 0.5);
  --neon-pink-dim: rgba(255, 0, 255, 0.5);
  
  /* Barvy pozadí */
  --bg-dark: #111;
  --bg-darker: #000;
  --bg-light-dark: #222;
}
```

### Neonové efekty
```css
.neon-text {
  text-shadow: 0 0 5px var(--neon-color), 
               0 0 10px var(--neon-color), 
               0 0 15px var(--neon-color);
}

.neon-border {
  border: 1px solid var(--neon-color);
  box-shadow: 0 0 5px var(--neon-color),
              inset 0 0 5px var(--neon-color);
}

.neon-glow {
  box-shadow: 0 0 10px var(--neon-color),
              0 0 20px var(--neon-color),
              0 0 30px var(--neon-color);
}

.neon-pulse {
  animation: neon-pulse 1.5s infinite alternate;
}

@keyframes neon-pulse {
  from {
    opacity: 1;
    text-shadow: 0 0 5px var(--neon-color), 
                0 0 10px var(--neon-color);
  }
  to {
    opacity: 0.8;
    text-shadow: 0 0 10px var(--neon-color), 
                0 0 20px var(--neon-color), 
                0 0 30px var(--neon-color);
  }
}
```

## Implementace s Bootstrapem

### Rozšíření Bootstrap komponent

#### Tlačítka
```css
/* Neonová tlačítka s Bootstrap základem */
.btn-neon-green {
  @extend .btn-dark;
  color: var(--neon-green);
  border-color: var(--neon-green);
  box-shadow: 0 0 10px var(--neon-green);
}

.btn-neon-blue {
  @extend .btn-dark;
  color: var(--neon-blue);
  border-color: var(--neon-blue);
  box-shadow: 0 0 10px var(--neon-blue);
}

/* Aktivní stav tlačítka */
.btn-neon-green:hover,
.btn-neon-green:focus {
  background-color: rgba(0, 255, 0, 0.2);
  box-shadow: 0 0 15px var(--neon-green);
}
```

#### Karty
```css
/* Neonové karty s Bootstrap základem */
.card-neon {
  @extend .card;
  background-color: var(--bg-light-dark);
  border: 1px solid var(--neon-color);
  box-shadow: 0 0 10px var(--neon-color);
}

.card-header-neon {
  @extend .card-header;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--neon-color);
  border-bottom: 1px solid var(--neon-color);
}
```

### Použití Bootstrap utility tříd s neonovými prvky

```html
<!-- Příklad neonového tlačítka s Bootstrap třídami -->
<button class="btn btn-dark border-success text-success neon-glow" 
        style="--neon-color: var(--neon-green);">
  Roll Dice
</button>

<!-- Neonový nadpis s Bootstrap třídami -->
<h2 class="text-center text-info mb-4 neon-text"
    style="--neon-color: var(--neon-blue);">
  AI Dice Challenge
</h2>

<!-- Neonový rámeček s Bootstrap třídami -->
<div class="p-3 rounded bg-dark bg-opacity-75 border neon-border mb-3"
     style="--neon-color: var(--neon-pink);">
  <p class="mb-0">Player score: 250</p>
</div>
```

## Neonové komponenty a jejich implementace

### Neonový chat
```html
<div class="card bg-dark border-0 h-100">
  <div class="card-header bg-black border-bottom neon-border" style="--neon-color: var(--ai-color);">
    <h5 class="mb-0 text-light neon-text" style="--neon-color: var(--ai-color);">
      Chat s <span id="ai-name">Neon</span>
    </h5>
  </div>
  <div class="card-body p-0 bg-opacity-50 overflow-auto" id="chat-messages">
    <!-- Zprávy -->
  </div>
  <div class="card-footer bg-black border-top neon-border" style="--neon-color: var(--ai-color);">
    <div class="input-group">
      <input type="text" class="form-control bg-dark text-light border-dark" placeholder="Napište zprávu...">
      <button class="btn btn-dark neon-border neon-text" style="--neon-color: var(--ai-color);">
        <i class="bi bi-send"></i>
      </button>
    </div>
  </div>
</div>
```

### Neonové kostky
```html
<div class="dice-container d-flex flex-wrap justify-content-center gap-3 my-4">
  <div class="dice neon-border neon-pulse bg-dark p-2 rounded" 
       style="--neon-color: var(--neon-green);" data-value="5">
    <div class="dice-inner position-relative">
      <!-- Tečky kostky -->
    </div>
  </div>
</div>
```

### Neonový scoreboard
```html
<div class="card bg-black neon-border" style="--neon-color: var(--neon-blue);">
  <div class="card-header bg-black text-light neon-text" style="--neon-color: var(--neon-blue);">
    Skóre
  </div>
  <div class="card-body p-0">
    <ul class="list-group list-group-flush">
      <li class="list-group-item bg-dark text-light d-flex justify-content-between">
        <span>Hráč</span>
        <span class="neon-text" style="--neon-color: var(--neon-green);">250</span>
      </li>
      <li class="list-group-item bg-dark text-light d-flex justify-content-between">
        <span>AI</span>
        <span class="neon-text" style="--neon-color: var(--neon-red);">180</span>
      </li>
    </ul>
  </div>
</div>
```

## Responzivní design s neonovými prvky

### Mobile-first přístup
- Zachováváme neonové efekty i na mobilních zařízeních
- Zjednodušujeme layout pro menší obrazovky
- Používáme Bootstrap breakpointy pro responzivitu

### Příklad responzivního neonového menu
```html
<!-- Responzivní neonové menu -->
<div class="d-flex flex-column flex-md-row justify-content-center gap-2 gap-md-4 mb-4">
  <button class="btn btn-dark neon-border neon-text" style="--neon-color: var(--neon-green);">
    Nová hra
  </button>
  <button class="btn btn-dark neon-border neon-text" style="--neon-color: var(--neon-blue);">
    Pravidla
  </button>
  <button class="btn btn-dark neon-border neon-text" style="--neon-color: var(--neon-pink);">
    Nastavení
  </button>
</div>
```

## Checklist pro neonový design

1. Používejte CSS proměnné pro barvy a efekty
2. Implementujte neonové efekty pomocí utility tříd
3. Kombinujte Bootstrap třídy s vlastními neonovými třídami
4. Udržujte konzistentní vzhled napříč komponentami
5. Testujte neonové efekty na různých zařízeních a v různých prohlížečích
6. Optimalizujte animace pro plynulý výkon
