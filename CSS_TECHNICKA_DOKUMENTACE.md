# Technická dokumentace - CSS a Design

## Struktura CSS v projektu AI Kostková Výzva

### Základní soubory

Projekt nyní používá dva hlavní CSS soubory:

1. **neon-bootstrap-utilities.css**
   - Cesta: `/src/styles/utils/neon-bootstrap-utilities.css`
   - Účel: Bootstrap-kompatibilní utility třídy s neonovými efekty
   - Obsah: Rozšířené utility třídy, neonové barvy, efekty a animace

2. **minimalist-layout.css**
   - Cesta: `/src/styles/utils/minimalist-layout.css`
   - Účel: Minimalistické styly specifické pro herní komponenty
   - Obsah: Styly pro game-box, chat panel a další specifické komponenty

### Hlavní principy

#### Přístup "Bootstrap-first"
Projekt využívá primárně Bootstrap utility třídy a minimalizuje vlastní CSS. Všechny layoutové prvky jsou řešeny pomocí Bootstrap tříd jako `container-fluid`, `row`, `col-*`, `d-flex`, `justify-content-center`, atd.

#### Neonové utility třídy
Pro zachování neonového vzhledu jsou vytvořeny vlastní utility třídy rozšiřující možnosti Bootstrapu:
- `.neon-green`, `.neon-blue`, `.neon-pink`, `.neon-orange` - Neonové barvy textu
- `.border-neon-*` - Neonové rámečky
- `.shadow-neon-*` - Neonové stíny
- `.neon-pulse`, `.neon-grow`, `.neon-blink` - Neonové animace

#### Modularita
CSS je strukturován modulárně s jasným oddělením:
1. Bootstrap základ (načítán z CDN)
2. Neonové utility třídy (rozšíření Bootstrapu)
3. Specifické komponenty (minimální vlastní CSS)

### Používání v HTML

```html
<!-- Příklad použití neonových utility tříd -->
<div class="border-neon-green bg-dark-80 rounded p-3 shadow-neon">
    <h2 class="neon-text neon-pulse">Neonový nadpis</h2>
    <p class="text-light">Běžný text s tmavým pozadím</p>
    <button class="btn btn-neon neon-green">
        <i class="ri-check-line me-2"></i>Neonové tlačítko
    </button>
</div>
```

### Responsivní design

Responsivita je zajištěna kombinací Bootstrap breakpointů a vlastních úprav:

- Základní layout se mění na breakpointu `md` (768px)
- Na mobilních zařízeních se sloupce skládají pod sebe
- Chat panel má speciální úpravy pro mobilní zobrazení

```html
<!-- Příklad responsivního layoutu -->
<div class="row">
    <div class="col-12 col-md-7">
        <!-- Herní oblast (na mobilu 100%, na desktopu 70%) -->
    </div>
    <div class="col-12 col-md-5">
        <!-- Chat panel (na mobilu 100%, na desktopu 30%) -->
    </div>
</div>
```

## Rozšíření a úpravy

### Přidání nových komponent

Pro přidání nových komponent využívejte primárně Bootstrap třídy doplněné o neonové utility. Pokud je nutné přidat vlastní CSS, přidejte jej do `minimalist-layout.css` s odpovídajícím komentářem.

### Úprava barev

Všechny neonové barvy jsou definovány v CSS proměnných na začátku `neon-bootstrap-utilities.css`:

```css
:root {
  /* Základní neonové barvy */
  --neon-green: #00ff00;
  --neon-blue: #00bfff; 
  --neon-pink: #ff00ff;
  --neon-orange: #ff8800;
  
  /* RGB verze pro práci s průhledností */
  --neon-green-rgb: 0, 255, 0;
  --neon-blue-rgb: 0, 191, 255;
  --neon-pink-rgb: 255, 0, 255;
  --neon-orange-rgb: 255, 136, 0;
}
```

Pro změnu barevného schématu stačí upravit tyto proměnné.

### Testování změn

Pro testování layoutu je k dispozici `pure-bootstrap-demo.html`, který ukazuje použití všech základních komponent s čistým Bootstrap přístupem.

## Best Practices

1. **Používejte primárně utility třídy** - Pro většinu layoutových a stylistických úprav používejte Bootstrap utility třídy a neonové utility rozšíření
2. **Minimalizujte vlastní CSS** - Přidávejte vlastní CSS pouze pokud není možné dosáhnout požadovaného efektu pomocí utility tříd
3. **Modularizujte kód** - Držte související styly pohromadě a jasně je komentujte
4. **Testujte responsivitu** - Vždy testujte změny na různých velikostech obrazovky

## Příklady

### Standardní herní komponenta

```html
<div class="border-neon-green bg-dark-80 p-3 rounded shadow-neon text-center">
    <div class="mb-2">
        <img src="/ai-icons/mind.jpeg" alt="Vy" class="rounded-circle" />
    </div>
    <div class="neon-text mb-1">Vy</div>
    <div class="neon-text">Skóre: <span class="fw-bold">0</span></div>
</div>
```

### Chat zpráva

```html
<div class="mb-3">
    <div class="neon-blue small mb-1">Gemini:</div>
    <div class="bg-dark-90 p-2 rounded">
        Text zprávy zde...
    </div>
</div>
```

### Neonové tlačítko

```html
<button class="btn btn-neon neon-green">
    <i class="ri-dice-line me-2"></i>
    Hodit kostky
</button>
```

Tato dokumentace by měla poskytnout dostatečný přehled o CSS struktuře projektu a usnadnit další vývoj.
