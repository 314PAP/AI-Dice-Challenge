# 🎯 Jednotná šířka tlačítek menu - Bootstrap-first řešení

## Provedené změny

### 🎯 Cíl
Zajistit, aby všechna tlačítka v menu měla stejnou šířku jako nejdelší tlačítko "Opustit hru".

### ✅ Bootstrap-first implementace

#### 1. HTML úpravy
```html
<!-- PŘED -->
<button class="btn btn-neon menu-btn w-auto ...">

<!-- PO -->
<button class="btn btn-neon menu-btn menu-btn-uniform ...">
```

#### 2. CSS utility třída
```css
/* Menu tlačítka utility třídy */
.menu-btn-uniform {
  width: 200px !important; /* Jednotná šířka podle nejdelšího tlačítka */
  min-width: 200px !important;
  max-width: 200px !important;
}

@media (max-width: 767.98px) {
  .menu-btn-uniform {
    width: 180px !important;
    min-width: 180px !important;
    max-width: 180px !important;
  }
}

@media (max-width: 575.98px) {
  .menu-btn-uniform {
    width: 160px !important;
    min-width: 160px !important;
    max-width: 160px !important;
  }
}
```

### 📐 Rozměry tlačítek

| Zařízení | Šířka | Důvod |
|----------|-------|-------|
| Desktop (≥768px) | 200px | Optimální pro "Opustit hru" + padding |
| Tablet (≥576px) | 180px | Přizpůsobeno menší obrazovce |
| Mobil (<576px) | 160px | Maximální využití prostoru |

### 🔧 Výhody Bootstrap-first řešení

1. **Responzivní design** - automatické přizpůsobení velikosti
2. **Čistý HTML** - žádné hacky s neviditelnými znaky
3. **Udržovatelnost** - změny pouze v CSS
4. **Konzistence** - všechna tlačítka mají přesně stejnou šířku
5. **Accessibility** - neovlivňuje čtečky obrazovky

### 📁 Upravené soubory

1. **`src/templates/game-menu.html`**
   - Změna `w-auto` → `menu-btn-uniform`
   - Aplikováno na všechna tlačítka

2. **`src/templates/game-menu-mobile.html`**
   - Změna `w-auto mw-100` → `menu-btn-uniform`
   - Aplikováno na všechna tlačítka

3. **`src/styles/components/bootstrap-responsive.css`**
   - Přidána utility třída `.menu-btn-uniform`
   - Responzivní breakpointy pro různé velikosti

### 🎨 Zachované funkce

- ✅ Neonové efekty beze změny
- ✅ Responzivní padding a font-size
- ✅ Animace a transitions
- ✅ Barevné schéma
- ✅ Ikony a text-nowrap

### 🧪 Testování

**Před změnami:**
- Tlačítka různé šířky podle textu
- "Opustit hru" nejdelší
- "Pravidla" nejkratší

**Po změnách:**
- Všechna tlačítka stejná šířka
- Responzivní přizpůsobení
- Text centrovaný v tlačítku

### 🔄 Alternativní řešení

Pokud byste přece jen preferovali původní návrh s neviditelnými znaky (`&nbsp;`), dokumentace je v `ALTERNATIVNI_RESENI_TLACITKA.md`.

---

**✨ Výsledek: Všechna tlačítka mají nyní jednotnou šířku podle Bootstrap-first principů!**
