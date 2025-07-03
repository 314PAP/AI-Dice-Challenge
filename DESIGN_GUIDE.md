# AIDICE - Design Guide

Tento dokument obsahuje zásady a tipy pro práci s designem a vizuálním stylem v projektu AIDICE.

## 🔄 Aktualizace: Minimalistický design

Projekt byl aktualizován na minimalistický design s následujícími principy:

1. **Bootstrap-first přístup** - Využití utility tříd Bootstrapu pro layout
2. **Oddělené herní a chatovací boxy** - Každá část má vlastní neonový rámeček
3. **Čistý vzhled chatu** - Minimalistický chat s polem vždy dole
4. **Responsivní design** - Optimalizace pro všechny velikosti obrazovek
5. **Konzistence neonových efektů** - Sjednocení vizuálního stylu

Více informací v dokumentu [MINIMALIST_LAYOUT_UPDATE.md](./MINIMALIST_LAYOUT_UPDATE.md)

## 🎨 Barevná paleta

### Základní barvy

| Barva         | HEX       | RGB           | Použití                            |
|---------------|-----------|---------------|------------------------------------|
| Černá         | `#121212` | `18, 18, 18`  | Pozadí, základní plocha            |
| Tmavě šedá    | `#1E1E1E` | `30, 30, 30`  | Panely, karty, kontejnery          |
| Středně šedá  | `#333333` | `51, 51, 51`  | Okraje, oddělovače                 |
| Světle šedá   | `#AAAAAA` | `170, 170, 170` | Neaktivní text, sekundární prvky   |
| Bílá          | `#FFFFFF` | `255, 255, 255` | Text, ikony, zvýraznění           |

### Neonové barvy

| Barva         | HEX       | RGB           | Stíny                                       |
|---------------|-----------|---------------|---------------------------------------------|
| Neon modrá    | `#00BFFF` | `0, 191, 255` | `0 0 5px #00BFFF, 0 0 10px #00BFFF`        |
| Neon růžová   | `#FF00FF` | `255, 0, 255` | `0 0 5px #FF00FF, 0 0 10px #FF00FF`        |
| Neon zelená   | `#39FF14` | `57, 255, 20` | `0 0 5px #39FF14, 0 0 10px #39FF14`        |
| Neon žlutá    | `#FFFF00` | `255, 255, 0` | `0 0 5px #FFFF00, 0 0 10px #FFFF00`        |
| Neon červená  | `#FF3131` | `255, 49, 49` | `0 0 5px #FF3131, 0 0 10px #FF3131`        |

## 📏 Typografie

### Fonty

| Font          | Použití                        | Velikosti                    |
|---------------|--------------------------------|------------------------------|
| "Orbitron"    | Nadpisy, speciální text        | 24px, 32px, 48px             |
| "Exo 2"       | Hlavní text, tlačítka          | 14px, 16px, 18px             |
| "Roboto Mono" | Kód, číselné hodnoty, skóre    | 14px, 16px                   |

### Pravidla typografie

- Minimální velikost textu: 14px
- Řádkování: 1.5
- Maximální šířka řádku: 70 znaků
- Zarovnání: Většinou vlevo, speciální prvky na střed

## 🧩 UI Komponenty

### Tlačítka

#### Primární tlačítko
```html
<button class="btn btn-primary neon-border-blue neon-text-blue neon-hover">Hlavní akce</button>
```

#### Sekundární tlačítko
```html
<button class="btn btn-outline-secondary neon-border-pink neon-text-pink neon-hover-medium">Sekundární akce</button>
```

#### Nebezpečná akce
```html
<button class="btn btn-outline-danger neon-border-red neon-text-red neon-hover-high">Smazat hru</button>
```

### Karty

#### Standardní karta
```html
<div class="card bg-dark neon-border-blue p-3 mb-4">
  <h5 class="card-title neon-text-blue">Název karty</h5>
  <p class="card-text text-light">Obsah karty...</p>
</div>
```

