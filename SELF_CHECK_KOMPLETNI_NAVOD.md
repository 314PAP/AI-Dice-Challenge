# 🤖 SELF-CHECK KOMPLETNÍ NÁVOD - AI Dice Challenge

**Datum aktualizace**: 13. července 2025

---

## 🚀 INSTALACE NA NOVÉM PC

### 1️⃣ Základní instalace
```bash
# Klonování projektu
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge

# Instalace závislostí
npm install

# Pro lepší výkon (volitelné)
sudo apt-get install inotify-tools

# Otevření ve VS Code
code .
```

### 2️⃣ Co se stane automaticky:
- ✅ **Auto Self-Check** - zkontroluje celý projekt
- ✅ **File Watcher** - spustí se na pozadí, sleduje změny  
- ✅ **Zobrazí pravidla** - připomene coding standards

**→ Hotovo! Můžeš začít programovat!**

---

## ⚡ KAŽDODENNÍ WORKFLOW

### 🎯 Super rychlé použití:

1. **Otevři VS Code**: `code .`
   - **→ AUTOMATICKY**: Self-check + file watcher

2. **Programuj normálně**
   - **→ AUTOMATICKY**: Validace při každé změně

3. **Když je validace úspěšná:**
   ```
   ❓ CHCEŠ COMMITNOUT A PUSHNOUT ZMĚNY?
   💬 [ENTER]
   ```
   - **→ AUTOMATICKY**: Commit + push

### 🛠️ Dostupné příkazy:

```bash
# Základní workflow
npm run dev         # Vývojářský server
npm run validate    # Smart validace (jen nové změny)
npm run commit      # Automatický commit + push

# Správa projektu  
npm run setup       # Zobrazí pravidla a workflow
npm run check       # Kompletní self-check systému
npm run validate-full # Plná validace (celý projekt)
npm run watch       # Manuální file watcher
npm run cleanup     # Úklid zastaralých souborů

# Build a formátování
npm run build       # Production build
npm run format      # Prettier formátování
npm run lint        # ESLint kontrola
npm run start       # HTTP server
```

---

## 🤖 CO JE SELF-CHECK SYSTÉM?

Automatický systém pro kontrolu kvality kódu a dodržování pravidel. **Spustí se automaticky při otevření VS Code** a hlídá kvalitu kódu v reálném čase.

### ⚙️ Automatické spuštění:

**Při otevření VS Code projektu:**
1. **Auto Self-Check** - zkontroluje celý projekt
2. **File Watcher** - spustí se na pozadí, sleduje změny
3. **Zobrazí pravidla** - připomene coding standards

**Konfigurováno v** `.vscode/tasks.json` s `"runOn": "folderOpen"`

---

## 🧠 DVA TYPY VALIDACE

### 1. 🚨 **Plná validace** (`npm run validate-full`)
- Kontroluje **celý projekt**
- **Blokuje commit** při jakékoliv chybě
- Vhodné pro finální kontrolu před release

### 2. 🧠 **Smart validace** (`npm run validate`) ⭐
- Kontroluje **jen nové změny** (git diff)
- **Reportuje** celkový stav projektu pro kontext
- **Blokuje** pouze nové chyby
- **Povolí commit** validních změn i s legacy kódem

**→ Používej smart validaci pro postupné zlepšování!**

---

## 📋 CO SYSTÉM KONTROLUJE?

### ❌ Kritické chyby (blokují commit):
- **Inline styly** - `style="..."` zakázáno
- **Nové JS řádky** - překročení limitu 3000 řádků
- **Nové vlastní CSS** - mimo povolené neon-* třídy
- **Nové z-index hodnoty** - mimo Bootstrap systém

### ⚠️ Varování (neblokují commit):
- Legacy kód s problémy
- Vlastní animace (preferuj knihovny)
- Starý CSS mimo Bootstrap

---

## 🚨 DŮLEŽITÁ PRAVIDLA

### 🎨 **CSS pravidla:**
- ❌ `style="..."` - ZAKÁZÁNO!
- ✅ Bootstrap třídy (`d-flex`, `text-center`, `btn-primary`)
- ✅ Neon třídy (`text-neon-green`, `btn-neon`, `border-neon-blue`)

### 💻 **JavaScript pravidla:**
- ❌ Max 3000 řádků celkem (pro hru kostek)
- ✅ Používej knihovny (lodash, ramda) místo vlastního kódu
- ✅ Malé moduly (max 150 řádků na soubor)

### 📖 **Bootstrap dokumentace:**
```
dokumentybtrap/grid.md      # Layout a grid systém
dokumentybtrap/spacing.md   # Margin/padding třídy
dokumentybtrap/colors.md    # Barevný systém
dokumentybtrap/buttons.md   # Tlačítka
dokumentybtrap/forms.md     # Formuláře
```

**→ VŽDY zkontroluj dokumentaci před psaním CSS!**

---

## 🔄 AUTOMATICKÝ WORKFLOW

### 📁 **File Watcher s inotify:**

Když změníš soubor v `src/`:
1. **inotify detekuje** změnu okamžitě (ne každé 2 sekundy!)
2. **Smart validace** zkontroluje pouze nové změny
3. **Nabídne commit** pokud je vše v pořádku
4. **Stiskneš ENTER** → automatický commit + push

