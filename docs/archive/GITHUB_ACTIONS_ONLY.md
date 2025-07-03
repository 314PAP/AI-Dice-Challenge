# 🧪 BUILD TEST WORKFLOW - GitHub Actions bez Pages

## 🎯 ŘEŠENÍ BEZ PLACENÉHO ÚČTU

Protože GitHub Pages vyžadují placený účet, změnili jsme strategii:

### ❌ Co jsme odstranili:
- GitHub Pages deployment workflow
- Deploy na GitHub Pages
- Placené funkce

### ✅ Co zůstává:
- **Build test workflow** - testuje, že projekt se správně sestaví
- **Automatické testování** na každý push do main
- **Verifikace CSS systému** - kontroluje nový modulární systém

## 🔧 NOVÝ WORKFLOW

### Soubor: `.github/workflows/test-build.yml`

```yaml
name: 🧪 Test Build - AI Dice Challenge

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: 📁 Checkout
    - name: 🛠️ Setup Node.js  
    - name: 📦 Install dependencies
    - name: 🏗️ Build project
    - name: 🧪 Verify build
```

### Co workflow dělá:
1. **Stáhne kód** z repozitáře
2. **Nainstaluje závislosti** (`npm ci`)
3. **Sestaví projekt** (`npm run build`)
4. **Ověří výsledek** (zkontroluje dist/ složku)
5. **Ukáže statistiky** build velikosti

## ✅ VÝHODY

- ✅ **Zdarma** - žádné placené funkce
- ✅ **Rychlé** - jen build test (1-2 minuty)
- ✅ **Užitečné** - zjistíme hned, když se něco pokazí
- ✅ **Informativní** - ukáže velikost buildu

## 📧 NOTIFIKACE

GitHub stále pošle email při:
- ✅ **Úspěšném buildu** 
- ❌ **Selhání buildu** s detaily chyby

## 🎯 VÝSLEDEK

Teď když pushujete do main:
1. GitHub Actions automaticky **otestuje build**
2. Dostanete **email notification** o výsledku  
3. V GitHub repozitáři uvidíte **zelené ✓** nebo **červené ❌**

## 🚀 DEPLOY ALTERNATIVY (volitelné)

Pokud chcete projekt nasadit, můžete použít:

### Zdarma hosting:
- **Netlify** - automatický deploy z GitHub
- **Vercel** - stejně jako Netlify  
- **GitHub Codespaces** - pro development
- **Render** - free tier hosting

### Manuální deploy:
```bash
# Lokální build
npm run build

# Upload dist/ složky kamkoliv
# (FTP, hosting, vlastní server...)
```

---

**✅ Problém s GitHub Pages vyřešen - žádné placené funkce nejsou potřeba!**
