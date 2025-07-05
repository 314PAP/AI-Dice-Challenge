# 📝 CHANGELOG - AI KOSTKOVÁ VÝZVA

## [FINÁLNÍ] - 2025-01-05

### 🎉 MAJOR RELEASE - Projekt dokončen

### ✅ Added
- **Finální dokumentace** - kompletní přehled projektu
- **Mobilní layout** - plně funkční responzivní design
- **CSS utility třídy** - .anim-delay-*, .make-visible, .min-h-*
- **Barevné neonové tlačítka** - kombinované třídy .btn-neon.neon-*
- **Vite.config.js** - konfigurace pro ignorování archivních souborů
- **Mobilní mezery** - gap mezi chatem a menu (0.75rem/1rem)

### 🔧 Changed
- **CSS importy** - z node_modules na CDN (animate.css, AOS)
- **Mobilní šablony** - napojeny na desktop styly
- **Bootstrap přepisy** - minimalizovány na nezbytné minimum
- **Inline styly** - všechny odstraněny z main-bootstrap.js
- **Mobilní barvy** - sjednoceny s desktop verzí

### 🗂️ Moved
- **Staré soubory** → `cleanup_archive/old_documentation/`
- **Testovací soubory** → `cleanup_archive/mobile_test_files/`
- **Agresivní CSS** → `cleanup_archive/bootstrap-override-aggressive.css`

### 🐛 Fixed
- **Mobilní layout** - nyní se zobrazuje správně na < 768px
- **Chat input** - neonově zelená barva a správný focus
- **Kostky layout** - odložené kostky horizontálně
- **Avatary layout** - vedle sebe na desktop, pod sebou na mobilu
- **Mobilní barvy** - ne vše zelené, správné barevné rozlišení
- **Mezery v mobilu** - komponenty se nelepí na sebe

---

## [BETA] - 2025-01-03

### ✅ Added
- **Bootstrap responzivní layout** - desktop/mobile rozdělení
- **CSS architektura** - modulární struktura stylů
- **Neonové efekty** - kompletní barevná paleta
- **Herní mechaniky** - Farkle pravidla a AI osobnosti

### 🔧 Changed
- **CSS refaktoring** - přechod na Bootstrap-first přístup
- **Responsive design** - mobilní a desktop layout

### 🐛 Fixed
- **CSS konflikty** - vyčištění duplicitních stylů
- **Layout problémy** - responzivní chování

---

## [ALPHA] - 2024-12-XX

### ✅ Added
- **Základní herní logika** - kostky, hráči, bodování
- **AI systém** - chatbot osobnosti
- **Neonový design** - základní vzhled
- **Modální okna** - pravidla, síň slávy

---

**Legenda:**
- 🎉 Major release
- ✅ Added - nová funkcionalita
- 🔧 Changed - změny existující funkcionality  
- 🗂️ Moved - přesunuté soubory
- 🐛 Fixed - opravené chyby
- ❌ Removed - odstraněná funkcionalita
