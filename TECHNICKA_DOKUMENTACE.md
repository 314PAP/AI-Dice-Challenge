# AIDICE - Technická dokumentace

## Přehled architektury

AIDICE je modulární kostková hra využívající moderní webové technologie. Následující dokumentace popisuje technický základ, na kterém je aplikace postavena.

## Technologie

### Frontend
- **HTML5** - Sémantická struktura dokumentu
- **CSS3** - Stylování s využitím:
  - Bootstrap 5.3.x - Framework pro responzivní design
  - Custom utility classes - Specializované třídy pro neonové efekty
  - CSS moduly - Rozdělení CSS do logických celků
- **JavaScript (ES6+)**
  - Moduly - Import/export systém pro strukturovaný kód
  - Event-driven architecture - Komunikace pomocí událostí
  - Async/await - Asynchronní programování

### Build systém
- **Vite** - Rychlý dev server a build nástroj
- **PostCSS** - Transformace a optimalizace CSS
- **pnpm** - Efektivní správce balíčků

### Automatizace
- **GitHub Actions** - CI/CD pipeline
- **Auto-commit systém** - Průběžné sledování a potvrzování změn

## Struktura aplikace

### Adresářová struktura

```
AIDICE/
├── src/
│   ├── js/
│   │   ├── game/            # Herní logika
│   │   │   ├── state.js     # Správa herního stavu
│   │   │   ├── dice.js      # Mechanika kostek
│   │   │   ├── scoring.js   # Výpočty skóre
│   │   │   ├── players.js   # Správa hráčů
│   │   │   └── rules.js     # Herní pravidla
│   │   │
│   │   ├── ai/              # AI systém
│   │   │   ├── personalities.js   # Definice osobností AI
│   │   │   ├── strategies.js      # AI strategie
│   │   │   ├── responses.js       # Generování odpovědí
│   │   │   └── difficulty.js      # Správa obtížnosti
│   │   │
│   │   ├── ui/              # UI komponenty
│   │   │   ├── dice-ui.js   # Vizualizace kostek
│   │   │   ├── scoreboard.js # Zobrazení skóre
│   │   │   ├── chat.js      # Chat systém
│   │   │   ├── animations.js # Animace
│   │   │   └── modals.js    # Dialogová okna
│   │   │
│   │   └── utils/           # Utility funkce
│   │       ├── random.js    # Generování náhody
│   │       ├── storage.js   # Lokální úložiště
│   │       ├── analytics.js # Analytika
│   │       └── constants.js # Konstanty
│   │
│   ├── styles/              # CSS soubory
│   │   ├── main.css         # Hlavní CSS soubor
│   │   ├── layout/          # Layout styly
│   │   │   └── grid/        # Grid systém
│   │   ├── components/      # Styly komponent
│   │   ├── themes/          # Barevná schémata
│   │   └── utils/           # Utility třídy
│   │       └── neon-bootstrap-utilities.css # Neonové efekty
│   │
│   └── assets/              # Statické soubory
│       ├── images/          # Obrázky
│       ├── sounds/          # Zvuky
│       └── fonts/           # Fonty
│
├── public/                  # Veřejné statické soubory
├── .github/                 # GitHub konfigurace
│   └── workflows/           # GitHub Actions workflow
├── scripts/                 # Pomocné skripty
└── docs/                    # Dokumentace
```

## Klíčové komponenty

### Herní jádro (`src/js/game/`)

#### State Management (`state.js`)
- **Centrální správa stavu** - Singleton objekt pro udržování herního stavu
- **Události** - Emit/listen systém pro komunikaci změn stavu
- **Snapshoty** - Ukládání/načítání stavu hry

#### Kostky (`dice.js`)
- **Generování hodů** - Spravedlivé generování náhodných hodů
- **Kombinace** - Detekce speciálních kombinací (trojice, postupky...)
- **Validace** - Kontrola platnosti tahů

#### Výpočet skóre (`scoring.js`)
- **Bodovací systém** - Pravidla pro výpočet bodů
- **Kumulativní skóre** - Průběžné a celkové skóre
- **Bonus systém** - Extra body za speciální kombinace

### AI systém (`src/js/ai/`)

#### Osobnosti AI (`personalities.js`)
- **Definice osobností** - Různé charaktery AI protihráčů
- **Chování** - Parametry ovlivňující rozhodování
- **Dialogy** - Šablony odpovědí podle osobnosti

#### Strategie (`strategies.js`)
- **Rozhodovací algoritmy** - Logika pro volbu tahů
- **Risk management** - Vyvažování rizika a zisku
- **Adaptivní učení** - Přizpůsobování stylu hry protihráči

### Uživatelské rozhraní (`src/js/ui/`)

#### Vizualizace kostek (`dice-ui.js`)
- **Rendering** - Vykreslování kostek do DOM
- **Animace** - Efekty házení a otáčení
- **Interakce** - Výběr a držení kostek

#### Chat systém (`chat.js`)
- **Zobrazení zpráv** - UI pro chatovací okno
- **Generování odpovědí** - Napojení na AI systém
- **Historie** - Ukládání předchozích konverzací

#### Animace (`animations.js`)
- **CSS tranzice** - Plynulé přechody mezi stavy
- **Timing funkce** - Správné načasování animací
- **Particle systém** - Efekty pro speciální události

### CSS Architektura

#### Bootstrap rozšíření (`utils/neon-bootstrap-utilities.css`)
- **Neonové utility třídy** - `.neon-{color}`, `.neon-text-{color}`, `.neon-border-{color}`
- **Intenzita efektu** - `.neon-{intensity}` (low, medium, high, ultra)
- **Animace** - `.neon-pulse`, `.neon-flicker`, `.neon-glow`

