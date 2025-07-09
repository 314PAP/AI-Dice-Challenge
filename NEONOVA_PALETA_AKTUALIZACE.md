# Aktualizace neonové barevné palety

## Přehled provedených změn

Byly provedeny následující změny v barevné paletě projektu:

1. **Odstraněny nepotřebné barvy:**
   - Odstraněna šedá barva `--neon-dark-gray` a její RGB ekvivalent
   - Nahrazena všude černou barvou `--neon-black`
   - Z `colors.js` odstraněny všechny barvy kromě:
     - 6 základních neonových barev (green, blue, purple, orange, red, yellow)
     - Černá (`neonBlack`)
     - Bílá (`textWhite`)

2. **Sjednocení stylů všech komponent:**
   - Všechna pozadí nastavena na černou (`var(--neon-black)`)
   - Veškeré stínování komponent využívá neonově modrou (`var(--neon-blue)`)
   - Všechny bordery a rámečky využívají neonové barvy místo šedé
   - Border barva `light` změněna na modrou

3. **Bootstrap Override Update:**
   - Bootstrap komponenty (cards, modals, forms, atd.) mají nyní vždy černé pozadí
   - Nahrazena neexistující barva `--neon-cyan` za `--neon-blue`
   - Přidány neonové stíny k jednotlivým komponentám pomocí rgba hodnot
   - Dropdown hover efekty změněny na použití neonově modré namísto šedé

## Aktuální barevná paleta

Projekt nyní používá pouze následující barvy:

### Základní neonové barvy
- `--neon-green: #39ff14`
- `--neon-blue: #194DD1`
- `--neon-purple: #FF00FF`
- `--neon-orange: #FF8800`
- `--neon-red: #ff3131`
- `--neon-yellow: #ffff00`

### Pozadí a text
- `--neon-black: #000000` (pozadí)
- `--neon-text-white: #ffffff` (text)

### Průhledné barvy pro efekty
- `--neon-bg-hover: rgba(0, 0, 0, 0.2)`
- `--neon-bg-active: rgba(0, 0, 0, 0.3)`

## Doporučení pro vývoj

1. Při vytváření nových komponent vždy používejte pouze barvy z hlavní palety
2. Pro pozadí vždy používejte `var(--neon-black)`
3. Pro stíny a průhledné efekty používejte rgba hodnoty neonových barev
4. Používejte CSS proměnné místo přímých hexadecimálních hodnot
5. Držte se Bootstrap utility tříd a rozšiřujte je pomocí neonových utility
