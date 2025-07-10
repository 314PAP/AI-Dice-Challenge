#!/bin/bash

# ===================================================================
# PŘENOS AUTO-BACKUP NÁSTROJŮ DO NOVÉHO PROJEKTU
# ===================================================================
# Vytvořeno: 10.07.2025
# Autor: GitHub Copilot
# Verze: 1.0
#
# Tento skript zkopíruje auto-backup nástroje do zadaného projektu
# ===================================================================

# Barvy pro lepší čitelnost výstupu
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Vytištění barevného nadpisu
echo -e "${BLUE}==========================================${NC}"
echo -e "${GREEN}   PŘENOS AUTO-BACKUP NÁSTROJŮ    ${NC}"
echo -e "${BLUE}==========================================${NC}\n"

# Zjištění cesty k aktuálnímu skriptu
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Kontrola argumentů
if [ -z "$1" ]; then
    echo -e "${YELLOW}Použití:${NC} $0 <cesta_k_novému_projektu>"
    echo
    echo -e "${YELLOW}Příklad:${NC} $0 ~/projects/my-new-project"
    exit 1
fi

TARGET_PROJECT="$1"

# Kontrola, zda cílová složka existuje
if [ ! -d "$TARGET_PROJECT" ]; then
    echo -e "${RED}Chyba: Cílová složka '$TARGET_PROJECT' neexistuje.${NC}"
    exit 1
fi

# Kontrola, zda je cílová složka Git repozitářem
if [ ! -d "$TARGET_PROJECT/.git" ]; then
    echo -e "${YELLOW}Upozornění: Cílová složka není Git repozitář.${NC}"
    echo -e "${YELLOW}Inicializovat Git repozitář? [y/n]${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cd "$TARGET_PROJECT" || exit 1
        git init
        echo -e "${GREEN}✓ Git repozitář byl inicializován${NC}"
    else
        echo -e "${RED}Instalace přerušena. Auto-backup nástroje vyžadují Git repozitář.${NC}"
        exit 1
    fi
fi

# Vytvoření cílové složky pro nástroje
TARGET_TOOLS_DIR="$TARGET_PROJECT/.tools/auto-backup"
mkdir -p "$TARGET_TOOLS_DIR"

# Kopírování souborů
echo -e "${YELLOW}Kopíruji auto-backup nástroje do:${NC} ${CYAN}$TARGET_TOOLS_DIR${NC}"
cp -f "$SCRIPT_DIR/zaloha.sh" "$TARGET_TOOLS_DIR/zaloha.sh"
cp -f "$SCRIPT_DIR/install.sh" "$TARGET_TOOLS_DIR/install.sh"
cp -f "$SCRIPT_DIR/transfer.sh" "$TARGET_TOOLS_DIR/transfer.sh"
cp -f "$SCRIPT_DIR/README.md" "$TARGET_TOOLS_DIR/README.md" 2>/dev/null || true

# Nastavení spustitelných práv
chmod +x "$TARGET_TOOLS_DIR/zaloha.sh"
chmod +x "$TARGET_TOOLS_DIR/install.sh"
chmod +x "$TARGET_TOOLS_DIR/transfer.sh"

# Kontrola úspěšnosti kopírování
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Soubory byly úspěšně zkopírovány${NC}"
else
    echo -e "${RED}✗ Nastala chyba při kopírování souborů${NC}"
    exit 1
fi

# Spuštění instalačního skriptu v cílovém projektu
echo -e "\n${YELLOW}Chcete spustit instalační skript v cílovém projektu? [y/n]${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    cd "$TARGET_PROJECT" || exit 1
    bash "$TARGET_TOOLS_DIR/install.sh"
else
    echo -e "\n${YELLOW}Pro dokončení instalace v cílovém projektu spusťte:${NC}"
    echo -e "${CYAN}cd \"$TARGET_PROJECT\" && bash \"$TARGET_TOOLS_DIR/install.sh\"${NC}"
fi

echo -e "\n${GREEN}==========================================${NC}"
echo -e "${GREEN}     PŘENOS BYL ÚSPĚŠNĚ DOKONČEN     ${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "Auto-backup nástroje jsou nyní dostupné v:"
echo -e "${CYAN}$TARGET_TOOLS_DIR${NC}"
