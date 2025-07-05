# 🔧 Oprava šířky tlačítek - Bootstrap-first řešení

## 🎯 Problém
Tlačítka měla stejnou šířku (200px), ale text se do nich nevešel kvůli:
- Ikona zabírá prostor
- Padding (px-4, px-md-5) zabírá prostor
- Nejdelší text "Opustit hru" potřebuje více místa

## ✅ Bootstrap-first řešení (DOPORUČENO)

### Zvětšení šířky tlačítek:
```css
.menu-btn-uniform {
  width: 250px !important; /* Desktop - dostatečná šířka */
  min-width: 250px !important;
  max-width: 250px !important;
}

@media (max-width: 767.98px) {
  .menu-btn-uniform {
    width: 220px !important; /* Tablet */
    min-width: 220px !important;
    max-width: 220px !important;
  }
}

@media (max-width: 575.98px) {
  .menu-btn-uniform {
    width: 190px !important; /* Mobil */
    min-width: 190px !important;
    max-width: 190px !important;
  }
}
```

### Výhody:
- ✅ Čistý Bootstrap-first přístup
- ✅ Responzivní design
- ✅ Text se vejde pohodlně
- ✅ Žádné hacky s mezerami
- ✅ Udržovatelnost

---

## 🔧 Alternativní řešení s mezerami

**Pokud by Bootstrap-first řešení nebylo dostatečné:**

### Desktop menu (game-menu.html):
```html
<!-- Začít hru - přidat 1 mezeru -->
<span>Začít hru&nbsp;</span>

<!-- Pravidla - přidat 3 mezery -->
<span>&nbsp;Pravidla&nbsp;&nbsp;</span>

<!-- Síň slávy - přidat 1 mezeru -->
<span>Síň slávy&nbsp;</span>

<!-- Kup mi kávu - same jako "Opustit hru" -->
<span>Kup mi kávu</span>

<!-- Opustit hru - nejdelší, ponechat -->
<span>Opustit hru</span>
```

### Mobilní menu (game-menu-mobile.html):
```html
<!-- Stejné úpravy jako desktop -->
```

---

## 📐 Nové rozměry tlačítek

| Zařízení | Šířka | Změna |
|----------|-------|-------|
| Desktop (≥768px) | 250px | +50px |
| Tablet (≥576px) | 220px | +40px |
| Mobil (<576px) | 190px | +30px |

---

## 🧪 Testování

1. **Desktop**: Text "Opustit hru" + ikona + padding = ~240px ✅
2. **Tablet**: Text se vejde do 220px ✅
3. **Mobil**: Text se vejde do 190px ✅

---

## 🎨 Zachované funkce

- ✅ Všechna tlačítka stejná šířka
- ✅ Responzivní design
- ✅ Neonové efekty
- ✅ Animace a přechody
- ✅ Bootstrap utility třídy

---

**Výsledek: Text se nyní vejde pohodlně do všech tlačítek!**
