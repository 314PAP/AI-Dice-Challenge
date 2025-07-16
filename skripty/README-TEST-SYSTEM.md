# 🎲 AI DICE CHALLENGE - NOVÝ TEST SYSTÉM

## 📁 Struktura skriptů

```
skripty/
├── automatizace/          # Automatické procesy
│   ├── auto-selfcheck.sh         # Self-check při startu VS Code
│   ├── auto-watcher.sh           # Starý watcher (zachován)
│   └── smart-auto-watcher.sh     # Nový inteligentní watcher
├── testy/                 # Testovací skripty
│   ├── test-extended-suite.sh    # Extended test suite
│   ├── test-real-game-simulation.js  # Simulace skutečné hry
│   └── test-farkle-comprehensive.js  # Comprehensive Farkle test
├── validace/              # Validační skripty
│   ├── verify-copilot-system.sh     # Systémová validace
│   ├── css-validation.sh            # CSS validace
│   └── smart-css-validation.sh      # Smart CSS validace
└── hlavni-test.sh         # 🎯 HLAVNÍ TEST SYSTÉM
```

## 🚀 Nové NPM příkazy

```bash
# Interaktivní test systém (doporučený)
npm run test

# Rychlé testy (CSS + validace)
npm run test:quick

# Kompletní testy (všechno)
npm run test:full

# Validace systému
npm run check

# CSS validace
npm run validate

# Smart auto-watcher
npm run watch
```

## 🤖 Automatické funkce

### 1. Při startu VS Code
- Automaticky se spustí `auto-selfcheck.sh`
- Ověří systémovou konfiguraci
- Zobrazí dostupné příkazy

### 2. Smart Auto-Watcher
- Hlídá změny v `src/`, `skripty/` a root adresáři
- Detekuje typ změny (CSS, JS, HTML)
- **ZEPTÁ SE**, jestli chcete spustit testy
- Má cooldown mezi testy (5 sekund)

### 3. Hlavní test systém
- **Interaktivní režim**: Zeptá se, jaké testy spustit
- **Rychlé testy**: CSS validace + systémová kontrola
- **Kompletní testy**: Všechny dostupné testy

## 📋 Workflow

1. **Otevřete VS Code** → Auto self-check
2. **Začněte programovat** → Smart watcher hlídá změny
3. **Po změně** → Watcher se zeptá na testy
4. **Manuálně**: `npm run test` pro interaktivní volbu

## 🎯 Výhody nového systému

- ✅ **Čisté adresáře** - všechny skripty v `skripty/`
- ✅ **Interaktivní** - ptá se, nenutí
- ✅ **Inteligentní** - doporučuje testy podle typu změny
- ✅ **Cooldown** - nevyjede při každé drobné změně
- ✅ **Barevný výstup** - přehledný
- ✅ **NPM integrace** - snadné spouštění

## 🔧 Instalované funkce VS Code

- **Task**: "AI Dice Auto Self-Check" (při startu)
- **Task**: "AI Dice Smart Auto Watcher" (background)
- **Task**: "AI Dice Hlavní Test Systém" (manuálně)

## 🗑️ Smazané zastaralé soubory

- Všechny `test-*.sh` a `test-*.js` z root adresáře
- Staré debug skripty
- Nepoužívané automatizační skripty
- Duplicitní validační skripty
