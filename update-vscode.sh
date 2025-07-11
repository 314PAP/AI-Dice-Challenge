#!/bin/bash

# Jednoduchý skript pro aktualizaci Visual Studio Code

# Barvy
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Skript pro aktualizaci Visual Studio Code${NC}"
echo -e "${BLUE}Tento skript zkontroluje a nainstaluje nejnovější verzi VS Code${NC}"
echo

# 1. Zkontrolujeme současnou verzi
echo -e "${YELLOW}1. Kontroluji současnou verzi VS Code...${NC}"
if command -v code &> /dev/null; then
    CURRENT_VERSION=$(code --version | head -n1)
    echo -e "${GREEN}Současná verze: ${CURRENT_VERSION}${NC}"
else
    echo -e "${RED}❌ VS Code není nainstalován${NC}"
    exit 1
fi

# 2. Aktualizujeme package cache
echo -e "\n${YELLOW}2. Aktualizuji package cache...${NC}"
sudo apt update

# 3. Zkontrolujeme dostupné aktualizace
echo -e "\n${YELLOW}3. Kontroluji dostupné aktualizace...${NC}"
AVAILABLE_UPDATE=$(apt list --upgradable 2>/dev/null | grep "^code/")

if [[ -n "$AVAILABLE_UPDATE" ]]; then
    echo -e "${GREEN}✅ Dostupná aktualizace:${NC}"
    echo "$AVAILABLE_UPDATE"
    
    # 4. Provedeme aktualizaci
    echo -e "\n${YELLOW}4. Provádím aktualizaci VS Code...${NC}"
    sudo apt upgrade code
    
    # 5. Ověříme novou verzi
    echo -e "\n${YELLOW}5. Ověřuji novou verzi...${NC}"
    NEW_VERSION=$(code --version | head -n1)
    echo -e "${GREEN}✅ Nová verze: ${NEW_VERSION}${NC}"
    
    echo -e "\n${GREEN}🎉 VS Code byl úspěšně aktualizován!${NC}"
else
    echo -e "${GREEN}✅ VS Code je již nejnovější verze${NC}"
fi

echo -e "\n${BLUE}Hotovo! Můžete nyní spustit VS Code.${NC}"