#### Herní panel
```html
<div class="game-panel bg-dark neon-border-green p-4">
  <div class="panel-header d-flex justify-content-between align-items-center mb-3">
    <h6 class="neon-text-green m-0">Panel title</h6>
    <button class="btn-close btn-close-white"></button>
  </div>
  <div class="panel-content">
    <!-- Obsah panelu -->
  </div>
</div>
```

### Kostky

#### Základní kostka
```html
<div class="dice dice-3 neon-border-yellow" data-value="3">
  <div class="dice-dot"></div>
  <div class="dice-dot"></div>
  <div class="dice-dot"></div>
</div>
```

#### Vybraná kostka
```html
<div class="dice dice-6 neon-border-yellow neon-glow selected" data-value="6">
  <!-- Tečky kostky -->
</div>
```

### Chat bubliny

#### Bublina hráče
```html
<div class="chat-message player-message">
  <div class="chat-bubble neon-border-blue">
    <p class="m-0">Text zprávy od hráče</p>
  </div>
  <div class="chat-avatar">
    <img src="path/to/avatar.png" alt="Player">
  </div>
</div>
```

#### Bublina AI
```html
<div class="chat-message ai-message">
  <div class="chat-avatar">
    <img src="path/to/ai-avatar.png" alt="AI">
  </div>
  <div class="chat-bubble neon-border-pink">
    <p class="m-0">Text zprávy od AI</p>
  </div>
</div>
```

## 🎭 Animace a efekty

### Neonové efekty

#### CSS vlastnosti
```css
.neon-text-blue {
  color: #00BFFF;
  text-shadow: 0 0 5px #00BFFF, 0 0 10px #00BFFF;
}

.neon-border-blue {
  border: 2px solid #00BFFF;
  box-shadow: 0 0 5px #00BFFF, 0 0 10px #00BFFF;
}

.neon-glow-blue {
  box-shadow: 0 0 5px #00BFFF, 0 0 10px #00BFFF, 0 0 15px #00BFFF;
}
```

#### Úrovně intenzity
```css
.neon-low {
  opacity: 0.7;
  filter: blur(0.5px);
}

.neon-medium {
  opacity: 0.85;
  filter: blur(0.3px);
}

.neon-high {
  opacity: 1;
  filter: blur(0px);
}

.neon-ultra {
  opacity: 1;
  filter: blur(0px);
  animation: neon-pulse 2s infinite alternate;
}
```

### Animace

#### Pulzování
```css
@keyframes neon-pulse {
  0% {
    opacity: 0.8;
    box-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
  }
  100% {
    opacity: 1;
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

.neon-pulse {
  animation: neon-pulse 2s infinite alternate;
}
```

#### Blikání
```css
@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
  20%, 24%, 55% {
    opacity: 0.5;
    box-shadow: none;
  }
}

.neon-flicker {
  animation: neon-flicker 3s infinite alternate;
}
```

#### Házení kostkou
```css
@keyframes dice-roll {
  0% {
    transform: rotateX(0) rotateY(0) rotateZ(0);
  }
  25% {
    transform: rotateX(180deg) rotateY(90deg) rotateZ(0);
  }
  50% {
    transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg);
  }
  75% {
    transform: rotateX(540deg) rotateY(270deg) rotateZ(180deg);
  }
  100% {
    transform: rotateX(720deg) rotateY(360deg) rotateZ(270deg);
  }
}

.dice-rolling {
  animation: dice-roll 0.8s ease-out;
}
```

## 📱 Responzivní design

### Breakpointy

| Název        | Šířka          | Popis                              |
|--------------|----------------|-----------------------------------|
| xs           | < 576px        | Extra malá zařízení, mobilní telefony |
| sm           | ≥ 576px        | Malá zařízení, velké telefony       |
| md           | ≥ 768px        | Střední zařízení, tablety           |
| lg           | ≥ 992px        | Velká zařízení, desktopy            |
| xl           | ≥ 1200px       | Extra velká zařízení, velké desktopy |
| xxl          | ≥ 1400px       | Velmi velká zařízení                |

