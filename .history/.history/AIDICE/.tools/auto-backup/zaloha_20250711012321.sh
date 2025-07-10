#!/bin/bash

# Skript pro automatické zálohování projektu
# Vytváří zálohu do složky .backup v nadřazené složce projektu

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Získáme aktuální adresář projektu
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

# Vytvoříme timestamp pro název zálohy
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Definujeme cílovou složku pro zálohy
BACKUP_DIR="$PROJECT_DIR/../.backup"
HISTORY_DIR="$BACKUP_DIR/.history/$PROJECT_NAME"

# Vytvoříme složku pro zálohy, pokud neexistuje
mkdir -p "$HISTORY_DIR"

echo -e "${YELLOW}📦 Vytvářím zálohu projektu $PROJECT_NAME...${NC}"

# Vytvoříme seznam souborů k zálohování (bez .git, node_modules, atd.)
find "$PROJECT_DIR" -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/.backup/*" \
    -not -path "*/venv/*" \
    -not -path "*/__pycache__/*" \
    -not -path "*/build/*" \
    | while read -r file; do
        # Získáme relativní cestu k souboru v rámci projektu
        REL_PATH="${file#$PROJECT_DIR/}"
        # Vytvoříme cílovou cestu v záložní složce
        TARGET_PATH="$HISTORY_DIR/$REL_PATH"
        # Vytvoříme adresářovou strukturu
        mkdir -p "$(dirname "$TARGET_PATH")"
        # Zkopírujeme soubor s časovou značkou v názvu
        TARGET_WITH_TIMESTAMP="$(dirname "$TARGET_PATH")/$(basename "$file" | sed 's/\(.*\)\(\.[^.]*\)$/\1_'"$TIMESTAMP"'\2/' | sed 's/\(.*\)$/\1/' )"
        cp "$file" "$TARGET_WITH_TIMESTAMP"
    done

echo -e "${GREEN}✅ Záloha byla vytvořena v adresáři:${NC}"
echo -e "${GREEN}   $HISTORY_DIR${NC}"
echo -e "${YELLOW}📅 Časová značka: $TIMESTAMP${NC}"
