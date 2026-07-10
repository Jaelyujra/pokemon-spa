# 🎮 Pokémon SPA Game

Una Single Page Application moderna de Pokémon construida con **JavaScript Vanilla**, **Tailwind CSS** y la **PokeAPI**. ¡Captura, colecciona y batalla Pokémon sin frameworks!

## ✨ Características

### 🌟 Principales
- ✅ **SPA con Hash Routing** - Navegación fluida entre vistas sin recargas
- ✅ **Pokédex Personal** - Captura y guarda Pokémon en localStorage
- ✅ **Sistema de Batalla** - RPG clásico de Pokémon con HP, ataques y estrategia
- ✅ **Debilidades de Tipos** - Muestra a qué tipos es débil cada Pokémon
- ✅ **Dark Mode** - Modo oscuro/claro con persistencia
- ✅ **Totalmente Responsive** - Optimizado para móvil, tablet y desktop
- ✅ **Sin Dependencias** - Solo HTML, CSS (Tailwind CDN) y JavaScript Vanilla

### 📚 Vistas Implementadas

#### 1. **Inicio / Listado** (`#/`)
- Grid de Pokémon con scroll infinito
- Búsqueda por nombre o ID
- Filtrado por tipo con colores temáticos
- **Muestra debilidades de cada Pokémon** en tarjeta
- Botón para capturar/liberar Pokémon
- Carga progresiva de 20 Pokémon por lote

#### 2. **Detalle de Pokémon** (`#/pokemon/:id`)
- Información extendida (stats, habilidades, movimientos)
- Barras de progreso animadas para estadísticas
- Medidas (altura y peso)
- Lista de primeros movimientos
- Opción capturar/liberar

#### 3. **Pokédex Personal** (`#/pokedex`)
- Pokémon capturados del usuario
- Contador de capturados vs total
- Porcentaje de completado
- Liberar Pokémon con animación

#### 4. **Modo Batalla** (`#/battle`)
- Interfaz RPG clásica (rival arriba, jugador abajo)
- Seleccionar Pokémon del inventario
- Rival generado aleatoriamente
- Acciones: Ataque, Especial, Defender, Huir
- Barras de HP animadas
- Log de batalla en tiempo real
- Efectos de sonido (8-bit)
- Modal de victoria/derrota

## 🚀 Tech Stack

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura |
| **Tailwind CSS (CDN)** | Diseño y estilos |
| **JavaScript ES6+** | Lógica y funcionalidad |
| **Módulos ES6** | Arquitectura modular |
| **PokeAPI** | Datos de Pokémon |
| **localStorage** | Persistencia de datos |
| **FontAwesome** | Iconos |
| **Web Audio API** | Sonidos 8-bit |

## 📁 Estructura de Archivos

```
pokemon-spa/
├── index.html                 # HTML principal
├── js/
│   ├─�� app.js                # Punto de entrada
│   ├── router.js             # Sistema de ruteo SPA
│   ├── api/
│   │   └── pokeapi.js        # Servicio de API con debilidades
│   ├── utils/
│   │   ├── storage.js        # Gestión localStorage
│   │   ├── ui.js             # Utilidades de UI
│   │   └── helpers.js        # Funciones auxiliares
│   └── pages/
│       ├── HomePage.js       # Vista de inicio
│       ├── PokemonDetailPage.js
│       ├── PokedexPage.js
│       └── BattlePage.js
└── README.md
```

## 🎯 Cómo Usar

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Jaelyujra/pokemon-spa.git
   cd pokemon-spa
   ```

2. **Servir localmente**
   - Usa cualquier servidor local (Live Server, Python, Node, etc.)
   - O simplemente abre `index.html` en el navegador

3. **Usar en GitHub Pages**
   ```bash
   git push origin main
   # El sitio estará disponible en: https://Jaelyujra.github.io/pokemon-spa
   ```

## 📖 Guía de Uso

### 🏠 Inicio
1. Explora la lista de Pokémon con scroll infinito
2. Busca por nombre (ej: "Pikachu") o ID (ej: "25")
3. Filtra por tipo (Fuego, Agua, Eléctrico, etc.)
4. **Ve las debilidades de cada Pokémon en las tarjetas**
5. Haz clic en una tarjeta para ver detalles completos

### 🎯 Captura
1. En el detalle del Pokémon, haz clic en "¡Capturar Pokémon!"
2. El Pokémon se añade automáticamente a tu Pokédex
3. Los datos se guardan en localStorage del navegador
4. Puedes liberar Pokémon en cualquier momento

### 📚 Pokédex
1. Accede desde el menú o URL `#/pokedex`
2. Ve todos tus Pokémon capturados
3. Estadísticas: Total capturado, puntos, % completado
4. Libera Pokémon con el botón de basura

