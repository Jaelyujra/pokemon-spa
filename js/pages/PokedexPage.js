/**
 * PokedexPage Component
 * Vista de Pokédex personal (Pokémon capturados)
 */

import { getCaughtPokemon, releasePokemon } from '../utils/storage.js';
import { createTypeBadge, padNumber } from '../utils/ui.js';
import { router } from '../router.js';

let caughtList = [];

export const PokedexPage = {
    render(params) {
        caughtList = getCaughtPokemon();

        if (caughtList.length === 0) {
            return `
                <div class="text-center py-12 fade-in-up">
                    <i class="fas fa-book-open text-6xl text-gray-400 dark:text-gray-600 mb-4 block"></i>
                    <h1 class="gaming-title text-3xl mb-2">Pokédex Vacía</h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">¡Aún no has capturado ningún Pokémon!</p>
                    <a href="#/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
                        <i class="fas fa-search"></i> Ir a buscar Pokémon
                    </a>
                </div>
            `;
        }

        return `
            <div class="space-y-6 fade-in-up">
                <!-- Encabezado -->
                <div class="text-center">
                    <h1 class="gaming-title text-4xl md:text-5xl mb-2">Mi Pokédex</h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        <i class="fas fa-check-circle text-green-500"></i> 
                        Has capturado <strong>${caughtList.length}</strong> Pokémon
                    </p>
                </div>

                <!-- Stats de captura -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-3xl font-bold">${caughtList.length}</div>
                            <div class="text-sm opacity-90">Capturados</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold">${caughtList.length * 10}</div>
                            <div class="text-sm opacity-90">Puntos</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold">${Math.round((caughtList.length / 1025) * 100)}%</div>
                            <div class="text-sm opacity-90">Completado</div>
                        </div>
                    </div>
                </div>

                <!-- Grid de Pokémon capturados -->
                <div id="pokedex-grid" class="pokemon-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${caughtList.map(pokemon => createCaughtPokemonCard(pokemon)).join('')}
                </div>

                <!-- Botón para capturar más -->
                <div class="flex justify-center">
                    <a href="#/" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
                        <i class="fas fa-arrow-up"></i> Capturar más Pokémon
                    </a>
                </div>
            </div>
        `;
    },

    mount(params) {
        const grid = document.getElementById('pokedex-grid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.pokemon-card');

        cards.forEach(card => {
            // Click en tarjeta para ver detalles
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.release-btn')) {
                    const pokemonId = card.dataset.pokemonId;
                    router.go(`#/pokemon/${pokemonId}`);
                }
            });

            // Botón de liberar
            const releaseBtn = card.querySelector('.release-btn');
            if (releaseBtn) {
                releaseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const pokemonId = parseInt(card.dataset.pokemonId);
                    releasePokemon(pokemonId);
                    card.classList.add('scale-95', 'opacity-50');
                    setTimeout(() => {
                        card.remove();
                        if (grid.children.length === 0) {
                            window.location.href = '#/pokedex';
                        }
                    }, 300);
                });
            }
        });
    }
};

/**
 * Crea una tarjeta de Pokémon capturado
 */
function createCaughtPokemonCard(pokemon) {
    return `
        <div class="pokemon-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer h-full flex flex-col" data-pokemon-id="${pokemon.id}">
            <div class="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 p-4 text-center flex-1">
                <img src="${pokemon.image}" alt="${pokemon.name}" class="w-full h-40 object-contain pokemon-sprite" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
            </div>
            <div class="p-4 space-y-3 flex-1 flex flex-col">
                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-semibold">#${padNumber(pokemon.id)}</div>
                    <h3 class="text-lg font-bold capitalize">${pokemon.name}</h3>
                </div>
                <div class="flex flex-wrap gap-1">
                    ${pokemon.types.map(t => createTypeBadge(t)).join('')}
                </div>
                <button class="release-btn w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors text-sm mt-auto">
                    <i class="fas fa-trash"></i> Liberar
                </button>
            </div>
        </div>
    `;
}
