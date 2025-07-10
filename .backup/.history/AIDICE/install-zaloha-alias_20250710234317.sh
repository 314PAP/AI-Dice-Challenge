#!/bin/bash

# Vytvoření aliasu pro příkaz zaloha v .bashrc
if ! grep -q "alias zaloha=" ~/.bashrc; then
    echo 'alias zaloha="/home/pipap/projects/hry-maker/AIDICE/zaloha.sh"' >> ~/.bashrc
    echo "Alias 'zaloha' byl přidán do ~/.bashrc"
    echo "Pro aktivaci zadejte: source ~/.bashrc"
else
    echo "Alias 'zaloha' již existuje v ~/.bashrc"
fi

echo ""
echo "Použití:"
echo "  zaloha                    - Vytvoří zálohu s výchozím popisem"
echo "  zaloha \"Popis změn\"       - Vytvoří zálohu s vlastním popisem"
