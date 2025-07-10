#!/bin/bash

# Jednoduchý skript pro vyčištění VS Code cache
# Tento skript je bezpečnější než fix-vs-code-tracking.sh
# a zaměřuje se pouze na vyčištění cache

# Barvy pro lepší čitelnost
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== JEDNODUCHÉ VYČIŠTĚNÍ VS CODE CACHE ===${NC}"
echo -e "${RED}⚠️  POZOR: VS Code musí být zavřený!${NC}"

# Nejdřív zkontrolujeme, jestli VS Code neběží
if pgrep -f "code" > /dev/null; then
    echo -e "${RED}VS Code je stále spuštěný! Zavřete všechny instance VS Code a spusťte skript znovu.${NC}"
    exit 1
fi

echo -e "${YELLOW}VS Code není spuštěn, pokračuji s čištěním...${NC}"

# Seznam možných cest k VS Code cache
PATHS=(
    "$HOME/.config/Code"
    "$HOME/.config/Code - OSS"
    "$HOME/Library/Application Support/Code"
    "$HOME/AppData/Roaming/Code"
)

# Projdeme všechny možné cesty
FOUND=0
for path in "${PATHS[@]}"; do
    if [ -d "$path" ]; then
        FOUND=1
        echo -e "${GREEN}Nalezen VS Code v: $path${NC}"
        
        # Vytvoříme zálohu workspaceStorage
        echo -e "${YELLOW}Vytvářím zálohu...${NC}"
        BACKUP_DIR="$HOME/.vscode-backup-$(date +%Y%m%d%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r "$path/User/workspaceStorage" "$BACKUP_DIR/" 2>/dev/null
        
        # Smažeme cache
        echo -e "${YELLOW}Mažu cache soubory...${NC}"
        rm -rf "$path/Cache" 2>/dev/null
        rm -rf "$path/CachedData" 2>/dev/null
        rm -rf "$path/CachedExtensions" 2>/dev/null
        rm -rf "$path/Code Cache" 2>/dev/null
        find "$path/User/workspaceStorage" -name "state.vscdb" -delete 2>/dev/null
        
        echo -e "${GREEN}✅ Cache vymazána v: $path${NC}"
        echo -e "${BLUE}Záloha uložena v: $BACKUP_DIR${NC}"
    fi
done

if [ $FOUND -eq 0 ]; then
    echo -e "${RED}Žádná instalace VS Code nebyla nalezena!${NC}"
    exit 1
fi

echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}       ČIŠTĚNÍ DOKONČENO       ${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "Co dělat dál:"
echo -e "1. ${BLUE}Spusťte VS Code${NC}"
echo -e "2. ${BLUE}Pro GitKraken: Pokud nechcete rozšíření instalovat, klikněte na 'Nikdy'${NC}"
echo -e "3. ${BLUE}Zkontrolujte, zda problém s 62 změněnými soubory byl vyřešen${NC}"
echo -e "${GREEN}==============================================${NC}"
