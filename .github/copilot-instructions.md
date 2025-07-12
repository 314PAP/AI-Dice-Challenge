<!-- AUTOMATICKY GENEROVANÉ INSTRUKCE Z KOMPLETNI_DOKUMENTACE_SYSTEMU.md -->
<!-- Datum generování: 11. července 2025 -->

# 🎲 AI Dice Challenge - Copilot Instructions

**⚠️ DŮLEŽITÉ**: Tyto instrukce jsou automaticky synchronizované s `KOMPLETNI_DOKUMENTACE_SYSTEMU.md`

## 🎯 AKTUÁLNÍ STAV PROJEKTU

### 📖 BOOTSTRAP DOKUMENTACE

**⚠️ VŽDY POUŽÍVEJ BOOTSTRAP DOKUMENTACI:**

- **Lokální dokumentace**: `dokumentybtrap/` - kompletní Bootstrap 5 reference
- **Klíčové soubory**:
  - `dokumentybtrap/grid.md` - Grid systém
  - `dokumentybtrap/colors.md` - Barevný systém
  - `dokumentybtrap/utilities-for-layout.md` - Layout utility
  - `dokumentybtrap/spacing.md` - Spacing utility
  - `dokumentybtrap/buttons.md` - Tlačítka
  - `dokumentybtrap/forms.md` - Formuláře
- **Před každou CSS změnou**: VŽDY zkontroluj dokumentaci v `dokumentybtrap/`

### 🚨 KRITICKÁ PRAVIDLA (NIKDY NEPORUŠUJ!)

**CSS & STYLING:**

- ❌ **ZAKÁZÁNY inline styly** - `style="..."` NIKDY!
- ❌ **ZAKÁZÁNO vlastní CSS** - pouze Bootstrap + naše neon-\* třídy
- ✅ **POUŽÍVEJ naše CSS třídy** z `src/styles/colors-bootstrap-simple.css`
- ✅ **ANIMACE z knihoven** - preferuj CSS animace z existing knihoven

**KOMPLEXNOST KÓDU:**

- ❌ **MAX 3000 řádků JS** - pro hru kostek je 4652 řádků PŘÍLIŠ!
- ✅ **POUŽÍVEJ JS knihovny** místo vlastního kódu (lodash, ramda, atd.)
- ✅ **LOGICKÉ A JEDNODUCHÉ** - žádný 3D render, jen kostky!
- ✅ **REFAKTORUJ** dlouhé funkce na kratší moduly

**POSTUP PŘI KAŽDÉ ZMĚNĚ:**

1. **ZKONTROLUJ** `dokumentybtrap/[component].md`
2. **POUŽIJ** Bootstrap utility třídy
3. **POKUD** Bootstrap nemá → použij naše neon-\* třídy
4. **JAKO POSLEDNÍ** → vlastní CSS (minimálně)
5. **POUŽIJ KNIHOVNY** místo vlastních implementací

**SAMOKONTROLA:**

- Před každým commitom zkontroluj: "Používám inline styly?" → OPRAV
- Před každou animací zkontroluj: "Existuje v CSS knihovně?" → POUŽIJ
- Před psaním kódu zkontroluj: "Existuje knihovna pro toto?" → POUŽIJ
- Po refaktoru zkontroluj: "Je kód kratší a jasnější?" → OPTIMALIZUJ

### ✅ CO FUNGUJE

- Bootstrap layout (100% responzivní)
- Menu systém s neonovými barvami
- Chat UI (vizuálně správné)
- Modularita ES6 modulů

### ⚠️ PRIORITNÍ ÚKOLY (AKTUALIZOVÁNO)

1. **Herní logika** - testovat a dokončit funkčnost po startu hry
2. **Údržba** - odstranit zastaralé dokumentace
3. **Optimalizace** - finální kontrola Bootstrap kompatibility

### ✅ DOKONČENO

- ✅ Chat roller opravený (zelená barva)
- ✅ Loading screen černé pozadí s animacemi
- ✅ Prázdné soubory odstraněny
- ✅ CSS kolize vyřešeny

## 🎨 CSS ZÁSADY

### Barevný systém

```css
/* JEDINÉ POVOLENÉ BARVY */
--neon-green: #39ff14;
--neon-blue: #194dd1;
--neon-purple: #ff00ff;
--neon-orange: #ff8800;
--neon-red: #ff3131;
--neon-yellow: #ffff00;
--neon-black: #000000;
```

