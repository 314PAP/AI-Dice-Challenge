# Aktuální stav barev a Bootstrapu v projektu

## Řešení konfliktu barev s Bootstrapem

Vyřešili jsme problém konfliktu mezi neonovými barvami a výchozími Bootstrap barvami pomocí následujícího přístupu:

1. Vytvořili jsme soubor `bootstrap-colors-override.css`, který přepisuje standardní Bootstrap barevné třídy na neonové varianty
2. Tento soubor je načítán **po** Bootstrap CSS, ale **před** našimi vlastními neonovými utilitami
3. Díky použití `!important` a specifickým selektorům mají naše neonové barvy vždy přednost

### Implementované řešení

- ✅ Přidán nový soubor `/src/styles/overrides/bootstrap-colors-override.css`
- ✅ Upraven import v `main.css` pro správné pořadí načítání CSS
- ✅ Zachováno použití standardních Bootstrap tříd, ale s neonovým vzhledem

## Struktura projektu

```
AIDICE/
├── public/                    # Statické soubory a ikony
│   ├── dice.svg               # Základní SVG ikona kostek
│   └── ai-icons/              # Ikony AI osobností
│
├── src/                       # Zdrojový kód projektu
│   ├── js/                    # JavaScript moduly
│   │   ├── ai/                # AI osobnosti a jejich logika
│   │   ├── game/              # Herní logika, stav, mechaniky kostek
│   │   ├── ui/                # UI komponenty, DOM manipulace
│   │   └── utils/             # Pomocné funkce a konstanty
│   │
│   └── styles/                # CSS moduly
│       ├── components/        # Styly pro komponenty
│       │   ├── dice.css       # Styly kostek
│       │   └── neon-buttons.css # Styly pro neonová tlačítka
│       │
│       ├── overrides/         # Přepsání Bootstrap CSS
│       │   └── bootstrap-colors-override.css  # Přepsání Bootstrap barev
│       │
│       ├── utils/             # Pomocné CSS třídy
│       │   └── neon-utilities.css  # Neonové utility třídy
│       │
│       ├── variables/         # CSS proměnné
│       │   └── neon-colors.css # Definice neonových barev
│       │
│       ├── main.css           # Hlavní CSS soubor s importy
│       └── responsive-text.css # Responzivní textové třídy
│
├── index.html                 # Hlavní HTML soubor
└── package.json               # Konfigurace projektu
```

## Systém načítání stylů

1. Bootstrap CSS je načítán z CDN v `index.html`:
   ```html
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
   ```

2. Naše vlastní styly jsou načítány také v `index.html` (po Bootstrap CSS):
   ```html
   <link rel="stylesheet" href="/src/styles/main.css">
   ```

3. Pořadí importů v `main.css` zajišťuje správnou kaskádu CSS:
   ```css
   /* 1. Proměnné */
   @import './variables/neon-colors.css';
   
   /* 2. Bootstrap overrides */
   @import './overrides/bootstrap-colors-override.css';
   
   /* 3. Utility třídy */
   @import './utils/neon-utilities.css';
   @import './responsive-text.css';
   
   /* 4. Komponenty */
   @import './components/neon-buttons.css';
   @import './components/dice.css';
   ```

## Další kroky

### Potřebné úpravy:

1. **Doladění barev** - Je potřeba ještě zkontrolovat, zda všechny neonové barvy jsou správně aplikovány a zda někde nedochází k přepsání Bootstrapem

2. **Testování responzivity** - Ověřit, že responzivita funguje správně na všech zařízeních a orientacích

3. **Optimalizace CSS** - Zvážit další optimalizace CSS (odstranění nepoužívaných stylů, další refaktoring)

4. **Konzistence barev** - Zajistit konzistentní použití neonových barev napříč celou aplikací

### Poznámka k barvám:
Všechny neonové barvy jsou definovány v `neon-colors.css` jako CSS proměnné. Při používání barev v projektu vždy odkazujte na tyto proměnné namísto hardcoded hodnot, aby byla zachována konzistence designu.

## Popis systému barev

- **Primární barvy**: Neonové barvy definované v `neon-colors.css`
- **Utility třídy**: `.text-neon-*`, `.border-neon-*`, `.neon-glow-*` v `neon-utilities.css`
- **Bootstrap přepsání**: Standardní Bootstrap třídy (`text-primary`, `bg-success`) jsou přepsány v `bootstrap-colors-override.css`

---

Dokument vytvořen: 9. července 2025
