# 📱 Mobilní Layout Optimalizace - Bootstrap-first Přístup

## Provedené změny - Chat 40% výšky, Menu zbytek

### 🎯 Cíl
Upravit mobilní layout tak, aby chat zabíral odspodu max 40% výšky obrazovky a menu zbytek (v mobilním zobrazení), s využitím Bootstrap-first přístupu.

### ✅ Implementované změny

#### 1. HTML struktura (index.html)
```html
<!-- PŘED -->
<div class="h-75 h-landscape-100">  <!-- Menu 75% výšky -->
<div class="h-20 h-landscape-100">  <!-- Chat 20% výšky -->

<!-- PO -->
<div class="flex-grow-1 mb-3 mb-landscape-0 h-landscape-100">  <!-- Menu - flex-grow zabere zbytek -->
<div class="h-40 h-landscape-100 flex-shrink-0">  <!-- Chat - max 40% výšky -->
```

#### 2. CSS utility třídy (bootstrap-responsive.css)
```css
/* PŘIDÁNO */
.h-40 {
  height: 40% !important; /* Chat - max 40% výšky obrazovky */
  max-height: 40vh; /* Zajistit max 40% viewport height */
}

/* ODSTRANĚNO */
.h-20 {
  height: 20% !important; /* Stará třída */
}
```

#### 3. Bootstrap-first principy
- **flex-grow-1**: Menu automaticky zabere zbývající prostor
- **flex-shrink-0**: Chat se nezmensí pod 40% výšky
- **h-40**: Chat přesně 40% výšky obrazovky
- **max-height: 40vh**: Zajištění max 40% viewport height

#### 4. Mobilní optimalizace
```css
@media (max-width: 767.98px) {
  .mobile-landscape-flex-row {
    gap: 0.5rem; /* Menší mezera pro lepší využití prostoru */
  }
  
  .h-40 {
    max-height: calc(40vh - 0.5rem); /* Odečtení gap */
  }
}
```

#### 5. Landscape orientace
```css
@media (max-width: 767.98px) and (orientation: landscape) {
  .h-40 {
    height: 100% !important;
    max-height: none !important;
    width: 40% !important; /* V landscape 40% šířky */
    max-width: 40% !important;
  }
}
```

### 📊 Rozdělení prostoru

#### Portrait (na výšku)
- **Menu**: `flex-grow-1` (automaticky ~60% nebo více)
- **Chat**: `h-40` (přesně 40% výšky)
- **Gap**: `0.5rem` (mezera mezi komponenty)

#### Landscape (na šířku)
- **Menu**: `flex-grow-1` (automaticky ~60% šířky)
- **Chat**: `width: 40%` (přesně 40% šířky)
- **Gap**: `0.75rem` (mezera mezi komponenty)

### 🔧 Bootstrap-first principy použité
1. **Flex utilities**: `flex-grow-1`, `flex-shrink-0`
2. **Responsive utilities**: `d-flex`, `flex-column`
3. **Spacing utilities**: `mb-3`, `mb-landscape-0`
4. **Custom height utilities**: `h-40` (rozšíření Bootstrapu)
5. **Viewport units**: `40vh` pro přesnou kontrolu výšky

### 🧹 Úklid
- Archivace testovacích HTML souborů se starými třídami
- Odstranění starých CSS definic (`.h-20`)
- Optimalizace gap a margin hodnot
- Zjednodušení media queries

### 🎨 Zachované neonové efekty
- Všechny neonové efekty zůstávají beze změny
- Barvy a animace nedotčeny
- Pouze layout optimalizace

### 📝 Výsledek
- Chat má přesně max 40% výšky obrazovky v mobilním zobrazení
- Menu automaticky zabere zbývající prostor
- Responzivní pro portrait i landscape orientaci
- Čistý Bootstrap-first kód bez !important přepisů
- Optimální využití prostoru na mobilních zařízeních

---
*Změny provedeny podle BOOTSTRAP_FIRST_PROMPT.md pravidel*
