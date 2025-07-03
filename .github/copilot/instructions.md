# AI Dice Game - Copilot Instructions

Toto je modulární hra s kostkami založená na Vite s AI osobnostmi. Projekt se řídí těmito konvencemi:

## Zásady pro vývoj

### Používání Bootstrapu a knihoven
- **Primárně používáme Bootstrap** pro všechny layouty a komponenty
- Preferujeme **využívání utility tříd** Bootstrapu místo vlastního CSS
- Pro vlastní styly používáme **CSS proměnné** a **Bootstrap rozšíření**
- Vždy dáváme přednost existujícím knihovnám před vlastním řešením

### Modulární struktura kódu
- Soubory **nesmí přesáhnout 150 řádků** kódu
- Optimální velikost souborů je **50-100 řádků**
- Každý modul má jasně definovanou jednu zodpovědnost
- Při úpravách velkých souborů je **rozdělíme na menší moduly**

### Design a styly
- Zachováváme **neonový design** v celé aplikaci
- Používáme CSS proměnné pro konzistenci barev
- Preferujeme **Bootstrap komponenty** s vlastními styly
- Vždy navrhujeme zlepšení, která zachovávají vizuální identitu

## Struktura projektu
- `src/js/game/` - Logika hry, správa stavu, mechaniky kostek
- `src/js/ai/` - AI osobnosti, chatovací odpovědi, reakce
- `src/js/ui/` - Manipulace s DOM, event handlery, animace
- `src/js/utils/` - Pomocné funkce, konstanty
- `src/styles/` - CSS moduly a styly

## Kódovací standardy
- Používáme ES6+ moduly a syntaxi import/export
- Preferujeme const/let před var
- Používáme popisné názvy funkcí a proměnných
- Přidáváme JSDoc komentáře pro složitější funkce
- Funkce mají jednu odpovědnost

## Architektura hry
- Stav hry je spravován centrálně v `game/gameState.js`
- AI osobnosti jsou definovány v `ai/personalities.js`
- UI aktualizace jsou řešeny přes dedikované UI moduly
- Zpracování událostí je odděleno od herní logiky

## AI osobnosti
- Každá AI má odlišné osobnostní rysy a vzorce odpovědí
- Odpovědi jsou kontextové na základě herních událostí
- Chatovací systém podporuje AI interakce v reálném čase
- Rozhodování AI sleduje jejich osobnostní charakteristiky