### Responzivní layout

#### Mobilní zobrazení (xs, sm)
- Jediný sloupec
- Menší herní plocha
- Redukované animace
- Skrytí některých dekorativních prvků
- Kompaktnější chat

#### Tablet (md)
- Dvousloupcový layout
- Plná herní plocha
- Plné animace
- Plný chat systém

#### Desktop (lg a větší)
- Třísloupcový layout
- Maximální herní zážitek
- Pokročilé animace a efekty
- Rozšířené statistiky a informace

### Bootstrap utility třídy

```html
<!-- Responzivní kontejner -->
<div class="container-fluid">
  <div class="row">
    <!-- Menu (na malých zařízeních skryté) -->
    <div class="col-md-3 d-none d-md-block">
      <!-- Obsah menu -->
    </div>
    
    <!-- Herní plocha (na všech zařízeních) -->
    <div class="col-12 col-md-6">
      <!-- Herní obsah -->
    </div>
    
    <!-- Chat a statistiky (na malých zařízeních pod herní plochou) -->
    <div class="col-12 col-md-3 order-md-3 order-2">
      <!-- Chat a statistiky -->
    </div>
  </div>
</div>
```

## 🔄 Neonové utility třídy

### Text

| Třída              | Účel                                 |
|--------------------|--------------------------------------|
| `neon-text-blue`   | Modrý neonový text                   |
| `neon-text-pink`   | Růžový neonový text                  |
| `neon-text-green`  | Zelený neonový text                  |
| `neon-text-yellow` | Žlutý neonový text                   |
| `neon-text-red`    | Červený neonový text                 |

### Okraje

| Třída                | Účel                                 |
|----------------------|--------------------------------------|
| `neon-border-blue`   | Modrý neonový okraj                  |
| `neon-border-pink`   | Růžový neonový okraj                 |
| `neon-border-green`  | Zelený neonový okraj                 |
| `neon-border-yellow` | Žlutý neonový okraj                  |
| `neon-border-red`    | Červený neonový okraj                |

### Záře

| Třída              | Účel                                 |
|--------------------|--------------------------------------|
| `neon-glow-blue`   | Modrá neonová záře                   |
| `neon-glow-pink`   | Růžová neonová záře                  |
| `neon-glow-green`  | Zelená neonová záře                  |
| `neon-glow-yellow` | Žlutá neonová záře                   |
| `neon-glow-red`    | Červená neonová záře                 |

### Intenzita

| Třída           | Účel                                 |
|-----------------|--------------------------------------|
| `neon-low`      | Nízká intenzita efektu               |
| `neon-medium`   | Střední intenzita efektu             |
| `neon-high`     | Vysoká intenzita efektu              |
| `neon-ultra`    | Ultra vysoká intenzita s animací     |

### Animace

| Třída           | Účel                                 |
|-----------------|--------------------------------------|
| `neon-pulse`    | Pulzující neonový efekt              |
| `neon-flicker`  | Blikající neonový efekt              |
| `neon-glow`     | Postupně zesilující záře             |

## 🖼️ Ikony a assety

### Ikony

Doporučené ikony z Font Awesome nebo Bootstrap Icons:

- Kostka: `fa-dice` nebo `bi-dice-6`
- Přidání: `fa-plus` nebo `bi-plus`
- Odebrání: `fa-minus` nebo `bi-dash`
- Nastavení: `fa-cog` nebo `bi-gear`
- Nápověda: `fa-question-circle` nebo `bi-question-circle`
- Menu: `fa-bars` nebo `bi-list`
- Zpět: `fa-arrow-left` nebo `bi-arrow-left`
- Vpřed: `fa-arrow-right` nebo `bi-arrow-right`
- Ukončení: `fa-times` nebo `bi-x`

