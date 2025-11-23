/**
 * temperament-operations.js
 * Operaciones matemáticas para teoría de conjuntos en temperamentos iguales
 */

// Variables globales
var temperament = 19; // Valor por defecto
var originalSet = [];
var normalForm = [];
var currentTransposition = 0;
var currentInversion = 0;

/**
 * Operación módulo que maneja números negativos correctamente
 * @param {number} n - Número a calcular módulo
 * @param {number} m - Divisor módulo
 * @returns {number} Resultado de n mod m
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * Elimina duplicados de un array y lo ordena
 * @param {Array} arr - Array de entrada
 * @returns {Array} Array ordenado sin duplicados
 */
function removeDuplicatesAndSort(arr) {
    if (!arr || arr.length === 0) return [];
    
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        var isDuplicate = false;
        for (var j = 0; j < unique.length; j++) {
            if (arr[i] === unique[j]) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            unique.push(arr[i]);
        }
    }
    
    // Ordenamiento burbuja (simple y sin dependencias)
    for (var i = 0; i < unique.length - 1; i++) {
        for (var j = 0; j < unique.length - i - 1; j++) {
            if (unique[j] > unique[j + 1]) {
                var temp = unique[j];
                unique[j] = unique[j + 1];
                unique[j + 1] = temp;
            }
        }
    }
    
    return unique;
}

/**
 * Calcula la forma normal de un conjunto de clases de alturas
 * La forma normal es la rotación que minimiza el intervalo entre
 * el primer y último elemento del conjunto
 * 
 * @param {Array} set - Conjunto de clases de alturas
 * @param {number} temp - Temperamento (número de divisiones por octava)
 * @returns {Array} Forma normal del conjunto
 */
function calculateNormalForm(set, temp) {
    if (!set || set.length === 0) return [];
    if (set.length === 1) return set.slice();
    
    var cleanSet = removeDuplicatesAndSort(set);
    var n = cleanSet.length;
    var rotations = [];
    
    // Generar todas las rotaciones posibles
    for (var i = 0; i < n; i++) {
        var rotation = [];
        for (var j = 0; j < n; j++) {
            var index = (i + j) % n;
            rotation.push(cleanSet[index]);
        }
        rotations.push(rotation);
    }
    
    // Encontrar la rotación con el span mínimo
    var bestRotation = rotations[0];
    var minSpan = mod(bestRotation[bestRotation.length - 1] - bestRotation[0], temp);
    
    for (var i = 1; i < rotations.length; i++) {
        var currentRotation = rotations[i];
        var span = mod(currentRotation[currentRotation.length - 1] - currentRotation[0], temp);
        
        if (span < minSpan) {
            minSpan = span;
            bestRotation = currentRotation;
        } else if (span === minSpan) {
            // En caso de empate, usar criterio de desempate
            // (comparar intervalos internos desde el inicio)
            var useCurrent = false;
            for (var k = 1; k < currentRotation.length - 1; k++) {
            var currentInterval = mod(currentRotation[k] - currentRotation[0], temp);
                var bestInterval = mod(bestRotation[k] - bestRotation[0], temp);
                if (currentInterval < bestInterval) {
                    useCurrent = true;
                    break;
                } else if (currentInterval > bestInterval) {
                    break;
                }
            }
            if (useCurrent) {
                bestRotation = currentRotation;
            }
        }
    }
    
    return bestRotation.slice();
}

/**
 * Transpone un conjunto de clases de alturas por un intervalo dado
 * Tn(x) = (x + n) mod temperament
 * 
 * @param {Array} set - Conjunto de clases de alturas
 * @param {number} interval - Intervalo de transposición
 * @param {number} temp - Temperamento
 * @returns {Array} Conjunto transpuesto
 */
function transpose(set, interval, temp) {
    if (!set || set.length === 0) return [];
    
    var result = [];
    for (var i = 0; i < set.length; i++) {
        result.push(mod(set[i] + interval, temp));
    }
    
    return result;
}

/**
 * Invierte un conjunto de clases de alturas alrededor de un índice dado
 * TnI(x) = (n - x) mod temperament
 * 
 * @param {Array} set - Conjunto de clases de alturas
 * @param {number} index - Índice de inversión
 * @param {number} temp - Temperamento
 * @returns {Array} Conjunto invertido y ordenado
 */
function invert(set, index, temp) {
    if (!set || set.length === 0) return [];
    
    var result = [];
    for (var i = 0; i < set.length; i++) {
        result.push(mod(index - set[i], temp));
    }
    
    // Ordenar el resultado
    for (var i = 0; i < result.length - 1; i++) {
        for (var j = 0; j < result.length - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                var temp_val = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp_val;
            }
        }
    }
    
    return result;
}

/**
 * Actualiza el valor del temperamento activo
 * @param {number} newTemperament - Nuevo valor de temperamento
 */
function setTemperament(newTemperament) {
    temperament = parseInt(newTemperament, 10);
    // Actualizar límites de inputs
    var transInput = document.getElementById('transpositionInput');
    var invInput = document.getElementById('inversionInput');
    if (transInput) {
        transInput.max = temperament - 1;
        transInput.value = Math.min(parseInt(transInput.value, 10) || 0, temperament - 1);
    }
    if (invInput) {
        invInput.max = temperament - 1;
        invInput.value = Math.min(parseInt(invInput.value, 10) || 0, temperament - 1);
    }
}

/**
 * Calcula el vector interválico de un conjunto (opcional, para futuras versiones)
 * @param {Array} set - Conjunto de clases de alturas
 * @param {number} temp - Temperamento
 * @returns {Array} Vector interválico
 */
function calculateIntervalVector(set, temp) {
    if (!set || set.length < 2) return [];
    
    var vector = [];
    for (var i = 0; i <= temp / 2; i++) {
        vector[i] = 0;
    }
    
    for (var i = 0; i < set.length - 1; i++) {
        for (var j = i + 1; j < set.length; j++) {
            var interval = mod(set[j] - set[i], temp);
            if (interval > temp / 2) {
                interval = temp - interval;
            }
            vector[interval]++;
        }
    }
    
    return vector;
}