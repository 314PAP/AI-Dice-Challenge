# Responzivní Design Analýza

## Responzivní Breakpointy

AI Kostková Výzva používá tyto Bootstrap breakpointy:

| Breakpoint | Třída | Rozměr | Layout |
|------------|-------|--------|--------|
| Extra Small | .col-* | <576px | Stacked (vertikální) |
| Small | .col-sm-* | ≥576px | Stacked (vertikální) |
| Medium | .col-md-* | ≥768px | Stacked (vertikální) |
| Large | .col-lg-* | ≥992px | Horizontální (65:35) |
| Extra Large | .col-xl-* | ≥1200px | Horizontální (65:35) |

## Responzivní Prvky

### 1. Kontejner Aplikace
- Desktop: 90% šířky/výšky obrazovky
- Tablet: 95% šířky/výšky obrazovky
- Mobil: 98% šířky/výšky obrazovky

### 2. Rozložení Hry a Chatu
- Desktop: Horizontální layout (65% hra, 35% chat)
- Mobil: Vertikální layout (hra nad chatem)

### 3. Kostky
- Desktop: 60×60px
- Tablet: 50×50px
- Mobil: 40×40px

### 4. Avatary Hráčů
- Desktop: 4 v řadě
- Tablet: 4 v řadě
- Mobil: 2×2 (responzivní grid)

### 5. Herní Ovládací Prvky
- Desktop: Tlačítka v jedné řadě
- Mobil: Tlačítka se zalamují na více řádků

### 6. Modální Okna
- Desktop: 50% šířky
- Mobil: 95% šířky

### 7. Fonty
- Desktop: Normální velikosti
- Mobil: Zmenšené velikosti pro lepší čitelnost

## Optimalizace pro Mobilní Zařízení

1. **Touch-friendly UI**
   - Větší clickable oblasti pro dotyková zařízení
   - Přidán `gap` mezi tlačítka

2. **Výkon**
   - Optimalizované CSS
   - Využití Bootstrap CSS pouze když je potřeba

3. **Výška chatu na mobilech**
   - Dynamická výška chatu (35vh)
   - Scrollable obsah pro přetékající zprávy

4. **Modální dialogy**
   - Responzivní modální okna pomocí Bootstrap
   - Vertikálně centrované

5. **Media Queries**
   - Optimalizace pro různé velikosti obrazovek
   - Dynamické přizpůsobení prvků

## Testované rozlišení

Aplikace byla testována na těchto rozlišeních:
- Desktop (1920×1080)
- Laptop (1366×768)
- Tablet (768×1024) - portrét i krajina
- Mobil (375×667) - iPhone SE/8
- Mobil (414×896) - iPhone X+

Aplikace se správně přizpůsobuje všem těmto rozlišením bez horizontálního scrollbaru.
