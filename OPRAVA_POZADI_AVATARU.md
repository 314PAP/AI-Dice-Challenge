# 🎮 Oprava pozadí avatarů aktivních hráčů

## 🔍 Identifikace problému

U aktivních hráčů se měnila barva pozadí v závislosti na jejich typu. To nebylo žádoucí, protože pozadí mělo zůstat černé (rgba(0, 0, 0, 0.8)) a pouze okraj (border) měl svítit neonem v barvě hráče.

## 🛠️ Provedené změny

### 1. Úprava CSS stylů aktivních hráčů

- **active-states.css**: 
  - Odstraněny gradientní pozadí z pseudo-elementů `::before`
  - Přidáno explicitní nastavení `background: rgba(0, 0, 0, 0.8) !important` 
  - Nastavena průhlednost pseudo-elementů na 0

### 2. Úprava inline stylů v JavaScript souborech

- **scoreboard.js**:
  - Do inline stylů pro aktivního hráče přidáno nastavení `background: rgba(0, 0, 0, 0.8) !important`
  - Tím je zajištěno, že žádná kaskáda stylů nemůže změnit pozadí

- **gameFlowController.js**:
  - Přidáno explicitní nastavení pozadí pro vítěze hry

### 3. Úprava animací

- **activePlayerAnimation.css**:
  - Přidáno explicitní nastavení pozadí pro animace aktivního hráče

- **winner.css**:
  - Přidáno explicitní nastavení černého pozadí pro vítěze

## ✅ Výsledek

Po těchto úpravách:
- Avatar aktivního hráče má vždy černé pozadí
- Neonové zvýraznění se aplikuje pouze na okraj (border)
- Barva zvýraznění odpovídá typu hráče (zelená pro člověka, modrá pro Gemini, růžová pro ChatGPT, oranžová pro Claude)
- Styl je konzistentní jak pro aktivní hráče během hry, tak pro vítěze po konci hry
