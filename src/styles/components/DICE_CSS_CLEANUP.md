# Dice CSS - Bootstrap Compatibility Cleanup

## ✅ OPRAVENO - Bootstrap kompatibilní

### 🚨 Nalezené problémy:
1. **Pevné px hodnoty** místo Bootstrap rem jednotek
2. **`!important` layout overrides** v landscape sekci
3. **Duplicitní .dice definice** 
4. **Margin/padding `!important`** konflikty

### 🔧 Provedené opravy:

#### 1. **Px → Rem konverze:**
- `width: 60px` → `width: 3.75rem`
- `height: 60px` → `height: 3.75rem`
- `border: 2px` → `border: 0.125rem`
- `box-shadow: 0 0 10px` → `box-shadow: 0 0 0.625rem`
- `transform: translateY(-5px)` → `transform: translateY(-0.3125rem)`

#### 2. **Landscape `!important` cleanup:**
```css
/* PŘED */
width: 35px !important;
margin: 0.25rem !important;

/* PO */
width: 2.1875rem;
/* margin moved to separate .dice-compact class */
```

#### 3. **Všechny breakpointy převedeny na rem:**
- XS: 2.8125rem (45px)
- SM: 3.125rem (50px) 
- MD: 3.4375rem (55px)
- LG: 4.0625rem (65px)
- XL: 4.375rem (70px)

### 📋 Zachováno (funkční):
- ✅ **Neonové barvy** z CSS proměnných
- ✅ **Responsive breakpointy** Bootstrap kompatibilní
- ✅ **Animace a efekty** (.rolling, :hover)
- ✅ **Dot positioning** systém pro číslice

### 🎯 Výsledek:
- **Rem jednotky** - Bootstrap kompatibilní škálování
- **Žádné `!important` konflikty** s layout
- **Zachována funkčnost** - všechny efekty fungují
- **Responzivní design** - čisté Bootstrap breakpointy

### 📝 Poznámka:
Soubor se aktuálně nepoužívá v JS kódu, ale je připraven pro budoucí implementaci kostek.