### ⚔️ Batalla
1. Captura al menos un Pokémon
2. Ve a `#/battle` o usa el menú
3. Elige tu Pokémon del inventario
4. Se generará un rival aleatorio
5. Batalla usando:
   - **Ataque**: Daño normal
   - **Especial**: Mayor daño
   - **Defender**: Reduce daño recibido
   - **Huir**: Intenta escapar (50% de éxito)
6. Gana o pierda, recibe modal de resultado

## 🎨 Diseño

### Colores por Tipo
- 🔥 **Fuego**: Rojo
- 💧 **Agua**: Azul
- 🌿 **Planta**: Verde
- ⚡ **Eléctrico**: Amarillo
- ❄️ **Hielo**: Cian
- 👊 **Lucha**: Rojo oscuro
- ☠️ **Veneno**: Púrpura
- ⛰️ **Roca**: Gris
- Y más...

### Animaciones
- ✨ Fade-in al cargar páginas
- 🎯 Hover effects en tarjetas
- 📊 Barras de HP animadas
- 💥 Shaking al recibir daño
- 🎉 Victory animation

## 🔧 Personalización

### Cambiar Límite de Pokémon
En `js/pages/HomePage.js`, modifica:
```javascript
limit = 20  // Cambia a 50 para cargar más por defecto
```

### Añadir más Tipos de Batalla
En `js/pages/BattlePage.js`, modifica la función `performAction()` para agregar nuevas habilidades.

### Personalizar Colores
En `js/utils/ui.js`, edita el objeto `TYPE_COLORS`.

## 📱 Compatibilidad

| Navegador | Soporte |
|-----------|---------|
| Chrome | ✅ Completo |
| Firefox | ✅ Completo |
| Safari | ✅ Completo |
| Edge | ✅ Completo |
| IE 11 | ❌ No soportado |

## 🎮 Controles

| Acción | Atajo |
|--------|-------|
| Buscar | Enter en input |
| Navegación | Click en links |
| Dark Mode | Click en icono luna |
| Menú móvil | Click en hamburguesa |

## 🚀 Deploy

### GitHub Pages
```bash
# El proyecto ya está configurado para GitHub Pages
git push origin main
# URL: https://Jaelyujra.github.io/pokemon-spa
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
# Simplemente conecta tu repo a Netlify
# La rama main se deployará automáticamente
```

## 📊 API Utilizada

**PokeAPI** - API REST gratuita de Pokémon
- Base URL: `https://pokeapi.co/api/v2`
- Endpoints utilizados:
  - `/pokemon` - Lista de Pokémon
  - `/pokemon/{id}` - Detalle de Pokémon
  - `/type` - Lista de tipos
  - `/type/{name}` - Detalle de tipo (para debilidades)

## 🐛 Limitaciones Conocidas

- La PokeAPI tiene límite de rate limiting (máximo 100 requests/minuto)
- No hay persistencia en servidor (solo localStorage local)
- Sonidos deshabilitados en navegadores sin autoplay de audio
- Algunas imágenes de Pokémon pueden no estar disponibles

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para cambios mayores:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Jaelyujra** - Frontend Developer

## 🙏 Agradecimientos

- PokeAPI por la increíble API de datos
- Tailwind CSS por los estilos
- FontAwesome por los iconos
- La comunidad de Pokémon ❤️

## 📞 Contacto

Para preguntas o sugerencias, abre un issue en GitHub.

---

**¡Diviértete capturando Pokémon!** 🎮✨
