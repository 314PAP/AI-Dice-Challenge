# OPRAVA_SCORING_ALGORITMU.md

## Oprava výpočtu skóre pro správné pravidla Farkle

### Problém
Funkce `calculateScore` v `main-simple.js` měla nesprávnou implementaci výpočtu skóre, která nerespektovala pravidlo "Čtyři stejné = Trojice × 2".

### Příklad problému
Pro hod **1111** (čtyři jedničky):
- **Nesprávně**: 1000 (trojice) + 100 (zbývající) = **1100 bodů**
- **Správně**: 1000 × 2 (multiplikátor pro 4 stejné) = **2000 bodů**

### Oprava
Nahrazena celá `calculateScore` funkce správnou implementací z `diceLogic.js`, která obsahuje:

#### 1. Speciální kombinace
```javascript
// POSTUPKA (1-2-3-4-5-6) = 1500 bodů
if (diceValues.length === 6 && counts.every(count => count === 1)) {
    return 1500;
}

// TŘI PÁRY = 1500 bodů
if (pairs === 3 && counts.filter(count => count > 0).length === 3) {
    return 1500;
}
```

#### 2. Správný multiplikátor pro víc stejných kostek
```javascript
// Multiplikátor: 3=1x, 4=2x, 5=4x, 6=8x
let multiplier = counts[i] - 2; 
if (counts[i] >= 4) {
    multiplier = Math.pow(2, counts[i] - 3);
}
```

#### 3. Správné skóre podle pravidel
- **3 stejné**: základní skóre
- **4 stejné**: základní skóre × 2
- **5 stejných**: základní skóre × 4  
- **6 stejných**: základní skóre × 8

### Výsledek opravy

| Kombinace | Nesprávně | Správně |
|-----------|-----------|---------|
| 1111 | 1100 | **2000** |
| 11111 | 1200 | **4000** |
| 111111 | 1300 | **8000** |
| 2222 | 800 | **800** |
| 22222 | 1000 | **1600** |

### Další opravy
✅ **Speciální kombinace** jsou nyní implementovány:
- Postupka (1-2-3-4-5-6): 1500 bodů
- Tři páry: 1500 bodů

✅ **Konzistentní logika** s oficiálními pravidly Farkle

✅ **Lepší logging** pro debugování výpočtu skóre

### Testování
Nyní za hod **1111** správně dostanete **2000 bodů** místo nesprávných 1100 bodů.

**Datum opravy**: 2024-01-09
**Status**: ✅ HOTOVO
