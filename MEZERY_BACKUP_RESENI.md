# 🔧 Alternativní řešení s mezerami - Připraveno k implementaci

## Pokud Bootstrap-first řešení nepostačuje

### 1. Desktop menu úpravy
```html
<!-- Začít hru - potřebuje +1 znak -->
<span>Začít hru&nbsp;</span>

<!-- Pravidla - potřebuje +3 znaky -->
<span>&nbsp;Pravidla&nbsp;&nbsp;</span>

<!-- Síň slávy - potřebuje +1 znak -->
<span>Síň slávy&nbsp;</span>

<!-- Kup mi kávu - stejně dlouhé jako "Opustit hru" -->
<span>Kup mi kávu</span>

<!-- Opustit hru - nejdelší, ponechat -->
<span>Opustit hru</span>
```

### 2. Mobilní menu úpravy
```html
<!-- Stejné úpravy pro mobilní verzi -->
```

### 3. Implementace
Pokud chcete tento přístup, stačí spustit:
```bash
# Přepnutí na mezery místo šířky
sed -i 's/<span>Začít hru<\/span>/<span>Začít hru\&nbsp;<\/span>/g' src/templates/game-menu.html
sed -i 's/<span>Pravidla<\/span>/<span>\&nbsp;Pravidla\&nbsp;\&nbsp;<\/span>/g' src/templates/game-menu.html
sed -i 's/<span>Síň slávy<\/span>/<span>Síň slávy\&nbsp;<\/span>/g' src/templates/game-menu.html
```

### 4. Vrácení na původní šířku
```css
.menu-btn-uniform {
  width: auto !important; /* Šířka podle obsahu */
  min-width: auto !important;
  max-width: none !important;
}
```

---

**Doporučuji nejprve otestovat Bootstrap-first řešení se zvětšenou šířkou.**
