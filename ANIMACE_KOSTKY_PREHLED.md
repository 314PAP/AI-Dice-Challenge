# 🎲 ANIMAČNÍ MOŽNOSTI PRO KOSTKY - KOMPLETNÍ PŘEHLED

## 📚 DOSTUPNÉ ANIMAČNÍ KNIHOVNY

### 🌟 **1. ANIMATE.CSS** (základní animace)
```css
/* Příchod kostek */
fadeInUp, fadeInDown, fadeInLeft, fadeInRight
bounceIn, bounceInUp, bounceInDown
slideInUp, slideInDown, slideInLeft, slideInRight
zoomIn, zoomInUp, zoomInDown

/* Výběr/označení kostek */
pulse, heartBeat, tada, swing, shake
bounceIn, rubberBand, jello, wobble
flipInX, flipInY, rotateIn

/* Házení kostek */
rotateIn, rotateInUpLeft, rotateInUpRight
flipInX, flipInY, bounce, flash
```

### ✨ **2. MAGIC.CSS** (efektní animace)
```css
/* Spektakulární příchod */
magic, twisterInUp, twisterInDown
puffIn, puffOut, vanishIn, vanishOut
openDownLeft, openDownRight, openUpLeft, openUpRight
perspectiveDown, perspectiveUp, perspectiveLeft, perspectiveRight

/* 3D efekty */
rotate, rotateUp, rotateDown, rotateLeft, rotateRight
flip, flipInX, flipInY, flipOutX, flipOutY
```

### 🎯 **3. HOVER.CSS** (hover efekty)
```css
/* Jemné hover efekty */
grow, shrink, pulse-grow, pulse-shrink
float, sink, bob, hang
buzz, buzz-out

/* 2D transformace */
push, pop, rotate, grow-rotate, shrink-rotate
pulse, pulse-grow, pulse-shrink

/* 3D efekty */
threed-1, threed-2, threed-3, threed-4
```

### 💥 **4. CSSHAKE** (shake animace)
```css
/* Různé druhy otřásání */
shake, shake-hard, shake-slow, shake-little
shake-horizontal, shake-vertical
shake-rotate, shake-opacity, shake-crazy
```

---

## 🎲 NÁVRHY ANIMACÍ PRO KOSTKY

### 🔄 **1. HÁZENÍ KOSTEK** (nejdůležitější!)
```css
/* Realistické házení s 3D efektem */
.dice-rolling {
  animation: 
    rotateIn 0.3s ease-in-out,
    shake-hard 2s ease-in-out 0.3s,
    magic 0.5s ease-out 2.3s;
  transform-style: preserve-3d;
}

/* Alternativa - jednodušší */
.dice-rolling-simple {
  animation: flipInX 0.5s ease-in-out infinite;
}
```

### ✨ **2. PŘÍCHOD NOVÝCH KOSTEK**
```css
/* Dramatický příchod */
.dice-spawn {
  animation: puffIn 0.8s ease-out;
}

/* Jemnější příchod */
.dice-spawn-soft {
  animation: fadeInUp 0.6s ease-out;
}

/* 3D příchod */
.dice-spawn-3d {
  animation: perspectiveDown 0.8s ease-out;
}
```

### 🎯 **3. VÝBĚR/OZNAČENÍ KOSTEK**
```css
/* Výrazné označení */
.dice-selected {
  animation: tada 1s ease-in-out;
  transform: scale(1.05);
}

/* Jemné označení */
.dice-selected-soft {
  animation: pulse-grow 2s ease-in-out infinite;
}

/* Magické označení */
.dice-selected-magic {
  animation: magic 0.6s ease-out;
}
```

### 💫 **4. HOVER EFEKTY**
```css
/* Jemný hover */
.dice:hover {
  animation: float 1s ease-in-out infinite;
}

/* Výraznější hover */
.dice:hover {
  animation: grow 0.3s ease-in-out;
}

/* 3D hover */
.dice:hover {
  animation: threed-2 0.3s ease-in-out;
}
```

### 🔥 **5. SPECIÁLNÍ STAVY**

