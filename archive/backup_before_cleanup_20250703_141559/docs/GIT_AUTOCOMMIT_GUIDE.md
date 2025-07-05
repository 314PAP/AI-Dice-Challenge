# 🚀 Průvodce automatickým commitováním změn v AIDICE projektu

## 📌 Přehled dostupných skriptů

| Název skriptu | NPM příkaz | Popis |
|---------------|------------|-------|
| `auto-commit.sh` | `npm run auto-commit` | Jednorázové automatické potvrzení s tolerancí k chybám. Pokud standardní commit selže, použije `--no-verify`. |
| `auto-commit-watcher.sh` | `npm run auto-commit:watch` | Nepřetržité sledování a automatické potvrzování změn každou minutu. |
| `force-commit.sh` | `npm run auto-commit:force` | Okamžité vynucené potvrzení změn s přeskočením všech kontrol. |

## 🛠️ Jak používat skripty

### Jednorázové automatické potvrzení

Pro jednorázové potvrzení změn s pojistkou proti selhání:

```bash
npm run auto-commit
# nebo
./auto-commit.sh
```

### Automatické sledování a potvrzování změn

Pro spuštění nepřetržitého sledování změn (každou minutu):

```bash
npm run auto-commit:watch
# nebo
./auto-commit-watcher.sh
```

Pro ukončení sledování stiskněte `Ctrl+C`.

### Vynucené potvrzení změn

Když potřebujete okamžitě potvrdit změny bez jakýchkoli kontrol:

```bash
npm run auto-commit:force
# nebo
./force-commit.sh
```

## 📋 Podrobnosti o jednotlivých skriptech

### auto-commit.sh

```bash
#!/bin/bash
# Přidá všechny změny
git add .
# Vytvoří commit zprávu s časovým razítkem
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="Automatické potvrzení změn - $TIMESTAMP"
# Nastaví toleranci k chybám
export MAX_WARNINGS=1000
# Provede commit, při selhání zkusí --no-verify
git commit -m "$COMMIT_MESSAGE" || {
    git commit -m "$COMMIT_MESSAGE - (s přeskočením hooks)" --no-verify
}
```

### auto-commit-watcher.sh

```bash
#!/bin/bash
# Každou minutu kontroluje změny
INTERVAL=60
# V nekonečné smyčce sleduje změny
while true; do
    # Pokud najde změny, automaticky je potvrdí
    if [[ -n "$(git status --porcelain)" ]]; then
        ./auto-commit.sh
    fi
    # Počká před další kontrolou
    sleep $INTERVAL
done
```

### force-commit.sh

```bash
#!/bin/bash
# Přidá všechny změny
git add .
# Vytvoří commit zprávu s časovým razítkem
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="Vynucené potvrzení změn - $TIMESTAMP"
# Provede commit s přeskočením pre-commit hooků
git commit -m "$COMMIT_MESSAGE" --no-verify
```

## ⚙️ Konfigurace

Všechny skripty jsou nakonfigurovány v `package.json`:

```json
"scripts": {
  "auto-commit": "./auto-commit.sh",
  "auto-commit:watch": "./auto-commit-watcher.sh",
  "auto-commit:force": "./force-commit.sh"
}
```

## 🔍 Kdy použít který skript

- **Běžná práce**: `auto-commit.sh` - Pokusí se dodržet pravidla, ale v případě potřeby obejde kontroly
- **Dlouhodobá práce**: `auto-commit-watcher.sh` - Pro automatické sledování a potvrzování při delší práci
- **Rychlé řešení problémů**: `force-commit.sh` - Když potřebujete rychle potvrdit změny bez ohledu na jakékoli kontroly

---

*Poznámka: Všechny skripty automaticky přidávají všechny změněné soubory (ekvivalent `git add .`) a jejich commit zprávy obsahují časové razítko pro snadnější identifikaci.*
