# Struktura projektu AI Dice Game

## Přehled adresářové struktury

```
AIDICE/
├── public/                    # Statické soubory a ikony
│   ├── dice.svg               # Základní SVG ikona kostek
│   └── ai-icons/              # Ikony AI osobností
│
├── src/                       # Zdrojový kód projektu
│   ├── js/                    # JavaScript moduly
│   │   ├── ai/                # AI osobnosti a jejich logika
│   │   │   └── personalities.js # Definice AI osobností
│   │   │
│   │   ├── game/              # Herní logika, stav, mechaniky kostek
│   │   │   ├── gameState.js   # Centrální správa herního stavu
│   │   │   ├── diceManager.js # Správa kostek a hodů
│   │   │   └── scoreManager.js # Vyhodnocení skóre a pravidel
│   │   │
│   │   ├── ui/                # UI komponenty, DOM manipulace
│   │   │   ├── uiComponents.js # Komponenty pro tvorbu UI
│   │   │   ├── autocomplete.js # Autocomplete systém pro chat
│   │   │   └── animations.js  # Animace a vizuální efekty
│   │   │
│   │   └── utils/             # Pomocné funkce a konstanty
│   │       ├── constants.js   # Konstanty a enumerace
│   │       ├── colors.js      # Správa barev a jejich konverze
│   │       └── storage.js     # Ukládání a načítání dat
│   │
│   ├── styles/                # CSS moduly
│   │   ├── components/        # Styly pro komponenty
│   │   │   ├── dice.css       # Styly kostek
│   │   │   └── neon-buttons.css # Styly pro neonová tlačítka
│   │   │
│   │   ├── overrides/         # Přepsání Bootstrap CSS
│   │   │   └── bootstrap-colors-override.css  # Přepsání Bootstrap barev
│   │   │
│   │   ├── utils/             # Pomocné CSS třídy
│   │   │   └── neon-utilities.css  # Neonové utility třídy
│   │   │
│   │   ├── variables/         # CSS proměnné
│   │   │   └── neon-colors.css # Definice neonových barev
│   │   │
│   │   ├── main.css           # Hlavní CSS soubor s importy
│   │   └── responsive-text.css # Responzivní textové třídy
│   │
│   └── main.js                # Vstupní bod aplikace
│
├── index.html                 # Hlavní HTML soubor
├── vite.config.js             # Konfigurace Vite
├── package.json               # Konfigurace projektu
└── README.md                  # Dokumentace projektu
```

## Klíčové soubory a jejich role

### HTML

- `index.html` - Hlavní HTML soubor s definicí struktury aplikace, načítání CSS a JavaScript souborů

### JavaScript

- `main.js` - Vstupní bod aplikace, inicializuje herní moduly
- `game/gameState.js` - Centrální správa stavu hry, využívá návrhový vzor Observer
- `ai/personalities.js` - Definice AI osobností a jejich chování
- `ui/uiComponents.js` - Komponenty pro tvorbu UI (tlačítka, karty, apod.)

### CSS

- `styles/main.css` - Hlavní CSS soubor, importuje všechny ostatní CSS moduly
- `styles/variables/neon-colors.css` - Definice neonových barev jako CSS proměnných
- `styles/overrides/bootstrap-colors-override.css` - Přepsání Bootstrap barev
- `styles/utils/neon-utilities.css` - Neonové utility třídy (text-neon-*, border-neon-*, atd.)

## Systém modulů

Projekt je postaven na modulárním přístupu s cílem zachovat princip jedné odpovědnosti. Soubory jsou rozděleny do logických skupin podle jejich funkce:

1. **AI moduly** - Správa AI osobností a jejich chování
2. **Herní moduly** - Správa herního stavu, kostek a pravidel
3. **UI moduly** - Komponenty a manipulace s DOM
4. **Utility moduly** - Pomocné funkce, konstanty a nástroje

## Systém stylů

CSS je také organizován modulárně:

1. **Proměnné** - CSS proměnné pro barvy, stíny, přechody
2. **Overrides** - Přepsání Bootstrap tříd neonovými barvami
3. **Utility třídy** - Pomocné CSS třídy pro rychlé stylování
4. **Komponenty** - Specifické styly pro komponenty jako tlačítka, kostky, atd.

## Použité technologie

- **Vite** - Build nástroj a dev server
- **Bootstrap** - CSS framework pro základní layout a komponenty
- **JavaScript ES6+** - Moderní JavaScript s moduly
- **CSS3** - Moderní CSS s proměnnými a flexbox/grid layoutem
- **HTML5** - Sémantické HTML tagy a struktura

## Poznámky k vývoji

- Projekt striktně dodržuje princip "mobilní first" designu
- Všechny rozměry používají rem jednotky pro lepší škálovatelnost
- Bootstrap třídy jsou používány pro layout, naše vlastní třídy pro vizuální styl
- Neonový design je konzistentně aplikován napříč celou aplikací

---

Dokument vytvořen: 9. července 2025
