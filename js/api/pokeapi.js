/**
 * PokeAPI Service
 * Maneja todas las llamadas a la API de Pokémon
 */

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE = new Map();

/**
 * Obtiene lista de Pokémon con paginación
 */
export async function getPokemonList(offset = 0, limit = 20) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
        if (!response.ok) throw new Error('Error fetching pokemon list');
        return await response.json();
    } catch (error) {
        console.error('getPokemonList error:', error);
        throw error;
    }
}

/**
 * Obtiene detalles de un Pokémon específico
 */
export async function getPokemonDetail(idOrName) {
    // Verificar cache
    if (CACHE.has(`pokemon-${idOrName}`)) {
        return CACHE.get(`pokemon-${idOrName}`);
    }

    try {
        const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
        if (!response.ok) throw new Error('Error fetching pokemon detail');
        const data = await response.json();
        
        // Cachear resultado
        CACHE.set(`pokemon-${idOrName}`, data);
        return data;
    } catch (error) {
        console.error('getPokemonDetail error:', error);
        throw error;
    }
}

/**
 * Obtiene lista de tipos de Pokémon
 */
export async function getTypesList() {
    if (CACHE.has('types-list')) {
        return CACHE.get('types-list');
    }

    try {
        const response = await fetch(`${BASE_URL}/type`);
        if (!response.ok) throw new Error('Error fetching types');
        const data = await response.json();
        CACHE.set('types-list', data.results);
        return data.results;
    } catch (error) {
        console.error('getTypesList error:', error);
        throw error;
    }
}

/**
 * Obtiene detalles de un tipo específico (incluyendo debilidades)
 */
export async function getTypeDetail(typeName) {
    if (CACHE.has(`type-${typeName}`)) {
        return CACHE.get(`type-${typeName}`);
    }

    try {
        const response = await fetch(`${BASE_URL}/type/${typeName}`);
        if (!response.ok) throw new Error('Error fetching type detail');
        const data = await response.json();
        CACHE.set(`type-${typeName}`, data);
        return data;
    } catch (error) {
        console.error('getTypeDetail error:', error);
        throw error;
    }
}

/**
 * Obtiene las debilidades de un Pokémon basado en sus tipos
 */
export async function getPokemonWeaknesses(pokemonTypes) {
    try {
        const weaknessesMap = new Map();

        // Para cada tipo del Pokémon, obtener qué tipos son super-efectivos contra él
        for (const type of pokemonTypes) {
            const typeDetail = await getTypeDetail(type);
            
            // damage_relations.damage_from contiene los tipos que son super-efectivos
            if (typeDetail.damage_relations && typeDetail.damage_relations.damage_from) {
                typeDetail.damage_relations.damage_from.forEach(damageType => {
                    const typeName = damageType.name;
                    weaknessesMap.set(typeName, (weaknessesMap.get(typeName) || 0) + 1);
                });
            }
        }

        // Retornar los tipos ordenados por número de debilidades
        return Array.from(weaknessesMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([type]) => type);
    } catch (error) {
        console.error('getPokemonWeaknesses error:', error);
        return [];
    }
}

/**
 * Obtiene las resistencias de un Pokémon basado en sus tipos
 */
export async function getPokemonResistances(pokemonTypes) {
    try {
        const resistancesMap = new Map();

        for (const type of pokemonTypes) {
            const typeDetail = await getTypeDetail(type);
            
            if (typeDetail.damage_relations && typeDetail.damage_relations.damage_to) {
                typeDetail.damage_relations.damage_to.forEach(resistType => {
                    const typeName = resistType.name;
                    resistancesMap.set(typeName, (resistancesMap.get(typeName) || 0) + 1);
                });
            }
        }

        return Array.from(resistancesMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([type]) => type);
    } catch (error) {
        console.error('getPokemonResistances error:', error);
        return [];
    }
}

/**
 * Obtiene Pokémon aleatorio
 */
export async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    return getPokemonDetail(randomId);
}

/**
 * Busca Pokémon por nombre o ID
 */
export async function searchPokemon(query) {
    try {
        // Si es un número, buscamos por ID
        if (!isNaN(query)) {
            return await getPokemonDetail(query);
        }
        // Si es texto, buscamos por nombre
        return await getPokemonDetail(query.toLowerCase());
    } catch (error) {
        console.error('searchPokemon error:', error);
        throw error;
    }
}

/**
 * Obtiene la cadena evolutiva de un Pokémon
 */
export async function getEvolutionChain(speciesUrl) {
    try {
        const response = await fetch(speciesUrl);
        if (!response.ok) throw new Error('Error fetching species');
        const speciesData = await response.json();

        if (!speciesData.evolution_chain) {
            return [];
        }

        const chainResponse = await fetch(speciesData.evolution_chain.url);
        if (!chainResponse.ok) throw new Error('Error fetching evolution chain');
        const chainData = await chainResponse.json();

        return parseEvolutionChain(chainData.chain);
    } catch (error) {
        console.error('getEvolutionChain error:', error);
        return [];
    }
}

/**
 * Parsea la cadena evolutiva recursivamente
 */
function parseEvolutionChain(chain, evolution = []) {
    if (!chain) return evolution;

    evolution.push(chain.species.name);

    if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach(nextChain => {
            parseEvolutionChain(nextChain, evolution);
        });
    }

    return evolution;
}

/**
 * Limpia el cache (útil para testing)
 */
export function clearCache() {
    CACHE.clear();
}
