#!/bin/bash

# ===================================================================
# INSTALAČNÍ SKRIPT PRO AUTO-BACKUP NÁSTROJE
# ===================================================================
# Vytvořeno: 10.07.2025
# Autor: GitHub Copilot
# Verze: 1.0
#
# Tento skript nainstaluje auto-backup nástroje pro aktuální projekt
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
echo -e "${GREEN}      INSTALACE AUTO-BACKUP NÁSTROJŮ     ${NC}"
echo -e "${BLUE}==========================================${NC}\n"

# Zjištění cesty k projektu
PROJECT_PATH=$(git rev-parse --show-toplevel 2>/dev/null)
if [ $? -ne 0 ]; then
    echo -e "${RED}Chyba: Tento skript musí být spuštěn v Git repozitáři.${NC}"
    exit 1
fi

PROJECT_NAME=$(basename "$PROJECT_PATH")
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${YELLOW}Instaluji zálohovací nástroje pro projekt:${NC} ${CYAN}${PROJECT_NAME}${NC}"
echo -e "${YELLOW}Cesta k projektu:${NC} ${CYAN}${PROJECT_PATH}${NC}"
echo -e "${YELLOW}Zdrojová složka nástrojů:${NC} ${CYAN}${SCRIPT_DIR}${NC}\n"

# Nastavení spustitelných práv pro zálohovací skript
echo -e "${YELLOW}1. Nastavuji spustitelná práva pro zálohovací skript...${NC}"
chmod +x "${SCRIPT_DIR}/zaloha.sh"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Práva byla úspěšně nastavena${NC}"
else
    echo -e "${RED}✗ Nastala chyba při nastavování práv${NC}"
    exit 1
fi

# Přidání aliasu do .bashrc
echo -e "\n${YELLOW}2. Přidávám alias do ~/.bashrc...${NC}"
ALIAS_NAME="zaloha_${PROJECT_NAME}"
ALIAS_CMD="alias ${ALIAS_NAME}='${SCRIPT_DIR}/zaloha.sh'"

# Kontrola, zda alias již existuje
if grep -q "$ALIAS_CMD" ~/.bashrc; then
    echo -e "${YELLOW}! Alias '${ALIAS_NAME}' již existuje v ~/.bashrc${NC}"
else
    # Přidání aliasu do .bashrc
    echo "$ALIAS_CMD" >> ~/.bashrc
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Alias '${ALIAS_NAME}' byl úspěšně přidán do ~/.bashrc${NC}"
    else
        echo -e "${RED}✗ Nastala chyba při přidávání aliasu do ~/.bashrc${NC}"
    fi
fi

# Vytvoření globálního aliasu 'zaloha' pro snadné použití
echo -e "\n${YELLOW}3. Přidávám univerzální alias 'zaloha' pro aktuální složku...${NC}"
GLOBAL_ALIAS='alias zaloha='\''if [ -f "$PWD/.tools/auto-backup/zaloha.sh" ]; then "$PWD/.tools/auto-backup/zaloha.sh" "$@"; elif [ -f "$(git rev-parse --show-toplevel 2>/dev/null)/.tools/auto-backup/zaloha.sh" ]; then "$(git rev-parse --show-toplevel)/.tools/auto-backup/zaloha.sh" "$@"; else echo "Zálohovací skript nebyl nalezen v aktuálním projektu."; fi'\'

# Kontrola, zda globální alias již existuje
if grep -q "alias zaloha=" ~/.bashrc; then
    echo -e "${YELLOW}! Globální alias 'zaloha' již existuje v ~/.bashrc${NC}"
    echo -e "${YELLOW}! Pro přepsání upravte ~/.bashrc ručně${NC}"
else
    # Přidání globálního aliasu do .bashrc
    echo "$GLOBAL_ALIAS" >> ~/.bashrc
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Globální alias 'zaloha' byl úspěšně přidán do ~/.bashrc${NC}"
    else
        echo -e "${RED}✗ Nastala chyba při přidávání globálního aliasu do ~/.bashrc${NC}"
    fi
fi

# Vytvoření lokálního git hooku pro připomenutí záloh
echo -e "\n${YELLOW}4. Vytvářím git hook pro připomenutí záloh...${NC}"
HOOKS_DIR="${PROJECT_PATH}/.git/hooks"
mkdir -p "$HOOKS_DIR"

# Vytvoření pre-commit hooku pro připomenutí
cat > "${HOOKS_DIR}/pre-commit" << 'EOL'
#!/bin/bash
echo -e "\033[1;33mPřipomínka: Po dokončení commitů nezapomeňte použít příkaz 'zaloha' pro push na GitHub\033[0m"
exit 0
EOL

chmod +x "${HOOKS_DIR}/pre-commit"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Git hook byl úspěšně vytvořen${NC}"
else
    echo -e "${RED}✗ Nastala chyba při vytváření git hooku${NC}"
fi

# Aktivace aliasů pro aktuální relaci
echo -e "\n${YELLOW}5. Aktivuji aliasy pro aktuální relaci...${NC}"
source ~/.bashrc 2>/dev/null || source ~/.bashrc 2>/dev/null

# Úspěšné dokončení
echo -e "\n${GREEN}==========================================${NC}"
echo -e "${GREEN}   INSTALACE BYLA ÚSPĚŠNĚ DOKONČENA   ${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "Pro projekt: ${CYAN}${PROJECT_NAME}${NC}"
echo -e "Použití:"
echo -e "  ${YELLOW}zaloha${NC}                      - Vytvoří zálohu s výchozím popisem"
echo -e "  ${YELLOW}zaloha \"Popis změn\"${NC}       - Vytvoří zálohu s vlastním popisem"
echo -e "  ${YELLOW}${ALIAS_NAME}${NC}               - Projekt-specifický alias\n"
echo -e "${BLUE}Poznámka: Pro aktivaci aliasů v novém terminálu spusťte:${NC}"
echo -e "${YELLOW}source ~/.bashrc${NC}\n"
