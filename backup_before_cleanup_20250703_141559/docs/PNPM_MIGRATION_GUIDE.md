# 🔧 VS Code Extensions + pnpm Migration - Návod a Status

## ✅ Dokončené VS Code rozšíření

### 🚀 **Nainstalovaná rozšíření:**
```bash
✅ esbenp.prettier-vscode          # Code formatting
✅ eamodio.gitlens                 # Git integration  
✅ christian-kohler.path-intellisense # Path autocomplete
✅ ms-vscode.vscode-typescript-next    # Enhanced TypeScript
✅ formulahendry.auto-rename-tag   # HTML tag sync
✅ oderwat.indent-rainbow          # Visual indentation
✅ ms-vscode.references-view       # Code references
✅ ritwickdey.liveserver          # Live development server
```

### 📋 **Zbývající rozšíření k manuální instalaci:**
```bash
# Spusťte v terminálu VS Code (Ctrl+`)
code --install-extension ms-vscode.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss  
code --install-extension ms-vscode.vscode-json
code --install-extension ms-vscode.sublime-keybindings
code --install-extension ms-vscode.js-debug
code --install-extension ms-vscode.live-server
code --install-extension ms-vscode.vscode-github-issue-notebooks
code --install-extension ms-vscode.bracket-pair-colorizer-2
code --install-extension ms-vscode.hexeditor
code --install-extension ms-vscode.git-graph
code --install-extension ms-vscode.powershell
code --install-extension ms-vscode.vscode-npm-dependency-links
code --install-extension ms-vscode.vscode-js-profile-flame
```

## 📦 pnpm Migration Status

### ⚠️ **pnpm instalace - Manuální kroky potřeba**

**Problém**: Automatická instalace pnpm se nezdařila v tomto prostředí.

### 🔧 **Manuální instalace pnpm:**

#### **Metoda 1: npm global install**
```bash
npm install -g pnpm
export PATH="$HOME/.npm-global/bin:$PATH"
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
```

#### **Metoda 2: curl install (doporučeno)**
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

#### **Metoda 3: wget install**
```bash
wget -qO- https://get.pnpm.io/install.sh | sh -
export PATH="$HOME/.local/share/pnpm:$PATH"
echo 'export PATH="$HOME/.local/share/pnpm:$PATH"' >> ~/.bashrc
```

### 🚀 **Po úspěšné instalaci pnpm:**

```bash
# 1. Ověř instalaci
pnpm --version

# 2. Import z npm (zachová package-lock.json struktura)
pnpm import

# 3. Instaluj závislosti (rychlejší než npm)
pnpm install

# 4. Testuj dev server
pnpm run dev

# 5. Odstranit starý npm cache (volitelné)
rm -rf node_modules package-lock.json
pnpm install
```

### 📊 **pnpm vs npm výhody:**

| Feature | npm | pnpm |
|---------|-----|------|
| **Rychlost** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Disk space** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Cache sharing** | ❌ | ✅ |
| **Monorepo support** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Security** | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 🎯 **pnpm workflow po migraci:**

```bash
# Místo npm install
pnpm install

# Místo npm run dev  
pnpm dev

# Místo npm install package
pnpm add package

# Místo npm install --save-dev package
pnpm add -D package

# Místo npm uninstall package
pnpm remove package
```

## 📋 **Aktuální status:**

### ✅ **Dokončeno:**
- ✅ 8 klíčových VS Code rozšíření nainstalováno
- ✅ pnpm helper scripty přidány do package.json
- ✅ Návod pro manuální dokončení vytvořen

### 🔄 **Čeká na dokončení:**
- 🔄 13 zbývajících VS Code rozšíření (manuálně)  
- 🔄 pnpm instalace (manuálně podle návodu výše)
- 🔄 Migrace z npm na pnpm workflow

### 🎮 **Dev server status:**
```bash
✅ npm run dev - funguje na http://localhost:5175/
🔄 pnpm run dev - bude fungovat po instalaci pnpm
```

## 🏁 **Další kroky:**

1. **Dokonči instalaci rozšíření**: Spusť zbývající `code --install-extension` příkazy
2. **Nainstaluj pnpm**: Použij jednu z metod výše
3. **Otestuj pnpm workflow**: `pnpm install && pnpm dev`
4. **Vychutnej si rychlejší development!** 🚀