### 📊 **Zprávy od inotify:**
```
Setting up watches. Beware: since -r was given, this may take a while!
Watches established.
```
- **Setting up watches** = Nastavuje sledování všech souborů v `src/`
- **Watches established** = Sledování je aktivní a připravené

### 🚀 **Commit workflow:**
1. **Smart validace** před commitem
2. **Zobrazí změny** k commitu  
3. **Automatická zpráva** nebo vlastní text
4. **Commit + push** do remote repository

---

## 📁 STRUKTURA PROJEKTU

### 🛠️ **Klíčové soubory:**

**Skripty:**
- `auto-selfcheck.sh` - hlavní self-check při otevření
- `smart-css-validation.sh` - smart validace (jen nové změny)
- `css-validation.sh` - plná validace (celý projekt)
- `smart-commit.sh` - automatický commit workflow
- `auto-watcher.sh` - file watcher pro změny
- `setup-project.sh` - zobrazí pravidla a workflow
- `cleanup-after-selfcheck.sh` - úklid zastaralých souborů

**Konfigurace:**
- `.vscode/tasks.json` - automatické spuštění při otevření
- `package.json` - npm skripty
- `.github/copilot-instructions.md` - pravidla pro Copilot

**Kód:**
- `src/js/game/` - Logika hry, správa stavu, mechaniky kostek
- `src/js/ai/` - AI osobnosti, chatovací odpovědi
- `src/js/ui/` - Manipulace s DOM, event handlery
- `src/js/utils/` - Pomocné funkce, konstanty
- `src/styles/` - CSS moduly (pouze neon-* rozšíření)

---

## 🚨 ŘEŠENÍ PROBLÉMŮ

### ❌ **File watcher nefunguje:**
```bash
npm run watch  # Spusť manuálně
```

### ❌ **Není nainstalován inotify:**
```bash
sudo apt-get install inotify-tools
# Pak restartuj VS Code
```

### ❌ **Self-check selhal:**
```bash
npm run validate    # Smart validace (jen nové chyby)  
npm run check       # Kompletní check systému
npm run setup       # Zobrazí pravidla
```

### ❌ **Commit blokován:**
- **Smart validace** blokuje jen nové chyby
- **Plná validace** blokuje vše
- **Řešení**: Používej `npm run validate` pro postupné zlepšování

### ❌ **Legacy kód má problémy:**
- **Smart validace** neblokuje legacy problémy
- **Postupně** refaktoruj podle priorit
- **Commit validní** nové změny i s legacy kódem

---

## 📊 VÝSLEDKY VALIDACE

### ✅ **Úspěch (Smart validace):**
```
🎉 COMMIT POVOLEN!
✅ Nové změny jsou v pořádku
💡 Starý kód může mít problémy, ale neblokují commit

📊 CELKOVÝ STAV PROJEKTU:
• JS řádky: 4650 (limit 3000)
• Nové chyby: 0
```

### ❌ **Chyba:**
```
🚨 VALIDACE SELHALA!
❌ Nelze commitnout - oprav chyby!
💡 Spusť: npm run validate
```

---

## 💡 TIPY PRO EFEKTIVNÍ PRÁCI

### 🚀 **Pro nové vývojáře:**
1. Spusť `npm run setup` pro zobrazení pravidel
2. Používej `npm run validate` místo `npm run validate-full`
3. Při problémech spusť `npm run check`
4. Vždy zkontroluj `dokumentybtrap/` před psaním CSS

### 🛠️ **Pro refaktoring:**
1. **Smart validace** umožní postupné zlepšování
2. Legacy kód neblokuje nové commity
3. Prioritizuj odstranění inline stylů a zkrácení JS
4. Používej CSS knihovny místo vlastních animací

### 🎯 **Pro deployment:**
1. Před release spusť `npm run validate-full`
2. Zkontroluj že prošel bez chyb
3. Pak teprve nasaď

### 📱 **Pro vývoj:**
```bash
npm run dev         # Vývojářský server s hot reload
npm run validate    # Kontrola po změnách
npm run commit      # Automatický commit
```

---

## 🎮 FINAL WORKFLOW

```bash
# 1. Setup na novém PC
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge  
npm install
code .

# 2. Každodenní práce
# → Otevři VS Code (automatický self-check + watcher)
# → Programuj (automatická validace)
# → Změň soubor → detekce → validace → [ENTER] → commit+push

# 3. Manuální příkazy (jen když potřebuješ)
npm run validate    # Kontrola
npm run commit      # Commit  
npm run setup       # Pravidla
```

---

## ✅ SHRNUTÍ

**🎯 Self-check systém zajišťuje kvalitu kódu bez blokování vývoje!**

- **🚀 Automatický** - spustí se při otevření VS Code
- **🧠 Smart** - blokuje jen nové chyby, ne legacy kód
- **⚡ Rychlý** - inotify detekuje změny okamžitě
- **🔄 Kompletní** - validace → commit → push automaticky

**→ Prostě otevři VS Code a začni programovat! Systém hlídá kvalitu automaticky!**

---

**📅 Poslední aktualizace: 13. července 2025**  
**🎲 AI Dice Challenge - Self-Check System v1.0**
