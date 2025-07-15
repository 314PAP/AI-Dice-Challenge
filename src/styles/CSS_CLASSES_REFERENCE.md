# CSS Classes Reference - AI Dice Challenge

## Důležité CSS moduly
- `main.css` - hlavní CSS (importuje všechny komponenty)  
- `src/styles/components/` - komponenty (buttons, dice, menu, chat...)
- `src/styles/utilities/` - utility třídy (animations, spacing...)
- `src/styles/themes/` - témata (neon, bootstrap-overrides...)

## Tlačítka (.btn-neon)
```css
/* Základní neonová tlačítka - používají data-neon-color atribut */
.btn-neon[data-neon-color="green"]   /* Zelené neonové tlačítko */
.btn-neon[data-neon-color="blue"]    /* Modré neonové tlačítko */
.btn-neon[data-neon-color="purple"]  /* Fialové neonové tlačítko */
.btn-neon[data-neon-color="orange"]  /* Oranžové neonové tlačítko */
.btn-neon[data-neon-color="red"]     /* Červené neonové tlačítko */
.btn-neon[data-neon-color="yellow"]  /* Žluté neonové tlačítko */

/* Stavy tlačítek */
.btn-neon:hover        /* Hover efekt */
.btn-neon:active       /* Aktivní stav */
.btn-neon:disabled     /* Zakázané tlačítko */
```

## Kostky (.dice)
```css
/* Základní kostka */
.dice                  /* Základní styl kostky */
.dice.selected         /* Vybraná kostka (žlutý okraj) */
.dice.saved           /* Uložená kostka (zelený okraj) */
.dice.rolling         /* Animace házení kostky */

/* Animace kostek */
.dice-roll-animation   /* Základní animace házení */
.dice-bounce          /* Bounce animace */
.dice-fade-in         /* Fade in animace */
```

## Menu a navigace
```css
/* Hlavní menu */
.main-menu            /* Kontejner hlavního menu */
.menu-item            /* Položka menu */
.menu-item:hover      /* Hover efekt menu */
.menu-active          /* Aktivní položka menu */

/* Navbar */
.navbar-neon          /* Neonový navbar */
.nav-link-neon        /* Neonové odkazy v nav */
```

## Chat systém
```css
/* Chat kontejner */
.chat-container       /* Hlavní kontejner chatu */
.chat-messages        /* Oblast zpráv */
.chat-input           /* Input pro zprávy */

/* Zprávy */
.message              /* Základní zpráva */
.message.user         /* Zpráva od uživatele */
.message.ai           /* Zpráva od AI */
.message-timestamp    /* Časová značka zprávy */

/* AI personalities */
.ai-advisor           /* AI Advisor styling */
.ai-competitor        /* AI Competitor styling */
.ai-comedian          /* AI Comedian styling */
```

## Layout a spacing
```css
/* Kontejnery */
.game-container       /* Hlavní herní kontejner */
.dice-container       /* Kontejner pro kostky */
.controls-container   /* Kontejner pro ovládání */
.score-container      /* Kontejner pro skóre */

/* Spacing utility */
.m-neon-1, .m-neon-2, .m-neon-3, .m-neon-4, .m-neon-5  /* Margin */
.p-neon-1, .p-neon-2, .p-neon-3, .p-neon-4, .p-neon-5  /* Padding */
```

## Animace (externí knihovny)
```css
/* Animate.css classes */
.animate__animated         /* Základní animace třída */
.animate__bounce          /* Bounce animace */
.animate__fadeIn          /* Fade in animace */
.animate__pulse           /* Pulse animace */
.animate__rubberBand      /* Rubber band animace */

/* Hover.css classes */
.hvr-grow                 /* Grow on hover */
.hvr-bounce-in            /* Bounce in on hover */
.hvr-pulse                /* Pulse on hover */

/* Magic.css classes */
.magicEffect              /* Základní magic efekt */
.magic                    /* Magic animace */

/* CSShake classes */
.shake                    /* Základní shake */
.shake-hard               /* Tvrdý shake */
.shake-horizontal         /* Horizontální shake */
```

## Barvy (neon palette)
```css
/* Text barvy */
.text-neon-green          /* #39ff14 */
.text-neon-blue           /* #194dd1 */
.text-neon-purple         /* #ff00ff */
.text-neon-orange         /* #ff8800 */
.text-neon-red            /* #ff3131 */
.text-neon-yellow         /* #ffff00 */

/* Okraje */
.border-neon-green        /* Zelený okraj */
.border-neon-blue         /* Modrý okraj */
.border-neon-purple       /* Fialový okraj */
.border-neon-orange       /* Oranžový okraj */
.border-neon-red          /* Červený okraj */
.border-neon-yellow       /* Žlutý okraj */

/* Pozadí */
.bg-neon-black            /* Černé pozadí */
.bg-dark-neon             /* Tmavé neonové pozadí */
```

## Responsive breakpoints
```css
/* Bootstrap responsive */
.col-12, .col-md-6, .col-lg-4    /* Grid systém */
.d-none, .d-md-block             /* Display utility */
.text-center, .text-md-left      /* Text alignment */

/* Custom responsive */
@media (max-width: 768px)        /* Mobile */
@media (min-width: 769px)        /* Desktop */
```

## Utility třídy
```css
/* Display */
.d-flex, .d-block, .d-none, .d-inline-block

/* Position */
.position-relative, .position-absolute, .position-fixed

/* Text */
.text-center, .text-left, .text-right
.text-uppercase, .text-lowercase

/* Borders */
.border, .border-0, .rounded, .rounded-circle

/* Shadows */
.shadow, .shadow-sm, .shadow-lg
```

## Stavy a modifikátory
```css
/* Loading stavy */
.loading                  /* Loading spinner */
.loading-overlay          /* Loading overlay */

/* Error stavy */
.error                    /* Error styling */
.warning                  /* Warning styling */
.success                  /* Success styling */

/* Disabled stavy */
.disabled                 /* Zakázaný prvek */
.inactive                 /* Neaktivní prvek */
```

## Herní logika CSS
```css
/* Skóre */
.score-display           /* Zobrazení skóre */
.score-highlight         /* Zvýrazněné skóre */
.score-animation         /* Animace skóre */

/* Tahy */
.turn-indicator          /* Indikátor tahu */
.player-active           /* Aktivní hráč */
.player-waiting          /* Čekající hráč */

/* Game over */
.game-over               /* Game over screen */
.winner                  /* Vítěz */
.loser                   /* Poražený */
```

---

**Poznámka**: Všechny třídy jsou definovány v modulárním CSS systému v `src/styles/`. 
Pro přidání nových stylů používej existující konvence a dokumentuj je zde.
