# Oprava orámování odložených kostek - DOKONČENO

## Problém
Odložené kostky neměly orámování a vypadaly jinak než aktivní kostky. Na obrázku bylo vidět, že aktivní kostky mají zelené orámování, ale odložená kostka (modrá 5) byla bez rámečku.

## Původní kód
```css
/* Problematické styly */
.dice.banked {
  color: var(--neon-blue);
  text-shadow: 0 0 5px var(--neon-blue);
  border: none !important;           /* ❌ Žádné orámování */
  box-shadow: none !important;       /* ❌ Žádný glow */
  cursor: default;
  opacity: 1;
}
```

## Opravené řešení

### 1. Základní styl pro odložené kostky
```css
.dice.banked {
  color: var(--neon-blue);
  text-shadow: 0 0 5px var(--neon-blue);
  border: 2px solid var(--neon-blue) !important;     /* ✅ Modré orámování */
  box-shadow: 0 0 5px var(--neon-blue) !important;   /* ✅ Modrý glow */
  cursor: default;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.9) !important;
}
```

### 2. Hover efekt pro odložené kostky
```css
.dice.banked:hover {
  transform: none !important;
  cursor: default !important;
  /* Zachovat orámování při hover */
  border: 2px solid var(--neon-blue) !important;
  box-shadow: 0 0 5px var(--neon-blue) !important;
}
```

### 3. Mobilní verze
```css
.dice-container-mobile .dice.banked {
  border: 1px solid var(--neon-blue) !important;
  box-shadow: var(--glow-sm) var(--neon-blue) !important;
  color: var(--neon-blue) !important;
  text-shadow: 0 0 3px var(--neon-blue) !important;
}
```

### 4. Responzivní orámování
```css
@media (max-width: 992px) {
  .dice.banked {
    border: 2px solid var(--neon-blue) !important;
    box-shadow: 0 0 3px var(--neon-blue) !important;
  }
}

@media (max-width: 768px) {
  .dice.banked {
    border: 2px solid var(--neon-blue) !important;
    box-shadow: 0 0 2px var(--neon-blue) !important;
  }
}

@media (max-width: 576px) {
  .dice.banked {
    border: 2px solid var(--neon-blue) !important;
    box-shadow: 0 0 1px var(--neon-blue) !important;
  }
}
```

## Výsledek

### ✅ Před a po
**Před opravou:**
- Aktivní kostky: zelené orámování + glow
- Odložené kostky: žádné orámování (jen modrý text)

**Po opravě:**
- Aktivní kostky: zelené orámování + glow
- Odložené kostky: modré orámování + glow

### ✅ Konzistence
- Všechny kostky mají stejný styl orámování
- Liší se pouze barvou (zelená vs modrá)
- Zachována funkční diferenciace (hover efekty)

### ✅ Responzivita
- Orámování funguje na všech velikostech obrazovky
- Proporcionální glow efekty podle breakpointu
- Mobilní verze má tenčí orámování (1px vs 2px)

## Technické detaily

### Priorita stylů
Použití `!important` pro zajištění, že se orámování nepřepíše jinými styly:
```css
border: 2px solid var(--neon-blue) !important;
box-shadow: 0 0 5px var(--neon-blue) !important;
```

### Barevná konzistence
- Aktivní kostky: `var(--neon-green)` (#39ff14)
- Odložené kostky: `var(--neon-blue)` (#194DD1)
- Konzistentní použití CSS proměnných

### Flexibilní glow
- Desktop: `0 0 5px`
- Tablet: `0 0 3px`
- Mobil: `0 0 2px`
- Velmi malé: `0 0 1px` nebo `none`

Odložené kostky nyní vypadají konzistentně s aktivními kostkami a mají správné modré orámování! 🎯
