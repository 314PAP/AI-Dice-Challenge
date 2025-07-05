#!/bin/bash

# CSS Cleanup Script
# Skript pro vyčištění a optimalizaci CSS souborů

# Barvy pro lepší čitelnost
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CSS CLEANUP SCRIPT ===${NC}"
echo -e "${YELLOW}Tento skript vytvoří zálohu aktuálních CSS souborů a optimalizuje strukturu.${NC}"
echo ""

# Vytvoření časového razítka pro zálohu
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backup_css_${TIMESTAMP}"

echo -e "${BLUE}[1/4]${NC} Vytváření zálohy CSS souborů do ${BACKUP_DIR}..."
mkdir -p "${BACKUP_DIR}/src/styles"
cp -r src/styles/* "${BACKUP_DIR}/src/styles/"
cp *.css "${BACKUP_DIR}/" 2>/dev/null || true
echo -e "${GREEN}✓${NC} Záloha vytvořena!"

echo -e "${BLUE}[2/4]${NC} Odstraňování nepotřebných CSS souborů..."
# Seznam souborů, které chceme zachovat
KEEP_FILES=(
  "src/styles/main-optimized.css"
  "src/styles/utils/neon-bootstrap-utilities.css"
  "src/styles/utils/minimalist-layout.css"
  "src/styles/components/dice/neon-dice.css"
  "src/styles/components/game/farkle-bootstrap.css"
)

# Funkce pro kontrolu, zda je soubor v seznamu pro zachování
function should_keep {
  local file="$1"
  for keep_file in "${KEEP_FILES[@]}"; do
    if [[ "$file" == "$keep_file" ]]; then
      return 0
    fi
  done
  return 1
}

# Procházení všech CSS souborů a odstranění nepotřebných
CSS_FILES=$(find src/styles -name "*.css" -type f)
REMOVED_COUNT=0

for file in $CSS_FILES; do
  if ! should_keep "$file"; then
    echo "  Odstraňuji: $file"
    rm "$file"
    ((REMOVED_COUNT++))
  fi
done

echo -e "${GREEN}✓${NC} Odstraněno ${REMOVED_COUNT} nepotřebných CSS souborů."

echo -e "${BLUE}[3/4]${NC} Vytváření dokumentace o optimalizaci..."
CLEANUP_LOG="CSS_CLEANUP_LOG_${TIMESTAMP}.md"

cat > "$CLEANUP_LOG" << EOL
# CSS Optimalizace - Log

## Datum: $(date +"%d.%m.%Y %H:%M")

### Provedené změny

- Vytvořena záloha původních CSS souborů do \`${BACKUP_DIR}\`
- Odstraněno ${REMOVED_COUNT} nepotřebných CSS souborů
- Vytvořen optimalizovaný main-optimized.css
- Zachovány pouze nezbytné CSS soubory

### Zachované CSS soubory

$(for file in "${KEEP_FILES[@]}"; do echo "- \`$file\`"; done)

### Poznámky

Tato optimalizace byla provedena s cílem maximalizovat využití Bootstrap utility tříd a minimalizovat vlastní CSS.
Pro více informací viz soubor \`CSS_OPTIMIZATION_TECHNICAL.md\`.
EOL

echo -e "${GREEN}✓${NC} Dokumentace vytvořena v ${CLEANUP_LOG}"

echo -e "${BLUE}[4/4]${NC} Aktualizace HTML souborů pro použití optimalizovaného CSS..."
find . -name "*.html" -type f -not -path "./${BACKUP_DIR}/*" | while read -r html_file; do
  # Nahrazení odkazů na starý main.css novým main-optimized.css
  sed -i 's|href="/src/styles/main.css"|href="/src/styles/main-optimized.css"|g' "$html_file"
  # Odstranění duplicitních importů CSS
  sed -i 's|<link rel="stylesheet" href="/src/styles/utils/neon-bootstrap-utilities.css">\s*<link rel="stylesheet" href="/src/styles/utils/minimalist-layout.css">|<link rel="stylesheet" href="/src/styles/main-optimized.css">|g' "$html_file"
done

echo -e "${GREEN}✓${NC} HTML soubory aktualizovány."

echo ""
echo -e "${GREEN}=== CSS OPTIMALIZACE DOKONČENA ===${NC}"
echo -e "Záloha: ${YELLOW}${BACKUP_DIR}${NC}"
echo -e "Log: ${YELLOW}${CLEANUP_LOG}${NC}"
echo ""
echo -e "${BLUE}Poznámka:${NC} Zkontrolujte, zda je vzhled stále správný. V případě problémů můžete obnovit soubory ze zálohy."
