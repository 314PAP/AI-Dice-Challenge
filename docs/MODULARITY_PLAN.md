# Plán modularity pro AI Kostková Výzva

Tento dokument popisuje plán pro modularizaci kódu aplikace AI Kostková Výzva s využitím Bootstrap frameworku a komponentové architektury.

## Cíle modularizace

1. Žádný soubor nebude mít více než 150 řádků
2. Optimální velikost souborů: 50-100 řádků
3. Maximální využití Bootstrap utility tříd místo vlastního CSS
4. Zlepšení struktury kódu pro lepší údržbu a rozšiřitelnost
5. Zachování neonového designu a vizuální identity

## Navrhovaná struktura souborů

### HTML komponenty (adresář `src/templates/`)
- `header.html` - Hlavička stránky s metadaty
- `game-menu.html` - Hlavní menu hry (desktop & mobilní verze)
- `game-controls.html` - Herní ovládací prvky (kostky, tlačítka)
- `chat.html` - Chatovací komponenta
- `modals/rules-modal.html` - Modální okno s pravidly
- `modals/hall-of-fame-modal.html` - Modální okno se síní slávy 
- `modals/game-over-modal.html` - Modální okno pro konec hry

### JS komponenty (adresář `src/js/ui/components/`)
- `GameMenu.js` - Třída pro správu hlavního menu
- `GameControls.js` - Třída pro správu herních ovládacích prvků
- `ChatInterface.js` - Třída pro správu chatu
- `Modal.js` - Základní třída pro všechna modální okna
- `RulesModal.js` - Třída pro modální okno s pravidly
- `HallOfFameModal.js` - Třída pro modální okno se síní slávy
- `GameOverModal.js` - Třída pro modální okno pro konec hry

### CSS moduly (adresář `src/styles/components/`)
- `game-menu.css` - Styly pro hlavní menu
- `game-controls.css` - Styly pro herní ovládací prvky
- `chat.css` - Styly pro chat
- `modals.css` - Základní styly pro modální okna
- `neon-effects.css` - Styly pro neonové efekty
- `bootstrap-extensions.css` - Rozšíření a přepisování Bootstrap tříd

### Soubory s proměnnými (adresář `src/styles/variables/`)
- `colors.css` - CSS proměnné pro barvy
- `sizes.css` - CSS proměnné pro velikosti
- `animations.css` - CSS proměnné pro animace

## Vylepšení použití Bootstrapu

1. **Grid systém**
   - Použití Bootstrap Grid systému důsledněji pro všechny layouty
   - Využití vnořených řádků a sloupců pro komplexnější layouty
   - Optimalizace pro různé velikosti obrazovek

2. **Komponenty**
   - Využití Card komponenty pro jednotlivé sekce hry
   - Použití standardních Bootstrap Modal komponent místo vlastních
   - Využití Button skupin a variant pro konzistentní vzhled

3. **Utility třídy**
   - Nahrazení vlastních CSS stylů Bootstrap utility třídami
   - Použití tříd pro mezery, zarovnání, padding a margin
   - Použití flexbox utility tříd pro rozložení

4. **Responzivita**
   - Důsledné používání responzivních breakpointů
   - Přeuspořádání layoutu na různých zařízeních
   - Vhodné skrývání a zobrazování prvků podle velikosti obrazovky

5. **Theming**
   - Rozšíření Bootstrap proměnných pro neonový vzhled
   - Vytvoření konzistentního systému barev
   - Přepsání výchozích Bootstrap komponent pro neonový vzhled

## Postup implementace

1. Vytvoření adresářové struktury
2. Rozdělení `index.html` na komponenty
3. Implementace JS komponent
4. Rozdělení CSS na modulární soubory
5. Optimalizace CSS a větší použití Bootstrap tříd
6. Testování a ladění na různých zařízeních

## Časová osa

1. **Fáze 1**: Adresářová struktura a rozdělení HTML (1 den)
2. **Fáze 2**: Implementace JS komponent (2-3 dny)
3. **Fáze 3**: CSS modularizace a optimalizace (1-2 dny)
4. **Fáze 4**: Testování a ladění (1 den)

Celkový odhadovaný čas: 5-7 dní

## Očekávané výhody

- Zlepšená údržba kódu
- Snazší přidávání nových funkcí
- Lepší výkon díky modularitě
- Konzistentnější vzhled napříč aplikací
- Snazší spolupráce v týmu díky jasné struktuře
