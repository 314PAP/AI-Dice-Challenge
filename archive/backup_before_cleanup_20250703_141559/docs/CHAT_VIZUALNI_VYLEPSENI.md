# Vylepšení UI a UX Chatu

## Provedené změny

### 1. Odstranění modré čáry mezi kostkami
- Odstraněna modrá čára mezi odloženými a hranými kostkami
- Zachováno správné řazení kostek zprava doleva

### 2. Vylepšení Farkle zprávy
- Zvýšena pozice nápisu Farkle z `-40px` na `-60px` nad avatarem
- Zabráněno problikávání přes avatar hráče

### 3. Vylepšení vzhledu chatu
- Přidán nadpis "AI CHAT" s neonovou ikonou
- Zvětšeno vstupní pole pro psaní zpráv (výška `50px`)
- Zvětšen text v chatu na `1.1rem`
- Upraveny barvy textu a vstupu na neonovou zelenou

### 4. Obarvení jmen hráčů v chatu
- Každý hráč má své jméno v příslušné neonové barvě:
  - Human: zelená
  - Gemini: modrá
  - ChatGPT: růžová
  - Claude: oranžová
  - Systém: žlutá
- Přidán neonový efekt na jména hráčů pomocí text-shadow

### 5. Integrace nové knihovny ikon
- Přidána knihovna Remix Icon pro outline ikony
- Vytvořen nový soubor `icons.css` s neonovými styly pro ikony
- Ikony jsou nyní konzistentní s celkovým vizuálním stylem hry

### 6. Vylepšení responzivního designu
- Optimalizováno zobrazení na různých zařízeních:
  - Desktop (>1200px): 65% hra, 35% chat
  - Tablet (800-1200px): 68% hra, 32% chat
  - Mobil (<800px): chat pod hrou, optimalizovaná výška
- Na mobilních zařízeních jsou zmenšeny fonty a výšky pro lepší čitelnost

### 7. Přidáno tlačítko pro sbalení/rozbalení chatu
- Přidán toggle button s neonovým efektem
- Chat lze nyní minimalizovat pro lepší zážitek na všech zařízeních

## Technické detaily
- Nové CSS soubory:
  - `/src/styles/components/icons.css` - Neonové ikony s Remix Icon integrací
  - `/src/styles/layout/grid/chat-layout.css` - Responzivní rozložení chatu
- Upravené soubory:
  - `index.html` - Přidána knihovna ikon, upraven nadpis chatu
  - `enhancedChatController.js` - Přidány barvy jmen hráčů
  - `chat.css` - Vylepšeno stylování a responzivní design
  - `speechBubbles.js` - Zvýšena pozice Farkle zprávy
  - `banked.css` - Odstraněna modrá čára mezi kostkami
