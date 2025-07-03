# Bootstrap Framework Implementace

## Přehled Bootstrap Komponent

V aplikaci AI Kostková Výzva jsme implementovali tyto Bootstrap komponenty:

### 1. Layout Systém
- **Container-fluid** pro pružný layout
- **Row a Col** pro responzivní grid
- **Bootstrap Breakpointy** pro různé velikosti zařízení:
  - Extra small (<576px)
  - Small (≥576px)
  - Medium (≥768px)
  - Large (≥992px)
  - Extra large (≥1200px)

### 2. Komponenty
- **Buttons** - `.btn-outline-success`, `.btn-outline-primary` atd.
- **Cards** - informační karty pro herní stavy
- **Forms** - `.form-control`, `.input-group`
- **Modal** - plně responzivní modální okna pro konec hry a síň slávy
- **Tables** - responzivní tabulky pro síň slávy

### 3. Utility Třídy
- **Display** - `.d-flex`, `.d-none`
- **Flexbox** - `.justify-content-center`, `.align-items-center`
- **Spacing** - `.m-*`, `.p-*`
- **Text** - `.text-center`, `.text-light`
- **Borders** - `.border`, `.rounded`

### 4. Pomocné Třídy
- **Text** - `.text-truncate`, `.fw-bold`
- **Shadows** - `.shadow`
- **Position** - `.position-relative`, `.position-absolute`

## Responzivní Layout

### Desktop Layout (≥992px)
- Layout v poměru 65:35 (hra:chat)
- Plná výška aplikace 90vh
- Horizontální uspořádání herní plochy a chatu

### Tablet Layout (768px-991px)
- Layout v poměru 68:32 (hra:chat)
- Horizontální uspořádání s mírně upravenou šířkou

### Mobile Layout (<768px)
- Vertikální uspořádání (hra nad chatem)
- Hra zabírá 65% výšky, chat 35% výšky
- Plná šířka obrazovky (95-98%)

### Extrémně malá zařízení (<576px)
- Optimalizované velikosti prvků
- Použití scrollbarů pro přetékající obsah
- Menší fonty a kompaktnější design

## Neonové Bootstrap Rozšíření

Pro zachování neonového vzhledu s Bootstrap komponentami jsme vytvořili:

1. **Neonové tlačítka** - `.btn-neon-success`, `.btn-neon-primary`
2. **Neonové karty** - `.card-neon`, `.card-neon-success`
3. **Neonové texty** - `.text-neon-green`, `.text-neon-blue`
4. **Neonové ohraničení** - `.border-neon-green`

Tyto třídy rozšiřují Bootstrap a umožňují zachovat jednotný neonový vzhled.

## Optimalizace Výkonu

- Použití Bootstrap utility tříd místo vlastního CSS
- Odstranění duplikovaných stylů
- Minimalizace vnořených selektorů
- Odstranění nepoužívaných CSS pravidel

## Závěr

Bootstrap framework byl úspěšně integrován do aplikace AI Kostková Výzva, přičemž byl zachován unikátní neonový vzhled. Aplikace je nyní plně responzivní a optimalizovaná pro všechny typy zařízení.
