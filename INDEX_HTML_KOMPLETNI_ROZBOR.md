# 📄 index.html - Kompletní rozbor nastavení

## 🔧 HTML Metadata & Konfigurace

### 📱 **Viewport & Responsive**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- **Účel**: Nastavuje responzivní zobrazení na mobilních zařízeních
- **Efekt**: Zajišťuje správné škálování na všech obrazovkách

### 🎲 **Titel & Favicon**
```html
<title>🎲 AI Dice Challenge - Neonová kostková výzva</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎲</text></svg>">
```
- **Titel**: Zobrazuje se v záložce prohlížeče
- **Favicon**: 🎲 emoji jako ikona záložky (SVG data URI)

---

## 🎨 Externí CSS Knihovny (CDN)

### 1. **Bootstrap 5.3.2** - Základní framework
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
```
- **Účel**: Hlavní CSS framework pro layout, komponenty, utility třídy
- **Poskytuje**: Grid systém, flexbox, komponenty (buttons, forms), utility třídy

### 2. **Bootstrap Icons 1.11.1** - Ikony
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
```
- **Účel**: Sada ikon (dice, chat, person, robot, atd.)
- **Používá se**: `<i class="bi bi-dice-6-fill">`, `<i class="bi bi-chat-dots-fill">`

### 3. **Google Fonts - Orbitron** - Futuristický font
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
```
- **Účel**: Sci-fi font pro neonový cyberpunk design
- **Váhy**: 400 (normal), 700 (bold), 900 (black)

### 4. **Animate.css 4.1.1** - CSS animace
```html
<link href="https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css" rel="stylesheet">
```
- **Účel**: Ready-made animace (fadeIn, fadeOut, flash, bounce, atd.)
- **Používá se**: `animate__animated animate__flash`

### 5. **SweetAlert2 11.7.12** - Elegantní alerty
```html
<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.min.css" rel="stylesheet">
```
- **Účel**: Krásné modální dialogy místo alert()
- **Styly**: Pro SweetAlert2 popup design

### 6. **Vlastní CSS** - Neonové styly
```html
<link rel="stylesheet" href="/src/styles/bootstrap-first-pure.css">
```
- **Účel**: Neonové barvy, custom CSS proměnné, scrollbary
- **Bootstrap-first**: Rozšíření Bootstrap utility tříd

---

## 🏗️ HTML Struktura & Layout

### 🌟 **Body třídy**
```html
<body class="bg-black text-neon-green h-100 overflow-hidden m-0 p-0">
```
- `bg-black` - černé pozadí
- `text-neon-green` - výchozí neonově zelený text
- `h-100` - výška 100% viewport
- `overflow-hidden` - skryje scrollbary na body
- `m-0 p-0` - odstraní výchozí margin/padding

### ⏳ **Loading Screen**
```html
<div id="loadingScreen" class="position-fixed top-0 start-0 w-100 h-100 bg-black d-flex justify-content-center align-items-center loading-z-index">
```
- **Účel**: Zobrazuje se při načítání aplikace
- **Position**: Přes celou obrazovku (fixed overlay)
- **Flexbox**: Centrování spinneru a textu
- **Animace**: `animate__flash` pro blikající efekt

### 🖥️ **Desktop Layout (70/30 split)**
```html
<div class="row h-100 g-2 g-lg-3 d-none d-lg-flex">
    <div class="col-lg-8 h-100">  <!-- Game Area 70% -->
    <div class="col-lg-4 h-100">  <!-- Chat Area 30% -->
```
- **Bootstrap Grid**: `row` + `col-lg-8` + `col-lg-4`
- **Responzivní**: `d-none d-lg-flex` (pouze na desktop)
- **Gap**: `g-2 g-lg-3` (mezery mezi sloupci)
- **Výška**: `h-100` (využívá celou dostupnou výšku)

### 📱 **Mobile Layout (Stack)**
```html
<div class="d-lg-none h-100 d-flex flex-column">
    <div class="mb-2 mobile-game-area">     <!-- Game Area nahoře -->
    <div class="mobile-chat-area">          <!-- Chat Area dole -->
