# 🚀 Ultra Bootstrap Autocomplete - Dokumentace

## Přehled

Ultra Bootstrap Autocomplete je luxusní, plně stylovaná komponenta pro autocompletování textu s 100% neonovým designem. Nahrazuje HTML5 datalist pro zajištění konzistentního vzhledu na všech prohlížečích.

## Funkce

### ✨ Hlavní funkce
- **100% Bootstrap-first**: Využívá pouze Bootstrap utility třídy
- **Plně neonové**: Garantovaný neonový vzhled na všech prohlížečích
- **Responzivní**: Optimalizováno pro desktop i mobile
- **Klávesové zkratky**: ↑↓ navigace, Enter výběr, Escape zavření
- **localStorage**: Automatické ukládání a načítání historie
- **Modulární**: Jeden soubor, jasná API, snadná integrace

### 🎨 Vzhled
- Neonové bordery s glow efektem
- Text-shadow pro luxusní vzhled
- Hover animace a efekty
- Vlastní neonové scrollbary
- Bootstrap utility třídy pro layout

## Použití

### Základní inicializace
```javascript
const autocomplete = new UltraBootstrapAutocomplete(inputElement, {
    suggestions: ['Ahoj', 'Dobrý den', 'Jak se máš?'],
    neonColor: 'blue',
    storageKey: 'my-autocomplete-history',
    maxResults: 8
});
```

### Možnosti konfigurace
```javascript
{
    suggestions: [],           // Pole návrhů
    maxResults: 8,            // Max. počet zobrazených výsledků
    placeholder: 'Text...',   // Placeholder text
    neonColor: 'blue',        // Neonová barva (blue, green, orange, pink, red, yellow)
    storageKey: 'key',        // Klíč pro localStorage
}
```

### API metody
```javascript
// Přidat návrh do historie
autocomplete.addSuggestion('Nová zpráva');

// Nastavit seznam návrhů
autocomplete.setSuggestions(['Návrh 1', 'Návrh 2']);

// Vymazat historii
autocomplete.clear();

// Zničit instanci
autocomplete.destroy();
```

## Implementace v AI Dice Challenge

### Chat Input Fields
```html
<!-- Desktop -->
<input type="text" id="chatInput" 
       class="form-control bg-black text-neon-blue border-neon-blue" 
       placeholder="Napište zprávu AI..." autocomplete="off">

<!-- Mobile -->
<input type="text" id="chatInputMobile" 
       class="form-control bg-black text-neon-blue border-neon-blue" 
       placeholder="Zpráva..." autocomplete="off">
```

### JavaScript inicializace
```javascript
// V constructor()
this.chatAutocomplete = null;
this.chatAutocompleteMobile = null;

// V initializeAutocomplete()
this.chatAutocomplete = new UltraBootstrapAutocomplete(chatInput, {
    suggestions: [...this.chatHistory],
    neonColor: 'blue',
    storageKey: 'aidice-chat-history',
    maxResults: 8
});

this.chatAutocompleteMobile = new UltraBootstrapAutocomplete(chatInputMobile, {
    suggestions: [...this.chatHistory],
    neonColor: 'blue',
    storageKey: 'aidice-chat-history-mobile',
    maxResults: 6
});
```

## CSS Styly

### Neonové barvy
Podporované neonové barvy: `blue`, `green`, `orange`, `pink`, `red`, `yellow`

```css
:root {
    --neon-blue: #194DD1;
    --neon-green: #39ff14;
    --neon-orange: #FF8800;
    --neon-pink: #FF00FF;
    --neon-red: #ff3131;
    --neon-yellow: #ffff00;
}
```

### Bootstrap utility třídy
- `position-absolute`, `top-100`, `start-0`, `end-0` - pozicování
- `bg-black`, `border`, `border-neon-*` - vzhled
- `rounded-3`, `shadow-lg` - zaoblení a stíny
- `text-neon-*`, `bg-neon-*` - neonové barvy

### Vlastní CSS
```css
.autocomplete-item {
    cursor: pointer !important;
    transition: all 0.2s ease !important;
}

/* Neonové scrollbary */
.autocomplete-dropdown::-webkit-scrollbar {
    width: 8px !important;
}
.autocomplete-dropdown::-webkit-scrollbar-thumb {
    background: var(--neon-blue) !important;
    border-radius: 4px !important;
    box-shadow: 0 0 5px rgba(25, 77, 209, 0.5) !important;
}
```

## Výhody oproti HTML5 datalist

### ❌ HTML5 datalist problémy
- Omezené možnosti stylování
- Různé chování v různých prohlížečích
- Nemožnost plné kontroly nad vzhledem
- Problémy s mobile zařízeními

### ✅ Ultra Bootstrap Autocomplete výhody
- 100% kontrola nad stylem
- Konzistentní napříč všemi prohlížeči
- Plně neonový vzhled garantován
- Bootstrap-first přístup
- Modulární a rozšiřitelná architektura

## Performance

- **Velikost**: ~150 řádků kódu
- **Závislosti**: Pouze Bootstrap CSS (už v aplikaci)
- **Memory**: Minimální footprint
- **Speed**: Rychlé filtrování a rendering

## Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Autocomplete se nezobrazuje
1. Zkontrolujte, že je parent element `position: relative`
2. Ověřte z-index hodnoty jiných elementů
3. Zkontrolujte, že jsou načteny Bootstrap CSS styly

### Neonové barvy nefungují
1. Ověřte, že je načten `bootstrap-first-pure.css`
2. Zkontrolujte CSS proměnné v `:root`
3. Použijte validní neonColor hodnotu

### Historia se neukládá
1. Zkontrolujte localStorage permissions
2. Ověřte unikátní storageKey
3. Zkontrolujte, že jsou data ve validním JSON formátu
