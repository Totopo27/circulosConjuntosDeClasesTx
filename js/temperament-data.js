/**
 * temperament-data.js
 * Definitions, segments and configurations for Equal Temperaments (19-TET, 31-TET, 41-TET, 53-TET)
 */

const RAW_TEMPERAMENT_CONFIGS = {
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

// Deeply freeze configuration objects to protect against runtime mutations
Object.keys(RAW_TEMPERAMENT_CONFIGS).forEach(key => {
    const config = RAW_TEMPERAMENT_CONFIGS[key];
    config.segments.forEach(segment => Object.freeze(segment));
    Object.freeze(config.segments);
    Object.freeze(config);
});
const TEMPERAMENT_CONFIGS = Object.freeze(RAW_TEMPERAMENT_CONFIGS);

/**
 * Validates if a temperament is officially supported
 * @param {number|string} temperament - Divisions to check (e.g. 19, 31, 41, 53)
 * @returns {boolean} true if supported
 */
function isTemperamentSupported(temperament) {
    if (temperament === null || temperament === undefined) return false;
    const key = String(temperament);
    return Object.prototype.hasOwnProperty.call(TEMPERAMENT_CONFIGS, key);
}

/**
 * Validates if a pitch class number is within the valid range [0, temperament - 1]
 * @param {number} value - Pitch class candidate
 * @param {number|string} temperament - Temperament divisions
 * @returns {boolean} true if valid integer within range
 */
function isValidPitchClass(value, temperament) {
    if (typeof value !== 'number' || !Number.isInteger(value)) return false;
    if (!isTemperamentSupported(temperament)) return false;
    const divisions = parseInt(temperament, 10);
    return value >= 0 && value < divisions;
}

/**
 * Validates and sanitizes a pitch class against a temperament range, throwing an error if invalid
 * @param {number} value - Pitch class
 * @param {number|string} temperament - Temperament
 * @returns {number} The valid pitch class
 */
function validatePitchClass(value, temperament) {
    if (!isValidPitchClass(value, temperament)) {
        throw new RangeError(
            `Pitch class ${value} is invalid for temperament ${temperament}-TET. Must be integer in range [0, ${parseInt(temperament, 10) - 1}].`
        );
    }
    return value;
}

/**
 * Gets the complete configuration for a temperament
 * @param {number|string} temperament - The division count
 * @returns {Object|null} Config object or null if not supported
 */
function getTemperamentConfig(temperament) {
    return isTemperamentSupported(temperament) ? TEMPERAMENT_CONFIGS[temperament] : null;
}

/**
 * Gets the segments array for a temperament
 * @param {number|string} temperament - The division count
 * @returns {Array<Object>} Array of segments (or empty array if invalid)
 */
function getSegmentsForTemperament(temperament) {
    const config = getTemperamentConfig(temperament);
    return config ? config.segments : [];
}

/**
 * Gets the descriptive name of a temperament
 * @param {number|string} temperament - The division count
 * @returns {string} Name of temperament or 'Unknown'
 */
function getTemperamentName(temperament) {
    const config = getTemperamentConfig(temperament);
    return config ? config.name : 'Unknown';
}

/**
 * Gets the description of a temperament
 * @param {number|string} temperament - The division count
 * @returns {string} Description of temperament
 */
function getTemperamentDescription(temperament) {
    const config = getTemperamentConfig(temperament);
    return config ? config.description : 'Temperamento desconocido';
}

/**
 * Gets the list of all available temperaments
 * @returns {Array<{divisions: number, name: string, description: string, segmentCount: number}>}
 */
function getAvailableTemperaments() {
    return Object.keys(TEMPERAMENT_CONFIGS).map(key => {
        const config = TEMPERAMENT_CONFIGS[key];
        return {
            divisions: parseInt(key, 10),
            name: config.name,
            description: config.description,
            segmentCount: config.segments.length
        };
    });
}

// Module export structure
const TemperamentData = {
    TEMPERAMENT_CONFIGS,
    getTemperamentConfig,
    getSegmentsForTemperament,
    getTemperamentName,
    getTemperamentDescription,
    getAvailableTemperaments,
    isTemperamentSupported,
    isValidPitchClass,
    validatePitchClass
};

// Browser global bindings
if (typeof window !== 'undefined') {
    window.TEMPERAMENT_CONFIGS = TEMPERAMENT_CONFIGS;
    window.TemperamentData = TemperamentData;
    window.getTemperamentConfig = getTemperamentConfig;
    window.getSegmentsForTemperament = getSegmentsForTemperament;
    window.getTemperamentName = getTemperamentName;
    window.getTemperamentDescription = getTemperamentDescription;
    window.getAvailableTemperaments = getAvailableTemperaments;
    window.isTemperamentSupported = isTemperamentSupported;
    window.isValidPitchClass = isValidPitchClass;
    window.validatePitchClass = validatePitchClass;
}

// CommonJS export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemperamentData;
}
