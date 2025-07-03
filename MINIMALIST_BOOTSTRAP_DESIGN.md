# Minimalistický Bootstrap Design

Tato dokumentace popisuje implementovaný přístup k minimalistickému designu založenému na Bootstrap utility třídách s neonovými efekty pro projekt AI Kostková Výzva.

## Obsah

1. [Filozofie návrhu](#filozofie-návrhu)
2. [Struktura CSS](#struktura-css)
3. [Použité Bootstrap utility třídy](#použité-bootstrap-utility-třídy)
4. [Vlastní neonové efekty](#vlastní-neonové-efekty)
5. [Responsivní design](#responsivní-design)
6. [Herní komponenty](#herní-komponenty)
7. [Chat komponenty](#chat-komponenty)

## Filozofie návrhu

Design projektu je založen na principu "Bootstrap-first" s minimálním množstvím vlastního CSS. To znamená:

- Využití Bootstrap 5 utility tříd pro layout a responsivitu
- Vlastní CSS pouze pro specifické neonové efekty a vizuální prvky
- Modularizovaná struktura stylů pro snadnou údržbu
- Konzistentní neonový vzhled se zachováním minimalistického designu

## Struktura CSS

Projekt používá následující strukturu CSS:

1. **Bootstrap základ** - Načítán z CDN
2. **neon-bootstrap-utilities.css** - Rozšíření Bootstrap utility tříd o neonové efekty
3. **minimalist-layout.css** - Minimální specifické styly pro herní komponenty a chat

## Použité Bootstrap utility třídy

### Layout & Kontejnery
- `container-fluid`, `row`, `col-*` - Základní layout
- `d-flex`, `flex-wrap`, `justify-content-*`, `align-items-*` - Flexbox utility
- `p-*`, `m-*`, `gap-*` - Spacing utility
- `w-*`, `h-*` - Velikosti elementů
- `rounded` - Zaoblené rohy

### Text & Typografie
- `text-center` - Zarovnání textu
- `fw-bold` - Tučný text
- `fs-*` - Velikosti fontů
- `text-decoration-none` - Odstranění podtržení odkazů

### Interaktivní prvky
- `btn`, `btn-sm` - Základní tlačítka
- `btn-outline-*` - Tlačítka s outlinenem
- `disabled` - Deaktivované prvky

### Zobrazení & Pozice
- `hidden` - Skrytí elementů
- `overflow-auto` - Scrollování obsahu
- `sticky-top`, `sticky-bottom` - Přilepení elementů

## Vlastní neonové efekty

Projekt obsahuje sadu vlastních utility tříd, které rozšiřují Bootstrap:

### Neonové barvy
- `.neon-green`, `.neon-blue`, `.neon-pink`, `.neon-orange` - Základní neonové barvy s text-shadow

### Neonové rámečky a stíny
- `.border-neon-*` - Neonové rámečky v různých barvách
- `.shadow-neon`, `.shadow-neon-*` - Neonové stíny

### Neonové animace
- `.neon-pulse` - Pulzující neonový efekt
- `.neon-grow` - Zvětšení při hover
- `.neon-blink` - Blikající efekt
- `.neon-wave` - Vlnící se neonový efekt

### Pozadí
- `.bg-dark-*` - Tmavá pozadí s různými úrovněmi průhlednosti
- `.bg-neon-*` - Neonová pozadí s nízkými hodnotami opacity

## Responsivní design

Design je plně responsivní díky kombinaci Bootstrap utility tříd a vlastních přizpůsobení:

- Sloupcový layout se mění pod 768px (md breakpoint) z horizontálního na vertikální
- Velikosti prvků se automaticky přizpůsobují dostupnému prostoru
- Chatová část má specifické úpravy pro mobilní zobrazení
- Vstupní pole v chatu je vždy umístěno dole pomocí `sticky-bottom`
- Záhlaví chatu je vždy nahoře pomocí `sticky-top`

## Herní komponenty

Herní komponenty využívají následující styly:

- `.game-box` - Hlavní herní kontejner s neonovým orámováním
- `.turn-info`, `.current-turn-score`, `.target-info` - Informační panely s neonovým vzhledem
- `.dice-container` - Kontejner pro kostky s flexibilním layoutem
- `.roll-controls` - Kontejner pro tlačítka akcí

## Chat komponenty

Chat má minimalistický design s těmito specifickými úpravami:

- `.chat-toggle` - Tlačítko pro sbalení/rozbalení chatu integrované v záhlaví
- `.scrollbar-neon` - Vlastní scrollbar s neonovým vzhledem
- `.input-group` - Kombinace vstupního pole a tlačítka odeslat
- `.chat-messages` - Oblast pro zprávy s automatickým scrollováním

---

Tento design splňuje požadavky na čistý, moderní a minimalistický vzhled s neonovými efekty při maximálním využití Bootstrap utility tříd.
