/**
 * HomePage Component
 * Vista principal con grid de Pokémon y funcionalidades de búsqueda/filtrado
 */

import { getPokemonList, getTypesList, getPokemonWeaknesses } from '../api/pokeapi.js';
import { createTypeBadge, getTypeColor, padNumber } from '../utils/ui.js';
import { isPokemonCaught, catchPokemon, releasePokemon } from '../utils/storage.js';
import { debounce, isAtScrollBottom } from '../utils/helpers.js';
import { router } from '../router.js';

let currentOffset = 0;
let allPokemon = [];
let isLoading = false;
let selectedTypes = new Set();
let searchQuery = '';
let pokemonWeaknesses = new Map();

export const HomePage = {
    async render(params) {
        currentOffset = 0;
        allPokemon = [];
        selectedTypes.clear();
        searchQuery = '';
        pokemonWeaknesses.clear();

        return `
            <div class="space-y-6 fade-in-up">
                <!-- Encabezado -->
                <div class="text-center">
                    <h1 class="gaming-title text-4xl md:text-5xl mb-2">¡Atrapa todos los Pokémon!</h1>
                    <p class="text-gray-600 dark:text-gray-400">Explora, busca y captura Pokémon en tu Pokédex personal</p>
                </div>

                <!-- Barra de búsqueda -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <div class="flex gap-4 mb-4">
                        <input 
                            type="text" 
                            id="search-input" 
                            placeholder="Busca por nombre o ID (ej: Pikachu, 25)..." 
                            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <button id="search-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-search"></i> Buscar
                        </button>
                    </div>

                    <!-- Filtros por tipo -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold">Filtrar por Tipo:</label>
                        <div id="type-filters" class="flex flex-wrap gap-2">
                            <button class="type-filter-all px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors text-sm font-medium" data-type="all">
                                Todos
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Grid de Pokémon -->
                <div id="pokemon-grid" class="pokemon-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!-- Se carga dinámicamente -->
                </div>

                <!-- Loading indicator -->
                <div id="loading-indicator" class="flex justify-center py-8 hidden">
                    <div class="spinner"></div>
                </div>

                <!-- Botón para cargar más -->
                <div class="flex justify-center">
                    <button id="load-more-btn" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-8 py-3 rounded-lg transition-all">
                        <i class="fas fa-arrow-down"></i> Cargar más Pokémon
                    </button>
                </div>
            </div>
        `;
    },

    async mount(params) {
        // Cargar tipos
        await loadTypes();
        
        // Cargar Pokémon iniciales
        await loadMorePokemon();

        // Event listeners
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const loadMoreBtn = document.getElementById('load-more-btn');
        const typeFilters = document.querySelectorAll('.type-filter');
        const typeFilterAll = document.querySelector('.type-filter-all');

        // Búsqueda
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // Filtros por tipo
        typeFilters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                if (selectedTypes.has(type)) {
                    selectedTypes.delete(type);
                    e.currentTarget.classList.remove('bg-blue-500', 'text-white');
                    e.currentTarget.classList.add('bg-gray-200', 'dark:bg-gray-700');
                } else {
                    selectedTypes.add(type);
                    e.currentTarget.classList.add('bg-blue-500', 'text-white');
                    e.currentTarget.classList.remove('bg-gray-200', 'dark:bg-gray-700');
                }
                filterPokemon();
            });
        });

        typeFilterAll.addEventListener('click', () => {
            selectedTypes.clear();
            document.querySelectorAll('.type-filter').forEach(btn => {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700');
            });
            filterPokemon();
        });

        // Cargar más
        loadMoreBtn.addEventListener('click', loadMorePokemon);

        // Scroll infinito
        window.addEventListener('scroll', debounce(() => {
            if (isAtScrollBottom() && !isLoading) {
                loadMorePokemon();
            }
        }, 200));
    }
};

/**
 * Carga los tipos disponibles
 */
async function loadTypes() {
    try {
        const types = await getTypesList();
        const typeFiltersContainer = document.getElementById('type-filters');
        
        types.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'type-filter px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors text-sm font-medium';
            btn.dataset.type = type.name;
            btn.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            
            btn.addEventListener('click', (e) => {
                if (selectedTypes.has(type.name)) {
                    selectedTypes.delete(type.name);
                    e.currentTarget.classList.remove('bg-blue-500', 'text-white');
                    e.currentTarget.classList.add('bg-gray-200', 'dark:bg-gray-700');
                } else {
                    selectedTypes.add(type.name);
                    e.currentTarget.classList.add('bg-blue-500', 'text-white');
                    e.currentTarget.classList.remove('bg-gray-200', 'dark:bg-gray-700');
                }
                filterPokemon();
            });

            typeFiltersContainer.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading types:', error);
    }
}

/**
 * Carga más Pokémon
 */
