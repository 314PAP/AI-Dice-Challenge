#!/bin/bash

# Force-commit skript pro AIDICE projekt
# Potvrdí všechny změny bez ohledu na git hooks a ESLint

echo "🔄 Spouštím vynucené potvrzení změn..."

# Přidáme všechny změny
git add .

# Vytvoříme commit zprávu s časovým razítkem
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="Vynucené potvrzení změn - $TIMESTAMP"

# Provedeme commit s přeskočením pre-commit hooků
git commit -m "$COMMIT_MESSAGE" --no-verify

echo "✅ Změny byly vynuceně potvrzeny!"
