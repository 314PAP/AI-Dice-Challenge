# 🎲 AI Dice Challenge - Skripty

## 📁 Struktura skriptů

```
skripty/
├── automatizace/     # Automatické workflow skripty
│   ├── auto-watcher.sh         # Sleduje změny v kódu
│   ├── smart-commit.sh         # Validace + commit + push
│   ├── auto-selfcheck.sh       # Self-check při startu VS Code
│   └── smart-auto-watcher.sh   # Inteligentní file watcher
│
├── testy/            # Test suite a validace
│   ├── master-test-runner.sh   # Hlavní test runner
│   ├── test-*.js              # JavaScript unit testy
│   └── test-extended-suite.sh  # Rozšířené testy
│
├── validace/         # Kontrola kvality kódu
│   ├── verify-copilot-system.sh # Copilot integrace test
│   ├── css-validation.sh       # CSS pravidla kontrola
│   └── smart-css-validation.sh # Smart CSS validace
│
├── monitoring/       # Monitoring nástroje
│   ├── auto-super-monitor.sh   # Super monitoring
│   └── auto-js-monitor.sh      # JS monitoring
│
├── utils/           # Pomocné skripty
│   ├── super-test.sh          # Kompletní test
│   └── test-hot-dice-simple.sh # Hot Dice test
│
├── commit.sh        # Alias pro smart-commit
├── setup-project.sh # Projekt setup a workflow info
└── hlavni-test.sh   # Hlavní test systém
```

## 🚀 Hlavní příkazy

### Development workflow
```bash
npm run dev          # Spustí vývojářský server
npm run watch        # Sleduje změny a validuje
npm run commit       # Validace + commit + push
```

### Testování
```bash
npm run test         # Kompletní test suite
npm run test:quick   # Rychlé testy
npm run test:ui      # UI testy
npm run validate     # CSS validace
```

### Monitoring
```bash
npm run monitor      # Spustí super monitoring
./skripty/utils/super-test.sh  # Manuální kompletní test
```

## 📋 Popis jednotlivých skriptů

### `automatizace/auto-watcher.sh`
- Sleduje změny v `src/` složce
- Automaticky spouští validaci při změnách
- Nabízí commit po úspěšné validaci

### `automatizace/smart-commit.sh`  
- Kompletní validace před commitem
- Automatický commit s generovanou zprávou
- Push na GitHub
- Rollback při chybách

### `testy/master-test-runner.sh`
- Kompletní test suite pro celou aplikaci
- Unit testy herní logiky
- UI interakční testy
- CSS validace
- Real-game simulace

### `validace/smart-css-validation.sh`
- Smart validace - kontroluje jen nové změny
- Blokuje pouze kritické chyby
- Upozorňuje na nedoporučené praktiky

### `utils/super-test.sh`
- Super kompletní validace při změnách JS
- Kontrola duplikátů funkcí
- Validace CSS pravidel
- Syntax kontrola

## ⚙️ Konfigurace

### VS Code integration
Skripty se automaticky spouští:
- `auto-selfcheck.sh` při otevření VS Code
- `auto-watcher.sh` na pozadí pro monitoring
- Úkoly definované v `.vscode/tasks.json`

### Git hooks
- Pre-commit hook pro validaci
- Post-commit pro cleanup
- Husky konfigurace v `package.json`

## 🔧 Troubleshooting

### Časté problémy
```bash
# Skripty nemají spustitelná práva
chmod +x skripty/**/*.sh

# inotify-tools není nainstalován (pro auto-watcher)
sudo apt-get install inotify-tools

# Python není dostupný (pro HTTP server)
sudo apt-get install python3
```

### Debug režim
```bash
# Spuštění s debug výstupem
bash -x ./skripty/testy/master-test-runner.sh

# Kontrola log souborů
tail -f js-errors.log
tail -f monitor.log
```

---

**Všechny skripty jsou navržené pro automatický workflow - stačí otevřít VS Code a programovat!**
