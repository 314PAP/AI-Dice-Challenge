# Dice CSS - Neon Colors Integration

## ✅ DOKONČENO - Integrace neonových barev

### 🎨 Použité CSS proměnné:
```css
background-color: var(--neon-dark-gray);  /* #111111 */
border-color: var(--neon-green);          /* #39ff14 */
box-shadow: var(--neon-green);            /* zelený glow */
border-color: var(--neon-yellow);         /* žlutý selected stav */
```

### 🔧 Přidané CSS proměnné do neon-colors.css:
```css
--neon-black: #000000;
--neon-dark-gray: #111111;
--neon-dark-gray-rgb: 17, 17, 17;
```

### 🎯 Možná rozšíření s utility třídami:

#### Příklad HTML pro různé barvy kostek:
```html
<!-- Zelená kostka (default) -->
<div class="dice">
  <span class="dot center"></span>
</div>

<!-- Modrá kostka s utility třídami -->
<div class="dice border-neon-blue neon-glow-blue">
  <span class="dot center"></span>
</div>

<!-- Fialová kostka -->
<div class="dice border-neon-purple neon-glow-purple">
  <span class="dot center"></span>
</div>

<!-- Oranžová kostka -->
<div class="dice border-neon-orange neon-glow-orange">
  <span class="dot center"></span>
</div>
```

#### Dostupné utility třídy pro kostky:
- **Barvy ohraničení**: `.border-neon-green`, `.border-neon-blue`, `.border-neon-purple`, `.border-neon-orange`
- **Glow efekty**: `.neon-glow-green`, `.neon-glow-blue`, `.neon-glow-purple`, `.neon-glow-orange`
- **Text barvy**: `.text-neon-green`, `.text-neon-blue`, atd.

### 📝 Poznámky:
- Základní kostka je zelená (default)
- Selected stav používá žlutou (`--neon-yellow`)
- Hover efekt používá průhlednou zelenou
- Všechny barvy jsou konzistentní s neon-colors.css palettou
