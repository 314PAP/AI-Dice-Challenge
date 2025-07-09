# Neonové barvy - vyřešení konfliktu s Bootstrap/SCSS

## Problém
Bootstrap SCSS styly občas přepisovaly naše vlastní neonové barevné třídy, což způsobovalo nekonzistentní vzhled komponent napříč aplikací.

## Řešení
Ke všem klíčovým CSS pravidlům v neonových utility třídách a komponentách bylo přidáno `!important`, aby bylo zajištěno, že naše vlastní neonové barvy budou mít vždy přednost před Bootstrap styly.

### Upravené soubory

1. **neon-utilities.css**:
   - Přidáno `!important` ke všem `color` a `text-shadow` vlastnostem v `.text-neon-*` třídách
   - Přidáno `!important` ke všem stínovým efektům v `.text-shadow-neon-*` třídách
   - `!important` v tabulkových `.neon-table .text-neon-*` třídách

2. **neon-buttons.css**:
   - Přidáno `!important` ke všem barvám a border-color ve třídách `btn-neon[data-neon-color="*"]`
   - `!important` pro hover, focus a active stavy tlačítek

3. **dice.css**:
   - Přidáno `!important` k barvám kostek, borderů a stínů
   - `!important` u transformací a animací při výběru a hover stavech

## Výhody řešení
- Neonové barvy mají konzistentně přednost před Bootstrap/SCSS
- Zachování jedinečného neonového designu napříč aplikací
- Spolehlivé styly i při kombinaci s Bootstrap komponentami

## Testovací poznámky
- Všechny neonové barvy jsou nyní konzistentní napříč aplikací
- Bootstrap komponenty správně přijímají naše neonové barvy
- Neonové efekty (stíny, záře) jsou aplikovány dle očekávání

---

**Datum dokončení**: `$(date +"%d.%m.%Y")`
