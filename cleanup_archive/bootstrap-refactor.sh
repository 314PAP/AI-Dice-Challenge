#!/bin/bash

echo "🚀 Spouštím refaktoring layoutu na Bootstrap..."
echo "============================================="

# Vytvoření zálohy původního souboru index.html
BACKUP_DIR="./backup_bootstrap_refactor_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp index.html "$BACKUP_DIR/index.html"
echo "✅ Záloha původního index.html vytvořena v: $BACKUP_DIR"

# Refaktoring HTML - ukázka postupu
echo "
🔍 Návod na refaktoring HTML na Bootstrap:

1️⃣ Nahradit <body> element:
   PŘED: <body>
   PO:   <body class=\"bg-black m-0 p-0 overflow-hidden min-vh-100 max-vh-100 d-flex justify-content-center align-items-center\">

2️⃣ Nahradit .app-container:
   PŘED: <div class=\"app-container\">
   PO:   <div class=\"container-fluid vh-100 p-0 m-0 d-flex flex-column overflow-hidden bg-dark-80 neon-border\">

3️⃣ Nahradit .main-layout:
   PŘED: <div class=\"main-layout\">
   PO:   <div class=\"d-flex flex-column flex-md-row h-100 w-100 overflow-hidden\">

4️⃣ Nahradit .game-area:
   PŘED: <div class=\"game-area\">
   PO:   <div class=\"w-100 h-100 order-1 overflow-auto p-3\" style=\"flex: 0 0 65%; max-width: 65%;\">

5️⃣ Nahradit .chat-panel:
   PŘED: <div class=\"chat-panel\">
   PO:   <div class=\"w-100 order-2 d-md-block\" style=\"height: 40vh; flex: 0 0 35%; max-width: 35%;\">
"

# Vytvoření testovacího souboru s Bootstrap třídami
echo "🎮 Demo soubor vytvořen: bootstrap-layout-demo.html"
echo "👀 Otevřete soubor v prohlížeči pro ukázku Bootstrap layoutu"

# Přidání poznámek o velikostech Bootstrap breakpointů
echo "
📏 Bootstrap breakpointy:
- xs: < 576px (default)
- sm: ≥ 576px
- md: ≥ 768px
- lg: ≥ 992px
- xl: ≥ 1200px
- xxl: ≥ 1400px
"

# Připomenutí neonových utility tříd
echo "
✨ Neonové utility třídy:
- neon-text - neonový text
- neon-border - neonový okraj
- neon-green, neon-blue, neon-pink, neon-orange - neonové barvy
- btn-neon - neonová tlačítka
- neon-pulse, neon-blink, neon-wave - neonové animace
"

echo "🔄 Pro kompletní refaktoring postupujte podle BOOTSTRAP_REFACTOR_GUIDE.md"
echo "============================================="
echo "✅ Skript dokončen"