```
- **Zobrazení**: `d-lg-none` (pouze na mobilu/tabletu)
- **Layout**: `d-flex flex-column` (vertikální stack)
- **CSS Classes**: `mobile-game-area`, `mobile-chat-area` (custom flex)

---

## 🎮 Game Area Konfigurace

### 🎯 **Game Container**
```html
<div class="game-container h-100 border-wide-neon-green rounded-3 p-3 p-lg-4 position-relative overflow-auto bg-black">
```
- `border-wide-neon-green` - široký neonově zelený border
- `rounded-3` - zaoblené rohy (Bootstrap)
- `p-3 p-lg-4` - responzivní padding
- `position-relative` - pro absolutní pozicování child elementů
- `overflow-auto` - scrollování při přetečení

### 🎲 **Game Area Content**
```html
<div id="gameArea" class="h-100 d-flex flex-column"></div>
```
- **JavaScript target**: JS aplikace zde renderuje herní obsah
- **Flexbox**: `d-flex flex-column` pro vertikální layout
- **Full height**: `h-100` využívá celou dostupnou výšku

---

## 💬 Chat Area Konfigurace

### 🗨️ **Chat Container**
```html
<div class="chat-container h-100 border-wide-neon-blue rounded-3 p-2 p-lg-3 d-flex flex-column bg-black">
```
- `border-wide-neon-blue` - široký neonově modrý border
- `d-flex flex-column` - vertikální layout (header, messages, input)

### 📝 **Chat Messages**
```html
<div id="chatMessages" class="flex-grow-1 overflow-auto mb-2 mb-lg-3 p-2 bg-black rounded-2 border-1 border-neon-blue chat-scrollable">
```
- `flex-grow-1` - roztáhne se do dostupného prostoru
- `overflow-auto` - scrollování zpráv
- `chat-scrollable` - custom scrollbar styling

### ⌨️ **Chat Input**
```html
<div class="input-group">
    <input type="text" id="chatInput" class="form-control bg-black text-neon-blue border-neon-blue" placeholder="Napište zprávu AI..." autocomplete="off">
    <button id="sendChatBtn" class="btn btn-neon-blue">
```
- **Bootstrap Input Group**: input + button vedle sebe
- **Neonové styly**: `text-neon-blue`, `border-neon-blue`, `btn-neon-blue`
- **Autocomplete**: `autocomplete="off"` (používá custom autocomplete)

---

## 🚀 JavaScript Dependencies (CDN)

### 1. **Bootstrap JS 5.3.2**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```
- **Účel**: Bootstrap komponenty (modals, dropdowns, tooltips)
- **Bundle**: Obsahuje i Popper.js pro positioning

### 2. **SweetAlert2 JS 11.7.12**
```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.all.min.js"></script>
```
- **Účel**: JavaScript pro krásné alerty a confirmace
- **API**: `Swal.fire()`, `Swal.confirm()`, atd.

### 3. **Lodash 4.17.21**
```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
```
- **Účel**: Utility knihovna (shuffle, debounce, cloneDeep)
- **Používá se**: Pro míchání kostek, throttling, deep copy

### 4. **Ultra Bootstrap Autocomplete**
```html
<script src="src/ultra-bootstrap-autocomplete.js"></script>
```
- **Účel**: Custom autocomplete komponenta
- **Lokální soubor**: Specializovaná funkcionalita pro chat

### 5. **Main Application**
```html
<script type="module" src="/src/app-ultra-bootstrap.js"></script>
```
- **ES6 Module**: `type="module"` umožňuje import/export
- **Hlavní aplikace**: Celá herní logika a UI management

---

## 📊 Responzivní Breakpoints

### 🖥️ **Desktop (lg+: ≥992px)**
- `d-none d-lg-flex` - zobrazí desktop layout
- `col-lg-8` / `col-lg-4` - 70/30 split
- `p-lg-4`, `mb-lg-3` - větší paddings/margins

### 📱 **Mobile/Tablet (<992px)**
- `d-lg-none` - zobrazí mobilní layout
- `d-flex flex-column` - vertikální stack
- `input-group-sm` - menší input na mobilu

---

## 🎯 CSS Custom Properties (z bootstrap-first-pure.css)

Index.html načítá vlastní CSS, který definuje:
```css
:root {
    --neon-green: #00ff88;
    --neon-blue: #00ccff;
    --neon-pink: #ff0080;
    --neon-orange: #ff6600;
}
```

### 🌈 **Bootstrap Utility Extensions**
- `.text-neon-green`, `.text-neon-blue` - neonové barvy textu
- `.border-neon-*` - neonové bordery
- `.btn-neon-*` - neonová tlačítka
- `.border-wide-*` - široké bordery (3px)

---

## 🚀 Celkový Flow

1. **HTML se načte** → Bootstrap CSS nastaví základní styling
2. **Fonts se stáhnou** → Orbitron font pro sci-fi look
3. **Icons se načtou** → Bootstrap Icons pro UI elementy
4. **Animate.css** → Připraví CSS animace
5. **SweetAlert2 CSS** → Styling pro alerty
6. **Custom CSS** → Neonové barvy a rozšíření Bootstrap
7. **Body třídy** → Základní černé pozadí a neonový text
8. **Loading screen** → Zobrazí se spinner s animací
9. **App container** → Připraví responzivní layout (skrytý)
10. **Bootstrap JS** → Aktivuje Bootstrap komponenty
11. **External JS** → SweetAlert2, Lodash připraveny
12. **Autocomplete JS** → Načte custom komponentu
13. **Main App JS** → Spustí hlavní aplikaci, skryje loading

## 🎯 Výsledek

Index.html vytváří **kompletní Bootstrap-first prostředí** s:
- ✅ **100% responzivní layout** (desktop 70/30, mobil stack)
- ✅ **Neonový cyberpunk design** s custom barvami
- ✅ **Všechny potřebné knihovny** načtené z CDN
- ✅ **Modulární architektura** s jasnou separací JS
- ✅ **Modern web standards** (ES6 modules, semantic HTML)
- ✅ **Accessibility** (aria labels, semantic structure)

Je to **vstupní brána** do celé AI Dice Challenge aplikace! 🎮✨
