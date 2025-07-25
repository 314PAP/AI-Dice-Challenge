# 🛡️ Automatický zálohovací systém

Tato složka obsahuje skripty pro automatické zálohování projektu. Zálohy se ukládají do složky `.backup` v nadřazené složce projektu.

## 📋 Obsah

- `zaloha.sh` - Hlavní zálohovací skript, který vytváří zálohu projektu
- `install.sh` - Skript pro instalaci zálohovacího systému do nového projektu
- `transfer.sh` - Skript pro přenos zálohovacího systému mezi projekty

## 🚀 Použití

### 1. Vytvoření zálohy

```bash
bash zaloha.sh
```

### 2. Instalace do nového projektu

```bash
bash install.sh /cesta/k/projektu
```

### 3. Přenos mezi projekty

```bash
bash transfer.sh /cesta/k/cílovému/projektu
```

## ⚙️ Automatické spouštění

Pro automatické spouštění zálohovacího skriptu každou hodinu přidejte následující do svého crontabu:

```bash
0 * * * * cd /cesta/k/projektu && bash .tools/auto-backup/zaloha.sh
```

## 🔄 Verze

1.0.0 - Základní funkčnost
