# Bootstrap CSS Přepsání a Struktura Projektu

## Řešení konfliktu Bootstrap barev s neonovým designem

Pro zajištění, že naše vlastní neonové barvy mají vždy přednost před výchozími Bootstrap barvami, byl implementován systém přepsání Bootstrap tříd. Tento systém využívá CSS !important deklarace pro přepsání původních Bootstrap barevných tříd neonovými variantami.

### Postup implementace

1. Byl vytvořen soubor `src/styles/overrides/bootstrap-colors-override.css`, který přepisuje standardní Bootstrap třídy:
   - `.text-primary`, `.text-secondary`, atd. pro textové barvy
   - `.bg-primary`, `.bg-secondary`, atd. pro barvy pozadí
   - `.border-primary`, `.border-secondary`, atd. pro barvy ohraničení
   - `.btn-primary`, `.btn-secondary`, atd. pro barvy tlačítek

2. V souboru `src/styles/main.css` byl přidán import tohoto přepsání v následujícím pořadí:
   - Nejprve jsou načteny proměnné z `neon-colors.css`
   - Potom přepsání Bootstrap barev z `bootstrap-colors-override.css`
   - Nakonec vlastní neonové utility z `neon-utilities.css`

3. V `index.html` je již správně nastaveno pořadí načítání CSS:
   - Bootstrap CSS z CDN
   - Další externí knihovny
   - Naše vlastní styly z `main.css`

### Aktuální stav

- Layout prvků je řízen Bootstrap třídami
- Barvy jsou řízeny neonovými přepsáními
- Všechny barvy jsou definovány jako CSS proměnné v `neon-colors.css`
- Tento systém umožňuje používat standardní Bootstrap třídy s neonovým vzhledem

## Struktura projektu

```
AIDICE/
├── public/                 # Veřejné statické soubory
│   ├── dice.svg           # Ikona kostky
│   └── ai-icons/          # Ikony AI osobností
├── src/                    # Zdrojové kódy
│   ├── js/                # JavaScript moduly
│   │   ├── game/          # Herní logika
│   │   │   └── gameState.js  # Správa stavu hry
│   │   ├── ai/            # AI osobnosti
│   │   │   └── personalities.js  # Definice AI osobností
│   │   ├── ui/            # UI manipulace
│   │   │   ├── uiComponents.js  # UI komponenty
│   │   │   └── autocomplete.js  # Automatické doplňování v chatu
│   │   └── utils/         # Pomocné funkce
│   │       ├── constants.js  # Konstanty aplikace
│   │       └── colors.js  # Sdílené barevné konstanty
│   ├── styles/            # CSS moduly
│   │   ├── variables/     # CSS proměnné
│   │   │   └── neon-colors.css  # Definice neonových barev
│   │   ├── overrides/     # Přepsání knihoven
│   │   │   └── bootstrap-colors-override.css  # Přepsání Bootstrap barev
│   │   ├── utils/         # Utility třídy
│   │   │   └── neon-utilities.css  # Neonové utility třídy
│   │   ├── components/    # Komponenty
│   │   │   ├── neon-buttons.css  # Neonová tlačítka
│   │   │   └── dice.css  # Styl kostek
│   │   ├── responsive-text.css  # Responzivní text
│   │   └── main.css      # Hlavní CSS soubor
│   └── main.js           # Hlavní JavaScript soubor
├── index.html             # Hlavní HTML soubor
├── vite.config.js         # Konfigurace Vite
├── package.json           # NPM konfigurace
└── README.md              # Dokumentace projektu
```

## Poznámky k implementaci

### Všeobecný postup

1. Pro komponenty používáme primárně Bootstrap třídy pro layout
2. Pro barvy a efekty používáme neonové přepsání a utility třídy
3. Všechny vlastní CSS třídy jsou důsledně označeny prefixem `neon-` (např. `neon-glow-green`)
4. Standardní Bootstrap třídy (např. `text-primary`) jsou přepsány pomocí neonových barev

### TODO

- Je potřeba ještě doladit některé barevné kombinace pro lepší kontrast a čitelnost
- Ověřit, že všechny neonové barvy jsou správně aplikovány na všechny Bootstrap komponenty
- Pokračovat v optimalizaci pro mobilní zařízení, zejména pro landscape orientaci

### Git a správa souborů

- Byl upraven `.gitignore`, aby nezahrnoval pouze dokumentaci Bootstrap (`bootstrap-4.0.0*`), ale umožnil zpracování našich vlastních souborů `bootstrap-colors-override.css`
- Pro commit změn je vhodné použít popis "Implementace přepsání Bootstrap barev neonovými a aktualizace dokumentace"

## Závěr

Tento systém poskytuje elegantní způsob kombinování Bootstrap layoutu s neonovým designem. Umožňuje nám využít výhody Bootstrap mřížky a komponent, zatímco si zachováváme jedinečný neonový vzhled.

Všechny budoucí úpravy by měly respektovat tuto strukturu a používat CSS proměnné místo hardcoded hodnot pro zachování konzistence designu.
