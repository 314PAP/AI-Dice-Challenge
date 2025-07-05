# 🎯 Alternativní řešení - Neviditelné znaky

## Pokud preferujete původní návrh s neviditelnými znaky

### Desktop menu (game-menu.html)
```html
<!-- Začít hru - potřebuje +1 znak -->
<span>Začít hru&nbsp;</span>

<!-- Pravidla - potřebuje +3 znaky -->
<span>&nbsp;Pravidla&nbsp;&nbsp;</span>

<!-- Síň slávy - potřebuje +1 znak -->
<span>Síň slávy&nbsp;</span>

<!-- Kup mi kávu - stejně dlouhé -->
<span>Kup mi kávu</span>

<!-- Opustit hru - nejdelší, zůstává -->
<span>Opustit hru</span>
```

### Mobilní menu (game-menu-mobile.html)
```html
<!-- Stejné úpravy jako výše -->
```

### Implementace
Pokud chcete tento způsob, stačí upravit texty v HTML šablonách přidáním `&nbsp;` (neviditelné mezery).

## Proč Bootstrap-first způsob je lepší:
1. ✅ **Čistší HTML** - žádné hacky s neviditelnými znaky  
2. ✅ **Responzivní** - automaticky se přizpůsobuje různým velikostem
3. ✅ **Udržovatelný** - změny v CSS, ne v HTML textech
4. ✅ **Předvídatelný** - přesná kontrola velikostí
5. ✅ **Accessibility** - neovlivňuje čtečky obrazovky

## Současné řešení s `.menu-btn-uniform`:
- Desktop: 200px šířka
- Tablet: 180px šířka  
- Mobil: 160px šířka
- Všechna tlačítka mají stejnou šířku
- Responsive design zachován
