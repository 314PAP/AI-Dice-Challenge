# 📱 Responzivní design a mobilní optimalizace

## Základní principy responzivity

Projekt AI Dice Challenge využívá Mobile-First přístup k responzivnímu designu. To znamená, že základní styly jsou navrženy pro mobilní zařízení a poté rozšířeny pro větší obrazovky pomocí media queries.

## Bootstrap Breakpointy

Dodržujeme standardní Bootstrap breakpointy:

- **xs**: < 576px (mobilní telefony)
- **sm**: >= 576px (telefony v landscape orientaci)
- **md**: >= 768px (tablety)
- **lg**: >= 992px (desktopy)
- **xl**: >= 1200px (velké desktopy)
- **xxl**: >= 1400px (extra velké desktopy)

## Landscape optimalizace

### Detekce landscape režimu

Používáme CSS media query `(orientation: landscape)` v kombinaci s detekcí maximální výšky pro identifikaci mobilních zařízení v landscape režimu:

```css
@media (orientation: landscape) and (max-height: 600px) {
  /* Landscape optimalizace */
}
```

### Úpravy layoutu

V landscape režimu automaticky upravujeme layout:

1. Rozdělení obrazovky na dva sloupce (herní plocha a chat)
2. Zmenšení fontů a mezer mezi prvky
3. Optimalizace velikosti tlačítek a interaktivních prvků
4. Zajištění správného scrollování obsahu

### Optimalizace UI komponent

#### Tlačítka

```css
@media (orientation: landscape) and (max-height: 500px) {
  .btn-neon, .btn.btn-neon {
    padding: 0.25rem 0.5rem !important;
    font-size: 0.8rem !important;
    border-width: 1px !important;
  }
}
```

#### Kostky

```css
@media (orientation: landscape) and (max-height: 500px) {
  .dice {
    width: 35px !important;
    height: 35px !important;
    border-width: 1px !important;
    margin: 0.25rem !important;
  }
}
```

### Optimalizace herního rozhraní

Pro herní obrazovku v landscape režimu:

1. Kompaktnější informační panel
2. Upravený systém zobrazení kostek
3. Tlačítka akce zobrazená vedle sebe místo pod sebou
4. Skrytí nepotřebných elementů pro úsporu místa

## Responsivní utility třídy

Pro snadnější správu responzivity jsme vytvořili vlastní utility třídy:

- `.landscape-flex-row` - Změna flex-direction na row v landscape
- `.landscape-w-50` - Nastavení šířky na 50% v landscape
- `.landscape-py-1` - Zmenšení paddingu v landscape
- `.d-landscape-none` - Skrytí elementu v landscape
- `.d-landscape-block` - Zobrazení elementu jako block v landscape

## Testování responsivity

Aplikace byla testována na různých zařízeních a emulátorech:

1. **Mobilní telefony**: iPhone SE, iPhone 12, Samsung Galaxy S21
2. **Tablety**: iPad Mini, iPad Pro
3. **Desktopy**: různé rozlišení od 1024x768 až po 1920x1080
4. **Orientace**: portrait i landscape režimy

## Techniky pro zajištění responzivity

### Flexbox layout

Využití flexboxu pro dynamické rozvržení prvků:

```css
.container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
```

### CSS Grid

Pro komplexnější layouty využíváme CSS Grid:

```css
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}
```

### Fluid Typography

Využití calc() a vw jednotek pro responzivní velikost textu:

```css
.fs-fluid-1 {
  font-size: calc(1.2rem + 1vw);
}
```

### Bootstrap Grid System

Primární využití Bootstrap grid systému pro základní layout:

```html
<div class="row">
  <div class="col-12 col-lg-8">Game Area</div>
  <div class="col-12 col-lg-4">Chat Area</div>
</div>
```

## Mobilní optimalizace

### Touch-friendly UI

- Větší touch targety pro mobilní zařízení (min. 44px)
- Jasná vizuální zpětná vazba při interakci
- Optimalizovaný chat systém pro mobilní klávesnici

### Performance optimalizace

- Lazy-loading nekritických komponent
- Optimalizované animace pro mobilní zařízení
- Redukce zbytečných re-renderů a výpočtů
