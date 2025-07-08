# Sjednocení neonových komponent v AI Dice Challenge

## Současný stav

Projekt používá několik typů neonových komponent, které je potřeba sjednotit a zajistit konzistentnost:

1. **CSS soubory:**
   - `/src/styles/bootstrap-first-pure.css` (aktivní)
   - `/bootstrap-first-refactored.css` (duplicita)

2. **Problémové oblasti:**
   - Tlačítka s třídou `btn-neon-blue` se zobrazují jako zelená
   - Dokumentace v CSS souboru uvádí "0 !important rules", ale SweetAlert2 sekce používá mnoho !important pravidel
   - Číslování CSS sekcí je nekonzistentní (dvě sekce se stejným číslem)
   - V komentářích je zmatečný odkaz na vlastní soubor

3. **Neonové barvy:**
   ```css
   --neon-green: #39ff14;
   --neon-green-rgb: 57, 255, 20;
   --neon-blue: #194DD1;
   --neon-blue-rgb: 25, 77, 209;
   --neon-purple: #FF00FF;
   --neon-purple-rgb: 255, 0, 255;
   --neon-orange: #FF8800;
   --neon-orange-rgb: 255, 136, 0;
   --neon-red: #ff3131;
   --neon-red-rgb: 255, 49, 49;
   --neon-yellow: #ffff00;
   --neon-yellow-rgb: 255, 255, 0;
   ```

## Neonové komponenty a třídy

### Tlačítka
| Varianta | CSS třída | Barva | Příklad použití |
|----------|-----------|-------|----------------|
| Zelená   | `btn-neon-green` | `#39ff14` | Tlačítko "Hodit" |
| Modrá    | `btn-neon-blue` | `#194DD1` | Tlačítko "Odložit" |
| Fialová  | `btn-neon-purple` | `#FF00FF` | - |
| Oranžová | `btn-neon-orange` | `#FF8800` | Tlačítko "Ukončit tah" |
| Červená  | `btn-neon-red` | `#ff3131` | Tlačítko pro ukončení hry |
| Žlutá    | `btn-neon-yellow` | `#ffff00` | - |

### Textové třídy
| Varianta | CSS třída | Barva |
|----------|-----------|-------|
| Zelená   | `text-neon-green` | `#39ff14` |
| Modrá    | `text-neon-blue` | `#194DD1` |
| Fialová  | `text-neon-purple` | `#FF00FF` |
| Oranžová | `text-neon-orange` | `#FF8800` |
| Červená  | `text-neon-red` | `#ff3131` |
| Žlutá    | `text-neon-yellow` | `#ffff00` |

### Rámečky
| Varianta | CSS třída | Barva |
|----------|-----------|-------|
| Zelená   | `border-neon-green` | `#39ff14` |
| Modrá    | `border-neon-blue` | `#194DD1` |
| Fialová  | `border-neon-purple` | `#FF00FF` |
| Oranžová | `border-neon-orange` | `#FF8800` |
| Červená  | `border-neon-red` | `#ff3131` |
| Žlutá    | `border-neon-yellow` | `#ffff00` |

### Široké rámečky s glow efektem
| Varianta | CSS třída |
|----------|-----------|
| Zelená   | `border-wide-neon-green` |
| Modrá    | `border-wide-neon-blue` |

### Pozadí s glow efektem
| Varianta | CSS třída |
|----------|-----------|
| Zelená   | `bg-neon-glow-effect-green` |
| Modrá    | `bg-neon-glow-effect-blue` |
| Fialová  | `bg-neon-glow-effect-purple` |
| Oranžová | `bg-neon-glow-effect-orange` |
| Červená  | `bg-neon-glow-effect-red` |
| Žlutá    | `bg-neon-glow-effect-yellow` |

## Plán pro sjednocení

1. **Odstranit duplicitu CSS souborů:**
   - Zachovat pouze `/src/styles/bootstrap-first-pure.css`
   - Archivovat nebo odstranit `/bootstrap-first-refactored.css`

2. **Sjednotit použití tříd v HTML a JS:**
   - Ověřit, že HTML používá správné třídy `btn-neon-blue` pro modré tlačítko
   - Zajistit, že JS kód nepřepisuje dynamicky třídy tlačítek

3. **Aktualizace dokumentace:**
   - Upřesnit, že SweetAlert2 vyžaduje !important pravidla
   - Aktualizovat číslování sekcí v CSS
   - Vytvořit kompletní dokumentaci komponentního systému

4. **Vytvoření komponentních přehledů:**
   - Pro každou neonovou barvu vytvořit ukázku všech typů komponent

## Závěr

Tento dokument slouží jako průvodce pro sjednocení neonových komponent v projektu AI Dice Challenge. Následováním navržených kroků zajistíme konzistentní vzhled a chování všech neonových prvků v aplikaci.
