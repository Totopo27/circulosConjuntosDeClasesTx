/**
 * temperament-data.js
 * Definiciones de segmentos y configuraciones para cada temperamento
 */

const TEMPERAMENT_CONFIGS = {
    19: {
        name: '19-TET',
        description: 'Sistema de 19 divisiones por octava (~63.16 cents por grado)',
        segments: [
            { value: 0,  color: '#e0e0e0', label: 'C' },
            { value: 1,  color: '#4a90e2' },
            { value: 2,  color: '#000000' },
            { value: 3,  color: '#e0e0e0', label: 'D' },
            { value: 4,  color: '#000000' },
            { value: 5,  color: '#4a90e2' },
            { value: 6,  color: '#e0e0e0', label: 'E' },
            { value: 7,  color: '#000000' },
            { value: 8,  color: '#e0e0e0', label: 'F' },
            { value: 9,  color: '#000000' },
            { value: 10, color: '#4a90e2' },
            { value: 11, color: '#e0e0e0', label: 'G' },
            { value: 12, color: '#000000' },
            { value: 13, color: '#4a90e2' },
            { value: 14, color: '#e0e0e0', label: 'A' },
            { value: 15, color: '#000000' },
            { value: 16, color: '#4a90e2' },
            { value: 17, color: '#e0e0e0', label: 'B' },
            { value: 18, color: '#4a90e2' }
        ]
    },
    
    31: {
        name: '31-TET',
        description: 'Sistema de 31 divisiones por octava (~38.71 cents por grado)',
        segments: [
            { value: 0,  color: '#e0e0e0', label: 'C' },
            { value: 1,  color: '#4a90e2' },
            { value: 2,  color: '#000000' },
            { value: 3,  color: '#000000' },
            { value: 4,  color: '#4a90e2' },
            { value: 5,  color: '#e0e0e0', label: 'D' },
            { value: 6,  color: '#4a90e2' },
            { value: 7,  color: '#000000' },
            { value: 8,  color: '#000000' },
            { value: 9,  color: '#4a90e2' },
            { value: 10, color: '#e0e0e0', label: 'E' },
            { value: 11, color: '#4a90e2' },
            { value: 12, color: '#000000' },
            { value: 13, color: '#e0e0e0', label: 'F' },
            { value: 14, color: '#4a90e2' },
            { value: 15, color: '#000000' },
            { value: 16, color: '#000000' },
            { value: 17, color: '#4a90e2' },
            { value: 18, color: '#e0e0e0', label: 'G' },
            { value: 19, color: '#4a90e2' },
            { value: 20, color: '#000000' },
            { value: 21, color: '#000000' },
            { value: 22, color: '#4a90e2' },
            { value: 23, color: '#e0e0e0', label: 'A' },
            { value: 24, color: '#4a90e2' },
            { value: 25, color: '#000000' },
            { value: 26, color: '#000000' },
            { value: 27, color: '#4a90e2' },
            { value: 28, color: '#e0e0e0', label: 'B' },
            { value: 29, color: '#4a90e2' },
            { value: 30, color: '#4a90e2' }
        ]
    },
    
    41: {
        name: '41-TET',
        description: 'Sistema de 41 divisiones por octava (~29.27 cents por grado)',
        segments: [
            { value: 0,  color: '#e0e0e0', label: 'C' },
            { value: 1,  color: '#4a90e2' },
            { value: 2,  color: '#4a90e2' },
            { value: 3,  color: '#000000' },
            { value: 4,  color: '#000000' },
            { value: 5,  color: '#4a90e2' },
            { value: 6,  color: '#4a90e2' },
            { value: 7,  color: '#e0e0e0', label: 'D' },
            { value: 8,  color: '#4a90e2' },
            { value: 9,  color: '#4a90e2' },
            { value: 10, color: '#000000' },
            { value: 11, color: '#000000' },
            { value: 12, color: '#4a90e2' },
            { value: 13, color: '#4a90e2' },
            { value: 14, color: '#e0e0e0', label: 'E' },
            { value: 15, color: '#4a90e2' },
            { value: 16, color: '#4a90e2' },
            { value: 17, color: '#e0e0e0', label: 'F' },
            { value: 18, color: '#4a90e2' },
            { value: 19, color: '#4a90e2' },
            { value: 20, color: '#000000' },
            { value: 21, color: '#000000' },
            { value: 22, color: '#4a90e2' },
            { value: 23, color: '#4a90e2' },
            { value: 24, color: '#e0e0e0', label: 'G' },
            { value: 25, color: '#4a90e2' },
            { value: 26, color: '#4a90e2' },
            { value: 27, color: '#000000' },
            { value: 28, color: '#000000' },
            { value: 29, color: '#4a90e2' },
            { value: 30, color: '#4a90e2' },
            { value: 31, color: '#e0e0e0', label: 'A' },
            { value: 32, color: '#4a90e2' },
            { value: 33, color: '#4a90e2' },
            { value: 34, color: '#000000' },
            { value: 35, color: '#000000' },
            { value: 36, color: '#4a90e2' },
            { value: 37, color: '#4a90e2' },
            { value: 38, color: '#e0e0e0', label: 'B' },
            { value: 39, color: '#4a90e2' },
            { value: 40, color: '#4a90e2' }
        ]
    },
    
    53: {
        name: '53-TET',
        description: 'Sistema de 53 divisiones por octava (~22.64 cents por grado)',
        segments: [
            { value: 0,  color: '#e0e0e0', label: 'C' },
            { value: 1,  color: '#4a90e2' },
            { value: 2,  color: '#6fb369' },
            { value: 3,  color: '#4a90e2' },
            { value: 4,  color: '#000000' },
            { value: 5,  color: '#000000' },
            { value: 6,  color: '#4a90e2' },
            { value: 7,  color: '#6fb369' },
            { value: 8,  color: '#4a90e2' },
            { value: 9,  color: '#e0e0e0', label: 'D' },
            { value: 10, color: '#4a90e2' },
            { value: 11, color: '#6fb369' },
            { value: 12, color: '#4a90e2' },
            { value: 13, color: '#000000' },
            { value: 14, color: '#000000' },
            { value: 15, color: '#4a90e2' },
            { value: 16, color: '#6fb369' },
            { value: 17, color: '#4a90e2' },
            { value: 18, color: '#e0e0e0', label: 'E' },
            { value: 19, color: '#4a90e2' },
            { value: 20, color: '#4a90e2' },
            { value: 21, color: '#4a90e2' },
            { value: 22, color: '#e0e0e0', label: 'F' },
            { value: 23, color: '#4a90e2' },
            { value: 24, color: '#6fb369' },
            { value: 25, color: '#4a90e2' },
            { value: 26, color: '#000000' },
            { value: 27, color: '#000000' },
            { value: 28, color: '#4a90e2' },
            { value: 29, color: '#6fb369' },
            { value: 30, color: '#4a90e2' },
            { value: 31, color: '#e0e0e0', label: 'G' },
            { value: 32, color: '#4a90e2' },
            { value: 33, color: '#6fb369' },
            { value: 34, color: '#4a90e2' },
            { value: 35, color: '#000000' },
            { value: 36, color: '#000000' },
            { value: 37, color: '#4a90e2' },
            { value: 38, color: '#6fb369' },
            { value: 39, color: '#4a90e2' },
            { value: 40, color: '#e0e0e0', label: 'A' },
            { value: 41, color: '#4a90e2' },
            { value: 42, color: '#6fb369' },
            { value: 43, color: '#4a90e2' },
            { value: 44, color: '#000000' },
            { value: 45, color: '#000000' },
            { value: 46, color: '#4a90e2' },
            { value: 47, color: '#6fb369' },
            { value: 48, color: '#4a90e2' },
            { value: 49, color: '#e0e0e0', label: 'B' },
            { value: 50, color: '#4a90e2' },
            { value: 51, color: '#000000' },
            { value: 52, color: '#4a90e2' }
        ]
    }
};

