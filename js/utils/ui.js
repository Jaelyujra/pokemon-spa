/**
 * UI Utilities
 * Funciones auxiliares para la interfaz
 */

import { getTheme, setTheme } from './storage.js';

/**
 * Mapa de colores para tipos de Pokémon
 */
export const TYPE_COLORS = {
    normal: { bg: 'bg-gray-400', text: 'text-gray-900' },
    fire: { bg: 'bg-red-500', text: 'text-white' },
    water: { bg: 'bg-blue-500', text: 'text-white' },
    grass: { bg: 'bg-green-500', text: 'text-white' },
    electric: { bg: 'bg-yellow-400', text: 'text-gray-900' },
    ice: { bg: 'bg-cyan-400', text: 'text-gray-900' },
    fighting: { bg: 'bg-red-700', text: 'text-white' },
    poison: { bg: 'bg-purple-500', text: 'text-white' },
    ground: { bg: 'bg-amber-600', text: 'text-white' },
    flying: { bg: 'bg-blue-300', text: 'text-gray-900' },
    psychic: { bg: 'bg-pink-500', text: 'text-white' },
    bug: { bg: 'bg-lime-500', text: 'text-gray-900' },
    rock: { bg: 'bg-stone-500', text: 'text-white' },
    ghost: { bg: 'bg-indigo-600', text: 'text-white' },
    dragon: { bg: 'bg-violet-600', text: 'text-white' },
    dark: { bg: 'bg-gray-800', text: 'text-white' },
    steel: { bg: 'bg-slate-500', text: 'text-white' },
    fairy: { bg: 'bg-pink-300', text: 'text-gray-900' },
};

/**
 * Setup del toggle de tema (dark/light mode)
 */
export function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Establecer tema inicial desde localStorage
    const theme = getTheme();
    if (theme === 'dark') {
        html.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        html.classList.remove('dark');
        themeIcon.classList.add('fa-moon');
        themeIcon.classList.remove('fa-sun');
    }

    // Escuchar clicks en el toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        
        if (newTheme === 'dark') {
            html.classList.add('dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            html.classList.remove('dark');
            themeIcon.classList.add('fa-moon');
            themeIcon.classList.remove('fa-sun');
        }
    });
}

/**
 * Setup del menú móvil
 */
export function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    if (!menuToggle) return;

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Cerrar menú al hacer click en un link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

/**
 * Obtiene el color de un tipo de Pokémon
 */
export function getTypeColor(typeName) {
    return TYPE_COLORS[typeName.toLowerCase()] || TYPE_COLORS.normal;
}

/**
 * Crea un badge de tipo
 */
export function createTypeBadge(typeName) {
    const color = getTypeColor(typeName);
    return `
        <span class="type-badge ${color.bg} ${color.text}">
            ${typeName}
        </span>
    `;
}

/**
 * Formatea un número con ceros a la izquierda
 */
export function padNumber(num, length = 3) {
    return String(num).padStart(length, '0');
}

/**
 * Obtiene el nombre del stat en español
 */
export function getStatName(statName) {
    const statNames = {
        hp: 'HP',
        attack: 'Ataque',
        defense: 'Defensa',
        'special-attack': 'Ataque Esp.',
        'special-defense': 'Defensa Esp.',
        speed: 'Velocidad'
    };
    return statNames[statName] || statName;
}

/**
 * Abre un modal
 */
export function openModal(content) {
    const modalsContainer = document.getElementById('modals-container');
    const modal = document.createElement('div');
    modal.innerHTML = content;
    modal.className = 'modal-overlay';
    modalsContainer.appendChild(modal);
    
    return {
        close: () => modal.remove(),
        element: modal
    };
}

/**
 * Emite sonido simple (8-bit style)
 */
export function playSound(frequency = 440, duration = 100, type = 'sine') {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
        console.log('Audio no disponible:', error);
    }
}

/**
 * Reproduce sonido de ataque
 */
export function playAttackSound() {
    playSound(440, 100);
    setTimeout(() => playSound(550, 100), 150);
}

/**
 * Reproduce sonido de daño
 */
export function playDamageSound() {
    playSound(200, 150, 'sawtooth');
}

/**
 * Reproduce sonido de victoria
 */
export function playVictorySound() {
    playSound(523, 150); // C5
    setTimeout(() => playSound(659, 150), 200); // E5
    setTimeout(() => playSound(784, 300), 400); // G5
}

/**
 * Reproduce sonido de derrota
 */
export function playDefeatSound() {
    playSound(349, 150); // F4
    setTimeout(() => playSound(294, 150), 200); // D4
    setTimeout(() => playSound(262, 300), 400); // C4
}