### Bootstrap Priority

1. **PRVNÍ**: Bootstrap utility třídy
2. **DRUHÉ**: Naše neon-\* rozšíření
3. **POSLEDNÍ**: Vlastní CSS (pouze nutné minimum)

### Povolené CSS třídy

```css
/* Text barvy */
.text-neon-green, .text-neon-blue, .text-neon-purple,
.text-neon-orange, .text-neon-red, .text-neon-yellow

/* Okraje */
.border-neon-green, .border-neon-blue, .border-neon-purple,
.border-neon-orange, .border-neon-red, .border-neon-yellow

/* Tlačítka */
.btn-neon[data-neon-color="green|blue|purple|orange|red|yellow"]

/* Pozadí */
.bg-neon-black
```

## ⚙️ JAVASCRIPT ZÁSADY

### Modulární struktura

- **MAX 150 řádků** na soubor
- **Jedna zodpovědnost** na modul
- **ES6 moduly** povinně

### Import pattern

```javascript
// VŽDY používej centrální moduly
import { CONSOLE_COLORS } from "./js/utils/colors.js";
import gameState from "./js/game/gameState.js";
import chatSystem from "./js/ai/chatSystem.js";
```

### Barevné konstanty v JS

```javascript
// JEDINÝ ZDROJ BAREV
CONSOLE_COLORS = {
  neonGreen: "#39ff14",
  neonBlue: "#194DD1",
  neonPurple: "#FF00FF",
  neonOrange: "#FF8800",
  neonRed: "#ff3131",
  neonYellow: "#ffff00",
  neonBlack: "#000000",
};
```

## 🚨 ZAKÁZANÉ AKCE

- ❌ **NEPŘEPISUJ Bootstrap** core třídy
- ❌ **NEVYTVÁŘEJ** nové CSS soubory bez konzultace
- ❌ **NEPOUŽÍVEJ** inline styly
- ❌ **NEDUPLICUJ** CSS definice
- ❌ **NEMĚŇ** funkční Bootstrap layout

## ✅ POVOLENÉ AKCE

- ✅ **POUŽÍVEJ** Bootstrap utility classes
- ✅ **ROZŠIŘUJ** pomocí neon-\* tříd
- ✅ **TESTUJ** na všech breakpointech
- ✅ **ZACHOVEJ** modularitu
- ✅ **KONZULTUJ** před většími změnami

## Struktura projektu

- `src/js/game/` - Logika hry, správa stavu, mechaniky kostek
- `src/js/ai/` - AI osobnosti, chatovací odpovědi, reakce
- `src/js/ui/` - Manipulace s DOM, event handlery, animace
- `src/js/utils/` - Pomocné funkce, konstanty
- `src/styles/` - CSS moduly a styly
- `src/templates/` - HTML šablony pro komponenty
- `src/styles/variables/` - CSS proměnné (barvy, velikosti, animace)

## Kódovací standardy

- Používáme ES6+ moduly a syntaxi import/export
- Preferujeme const/let před var
- Používáme popisné názvy funkcí a proměnných
- Přidáváme JSDoc komentáře pro složitější funkce
- Funkce mají jednu odpovědnost
- Každá komponenta má vlastní CSS modul a JS soubor

## Architektura hry

- Stav hry je spravován centrálně v `game/gameState.js`
- AI osobnosti jsou definovány v `ai/personalities.js`
- UI aktualizace jsou řešeny přes dedikované UI moduly
- Zpracování událostí je odděleno od herní logiky
- Používáme lazy-loading pro nekriticické komponenty

## AI osobnosti

- Každá AI má odlišné osobnostní rysy a vzorce odpovědí
- Odpovědi jsou kontextové na základě herních událostí
- Chatovací systém podporuje AI interakce v reálném čase
- Rozhodování AI sleduje jejich osobnostní charakteristiky

## Proces refaktoringu a navrhování změn

1. **Analýza**: Identifikujte problém nebo možnost zlepšení
2. **Návrh řešení**: Navrhněte změny s maximálním využitím Bootstrapu
3. **Schválení**: Počkejte na schválení návrhu před implementací
4. **Implementace**: Proveďte změny podle schváleného návrhu
5. **Testování**: Ověřte funkčnost a vizuální konzistenci

Podrobnější pokyny najdete v adresáři `.github/copilot/`.
