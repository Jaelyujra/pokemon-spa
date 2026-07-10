/**
 * PokemonDetailPage Component
 * Vista detallada de un Pokémon específico
 */

import { getPokemonDetail, getEvolutionChain } from '../api/pokeapi.js';
import { createTypeBadge, getStatName, padNumber, playSound } from '../utils/ui.js';
import { isPokemonCaught, catchPokemon, releasePokemon } from '../utils/storage.js';
import { formatHeight, formatWeight, calculatePercentage } from '../utils/helpers.js';
import { router } from '../router.js';

export const PokemonDetailPage = {
    async render(params) {
        const pokemonId = params.id;
        if (!pokemonId) {
            router.go('#/');
            return;
        }

        try {
            const pokemon = await getPokemonDetail(pokemonId);
            const isCaught = isPokemonCaught(pokemon.id);
            const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

            return `
                <div class="fade-in-up space-y-6">
                    <!-- Breadcrumb -->
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        <a href="#/" class="hover:text-blue-600">Inicio</a> / 
                        <span class="capitalize">${pokemon.name}</span>
                    </div>

                    <!-- Header con imagen y info básica -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Imagen y controles -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                            <div class="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-8 mb-4">
                                <img src="${image}" alt="${pokemon.name}" class="w-full max-w-md mx-auto pokemon-sprite">
                            </div>
                            <h1 class="gaming-title text-3xl capitalize mb-2">${pokemon.name}</h1>
                            <div class="text-2xl font-bold text-gray-500 mb-4">#${padNumber(pokemon.id)}</div>
                            <div class="flex flex-wrap justify-center gap-2 mb-6">
                                ${pokemon.types.map(t => createTypeBadge(t.type.name)).join('')}
                            </div>
                            <button id="catch-btn" class="w-full py-3 px-4 rounded-lg text-white font-bold transition-all ${
                                isCaught 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }">
                                ${isCaught 
                                    ? '<i class="fas fa-trash"></i> Liberar Pokémon' 
                                    : '<i class="fas fa-plus-circle"></i> ¡Capturar Pokémon!'}
                            </button>
                        </div>

                        <!-- Info básica -->
                        <div class="space-y-4">
                            <!-- Medidas -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 class="text-xl font-bold mb-4">Medidas</h2>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="text-center">
                                        <div class="text-gray-600 dark:text-gray-400 text-sm">Altura</div>
                                        <div class="text-xl font-bold">${formatHeight(pokemon.height)}</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-gray-600 dark:text-gray-400 text-sm">Peso</div>
                                        <div class="text-xl font-bold">${formatWeight(pokemon.weight)}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Habilidades -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 class="text-xl font-bold mb-4">Habilidades</h2>
                                <div class="space-y-2">
                                    ${pokemon.abilities.map(ability => `
                                        <div class="flex items-center justify-between">
                                            <span class="capitalize">${ability.ability.name.replace('-', ' ')}</span>
                                            ${ability.is_hidden ? '<span class="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200 px-2 py-1 rounded">Oculta</span>' : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-bold mb-6">Estadísticas Base</h2>
                        <div class="space-y-4">
                            ${pokemon.stats.map(stat => {
                                const maxStat = 150;
                                const percentage = calculatePercentage(stat.base_stat, maxStat);
                                return `
                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="font-semibold">${getStatName(stat.stat.name)}</span>
                                            <span class="font-bold text-blue-600 dark:text-blue-400">${stat.base_stat}</span>
                                        </div>
                                        <div class="stat-bar">
                                            <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Información adicional -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Exp y otros -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 class="text-xl font-bold mb-4">Información</h2>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">EXP Base:</span>
                                    <span class="font-bold">${pokemon.base_experience}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Movimientos:</span>
                                    <span class="font-bold">${pokemon.moves.length}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Formas -->
                        ${pokemon.forms && pokemon.forms.length > 1 ? `
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 class="text-xl font-bold mb-4">Formas</h2>
                                <div class="space-y-1">
                                    ${pokemon.forms.map(form => `
                                        <div class="text-sm capitalize">${form.name}</div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Movimientos -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-bold mb-4">Primeros Movimientos</h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            ${pokemon.moves.slice(0, 12).map(move => `
                                <div class="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 text-center text-sm capitalize">
                                    ${move.move.name.replace('-', ' ')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading pokemon detail:', error);
            return `
                <div class="text-center py-12">
                    <p class="text-red-600 dark:text-red-400 mb-4">Error cargando el Pokémon</p>
                    <a href="#/" class="text-blue-600 dark:text-blue-400 hover:underline">Volver al inicio</a>
                </div>
            `;
        }
    },

    async mount(params) {
        const catchBtn = document.getElementById('catch-btn');
        const pokemonId = params.id;

        catchBtn.addEventListener('click', async () => {
            const pokemon = await getPokemonDetail(pokemonId);
            const isCaught = isPokemonCaught(pokemon.id);

            if (isCaught) {
                releasePokemon(pokemon.id);
                catchBtn.innerHTML = '<i class="fas fa-plus-circle"></i> ¡Capturar Pokémon!';
                catchBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                catchBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            } else {
                catchPokemon(pokemon);
                catchBtn.innerHTML = '<i class="fas fa-trash"></i> Liberar Pokémon';
                catchBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                catchBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            }

            playSound(440, 100);
        });
    }
};