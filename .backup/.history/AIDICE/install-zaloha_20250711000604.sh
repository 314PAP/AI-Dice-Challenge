#!/bin/bash

# Vytvoření symbolického linku pro snadné spouštění skriptu "zaloha" odkudkoliv
sudo ln -sf /home/pipap/projects/hry-maker/AIDICE/zaloha.sh /usr/local/bin/zaloha

echo "Zálohovací příkaz 'zaloha' byl úspěšně nainstalován!"
echo "Nyní můžete použít příkaz 'zaloha' kdekoli v terminálu."
echo ""
echo "Použití:"
echo "  zaloha                    - Vytvoří zálohu s výchozím popisem"
echo "  zaloha \"Popis změn\"       - Vytvoří zálohu s vlastním popisem"
