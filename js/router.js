/**
 * Router SPA con Hash Routing
 * Maneja la navegación entre vistas
 */

import { HomePage } from './pages/HomePage.js';
import { PokemonDetailPage } from './pages/PokemonDetailPage.js';
import { PokedexPage } from './pages/PokedexPage.js';
import { BattlePage } from './pages/BattlePage.js';

export const router = {
    routes: {
        '/': HomePage,
        '/pokemon/:id': PokemonDetailPage,
        '/pokedex': PokedexPage,
        '/battle': BattlePage,
    },

    /**
     * Inicializa el router
     */
    init() {
        this.navigate();
    },

    /**
     * Navega a una ruta basada en el hash actual
     */
    navigate() {
        const hash = window.location.hash.slice(1) || '/';
        const [pathname, ...rest] = hash.split('/').filter(Boolean);
        const path = pathname ? `/${pathname}` : '/';
        
        const params = this.extractParams(path, hash);
        this.renderPage(path, params);
    },

    /**
     * Extrae parámetros de la ruta
     */
    extractParams(path, fullHash) {
        const params = {};
        
        if (path === '/pokemon/:id') {
            const parts = fullHash.split('/').filter(Boolean);
            params.id = parts[1];
        }
        
        return params;
    },

    /**
     * Renderiza la página correspondiente
     */
    async renderPage(path, params) {
        const app = document.getElementById('app');
        const PageComponent = this.routes[path] || this.routes['/'];
        
        try {
            // Mostrar loading
            app.innerHTML = `
                <div class="flex justify-center items-center h-96">
                    <div class="spinner"></div>
                </div>
            `;
            
            // Renderizar página
            const content = await PageComponent.render(params);
            app.innerHTML = content;
            
            // Montar eventos después de renderizar
            if (PageComponent.mount) {
                await PageComponent.mount(params);
            }
            
            // Scroll al top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error rendering page:', error);
            app.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-600 dark:text-red-400">Error cargando la página</p>
                    <a href="#/" class="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">Volver al inicio</a>
                </div>
            `;
        }
    },

    /**
     * Navega a una ruta
     */
    go(path) {
        window.location.hash = path;
    }
};