async function loadMorePokemon() {
    if (isLoading) return;
    isLoading = true;

    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.remove('hidden');

    try {
        const data = await getPokemonList(currentOffset, 20);
        
        for (const pokemon of data.results) {
            try {
                const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                    .then(r => r.json());
                
                // Obtener debilidades para este Pokémon
                const pokemonTypes = detail.types.map(t => t.type.name);
                const weaknesses = await getPokemonWeaknesses(pokemonTypes);
                pokemonWeaknesses.set(detail.id, weaknesses);
                
                allPokemon.push(detail);
            } catch (error) {
                console.error(`Error loading ${pokemon.name}:`, error);
            }
        }

        currentOffset += 20;
        renderPokemonGrid();
    } catch (error) {
        console.error('Error loading more pokemon:', error);
    } finally {
        isLoading = false;
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * Renderiza el grid de Pokémon
 */
function renderPokemonGrid() {
    const grid = document.getElementById('pokemon-grid');
    const filtered = getFilteredPokemon();

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">No se encontraron Pokémon</div>';
        return;
    }

    grid.innerHTML = filtered.map(pokemon => createPokemonCard(pokemon)).join('');

    // Agregar event listeners a las tarjetas
    grid.querySelectorAll('.pokemon-card').forEach(card => {
        const pokemonId = parseInt(card.dataset.pokemonId);
        const pokemon = allPokemon.find(p => p.id === pokemonId);
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.catch-btn')) {
                router.go(`#/pokemon/${pokemonId}`);
            }
        });

        const catchBtn = card.querySelector('.catch-btn');
        if (catchBtn) {
            catchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (isPokemonCaught(pokemonId)) {
                    releasePokemon(pokemonId);
                    catchBtn.innerHTML = '<i class="fas fa-plus"></i> Capturar';
                    catchBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                    catchBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                } else {
                    catchPokemon(pokemon);
                    catchBtn.innerHTML = '<i class="fas fa-trash"></i> Liberar';
                    catchBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                    catchBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                }
            });
        }
    });
}

/**
 * Crea una tarjeta de Pokémon con debilidades
 */
function createPokemonCard(pokemon) {
    const isCaught = isPokemonCaught(pokemon.id);
    const image = pokemon.sprites.other?.['official-artwork']?.front_default || 
                  pokemon.sprites.front_default || 
                  'https://via.placeholder.com/200?text=No+Image';
    
    const types = pokemon.types.map(t => t.type.name);
    const weaknesses = pokemonWeaknesses.get(pokemon.id) || [];
    const topWeaknesses = weaknesses.slice(0, 3); // Mostrar las 3 principales debilidades

    return `
        <div class="pokemon-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-full flex flex-col" data-pokemon-id="${pokemon.id}">
            <!-- Imagen -->
            <div class="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 p-4 text-center flex-1">
                <img src="${image}" alt="${pokemon.name}" class="w-full h-40 object-contain pokemon-sprite" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
            </div>
            
            <!-- Información -->
            <div class="p-4 space-y-3 flex-1 flex flex-col">
                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-semibold">#${padNumber(pokemon.id)}</div>
                    <h3 class="text-lg font-bold capitalize">${pokemon.name}</h3>
                </div>
                
                <!-- Tipos -->
                <div>
                    <div class="text-xs text-gray-600 dark:text-gray-300 font-semibold mb-1">Tipo:</div>
                    <div class="flex flex-wrap gap-1">
                        ${types.map(t => createTypeBadge(t)).join('')}
                    </div>
                </div>
                
                <!-- Debilidades -->
                ${topWeaknesses.length > 0 ? `
                    <div>
                        <div class="text-xs text-gray-600 dark:text-gray-300 font-semibold mb-1">Débil a:</div>
                        <div class="flex flex-wrap gap-1">
                            ${topWeaknesses.map(weakness => {
                                const color = getTypeColor(weakness);
                                return `
                                    <span class="type-badge text-xs ${color.bg} ${color.text}">
                                        ${weakness}
                                    </span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Botón de captura -->
                <button class="catch-btn w-full py-2 px-3 rounded-lg text-white font-semibold transition-colors text-sm mt-auto ${
                    isCaught 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }">
                    ${isCaught 
                        ? '<i class="fas fa-trash"></i> Liberar' 
                        : '<i class="fas fa-plus"></i> Capturar'}
                </button>
            </div>
        </div>
    `;
}

/**
 * Filtra Pokémon por tipo
 */
function getFilteredPokemon() {
    if (selectedTypes.size === 0) {
        return allPokemon.filter(p => 
            searchQuery === '' || 
            p.name.includes(searchQuery.toLowerCase()) || 
            p.id.toString().includes(searchQuery)
        );
    }

    return allPokemon.filter(p => {
        const pokemonTypes = p.types.map(t => t.type.name);
        const hasSelectedType = Array.from(selectedTypes).some(type => pokemonTypes.includes(type));
        const matchesSearch = searchQuery === '' || p.name.includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery);
        return hasSelectedType && matchesSearch;
    });
}

/**
 * Maneja la búsqueda
 */
async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    searchQuery = searchInput.value.trim();
    filterPokemon();
}

/**
 * Filtra y renderiza Pokémon
 */
function filterPokemon() {
    renderPokemonGrid();
}
