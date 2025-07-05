# Bootstrap CSS Integrace

## 📑 Přehled změn

V rámci maximalizace využití CSS knihoven jsme implementovali tyto změny:

1. **Bootstrap Framework** - Přidán Bootstrap 5.3.7 jako hlavní CSS framework
2. **Bootstrap Icons** - Přidány Bootstrap Icons 1.13.1 pro ikony
3. **Neonový Motiv** - Vytvořena speciální neonová Bootstrap témata
4. **Responzivní Layout** - Layout plně přepracován s Bootstrap Grid systémem
5. **Komponenty** - Tlačítka, karty, formuláře, a další nahrazeny Bootstrap komponentami

## 🎨 Bootstrap + Neon

Abychom zachovali jedinečný neonový vzhled, vytvořili jsme vlastní Bootstrap rozšíření:

- `bootstrap-neon.css` - Neonové varianty Bootstrap komponent
- `bootstrap-dice.css` - Upravené kostky s Bootstrap třídami
- `farkle-bootstrap.css` - Přepracované Farkle notifikace

## 📏 Responzivní Layout

Layout byl plně přepracován s Bootstrap Grid systémem:

- **Desktop (>1200px)**: Poměr 65:35 (hra:chat)
- **Tablet (800px-1200px)**: Poměr 68:32 (hra:chat)
- **Mobilní (<800px)**: Stacked layout (hra nad chatem)

Všechny prvky se plynule přizpůsobují díky Bootstrap flexboxu a grid systému.

## 🧩 Bootstrap Komponenty

- **Tlačítka**: `btn btn-outline-success` místo vlastních tříd
- **Formuláře**: `form-control` místo vlastního stylování
- **Karty**: `card`, `card-body` pro informační bloky
- **Layout**: `container-fluid`, `row`, `col-*` pro responzivní layout
- **Utilities**: `d-flex`, `justify-content-center`, `gap-2` atd.

## 🌟 Speciální Funkce

- **Neonové efekty**: Zachované pomocí CSS proměnných a `box-shadow`
- **Responzivní velikosti**: Dynamické změny velikostí prvků
- **Animace**: Zachovány pomocí našich CSS animací 
- **Modální okna**: Využití Bootstrap modal komponent

## 🔧 Další optimalizace

- Minimalizované vlastní CSS
- Maximální využití Bootstrap utilit
- Responzivní breakpointy přes Bootstrap Media Queries
- Konzistentní styly napříč aplikací
