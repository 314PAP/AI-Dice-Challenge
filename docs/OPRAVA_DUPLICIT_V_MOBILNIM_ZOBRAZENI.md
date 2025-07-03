# Oprava duplicitního zobrazení v mobilním layoutu

## Problém

V mobilním zobrazení aplikace se zobrazovaly duplicitní prvky - byly viditelné současně desktopové i mobilní komponenty, což vedlo k:
- Zdvojenému menu (desktopové + mobilní najednou)
- Zdvojenému chatu
- Překrývajícím se prvkům UI
- Zbytečnému renderování neviditelných prvků

## Příčina

Problém vznikl kvůli nedostatečnému řízení viditelnosti komponent v závislosti na velikosti obrazovky:
1. Původní HTML struktura správně používala Bootstrap třídy pro kontejnery (`d-none d-md-block` a `d-block d-md-none`)
2. Ale vnitřní komponenty neměly konzistentně nastavené tyto třídy
3. Načítaly se všechny komponenty bez ohledu na typ zařízení

## Provedené opravy

### 1. Úprava šablon komponent

Do šablon komponent byly přidány Bootstrap třídy pro řízení viditelnosti:

#### Desktopové komponenty
- `game-menu.html`: Přidána třída `d-none d-md-block` k hlavnímu elementu
- `chat.html`: Přidána třída `d-none d-md-block` k hlavnímu elementu
- `game-controls.html`: Přidána třída `d-none d-md-block` k hlavnímu elementu

#### Mobilní komponenty
- `game-menu-mobile.html`: Přidána třída `d-block d-md-none` k hlavnímu elementu
- `chat-mobile.html`: Přidána třída `d-block d-md-none` k hlavnímu elementu
- `game-controls-mobile.html`: Přidána třída `d-block d-md-none` k hlavnímu elementu

### 2. Vytvoření CSS fixu pro zajištění správné viditelnosti

Vytvořen nový CSS soubor `responsive-visibility-fix.css`, který:
- Posiluje pravidla pro zobrazení/skrytí komponent
- Zajišťuje správnou hierarchii specificity CSS pravidel
- Řeší edge případy pro speciální komponenty

### 3. Integrace řešení do hlavního HTML

CSS fix byl přidán do hlavního HTML souboru pro zajištění aplikace pravidel.

## Výsledek

Po těchto úpravách:
1. Na mobilních zařízeních (< 768px) se zobrazují pouze mobilní komponenty
2. Na desktopových zařízeních (≥ 768px) se zobrazují pouze desktopové komponenty 
3. Nedochází k duplicitnímu zobrazení a překrývání prvků

## Technické detaily

### Bootstrap třídy pro responzivní zobrazení:
- `d-none`: Element je defaultně skrytý
- `d-block`: Element je defaultně viditelný jako blokový
- `d-md-block`: Element je viditelný jako blokový od středního breakpointu (≥ 768px)
- `d-md-none`: Element je skrytý od středního breakpointu (≥ 768px)

### Použitá kombinace:
- Desktopové komponenty: `d-none d-md-block` (skryté na mobilech, viditelné na desktopu)
- Mobilní komponenty: `d-block d-md-none` (viditelné na mobilech, skryté na desktopu)

## Doporučení pro budoucí vývoj

1. Při vytváření nových komponent vždy přidat odpovídající Bootstrap třídy pro řízení viditelnosti
2. Udržovat konzistentní systém pro desktopové a mobilní komponenty
3. Využívat responzivní utility třídy Bootstrapu místo vlastních CSS pravidel
4. V případě složitějších požadavků na responzivitu zvážit JavaScript řešení, které načítá komponenty podmíněně
