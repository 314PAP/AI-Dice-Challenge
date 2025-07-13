#!/bin/bash

# 🧹 CLEANUP SCRIPT - Úklid po self-check systému aktualizaci
# ════════════════════════════════════════════════════════════

echo ""
echo "🧹 ÚKLID PO SELF-CHECK SYSTÉMU AKTUALIZACI"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Kontrola, že jsme v správném adresáři
if [ ! -f "package.json" ]; then
    echo "❌ Nejste ve správném adresáři projektu!"
    exit 1
fi

echo "🔍 Hledám zastaralé a duplikované soubory..."
echo "────────────────────────────────────────────────────────────────────"

# Počítadlo smazaných souborů
deleted_count=0

# Funkce pro bezpečné mazání
safe_delete() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "🗑️  Mažu: $file"
        rm "$file"
        ((deleted_count++))
    fi
}

# 1. Zastaralé test soubory (ponecháme jen nejdůležitější)
echo "1️⃣ Čistím zastaralé test soubory..."

# Starší test soubory - ponecháme jen hlavní
safe_delete "test-css-specifity.html"
safe_delete "test-no-colors.html" 
safe_delete "test-with-colors.html"
safe_delete "test-js-debug.html"
safe_delete "test-dom-stability.html"
safe_delete "test-ultra-mobile.html"
safe_delete "test-iphone5-se.html"

# 2. Backup soubory které už nejsou potřeba
echo "2️⃣ Čistím zastaralé backup soubory..."

safe_delete "index-backup-20250712-223721.html"

# 3. Zastaralé dokumentace
echo "3️⃣ Čistím zastaralé dokumentace..."

safe_delete "README-old.md"

# 4. Duplicitní skripty 
echo "4️⃣ Čistím duplicitní skripty..."

safe_delete "clean-backup-duplicates.sh"
safe_delete "clean-vscode-cache.sh"
safe_delete "clean-vscode-simple.sh"

# 5. Zastaralé CSS soubory v backup/
echo "5️⃣ Čistím zastaralé CSS backup soubory..."

safe_delete "backup/colors-bootstrap-simple-backup.css"
safe_delete "backup/colors-bootstrap-unified.css"
safe_delete "backup/chat.css"
safe_delete "backup/dice.css"
safe_delete "backup/neon-spinner.css"
safe_delete "backup/neon-forms.css"
safe_delete "backup/neon-buttons.css"

# 6. Prázdné nebo duplicitní soubory
echo "6️⃣ Kontroluji prázdné soubory..."

# Zkontroluj README.md (pokud je prázdný, přejmenuj ho)
if [ -f "README.md" ] && [ ! -s "README.md" ]; then
    echo "📝 README.md je prázdný - vytvářím nový obsah..."
    cat > README.md << 'EOF'
# 🎲 AI Dice Challenge

Interaktivní hra s AI osobnostmi a kostkami s pokročilým self-check systémem.

## 🚀 Rychlý start

```bash
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge
npm install
code .
```

## 📖 Dokumentace

- **QUICK_REFERENCE.md** - rychlý návod pro každodenní použití
- **SELF_CHECK_DOKUMENTACE.md** - kompletní dokumentace self-check systému
- **INSTALACNI_NAVOD.md** - instalace na novém PC

## 🎯 Klíčové příkazy

```bash
npm run dev        # Spuštění vývojářského serveru
npm run validate   # Smart validace (jen nové změny)
npm run commit     # Automatický commit + push
npm run setup      # Zobrazí pravidla a workflow
```

## ⚡ Automatické funkce

- **Self-check** při otevření projektu
- **File watcher** sleduje změny v reálném čase
- **Smart validace** umožňuje postupné zlepšování
- **Automatický commit** workflow

---

**🎮 Prostě otevři VS Code a začni programovat!**
EOF
fi

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "📊 VÝSLEDKY ÚKLIDU"
echo "════════════════════════════════════════════════════════════════════"
echo "🗑️  Smazáno souborů: $deleted_count"
echo "✅ README.md aktualizován"
echo ""

if [ $deleted_count -gt 0 ]; then
    echo "💡 Pro commit změn spusť: npm run commit"
else
    echo "💡 Žádné soubory nebyly smazány - projekt je čistý!"
fi

echo ""
echo "✅ ÚKLID DOKONČEN!"
echo "═══════════════════════════════════════════════════════════════════"
