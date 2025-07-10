# Řešení problémů s VS Code

## Problém se zobrazením 62 změněných souborů

Váš předchozí skript `fix-vs-code-tracking.sh` skončil neočekávaně, pravděpodobně proto, že došlo k problémům při manipulaci s adresáři VS Code nebo při interakci s Gitem.

## Řešení

Připravil jsem pro vás jednodušší a spolehlivější řešení:

### 1. Použijte nový skript pro čištění VS Code cache

Vytvořil jsem jednodušší a bezpečnější skript, který čistí pouze VS Code cache:

```bash
./clean-vscode-cache.sh
```

Tento skript:
- Zkontroluje, zda VS Code není spuštěný
- Najde adresář VS Code cache (podporuje různé platformy)
- Vytvoří zálohu důležitých souborů
- Vymaže cache soubory
- Nevyžaduje interakci s Gitem

### 2. Pro GitKraken hlášku

Pokud nechcete instalovat GitKraken, jednoduše klikněte na "Nikdy". Tato zpráva je jen doporučení VS Code a nijak neovlivňuje funkčnost projektu.

### 3. Pokud problémy přetrvávají

Pokud by výše uvedené kroky nepomohly, můžete vyzkoušet:

1. Úplné zavření VS Code
2. Ruční smazání cache příkazy:
   ```
   cd ~/.config/Code
   rm -rf Cache CachedData CachedExtensions "Code Cache"
   find User/workspaceStorage -name "state.vscdb" -delete
   ```
3. Restart počítače

### 4. Manuální přidání souborů zpět do Gitu

Pokud z nějakého důvodu váš původní skript odebral soubory z Gitu, můžete je přidat zpět:

```bash
git add .
git commit -m "🔄 Obnoveny sledované soubory"
git push
```
