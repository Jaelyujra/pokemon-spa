/**
 * Main App Entry Point
 * Router y gestión de estado global
 */

import { router } from './router.js';
import { setupThemeToggle, setupMobileMenu } from './utils/ui.js';
import { initializeApp } from './utils/storage.js';

// Inicializar app
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar localStorage
    initializeApp();
    
    // Setup de UI
    setupThemeToggle();
    setupMobileMenu();
    
    // Iniciar router
    router.init();
    
    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => {
        router.navigate();
    });
    
    console.log('✅ Pokémon SPA Game initialized!');
});
