# 🎮 REFAKTORING NA BOOTSTRAP UTILITY

## Přehled změn z vlastního CSS na Bootstrap utility třídy

Tento dokument popisuje, jak refaktorovat stávající CSS layout na Bootstrap utility třídy při zachování neonového designu.

## 🔄 Mapování CSS na Bootstrap utility třídy

### 1. Layout kontejnery

#### Původní CSS:
```css
.app-container {
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

#### Bootstrap ekvivalent:
```html
<div class="container-fluid vh-100 p-0 m-0 d-flex flex-column overflow-hidden bg-dark-80 neon-border">
```

### 2. Hlavní rozložení

#### Původní CSS:
```css
.main-layout {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

#### Bootstrap ekvivalent:
```html
<div class="d-flex flex-column flex-md-row h-100 w-100 overflow-hidden">
```

### 3. Herní oblast a chat panel

#### Původní CSS:
```css
.game-area {
  flex: 0 0 65%;
  max-width: 65%;
  height: 100%;
}

.chat-panel {
  flex: 0 0 35%;
  max-width: 35%;
  height: 100%;
}
```

#### Bootstrap ekvivalent:
```html
<!-- Herní oblast -->
<div class="w-100 h-100 order-1 overflow-auto p-3" style="flex: 0 0 65%; max-width: 65%;">

<!-- Chat panel -->
<div class="w-100 order-2 d-md-block neon-border" style="height: 40vh; flex: 0 0 35%; max-width: 35%;">
```

### 4. Responzivita pro mobilní zařízení

#### Původní CSS:
```css
@media (max-width: 767.98px) {
  .main-layout {
    flex-direction: column;
  }
  
  .game-area {
    width: 100%;
    order: 1;
  }
  
  .chat-panel {
    width: 100%;
    order: 2;
    height: 40vh;
  }
}
```

#### Bootstrap ekvivalent:
```html
<!-- Hlavní layout se automaticky překlopí díky flex-column flex-md-row -->
<div class="d-flex flex-column flex-md-row h-100 w-100">

<!-- Herní oblast a chat panel mají definované order-1 a order-2 -->
<div class="w-100 order-1 ...">
<div class="w-100 order-2 ...">
```

## 🎨 Neonové Bootstrap utility

Vytvořené neonové utility třídy v souboru `neon-bootstrap-utilities.css`:

### Barvy
- `neon-green` - základní neonová zelená
- `neon-blue` - neonová modrá
- `neon-pink` - neonová růžová
- `neon-orange` - neonová oranžová

### Komponenty
- `btn-neon` - neonové tlačítko
- `form-control-neon` - neonový input
- `card-neon` - neonová karta

### Efekty
- `neon-border` - neonový rámeček
- `neon-text` - neonový text
- `neon-pulse` - pulzující neonový efekt
- `neon-grow` - zvětšující se efekt při najetí myší
- `neon-blink` - blikající neonový efekt

### Pozadí
- `bg-dark-90`, `bg-dark-80`, `bg-dark-70` - tmavá pozadí s různou průhledností

## 📱 Bootstrap Breakpointy

- `xs` < 576px (implicitně)
- `sm` ≥ 576px
- `md` ≥ 768px
- `lg` ≥ 992px
- `xl` ≥ 1200px
- `xxl` ≥ 1400px

## 📚 Vzorový HTML soubor

Ukázkový soubor `bootstrap-layout-demo.html` obsahuje kompletní implementaci layoutu pomocí Bootstrap utility tříd:

- Základní layout s responzivním přepínáním
- Herní komponenty
- Chat panel
- Ukázkový modál

## 🔍 Postup refaktoringu

1. Nahradit CSS třídy v HTML odpovídajícími Bootstrap utilitami
2. Zachovat speciální neonové efekty pomocí custom utility tříd
3. Použít kombinaci inline stylů a Bootstrap utilit pro zachování stejného vzhledu
4. Testovat responzivitu na všech zařízeních

## 📋 Shrnutí výhod

- **Méně vlastního CSS** - využití hotových Bootstrap utilit
- **Lepší responzivita** - Bootstrap má propracovaný responzivní systém
- **Snadnější údržba** - standardizované utility třídy
- **Rychlejší vývoj** - konzistentní CSS pravidla
- **Zachovaný neonový design** - díky vlastním utility třídám
