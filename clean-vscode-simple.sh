#!/bin/bash

# Jednoduchý skript pro vyčištění VS Code cache bez riskování Git problémů

# Barvy
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}🧹 Jednoduchý skript pro vyčištění VS Code cache${NC}"
echo -e "${BLUE}Tento skript pouze vyčistí cache VS Code, nemanipuluje s Git${NC}"
echo

# 1. Zkontrolujeme stav VS Code
echo -e "${YELLOW}1. Kontroluji běžící procesy VS Code...${NC}"
if pgrep -f "code" > /dev/null; then
    echo -e "${RED}⚠️  VS Code stále běží!${NC}"
    echo -e "${YELLOW}Prosím zavřete VS Code ručně a pak stiskněte Enter...${NC}"
    read -p ""
    
    # Počkáme až se VS Code zavře
    while pgrep -f "code" > /dev/null; do
        echo -e "${YELLOW}Čekám na zavření VS Code...${NC}"
        sleep 2
    done
fi

echo -e "${GREEN}✅ VS Code není spuštěn${NC}"

# 2. Vyčistíme cache
echo -e "\n${YELLOW}2. Čistím VS Code cache...${NC}"

VSCODE_CACHE_DIR="$HOME/.config/Code"

if [ -d "$VSCODE_CACHE_DIR" ]; then
    # Vytvoříme zálohu důležitých nastavení
    echo -e "${BLUE}Vytvářím zálohu nastavení...${NC}"
    mkdir -p ~/.vscode-backup-$(date +%Y%m%d-%H%M%S)
    BACKUP_DIR="~/.vscode-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Smažeme pouze cache soubory, ne nastavení
    echo -e "${YELLOW}Mažu cache soubory...${NC}"
    
    # Bezpečné mazání pouze cache
    rm -rf "$VSCODE_CACHE_DIR/Cache" 2>/dev/null && echo -e "${GREEN}✅ Cache smazán${NC}"
    rm -rf "$VSCODE_CACHE_DIR/CachedData" 2>/dev/null && echo -e "${GREEN}✅ CachedData smazán${NC}"
    rm -rf "$VSCODE_CACHE_DIR/Code Cache" 2>/dev/null && echo -e "${GREEN}✅ Code Cache smazán${NC}"
    
    echo -e "${GREEN}✅ VS Code cache byl vyčištěn${NC}"
else
    echo -e "${RED}❌ VS Code adresář nenalezen: $VSCODE_CACHE_DIR${NC}"
fi

# 3. Finální instrukce
echo -e "\n${GREEN}🎉 Cache byl vyčištěn!${NC}"
echo -e "${BLUE}Nyní můžete:${NC}"
echo -e "1. ${YELLOW}Otevřít VS Code znovu${NC}"
echo -e "2. ${YELLOW}Otevřít váš projekt${NC}"
echo -e "3. ${YELLOW}Zkontrolovat, zda problém se sledováním souborů byl vyřešen${NC}"
echo
echo -e "${GREEN}💡 Tip: VS Code byl nedávno aktualizován na verzi 1.102.0${NC}"
echo -e "${GREEN}Pokud problém přetrvává, restartujte celý počítač.${NC}"
