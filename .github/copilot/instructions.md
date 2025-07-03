# AI Dice Game - Copilot Instructions

Toto je modulární hra s kostkami založená na Vite s AI osobnostmi. Projekt se řídí těmito konvencemi:

## Zásady pro vývoj

### Používání Bootstrapu a knihoven
- **Primárně používáme Bootstrap** pro všechny layouty a komponenty
- Preferujeme **využívání utility tříd** Bootstrapu místo vlastního CSS
- Pro vlastní styly používáme **CSS proměnné** a **Bootstrap rozšíření**
- Vždy dáváme přednost existujícím knihovnám před vlastním řešením
- Při každé úpravě **nahrazujeme vlastní CSS** Bootstrap třídami kde je to možné
- Navrhujeme **lepší řešení s Bootstrapem**, pokud existují

### Modulární struktura kódu
- Soubory **nesmí přesáhnout 150 řádků** kódu
- Optimální velikost souborů je **50-100 řádků**
- Každý modul má jasně definovanou jednu zodpovědnost
- Při úpravách velkých souborů je **rozdělíme na menší moduly**
- Preferujeme **více malých komponent** než méně velkých
- Rozdělujeme logiku na **nezávislé, znovupoužitelné moduly**

### Design a styly
- Zachováváme **neonový design** v celé aplikaci
- Používáme CSS proměnné ze složky `src/styles/variables/` pro konzistenci
- Preferujeme **Bootstrap komponenty** s vlastními styly
- Vždy navrhujeme zlepšení, která zachovávají vizuální identitu
- Používáme **tématické CSS soubory** pro sdílené vizuální prvky
- Definujeme nové styly pouze když Bootstrap nemá ekvivalent

### Refaktorovací priority
- Nahrazení inline stylů CSS proměnnými a Bootstrap třídami
- Rozdělení velkých HTML, JS a CSS souborů na menší komponenty
- Extrakce opakujícího se kódu do znovupoužitelných komponent
- Vytváření specializovaných modulů pro každou část funkcionality
- Zlepšení responzivity a konzistence designu

## Struktura projektu
- `src/js/game/` - Logika hry, správa stavu, mechaniky kostek
- `src/js/ai/` - AI osobnosti, chatovací odpovědi, reakce
- `src/js/ui/` - Manipulace s DOM, event handlery, animace
- `src/js/utils/` - Pomocné funkce, konstanty
- `src/styles/` - CSS moduly a styly (komponenty, proměnné, základní styly)
- `src/templates/` - HTML šablony pro modulární komponenty
- `src/styles/variables/` - CSS proměnné (barvy, velikosti, animace)
- `src/styles/components/` - Styly pro samostatné komponenty

## Kódovací standardy
- Používáme ES6+ moduly a syntaxi import/export
- Preferujeme const/let před var
- Používáme popisné názvy funkcí a proměnných
- Přidáváme JSDoc komentáře pro složitější funkce
- Funkce mají jednu odpovědnost
- Každá komponenta má vlastní CSS modul a JS soubor
- Třídíme kód do logických skupin s komentáři pro přehlednost

## Architektura hry
- Stav hry je spravován centrálně v `game/gameState.js`
- AI osobnosti jsou definovány v `ai/personalities.js`
- UI aktualizace jsou řešeny přes dedikované UI moduly
- Zpracování událostí je odděleno od herní logiky
- Používáme lazy-loading pro nekriticické komponenty
- Řešíme responzivitu přes Bootstrap breakpointy

## AI osobnosti
- Každá AI má odlišné osobnostní rysy a vzorce odpovědí
- Odpovědi jsou kontextové na základě herních událostí
- Chatovací systém podporuje AI interakce v reálném čase
- Rozhodování AI sleduje jejich osobnostní charakteristiky
- Používáme samostatné moduly pro každou AI osobnost
- Oddělujeme AI logiku od zobrazovací vrstvy
