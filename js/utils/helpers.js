/**
 * Helper Functions
 * Funciones utilitarias generales
 */

/**
 * Debounce para funciones
 */
export function debounce(func, wait) {
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
 * Throttle para funciones
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Detecta si el usuario está al final del scroll
 */
export function isAtScrollBottom(threshold = 200) {
    return (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - threshold
    );
}

/**
 * Capitaliza la primera letra de una cadena
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Genera un ID único
 */
export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Formatea una altura en metros
 */
export function formatHeight(heightDecimeters) {
    return (heightDecimeters / 10).toFixed(2) + ' m';
}

/**
 * Formatea un peso en kilogramos
 */
export function formatWeight(weightHectograms) {
    return (weightHectograms / 10).toFixed(2) + ' kg';
}

/**
 * Calcula el porcentaje
 */
export function calculatePercentage(value, max) {
    return Math.min(100, Math.max(0, (value / max) * 100));
}

/**
 * Espera un tiempo determinado
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Descarga un archivo
 */
export function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Genera un número aleatorio entre min y max
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Obtiene un elemento aleatorio de un array
 */
export function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Convierte un objeto a query string
 */
export function objectToQueryString(obj) {
    return Object.keys(obj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
}

/**
 * Clona un objeto profundamente
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}