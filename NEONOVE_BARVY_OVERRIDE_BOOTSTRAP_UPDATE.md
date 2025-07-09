# Neonové barvy - vyřešení konfliktu s Bootstrap/SCSS

## Problém
Bootstrap CSS třídy přepisovaly naše vlastní neonové barevné třídy, což způsobovalo nekonzistentní vzhled komponent napříč aplikací. Konkrétně šlo o třídy:
- Text-color třídy (.text-primary, .text-danger, atd.)
- Background-color třídy (.bg-primary, .bg-dark, atd.)
- Border-color třídy (.border-primary, .border-danger, atd.)

## Řešení
Implementovali jsme systém přepsání Bootstrap barevných tříd pomocí vlastního CSS modulu s !important direktivami. Tento modul se načítá po Bootstrap CSS, ale před našimi vlastními neon-utilities.

### Implementační detaily

1. **Nový soubor bootstrap-colors-override.css**:
   - Obsahuje přepsání všech klíčových Bootstrap barevných tříd
   - Používá !important direktivy k zajištění priority nad Bootstrap CSS
   - Využívá naše vlastní neonové barvy definované v neon-colors.css

2. **Upravené pořadí importů v main.css**:
   ```css
   /* 1. Proměnné */
   @import './variables/neon-colors.css';
   
   /* 2. Bootstrap overrides */
   @import './overrides/bootstrap-colors-override.css';
   
   /* 3. Utility třídy */
   @import './utils/neon-utilities.css';
   ```

3. **Zachování konzistence načítání v index.html**:
   ```html
   <!-- Bootstrap CSS -->
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
   
   <!-- ... další externí styly ... -->
   
   <!-- Naše vlastní styly -->
   <link rel="stylesheet" href="/src/styles/main.css">
   ```

## Výhody řešení
- Neonové barvy mají konzistentně přednost před Bootstrap/SCSS
- Zachování jedinečného neonového designu napříč aplikací
- Spolehlivé styly i při kombinaci s Bootstrap komponentami
- Možnost používat standardní Bootstrap třídy (`text-primary`, `bg-success`, atd.) ale s neonovým vzhledem

## Testovací poznámky
- ✅ Bootstrap komponenty nyní správně přijímají naše neonové barvy
- ✅ Neonové efekty (stíny, záře) jsou správně aplikovány
- ⚠️ Je třeba ještě provést další testy, zejména na různých zařízeních

## Další kroky
- Ještě je potřeba doladit některé detaily s barvami, zejména zkontrolovat, zda jsou všechny neonové barvy konzistentní
- Zkontrolovat interakce s Bootstrapem při různých velikostech obrazovky
- Optimalizace selektorů v CSS pro lepší výkon

---

**Datum dokončení**: 9. července 2025
**Autor**: GitHub Copilot
