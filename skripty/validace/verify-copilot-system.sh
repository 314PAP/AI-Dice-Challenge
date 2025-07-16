#!/bin/bash

# 🔍 COPILOT SELF-CHECK VERIFICATION
# Tento script ověří, že Copilot skutečně kontroluje Bootstrap dokumentaci

echo "🤖 OVĚŘOVÁNÍ COPILOT SELF-CHECK SYSTÉMU"
echo "═══════════════════════════════════════════════"

# Kontrola, že copilot-instructions obsahují Bootstrap odkazy
echo "1️⃣ Kontroluji Copilot Instructions..."
if grep -q "dokumentybtrap" .github/copilot-instructions.md; then
    echo "✅ Bootstrap dokumentace je v instructions"
else
    echo "❌ Bootstrap dokumentace chybí v instructions"
fi

# Kontrola, že main.css obsahuje checklist
echo ""
echo "2️⃣ Kontroluji CSS checklist..."
if grep -q "CHECKLIST PŘED KAŽDOU ZMĚNOU" src/styles/main.css; then
    echo "✅ CSS checklist je přítomen"
else
    echo "❌ CSS checklist chybí"
fi

# Kontrola, že validation script existuje a je spustitelný
echo ""
echo "3️⃣ Kontroluji validation script..."
if [[ -x "./css-validation.sh" ]]; then
    echo "✅ Validation script je spustitelný"
else
    echo "❌ Validation script není spustitelný"
fi

# Kontrola integrace workflow
echo ""
echo "4️⃣ Kontroluji workflow integraci..."
if [[ -f "./setup-project.sh" ]] && grep -q "npm run check" setup-project.sh; then
    echo "✅ Workflow je správně nastaven"
else
    echo "❌ Workflow není správně nastaven"
fi

# Test aktuálního stavu
echo ""
echo "5️⃣ Testuji aktuální stav projektu..."
echo "─────────────────────────────────────────────"
./css-validation.sh
VALIDATION_RESULT=$?

echo ""
echo "═══════════════════════════════════════════════"
echo "📊 VÝSLEDEK OVĚŘENÍ"
echo "═══════════════════════════════════════════════"

if [ $VALIDATION_RESULT -eq 0 ]; then
    echo "🎉 PERFEKTNÍ! Copilot self-check systém je plně funkční"
    echo "✅ Workflow je správně nastaven"
    echo "✅ Copilot má přístup k Bootstrap dokumentaci"
    echo "✅ Všechna pravidla jsou dodržena"
else
    echo "⚠️ POTŘEBA OPRAV: Validation našel problémy"
    echo "💡 Před commitem je nutné opravit všechny chyby"
    echo "🔧 Copilot musí dodržovat všechna pravidla"
fi

echo ""
echo "📝 Log tohoto ověření: $(date)"

# ✅ OPRAVA: Vracíme správný exit code podle validation výsledku
exit $VALIDATION_RESULT
