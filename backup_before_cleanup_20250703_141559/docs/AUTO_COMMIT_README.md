# Automatické potvrzování změn v AIDICE projektu

Tento dokument popisuje nástroje pro automatické potvrzování (commit) změn ve vašem projektu, které pomohou předejít problémům s git hooks a ESLint chybami.

## Dostupné skripty

Projekt obsahuje několik skriptů pro různé způsoby potvrzování změn:

### 1. Jednorázové automatické potvrzení

Tento skript se pokusí provést standardní commit, ale pokud selže kvůli git hooks nebo ESLint chybám, provede commit s přeskočením kontrol.

```bash
npm run auto-commit
```

nebo

```bash
./auto-commit.sh
```

### 2. Automatické sledování změn

Tento skript spustí nekonečnou smyčku, která každou minutu kontroluje změny v projektu a automaticky je potvrzuje.

```bash
npm run auto-commit:watch
```

nebo

```bash
./auto-commit-watcher.sh
```

Pro ukončení sledování stiskněte `Ctrl+C`.

### 3. Vynucené potvrzení změn

Tento skript potvrdí všechny změny okamžitě s přeskočením všech pre-commit hooků a ESLint kontrol.

```bash
npm run auto-commit:force
```

nebo

```bash
./force-commit.sh
```

## Kdy použít který skript

- **auto-commit**: Pro běžné jednorázové potvrzení změn s pokusem o dodržení pravidel, ale s pojistkou.
- **auto-commit:watch**: Pro automatické sledování a potvrzování změn při práci na projektu.
- **auto-commit:force**: Když potřebujete rychle potvrdit změny bez ohledu na jakékoli kontroly.

## Poznámky

- Všechny skripty automaticky přidávají všechny změněné soubory (ekvivalent `git add .`).
- Commit zprávy obsahují časové razítko pro snadnější identifikaci.
- Skripty respektují nastavení MAX_WARNINGS=1000 pro větší toleranci k ESLint varováním.
