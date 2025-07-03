<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Dice Game - Copilot Instructions

Toto je modulární hra s kostkami založená na Vite s AI osobnostmi. Projekt se řídí těmito konvencemi:

## Zásady pro vývoj

### Používání Bootstrapu a knihoven

- **Primárně používáme Bootstrap** pro všechny layouty a komponenty
- Preferujeme **využívání utility tříd** Bootstrapu místo vlastního CSS
- Pro vlastní styly používáme **CSS proměnné** a **Bootstrap rozšíření**
- Vždy dáváme přednost existujícím knihovnám před vlastním řešením
- Při každé úpravě **nahrazujeme vlastní CSS** Bootstrap třídami kde je to možné
- Navrhujeme **lepší řešení s Bootstrapem**, pokud existují (vždy po schválení)

### Modulární struktura kódu

- Soubory **nesmí přesáhnout 150 řádků** kódu
- Optimální velikost souborů je **50-100 řádků**
- Každý modul má jasně definovanou jednu zodpovědnost
- Při úpravách velkých souborů je **rozdělíme na menší moduly**
- Preferujeme **více malých komponent** než méně velkých

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
