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
- **4 kostky = 2000 bodů**
- **5 kostek = 3000 bodů**
- **6 kostek = 4000 bodů**

##### Pětky (5)
- **1 kostka = 50 bodů**
- **3 kostky = 500 bodů**
- **4 kostky = 1000 bodů**
- **5 kostek = 1500 bodů**
- **6 kostek = 2000 bodů**

##### Ostatní čísla (2, 3, 4, 6)
- **3 kostky = hodnota × 100** (např. tři trojky = 300 bodů)
- **4 kostky = hodnota × 200** (např. čtyři trojky = 600 bodů)
- **5 kostek = hodnota × 300** (např. pět trojek = 900 bodů)
- **6 kostek = hodnota × 400** (např. šest trojek = 1200 bodů)

##### Speciální kombinace
- **Straight (1,2,3,4,5,6) = 1500 bodů**
- **3 páry = 1500 bodů**
- **4 stejné + 2 stejné = 1500 bodů**
- **2 trojky = 2500 bodů**

### Průběh hry

#### Na tahu
1. Hráč hodí všemi 6 kostkami
2. Vybere kostky, které bodují (povinné!)
3. Může se rozhodnout:
   - **Banknout** - přidat body k celkovému skóre a předat tah
   - **Pokračovat** - hodit zbývajícími kostkami pro více bodů

#### FARKLE
- Pokud hod neobsahuje žádné bodující kostky = **FARKLE**
- Hráč ztrácí všechny body z aktuálního tahu
- Tah přechází na dalšího hráče

#### Hot Dice
- Pokud hráč vybere všech 6 kostek, dostane nových 6 kostek
- Může pokračovat ve stejném tahu

### Strategie
- **Konzervativní**: Banknout při menším počtu bodů pro jistotu
- **Agresivní**: Riskovat a pokračovat pro více bodů
- **Balanced**: Přizpůsobit strategii podle situace ve hře

### AI protivníci
- **Gemini**: Analytický přístup, kalkuluje pravděpodobnosti
- **ChatGPT**: Kreativní strategie, občas překvapivé tahy
- **Claude**: Konzervativní a opatrný přístup
