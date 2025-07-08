# 🎲 AI Dice Challenge - Dokumentace projektu

## Přehled projektu

AI Dice Challenge je modulární hra s kostkami postavená na Vite s AI osobnostmi. Projekt využívá Bootstrap pro responzivní design a je navržen s důrazem na neonovou estetiku.

## Struktura projektu

```
/src/
  /js/
    /game/        - Herní logika, správa stavu, mechaniky kostek
      gameState.js
      diceMechanics.js
    /ai/          - AI osobnosti, chatovací odpovědi, reakce
      personalities.js
      chatSystem.js
    /ui/          - Manipulace s DOM, event handlery, animace
      uiComponents.js
      gameUI.js
      chatUI.js
      autocomplete.js
    /utils/       - Pomocné funkce, konstanty
      constants.js
      helpers.js
  /styles/
    /variables/   - CSS proměnné (barvy, velikosti, animace)
      neon-colors.css
    /components/  - CSS komponenty
      neon-buttons.css
      dice.css
    /utils/       - CSS utility třídy
      neon-utilities.css
      responsive-utilities.css
    landscape-orientation.css
    responsive-text.css
    main.css      - Hlavní CSS soubor, importuje všechny moduly
  main.js         - Vstupní bod aplikace
```

## Kódovací standardy

- **ES6+ moduly** a syntaxe import/export
- **const/let** místo var
- **Popisné názvy** funkcí a proměnných
- **JSDoc komentáře** pro složitější funkce
- **Funkce s jednou odpovědností**
- Každá komponenta má vlastní CSS modul a JS soubor
- Soubory **nepřesahují 150 řádků** kódu

## Bootstrap integrace

- Primární využití Bootstrap utility tříd pro layout a komponenty
- CSS proměnné pro barvy a animace
- Responzivní design pro všechny velikosti zařízení
- Optimalizace pro landscape režim na mobilních zařízeních
- Využití Bootstrap breakpointů pro responzivitu

## Responzivní design

### Breakpointy

- **xs**: < 576px (mobile)
- **sm**: >= 576px (landscape phones)
- **md**: >= 768px (tablets)
- **lg**: >= 992px (desktops)
- **xl**: >= 1200px (large desktops)

### Landscape optimalizace

Projekt obsahuje speciální optimalizace pro landscape režim na mobilních zařízeních:

- Upravené rozložení s dvěma sloupci (herní plocha a chat)
- Kompaktnější UI prvky (tlačítka, mezery, fonty)
- Optimalizované velikosti kostek a herních prvků
- Skrývání nepodstatných elementů pro úsporu místa

## AI osobnosti

Každá AI osobnost má vlastní charakteristiky a způsoby odpovědí:

- **Gemini** - Analytická AI s matematickým přístupem
- **ChatGPT** - Přátelská a nápomocná AI
- **Claude** - Filosofická AI s hlubokým přemýšlením

## Herní mechaniky

- Hráči se střídají v házení kostek
- Bodování založené na kombinacích kostek
- Herní fáze: menu, game, gameover, rules, halloffame
- AI hráči dělají rozhodnutí na základě své osobnosti

## CSS systém

### Neonové barvy

- Definované jako CSS proměnné v `variables/neon-colors.css`
- Konzistentní neonová estetika napříč aplikací
- Varianty: green, blue, purple, orange, yellow

### Neonová tlačítka

- Systém definovaný v `components/neon-buttons.css`
- Plně responzivní na všechny velikosti obrazovek
- Data-atributy pro snadnou změnu barvy

### Herní kostky

- Vlastní komponenta s responzivním designem
- Animace pro hod kostkami
- Optimalizace pro různé velikosti obrazovek

## Responsivní utility třídy

- Rozšíření Bootstrap utility tříd
- Optimalizace pro landscape režim
- Pomocné třídy pro správu viditelnosti prvků

## Architektura aplikace

- **Centrální správa stavu** - gameState.js
- **Event-based komunikace** mezi moduly
- **Lazy-loading** pro nekritické komponenty
- **Modularizace** - každá část má jasně definovanou zodpovědnost

## Použité knihovny

- **Bootstrap 5.3.2** - Frontend framework
- **Bootstrap Icons** - Ikonový font
- **Animate.css** - CSS animace
- **SweetAlert2** - Pokročilé dialogy
- **Lodash** - Utility knihovna
