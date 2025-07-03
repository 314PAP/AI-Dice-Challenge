# Responzivní design - plynulé přizpůsobení layoutu

## Provedené úpravy

Implementovali jsme plně responzivní design, který se **plynule přizpůsobuje** změnám velikosti obrazovky bez skokových změn. Cílem bylo zajistit konzistentní uživatelský zážitek na všech zařízeních a při různých poměrech stran obrazovky.

## Klíčové principy použitého řešení

### 1. CSS proměnné a dynamické výpočty
```css
:root {
  --base-padding: min(3vh, 1.5rem);
  --content-gap: calc(var(--base-padding) * 0.75);
}
```
- Základní hodnoty jsou definovány jako proměnné a dynamicky se mění podle velikosti obrazovky
- Používáme funkce `min()`, `max()` a `clamp()` pro plynulé změny
- Odvozené hodnoty využívají `calc()` pro výpočty závislé na základních hodnotách

### 2. Flexbox layout místo fixních výšek a šířek
```css
.container-fluid.d-block.d-md-none.mw-90.mh-90.vh-90 {
  display: flex !important;
  flex-direction: column;
}

.row.g-0.h-75 {
  flex: 3;
  min-height: 0;
}

.row.g-0.h-20 {
  flex: 1;
  min-height: 120px;
  max-height: 35vh;
}
```
- Flexbox umožňuje elementům dynamicky měnit velikost podle dostupného prostoru
- Poměr prostoru je určen pomocí `flex` vlastnosti
- Použití `min-height` a `max-height` zajišťuje použitelnost při extrémních velikostech

### 3. Relativní jednotky místo absolutních
- Používáme `vh`, `vw`, `%` místo `px` pro definování velikostí
- Responsivní typografie pomocí `clamp()`:
  ```css
  .game-title {
    font-size: clamp(1rem, 5vw, 1.5rem);
  }
  ```

### 4. Vnořené media queries pro jemné přizpůsobení
- Základní rozdělení na desktop a mobilní zobrazení
- Dodatečné úpravy pro velmi malé obrazovky

### 5. Odstranění redundantních stylů
- Odstranění duplicitních CSS pravidel
- Eliminace nadbytečných obalových elementů
- Minimální použití inline stylů

## Specifické optimalizace

### Padding a mezery
- Konzistentní padding kolem celé aplikace, který se přizpůsobuje velikosti obrazovky
- Dynamické mezery mezi elementy, které se zmenšují na menších obrazovkách

### Responzivní typografie
- Velikost písma se plynule mění podle dostupné šířky
- Větší nadpisy na větších obrazovkách, kompaktnější na menších

### Výška tlačítek a formulářových prvků
- Přizpůsobuje se výšce obrazovky
- Zachovává minimální velikost pro dobrou použitelnost na dotykovém zařízení

### Chat kontejner
- Flexibilně využívá dostupný prostor
- Zprávy zabírají maximální možnou výšku
- Vstupní pole udržuje konzistentní velikost

## Použité technologie

- **CSS Flexbox** - pro pružné rozložení elementů
- **CSS proměnné** - pro centralizovanou správu hodnot
- **Media queries** - pro specifické úpravy na různých velikostech obrazovky
- **CSS funkce** - min(), max(), clamp(), calc() pro dynamické výpočty

## Výsledek

Aplikace nyní:
1. **Plynule** se přizpůsobuje změnám velikosti okna
2. Má **konzistentní padding** ze všech stran
3. Optimálně využívá dostupný prostor
4. Udržuje dobrý poměr velikostí mezi elementy
5. Zachovává použitelnost i na extrémně malých obrazovkách

## Doporučení pro budoucí vývoj

1. Pokračovat v používání CSS proměnných pro centrální správu rozměrů a meziprostorů
2. Využívat Flexbox a Grid pro rozložení prvků
3. Testovat layout na široké škále zařízení a orientací
4. Preferovat relativní jednotky nad absolutními
5. Používat vnořené media queries pro jemné doladění