#### 💎 **HOT DICE (všechny kostky odloženy)**
```css
.dice-hot-dice {
  animation: 
    magic 0.8s ease-out,
    pulse 2s ease-in-out infinite 0.8s;
  filter: hue-rotate(45deg) brightness(1.2);
}
```

#### 💥 **FARKLE**
```css
.dice-farkle {
  animation: 
    shake-crazy 0.8s ease-in-out,
    vanishOut 0.5s ease-in 0.8s;
}
```

#### 🏆 **SCORING (body získány)**
```css
.dice-scoring {
  animation: 
    flash 0.3s ease-in-out 3,
    bounceOut 0.5s ease-in 0.9s;
}
```

---

## 🎨 3D EFEKTY PRO KOSTKY

### 🔲 **CSS 3D TRANSFORMACE**
```css
.dice-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  
  /* Základní 3D stíny */
  box-shadow: 
    0 0 0.5rem var(--neon-green),
    inset 0 0 0.2rem rgba(255, 255, 255, 0.1),
    0 0.2rem 0.4rem rgba(0, 0, 0, 0.3);
    
  /* Gradientní pozadí pro 3D efekt */
  background: linear-gradient(145deg, 
    var(--neon-black) 0%,
    rgba(57, 255, 20, 0.1) 50%,
    var(--neon-black) 100%);
}

/* 3D rotace při házení */
.dice-3d-rolling {
  animation: 
    rotateX 1s linear infinite,
    rotateY 1.5s linear infinite;
}

@keyframes rotateX {
  from { transform: rotateX(0deg); }
  to { transform: rotateX(360deg); }
}

@keyframes rotateY {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}
```

### 🌟 **NEONOVÉ 3D EFEKTY**
```css
.dice-neon-3d {
  /* Vícevrstvé neonové stíny */
  box-shadow: 
    0 0 0.2rem var(--neon-green),
    0 0 0.4rem var(--neon-green),
    0 0 0.8rem var(--neon-green),
    inset 0 0 0.1rem rgba(57, 255, 20, 0.2),
    0 0.3rem 0.6rem rgba(0, 0, 0, 0.4);
    
  /* Reflexní efekt */
  background: 
    radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%),
    var(--neon-black);
}
```

---

## 🎮 DOPORUČENÉ KOMBINACE

### 🥇 **NEJLEPŠÍ VOLBA** (elegantní + výkonné)
```css
/* Idle stav */
.dice { animation: float 3s ease-in-out infinite; }

/* Házení */
.dice-rolling { animation: flipInX 0.5s ease-in-out infinite; }

/* Výběr */
.dice.selected { animation: tada 1s ease-out; }

/* Hover */
.dice:hover { animation: grow 0.3s ease-out; }

/* HOT DICE */
.dice-hot { animation: magic 0.8s ease-out; }
```

### 🎯 **VÝKONNÁ VOLBA** (spektakulární)
```css
/* Házení s 3D */
.dice-rolling { 
  animation: 
    magic 0.5s ease-out,
    shake-hard 1.5s ease-in-out 0.5s,
    rotateIn 0.5s ease-out 2s;
}

/* Výběr s efektem */
.dice.selected { 
  animation: puffIn 0.6s ease-out; 
  transform: scale(1.05) rotateZ(5deg);
}
```

### 🕹️ **RETRO VOLBA** (8-bit styl)
```css
/* Pixelové animace */
.dice-pixel { 
  animation: 
    pulse 2s ease-in-out infinite,
    shake-little 0.1s ease-in-out infinite;
  image-rendering: pixelated;
}
```

---

## 💡 IMPLEMENTAČNÍ TIPY

1. **Performace**: Používej `transform` místo změn `width/height`
2. **3D**: Přidej `transform-style: preserve-3d` pro 3D efekty
3. **Smooth**: Použij `will-change: transform` pro lepší výkon
4. **Kombinace**: Můžeš kombinovat více animací s `animation: anim1, anim2`
5. **Responsive**: Animace fungují na všech velikostech obrazovky

**Všechny tyto knihovny jsou již načtené a připravené k použití!** 🚀
