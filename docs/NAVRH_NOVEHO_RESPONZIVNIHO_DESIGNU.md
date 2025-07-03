# Návrh kompletně nového responzivního designu s využitím Bootstrap

Po identifikaci problémů v současném responzivním designu navrhuji kompletní přepracování struktury s maximálním využitím nativních Bootstrap tříd a minimem vlastního CSS. Tento přístup by měl řešit všechny zjištěné problémy a zajistit konzistentní fungování na všech zařízeních.

## Identifikované problémy

1. **Mobilní zobrazení (portrét)**: 
   - Chybí nebo není viditelné vstupní pole pro chat
   - Neoptimální proporce mezi herní oblastí a chatem

2. **Landscape režim**: 
   - Správně zobrazuje menu a chat vedle sebe, ale proporce nejsou optimální
   - Mezery a zarovnání nejsou konzistentní

3. **Obecné problémy**:
   - Příliš mnoho vlastních CSS pravidel a media queries komplikuje údržbu
   - Přílišná složitost flexbox nastavení a vlastních CSS proměnných

## Navrhované řešení

### 1. Zjednodušený HTML struktura s Bootstrap utility třídami

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <!-- Standardní meta tagy, CSS importy, atd. -->
</head>
<body class="bg-black min-vh-100 d-flex align-items-center justify-content-center overflow-hidden">
    
    <!-- Hlavní container s maximální velikostí 90% viewportu -->
    <div class="container-fluid p-0 vh-90 vw-90 d-flex">
        
        <!-- Responzivní flexbox container -->
        <div class="row g-3 mx-0 w-100 h-100">
            
            <!-- Herní oblast - na mobilech celá šířka, na větších 70% -->
            <div class="col-12 col-md-8 h-md-100">
                <div class="game-box h-100 d-flex flex-column">
                    <!-- Herní obsah -->
                    <div id="gameContent" class="flex-grow-1 d-flex flex-column"></div>
                </div>
            </div>
            
            <!-- Chat panel - na mobilech menší výška, na větších 30% šířky -->
            <div class="col-12 col-md-4 h-md-100 mt-3 mt-md-0">
                <div class="chat-box h-100 d-flex flex-column">
                    <!-- Chat content -->
                    <div id="chatPanel" class="d-none d-md-flex flex-column h-100"></div>
                    <!-- Mobilní chat se zobrazí pouze na malých obrazovkách -->
                    <div id="chatPanelMobileContainer" class="d-md-none h-100"></div>
                </div>
            </div>
            
        </div>
    </div>
    
    <!-- Modální okna -->
    <div id="modalsContainer"></div>
    
    <!-- Scripty -->
</body>
</html>
```

### 2. Minimální CSS pouze pro specifické styly a neonové efekty

```css
/* Základní neonové efekty a barvy */
:root {
    --neon-green: #39ff14;
    --neon-glow: 0 0 5px var(--neon-green), 0 0 10px var(--neon-green);
    --border-radius: 0.375rem;
}

/* Herní box a chat box - neonové rámečky */
.game-box, .chat-box {
    border: 2px solid var(--neon-green);
    border-radius: var(--border-radius);
    box-shadow: var(--neon-glow);
    background-color: rgba(0, 0, 0, 0.9);
    padding: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Velikost kontejneru 90% viewportu */
.vh-90 {
    height: 90vh;
}
.vw-90 {
    width: 90vw;
}

/* Chat messages container */
.chat-messages {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    margin-bottom: 0.5rem;
}

/* Chat input - vždy viditelný */
.chat-input {
    margin-top: auto;
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.8);
}

/* Media query pro landscape orientaci na mobilech */
@media (max-width: 767.98px) and (orientation: landscape) {
    /* Upravené rozdělení v landscape módu */
    .row {
        flex-direction: row;
    }
    
    /* První sloupec zabírá 60% v landscape */
    .col-12:first-child {
        width: 60%;
        height: 90vh;
    }
    
    /* Druhý sloupec zabírá 40% v landscape */
    .col-12:last-child {
        width: 40%;
        height: 90vh;
        margin-top: 0;
        padding-left: 0.5rem;
    }
}

/* Specifické styly pro velmi malá zařízení */
@media (max-height: 500px) {
    .game-box, .chat-box {
        padding: 0.5rem;
    }
    
    .chat-input {
        padding: 0.25rem;
    }
}
```

### 3. Upravená mobilní chat komponenta

```html
<!-- Mobile Chat Component - Bootstrap optimalizovaná verze -->
<div class="chat-container h-100 d-flex flex-column" id="chatPanelMobile">
  <!-- Chat Header -->
  <div class="chat-header d-flex align-items-center justify-content-center mb-2">
    <h2 class="neon-text neon-green m-0 fs-5">
      <i class="ri-message-3-line me-1"></i>AI CHAT
    </h2>
  </div>
  
  <!-- Chat Messages - s garantovanou výškou -->
  <div class="chat-messages flex-grow-1 overflow-auto small" id="chatMessagesMobile">
    <!-- Systémová zpráva -->
    <div class="chat-message mb-1">
      <strong class="neon-yellow">Systém:</strong> <span class="neon-yellow">Vítejte v AI Kostkové Výzvě!</span>
    </div>
    
    <!-- AI zpráva -->
    <div class="chat-message mb-1">
      <strong class="neon-blue">Gemini:</strong> <span class="neon-blue">Připraven na hru?</span>
    </div>
  </div>
  
  <!-- Chat Input - vždy viditelný díky mt-auto -->
  <div class="chat-input mt-auto">
    <div class="input-group input-group-sm">
      <input type="text" class="form-control bg-black text-neon-green" id="chatInputMobile" placeholder="Napište zprávu...">
      <button class="btn btn-outline-success d-flex align-items-center justify-content-center" type="button" id="sendChatBtnMobile">
        <i class="ri-send-plane-fill"></i>
      </button>
    </div>
  </div>
</div>
```

## Očekávané výhody nového řešení

1. **Méně kódu, jednodušší údržba** - Spoléhání se na Bootstrap třídy minimalizuje vlastní CSS
2. **Konzistentní responzivita** - Bootstrap grid systém je velmi dobře otestovaný
3. **Garantovaná viditelnost vstupního pole** - Díky flexbox layoutu s `mt-auto` pro chat input
4. **Optimální proporce v landscape módu** - Jednoduchá media query pro landscape orientaci
5. **Zachování neonového designu** - Základní styly pro neonové efekty jsou zachovány

## Postup implementace

1. Vytvořit nový CSS soubor s minimálním potřebným stylem
2. Upravit HTML strukturu pro maximální využití Bootstrap tříd
3. Upravit mobilní chat komponentu
4. Otestovat na různých zařízeních a orientacích

Tento přístup je v souladu s moderními trendy vývoje webových aplikací, kde se využívá síla CSS frameworků a minimalizuje se množství vlastního CSS. Výsledkem by měl být čistý, udržitelný a plně responzivní design.
