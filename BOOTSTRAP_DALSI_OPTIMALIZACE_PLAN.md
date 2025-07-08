# Plán dalších optimalizací pro Bootstrap Mobile-First

Přestože jsme již provedli základní optimalizace na Bootstrap Mobile-First přístup, následující kroky by mohly dále vylepšit responzivitu a kvalitu kódu:

## 1. Ověření breakpointů pro všechna zařízení

### Co provést:
- Otestovat aplikaci na zařízení ve velmi malém rozlišení (320-375px šířka)
- Ověřit bezproblémové zobrazení v landscape módu na všech zařízeních
- Zkontrolovat čitelnost textu a dostupnost ovládacích prvků

### Jak implementovat:
```css
/* Extra small devices (pod 375px) */
@media (min-width: 320px) {
  .dice {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .btn {
    padding: 0.3rem 0.5rem;
    font-size: 0.875rem;
  }
}
```

## 2. Další optimalizace flexboxu

### Co provést:
- Sjednotit všechny flexbox kontejnery na Bootstrap utility třídy
- Zjednodušit zanořené flex kontejnery a odstranit redundanci

### Jak implementovat:
```html
<!-- Zjednodušený flex layout -->
<div class="d-flex flex-column h-100">
  <div class="flex-grow-0"><!-- Header content --></div>
  <div class="flex-grow-1 overflow-auto"><!-- Scrollable content --></div>
  <div class="flex-grow-0"><!-- Footer/Controls --></div>
</div>
```

## 3. Optimalizace velikosti fontů a ikon

### Co provést:
- Sjednotit používání utility tříd `.fs-*` místo vlastních deklarací
- Implementovat plynulejší změny velikostí mezi breakpointy

### Jak implementovat:
```css
/* Místo definování pevných velikostí v px */
@media (min-width: 576px) {
  .heading-game {
    font-size: var(--bs-fs-4);
  }
}

@media (min-width: 768px) {
  .heading-game {
    font-size: var(--bs-fs-3);
  }
}

@media (min-width: 992px) {
  .heading-game {
    font-size: var(--bs-fs-2);
  }
}
```

## 4. Vylepšení dostupnosti a kontrastu

### Co provést:
- Zajistit dostatečný kontrast mezi textem a pozadím pro neonové barvy
- Implementovat vhodné aria-atributy pro lepší přístupnost
- Optimalizovat velikost dotykových cílů na mobilních zařízeních

### Jak implementovat:
```html
<!-- Příklad vylepšení dostupnosti pro tlačítka -->
<button class="btn btn-neon" 
        data-neon-color="green" 
        aria-label="Hodit kostkami"
        role="button">
  <i class="bi bi-dice-6-fill" aria-hidden="true"></i> 
  <span>Hodit</span>
</button>
```

## 5. Optimalizace animací pro mobilní zařízení

### Co provést:
- Zjednodušit animace na mobilních zařízeních pro lepší výkon
- Implementovat podporu pro `prefers-reduced-motion`

### Jak implementovat:
```css
@media (prefers-reduced-motion) {
  .btn-neon:hover,
  .btn-neon:focus {
    transform: none;
  }
  
  .dice-face:hover {
    transform: none;
  }
  
  /* Disable other animations */
}
```

## 6. Vytvoření globálního Bootstrap theme

### Co provést:
- Vytvořit globální Bootstrap SASS soubor pro přizpůsobení
- Definovat neonovou paletu barev jako součást Bootstrap proměnných

### Jak implementovat:
```scss
// custom.scss
$theme-colors: (
  "primary": #39ff14,
  "secondary": #194DD1,
  "success": #39ff14,
  "danger": #ff3131,
  "warning": #FF8800,
  "info": #FF00FF
);

// Import Bootstrap
@import "~bootstrap/scss/bootstrap";
```

## 7. Využití nativních Bootstrap komponent místo vlastních

### Co provést:
- Nahradit vlastní implementace s nativními Bootstrap komponentami
- Využít `.toast` pro systémové zprávy místo vlastní implementace
- Použít `.card` s Bootstrap styly místo vlastních kombinací

### Jak implementovat:
```html
<!-- Systémová zpráva s využitím nativního Toast -->
<div class="toast align-items-center border-neon-yellow" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body text-neon-yellow">
      HOT DICE! Můžete pokračovat s novými 6 kostkami!
    </div>
    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>
```

## Časový harmonogram implementace:
1. Ověření breakpointů a optimalizace flexboxu: 2-3 hodiny
2. Optimalizace fontů a vylepšení dostupnosti: 2 hodiny
3. Optimalizace animací a podpora prefers-reduced-motion: 1 hodina
4. Vytvoření globálního Bootstrap theme: 3-4 hodiny
5. Využití nativních Bootstrap komponent: 3-4 hodiny

Celkový odhadovaný čas: 11-14 hodin

Tyto další optimalizace by měly dovést Bootstrap Mobile-First přístup v aplikaci AI Kostková Výzva k dokonalosti a zajistit skutečně profesionální responzivní zážitek.
