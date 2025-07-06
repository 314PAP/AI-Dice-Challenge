# 🎲 FARKLE - Pravidla hry

## Základní pravidla

### Cíl hry
- Dosáhnout **10 000 bodů** (nebo jiného nastavitelného cíle)
- První hráč, který dosáhne cílového skóre, vyhrává

### Základní mechaniky

#### Vstup do hry
- **Minimální skóre pro vstup: 300 bodů v jednom tahu**
- Dokud hráč nezíska alespoň 300 bodů v jednom tahu, jeho skóre se neuchovává
- Po prvním dosažení 300+ bodů se hráč "dostává do hry" a všechny další body se započítávají

#### Bodování kostek

##### Jedničky (1)
- **1 kostka = 100 bodů**
- **3 kostky = 1000 bodů**
- **4 kostky = 1100 bodů** (1000 + 100)
- **5 kostek = 1200 bodů** (1000 + 200)
- **6 kostek = 1300 bodů** (1000 + 300)

##### Pětky (5)
- **1 kostka = 50 bodů**
- **3 kostky = 500 bodů**
- **4 kostky = 550 bodů** (500 + 50)
- **5 kostek = 600 bodů** (500 + 100)
- **6 kostek = 650 bodů** (500 + 150)

##### Ostatní čísla (2, 3, 4, 6)
- **Jednotlivé kostky = 0 bodů**
- **3 kostky = číslo × 100 bodů**
  - 3×2 = 200 bodů
  - 3×3 = 300 bodů
  - 3×4 = 400 bodů
  - 3×6 = 600 bodů
- **4+ kostky = základní body + (počet navíc × 100)**
  - 4×2 = 200 + 100 = 300 bodů
  - 5×3 = 300 + 200 = 500 bodů

#### Speciální kombinace
- **6 kostek různých hodnot (1,2,3,4,5,6) = 1500 bodů**
- **3 páry = 1500 bodů**
- **4 kostky + 1 pár = 1500 bodů**
- **2×3 kostky = 2500 bodů**

### Průběh tahu

#### 1. Hod kostkami
- Hráč hází všemi dostupnými kostkami (na začátku 6)
- Pokud v hodu nejsou žádné bodující kostky → **FARKLE**

#### 2. Výběr kostek
- Hráč **MUSÍ** vybrat alespoň některé bodující kostky
- Vybrané kostky se **odloží** a jejich body se přičtou k aktuálnímu tahu
- Nevybrané kostky zůstávají k dispozici pro další hod

#### 3. Rozhodnutí
Hráč má 3 možnosti:
- **A) Hodit znovu** - hází zbývajícími kostkami
- **B) Ukončit tah** - připíše si všechny nasbírané body z tahu
- **C) Hot Dice** - pokud použil všech 6 kostek, dostává 6 nových

#### 4. FARKLE
- Pokud hod neobsahuje žádné bodující kostky = FARKLE
- **Všechny body z aktuálního tahu se ztrácí**
- Tah přechází na dalšího hráče

### HOT DICE
- **Když hráč použije všech 6 kostek, dostává 6 nových**
- Body z předchozích hodů v tahu zůstávají
- Hráč pokračuje v tahu s 6 novými kostkami

### Ukončení hry
- **Hra končí, když někdo dosáhne cílového skóre**
- **Všichni ostatní hráči dostávají ještě jeden tah**
- **Vyhrává hráč s nejvyšším skóre**

## Implementační detaily

### Vstup do hry
```javascript
// Hráč není v hře
if (!player.hasEnteredGame) {
    if (turnScore >= 300) {
        player.hasEnteredGame = true;
        player.score += turnScore;
    }
    // Jinak se body nezapočítávají
} else {
    // Hráč je v hře - všechny body se započítávají
    player.score += turnScore;
}
```

### Kontrola bodování
```javascript
function calculateScore(dice) {
    // Spočítej frekvenci každého čísla
    const counts = {};
    dice.forEach(die => counts[die] = (counts[die] || 0) + 1);
    
    let score = 0;
    
    // Zpracuj každé číslo
    Object.entries(counts).forEach(([number, count]) => {
        const num = parseInt(number);
        
        if (num === 1) {
            // Jedničky: 3+ = 1000, zbytek × 100
            if (count >= 3) {
                score += 1000;
                score += (count - 3) * 100;
            } else {
                score += count * 100;
            }
        } else if (num === 5) {
            // Pětky: 3+ = 500, zbytek × 50
            if (count >= 3) {
                score += 500;
                score += (count - 3) * 50;
            } else {
                score += count * 50;
            }
        } else {
            // Ostatní: pouze 3+ kostky bodují
            if (count >= 3) {
                score += num * 100;
                score += (count - 3) * 100;
            }
        }
    });
    
    return score;
}
```

### Validace výběru
```javascript
function validateSelection(selectedDice, allDice) {
    const selectedValues = selectedDice.map(i => allDice[i]);
    const score = calculateScore(selectedValues);
    
    return score > 0; // Výběr musí mít alespoň 1 bod
}
```
