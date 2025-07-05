# 🎯 Progresivní zvětšování tlačítek - Bootstrap-first responsivity

## Implementované změny

### 🎯 Cíl
Progresivní zvětšování tlačítek podle šířky obrazovky - od malých mobilních po velké desktopové displeje, aby se optimálně využil dostupný prostor.

### 📐 Nové rozměry tlačítek (progresivní škálování)

| Breakpoint | Šířka obrazovky | Šířka tlačítka | Font-size | Padding |
|------------|-----------------|----------------|-----------|---------|
| **XXL** | ≥1400px | **320px** | 1.3rem | 1.4rem 3rem |
| **XL** | ≥1200px | **300px** | 1.2rem | 1.2rem 2.5rem |
| **LG** | ≥992px | **280px** | 1.1rem | 1rem 2rem |
| **MD** | ≥768px | **250px** | 1rem | Bootstrap default |
| **SM** | ≥576px | **220px** | 1rem | Bootstrap default |
| **XS** | <576px | **190px** | 1rem | Bootstrap default |

### 🔧 Bootstrap-first implementace

#### 1. Progresivní šířka tlačítek
```css
/* Od největších k nejmenším */
.menu-btn-uniform {
  width: 320px !important; /* XXL Desktop - nejvetší šířka */
}

@media (max-width: 1399.98px) {
  .menu-btn-uniform {
    width: 300px !important; /* XL Desktop */
  }
}

@media (max-width: 1199.98px) {
  .menu-btn-uniform {
    width: 280px !important; /* LG Desktop */
  }
}

/* ... další breakpointy ... */
```

#### 2. Progresivní font-size
```css
@media (min-width: 1400px) {
  .menu-btn-uniform {
    font-size: 1.3rem !important; /* XXL Desktop - největší font */
  }
}

@media (min-width: 1200px) {
  .menu-btn-uniform {
    font-size: 1.2rem !important; /* XL Desktop */
  }
}

@media (min-width: 992px) {
  .menu-btn-uniform {
    font-size: 1.1rem !important; /* LG Desktop */
  }
}
```

#### 3. Progresivní padding
```css
@media (min-width: 1400px) {
  .menu-btn-uniform {
    padding: 1.4rem 3rem !important; /* XXL - největší padding */
  }
}

@media (min-width: 1200px) {
  .menu-btn-uniform {
    padding: 1.2rem 2.5rem !important; /* XL */
  }
}

@media (min-width: 992px) {
  .menu-btn-uniform {
    padding: 1rem 2rem !important; /* LG */
  }
}
```

### 🎨 Výhody progresivního designu

1. **Optimální využití prostoru** - tlačítka se zvětšují s obrazovkou
2. **Lepší UX** - větší tlačítka jsou lépe klikatelná na velkých obrazovkách
3. **Vizuální harmonie** - nevznikají prázdná místa
4. **Bootstrap-first** - používá oficiální Bootstrap breakpointy
5. **Smooth scaling** - plynulé přechody mezi velikostmi

### 📱 Responsive behavior

#### Mobil (320px - 575px)
- Kompaktní tlačítka (190px)
- Standardní font-size
- Minimální padding

#### Tablet (576px - 767px)
- Mírně větší tlačítka (220px)
- Zachován standardní font

#### Desktop MD (768px - 991px)
- Základní desktop velikost (250px)
- Standardní vzhled

#### Desktop LG (992px - 1199px)
- Větší tlačítka (280px)
- Větší font (1.1rem)
- Větší padding

#### Desktop XL (1200px - 1399px)
- Velká tlačítka (300px)
- Větší font (1.2rem)
- Velký padding

#### Desktop XXL (1400px+)
- Největší tlačítka (320px)
- Největší font (1.3rem)
- Největší padding

### 🔧 Technické detaily

- **Breakpointy**: Oficiální Bootstrap 5 breakpointy
- **Mobile-first**: Media queries od největších dolů
- **Jednotnost**: Všechna tlačítka stále stejná šířka
- **Flexibilita**: Snadná úprava hodnot v CSS

### 🎯 Výsledek

- **Mobil**: Kompaktní, funkční tlačítka
- **Tablet**: Přiměřeně velká tlačítka
- **Desktop**: Progresivně rostoucí tlačítka
- **4K+ monitory**: Velká, dobře čitelná tlačítka

---

**✨ Tlačítka se nyní progresivně zvětšují s obrazovkou pro optimální UX!**
