# 🎲 AI Kostková Výzva - Kompletní dokumentace

## 📋 Obsah

1. [Přehled projektu](#přehled-projektu)
2. [Architektura a struktura](#architektura-a-struktura)
3. [CSS a styly](#css-a-styly)
4. [Responzivní design](#responzivní-design)
5. [Komponenty](#komponenty)
6. [Herní logika](#herní-logika)
7. [AI systém](#ai-systém)
8. [Chat systém](#chat-systém)

## Přehled projektu

AI Kostková Výzva je interaktivní webová hra založená na pravidlech hry Farkle (Kostkové štěstí), kde hráč soutěží proti AI protivníkům s různými osobnostmi. Aplikace používá modularizovaný kód a neonový design.

### Hlavní funkce
- Plně responzivní design fungující na všech zařízeních
- Neonová estetika s tmavým pozadím a světélkujícími prvky
- Modulární JavaScript s oddělením UI, herní logiky a AI
- Interaktivní chat s různými AI osobnostmi
- Síň slávy pro sledování historických výsledků
- Dvoupanelové rozložení: levý panel pro hru/menu, pravý panel pro chat

### Design koncept
Aplikace používá konzistentní dvoupanelové rozložení napříč všemi stavy:

**Hlavní menu stav:**
- **Levý panel (70%)**: Menu s nastavením cílového skóre, avatary hráčů, tlačítka pro start hry a síň slávy
- **Pravý panel (30%)**: Chat okno pro komunikaci s AI

**Herní stav:**
- **Levý panel (70%)**: Herní oblast s kostkami, tlačítky pro hraní, skóre hráčů
- **Pravý panel (30%)**: Stejné chat okno, které zůstává aktivní během hry

## Architektura a struktura

### Adresářová struktura
```
/src/
  /js/
    /game/     - Core game logic, state management, dice mechanics
    /ai/       - AI personalities, chat responses, reactions
    /ui/       - DOM manipulation, event handlers, animations
    /utils/    - Utility functions, helpers, constants
  /styles/
    /base/     - Základní styly, reset, proměnné
    /layout/   - Rozložení, gridy, kontejnery
    /components/ - UI komponenty (chat, dice, buttons, etc.)
    /animations/ - Animace a neonové efekty
    /themes/   - Neonové téma a barevné varianty
    /utils/    - Utility třídy
    main.css   - Hlavní importovací soubor
```

### Klíčové soubory
- `index.html` - Hlavní HTML struktura
- `src/js/game/gameState.js` - Správa herního stavu
- `src/js/game/diceLogic.js` - Logika kostek a výpočet skóre
- `src/js/game/gameFlowController.js` - Řízení herního průběhu
- `src/js/ai/personalities.js` - AI osobnosti a chování
- `src/js/ui/gameUI.js` - UI komponenty a manipulace s DOM

## CSS a styly

### Základní principy
- **Modulární CSS** - Rozdělené do logických komponent a modulů
- **Dark mode** - Tmavé pozadí s neonovými prvky
- **Bootstrap utility třídy** - Maximální využití Bootstrap utility tříd pro layout a responzivitu
- **Neonové efekty** - Vlastní CSS utility třídy pro neonový vzhled kompatibilní s Bootstrapem

### Importovaný CSS framework
- Bootstrap 5 - Základ pro celý layout a systém utility tříd
- Bootstrap Icons - Pro ikonografii
- Remix Icon - Pro outline ikony s neonovým efektem

### Architektura CSS
1. **Base** - Základní styly, reset, proměnné
2. **Layout** - Bootstrap-based layout a grid systém
   - `bootstrap-alternatives.css` - Dokumentace a mapování Bootstrap utility tříd
3. **Components** - Tlačítka, formy, modály, chat, kostky
4. **Animations** - Animace, keyframes, přechody
5. **Themes** - Neonové téma a barevné varianty
6. **Utils** - Utility třídy včetně `neon-bootstrap-utilities.css` pro neonové efekty

### Neonové efekty integrované s Bootstrapem
- `neon-text` pro neonový text
- `neon-border` pro neonový okraj
- `neon-green`, `neon-blue`, `neon-pink`, `neon-orange` pro barvy
- `neon-pulse`, `neon-blink`, `neon-wave` pro animace
- `btn-neon` pro neonová tlačítka
- `form-control-neon` pro neonové vstupní prvky
- `bg-dark-*` pro tmavá pozadí s průhledností

## Responzivní design

### Dvoupanelové rozložení
Aplikace používá konzistentní dvoupanelové rozložení založené na Bootstrap grid systému:

**Desktop (≥768px)**:
- Levý panel: 70% šířky (`col-md-7`) - hlavní obsah (menu/hra)
- Pravý panel: 30% šířky (`col-md-5`) - chat panel
- Horizontální uspořádání vedle sebe

**Mobil (<768px)**:
- Vertikální uspořádání
- Chat panel nahoře (`order-0`)
- Herní panel dole (`order-1`)
- Každý panel zabírá plnou šířku (`col-12`)

### Stavy aplikace

#### 1. Hlavní menu stav
**Levý panel obsahuje:**
- Nadpis hry s ikonou
- Nastavení cílového skóre (input + tlačítka)
- Tlačítka: "Začít hru", "Síň slávy"
- Avatary všech hráčů (4 AI + hráč) s jmény
- Vše je zarovnané do středu a vizuálně oddělené

**Pravý panel obsahuje:**
- Chat header s tlačítkem pro sbalení
- Oblast pro zprávy (scrollovatelná)
- Input pole pro psaní zpráv
- Chat je aktivní i v menu stavu

#### 2. Herní stav
**Levý panel obsahuje:**
- Informace o aktuálním tahu
- Skóre všech hráčů (4 panely vedle sebe)
- Současné skóre tahu a cíl
- Oblast s kostkami (6 kostek v řadě)
- Herní tlačítka: "Hodit kostky", "Odložit vybrané", "Ukončit tah", "Opustit hru"

**Pravý panel obsahuje:**
- Stejný chat jako v menu stavu
- AI reagují na herní události
- Hráč může chatovat během hry

### Přechody mezi stavy

#### Stav 1: Hlavní menu (výchozí)
**Levý panel zobrazuje:**
```html
<div class="game-header">
  <!-- Nadpis hry -->
  <!-- Nastavení cílového skóre -->
  <!-- Tlačítka: Start, Síň slávy -->
  <!-- Avatary všech hráčů -->
</div>
```

**Pravý panel zobrazuje:**
- Aktivní chat s AI
- Input pole pro komunikaci
- AI mohou komunikovat i před začátkem hry

**Triggery přechodu:**
- Tlačítko "Začít hru" → přechod do herního stavu
- Tlačítko "Síň slávy" → otevření hall of fame modálu

#### Stav 2: Herní stav
**Levý panel zobrazuje:**
```html
<div class="game-controls">
  <!-- Informace o tahu -->
  <!-- Scoreboard všech hráčů -->
  <!-- Kostky -->
  <!-- Herní tlačítka -->
</div>
```

**Pravý panel zobrazuje:**
- Stejný chat jako v menu
- AI reagují na herní události
- Hráč může chatovat během hry

**Triggery přechodu:**
- Tlačítko "Opustit hru" → návrat do hlavního menu
- Dosažení cílového skóre → game over modal
- Game over modal → volba návratu do menu nebo nové hry

#### Stav 3: Game Over
**Modální okno překrývá:**
- Celou aplikace
- Zobrazuje výsledky hry
- Možnosti: Síň slávy, Nová hra, Hlavní menu

#### Stav 4: Síň slávy
**Modální okno zobrazuje:**
- Tabulku nejlepších výsledků
- Možnosti: Zpět, Nová hra, Hlavní menu

### CSS třídy pro řízení stavů

#### Skrývání/zobrazování komponent
```css
.hidden { display: none !important; }
```

**JavaScript řízení:**
- Menu stav: `.game-header` viditelný, `.game-controls` skrytý (.hidden)
- Herní stav: `.game-header` skrytý (.hidden), `.game-controls` viditelný
- Chat zůstává vždy viditelný na pravé straně

#### Responzivní chování stavů
**Desktop (≥768px):**
- Oba stavy používají stejné 70:30 rozložení
- Chat zůstává viditelný vedle hlavního obsahu

**Mobil (<768px):**
- Chat panel se zobrazuje nahoře
- Hlavní panel (menu/hra) se zobrazuje dole
- Zachovává se funkcionalité obou stavů

### Breakpointy (Bootstrap)
| Breakpoint | Rozměr | Layout | Bootstrap třídy |
|------------|--------|--------|-----------------|
| Extra Small | <576px | Vertikální stohování | `.col-12`, `.order-0`, `.order-1` |
| Small | ≥576px | Vertikální stohování | `.col-12` s responzivním paddingem |
| Medium | ≥768px | Horizontální (70:30) | `.col-md-7`, `.col-md-5` |
| Large | ≥992px | Horizontální (70:30) | Větší padding a fonty |
| Extra Large | ≥1200px | Horizontální (70:30) | Maximální velikosti prvků |

### Kontejner aplikace (Bootstrap třídy)
- `container-fluid` - Full-width kontejner
- `mw-90 mh-90 vh-90` - 90% max-width, max-height, viewport-height
- `border border-neon-green rounded` - Neonový rámeček kolem celé aplikace
- `row h-100` - Bootstrap grid řádek na plnou výšku

### Panely aplikace
**Levý panel (herní/menu oblast):**
- `.col-12 .col-md-7 .h-100 .overflow-auto .p-3`
- Obsahuje `.game-box` s neonovým orámováním
- Scrollovatelný obsah při přetečení

**Pravý panel (chat oblast):**
- `.col-12 .col-md-5 .h-100 .p-3`
- Obsahuje flexbox layout pro chat komponenty
- Chat header, zprávy (flex-grow-1), input (sticky bottom)

### Responzivní prvky
- **Kostky**: 60×60px (desktop), 50×50px (tablet), 40×40px (mobil)
- **Avatary**: 4 v řadě (desktop), 4 v řadě (tablet), 2×2 (mobil)
- **Tlačítka**: V jedné řadě (desktop), zalamují se (mobil)
- **Fonty**: Responzivní velikosti pro různé zařízení

## Komponenty

### Levý panel komponenty

#### 1. Hlavní menu stav
**Game Header komponenta:**
- Nadpis hry s ikonou a donate linkem
- Třída: `.game-header .text-center .mb-4`
- H1 s `.game-title .neon-text .fs-neon-1`

**Target Score Setup komponenta:**
- Input pole pro cílové skóre s labelem
- Třída: `.target-score-setup .d-flex .flex-wrap .justify-content-center`
- Input: `.form-control-neon` s výchozí hodnotou 10000
- Validace: min="1000" step="1000"

**Action Buttons komponenta:**
- Tlačítko "Začít hru": `.btn .btn-neon .neon-green`
- Tlačítko "Síň slávy": `.btn .btn-neon .neon-blue`
- Flexbox layout s gap-3

**Player Avatars komponenta:**
- 4 avatary AI + avatar hráče
- Třída: `.player-avatars-section .d-flex .justify-content-center .flex-wrap .gap-3`
- Každý avatar: `.avatar-container .text-center`
- Obrázek: `.avatar-mini` s příslušnou barvou (`.avatar-green`, `.avatar-blue`, `.avatar-orange`, `.avatar-pink`)
- Jméno: `.avatar-name .neon-text` s příslušnou barvou

#### 2. Herní stav
**Game Controls komponenta:**
- Kontejner: `.game-controls .hidden .mt-4` (skrytý v menu stavu)
- Zobrazuje se při spuštění hry

**Turn Info komponenta:**
- Informace o aktuálním tahu
- Třída: `.turn-info .p-2 .mb-3 .border-neon-green .neon-text .bg-dark-80 .rounded .text-center`

**Players Container komponenta:**
- 4 panely hráčů vedle sebe
- Třída: `.players-container .d-flex .flex-wrap .justify-content-center .gap-4 .mb-4`
- Každý hráč: `.player` s příslušnou třídou (`.human-player`, `.gemini-player`, atd.)
- Aktivní hráč má třídu `.active` s `.border-neon-green`

**Score Display komponenty:**
- Current Turn Score: `.current-turn-score` - skóre aktuálního tahu
- Target Info: `.target-info` - zobrazuje cílové skóre

**Dice Container komponenta:**
- Oblast pro kostky
- Třída: `.dice-container .d-flex .flex-wrap .justify-content-center .gap-3 .my-4`
- Obsahuje 6 kostek, každá s možností výběru

**Roll Controls komponenta:**
- Herní tlačítka
- Třída: `.roll-controls .d-flex .flex-wrap .justify-content-center .gap-3 .my-4`
- Tlačítka: "Hodit kostky", "Odložit vybrané", "Ukončit tah", "Opustit hru"

### Pravý panel komponenty

#### Chat Panel komponenta
**Chat Container:**
- Hlavní kontejner: `.h-100 .border-neon-green .bg-dark-80 .rounded .d-flex .flex-column`
- Plná výška pravého panelu s neonovým orámováním

**Chat Header:**
- Třída: `.chat-header .d-flex .justify-content-between .align-items-center .p-2`
- Nadpis: `.neon-green` "AI CHAT" s ikonou
- Toggle tlačítko: `.chat-toggle .btn .btn-sm .btn-outline-success`

**Chat Messages:**
- Scrollovatelná oblast zpráv
- Třída: `.chat-messages .flex-grow-1 .overflow-auto .p-2 .my-2 .scrollbar-neon`
- Automatické scrollování na nové zprávy

**Chat Input:**
- Input pole a tlačítko pro odeslání
- Třída: `.chat-input .p-2 .mt-auto .border-top .border-success .sticky-bottom`
- Input: `.form-control-neon` s placeholderem
- Send button: `.btn .btn-neon .neon-green`

### Modální okna

#### Game Over Modal
- Zobrazuje výsledky hry
- Obsahuje: winner announcement, final scores, game stats
- Signature section pro lidské vítěze
- Action buttons: Síň slávy, Nová hra, Hlavní menu

#### Hall of Fame Modal  
- Zobrazuje historii nejlepších výsledků
- Tabulka s responzivním designem
- Action buttons: Zpět, Nová hra, Hlavní menu

## Herní logika

### Pravidla hry
- Základem je hra Farkle (Kostkové štěstí)
- Hráči se střídají v hodu kostkami
- Body se získávají odložením bodujících kombinací
- Pokud hráč hodí kombinaci bez bodů (Farkle), ztrácí body z aktuálního tahu
- Vítězem je hráč, který první dosáhne cílového skóre

### Bodování
- **Jedničky**: 100 bodů za každou
- **Pětky**: 50 bodů za každou
- **Trojice**: Hodnota kostky × 100 (kromě jedniček: 1000)
- **Čtveřice**: Trojice × 2
- **Pětice**: Trojice × 4
- **Šestice**: Trojice × 8

### Herní stav
- Hlavní stav hry spravovaný v `gameState.js`
- Historie tahů a skóre
- Aktuální hráč a stav tahu
- Stav kostek (aktivní, odložené)

## AI systém

### AI osobnosti
- **Mind**: Analytický a strategický, zaměřený na optimální strategii
- **Heart**: Emocionální a expresivní, reaguje na herní události
- **Jester**: Vtipný a chaotický, dělá nečekané tahy

### AI logika
- Různé strategie hry podle osobnosti
- Dynamické reakce na herní události
- Simulace lidského rozhodování s prvky náhody

### AI chat
- Kontextové reakce na herní události
- Osobnost se projevuje v komunikačním stylu
- Interakce s hráčem a ostatními AI

## Chat systém

### Funkce chatu
- Komunikace s AI hráči
- Systémové zprávy o herních událostech
- Barevné odlišení různých typů zpráv

### Vizuální aspekty
- Barevné rozlišení jmen hráčů
- Neonový design odpovídající celkové estetice
- Responzivní vzhled na všech zařízeních

### Chat optimalizace
- Automatické scrollování na nové zprávy
- Možnost schování/zobrazení chatu na mobilních zařízeních
- Kompaktní design maximalizující využití prostoru
