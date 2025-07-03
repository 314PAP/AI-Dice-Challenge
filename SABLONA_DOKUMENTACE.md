# AIDICE - Šablona pro vývoj her

Tato dokumentace shrnuje všechny funkce a možnosti projektu AIDICE, který může sloužit jako šablona pro vývoj dalších her.

## 🎮 Přehled projektu

AIDICE je modulární Vite-based hra s kostkami s AI osobnostmi. Projekt je strukturován tak, aby byl snadno rozšiřitelný a udržovatelný. Používá moderní technologie a postupy:

- **Frontend**: HTML, CSS, JavaScript (ES6+)
- **Styly**: Bootstrap s vlastními neonovými utility třídami
- **Build systém**: Vite
- **Balíčkový manažer**: pnpm
- **Automatizace**: GitHub Actions, auto-commit skripty

## 📂 Struktura projektu

```
src/
├── js/
│   ├── game/       # Hlavní herní logika, správa stavu, mechaniky kostek
│   ├── ai/         # AI osobnosti, chatovací odpovědi, reakce
│   ├── ui/         # DOM manipulace, ovladače událostí, animace
│   └── utils/      # Pomocné funkce, helpery, konstanty
├── styles/         # CSS moduly a styly
│   ├── layout/     # Rozložení a struktura
│   │   └── grid/   # Grid systém a layout komponenty
│   ├── components/ # Styly pro jednotlivé komponenty
│   ├── themes/     # Barevná schémata a motivy
│   └── utils/      # Utility třídy a pomocné styly
└── assets/         # Obrázky, zvuky, fonty
```

## 🎲 Herní funkce

### Základní herní mechaniky
- **Házení kostkami** - Animované házení více kostkami
- **Výpočet skóre** - Komplexní pravidla pro výpočet bodů
- **Střídání tahů** - Systém pro střídání hráčů a AI
- **Farklování** - Implementace pravidel hry Farkle
- **Ukládání her** - Možnost uložit a načíst rozehrané hry

### AI systém
- **Různé osobnosti** - Každá AI má vlastní osobnost a chování
- **Adaptivní obtížnost** - AI se přizpůsobuje úrovni hráče
- **Chatovací systém** - Kontextové odpovědi a interakce
- **Reakce na události** - AI reaguje na herní události
- **Strategie** - Různé úrovně strategického myšlení AI

### Uživatelské rozhraní
- **Responzivní design** - Přizpůsobení všem velikostem obrazovky
- **Animace** - Plynulé animace pro lepší herní zážitek
- **Neonový design** - Unikátní vizuální styl s neonovými efekty
- **Darkmode** - Podpora světlého i tmavého režimu
- **Zvukové efekty** - Interaktivní zvukový doprovod
- **Fullscreen mód** - Možnost hraní na celou obrazovku

## 🛠️ Technické funkce

### Modulární architektura
- **ES6+ moduly** - Strukturovaný kód s import/export syntaxí
- **Oddělení zájmů** - Jasné oddělení herní logiky, UI a dat
- **Event-driven design** - Komunikace přes události pro lepší decoupling
- **State management** - Centrální správa herního stavu

### CSS framework
- **Bootstrap základ** - Využití Bootstrap utility tříd
- **Vlastní utility třídy** - Rozšíření o neonové a herní styly
- **Modularizované CSS** - Rozdělení do logických částí
- **Responzivní komponenty** - Mobile-first přístup

### Vývojářské nástroje
- **Auto-commit systém** - Automatické potvrzování změn
  - Interaktivní nebo na pozadí
  - Sledování změn v reálném čase
  - Logování commitů
- **GitHub Actions** - Automatizace testování a nasazení
- **ESLint** - Kontrola kvality kódu
- **Prettier** - Formátování kódu

## 🚀 Jak používat jako šablonu

### Klonování a nastavení
1. Naklonujte repozitář: `git clone https://github.com/yourusername/AIDICE.git nova-hra`
2. Přejděte do adresáře: `cd nova-hra`
3. Nainstalujte závislosti: `pnpm install`
4. Spusťte vývojový server: `pnpm dev`

### Přizpůsobení herní logiky
1. Upravte pravidla hry v `src/js/game/rules.js`
2. Přizpůsobte herní mechaniky v `src/js/game/mechanics.js`
3. Upravte AI chování v `src/js/ai/personalities.js`

### Přizpůsobení vzhledu
1. Upravte barevné schéma v `src/styles/themes/`
2. Přizpůsobte komponenty v `src/styles/components/`
3. Upravte rozložení v `src/styles/layout/`

### Využití auto-commit systému
1. Spusťte interaktivně: `./auto-commit-watcher.sh`
2. Nebo na pozadí: `./start-watcher.sh`
3. Sledujte výstup v `auto-commit-watcher.log`

## 📋 Doporučené postupy

### Kódování
- Používejte ES6+ syntaxi
- Preferujte const/let místo var
- Používejte popisné názvy funkcí a proměnných
- Přidávejte JSDoc komentáře pro složité funkce
- Udržujte funkce zaměřené na jednu odpovědnost

### Styly
- Používejte Bootstrap utility třídy pro běžné styly
- Vytvořte vlastní utility třídy pro specifické potřeby
- Udržujte konzistentní nomenklatura tříd
- Minimalizujte přepisování Bootstrap stylů

### Git
- Používejte auto-commit pro průběžné sledování změn
- Pravidelně vytvářejte význačné commity s popisnými zprávami
- Využívejte větve pro nové funkce

## 🔧 Nástroje a skripty

### Auto-commit systém
- `auto-commit-watcher.sh` - Sledování a automatické potvrzování změn
  - Interaktivní režim: `./auto-commit-watcher.sh`
  - Tichý režim na pozadí: `./auto-commit-watcher.sh --background` nebo `./auto-commit-watcher.sh -b`
- `start-watcher.sh` - Jednoduchý spouštěč pro auto-commit na pozadí
- `auto-commit.sh` - Skript pro provedení samotného commitu

### Pomocné skripty
- `cleanup-project.sh` - Vyčistí projekt od nepotřebných souborů
- `bootstrap-refactor.sh` - Pomáhá s refaktoringem na Bootstrap
- `final-cleanup.sh` - Závěrečné čištění před odevzdáním

## 📝 GitHub Actions

Projekt obsahuje následující workflow soubory:

- `test-build.yml` - Testuje build projektu
- `pnpm-build.yml` - Specializovaný build pro pnpm
- `check-lock-files.yml` - Kontroluje konzistenci lock souborů

## 🎯 Budoucí rozvoj

Možné směry dalšího rozvoje šablony:

1. **Online multiplayer** - Implementace síťové hry
2. **Více herních módů** - Rozšíření o další varianty hry
3. **Achievement systém** - Sledování úspěchů hráče
4. **Lokalizace** - Podpora více jazyků
5. **PWA podpora** - Instalovatelná webová aplikace
6. **Grafické efekty** - Rozšíření animací a vizuálních efektů

## 📚 Další dokumentace

Další dokumentace je k dispozici v následujících souborech:

- `DOKUMENTACE.md` - Hlavní dokumentační soubor
- `CLEANUP_PLAN.md` - Plán čištění projektu
- `BOOTSTRAP_REFACTOR_GUIDE.md` - Průvodce refaktoringem na Bootstrap
- `OPTIMIZATION_PLAN.md` - Plán optimalizace projektu

---

Vytvořeno s ❤️ a pomocí GitHub Copilot | © $(date +%Y)