#### Layout systém (`layout/grid/`)
- **Custom grid** - Přizpůsobený grid pro herní rozhraní
- **Responzivní breakpointy** - Optimalizace pro všechny velikosti obrazovek
- **Flexbox kontejnery** - Flexibilní rozložení komponent

## API a integrace

### Local Storage API
- **Ukládání her** - Perzistence herního stavu
- **Nastavení** - Uživatelské preference
- **Statistiky** - Sledování výkonnosti hráče

### Web Audio API
- **Zvukové efekty** - Interaktivní zvuky při akcích
- **Hudba na pozadí** - Atmosférická hudba
- **Prostorový zvuk** - Imerzivní zvukové efekty

### Fullscreen API
- **Celoobrazovkový režim** - Plné využití obrazovky
- **Orientace** - Optimalizace pro landscape/portrait

## Vývojářské nástroje

### Auto-commit systém

#### Sledování změn (`auto-commit-watcher.sh`)
```bash
# Spuštění interaktivně
./auto-commit-watcher.sh

# Spuštění na pozadí
./auto-commit-watcher.sh --background
# nebo
./start-watcher.sh
```

#### Možnosti spuštění:
- **Interaktivní režim** - Sledování v terminálu s viditelným výstupem
- **Režim na pozadí** - Běh jako background proces s logováním
- **Jednorázový commit** - Ruční spuštění `./auto-commit.sh`

### GitHub Actions

#### Workflow soubory
- **test-build.yml** - Testování buildu
- **pnpm-build.yml** - Build pomocí pnpm
- **check-lock-files.yml** - Kontrola konzistence lock souborů

#### CI/CD Pipeline
1. **Kontrola kódu** - Lint a formátování
2. **Instalace závislostí** - S využitím cache
3. **Build** - Sestavení produkční verze
4. **Testy** - Spuštění testů (pokud existují)
5. **Nasazení** - Automatické nasazení na GitHub Pages (volitelné)

## Optimalizace a výkon

### Lazy Loading
- **Rozdělení kódu** - Import komponent až když jsou potřeba
- **Dynamický import** - Načítání modulů za běhu

### Rendering optimalizace
- **Batch DOM updates** - Seskupování DOM změn
- **requestAnimationFrame** - Synchronizace s vykreslovacím cyklem
- **Web Workers** - Výpočetně náročné operace mimo hlavní vlákno

### Asset optimalizace
- **Komprese obrázků** - Optimalizované formáty (WebP)
- **SVG ikony** - Vektorové ikony pro ostrost na všech rozlišeních
- **Audio formáty** - Správné formáty pro kompatibilitu a velikost

## Zabezpečení

### Input sanitizace
- **XSS ochrana** - Escapování uživatelských vstupů
- **Validace** - Kontrola platnosti vstupů

### Zabezpečení dat
- **Enkrypce** - Šifrování citlivých dat
- **CORS nastavení** - Správné hlavičky pro zabezpečení

## Rozšiřování aplikace

### Přidání nových AI osobností
1. Definujte novou osobnost v `src/js/ai/personalities.js`
2. Přidejte odpovídající strategie v `src/js/ai/strategies.js`
3. Vytvořte sadu odpovědí v `src/js/ai/responses.js`
4. Přidejte avatar a vizuální styl v CSS

### Implementace nových herních pravidel
1. Upravte pravidla v `src/js/game/rules.js`
2. Aktualizujte scoring systém v `src/js/game/scoring.js`
3. Přizpůsobte UI komponenty v `src/js/ui/`
4. Aktualizujte dokumentaci a nápovědu

### Vytvoření nových vizuálních témat
1. Definujte nové barevné schéma v `src/styles/themes/`
2. Rozšiřte neonové utility třídy
3. Vytvořte přepínač témat v UI

## Diagnostika a ladění

### Konzolové příkazy
- `window.gameState.debug()` - Zobrazí aktuální herní stav
- `window.ai.toggleDebugMode()` - Zapne/vypne debug režim pro AI
- `window.resetGame()` - Resetuje hru do výchozího stavu

### Logování
- Úrovně logování: ERROR, WARN, INFO, DEBUG, TRACE
- Zapnutí debug módu: `localStorage.setItem('debug', 'true')`

### Performance monitoring
- Sledování FPS: `window.perfMonitor.start()`
- Měření časování: `window.perfMonitor.measure('nazev-operace')`

## Poznámky pro budoucí vývoj

### Plánované funkce
- Online multiplayer pomocí WebSockets
- Pokročilý AI systém s machine learning prvky
- Kompletní mobilní aplikace pomocí PWA

### Technické dluhy
- Refaktorovat systém událostí pro lepší typovou bezpečnost
- Optimalizovat vykreslování pro lepší výkon na mobilních zařízeních
- Zavést komplexní testovací suite

---

## Přílohy

### Užitečné příkazy

```bash
# Vývojový server
pnpm dev

# Build pro produkci
pnpm build

# Lint a formátování
pnpm lint
pnpm format

# Automatické commity
./start-watcher.sh

# Zastavení auto-commit watcheru
pkill -f auto-commit-watcher.sh
```

### Odkazy a reference

- [Bootstrap dokumentace](https://getbootstrap.com/docs/)
- [Vite dokumentace](https://vitejs.dev/guide/)
- [JavaScript MDN reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [GitHub Actions dokumentace](https://docs.github.com/en/actions)

---

Dokument byl naposledy aktualizován: $(date +"%Y-%m-%d")
