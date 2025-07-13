# 🎲 AI DICE CHALLENGE - INSTALAČNÍ NÁVOD

## 🚀 RYCHLÁ INSTALACE (TL;DR)

```bash
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge
npm install
code .
```

**→ Hotovo! Super-automatický workflow je aktivní!**

---

## 📋 KOMPLETNÍ NÁVOD PRO NOVÉ PC

### 1️⃣ **PŘEDPOKLADY**

Nainstaluj si tyto nástroje (pokud je nemáš):

#### **Node.js & npm**
```bash
# Stáhni z: https://nodejs.org/
# Nebo přes package manager:
sudo apt install nodejs npm  # Ubuntu/Debian
brew install node           # macOS
```

#### **Git**
```bash
sudo apt install git        # Ubuntu/Debian
brew install git            # macOS
# Windows: https://git-scm.com/
```

#### **Visual Studio Code**
```bash
# Stáhni z: https://code.visualstudio.com/
# Nebo:
sudo snap install code --classic  # Ubuntu
brew install --cask visual-studio-code  # macOS
```

### 2️⃣ **STAŽENÍ PROJEKTU**

#### **Klonování z GitHubu:**
```bash
# Přejdi do složky, kde chceš mít projekt
cd ~/Documents/projects

# Naklonuj repository
git clone https://github.com/314PAP/AI-Dice-Challenge.git

# Přejdi do složky projektu
cd AI-Dice-Challenge
```

### 3️⃣ **INSTALACE ZÁVISLOSTÍ**

```bash
# Nainstaluj všechny npm závislosti
npm install
```

**✨ Při této instalaci se AUTOMATICKY spustí:**
- `postinstall` hook → `setup-project.sh`
- Nastavení oprávnění pro všechny skripty
- Zobrazení workflow instrukcí

### 4️⃣ **SPUŠTĚNÍ VS CODE**

```bash
# Otevři projekt ve VS Code
code .
```

**✨ Při otevření VS Code se AUTOMATICKY spustí:**
- `auto-selfcheck.sh` - kontrola všech pravidel
- `auto-watcher.sh` - sledování změn v kódu
- Zobrazení stavu projektu

---

## 🔧 ARCHITEKTURA AUTOMATICKÉHO SYSTÉMU

### **Klíčové soubory:**

#### **📦 Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite --host",           // Vývojářský server
    "setup": "./setup-project.sh",  // Zobrazí workflow
    "check": "./verify-copilot-system.sh", // Self-check
    "validate": "./css-validation.sh", // Validace kódu
    "commit": "./smart-commit.sh",   // Manuální commit
    "watch": "./auto-watcher.sh",    // File watcher
    "postinstall": "./setup-project.sh" // Auto při npm install
  }
}
```

#### **🤖 Automatické skripty:**

| Soubor | Popis | Kdy se spouští |
|--------|-------|----------------|
| `setup-project.sh` | Zobrazuje workflow pravidla | `npm install`, `npm run setup` |
| `auto-selfcheck.sh` | Kontroluje systém a pravidla | Při otevření VS Code |
| `auto-watcher.sh` | Sleduje změny a validuje | Při otevření VS Code (background) |
| `verify-copilot-system.sh` | Kompletní self-check | `npm run check` |
| `css-validation.sh` | Validace CSS pravidel | Automaticky při změnách |
| `smart-commit.sh` | Commit s automatickou zprávou | Po potvrzení při validaci |

#### **⚙️ VS Code konfigurace:**

**`.vscode/tasks.json`:**
```json
{
  "tasks": [
    {
      "label": "AI Dice Auto Self-Check",
      "runOptions": { "runOn": "folderOpen" },
      "command": "./auto-selfcheck.sh"
    },
    {
      "label": "AI Dice Auto Watcher", 
      "runOptions": { "runOn": "folderOpen" },
      "command": "./auto-watcher.sh",
      "isBackground": true
    }
  ]
}
```

---

## 🎯 WORKFLOW NA NOVÉM PC

### **1. Instalace (jednou):**
```bash
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge
npm install
```

### **2. Každodenní práce:**
```bash
code .  # Otevři VS Code
# → AUTOMATICKY se spustí self-check + file watcher
# → Programuj normálně
# → Po změně se AUTOMATICKY zeptá na commit
# → Stiskni ENTER pro commit+push
```

---

## 🚨 KRITICKÁ PRAVIDLA SYSTÉMU

### **CSS Zásady:**
- ❌ **ZAKÁZÁNY** inline styly (`style="..."`)
- ❌ **ZAKÁZÁNO** vlastní CSS mimo povolené soubory
- ✅ **POUŽÍVEJ** Bootstrap utility třídy
- ✅ **POUŽÍVEJ** naše neon-* rozšíření

### **JavaScript Zásady:**
- ❌ **MAX 3000 řádků** JS kódu celkem
- ✅ **POUŽÍVEJ** JS knihovny (lodash, ramda)
- ✅ **MODULARITA** - malé soubory, jedna zodpovědnost

### **Bootstrap Dokumentace:**
```
dokumentybtrap/grid.md      - Grid systém
dokumentybtrap/colors.md    - Barevný systém  
dokumentybtrap/spacing.md   - Spacing utility
dokumentybtrap/buttons.md   - Tlačítka
dokumentybtrap/forms.md     - Formuláře
```

---

## 🔍 DOSTUPNÉ PŘÍKAZY

### **Automatické (nepotřebuješ spouštět):**
- Při `npm install` → `setup-project.sh`
- Při otevření VS Code → `auto-selfcheck.sh` + `auto-watcher.sh`
- Při změně kódu → `css-validation.sh`

### **Manuální (pokud potřebuješ):**
```bash
npm run dev      # Vývojářský server
npm run setup    # Zobrazí workflow
npm run check    # Kompletní self-check
npm run validate # Manuální validace
npm run commit   # Manuální commit
npm run watch    # Manuální file watcher
```

---

## 🆘 ŘEŠENÍ PROBLÉMŮ

### **Problem: Self-check selhal**
```bash
npm run validate  # Zkontroluj chyby
npm run check     # Kompletní diagnostika
```

### **Problem: File watcher nefunguje**
```bash
# Nainstaluj inotify-tools (Linux)
sudo apt-get install inotify-tools

# Nebo spusť manuálně
npm run watch
```

### **Problem: Oprávnění skriptů**
```bash
chmod +x *.sh  # Nastav oprávnění všem skriptům
```

### **Problem: VS Code tasky se nespouštějí**
1. Otevři VS Code
2. `Ctrl+Shift+P` → "Tasks: Run Task"
3. Vyber "AI Dice Auto Self-Check"

---

## 🎉 HOTOVO!

Po dokončení instalace máš:

✅ **Automatický self-check** při otevření VS Code  
✅ **Automatická validace** při každé změně  
✅ **Automatické dotázání** na commit  
✅ **Jen ENTER** pro commit+push  
✅ **Plná portabilita** na jakékoliv PC  

**Workflow: Otevři VS Code → Programuj → ENTER → Hotovo! 🚀**
