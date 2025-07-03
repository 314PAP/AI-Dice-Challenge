# 🚀 GitHub Pages Setup Guide

## 🔧 PROBLÉM S DEPLOYMENT ŘEŠEN

### ❌ Původní problém:
- GitHub Actions deploy job selhával s "HttpError: Not Found"
- Workflow testoval starý CSS systém (modular.css místo main.css)
- Deploy job měl špatnou konfiguraci

### ✅ Oprava provedena:

#### 1. **Workflow aktualizace** (`.github/workflows/deploy.yml`)
```yaml
# Nový workflow rozdělený na build + deploy jobs
name: 🚀 Deploy AI Dice Challenge

on:
  push:
    branches: [ main ]

jobs:
  build:
    # Builduje projekt a vytvoří artifacts
    
  deploy:
    # Deployuje na GitHub Pages
    needs: build  # Čeká na dokončení build job
```

#### 2. **CSS systém oprava**
```yaml
# Starý (nefunkční):
test -f src/styles/modular.css

# Nový (funkční):  
test -f src/styles/main.css
```

#### 3. **Build verifikace**
- ✅ Lokální build funguje: `npm run build`
- ✅ CSS: 55.44 kB (10.84 kB gzipped)
- ✅ JS: 52.99 kB (15.36 kB gzipped) 
- ✅ Všechny assety správně generovány

## 🔍 NASTAVENÍ GITHUB PAGES

### V GitHub repozitáři je potřeba:

1. **Jít do Settings → Pages**
2. **Source**: Změnit na "GitHub Actions" (ne "Deploy from a branch")
3. **Build and deployment**: GitHub Actions

### 📋 Checklist nastavení:
- [ ] Repository → Settings → Pages
- [ ] Source: "GitHub Actions" ✓
- [ ] Permissions: `contents: read, pages: write, id-token: write` ✓
- [ ] Workflow file: `.github/workflows/deploy.yml` ✓
- [ ] Build lokálně funguje: `npm run build` ✓

## 🎯 VÝSLEDEK

Po pushnutí oprav by měl workflow:
1. ✅ **Build job**: Sestavit projekt bez chyb
2. ✅ **Deploy job**: Úspěšně nasadit na GitHub Pages

## 📧 MONITORING

GitHub pošle email notification při:
- ✅ Úspěšném deploynmentu
- ❌ Selhání s detaily chyby

## 🔗 OČEKÁVANÁ URL

Po úspěšném deployment:
```
https://314PAP.github.io/AI-Dice-Challenge/
```

## 🆘 TROUBLESHOOTING

### Pokud stále selhává:

1. **Zkontrolovat GitHub Pages nastavení**
2. **Zkontrolovat permissions v repozitáři**
3. **Zkontrolovat branch name (main vs master)**
4. **Zkontrolovat GITHUB_TOKEN permissions**

### Debug příkazy:
```bash
# Lokální build test
npm run build

# Zkontrolovat strukturu
ls -la dist/

# Zkontrolovat workflow soubor
cat .github/workflows/deploy.yml
```

---

**✅ Opravy jsou pushnuté a workflow by nyní měl fungovat správně!**
