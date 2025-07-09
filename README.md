# 🎲 AI Dice Challenge

Modulární hra s kostkami s AI osobnostmi postavená na **Pure Bootstrap 5.3.2** layoutu.

## ✨ Klíčové funkce

- 🎯 **Pure Bootstrap** - 100% Bootstrap utility classes
- 📱 **Fully Responsive** - Mobile-first design
- 🤖 **AI Personalities** - Interaktivní chat systém  
- 🎲 **Dice Mechanics** - Pokročilá herní logika
- ⚡ **Vite** - Rychlý build systém
- 🧩 **Modular Structure** - ES6 moduly

## 🚀 Rychlý start

```bash
# Klonování
git clone https://github.com/username/AIDICE.git
cd AIDICE

# Instalace
npm install

# Spuštění
npm run dev
```

## 📱 Layout Architektura

### Desktop (≥576px):
- **Game Area**: 67% šířky (8/12 columns)
- **Chat Area**: 33% šířky (4/12 columns)
- **Poměr**: 2:1 (game:chat)

### Mobile (<576px):
- **Stacked layout**: vertikální
- **Game Area**: 60vh
- **Chat Area**: 40vh

## 🎨 Bootstrap Classes

Layout používá výhradně Bootstrap utility classes:

```html
<!-- Main Container -->
<div class="container-fluid d-flex flex-column vh-100 overflow-hidden">
  <div class="row g-1 flex-fill h-100 overflow-hidden">
    
    <!-- Game Area -->
    <div class="col-12 col-sm-8 d-flex flex-column overflow-hidden">
      <div class="flex-fill bg-dark border border-success rounded p-2">
        <!-- Game content -->
      </div>
    </div>
    
    <!-- Chat Area -->
    <div class="col-12 col-sm-4 d-flex flex-column overflow-hidden">
      <div class="flex-fill bg-dark border border-info rounded p-2">
        <!-- Chat content -->
      </div>
    </div>
    
  </div>
</div>
```

## 📚 Dokumentace

Kompletní dokumentace včetně Bootstrap architektury: [`BOOTSTRAP_PURE_LAYOUT_DOKUMENTACE.md`](./BOOTSTRAP_PURE_LAYOUT_DOKUMENTACE.md)

## 🔧 Tech Stack

- **Frontend**: HTML5, ES6+ JavaScript
- **Styling**: Bootstrap 5.3.2, Bootstrap Icons
- **Build**: Vite 5+
- **Libraries**: Animate.css, SweetAlert2, Lodash
- **Fonts**: Google Fonts (Orbitron)

## 📁 Struktura projektu

```
src/
├── js/
│   ├── game/           # Herní logika
│   ├── ai/             # AI systém
│   ├── ui/             # UI komponenty
│   └── utils/          # Pomocné funkce
├── styles/             # CSS (momentálně vypnuto)
└── main.js             # Vstupní bod
```

## 🎯 Výhody Pure Bootstrap

- ✅ **Žádné custom CSS** - snadná údržba
- ✅ **Responsivní ze základu** - testovaný grid systém  
- ✅ **Rychlý vývoj** - utility classes
- ✅ **Browser compatibility** - Bootstrap je kompatibilní
- ✅ **Malé bundle size** - žádné vlastní CSS
- ✅ **Konzistentní design** - Bootstrap konvence

## 🔍 Debugging

Console debugging pro layout monitoring:
- Viewport rozměry
- Column výšky a poměry  
- Scrollbar detection
- Bootstrap class detection

Otevři DevTools (F12) → Console pro detaily.

## 📱 Testování

1. **Desktop**: Ověř 2:1 poměr sloupců
2. **Mobile**: DevTools → Device toolbar
3. **Resize**: Změna velikosti okna
4. **Overflow**: Žádné scrollbary na main container

## 📄 Licence

MIT License - viz [LICENSE](./LICENSE)

---

**Status**: ✅ Production Ready Bootstrap Layout  
**Verze**: Pure Bootstrap v1.0  
**Poslední update**: July 9, 2025

