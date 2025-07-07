# 🎨 Neonový Design - Barevná paleta a efekty

## 🌈 OFICIÁLNÍ NEONOVÁ PALETA

### Základní neonové barvy
```css
:root {
  /* HLAVNÍ NEONOVÉ BARVY - pouze tyto používat! */
  --neon-green: #39ff14;     /* Jasně zelená - primární */
  --neon-blue: #194DD1;      /* Elektrická modrá - sekundární */
  --neon-orange: #FF8800;    /* Neonová oranžová - akcenty */
  --neon-pink: #FF00FF;      /* Magenta - speciální */
  --neon-red: #ff3131;       /* Červená - varování */
  --neon-yellow: #ffff00;    /* Žlutá - zvýraznění */
}
```

### 🎯 POUŽITÍ BAREV

#### Neon Green (#39ff14)
- **Primární barva aplikace**
- Hlavní menu a navigace
- Bordery herních kontejnerů
- Systémové zprávy
- Logo a ikona kostky

#### Neon Blue (#194DD1)
- **Chat a komunikace**
- AI Gemini barva
- Bordery chat kontejnerů
- Input fieldy

#### Neon Orange (#FF8800)
- **Akční tlačítka**
- AI Claude barva
- Skóre zvýraznění
- Call-to-action prvky

#### Neon Pink (#FF00FF)
- **AI ChatGPT barva**
- Speciální efekty
- Výjimečné prvky

#### Neon Red (#ff3131)
- **Chyby a varování**
- FARKLE zprávy
- Nebezpečné akce

#### Neon Yellow (#ffff00)
- **Skóre a body**
- Zvýraznění čísel
- Aktivní stavy

### ✨ NEONOVÉ EFEKTY

#### Text Shadow - trojitá záře
```css
text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
```

#### Box Shadow - zářivé bordery
```css
box-shadow: 0 0 5px rgba(57, 255, 20, 0.5);
```

#### Hover efekty
```css
transform: scale(1.05);
box-shadow: 0 0 20px rgba(barva, 0.6);
```

### 🎮 HERNÍ PŘIŘAZENÍ

#### Hráči a jejich barvy
- **Hráč**: `text-neon-green` - zelená
- **AI Gemini**: `text-neon-blue` - modrá  
- **AI ChatGPT**: `text-neon-pink` - magenta
- **AI Claude**: `text-neon-orange` - oranžová

#### UI elementy
- **Herní kontejner**: `border-neon-green` - zelený border
- **Chat kontejner**: `border-neon-blue` - modrý border
- **Kostky**: `border-neon-green` s hover efekty
- **Tlačítka**: Různé neonové varianty

### 🚫 ZAKÁZANÉ BARVY

#### NIKDY nepoužívat:
- Bílou (#ffffff) - pouze v Bootstrap default
- Šedou (#808080) - místo toho bg-black
- Světle modrou - místo toho neon-blue
- Tmavě zelenou - místo toho neon-green
- Jakékoliv pastelové barvy

#### Pozadí POUZE:
- `bg-black` - čisté černé pozadí
- `bg-neon-*` - transparentní neonové pozadí (rgba s alpha 0.1-0.15)

### 🎨 EFEKTNÍ KOMBINACE

#### Nejlepší kombinace:
```css
/* Hlavní kontejner */
bg-black + border-neon-green + text-neon-green

/* Chat */
bg-black + border-neon-blue + text-neon-blue

/* Tlačítka */
transparent + border-neon-* + text-neon-* + hover:scale

/* Kostky */
dark-gradient + border-neon-green + text-neon-green
```

### 📱 RESPONZIVNÍ PRAVIDLA

#### Na všech rozlišeních:
- Neonové efekty zůstávají stejné
- Intenzita záře se nemění
- Barvy konzistentní napříč zařízeními

#### Mobile optimalizace:
- Menší box-shadow pro úsporu výkonu
- Zachování všech neonových efektů
- Stejná barevná paleta

### 🎯 QUALITY CONTROL

#### ✅ Správně:
- Používat pouze definované CSS proměnné
- Bootstrap utility třídy s neonovými rozšířeními
- Konzistentní efekty napříč aplikací

#### ❌ Špatně:
- Hardcoded hex barvy
- Vlastní gradiety mimo definované
- Míchání neonových s pastelovámi

**🌟 VÝSLEDEK: Konzistentní luxusní neonový design s perfektní Bootstrap integrací! 🌟**
