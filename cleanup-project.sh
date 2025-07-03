#!/bin/bash

# =============================================================================
# 🧹 CLEANUP SCRIPT - Odstranění starých a duplicitních souborů
# =============================================================================

echo "🚀 Spouštím čištění projektu AI Kostková Výzva..."
echo "=================================================="

# Vytvoření adresáře pro zálohu
echo "📦 Vytvářím záložní adresář..."
BACKUP_DIR="./backup_before_cleanup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "✅ Záložní adresář vytvořen: $BACKUP_DIR"

# Záloha souborů před odstraněním
echo "💾 Zálohování souborů před odstraněním..."

# 1. Záloha všech .bak souborů
echo "  - Zálohování .bak souborů..."
mkdir -p "$BACKUP_DIR/bak_files"
find . -name "*.bak" -type f -exec cp --parents {} "$BACKUP_DIR/bak_files" \;

# 2. Záloha archivní složky
echo "  - Zálohování archivní složky..."
if [ -d "./src/styles/archive" ]; then
  mkdir -p "$BACKUP_DIR/src/styles"
  cp -r "./src/styles/archive" "$BACKUP_DIR/src/styles/"
fi

# 3. Záloha testovacích HTML souborů
echo "  - Zálohování testovacích HTML souborů..."
mkdir -p "$BACKUP_DIR/test_html"
for file in css_debug_test.html css_override_debug.html css_path_test.html debug_console.html debug_js.html debug.html fixed.html index_backup.html index_new.html inline_test.html integration_test.html layout_test.html responsive_test.html simple.html; do
  if [ -f "./$file" ]; then
    cp "./$file" "$BACKUP_DIR/test_html/"
  fi
done

# 4. Záloha redundantní dokumentace
echo "  - Zálohování redundantní dokumentace..."
mkdir -p "$BACKUP_DIR/docs"
find . -maxdepth 1 -name "*.md" ! -name "README.md" ! -name "DOKUMENTACE.md" ! -name "CLEANUP_PLAN.md" ! -name "LICENSE.md" -type f -exec cp {} "$BACKUP_DIR/docs/" \;

echo "✅ Záloha dokončena"

# Odstranění nepotřebných souborů
echo "🗑️  Odstraňuji staré a nepotřebné soubory..."

# 1. Odstranění .bak souborů
echo "  - Odstraňování .bak souborů..."
find . -name "*.bak" -type f -delete

# 2. Odstranění archivní složky
echo "  - Odstraňování archivní složky..."
if [ -d "./src/styles/archive" ]; then
  rm -rf "./src/styles/archive"
fi

# 3. Odstranění testovacích HTML souborů
echo "  - Odstraňování testovacích HTML souborů..."
for file in css_debug_test.html css_override_debug.html css_path_test.html debug_console.html debug_js.html debug.html fixed.html index_backup.html index_new.html inline_test.html integration_test.html layout_test.html responsive_test.html simple.html; do
  if [ -f "./$file" ]; then
    rm "./$file"
  fi
done

# 4. Přesun redundantní dokumentace do složky docs (místo přímého odstranění)
echo "  - Přesouvám redundantní dokumentaci do složky docs..."
mkdir -p "./docs/archive"
find . -maxdepth 1 -name "*.md" ! -name "README.md" ! -name "DOKUMENTACE.md" ! -name "CLEANUP_PLAN.md" ! -name "LICENSE.md" -type f -exec mv {} "./docs/archive/" \;

echo "✅ Odstranění souborů dokončeno"

# Vytvoření souboru s přehledem provedených změn
echo "📝 Vytvářím záznam o provedených změnách..."
CHANGES_FILE="./CLEANUP_COMPLETE.md"
cat > "$CHANGES_FILE" << EOL
# 🧹 Čištění projektu dokončeno

## Provedené změny

### Odstraněné soubory
- ✅ Všechny .bak soubory
- ✅ Adresář src/styles/archive a jeho obsah
- ✅ Testovací a duplicitní HTML soubory

### Přesunuté soubory
- ✅ Redundantní dokumentace přesunuta do složky ./docs/archive

### Zálohované soubory
Všechny odstraněné soubory byly zálohovány do: $BACKUP_DIR

## 📋 Další kroky

1. Zkontrolujte, že aplikace funguje správně po čištění
2. Zkontrolujte, že layout používá pouze Bootstrap utility třídy
3. Zkontrolujte, že při načítání nedochází k probliknutí starého layoutu
4. Otestujte responzivitu na všech zařízeních
5. V případě problémů obnovte soubory ze zálohy

## 🎮 Struktura projektu po čištění

\`\`\`
/
  index.html            - Hlavní HTML soubor
  README.md             - Základní dokumentace
  DOKUMENTACE.md        - Kompletní dokumentace
  CLEANUP_PLAN.md       - Plán čištění projektu
  CLEANUP_COMPLETE.md   - Záznam o provedených změnách
  /src
    /js                 - JavaScript soubory
      /game             - Herní logika
      /ai               - AI moduly
      /ui               - UI komponenty
      /utils            - Utility funkce
    /styles             - CSS soubory
      /base             - Základní styly
      /layout           - Layouty a gridy
      /components       - Komponenty
      /animations       - Animace a efekty
      /themes           - Barevná témata
      /utils            - Utility styly
      main.css          - Hlavní CSS soubor
  /docs
    /archive            - Archivované dokumenty
\`\`\`
EOL

echo "✅ Záznam o provedených změnách vytvořen: $CHANGES_FILE"

echo "=================================================="
echo "✨ Čištění projektu dokončeno! ✨"
echo "Záloha souborů: $BACKUP_DIR"
echo "Přehled změn: $CHANGES_FILE"
