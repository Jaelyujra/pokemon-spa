/**
 * BattlePage Component
 * Vista de batalla tipo RPG
 */

import { getPokemonDetail, getRandomPokemon } from '../api/pokeapi.js';
import { getCaughtPokemon } from '../utils/storage.js';
import { createTypeBadge, getStatName, padNumber, playAttackSound, playDamageSound, playVictorySound, playDefeatSound } from '../utils/ui.js';
import { randomInt, wait } from '../utils/helpers.js';
import { router } from '../router.js';

let playerPokemon = null;
let rivalPokemon = null;
let playerHP = 0;
let rivalHP = 0;
let battleLog = [];
let isBattleActive = false;

export const BattlePage = {
    async render(params) {
        const caughtPokemon = getCaughtPokemon();

        if (caughtPokemon.length === 0) {
            return `
                <div class="text-center py-12 fade-in-up">
                    <i class="fas fa-exclamation-circle text-6xl text-yellow-500 mb-4 block"></i>
                    <h1 class="gaming-title text-3xl mb-2">¡Sin Pokémon!</h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Necesitas capturar al menos un Pokémon para batallar</p>
                    <a href="#/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
                        <i class="fas fa-search"></i> Ir a capturar Pokémon
                    </a>
                </div>
            `;
        }

        return `
            <div class="space-y-6 fade-in-up">
                <!-- Encabezado -->
                <div class="text-center">
                    <h1 class="gaming-title text-4xl md:text-5xl mb-2">
                        <i class="fas fa-sword text-red-600"></i> Batalla Pokémon
                    </h1>
                </div>

                <!-- Panel de selección -->
                <div id="selection-panel" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold mb-4">Elige tu Pokémon</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        ${caughtPokemon.map(pokemon => `
                            <button 
                                class="pokemon-selector p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all text-sm" 
                                data-pokemon-id="${pokemon.id}"
                                data-pokemon-name="${pokemon.name}"
                            >
                                <img src="${pokemon.image}" alt="${pokemon.name}" class="w-12 h-12 object-contain mx-auto mb-1">
                                <div class="capitalize font-semibold">${pokemon.name}</div>
                                <div class="text-xs text-gray-500">#${padNumber(pokemon.id)}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Arena de batalla -->
                <div id="battle-arena" class="hidden bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-lg overflow-hidden">
                    <!-- Área del rival -->
                    <div class="bg-white dark:bg-gray-800 p-4 md:p-8">
                        <div class="flex justify-end mb-4">
                            <div class="w-full md:w-96">
                                <div class="text-right mb-2">
                                    <h3 id="rival-name" class="text-lg font-bold capitalize">Rival</h3>
                                    <div id="rival-hp-text" class="text-sm text-gray-600 dark:text-gray-400">HP: 100/100</div>
                                </div>
                                <div class="stat-bar">
                                    <div id="rival-hp-bar" class="stat-bar-fill" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <div id="rival-sprite-container" class="text-right">
                                <img id="rival-sprite" src="" alt="Rival" class="h-48 md:h-64 object-contain pokemon-sprite">
                            </div>
                        </div>
                    </div>

                    <!-- Centro de batalla -->
                    <div class="bg-blue-300 dark:bg-blue-700 py-8 px-4 flex justify-center">
                        <div id="battle-log" class="battle-log bg-white dark:bg-gray-900 rounded p-4 max-w-2xl w-full h-40 text-sm">
                            <div class="battle-message text-gray-600 dark:text-gray-400">¡Comienza la batalla!</div>
                        </div>
                    </div>

                    <!-- Área del jugador -->
                    <div class="bg-white dark:bg-gray-800 p-4 md:p-8">
                        <div class="flex gap-4 mb-4">
                            <div class="flex-1">
                                <h3 id="player-name" class="text-lg font-bold capitalize mb-1">Tu Pokémon</h3>
                                <div id="player-hp-text" class="text-sm text-gray-600 dark:text-gray-400">HP: 100/100</div>
                                <div class="stat-bar">
                                    <div id="player-hp-bar" class="stat-bar-fill" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex">
                            <div id="player-sprite-container">
                                <img id="player-sprite" src="" alt="Player" class="h-48 md:h-64 object-contain pokemon-sprite">
                            </div>
                        </div>
                    </div>

                    <!-- Controles de batalla -->
                    <div class="bg-white dark:bg-gray-800 p-4 md:p-8 border-t border-gray-200 dark:border-gray-700">
                        <div class="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                            <button id="attack-btn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold transition-all">
                                <i class="fas fa-fist-raised"></i> Atacar
                            </button>
                            <button id="special-btn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-bold transition-all">
                                <i class="fas fa-bolt"></i> Especial
                            </button>
                            <button id="defend-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition-all">
                                <i class="fas fa-shield-alt"></i> Defender
                            </button>
                            <button id="flee-btn" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold transition-all">
                                <i class="fas fa-running"></i> Huir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async mount(params) {
        const selectionPanel = document.getElementById('selection-panel');
        const battleArena = document.getElementById('battle-arena');
        const pokemonSelectors = document.querySelectorAll('.pokemon-selector');

        // Seleccionar Pokémon del jugador
        pokemonSelectors.forEach(btn => {
            btn.addEventListener('click', async () => {
                const pokemonId = btn.dataset.pokemonId;
                const pokemonName = btn.dataset.pokemonName;
                
                // Obtener datos completos del Pokémon
                const caughtList = getCaughtPokemon();
                const caughtPokemon = caughtList.find(p => p.id === parseInt(pokemonId));
                
                if (caughtPokemon) {
                    playerPokemon = await getPokemonDetail(pokemonId);
                    
                    // Cargar rival
                    rivalPokemon = await getRandomPokemon();
                    
                    // Inicializar HP
                    playerHP = playerPokemon.stats.find(s => s.stat.name === 'hp').base_stat;
                    rivalHP = rivalPokemon.stats.find(s => s.stat.name === 'hp').base_stat;
                    
                    // Iniciar batalla
                    startBattle();
                    
                    selectionPanel.classList.add('hidden');
                    battleArena.classList.remove('hidden');
                }
            });
        });
    }
};

/**
 * Inicia la batalla
 */
async function startBattle() {
    isBattleActive = true;
    battleLog = [];
    
    // Renderizar Pokémon
    document.getElementById('player-name').textContent = playerPokemon.name;
    document.getElementById('player-sprite').src = playerPokemon.sprites.other?.['official-artwork']?.front_default || playerPokemon.sprites.back_default || 'https://via.placeholder.com/200';
    
    document.getElementById('rival-name').textContent = rivalPokemon.name;
    document.getElementById('rival-sprite').src = rivalPokemon.sprites.other?.['official-artwork']?.front_default || rivalPokemon.sprites.front_default || 'https://via.placeholder.com/200';
    
    // Actualizar barras de HP
    updateHPBars();
    
    // Setup de controles
    setupBattleControls();
    
    addBattleLog(`¡${playerPokemon.name} y ${rivalPokemon.name} se enfrentan!`);
    await wait(1000);
    addBattleLog(`¡Comienza la batalla!`);
}

/**
 * Actualiza las barras de HP
 */
function updateHPBars() {
    const playerMaxHP = playerPokemon.stats.find(s => s.stat.name === 'hp').base_stat;
    const rivalMaxHP = rivalPokemon.stats.find(s => s.stat.name === 'hp').base_stat;
    
    const playerPercentage = Math.max(0, (playerHP / playerMaxHP) * 100);
    const rivalPercentage = Math.max(0, (rivalHP / rivalMaxHP) * 100);
    
    document.getElementById('player-hp-bar').style.width = playerPercentage + '%';
    document.getElementById('player-hp-text').textContent = `HP: ${Math.max(0, playerHP)}/${playerMaxHP}`;
    
    document.getElementById('rival-hp-bar').style.width = rivalPercentage + '%';
    document.getElementById('rival-hp-text').textContent = `HP: ${Math.max(0, rivalHP)}/${rivalMaxHP}`;
}

/**
 * Añade un mensaje al log de batalla
 */
function addBattleLog(message) {
    battleLog.push(message);
    const battleLogElement = document.getElementById('battle-log');
    battleLogElement.innerHTML = battleLog.map(msg => `<div class="battle-message">${msg}</div>`).join('');
    battleLogElement.scrollTop = battleLogElement.scrollHeight;
}

/**
 * Setup de controles de batalla
 */
function setupBattleControls() {
    const attackBtn = document.getElementById('attack-btn');
    const specialBtn = document.getElementById('special-btn');
    const defendBtn = document.getElementById('defend-btn');
    const fleeBtn = document.getElementById('flee-btn');

    const disableButtons = () => {
        attackBtn.disabled = true;
        specialBtn.disabled = true;
        defendBtn.disabled = true;
        fleeBtn.disabled = true;
    };

    const enableButtons = () => {
        attackBtn.disabled = false;
        specialBtn.disabled = false;
        defendBtn.disabled = false;
        fleeBtn.disabled = false;
    };

    attackBtn.addEventListener('click', async () => {
        disableButtons();
        await performAction('attack');
        enableButtons();
    });

    specialBtn.addEventListener('click', async () => {
        disableButtons();
        await performAction('special');
        enableButtons();
    });

    defendBtn.addEventListener('click', async () => {
        disableButtons();
        await performAction('defend');
        enableButtons();
    });

    fleeBtn.addEventListener('click', () => {
        if (randomInt(1, 100) > 50) {
            endBattle('flee');
        } else {
            addBattleLog(`¡${playerPokemon.name} no pudo escapar!`);
        }
    });
}

/**
 * Realiza una acción en batalla
 */
async function performAction(action) {
    if (!isBattleActive) return;

    const playerAttack = playerPokemon.stats.find(s => s.stat.name === 'attack').base_stat;
    const rivalDefense = rivalPokemon.stats.find(s => s.stat.name === 'defense').base_stat;

    let damage = 0;

    if (action === 'attack') {
        addBattleLog(`¡${playerPokemon.name} usó Ataque!`);
        damage = Math.max(1, randomInt(10, 30) + (playerAttack - rivalDefense) / 2);
        playAttackSound();
    } else if (action === 'special') {
        addBattleLog(`¡${playerPokemon.name} usó Ataque Especial!`);
        damage = Math.max(1, randomInt(20, 40) + (playerAttack - rivalDefense) / 2);
        playAttackSound();
    } else if (action === 'defend') {
        addBattleLog(`¡${playerPokemon.name} se defendió!`);
        damage = 0;
    }

    rivalHP -= damage;
    if (damage > 0) {
        addBattleLog(`¡${rivalPokemon.name} recibió ${Math.floor(damage)} de daño!`);
    }
    updateHPBars();

    await wait(1000);

    if (rivalHP <= 0) {
        endBattle('win');
        return;
    }

    // Turno del rival
    const rivalAttack = rivalPokemon.stats.find(s => s.stat.name === 'attack').base_stat;
    const playerDefense = playerPokemon.stats.find(s => s.stat.name === 'defense').base_stat;
    const rivalDamage = Math.max(1, randomInt(5, 20) + (rivalAttack - playerDefense) / 2);

    addBattleLog(`¡${rivalPokemon.name} atacó!`);
    playAttackSound();
    
    document.getElementById('player-sprite-container').classList.add('shake');
    setTimeout(() => {
        document.getElementById('player-sprite-container').classList.remove('shake');
    }, 300);

    playerHP -= rivalDamage;
    addBattleLog(`¡${playerPokemon.name} recibió ${Math.floor(rivalDamage)} de daño!`);
    playDamageSound();
    updateHPBars();

    await wait(1000);

    if (playerHP <= 0) {
        endBattle('lose');
    }
}

/**
 * Termina la batalla
 */
async function endBattle(result) {
    isBattleActive = false;

    if (result === 'win') {
        addBattleLog(`¡${playerPokemon.name} venció a ${rivalPokemon.name}!`);
        addBattleLog('¡Ganaste la batalla!');
        playVictorySound();
        
        await wait(2000);
        
        showBattleResultModal('¡VICTORIA!', `¡Tu ${playerPokemon.name} derrotó al ${rivalPokemon.name}!\n\n+100 puntos de experiencia`, 'victory');
    } else if (result === 'lose') {
        addBattleLog(`¡${playerPokemon.name} fue derrotado!`);
        playDefeatSound();
        
        await wait(2000);
        
        showBattleResultModal('¡DERROTA!', `¡Tu ${playerPokemon.name} fue derrotado!\n\nIntenta nuevamente...`, 'defeat');
    } else if (result === 'flee') {
        addBattleLog('¡Escapaste con éxito!');
        await wait(1000);
        router.go('#/');
    }
}

/**
 * Muestra modal de resultado
 */
function showBattleResultModal(title, message, type) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-overlay';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-md w-full mx-4 text-center">
            <div class="text-5xl mb-4">
                ${type === 'victory' ? '🎉' : '😢'}
            </div>
            <h2 class="gaming-title text-3xl mb-4 ${type === 'victory' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                ${title}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">${message}</p>
            <div class="flex gap-3">
                <button onclick="location.hash='#/battle'" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-redo"></i> Otra Batalla
                </button>
                <button onclick="location.hash='#/'" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-home"></i> Inicio
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modals-container').appendChild(modal);
}
