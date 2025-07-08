# 📂 Backup složka - Alternativní verze aplikace

Tato složka obsahuje alternativní verze AI Dice Challenge aplikace, které byly vytvořeny během vývoje jako backup nebo experimentální implementace.

## 📄 Obsah

### HTML verze
- `index-ultra-minimal.html` - Ultra-minimální verze s méně CSS kódu
- Používá `app-ultra-minimal.js` a `bootstrap-minimal.css`

### JavaScript aplikace  
- `app-ultra-minimal.js` - Minimální verze hlavní aplikace
- `app-fixed.js` - Starší opravená verze (nepoužívaná)

### CSS styly
- `bootstrap-minimal.css` - Ultra-minimální styly (pouze 75 řádků)
- `bootstrap-pure-no-important.css` - Experimentální verze bez !important

## 🎯 Účel

Tyto soubory slouží jako:
- **Záloha** pro případ potřeby rollback
- **Referenční implementace** pro porovnání přístupů
- **Experimentální verze** pro testování nových funkcí

## ⚠️ Poznámka

Hlavní produkční aplikace je v kořenovém adresáři:
- `index.html` + `src/app-ultra-bootstrap.js` + `src/styles/bootstrap-first-pure.css`

Backup verze nejsou automaticky synchronizované s hlavní aplikací.
