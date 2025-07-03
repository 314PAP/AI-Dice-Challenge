# 🎮 AI Kostková Výzva - Plán čištění a optimalizace

## 1️⃣ Identifikované problémy

### Duplicitní CSS soubory
- ❌ `/quick-fix.css.bak` - obsahuje duplicitní layout styly
- ❌ `/src/styles/archive/master.css` - starý monolitický soubor
- ❌ `/src/styles/archive/utilities.css` - původní utility třídy
- ❌ Další záložní CSS soubory (mnohé s příponou .bak)

### Redundantní dokumentace
- Mnoho překrývajících se .md souborů dokumentujících stejné změny
- Některé dokumenty jsou zastaralé (reflektují dřívější stav projektu)

### Smíšené použití utility tříd
- Kombinace vlastních utilit a Bootstrap utilit na některých prvcích
- Nekonzistentní používání mixin vs. utility vs. přímé styly

### Neoptimální použití knihoven
- Některé neonové efekty jsou pořád řešeny vlastními styly místo knihoven

## 2️⃣ Plán akcí

### 1. Čištění archivních souborů
- [x] Odstranit všechny `.bak` soubory
- [x] Odstranit `/src/styles/archive/` adresář a jeho obsah
- [x] Odstranit ostatní nepotřebné testovací HTML soubory

### 2. Modernizace CSS struktury
- [x] Zajistit že `main.css` importuje pouze aktuální moduly
- [x] Odstranit všechny importy nepotřebných CSS souborů v HTML
- [x] Zjednodušit strukturu složek `/src/styles/` podle potřeby

### 3. Maximální využití Bootstrap tříd
- [x] Nahradit vlastní grid/flex prvky Bootstrap utilitami
- [x] Využívat `.container-fluid`, `.row`, `.col-*` pro layout
- [x] Využívat Bootstrap spacing utility třídy (`.m-*`, `.p-*`)
- [x] Využívat Bootstrap display a flexbox utility třídy

### 4. Optimalizace neonových komponent
- [x] Zachovat neonový efekt, ale kód zjednodušit pomocí knihoven
- [x] Využívat hover.css a animate.css efekty místo vlastních animací
- [x] Zajistit konzistentní neonové efekty napříč aplikací

### 5. Konsolidace dokumentace
- [x] Vytvořit jeden hlavní dokument shrnující všechny změny
- [x] Archivovat nebo odstranit roztříštěné dokumentační soubory
- [x] Zachovat pouze důležité technické dokumenty a návody

## 3️⃣ Technické detaily čištění

### CSS soubory k odstranění
```
/quick-fix.css.bak
/src/styles/archive/**/*
*.css.bak
```

### HTML soubory k odstranění/archivaci
```
/css_debug_test.html
/css_override_debug.html
/css_path_test.html
/debug_console.html
/debug_js.html
/debug.html
/fixed.html
/index_backup.html
/index_new.html
/inline_test.html
/integration_test.html
/layout_test.html
/responsive_test.html
/simple.html
```

### MD dokumentace k odstranění/sloučení
- Sloučit všechny dokumenty o CSS modularizaci
- Sloučit všechny dokumenty o responzivním designu
- Sloučit všechny dokumenty o neonovém designu
- Zachovat hlavní vývojovou dokumentaci

## 4️⃣ Kontrola výsledku

### Kritéria úspěšnosti
1. **Při načtení stránky nikdy neproblikne starý layout nebo bílé pozadí**
2. **Layout používá převážně Bootstrap utility třídy**
3. **CSS je modulární a přehledné**
4. **Dokumentace je sjednocená a aktuální**
5. **Responzivita funguje bezchybně na všech zařízeních**
6. **Neonový design je zachován a vylepšen**

### Testování
- Test na desktopu (1920px, 1440px, 1200px)
- Test na tabletu (768px, rotace)
- Test na mobilu (375px, rotace)
- Kontrola načítání bez probliknutí (fast 3G, slow 3G)

## 5️⃣ Základní adresářová struktura po čištění

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
