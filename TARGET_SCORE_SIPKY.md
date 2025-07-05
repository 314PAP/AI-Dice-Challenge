# Target Score Šipky - Bootstrap-first Řešení

## Problém
Šipky u target score inputu byly v bílé barvě, špatně viditelné a nekonzistentní s neonovým designem hry.

## Řešení - Bootstrap-first přístup

### 1. Analýza problému
- Výchozí browser šipky u `input[type="number"]` jsou bílé
- Špatná viditelnost na tmavém pozadí
- Nekonzistentní s neonovým designem
- Malé a špatně ovladatelné

### 2. Implementované změny

#### A) CSS refaktoring - Bootstrap-first
```css
/* Target score input - Bootstrap-first bez !important */
.form-control-neon {
  --bs-form-control-bg: rgba(0, 0, 0, 0.8);
  --bs-form-control-border-color: var(--neon-green);
  --bs-form-control-color: var(--neon-green);
  --bs-form-control-focus-bg: rgba(0, 0, 0, 0.9);
  --bs-form-control-focus-border-color: var(--neon-green);
  --bs-form-control-focus-color: var(--neon-green);
  --bs-form-control-focus-box-shadow: 0 0 0 0.25rem rgba(57, 255, 20, 0.25);
}
```

#### B) Odstranění výchozích šipek
```css
/* Number input šipky - Bootstrap-first styling */
.form-control-neon::-webkit-outer-spin-button,
.form-control-neon::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-control-neon[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
```

#### C) Vlastní zelené šipky
```css
/* Vlastní šipky - Bootstrap-first s utility třídami */
.score-arrows {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 2;
}

.score-arrow {
  width: 20px;
  height: 14px;
  background-color: var(--neon-green);
  border: none;
  border-radius: 2px;
  color: black;
  transition: all 0.2s ease;
}

.score-arrow:hover {
  filter: brightness(1.2);
  transform: scale(1.1);
}
```

### 3. HTML změny

#### Před:
```html
<div class="target-score-input">
    <input type="number" id="targetScoreInput" class="form-control-neon text-center" value="10000" min="1000" step="1000">
</div>
```

#### Po:
```html
<div class="target-score-input">
    <input type="number" id="targetScoreInput" class="form-control-neon text-center" value="10000" min="1000" step="1000">
    <div class="score-arrows">
        <button type="button" class="score-arrow" id="scoreUpBtn">
            <i class="ri-arrow-up-s-fill"></i>
        </button>
        <button type="button" class="score-arrow" id="scoreDownBtn">
            <i class="ri-arrow-down-s-fill"></i>
        </button>
    </div>
</div>
```

### 4. JavaScript funkčnost

#### Přidána funkce setupScoreArrows():
```javascript
function setupScoreArrows() {
    // Desktop šipky
    const scoreUpBtn = document.getElementById('scoreUpBtn');
    const scoreDownBtn = document.getElementById('scoreDownBtn');
    const targetScoreInput = document.getElementById('targetScoreInput');
    
    if (scoreUpBtn && scoreDownBtn && targetScoreInput) {
        scoreUpBtn.addEventListener('click', () => {
            const currentValue = parseInt(targetScoreInput.value) || 1000;
            const newValue = Math.min(currentValue + 1000, 100000);
            targetScoreInput.value = newValue;
            targetScoreInput.dispatchEvent(new Event('change'));
        });
        
        // Podobně pro scoreDownBtn a mobile verzi
    }
}
```

### 5. Vlastnosti nových šipek

#### ✅ Vizuální vlastnosti:
- **Zelená barva pozadí** - konzistentní s neon designem
- **Černé šipky** - dobrý kontrast na zeleném pozadí
- **Vždy viditelné** - nezmizí při hover nebo focus
- **Hover efekty** - zvětšení (scale 1.1) a zesvětlení (brightness 1.2)
- **Zaoblené rohy** - border-radius 2px
- **Optimální velikost** - 20x14px pro dobré ovládání

#### ✅ Funkční vlastnosti:
- **Krok 1000 bodů** - logický krok pro skóre
- **Limity** - minimum 1000, maximum 100000
- **Event triggering** - spouští change event pro synchronizaci
- **Desktop i mobile** - funguje na obou verzích
- **Klávesová dostupnost** - tlačítka jsou focusovatelná

### 6. Bootstrap-first výhody

#### ✅ CSS Custom Properties:
- Využívá Bootstrap form-control systém
- Žádné `!important` pro základní vlastnosti
- Konzistentní s Bootstrap konvencemi
- Snadnější údržba a upgrade

#### ✅ Minimální vlastní CSS:
- Pouze specifické styly pro šipky
- Využívá Bootstrap utility třídy
- Žádné bojování s Bootstrap styly

### 7. Testování

Vytvořen testovací soubor `test-target-score-sipky.html`:
- Porovnání starého a nového přístupu
- Funkční test obou verzí (desktop i mobile)
- Vizuální kontrola hover efektů
- Dokumentace vlastností

### 8. Soubory změněny

#### CSS:
- `src/styles/components/game-menu.css` - refaktorované styly a nové šipky

#### HTML šablony:
- `src/templates/game-menu.html` - přidány šipky
- `src/templates/game-menu-mobile.html` - přidány šipky

#### JavaScript:
- `src/js/game/controllers/eventSetupController.js` - funkce setupScoreArrows()

#### Testování:
- `test-target-score-sipky.html` - testovací soubor

### 9. Výsledek

✅ **Zelené šipky** s černými ikonami  
✅ **Vždy viditelné** - nezmizí při hover  
✅ **Hover efekty** - zvětšení a zesvětlení  
✅ **Funkční JavaScript** - krok 1000 bodů  
✅ **Limity** - min 1000, max 100000  
✅ **Bootstrap-first** - minimální vlastní CSS  
✅ **Responzivní** - funguje na desktop i mobile  
✅ **Odstranění !important** - refaktorované podle Bootstrap-first  

### 10. Budoucí vylepšení

- Možnost změnit krok (500, 1000, 5000)
- Klávesové zkratky (Ctrl+↑/↓)
- Animace při změně hodnoty
- Tooltip s aktuální hodnotou

---

**Datum:** 2025-01-05  
**Typ změny:** Bootstrap-first refaktoring + nová funkčnost  
**Bootstrap-first:** ✅ Ano  
**Neonový design:** ✅ Zachován a vylepšen  
**Testováno:** ✅ Ano  
**Funkční:** ✅ JavaScript přidán
