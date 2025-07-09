# 🎲 AI Dice Challenge - Pure Bootstrap Layout

## Přehled projektu

Modulární hra s kostkami založená na **Vite** s AI osobnostmi, která používá **výhradně Bootstrap 5.3.2** pro layout a styling. Projekt je navržen s důrazem na responsivní design, čistý kód a minimální závislosti na vlastním CSS.

## ✅ Aktuální stav - Pure Bootstrap Implementation

### Klíčové charakteristiky:
- **100% Bootstrap-first přístup** - žádné vlastní CSS pro layout
- **Responsivní design** s grid systémem Bootstrap
- **Modulární JavaScript struktura** - ES6 moduly
- **Viewport-based height management** - bez fixed heights
- **Debugging systém** pro layout monitoring

---

## 🏗️ HTML Struktura

### DOCTYPE a META tagy
```html
<!DOCTYPE html>
<html lang="cs" class="h-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover">
    <title>🎲 AI Dice Challenge - Neonová kostková výzva</title>
</head>
<body class="h-100 bg-dark text-light">
```

**Vysvětlení:**
- `html.h-100` + `body.h-100` = zajišťuje 100% výšku stránky
- `viewport-fit=cover` = podpora pro iOS notch
- `user-scalable=no` = zamezuje zoom na mobilech

### CSS Dependencies (pouze externí)
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">

<!-- Animate.css -->
<link href="https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css" rel="stylesheet">

<!-- SweetAlert2 -->
<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.min.css" rel="stylesheet">
```

### Minimální vlastní CSS (pouze pro mobilní výšky)
```css
<style>
@media (max-width: 575.98px) {
    .mobile-game-height { height: 60vh !important; }
    .mobile-chat-height { height: 40vh !important; }
}
</style>
```

---

## 🎨 Bootstrap Layout Architektura

### 1. Loading Screen
```html
<div id="loadingScreen" class="position-fixed top-0 start-0 w-100 h-100 bg-black d-flex justify-content-center align-items-center" style="z-index: 9999;">
    <div class="text-center">
        <div class="spinner-border text-success mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <h4 class="text-success">
            <i class="bi bi-dice-6-fill"></i> AI Dice Challenge
        </h4>
    </div>
</div>
```

**Bootstrap třídy použité:**
- `position-fixed top-0 start-0 w-100 h-100` = fullscreen overlay
- `bg-black` = černé pozadí
- `d-flex justify-content-center align-items-center` = centrování obsahu
- `spinner-border text-success` = Bootstrap loading spinner

### 2. Hlavní App Container
```html
<div id="app" class="container-fluid d-flex flex-column p-0 d-none vh-100 overflow-hidden">
    <div class="row g-1 flex-fill h-100 overflow-hidden">
        <!-- Columns zde -->
    </div>
</div>
```

**Bootstrap třídy vysvětleny:**
- `container-fluid` = plná šířka bez marginů
- `d-flex flex-column` = vertikální flexbox layout
- `p-0` = žádný padding
- `d-none` = skrytý při načítání (odstraněno JS)
- `vh-100` = výška 100% viewportu
- `overflow-hidden` = žádné scrollbary na hlavním kontejneru
- `row g-1` = Bootstrap grid s minimálními mezerami (0.25rem)
- `flex-fill` = zabírá zbývající prostor
- `h-100` = 100% výška

### 3. Game Area Column (2/3 šířky na desktop)
```html
<div class="col-12 col-sm-8 d-flex flex-column p-1 overflow-hidden mobile-game-height">
    <div class="flex-fill bg-dark border border-success rounded p-2 d-flex flex-column overflow-hidden h-100">
        
        <!-- Game Header -->
        <div class="text-center text-success mb-2">
            <h5><i class="bi bi-dice-6-fill"></i> Cílové skóre: 10000</h5>
        </div>
        
        <!-- Game Content - Scrollable -->
        <div id="gameArea" class="flex-fill overflow-auto bg-secondary p-2 rounded">
            <p>Game content area - scrollable</p>
            <p>Tady bude herní obsah...</p>
        </div>
        
    </div>
