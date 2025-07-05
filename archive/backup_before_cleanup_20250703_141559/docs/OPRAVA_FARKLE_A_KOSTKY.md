# Opravy Farkle Efektu a Přeskládání Kostek

## Provedené změny

### 1. Farkle Efekt - Pouze Neonový Okraj

- **Problém:** Farkle efekt vytvářel červené neonové pozadí za kartou hráče a nápis měl bílý okraj.
- **Řešení:** Upraven CSS styl tak, aby byl neon pouze na okrajích a nápis byl plně červený neon bez bílého okraje.

#### Provedené úpravy:
- V `speechBubbles.js`:
  - Odstraněno červené pozadí z Farkle zprávy (nastaveno na `transparent`)
  - Změněna barva textu na červenou s neonovým efektem
  - Přidán silný neonový text-shadow a box-shadow pro lepší viditelnost
  - Zachováno umístění a animace

- V `status.css`:
  - Upraven Farkle efekt, aby používal pouze okrajové neonové zvýraznění
  - Vylepšena animace neonového pulzování
  - Přidáno specifické nastavení pro zachování černého pozadí

### 2. Řazení Odložených Kostek Zprava Doleva

- **Problém:** Odložené kostky se zobrazovaly v nevhodném pořadí.
- **Řešení:** Změněn systém zobrazování banked (odložených) kostek tak, aby se zobrazovaly zprava doleva.

#### Provedené úpravy:
- V `diceRenderer.js`:
  - Upraven kód pro vytvoření kontejneru banked kostek
  - Využití CSS flex-direction: row-reverse pro zobrazení zprava doleva
  - Optimalizováno umístění kontejneru v DOM struktuře

- V `states.css`:
  - Vylepšen vizuální styl odložených kostek
  - Přidán lehký modrý neonový efekt pro lepší viditelnost
  - Zvýšena opacita pro lepší viditelnost

- V `banked.css`:
  - Upraven styl kontejneru pro odložené kostky
  - Přidáno vizuální oddělení pomocí hranice a stínu
  - Zajištěno správné umístění a mezery mezi kostkami

## Výsledek

1. **Farkle Efekt:**
   - Nápis "FARKLE!" je nyní plně červený neon bez bílého okraje
   - Neonové zvýraznění je pouze na okrajích, ne za kartou hráče
   - Zachována výrazná pulzující animace pro dobrou viditelnost

2. **Odložené Kostky:**
   - Odložené kostky se zobrazují zprava doleva
   - Nové kostky se přidávají vlevo
   - Vizuálně jsou odložené kostky odděleny od aktivních kostek
   - Vylepšen vizuální styl odložených kostek pomocí modrého neonu

Všechny změny byly provedeny s ohledem na zachování jednotného vizuálního stylu a konzistenci s ostatními prvky hry.
