# Bootstrap implementační pokyny pro AI Dice Game

Tento dokument poskytuje podrobné pokyny pro implementaci a refaktorování kódu s využitím Bootstrapu v projektu AI Dice Game.

## Základní principy

### Utility-first přístup
- Preferujte Bootstrap utility třídy před vlastním CSS
- Používejte `class="d-flex justify-content-between align-items-center"` místo vlastního CSS pro flexbox layout
- Využívejte třídy pro okraje (`m-*`, `p-*`), zarovnání (`text-*`), velikost (`w-*`, `h-*`), atd.

### Komponenty
- Používejte Bootstrap komponenty (karty, tlačítka, modální okna) a upravujte je pomocí utility tříd
- Pro vlastní vzhled komponent používejte CSS proměnné a rozšířené třídy
- Zachovávejte konzistenci napříč podobnými komponentami

### Responzivní design
- Vždy navrhujte mobile-first s využitím Bootstrap grid systému
- Používejte breakpointy Bootstrapu (`sm`, `md`, `lg`, `xl`, `xxl`)
- Implementujte různá zobrazení pro mobilní a desktop verze pomocí responsivních utility tříd

## Nahrazování vlastního CSS

### Často používané náhrady:
- `display: flex` → `d-flex`
- `justify-content: center` → `justify-content-center`
- `align-items: center` → `align-items-center`
- `margin: 1rem` → `m-3`
- `padding: 0.5rem 1rem` → `py-2 px-3`
- `width: 100%` → `w-100`
- `text-align: center` → `text-center`

### Pro neonové efekty:
- Definujte základní neonové barvy v CSS proměnných
- Vytvořte `.neon-{color}` třídy pro standardní neonové efekty
- Používejte tyto třídy společně s Bootstrap třídami

## Modularizace kódu

### HTML modularizace
- Rozdělte HTML na logické šablony v `/src/templates/`
- Každá komponenta by měla mít vlastní šablonu
- Použijte komentáře pro označení začátku a konce modulů v index.html

### CSS modularizace
- Vytvářejte samostatné CSS soubory pro každou komponentu
- Definujte sdílené proměnné v `/src/styles/variables/`
- Rozdělte složité CSS soubory na logické části

### JS modularizace
- Každá funkční část má vlastní JS modul
- Používejte ES6 třídy pro zapouzdření logiky
- Oddělte manipulaci s DOM, herní logiku a AI logiku

## Příklady refaktorování

### Tlačítko před refaktoringem:
```html
<button style="background: #222; color: #0f0; border: 1px solid #0f0; 
               box-shadow: 0 0 10px #0f0; padding: 10px 20px; 
               margin-top: 15px; border-radius: 5px;">
  Start Game
</button>
```

### Tlačítko po refaktoringu:
```html
<button class="btn btn-dark neon-green mt-3 px-4 py-2">
  Start Game
</button>
```

S CSS definicí:
```css
.neon-green {
  color: var(--neon-green);
  border: 1px solid var(--neon-green);
  box-shadow: 0 0 10px var(--neon-green);
}
```

### Kontejner před refaktoringem:
```html
<div style="display: flex; flex-direction: column; align-items: center; 
           width: 80%; margin: 0 auto; padding: 20px; 
           background: rgba(0,0,0,0.7);">
  <!-- obsah -->
</div>
```

### Kontejner po refaktoringu:
```html
<div class="d-flex flex-column align-items-center w-80 mx-auto p-4 bg-dark bg-opacity-70">
  <!-- obsah -->
</div>
```

## Kontrolní seznam pro refaktoring

1. Identifikujte inline styly a nahraďte je Bootstrap třídami
2. Rozdělte velké soubory na menší moduly (max 150 řádků)
3. Extrahujte opakující se kód do samostatných komponent
4. Převeďte vlastní CSS na Bootstrap utility třídy kde je to možné
5. Zkontrolujte responzivitu na všech velikostech obrazovky
6. Zajistěte konzistenci designu napříč všemi komponentami
7. Dokumentujte složitější komponenty a jejich použití
