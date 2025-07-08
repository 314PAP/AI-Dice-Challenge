# 🎲 AI Dice Challenge - Neonová kostková výzva

> **Modulární kostková hra s AI osobnostmi postavená na Bootstrap-first přístupu**
> 
> ✅ **100% Bootstrap utility třídy** | ✅ **Plně responzivní** | ✅ **Neonový design** | ✅ **Čistá architektura**

## 🚀 Rychlý start

```bash
# Development server (doporučeno)
npm run dev

# Production build  
npm run build

# Preview produkční verze
npm run preview

# Jednoduchý server
python3 -m http.server 3000
```

## 📁 Struktura projektu

```
AIDICE/
├── index.html                          ← JEDINÝ VSTUPNÍ BOD
├── src/
│   ├── app-ultra-bootstrap.js          ← HLAVNÍ APLIKACE
│   ├── ultra-bootstrap-autocomplete.js ← AUTOCOMPLETE FUNKCIONALITA
│   └── styles/
│       └── bootstrap-first-pure.css    ← JEDINÝ CSS SOUBOR (neonové styly)
├── backup/                             ← BACKUP VERZE
├── test-archive/                       ← ARCHIVOVANÉ TESTOVACÍ SOUBORY
├── archive/                            ← ARCHIVOVANÉ DOKUMENTY
├── package.json                        ← NPM KONFIGURACE
└── vite.config.js                      ← VITE KONFIGURACE
```

## ✨ Klíčové funkce

### 🎮 Herní mechaniky
- **Farkle/Dix Mille** pravidla s kostkami
- **AI protihráči** s jedinečnými osobnostmi (Gemini, ChatGPT, Claude)
- **Real-time chat** s AI reakcemi na herní události
- **Pokročilé skórování** s risk/reward mechanikou

### 🎨 Design & UX
- **Neonový cyberpunk design** s konzistentními barvami
- **100% Bootstrap-first** - žádné vlastní CSS třídy
- **Plná responzivita** - desktop, tablet, mobil
- **Smooth animace** - Animate.css integrace
- **Autocomplete chat** s historií zpráv

### 🛠️ Technické řešení
- **Vite** - moderní build systém
- **ES6 moduly** - čistá architektura
- **Bootstrap 5.3.2** - utility-first CSS
- **SweetAlert2** - elegantní notifikace
- **Lodash** - utility funkce

## 📊 Optimalizace výsledky

### **Redukce kódu:**
- **HTML soubory**: 15+ → 1 (-93%)
- **CSS soubory**: 3 → 1 (-67%)  
- **JS soubory**: 3 → 2 (-33%)
- **CSS řádky**: ~500 → ~200 (-60%)
- **!important pravidla**: 10+ → 0 (-100%)
- **Hardkódované styly**: 20+ → 0 (-100%)

### **Vyčištění projektu:**
- **Testovací soubory**: 14 → archivováno do `test-archive/`
- **Backup verze**: 3 → přesunuto do `backup/`
- **Shell scripty**: 5 → smazáno
- **Log soubory**: 10+ → smazáno  
- **Dokumenty**: 15+ → archivováno do `archive/`
- **Bootstrap Icons** - Ikony
- **SweetAlert2** - Modální okna
- **Animate.css** - Animace
- **Lodash** - JS utility

### **🎮 Funkční features:**
- ✅ Kompletní Farkle pravidla
- ✅ 4 AI protihráči s osobnostmi
- ✅ Real-time chat s AI
- ✅ Responzivní design (desktop/mobile)
- ✅ Loading screen & animace
- ✅ Local storage pro high scores

### Pravidla
- Hoďte kostkami a vyberte skórující kombinace
- Dosáhněte cílového skóre (standardně 10,000 bodů)
- Vyvarujte se FARKLE (žádné skórující kostky)

## 🎨 Design

Neonový retro-futuristický design s:
- Responzivním layoutem (desktop + mobilní)
- Smooth animacemi a hover efekty
- Bootstrap-first přístupem
- Modulární CSS architekturou

## 🛠️ Technické detaily

- **Frontend**: Vanilla JS + Bootstrap 5
- **Build tool**: Vite
- **Styling**: Modulární CSS s CSS proměnnými
- **Architektura**: Komponentový přístup s templates

## 📁 Struktura projektu

```
src/
├── main-simple.js          # Hlavní aplikační logika
├── styles/                 # Modulární CSS
│   ├── variables/         # CSS proměnné (barvy, velikosti)
│   └── components/        # Komponenty (tlačítka, kostky, chat)
└── templates/             # HTML šablony
    ├── game-menu.html     # Hlavní menu
    ├── game-controls.html # Desktop herní ovládání
    └── game-controls-mobile.html # Mobilní ovládání
```

## 🎯 Status projektu

✅ **DOKONČENO** - Plně funkční hra připravená k použití

Více informací v [PROJECT_STATUS.md](PROJECT_STATUS.md)

## 📦 Git archiv

Vývojové větve byly archivovány do `git-archive/`. 
Aktivní je pouze větev `main`.

---

*Vytvořeno s ❤️ pomocí GitHub Copilot*