### Používání ikon

```html
<!-- Bootstrap ikony -->
<i class="bi bi-dice-6"></i>

<!-- Font Awesome -->
<i class="fas fa-dice"></i>
```

## 🎮 Herní komponenty

### Skóre panel

```html
<div class="score-panel neon-border-yellow p-3">
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="neon-text-yellow">Skóre</h6>
    <span class="score-value neon-text-yellow">1250</span>
  </div>
  <div class="progress mt-2">
    <div class="progress-bar bg-warning" role="progressbar" style="width: 65%"></div>
  </div>
</div>
```

### Herní akce

```html
<div class="game-actions d-flex justify-content-center gap-3 my-4">
  <button class="btn btn-lg neon-border-green neon-text-green">Hodit</button>
  <button class="btn btn-lg neon-border-yellow neon-text-yellow">Držet</button>
  <button class="btn btn-lg neon-border-red neon-text-red">Ukončit</button>
</div>
```

### Oznámení

```html
<div class="notification neon-border-blue neon-pulse p-3 text-center">
  <p class="neon-text-blue mb-0">Získali jste 500 bodů!</p>
</div>
```

## 📊 Grafy a vizualizace

### Sloupcový graf (použití s Chart.js)

```js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Hráč', 'AI 1', 'AI 2', 'AI 3'],
        datasets: [{
            label: 'Skóre',
            data: [1200, 950, 1100, 800],
            backgroundColor: [
                'rgba(0, 191, 255, 0.5)',
                'rgba(255, 0, 255, 0.5)',
                'rgba(57, 255, 20, 0.5)',
                'rgba(255, 49, 49, 0.5)'
            ],
            borderColor: [
                'rgba(0, 191, 255, 1)',
                'rgba(255, 0, 255, 1)',
                'rgba(57, 255, 20, 1)',
                'rgba(255, 49, 49, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    }
});
```

## 🎬 Efekty a přechody

### Modal efekty

```css
/* Efekt příjezdu modalu */
.modal.fade .modal-dialog {
  transform: scale(0.8);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal.show .modal-dialog {
  transform: scale(1);
  opacity: 1;
}

/* Neonový styl pro modaly */
.modal-content {
  background-color: rgba(30, 30, 30, 0.95);
  border: none;
}

.modal-header {
  border-bottom: 1px solid #00BFFF;
  box-shadow: 0 0 5px #00BFFF;
}

.modal-footer {
  border-top: 1px solid #00BFFF;
  box-shadow: 0 0 5px #00BFFF;
}
```

### Page transitions

```css
.page-transition {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 📝 Nejlepší postupy

1. **Konzistentnost**: Používejte konzistentně neonové barvy v celé aplikaci
2. **Čitelnost**: Vždy zajistěte dostatečný kontrast mezi textem a pozadím
3. **Nenáročnost**: Omezte animace na důležité interakce, aby nedošlo k přehlcení
4. **Responzivita**: Testujte všechny komponenty na různých velikostech obrazovky
5. **Přístupnost**: Používejte správné ARIA atributy pro lepší přístupnost
6. **Výkon**: Optimalizujte CSS animace pomocí `transform` a `opacity` vlastností
7. **Modulárnost**: Rozdělte CSS do logických modulů pro snadnou údržbu

---

## 📚 Reference a inspirace

- [Cyberpunk 2077](https://www.cyberpunk.net)
- [Tron Legacy](https://www.imdb.com/title/tt1104001/)
- [Synthwave estetika](https://en.wikipedia.org/wiki/Synthwave)
- [Neon design examples on Dribbble](https://dribbble.com/tags/neon)
- [Bootstrap dokumentace](https://getbootstrap.com/docs/)

---

Vytvořeno s ❤️ pro AIDICE projekt | © $(date +%Y)
