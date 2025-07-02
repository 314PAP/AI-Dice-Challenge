/**
 * Game Utilities - Optimized helper functions with custom implementations
 * Utility funkce pro optimalizaci herního kódu
 */

// =============================================================================
// 🔧 CUSTOM UTILITY FUNCTIONS
// =============================================================================

/**
 * Custom debounce implementation
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Custom throttle implementation
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone function
 */
function cloneDeep(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => cloneDeep(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = cloneDeep(obj[key]);
        });
        return cloned;
    }
}

/**
 * Check if value is empty
 */
function isEmpty(value) {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Deep equality check
 */
function isEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => isEqual(item, b[index]));
    }
    
    if (typeof a === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(key => isEqual(a[key], b[key]));
    }
    
    return false;
}

// =============================================================================
// 🔧 DEBOUNCED & THROTTLED FUNCTIONS
// =============================================================================

/**
 * Debounced UI update to prevent excessive re-renders
 */
export const debouncedUpdateUI = debounce((updateFunction) => {
    if (typeof updateFunction === 'function') {
        updateFunction();
    }
}, 50);

/**
 * Throttled dice animation to ensure smooth performance
 */
export const throttledDiceAnimation = throttle((animationFunction) => {
    if (typeof animationFunction === 'function') {
        animationFunction();
    }
}, 100);

/**
 * Debounced chat message to prevent spam
 */
export const debouncedChatMessage = debounce((sender, message) => {
    if (window.addChatMessage) {
        window.addChatMessage(sender, message);
    }
}, 200);

// =============================================================================
// 🎯 GAME STATE UTILITIES
// =============================================================================

/**
 * Deep clone game state safely
 */
export function cloneGameState(gameState) {
    return cloneDeep(gameState);
}

/**
 * Check if two game states are equal
 */
export function areGameStatesEqual(state1, state2) {
    return isEqual(state1, state2);
}

/**
 * Validate if game state is empty/invalid
 */
export function isGameStateEmpty(gameState) {
    return isEmpty(gameState) || !gameState.players || gameState.players.length === 0;
}

// =============================================================================
// 🎲 DICE UTILITIES
// =============================================================================

/**
 * Optimized dice clearing for Hot Dice
 */
export function clearDiceState(gameState) {
    gameState.diceValues = [];
    gameState.selectedDice = [];
    gameState.bankedDiceThisTurn = [];
    gameState.mustBankDice = false;
    
    // Clear dice container immediately for visual feedback
    clearDiceContainer();
    
    // Trigger debounced UI update
    debouncedUpdateUI(() => {
        if (typeof window !== 'undefined' && window.updateGameDisplay) {
            window.updateGameDisplay();
        }
    });
}

/**
 * Safe dice container clearing
 */
export function clearDiceContainer() {
    const diceContainer = document.getElementById('diceContainer');
    if (diceContainer) {
        // Smooth fade out before clearing
        diceContainer.style.opacity = '0';
        setTimeout(() => {
            diceContainer.innerHTML = '';
            diceContainer.style.opacity = '1';
        }, 150);
    }
}

// =============================================================================
// 🎮 MODAL UTILITIES
// =============================================================================

/**
 * Safe modal show/hide with animation
 */
export function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    if (!modal) return false;
    
    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        // Focus first input if available
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 100);
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('visible');
    }
    
    return true;
}

/**
 * Safe modal transition between two modals
 */
export function transitionModals(fromModalId, toModalId, delay = 300) {
    toggleModal(fromModalId, false);
    setTimeout(() => {
        toggleModal(toModalId, true);
    }, delay);
}

// =============================================================================
// 🔊 AUDIO UTILITIES
// =============================================================================

/**
 * Throttled sound effects to prevent audio overlap
 */
export const throttledSound = throttle((soundType) => {
    // Placeholder for future sound implementation
    console.log(`🔊 Sound: ${soundType}`);
}, 200);

// =============================================================================
// 📱 RESPONSIVE UTILITIES
// =============================================================================

/**
 * Check if device is mobile
 */
export function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Debounced resize handler
 */
export const debouncedResize = debounce(() => {
    // Trigger responsive updates
    const event = new CustomEvent('gameResize', { detail: { mobile: isMobile() } });
    document.dispatchEvent(event);
}, 250);

// Initialize resize listener
if (typeof window !== 'undefined') {
    window.addEventListener('resize', debouncedResize);
}

// =============================================================================
// 🎯 ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Safe function execution with error handling
 */
export function safeExecute(fn, fallback = null, context = 'Unknown') {
    try {
        if (typeof fn === 'function') {
            return fn();
        }
    } catch (error) {
        console.error(`❌ Error in ${context}:`, error);
        if (typeof fallback === 'function') {
            return fallback();
        }
    }
    return null;
}

/**
 * Safe DOM element access
 */
export function safeGetElement(id, required = false) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.warn(`⚠️ Required element not found: ${id}`);
    }
    return element;
}

// =============================================================================
// 🔄 PERFORMANCE UTILITIES
// =============================================================================

/**
 * Request animation frame wrapper
 */
export function nextFrame(callback) {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            if (typeof callback === 'function') {
                callback();
            }
            resolve();
        });
    });
}

/**
 * Wait for DOM element to be available
 */
export function waitForElement(id, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        
        function check() {
            const element = document.getElementById(id);
            if (element) {
                resolve(element);
            } else if (Date.now() - start >= timeout) {
                reject(new Error(`Element ${id} not found within ${timeout}ms`));
            } else {
                setTimeout(check, 50);
            }
        }
        
        check();
    });
}

// =============================================================================
// 📊 EXPORT ALL UTILITIES
// =============================================================================

export default {
    // Debounced/Throttled
    debouncedUpdateUI,
    throttledDiceAnimation,
    debouncedChatMessage,
    throttledSound,
    debouncedResize,
    
    // Game State
    cloneGameState,
    areGameStatesEqual,
    isGameStateEmpty,
    
    // Dice
    clearDiceState,
    clearDiceContainer,
    
    // Modals
    toggleModal,
    transitionModals,
    
    // Responsive
    isMobile,
    
    // Error Handling
    safeExecute,
    safeGetElement,
    
    // Performance
    nextFrame,
    waitForElement
};