</div>
```

**Bootstrap třídy vysvětleny:**
- `col-12 col-sm-8` = plná šířka na mobilech, 8/12 (67%) na sm+
- `d-flex flex-column` = vertikální flexbox
- `p-1` = malý padding (0.25rem)
- `overflow-hidden` = žádné scrollbary
- `mobile-game-height` = vlastní CSS třída pro 60vh na mobilech
- `bg-dark` = tmavé pozadí
- `border border-success` = zelené ohraničení
- `rounded` = zaoblené rohy
- `text-success` = zelený text
- `overflow-auto` = scrollování uvnitř oblasti

### 4. Chat Area Column (1/3 šířky na desktop)
```html
<div class="col-12 col-sm-4 d-flex flex-column p-1 overflow-hidden mobile-chat-height">
    <div class="flex-fill bg-dark border border-info rounded p-2 d-flex flex-column overflow-hidden h-100">
        
        <!-- Chat Header -->
        <div class="text-center text-info mb-2">
            <h6><i class="bi bi-chat-dots-fill"></i> AI Chat</h6>
        </div>
        
        <!-- Chat Messages - Scrollable area -->
        <div id="chatMessages" class="flex-fill bg-secondary border-info border rounded p-2 mb-2 overflow-auto">
            <p>Chat zprávy budou zde...</p>
            <p>Scrollovatelná oblast</p>
        </div>
        
        <!-- Chat Input -->
        <div class="input-group">
            <input type="text" id="chatInput" 
                   class="form-control bg-dark text-info border-info" 
                   placeholder="Zpráva AI..." 
                   autocomplete="off">
            <button id="sendChatBtn" class="btn btn-outline-info">
                <i class="bi bi-send-fill"></i>
            </button>
        </div>
        
    </div>
</div>
```

**Bootstrap třídy vysvětleny:**
- `col-12 col-sm-4` = plná šířka na mobilech, 4/12 (33%) na sm+
- `mobile-chat-height` = vlastní CSS třída pro 40vh na mobilech
- `border-info` = modré ohraničení
- `text-info` = modrý text
- `input-group` = Bootstrap input group
- `form-control` = Bootstrap form input
- `btn btn-outline-info` = modré outline tlačítko

---

## 📱 Responsivní Design

### Breakpointy Bootstrap 5:
- **xs**: < 576px (mobily)
- **sm**: ≥ 576px (tablety na výšku)
- **md**: ≥ 768px (tablety na šířku)
- **lg**: ≥ 992px (desktop)
- **xl**: ≥ 1200px (velký desktop)
- **xxl**: ≥ 1400px (extra velký desktop)

### Layout chování:
- **Mobily (< 576px)**: Sloupce stackované, game=60vh, chat=40vh
- **Desktop (≥ 576px)**: Sloupce vedle sebe, game=67%, chat=33%

### Grid ratio:
- **Desktop poměr**: 8:4 = 2:1 (game:chat)
- **Mobile stacking**: vertikální layout s 60:40 viewport poměrem

---

## 🔧 JavaScript Modulární Struktura

### Adresářová struktura:
```
src/
├── js/
│   ├── game/           # Herní logika
│   │   ├── gameState.js
│   │   └── diceMechanics.js
│   ├── ai/             # AI osobnosti
│   │   ├── chatSystem.js
│   │   └── personalities.js
│   ├── ui/             # UI komponenty
│   │   ├── gameUI.js
│   │   ├── chatUI.js
│   │   └── autocomplete.js
│   └── utils/          # Pomocné funkce
│       ├── constants.js
│       └── helpers.js
├── styles/             # CSS moduly (vypnuté)
│   └── bootstrap-neon-minimal.css
└── main.js             # Hlavní vstupní bod
```

### Debugging systém:
```javascript
debugAppHeight(stage) {
    const app = document.getElementById('app');
    const gameCol = document.querySelector('.col-12.col-sm-8');
    const chatCol = document.querySelector('.col-12.col-sm-4');
    
    console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight);
    console.log('📊 Game:Chat ratio =', gameCol.offsetHeight / chatCol.offsetHeight);
    console.log('🔄 Has vertical scroll:', document.documentElement.scrollHeight > window.innerHeight);
}
```

---

## 🎯 Výhody Pure Bootstrap Přístupu

### ✅ Pozitiva:
1. **Žádné custom CSS** - snadná údržba
2. **Consistency** - jednotný vzhled s Bootstrap konvencemi
3. **Responsivní ze základu** - grid systém je testovaný
4. **Rychlý vývoj** - utility classes
5. **Malé bundle size** - žádné vlastní CSS
6. **Browser compatibility** - Bootstrap je testovaný
7. **Dokumentace** - vše je v Bootstrap docs

### ⚠️ Omezení:
1. **Mobilní výšky** - potřeba 6 řádků vlastního CSS
2. **Specifické animace** - omezeny na Animate.css
3. **Neonové efekty** - momentálně vypnuté
4. **Z-index** - jeden inline styl pro loading screen

---

## 🚀 Instalace a spuštění

### Požadavky:
- Node.js 18+
- npm nebo yarn

### Kroky:
```bash
# 1. Klonování z GitHubu
git clone https://github.com/username/AIDICE.git
cd AIDICE

