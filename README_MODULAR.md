# 🎲 AI Kostková Výzva - Modulární Architektura v2.0

## 🚀 Projekt Status: Fáze 1-2 Dokončeno ✅

**Datum aktualizace:** 1.7.2025  
**Verze:** 2.0 - Modulární refactor  
**Stav:** 60% dokončeno, hra plně funkční

---

## 📋 Co je nového v v2.0

### 🏗️ **Kompletní architektonické přepracování**
Projekt prošel masivním refactorem s cílem vytvoření **nejčistší a nejudržitelnější** herní kódové báze:

- ✅ **39 specializovaných modulů** místo monolitických souborů
- ✅ **Průměrná velikost souboru: 95 řádků** (dříve 180+)
- ✅ **Žádné inline styly/scripts** v HTML
- ✅ **Modulární import struktura** pro snadnou údržbu
- ✅ **Jasné rozdělení zodpovědností** mezi komponenty

### 📊 **Metriky úspěchu:**
```
PŘED REFAKTOREM:          PO REFAKTORU:
────────────────          ─────────────
• 4 soubory >600 řádků    • 39 modulů ≤150 řádků
• Největší: 769 řádků     • Největší: 140 řádků  
• Monolitická arch.       • Modulární design
• Složitá údržba          • Snadná rozšiřitelnost
```

---

## 🏗️ Nová modulární struktura

### **JavaScript Moduly**
```
src/game/controllers/
├── 🎮 MainGameController.js     → Orchestrátor (85 řádků)
├── 🚀 GameInitializer.js        → Inicializace (70 řádků)
├── 🎲 DiceController.js         → Logika kostek (120 řádků)
├── 📊 ScoreController.js        → Farkle scoring (85 řádků)
├── 🔄 TurnController.js         → Řízení tahů (115 řádků)
├── 🖥️ UIUpdateController.js     → UI aktualizace (95 řádků)
└── 🎯 GameStateController.js    → Stav hry (120 řádků)
```

### **CSS Moduly**
```
src/styles/
├── base/
│   ├── 🎨 variables.css         → CSS proměnné (85 řádků)
│   ├── 📝 typography.css        → Fonty & text (120 řádků)
│   └── 🔄 reset.css            → CSS reset
├── layout/
│   ├── 📐 main.css             → Layout kontejnery (75 řádků)
│   └── 🔲 grid.css             → Grid systém (110 řádků)
├── game/
│   ├── 🔘 buttons.css          → Herní tlačítka (85 řádků)
│   ├── 🎲 dice.css             → Kostky & animace (95 řádků)
│   ├── 📊 scoreboard.css       → Skóre & statistiky (120 řádků)
│   ├── 🎯 gameArea.css         → Herní layout (100 řádků)
│   ├── 📋 modals.css           → Modální okna (140 řádků)
│   └── ✨ animations.css       → CSS animace (90 řádků)
└── utils/
    └── 🛠️ utilities.css        → Helper třídy (140 řádků)
```

---

## 🎯 Architektonické principy

### **1. Single Responsibility Principle**
Každý modul má **jednu jasnou zodpovědnost**:
- `DiceController` = pouze logika kostek
- `ScoreController` = pouze výpočty bodů
- `UIUpdateController` = pouze UI aktualizace

### **2. Modularity & Reusability**
- **Čistá separace** business logiky od UI
- **Znovupoužitelné komponenty** pro budoucí rozšíření
- **Jasné API** mezi moduly

### **3. Maintainability First**
- **Max 150 řádků** per soubor pro snadné čtení
- **Standardní import/export** struktura
- **Konzistentní jmenné konvence**
- **JSDoc dokumentace** pro všechny exporty

---

## 🔧 Jak pracovat s novou architekturou

### **Přidání nové funkce:**
1. Identifikuj odpovědný modul (např. `DiceController` pro kostky)
2. Pokud modul neexistuje, vytvoř nový ≤150 řádků
3. Použij jasné import/export
4. Aktualizuj hlavní controller

### **Úprava stylů:**
1. Najdi odpovídající CSS modul (např. `game/buttons.css`)
2. Pokud neexistuje, vytvoř specializovaný modul
3. Přidej @import do příslušného hub souboru
4. Dodržuj CSS proměnné z `base/variables.css`

### **Debugging:**
- Každý modul má jasné console.log zprávy
- Použij browser dev tools pro inspect modulů
- Všechny funkce jsou exportované → snadné testování

---

## 🔄 Zbývající práce (Fáze 3)

### **Prioritní soubory k rozdělení:**
1. `gameController.js` (659 řádků) → 6 modulů
2. `playerTurnController.js` (553 řádků) → 5 modulů
3. `gameUIController.js` (412 řádků) → 4 moduly
4. `layout.css` (402 řádků) → 4 moduly
5. `gameEventController.js` (336 řádků) → 4 moduly

### **Časový plán:**
- **Zítra:** Dokončení fáze 3 (zbývajících 5 souborů)
- **Pozítří:** Finální cleanup a dokumentace
- **Výsledek:** 100% modulární, maintainable kód

---

## 🎮 Jak spustit hru

```bash
# Naklonování
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge

# Instalace
npm install

# Spuštění dev serveru
npm run dev
# → http://localhost:5173

# Build pro produkci
npm run build
```

### **Požadavky:**
- Node.js 16+
- Moderní prohlížeč s ES6+ podporou
- Vite build tool

---

## 🏆 Klíčové výhody v2.0

### **Pro vývojáře:**
- 🔍 **Snadné hledání** kódu díky logické struktuře
- 🛠️ **Rychlé úpravy** bez ovlivnění jiných částí
- 📈 **Škálovatelnost** pro budoucí rozšíření
- 🐛 **Jednodušší debugging** díla modularitě

### **Pro údržbu:**
- 🔧 **Nezávislé moduly** → lokalizované změny
- 📚 **Jasná dokumentace** → rychlé onboarding
- ✅ **Testovatelnost** → každý modul je samostatný
- 🚀 **Performance** → optimalizovaný import tree

### **Pro budoucnost:**
- 📦 **Plugin architektura** → snadné přidání AI modelů
- 🎨 **Theme systém** → rychlé změny designu
- 🌐 **Internationalization** ready
- 📱 **PWA ready** struktura

---

## 📞 Podpora

**GitHub:** https://github.com/314PAP/AI-Dice-Challenge  
**Issues:** Pro bug reporty a feature requesty  
**Discussions:** Pro obecné otázky o architektuře

---

**🎯 Cíl:** Vytvořit referenční implementaci modulární herní architektury v JavaScriptu s důrazem na maintainability a clean code principy.

**✨ Status:** Mise na 60% splněna, pokračování zítra! 🚀
