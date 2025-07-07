# MOBILNI_CHAT_VYSKA_OPRAVA.md

## Oprava výšky chat messages v mobilní verzi

### Problém
V mobilní verzi se chat messages nezobrazovaly v plné výšce dostupného prostoru - zobrazovaly se jen poslední 2 řádky místo využití celé 40% výšky obrazovky.

### Příčina
Chat kontejner měl správnou strukturu s `flex-grow-1` pro `.chat-messages`, ale v mobilní verzi nebyly správně nastaveny CSS vlastnosti pro využití celé dostupné výšky.

### Řešení
Přidány specifické CSS styly pro mobilní verzi (`@media (max-width: 767.98px)`) do `src/styles/components/chat.css`:

```css
/* Mobilní chat - zajistit správnou výšku pro chat messages */
@media (max-width: 767.98px) {
  /* Chat container v mobilní verzi musí využít celou dostupnou výšku */
  .chat-container {
    height: 100% !important;
  }
  
  /* Chat messages se musí správně roztáhnout */
  .chat-messages {
    flex-grow: 1 !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow-y: auto !important;
  }
  
  /* Zajistit, že chat header a input nezaberou příliš místa */
  .chat-input {
    flex-shrink: 0 !important;
    margin-top: auto !important;
  }
}
```

### Struktura mobilního chatu
Chat v mobilní verzi zachovává správnou strukturu:
- **Hlavní div**: `h-40` (40% výšky obrazovky)
- **Chat container**: `h-100 d-flex flex-column` (využije celou dostupnou výšku)
- **Chat messages**: `flex-grow-1` (roztáhne se na dostupný prostor)
- **Chat input**: `flex-shrink-0 mt-auto` (zůstane na spodku)

### Výsledek
✅ Chat messages nyní využívají celou dostupnou výšku v mobilní verzi
✅ Zachována původní 40% výška pro celý chat kontejner
✅ Správně funguje scrollování v chat messages
✅ Input pole zůstává na spodku

**Datum opravy**: 2024-01-09
**Status**: ✅ HOTOVO