/**
 * Obtiene la configuración completa de un temperamento
 * @param {number} temperament - El número de divisiones (19, 31, 41, 53)
 * @returns {Object|null} Configuración del temperamento o null si no existe
 */
function getTemperamentConfig(temperament) {
    return TEMPERAMENT_CONFIGS[temperament] || null;
}

/**
 * Obtiene la configuración de segmentos para un temperamento dado
 * @param {number} temperament - El número de divisiones (19, 31, 41, 53)
 * @returns {Array} Array de segmentos
 */
function getSegmentsForTemperament(temperament) {
    const config = TEMPERAMENT_CONFIGS[temperament];
    if (!config) {
        console.error(`Temperamento ${temperament} no está definido`);
        return [];
    }
    return config.segments || [];
}

/**
 * Obtiene el nombre descriptivo del temperamento
 * @param {number} temperament - El número de divisiones
 * @returns {string} Nombre del temperamento
 */
function getTemperamentName(temperament) {
    const config = TEMPERAMENT_CONFIGS[temperament];
    return config ? config.name : 'Unknown';
}

/**
 * Obtiene la descripción del temperamento
 * @param {number} temperament - El número de divisiones
 * @returns {string} Descripción del temperamento
 */
function getTemperamentDescription(temperament) {
    const config = TEMPERAMENT_CONFIGS[temperament];
    return config ? config.description : 'Temperamento desconocido';
}

/**
 * Obtiene lista de todos los temperamentos disponibles
 * @returns {Array} Array con información de temperamentos disponibles
 */
function getAvailableTemperaments() {
    return Object.keys(TEMPERAMENT_CONFIGS).map(key => {
        const config = TEMPERAMENT_CONFIGS[key];
        return {
            divisions: parseInt(key),
            name: config.name,
            description: config.description,
            segmentCount: config.segments.length
        };
    });
}

/**
 * Valida si un temperamento está soportado
 * @param {number} temperament - El número de divisiones a validar
 * @returns {boolean} true si el temperamento está soportado
 */
function isTemperamentSupported(temperament) {
    return TEMPERAMENT_CONFIGS.hasOwnProperty(temperament);
}

// Logging para debug - solo en desarrollo
if (typeof console !== 'undefined') {
    console.log('temperament-data.js cargado correctamente');
    console.log('Temperamentos disponibles:', Object.keys(TEMPERAMENT_CONFIGS));
}