/**
 * 🎲 AI Dice Challenge - Dice Animation Module
 * 
 * Modul pro animace kostek oddělený z GameLogic.js
 * Používá nativní JS místo lodash pro lepší kompatibilitu
 */

import gameState from './gameState.js';
import { rollDice as diceRoll, calculatePoints, hasScoringDice } from './diceMechanics.js';
import soundSystem from '../utils/soundSystem.js';

// Náhrada za lodash range funkci - opraveno
const range = (count) => Array.from({ length: count }, (_, i) => i);

/**
 * Třída pro správu animací kostek
 */
export class DiceAnimationManager {
    constructor() {
        this.isAnimating = false;
    }

    /**
     * Spustí animaci házení kostek - optimalizováno s lodash
     * @param {number} diceCount - Počet kostek
     */
    async playRollingAnimation(diceCount) {
        if (this.isAnimating) {
            console.warn('⚠️ Animace už běží');
            return;
        }

        this.isAnimating = true;

        // 🎵 Spustíme zvuk házení kostek
        soundSystem.play('diceRoll');

        return new Promise((resolve) => {
            let animationCounter = 0;
            const maxIterations = 15; // Delší animace - 3 sekundy

            const animationInterval = setInterval(() => {
                animationCounter++;

                // Generování náhodných čísel pro animaci
                const randomDice = range(diceCount).map(() => Math.floor(Math.random() * 6) + 1);

                // Aktualizujeme kostky s náhodnými čísly pro animaci
                gameState.updateState({
                    currentRoll: randomDice,
                    isRolling: true
                });

                // Po 15 iteracích (3 sekundy) ukončíme animaci
                if (animationCounter >= maxIterations) {
                    clearInterval(animationInterval);

                    // Po animaci ukážeme finální výsledek
                    setTimeout(() => {
                        this.finishRoll(diceCount);
                        this.isAnimating = false;
                        resolve();
                    }, 200);
                }
            }, 200); // Každých 200ms se změní čísla
        });
    }

    /**
     * Dokončí hod kostkami
     * @param {number} diceCount - Počet kostek
     */
    finishRoll(diceCount) {
        // Využití importované funkce pro finální hod
        const dice = diceRoll(diceCount);

        // Spočítáme body z tohoto hodu
        const points = calculatePoints(dice);

        // Aktualizuje herní stav s výsledkem
        gameState.updateState({
            currentRoll: dice,
            selectedDice: [],
            isRolling: false
        });

        // Zkontrolujeme FARKLE - když hod neobsahuje žádné bodující kostky
        if (!hasScoringDice(dice)) {
            this.triggerFarkleAnimation(dice);
        } else {
            // 🎵 Pozitivní zvuk pro úspěšný hod
            if (points > 0) {
                soundSystem.play('score');
            }
            this.addSpawnAnimation();
        }
    }

    /**
     * Přidá spawn animaci ke kostkám
     */
    addSpawnAnimation() {
        setTimeout(() => {
            const diceElements = document.querySelectorAll('.dice:not(.saved)');
            diceElements.forEach(el => {
                el.classList.add('dice-new');
            });

            // Odstranění třídy po animaci
            setTimeout(() => {
                diceElements.forEach(el => el.classList.remove('dice-new'));
            }, 800);
        }, 50);
    }

    /**
     * Spustí FARKLE animaci
     * @param {Array} dice - Kostky
     */
    triggerFarkleAnimation(dice) {
        // Přidáme farkle animaci ke kostkám
        setTimeout(() => {
            const diceElements = document.querySelectorAll('.dice:not(.saved)');
            diceElements.forEach(el => el.classList.add('dice-farkle'));

            setTimeout(() => {
                diceElements.forEach(el => el.classList.remove('dice-farkle'));
            }, 2000);
        }, 200);

        return dice; // Vrátíme pro další zpracování
    }

    /**
     * Přidá skórovací animaci
     */
    addScoringAnimation() {
        setTimeout(() => {
            const selectedElements = document.querySelectorAll('.dice.dice-selected');
            selectedElements.forEach(el => {
                el.classList.add('dice-scoring');
            });

            setTimeout(() => {
                selectedElements.forEach(el => el.classList.remove('dice-scoring'));
            }, 1000);
        }, 100);
    }

    /**
     * Kontrola, zda animace běží
     */
    isAnimationRunning() {
        return this.isAnimating;
    }
}
