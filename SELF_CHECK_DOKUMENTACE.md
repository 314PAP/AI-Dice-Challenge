# 🤖 SELF-CHECK SYSTÉM - Kompletní dokumentace

**Datum aktualizace**: 13. července 2025

## 🎯 Co je Self-Check systém?

Automatický systém pro kontrolu kvality kódu a dodržování pravidel v AI Dice Challenge projektu. Spustí se automaticky při otevření VS Code a hlídá kvalitu kódu v reálném čase.

## ⚡ Automatické spuštění

### Při otevření VS Code projektu:
1. **Auto Self-Check** - zkontroluje celý projekt
2. **File Watcher** - spustí se na pozadí, sleduje změny
3. **Zobrazí pravidla** - připomene coding standards

### Konfigurováno v `.vscode/tasks.json`:
```json
{
    "runOptions": {
        "runOn": "folderOpen"
    }
}
```

## 🔍 Dva typy validace

### 1. 🚨 **Plná validace** (`npm run validate-full`)
- Kontroluje **celý projekt**
- **Blokuje commit** při jakékoliv chybě
- Vhodné pro finální kontrolu před release

### 2. 🧠 **Smart validace** (`npm run validate`)
- Kontroluje **jen nové změny** (git diff)
- **Reportuje** celkový stav projektu
- **Blokuje** pouze nové chyby
- **Povolí commit** validních změn i s legacy kódem

## 📋 Co kontroluje?

### ❌ Kritické chyby (blokují commit):
- **Inline styly** - `style="..."` zakázáno
- **Nové JS řádky** - překročení limitu 3000 řádků
- **Nové vlastní CSS** - mimo povolené neon-* třídy
- **Nové z-index hodnoty** - mimo Bootstrap systém

### ⚠️ Varování (neblokují commit):
- Legacy kód s problémy
- Vlastní animace (preferuj knihovny)
- Starý CSS mimo Bootstrap

## 🛠️ Dostupné příkazy

```bash
npm run setup      # Zobrazí pravidla a workflow
npm run check      # Kompletní self-check systému
npm run validate   # Smart validace (jen nové změny)
npm run validate-full # Plná validace (celý projekt)
npm run commit     # Smart commit s automatickou validací
npm run watch      # Manuální spuštění file watcheru
```

## 🔄 Automatický workflow

### Při změně souboru:
1. **File watcher detekuje** změnu v `src/`
2. **Smart validace** zkontroluje pouze nové změny
3. **Nabídne commit** pokud je vše v pořádku
4. **Stiskneš ENTER** → automatický commit + push

### Při commitu:
1. **Smart validace** před commitem
2. **Zobrazí změny** k commitu
3. **Automatická zpráva** nebo vlastní text
4. **Commit + push** do remote repository

## 📁 Klíčové soubory

### Skripty:
- `auto-selfcheck.sh` - hlavní self-check při otevření
- `smart-css-validation.sh` - smart validace (jen nové změny)
- `css-validation.sh` - plná validace (celý projekt)
- `smart-commit.sh` - automatický commit workflow
- `auto-watcher.sh` - file watcher pro změny
- `setup-project.sh` - zobrazí pravidla a workflow

### Konfigurace:
- `.vscode/tasks.json` - automatické spuštění při otevření
- `package.json` - npm skripty
- `.github/copilot-instructions.md` - pravidla pro Copilot

### Dokumentace:
- `QUICK_REFERENCE.md` - rychlý návod
- `INSTALACNI_NAVOD.md` - instalace na novém PC
- `SELF_CHECK_DOKUMENTACE.md` - tento soubor

## 🚨 Řešení problémů

### File watcher nefunguje:
```bash
npm run watch  # Spusť manuálně
```

### Syntax error v auto-watcher.sh:
- Zkontroluj duplicitní `else` bloky
- Spusť: `bash -n auto-watcher.sh`

### Self-check selhal:
```bash
npm run validate  # Zjisti chyby
npm run check     # Kompletní check
```

### Commit blokován:
- **Smart validace** blokuje jen nové chyby
- **Plná validace** blokuje vše
- Používej `npm run validate` pro postupné zlepšování

## 💡 Tipy

### Pro nové vývojáře:
1. Spusť `npm run setup` pro zobrazení pravidel
2. Používej `npm run validate` místo `npm run validate-full`
3. Při problémech spusť `npm run check`

### Pro refaktoring:
1. **Smart validace** umožní postupné zlepšování
2. Legacy kód neblokuje nové commity
3. Prioritizuj odstranění inline stylů a zkrácení JS

### Pro deployment:
1. Před release spusť `npm run validate-full`
2. Zkontroluj že prošel bez chyb
3. Pak teprve nasaď

## 📊 Výsledky validace

### ✅ Úspěch:
```
🎉 COMMIT POVOLEN!
✅ Nové změny jsou v pořádku
💡 Starý kód může mít problémy, ale neblokují commit
```

### ❌ Chyba:
```
🚨 VALIDACE SELHALA!
❌ Nelze commitnout - oprav chyby!
💡 Spusť: npm run validate
```

### 📊 Přehled:
```
📊 CELKOVÝ STAV PROJEKTU:
• JS řádky: 4650 (limit 3000)
• Nové chyby: 0
```

---

**🎯 Self-check systém zajišťuje kvalitu kódu bez blokování vývoje!**
