# 🎲 AI Dice Challenge 1.0 - Pravidla hry

## 🎯 Cíl hry

Dosáhnout **10,000 bodů** jako první hráč.

## 🎮 Průběh tahu

1. **Házení** - Začnete s 6 kostkami
2. **Výběr** - Vyberte kostky s hodnotou (musíte vybrat alespoň jednu)
3. **Rozhodnutí** - Ukončit tah (zapsat body) nebo pokračovat

### ⚠️ Farkle

Pokud při házení nevyhodíte žádnou kostku s hodnotou → **FARKLE** = ztratíte všechny body z tahu.

## 💰 Bodování

### Jednotlivé kostky

- **1** = 100 bodů
- **5** = 50 bodů
- Ostatní čísla (2,3,4,6) = 0 bodů jednotlivě

### Kombinace

- **Tři stejných**: (trojice)

  - 1,1,1 = 1,000 bodů
  - 2,2,2 = 200 bodů
  - 3,3,3 = 300 bodů
  - 4,4,4 = 400 bodů
  - 5,5,5 = 500 bodů
  - 6,6,6 = 600 bodů
- **Více stejných**:

  - Čtyři stejných = 2× body za trojici
  - Pět stejných = 4× body za trojici
  - Šest stejných = 5,000 bodů
- **Speciální kombinace**:

  - **Tři páry** (např. 2,2,4,4,6,6) = 1,500 bodů
  - **Postupka** (1,2,3,4,5,6) = 2,000 bodů

## 🔥 Hot Dice

Když odložíte všech 6 kostek, nastává **Hot Dice**:

- MUSÍTE pokračovat házením se všemi 6 kostkami
- Nemůžete ukončit tah
- Získané body se sčítají s předchozími

## 🚪 První vstup

- Váš první zápis musí být alespoň **300 bodů**
- Dokud nedosáhnete 300 bodů, nemůžete si zapsat skóre

## 🎲 Příklady

### Příklad 1: Základní tah

Hodíte: 1, 1, 3, 4, 5, 5

- Můžete vybrat: 1,1,5,5 = 300 bodů
- Rozhodnutí: Ukončit (zapsat 300) nebo házet zbývajícími 3 kostkami

### Příklad 2: Hot Dice

Hodíte: 1, 1, 1, 5, 5, 5

- Vyberete: 1,1,1 = 1,000 bodů a 5,5,5 = 500 bodů
- Odložili jste všech 6 kostek → **HOT DICE**
- MUSÍTE házet znovu se všemi 6 kostkami

### Příklad 3: Tři páry

Hodíte: 2, 2, 4, 4, 6, 6

- Tři páry = 1,500 bodů
- Všechny kostky jsou použité → **HOT DICE**

### Příklad 4: Farkle

Hodíte: 2, 3, 4, 6, 6, 2

- Žádná kostka nemá hodnotu → **FARKLE**
- Ztratíte všechny body z tahu

## 🤖 AI protivníci

Hra obsahuje 3 AI s různými strategiemi:

- **Gemini** 🔵 - Analytický stratég (riskantní)
- **ChatGPT** � - Vyvážený hráč (střední riziko)
- **Claude** � - Opatrný taktik (konzervativní)

## 🏆 Vítězství

- **Vítězí** první hráč, který dosáhne nastaveného počtu bodů.
- Ostatní hráči mají ještě jeden tah na překonání skóre
- Při remíze vítězí hráč s vyšším skóre

---

**Tip**: Začínající hráči by měli ukončovat tahy dříve. Zkušení hráči mohou riskovat pro vyšší skóre!
