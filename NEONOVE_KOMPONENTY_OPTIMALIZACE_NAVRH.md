# Návrh optimalizace CSS pro neonové komponenty

## Současný stav

Provedl jsem podrobnou kontrolu `dice.css` a souvisejících souborů s CSS proměnnými. Aktuální implementace je velmi dobrá, ale navrhuji několik optimalizací pro další zlepšení konzistence a modularity.

## Návrhy na zlepšení

### 1. Lepší využití existujících CSS proměnných pro efekty

V současné době jsou některé box-shadow hodnoty v `dice.css` definovány přímo, místo využití existujících proměnných:

```css
/* Aktuální implementace */
.dice {
  box-shadow: 0 0 0.625rem var(--neon-green); /* 10px */
}

/* Návrh úpravy */
.dice {
  box-shadow: var(--neon-glow-medium) var(--neon-green);
}
```

### 2. Rozšíření CSS proměnných pro neonové efekty

Doporučuji rozšířit proměnné v `neon-colors.css` o další úrovně intenzity glow efektu:

```css
/* Nové proměnné pro přidání do neon-colors.css */
:root {
  /* Neonové efekty s různou intenzitou */
  --neon-glow-small: 0 0 0.3125rem; /* 5px */
  --neon-glow-medium: 0 0 0.625rem; /* 10px */
  --neon-glow-large: 0 0 0.9375rem; /* 15px */
  --neon-glow-xl: 0 0 1.25rem; /* 20px */
}
```

### 3. Vytvoření samostatného souboru pro animace

Pro lepší modularitu doporučuji vytvoření samostatného souboru `animations.css`:

```css
/* Návrh obsahu animations.css */
@keyframes diceRoll {
  0% { transform: rotateX(0) rotateY(0); }
  20% { transform: rotateX(180deg) rotateY(90deg); }
  40% { transform: rotateX(360deg) rotateY(180deg); }
  60% { transform: rotateX(180deg) rotateY(270deg); }
  80% { transform: rotateX(360deg) rotateY(360deg); }
  100% { transform: rotateX(0) rotateY(0); }
}

/* Další animace zde... */
```

### 4. Vytvoření utility tříd pro animace

```css
/* Návrh rozšíření neon-utilities.css o animační utility */
.animate-dice-roll {
  animation: diceRoll 0.8s ease-in-out;
}

.animate-pulse {
  animation: pulsate 1.5s infinite alternate;
}
```

### 5. Vytvoření proměnných pro transition hodnoty

```css
/* Návrh přidání do neon-colors.css */
:root {
  /* Transition hodnoty */
  --transition-fast: all 0.2s ease;
  --transition-normal: all 0.3s ease;
  --transition-slow: all 0.5s ease;
}
```

## Zdůvodnění návrhu

Tyto změny přinesou následující výhody:

1. **Lepší konzistence** - Všechny vizuální efekty budou používat stejné proměnné
2. **Jednodušší údržba** - Změna hodnoty na jednom místě se projeví všude
3. **Větší modularita** - Animace oddělené v samostatném souboru
4. **Lepší čitelnost** - Kód bude čitelnější díky využití popisných proměnných

## Implementační plán

1. Rozšířit `neon-colors.css` o nové proměnné
2. Vytvořit `animations.css` v adresáři `src/styles/utils/`
3. Rozšířit `neon-utilities.css` o utility třídy pro animace
4. Postupně aktualizovat všechny komponenty (začít s `dice.css`)

## Závěr

Tyto úpravy zachovají současný vizuální styl aplikace, ale dále zlepší modularitu a konzistenci kódu. Věřím, že tyto změny jsou v souladu s projektem a kódovacími standardy, které byly zmíněny v instrukcích.