# 2. Instalace závislostí
npm install

# 3. Spuštění dev serveru
npm run dev

# 4. Otevření v prohlížeči
# http://localhost:5173
```

### Build pro produkci:
```bash
npm run build
npm run preview
```

---

## 🔍 Testing & Debugging

### Console debugging:
1. Otevři Developer Tools (F12)
2. Přejdi na Console tab
3. Sleduj Bootstrap layout informace:
   - Viewport rozměry
   - Column výšky a poměry
   - Scrollbar detection
   - Bootstrap class detection

### Testovací scénáře:
1. **Desktop test**: Zkontroluj 2:1 poměr sloupců
2. **Mobile test**: DevTools → Toggle device toolbar
3. **Resize test**: Změna velikosti okna
4. **Overflow test**: Ověř žádné scrollbary na main container

---

## 📝 Kódovací standardy

### Bootstrap principles:
- Používej **utility classes** místo custom CSS
- Preferuj **flexbox** před float/position
- Používej **responsive breakpoints** (col-sm-, col-md-, atd.)
- Využívaj **spacing utilities** (p-, m-, g-)
- Používej **color utilities** (bg-, text-, border-)

### Naming conventions:
- **BEM-like** pro custom classes: `.mobile-game-height`
- **Bootstrap-first** - pokud existuje utility, použij ji
- **Semantic HTML** - `<main>`, `<section>`, `<aside>`

---

## 🔄 Git Workflow

### Současný stav:
- **Branch**: main
- **Status**: Pure Bootstrap implementation
- **Commit message**: "✅ Pure Bootstrap layout - working savepoint"

### Backup a stažení:
```bash
# Stažení na jiný PC
git clone https://github.com/username/AIDICE.git

# Checkout specific savepoint
git checkout main
```

---

## 📚 Dokumentace a zdroje

### Bootstrap 5.3.2 dokumentace:
- [Grid System](https://getbootstrap.com/docs/5.3/layout/grid/)
- [Flexbox Utilities](https://getbootstrap.com/docs/5.3/utilities/flex/)
- [Sizing Utilities](https://getbootstrap.com/docs/5.3/utilities/sizing/)
- [Spacing Utilities](https://getbootstrap.com/docs/5.3/utilities/spacing/)
- [Color Utilities](https://getbootstrap.com/docs/5.3/utilities/colors/)

### Externí knihovny:
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Animate.css](https://animate.style/)
- [SweetAlert2](https://sweetalert2.github.io/)

---

## 🎯 Roadmap

### Příští kroky:
1. **Aktivace neon stylů** - Bootstrap custom properties
2. **Rozšíření game mechanik** - dice rolling, scoring
3. **AI personality system** - chat responses
4. **Performance optimizace** - lazy loading
5. **PWA features** - offline support

### Možná vylepšení:
1. **Dark/Light mode** - Bootstrap color themes
2. **Accessibility** - ARIA labels, keyboard navigation
3. **Internationalization** - multiple languages
4. **Analytics** - user behavior tracking

---

**Vytvořeno:** $(date)  
**Verze:** Pure Bootstrap Layout v1.0  
**Status:** ✅ Production Ready Savepoint
