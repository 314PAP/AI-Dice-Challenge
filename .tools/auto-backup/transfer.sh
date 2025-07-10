#!/bin/bash

# Skript pro přenos zálohovacího systému mezi projekty
# Kopíruje aktuální verzi zálohovacího systému do jiného projektu

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Zkontrolujeme, zda byl zadán cílový adresář
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Nebyl zadán cílový adresář!${NC}"
    echo -e "${YELLOW}Použití:${NC} $0 /cesta/k/cílovému/projektu"
    exit 1
fi

TARGET_DIR="$1"

# Zkontrolujeme, zda cílový adresář existuje
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}❌ Cílový adresář neexistuje: ${TARGET_DIR}${NC}"
    echo "Vytvořit adresář? (a/n)"
    read -r odpoved
    if [ "$odpoved" == "a" ] || [ "$odpoved" == "A" ]; then
        mkdir -p "$TARGET_DIR"
        echo -e "${GREEN}✅ Adresář byl vytvořen${NC}"
    else
        echo -e "${RED}❌ Přenos zrušen${NC}"
        exit 1
    fi
fi

# Získáme aktuální adresář skriptu
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Vytvoříme cílovou složku pro zálohovací systém
TARGET_BACKUP_DIR="$TARGET_DIR/.tools/auto-backup"
mkdir -p "$TARGET_BACKUP_DIR"

echo -e "${YELLOW}📦 Přenáším zálohovací systém do: ${TARGET_BACKUP_DIR}${NC}"

# Zkopírujeme zálohovací skripty
cp "$SCRIPT_DIR/zaloha.sh" "$TARGET_BACKUP_DIR/"
cp "$SCRIPT_DIR/install.sh" "$TARGET_BACKUP_DIR/"
cp "$SCRIPT_DIR/transfer.sh" "$TARGET_BACKUP_DIR/"
cp "$SCRIPT_DIR/README.md" "$TARGET_BACKUP_DIR/"

# Nastavíme oprávnění pro spuštění skriptů
chmod +x "$TARGET_BACKUP_DIR/zaloha.sh"
chmod +x "$TARGET_BACKUP_DIR/install.sh"
chmod +x "$TARGET_BACKUP_DIR/transfer.sh"

echo -e "${GREEN}✅ Zálohovací systém byl úspěšně přenesen${NC}"
echo -e "${YELLOW}📝 Pro vytvoření zálohy spusťte:${NC}"
echo -e "   cd $TARGET_DIR && bash .tools/auto-backup/zaloha.sh"
