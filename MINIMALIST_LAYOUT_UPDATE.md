# Minimalistický Design - Dokumentace změn

## Provedené úpravy

### 1. Herní část s vlastním neonovým orámováním
- Herní oblast nyní má vlastní neonový box uvnitř hlavního layoutu
- Přidána třída `.game-box` pro specifické styly herní části
- Zachován neonový efekt s responzivitou

### 2. Chat panel - minimalistický přístup
- Tlačítko pro sbalení chatu přesunuto dovnitř chatu (do headeru)
- Pole pro psaní je nyní vždy dole (pomocí tříd `mt-auto` a flexboxu)
- Minimalizovány rámečky okolo chatu pro čistější vzhled
- Šipka pro odeslání je integrována do pole jako input-group button
- Přidány styly pro lepší interakci a responsivitu

### 3. Struktura kódu
- Vytvořen nový CSS soubor `minimalist-layout.css` pro přehlednost
- Maximální využití Bootstrap utility tříd
- Zachovány neonové efekty, ale s minimalistickým přístupem

### 4. Responzivita
- Layout se přizpůsobuje různým velikostem obrazovky
- Na mobilních zařízeních se panely skládají pod sebe
- Upraveny velikosti prvků pro lepší použitelnost na malých obrazovkách

## Technické detaily

- Použit flexbox pro rozložení komponent
- Input pole a tlačítko pro odeslání spojeny pomocí input-group
- Zachována konzistentnost neonových efektů pro jednotný vzhled
- Chat panel používá sticky pozicování pro pole na psaní

## Další možnosti vylepšení

- Možnost přidat animace při přechodu mezi stavy (sbalení/rozbalení)
- Optimalizace pro tmavý/světlý režim
- Přidání možnosti změnit velikost herní/chat části
