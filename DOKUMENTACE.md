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

### Breakpointy (Bootstrap)
| Breakpoint | Třída | Rozměr | Layout |
|------------|-------|--------|--------|
| Extra Small | .col-* | <576px | Stacked (vertikální) |
| Small | .col-sm-* | ≥576px | Stacked (vertikální) |
| Medium | .col-md-* | ≥768px | Stacked (vertikální) |
| Large | .col-lg-* | ≥992px | Horizontální (65:35) |
| Extra Large | .col-xl-* | ≥1200px | Horizontální (65:35) |

### Kontejner aplikace
- **Desktop**: 90% šířky/výšky obrazovky
- **Tablet**: 95% šířky/výšky obrazovky
- **Mobil**: 98% šířky/výšky obrazovky

### Rozložení hry a chatu
- **Desktop**: Horizontální layout (65% hra, 35% chat)
- **Mobil**: Vertikální layout (hra nad chatem)

### Responzivní prvky
- **Kostky**: 60×60px (desktop), 50×50px (tablet), 40×40px (mobil)
- **Avatary**: 4 v řadě (desktop), 4 v řadě (tablet), 2×2 (mobil)
- **Tlačítka**: V jedné řadě (desktop), zalamují se (mobil)
- **Fonty**: Responzivní velikosti pro různé zařízení

## Komponenty

### Herní komponenty
1. **Kostky** - Neonový design s animacemi
2. **Tlačítka** - Neonový design s hover efekty
3. **Scoreboard** - Přehled skóre všech hráčů
4. **Avatary** - Vizuální reprezentace hráčů a AI
5. **Modální okna** - Pro instrukce, výhru a síň slávy

### Chat komponenty
1. **Chat panel** - Hlavní kontejner pro chat
2. **Zprávy** - Zobrazení chatových zpráv
3. **Vstupní pole** - Pro vkládání zpráv uživatelem
4. **Ovládací prvky** - Tlačítka pro ovládání chatu

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
