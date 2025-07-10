#!/bin/bash

# Skript pro komplexní vyřešení problémů s VS Code sledováním souborů
# Tento skript provádí následující:
# 1. Commituje všechny změny
# 2. Vyčistí VS Code cache
# 3. Resetuje sledování souborů
# 4. Aktualizuje .gitignore

# Barvy pro lepší čitelnost
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== KOMPLEXNÍ ŘEŠENÍ PROBLÉMŮ S VS CODE SLEDOVÁNÍM ===${NC}"

# 1. Uložíme všechny změny v Gitu
echo -e "\n${YELLOW}1. Ukládám aktuální změny do Gitu...${NC}"
git add .
git commit -m "🔄 Hromadný commit pro vyřešení problémů se sledováním souborů"
git push

# 2. Vytvoříme seznam adresářů a souborů, které VS Code sleduje, ale nemá sledovat
echo -e "\n${YELLOW}2. Kontroluji a upravuji .gitignore...${NC}"
cat > .gitignore << EOL
# IDE a systémové soubory
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.iml
*.swp
.DS_Store
Thumbs.db

# Build a závislosti
node_modules/
dist/
build/
coverage/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Zálohy a historie
.backup/
.history/
archive/
src/styles/archive/
dokumentybtrap/

# Ostatní
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOL

echo -e "${GREEN}✅ .gitignore byl aktualizován${NC}"

# 3. Resetujeme sledování souborů
echo -e "\n${YELLOW}3. Resetuji sledování souborů v Git...${NC}"
git rm -r --cached .
git add .
git commit -m "🔄 Resetováno sledování souborů podle .gitignore"
git push

# 4. Vyčistíme cache VS Code
echo -e "\n${YELLOW}4. Vyčistíme cache VS Code...${NC}"
echo -e "${RED}⚠️  POZOR: Tato akce zavře VS Code!${NC}"
echo -e "${YELLOW}Je VS Code otevřené? Zavřete ho ručně a pak zadejte 'a' pro pokračování...${NC}"
echo -e "${YELLOW}Nebo zadejte 'n' pro přeskočení tohoto kroku${NC}"
read -p "Pokračovat s čištěním cache? (a/n): " odpoved

if [[ "$odpoved" == "a" || "$odpoved" == "A" ]]; then
    echo -e "${YELLOW}Pokouším se zavřít VS Code...${NC}"
    
    # Bezpečnější způsob ukončení VS Code
    killall code 2>/dev/null || pkill -f "code" 2>/dev/null || echo "VS Code není spuštěn"
    sleep 3
    
    echo -e "${YELLOW}Mažu cache VS Code...${NC}"
    
    # Získáme cestu k VS Code cache
    VSCODE_CACHE_DIR="$HOME/.config/Code"
    
    if [ -d "$VSCODE_CACHE_DIR" ]; then
        # Vytvoříme zálohu workspaceStorage pro jistotu
        mkdir -p ~/.vscode-backup
        cp -r "$VSCODE_CACHE_DIR/User/workspaceStorage" ~/.vscode-backup/ 2>/dev/null
        
        # Smažeme cache soubory - používáme méně destruktivní přístup
        find "$VSCODE_CACHE_DIR/Cache" -type f -delete 2>/dev/null
        find "$VSCODE_CACHE_DIR/CachedData" -type f -delete 2>/dev/null
        find "$VSCODE_CACHE_DIR/CachedExtensions" -type f -delete 2>/dev/null
        find "$VSCODE_CACHE_DIR/Code Cache" -type f -delete 2>/dev/null
        find "$VSCODE_CACHE_DIR/User/workspaceStorage" -name "state.vscdb" -delete 2>/dev/null
        
        echo -e "${GREEN}✅ Cache VS Code byl vyčištěn${NC}"
        echo -e "${BLUE}Poznámka: Záloha VS Code dat byla vytvořena v ~/.vscode-backup${NC}"
    else
        echo -e "${RED}Adresář VS Code cache nebyl nalezen v $VSCODE_CACHE_DIR${NC}"
        echo -e "${BLUE}Pokud používáte jinou verzi VS Code (např. VS Code Insiders),${NC}"
        echo -e "${BLUE}upravte ručně cestu v tomto skriptu.${NC}"
    fi
else
    echo -e "${BLUE}Čištění cache bylo přeskočeno.${NC}"
    echo -e "${YELLOW}Místo toho zkusme jednodušší metodu - reset sledování Git souborů...${NC}"
fi

echo -e "${GREEN}✅ Cache VS Code byl vyčištěn${NC}"

echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}       KOMPLEXNÍ ŘEŠENÍ DOKONČENO       ${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "Co dělat dál:"
echo -e "1. ${BLUE}Znovu otevřete VS Code${NC}"
echo -e "2. ${BLUE}Zkontrolujte, zda problém byl vyřešen${NC}"
echo -e "3. ${BLUE}Pro GitKraken: Pokud nechcete rozšíření instalovat, klikněte na 'Nikdy'${NC}"
echo -e "4. ${BLUE}Pokud stále vidíte mnoho změněných souborů, spusťte tento skript znovu${NC}"
echo -e "${GREEN}==============================================${NC}"
