# 🚀 QUICK REFERENCE - AI Dice Challenge

## ⚡ Super rychlý start na novém PC

```bash
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge
npm install
code .
```

**→ Hotovo! Vše automatické! Prostě programuj.**

---

## 🎯 Každodenní workflow

### 1. Otevři VS Code
```bash
code .
```
**→ AUTOMATICKY: Self-check + file watcher**

### 2. Programuj normálně
**→ AUTOMATICKY: Validace při každé změně**

### 3. Commit
**Když je validace úspěšná:**
```
❓ CHCEŠ COMMITNOUT A PUSHNOUT ZMĚNY?
💬 [ENTER]
```
**→ AUTOMATICKY: Commit + push**

---

## 🛠️ Nouzové příkazy

```bash
npm run setup       # Zobrazí pravidla
npm run check       # Self-check systému  
npm run validate    # Smart validace (jen nové změny)
npm run validate-full # Plná validace (celý projekt)
npm run commit      # Manuální commit
npm run dev         # Vývojářský server
```

---

## 🚨 Důležitá pravidla

### CSS:
- ❌ `style="..."` - ZAKÁZÁNO!
- ✅ Bootstrap třídy (`d-flex`, `text-center`)
- ✅ Neon třídy (`text-neon-green`, `btn-neon`)

### JavaScript:
- ❌ Max 3000 řádků celkem
- ✅ Používej knihovny (lodash, ramda)
- ✅ Malé moduly

### Bootstrap docs:
```
dokumentybtrap/grid.md      # Layout
dokumentybtrap/spacing.md   # Margin/padding  
dokumentybtrap/colors.md    # Barvy
```

---

## 🧠 Smart validace

### ✅ Povolí commit i s legacy kódem:
- **Blokuje**: jen NOVÉ chyby v git diff
- **Reportuje**: celkový stav projektu
- **Umožňuje**: postupné zlepšování

### 🚨 Plná validace (legacy):
```bash
npm run validate-full  # Blokuje vše při chybě
```

---

## 🔧 Řešení problémů

### File watcher nefunguje:
```bash
npm run watch  # Spusť manuálně
```

### Self-check selhal:
```bash
npm run validate  # Zjisti chyby
npm run check     # Kompletní check
```

### VS Code tasky nefungují:
`Ctrl+Shift+P` → "Tasks: Run Task" → "AI Dice Auto Self-Check"

---

**🎮 Prostě programuj a systém se postará o zbytek! 🚀**
