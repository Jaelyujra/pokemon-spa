/**
 * Storage Utilities
 * Maneja localStorage para persistencia de datos
 */

const STORAGE_KEYS = {
    CAUGHT_POKEMON: 'pokemon_caught',
    SETTINGS: 'pokemon_settings'
};

/**
 * Inicializa la aplicación con datos por defecto
 */
export function initializeApp() {
    if (!localStorage.getItem(STORAGE_KEYS.CAUGHT_POKEMON)) {
        localStorage.setItem(STORAGE_KEYS.CAUGHT_POKEMON, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
            theme: 'light',
            language: 'es'
        }));
    }
}

/**
 * Obtiene todos los Pokémon capturados
 */
export function getCaughtPokemon() {
    const data = localStorage.getItem(STORAGE_KEYS.CAUGHT_POKEMON);
    return data ? JSON.parse(data) : [];
}

/**
 * Verifica si un Pokémon está capturado
 */
export function isPokemonCaught(pokemonId) {
    const caught = getCaughtPokemon();
    return caught.some(p => p.id === parseInt(pokemonId));
}

/**
 * Captura un Pokémon (lo añade al localStorage)
 */
export function catchPokemon(pokemon) {
    const caught = getCaughtPokemon();
    
    // Evitar duplicados
    if (!caught.some(p => p.id === pokemon.id)) {
        caught.push({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name),
            capturedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.CAUGHT_POKEMON, JSON.stringify(caught));
    }
    
    return caught;
}

/**
 * Libera un Pokémon (lo elimina del localStorage)
 */
export function releasePokemon(pokemonId) {
    let caught = getCaughtPokemon();
    caught = caught.filter(p => p.id !== parseInt(pokemonId));
    localStorage.setItem(STORAGE_KEYS.CAUGHT_POKEMON, JSON.stringify(caught));
    return caught;
}

/**
 * Obtiene configuraciones
 */
export function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'light', language: 'es' };
}

/**
 * Guarda configuraciones
 */
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
}

/**
 * Obtiene tema actual
 */
export function getTheme() {
    return getSettings().theme;
}

/**
 * Establece tema
 */
export function setTheme(theme) {
    const settings = getSettings();
    settings.theme = theme;
    saveSettings(settings);
    return theme;
}

/**
 * Limpia todo el localStorage (para testing)
 */
export function clearAllStorage() {
    localStorage.clear();
    initializeApp();
}