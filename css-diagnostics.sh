#!/bin/bash

# CSS Diagnostic Script
# Tento skript analyzuje CSS soubory a hledá potenciální konflikty a duplicity

# Barvy pro lepší čitelnost
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CSS DIAGNOSTICKÝ NÁSTROJ ===${NC}"
echo ""

# 1. Kontrola duplicitních animací
echo -e "${YELLOW}[1/5] Kontrola duplicitních animací...${NC}"
ANIMATIONS=$(grep -r "@keyframes" --include="*.css" src/styles/)
ANIMATION_NAMES=$(echo "$ANIMATIONS" | grep -o "@keyframes [a-zA-Z0-9_-]*" | awk '{print $2}' | sort)
DUPLICATES=$(echo "$ANIMATION_NAMES" | uniq -d)

if [[ -n "$DUPLICATES" ]]; then
  echo -e "${RED}Nalezeny duplicitní definice animací:${NC}"
  echo "$DUPLICATES" | while read -r dup; do
    echo -e "${RED}Duplicitní animace:${NC} $dup"
    grep -rn "@keyframes $dup" --include="*.css" src/styles/
  done
else
  echo -e "${GREEN}✓ Žádné duplicitní animace.${NC}"
fi
echo ""

# 2. Kontrola selektorů pro problikávání ikon
echo -e "${YELLOW}[2/5] Kontrola konfliktních selektorů ikon...${NC}"
ICON_SELECTORS=$(grep -r "\.ri-" --include="*.css" src/styles/)
PULSE_ICON_CONFLICTS=$(grep -r "\.ri-.*\.neon-pulse" --include="*.css" src/styles/)
CONFLICTING_SELECTORS=$(grep -r "\.neon-pulse" --include="*.css" src/styles/ | grep -v "@keyframes")

if [[ -n "$PULSE_ICON_CONFLICTS" ]]; then
  echo -e "${RED}Nalezeny potenciální konflikty animací ikon:${NC}"
  echo "$PULSE_ICON_CONFLICTS"
else
  echo -e "${GREEN}✓ Žádné přímé konflikty animací ikon.${NC}"
fi
echo ""

# 3. Statistika CSS
echo -e "${YELLOW}[3/5] Statistika CSS souborů...${NC}"
CSS_FILES=$(find src/styles -name "*.css" -type f | wc -l)
CSS_RULES=$(grep -r "{" --include="*.css" src/styles/ | wc -l)
CSS_SIZE=$(du -ch src/styles/*.css 2>/dev/null | grep total || echo "0")
MEDIA_QUERIES=$(grep -r "@media" --include="*.css" src/styles/ | wc -l)

echo "Počet CSS souborů: $CSS_FILES"
echo "Počet CSS pravidel: $CSS_RULES"
echo "Počet media queries: $MEDIA_QUERIES"
echo "Celková velikost CSS: $CSS_SIZE"
echo ""

# 4. Analýza využití Bootstrap tříd
echo -e "${YELLOW}[4/5] Analýza využití Bootstrap tříd v HTML...${NC}"
HTML_FILES=$(find . -name "*.html" -type f | wc -l)
BOOTSTRAP_CLASSES=$(grep -oh "class=\"[^\"]*\"" $(find . -name "*.html" -type f) | sort | uniq | wc -l)
CUSTOM_SELECTORS=$(grep -r "\." --include="*.css" src/styles/ | grep -v "@" | grep -v "import" | grep -v "}" | grep -v "@media" | awk '{print $1}' | sort | uniq | wc -l)

echo "Počet HTML souborů: $HTML_FILES"
echo "Přibližný počet unikátních tříd v HTML: $BOOTSTRAP_CLASSES"
echo "Počet vlastních CSS selektorů: $CUSTOM_SELECTORS"

# Poměr Bootstrap vs vlastní CSS
echo -e "${BLUE}Doporučení:${NC} Ideální poměr by měl být méně vlastních selektorů než Bootstrap tříd."
echo ""

# 5. Kontrola zbytečných komentářů
echo -e "${YELLOW}[5/5] Kontrola zbytečných komentářů...${NC}"
COMMENTS=$(grep -r "/\*" --include="*.css" src/styles/ | wc -l)
LARGE_COMMENTS=$(grep -r "/\* ===========" --include="*.css" src/styles/ | wc -l)

echo "Počet komentářů: $COMMENTS"
echo "Z toho velkých oddělovačů: $LARGE_COMMENTS"

echo -e "${BLUE}Doporučení:${NC} Zvažte odstranění zbytečně velkých komentářů pro lepší čitelnost kódu."
echo ""

# Závěrečné shrnutí
echo -e "${BLUE}=== SHRNUTÍ DIAGNOSTIKY ===${NC}"
if [[ -n "$DUPLICATES" ]]; then
  echo -e "${RED}✗ Nalezeny duplicitní animace - je třeba je konsolidovat${NC}"
else
  echo -e "${GREEN}✓ Žádné duplicitní animace${NC}"
fi

EFFICIENCY=$((100 - (CUSTOM_SELECTORS * 100 / BOOTSTRAP_CLASSES)))
if [[ $EFFICIENCY -lt 50 ]]; then
  RATING="${RED}Nízká${NC}"
elif [[ $EFFICIENCY -lt 80 ]]; then
  RATING="${YELLOW}Střední${NC}"
else
  RATING="${GREEN}Vysoká${NC}"
fi

echo -e "Efektivita využití Bootstrap: $RATING (~$EFFICIENCY% optimalizace)"
echo -e "${BLUE}Další kroky:${NC} Spusťte css-cleanup.sh pro optimalizaci CSS struktury."
