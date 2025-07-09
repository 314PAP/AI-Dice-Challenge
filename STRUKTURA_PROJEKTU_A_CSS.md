# Struktura projektu a CSS architektury

## Struktura projektu

```
AIDICE/
├── public/                     # Statické soubory dostupné z kořenového adresáře
│   ├── dice.svg                # SVG ikona kostky
│   └── ai-icons/               # Ikony pro AI osobnosti
│
├── src/                        # Zdrojový kód aplikace
│   ├── main.js                 # Hlavní vstupní bod JavaScript aplikace
│   ├── app-ultra-bootstrap.js  # Bootstrap-specifické inicializace
│   ├── styles/                 # CSS styly
│   │   ├── main.css            # Hlavní CSS soubor s importy
│   │   ├── responsive-text.css # Responzivní utility pro text
│   │   ├── components/         # CSS pro komponenty
│   │   │   ├── dice.css        # Styly pro kostky
│   │   │   └── neon-buttons.css # Styly pro neonová tlačítka
│   │   ├── overrides/          # Přepsání externích CSS
│   │   │   └── bootstrap-colors-override.css # Přepsání Bootstrap barev
│   │   ├── utils/              # Utility třídy a pomocné CSS
│   │   │   └── neon-utilities.css # Neonové utility třídy
│   │   └── variables/          # CSS proměnné
│   │       └── neon-colors.css # Definice neonových barev
│   │
│   ├── js/                     # JavaScript moduly
│   │   ├── game/               # Herní logika
│   │   ├── ai/                 # AI osobnosti a logika
│   │   ├── ui/                 # UI komponenty a handlery
│   │   └── utils/              # Pomocné funkce a konstanty
│   │
├── index.html                  # Hlavní HTML soubor
├── package.json                # Konfigurace závislostí a scriptů
└── vite.config.js              # Konfigurace Vite
```

## CSS Architektura

### Princip načítání CSS

1. **Bootstrap CSS z CDN** - načítán v `index.html`
2. **Naše vlastní CSS** - načítáno jako `/src/styles/main.css`
   - `neon-colors.css` - definice proměnných
   - `bootstrap-colors-override.css` - přepsání Bootstrap barev neonovými
   - `neon-utilities.css` - naše vlastní neonové utility třídy
   - Komponenty jako `dice.css` a `neon-buttons.css`

### Řešení konfliktu s Bootstrap barvami

Pro zajištění, že naše neonové barvy mají vždy přednost před Bootstrap barvami, používáme následující strategie:

1. **Přepsání Bootstrap barev** - soubor `bootstrap-colors-override.css` přepisuje standardní Bootstrap třídy našimi neonovými barvami
2. **Použití !important** - zajišťuje vyšší prioritu našich stylů
3. **Pořadí načítání** - náš CSS je načten po Bootstrap CSS, což zajišťuje, že naše styly mají přednost

### Používání barev v projektu

1. **CSS proměnné** - všechny barvy jsou definovány jako CSS proměnné v `neon-colors.css`
2. **Neonové utility třídy** - `text-neon-green`, `border-neon-blue`, atd. pro přímé aplikování neonových barev
3. **Bootstrap třídy** - standardní Bootstrap třídy jako `text-primary`, `bg-dark` jsou přepsány našimi neonovými barvami

## Poznámky k dalšímu vývoji

### Dokončení barevného schématu

- Ještě je potřeba finalizovat nastavení některých barev pro Bootstrap komponenty
- Zkontrolovat konzistenci barev napříč celou aplikací, zejména u:
  - Modálních oken
  - Formulářových prvků
  - Dropdown menu
  - Alertů a notifikací

### Další kroky

1. Pravidelně testovat na různých zařízeních pro zajištění responzivity
2. Udržovat kód modulární a pod 150 řádků na soubor
3. Při každé změně kontrolovat, zda jsou zachovány neonové efekty
4. Preferovat Bootstrap utility třídy místo vlastních CSS stylů
