# 📖 BOOTSTRAP DOKUMENTACE - RYCHLÁ REFERENCE

**⚠️ VŽDY POUŽÍVEJ PŘED CSS ZMĚNAMI!**

## 🎯 Nejdůležitější soubory v `dokumentybtrap/`:

### Layout & Grid
- `grid.md` - Celý Bootstrap grid systém
- `utilities-for-layout.md` - Layout utility třídy
- `spacing.md` - Margins, paddings (m-*, p-*)
- `flex.md` - Flexbox utility

### Komponenty  
- `buttons.md` - Všechny typy tlačítek
- `forms.md` - Formulářové prvky
- `colors.md` - Barevný systém Bootstrap
- `navbar.md` - Navigace
- `modal.md` - Modální okna

### Utility
- `display.md` - Display utility (d-block, d-none, atd.)
- `position.md` - Position utility (position-relative, atd.)
- `sizing.md` - Width/height utility (w-100, h-auto, atd.)
- `text.md` - Text utility (text-center, text-left, atd.)

## 🚨 PRAVIDLO: Před každou CSS změnou zkontroluj dokumentaci!

**Postup:**
1. Otevři příslušný `.md` soubor v `dokumentybtrap/`
2. Zkontroluj, zda Bootstrap má utility třídu
3. Použij Bootstrap třídu místo vlastního CSS
4. Pokud Bootstrap nemá řešení, až pak vlastní CSS

## ✅ Příklad správného postupu:

**❌ ŠPATNĚ:**
```css
.my-button {
  margin-top: 16px;
  padding: 8px 16px;
}
```

**✅ SPRÁVNĚ:**
```html
<!-- Zkontroloval jsem dokumentybtrap/spacing.md a buttons.md -->
<button class="btn btn-primary mt-3 px-3 py-2">
```

## 📁 Celá dokumentace: `/home/pipap/projects/hry-maker/AIDICE/dokumentybtrap/`
