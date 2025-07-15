/* ===================================================================
   AI DICE CHALLENGE - SOUND SYSTEM
   8-bit retro zvuky pro kostky a herní akce - ENHANCED VERSION
   ================================================================= */

/**
 * 🎵 ENHANCED SOUND SYSTEM - 8-BIT STYLE
 * Vylepšené zvuky s autentickým 8-bit feelingem
 */
class MicroSoundSystem {
    constructor() { 
        this.enabled = true; 
        this.volume = 0.4; 
        this.ctx = null;
    }
    
    getAudioContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.ctx;
    }
    
    async play(sound) {
        if (!this.enabled) return;
        try {
            const ctx = this.getAudioContext();
            
            switch(sound) {
                case 'diceRoll':
                    this.playDiceRollSound(ctx);
                    break;
                case 'diceClick':
                    this.playClickSound(ctx);
                    break;
                case 'diceKeep':
                    this.playKeepSound(ctx);
                    break;
                case 'score':
                    this.playScoreSound(ctx);
                    break;
                case 'farkle':
                    this.playFarkleSound(ctx);
                    break;
                case 'aiTurn':
                    this.playAiTurnSound(ctx);
                    break;
                default:
                    this.playSimpleBeep(ctx, 440);
            }
        } catch(e) { 
            console.warn('Sound playback failed:', e); 
        }
    }
    
    playDiceRollSound(ctx) {
        // Skutečný zvuk kutálení kostek - série náhodných clicků
        const duration = 1200; // Delší pro realistický efekt
        const clickCount = 15;
        
        for (let i = 0; i < clickCount; i++) {
            const freq = 600 + Math.random() * 400; // Náhodné frekvence 600-1000Hz
            const delay = (i * duration) / clickCount + Math.random() * 50;
            const clickDuration = 0.04;
            const volume = 0.4 - (i * 0.02);
            
            setTimeout(() => {
                this.playShortClick(ctx, freq, clickDuration, volume);
            }, delay);
        }
    }
    
    playShortClick(ctx, freq, duration, volume) {
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = freq;
            osc.type = 'square';
            
            gain.gain.setValueAtTime(this.volume * volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch(e) {
            // Tichý failsafe
        }
    }
    
    playClickSound(ctx) {
        // Krátký, ostrý click pro UI
        this.playSimpleBeep(ctx, 1000, 0.08, 'square');
    }
    
    playKeepSound(ctx) {
        // Pozitivní "ding" pro odložení kostky
        const freq = 880;
        const duration = 0.25;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }
    
    playScoreSound(ctx) {
        // Pozitivní melodie C-E-G
        const notes = [523, 659, 784];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playSimpleBeep(ctx, freq, 0.2, 'triangle');
            }, i * 120);
        });
    }
    
    playFarkleSound(ctx) {
        // Negativní sestupný zvuk
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.6);
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    }
    
    playAiTurnSound(ctx) {
        // Robotický AI zvuk
        const frequencies = [280, 320, 280];
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playSimpleBeep(ctx, freq, 0.12, 'square');
            }, i * 150);
        });
    }
    
    playSimpleBeep(ctx, freq = 440, duration = 0.1, type = 'square') {
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = freq;
            osc.type = type;
            
            gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch(e) {
            // Tichý failsafe
        }
    }
    
    setVolume(v) { 
        this.volume = Math.max(0, Math.min(1, v)); 
    }
    
    toggle() { 
        this.enabled = !this.enabled; 
        return this.enabled; 
    }
    
    stopAll() { 
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
    }
}

export default new MicroSoundSystem();
