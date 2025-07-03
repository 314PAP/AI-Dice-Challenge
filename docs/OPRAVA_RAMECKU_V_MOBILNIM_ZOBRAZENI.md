# Oprava rámečku v mobilním zobrazení

## Problém

V mobilním zobrazení aplikace byl stále viditelný zelený rámeček z desktopové verze na levé straně obrazovky. Tento rámeček je součástí desktopového kontejneru, který by měl být na mobilních zařízeních zcela skrytý.

## Příčina problému

Po analýze kódu jsme identifikovali hlavní příčinu:

1. V souboru `layout-consistency-fix.css` byla CSS pravidla, která nastavovala vlastnost `display: flex !important;` pro všechny kontejnery `.container-fluid.mw-90.mh-90.vh-90` v mobilním zobrazení.

2. Toto pravidlo přepisovalo Bootstrap třídu `d-none` pro desktopový kontejner, což způsobovalo, že kontejner byl zobrazen i na mobilních zařízeních, přestože měl nastavenou třídu `d-none d-md-block`.

## Provedené změny

### 1. Úprava `layout-consistency-fix.css`

Upravili jsme CSS selektor v souboru `layout-consistency-fix.css` tak, aby se týkal pouze mobilního kontejneru s třídou `d-block d-md-none`:

```css
@media (max-width: 767.98px) {
  .container-fluid.mw-90.mh-90.vh-90.d-block.d-md-none {
    padding: 0.75rem !important;
    gap: 0.75rem !important;
    height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
  }
  /* ... */
}
```

### 2. Doplnění explicitního pravidla do `responsive-visibility-fix.css`

Pro zajištění maximální kompatibility jsme přidali explicitní pravidlo pro úplné skrytí desktopového kontejneru na mobilních zařízeních:

```css
@media (max-width: 767.98px) {
  .container-fluid.mw-90.mh-90.vh-90.border.border-neon-green.rounded.d-none.d-md-block {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    top: -9999px !important;
    left: -9999px !important;
    z-index: -1 !important;
  }
}
```

## Výsledek

Tyto změny zajistily, že desktopový kontejner (a s ním i zelený rámeček) je nyní zcela skrytý v mobilním zobrazení. Zároveň jsme zachovali všechny ostatní responzivní úpravy, které byly součástí souboru `layout-consistency-fix.css`.

## Technické detaily

Při řešení tohoto problému jsme použili několik technik pro zajištění spolehlivého skrytí elementu:
1. `display: none !important;` - Základní skrytí elementu
2. `visibility: hidden !important;` - Zajištění, že element nebude viditelný ani v případě, že by byl display přepsán
3. `opacity: 0 !important;` - Element nebude vidět ani při případném přepsání viditelnosti
4. `height: 0 !important; width: 0 !important;` - Element nebude zabírat žádné místo
5. `position: absolute !important; top: -9999px !important; left: -9999px !important;` - Element bude přesunut daleko mimo viditelnou oblast
6. `z-index: -1 !important;` - Element bude "pod" ostatními elementy

Kombinace těchto technik zajišťuje, že element bude spolehlivě skrytý na mobilních zařízeních bez ohledu na případné konfliktní CSS pravidla.
