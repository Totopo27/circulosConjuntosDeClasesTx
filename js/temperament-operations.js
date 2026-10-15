/**
 * temperament-operations.js
 * Mathematical operations for Pitch Class Set Theory across Equal Temperaments (19, 31, 41, 53-TET)
 */

// Application state with controlled mutation
let activeTemperament = 19;
let originalSet = [];
let normalForm = [];
let currentTransposition = 0;
let currentInversion = 0;

/**
 * Standard positive modulo operation (handles negative values cleanly)
 * n mod m with result in [0, m - 1]
 * @param {number} n - Number to compute modulo of
 * @param {number} m - Modulo divisor
 * @returns {number} Non-negative remainder n mod m
 */
function mod(n, m) {
    if (typeof m !== 'number' || m === 0 || Number.isNaN(m)) return 0;
    const remainder = n % m;
    return remainder < 0 ? remainder + m : (remainder === -0 ? 0 : remainder);
}

/**
 * Sanitizes an array of pitch classes: removes duplicates, converts to integers,
 * optionally normalizes modulo m, and sorts numerically in ascending order.
 * @param {Array<number>} arr - Input array
 * @param {number} [m] - Optional modulo for pitch classes
 * @returns {Array<number>} Ascending sorted unique integers
 */
function removeDuplicatesAndSort(arr, m) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return [];

    const uniqueSet = new Set();
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        if (typeof val === 'number' && !Number.isNaN(val) && Number.isFinite(val)) {
            const intVal = Math.round(val);
            const normalized = (typeof m === 'number' && m > 0) ? mod(intVal, m) : intVal;
            uniqueSet.add(normalized);
        }
    }

    return Array.from(uniqueSet).sort((a, b) => a - b);
}

/**
 * Calculates the Normal Form of a pitch class set according to John Rahn's canonical algorithm.
 *
 * Steps:
 * 1. Eliminate duplicates and sort in ascending order.
 * 2. Generate all n cyclic rotations.
 * 3. Find rotation(s) minimizing span: mod(rotation[n - 1] - rotation[0], temp).
 * 4. Tie-breaking rule (Rahn): compare interval from rotation[0] to rotation[k]
 *    for k = n - 2 down to 1. Choose the candidate with minimal interval at the first difference.
 * 5. If still tied (transpositionally/inversionally symmetric sets), select the rotation with
 *    the lowest initial pitch-class integer value rotation[0].
 *
 * @param {Array<number>} set - Pitch class set
 * @param {number} temp - Number of equal divisions in octave (e.g. 19, 31, 41, 53)
 * @returns {Array<number>} The normal form ordered array
 */
function calculateNormalForm(set, temp) {
    if (!set || !Array.isArray(set) || set.length === 0) return [];
    if (typeof temp !== 'number' || temp <= 0) return [];

    const cleanSet = removeDuplicatesAndSort(set, temp);
    const n = cleanSet.length;
    if (n <= 1) return cleanSet.slice();

    // Generate all n cyclic rotations
    const rotations = [];
    for (let i = 0; i < n; i++) {
        const rotation = new Array(n);
        for (let j = 0; j < n; j++) {
            rotation[j] = cleanSet[(i + j) % n];
        }
        rotations.push(rotation);
    }

    // Step 1: Find rotation(s) with minimal span between first and last element
    let minSpan = Infinity;
    for (let i = 0; i < n; i++) {
        const span = mod(rotations[i][n - 1] - rotations[i][0], temp);
        if (span < minSpan) {
            minSpan = span;
        }
    }

    let candidates = rotations.filter(
        rot => mod(rot[n - 1] - rot[0], temp) === minSpan
    );

    if (candidates.length === 1) {
        return candidates[0].slice();
    }

    // Step 2: Canonical John Rahn tie-breaking rule
    // Compare interval from first note to (n - 1)th note (k = n - 2), down to 2nd note (k = 1)
    for (let k = n - 2; k >= 1; k--) {
        let minInterval = Infinity;
        for (let i = 0; i < candidates.length; i++) {
            const interval = mod(candidates[i][k] - candidates[i][0], temp);
            if (interval < minInterval) {
                minInterval = interval;
            }
        }

        candidates = candidates.filter(
            rot => mod(rot[k] - rot[0], temp) === minInterval
        );

        if (candidates.length === 1) {
            return candidates[0].slice();
        }
    }

    // Step 3: Symmetrical chord tie-breaker: choose rotation with lowest initial pitch-class
    let bestRotation = candidates[0];
    for (let i = 1; i < candidates.length; i++) {
        if (candidates[i][0] < bestRotation[0]) {
            bestRotation = candidates[i];
        }
    }

    return bestRotation.slice();
}

/**
 * Transposes a pitch class set by a given interval: Tn(x) = (x + interval) mod temp.
 * Pure function: returns a new numerically sorted array of unique pitch classes.
 *
 * @param {Array<number>} set - Pitch class set
 * @param {number} interval - Transposition interval
 * @param {number} temp - Temperamento (divisions per octave)
 * @returns {Array<number>} Transposed and sorted set
 */
function transpose(set, interval, temp) {
    if (!set || !Array.isArray(set) || set.length === 0) return [];
    if (typeof temp !== 'number' || temp <= 0) return [];

    const t = mod(Math.round(interval || 0), temp);
    const cleanSet = removeDuplicatesAndSort(set, temp);
    const transposed = cleanSet.map(x => mod(x + t, temp));
    return removeDuplicatesAndSort(transposed, temp);
}

/**
 * Inverts a pitch class set around an index: TnI(x) = (index - x) mod temp.
 * Pure function: returns a new numerically sorted array of unique pitch classes.
 *
 * @param {Array<number>} set - Pitch class set
 * @param {number} index - Inversion index
 * @param {number} temp - Temperamento (divisions per octave)
 * @returns {Array<number>} Inverted and sorted set
 */
function invert(set, index, temp) {
    if (!set || !Array.isArray(set) || set.length === 0) return [];
    if (typeof temp !== 'number' || temp <= 0) return [];

    const idx = mod(Math.round(index || 0), temp);
    const cleanSet = removeDuplicatesAndSort(set, temp);
    const inverted = cleanSet.map(x => mod(idx - x, temp));
    return removeDuplicatesAndSort(inverted, temp);
}

/**
 * Calculates the interval vector for a pitch class set.
 * In N-TET, interval classes run from 1 to floor(N / 2).
 * Returns an array of counts for ic_1 through ic_{floor(temp/2)}, where
 * index 0 corresponds to ic_1 and index (floor(temp/2) - 1) to ic_{floor(temp/2)}.
 *
 * @param {Array<number>} set - Pitch class set
 * @param {number} temp - Temperamento
 * @returns {Array<number>} Interval vector array of length floor(temp / 2)
 */
function calculateIntervalVector(set, temp) {
    if (!set || !Array.isArray(set) || set.length < 2) return [];
    if (typeof temp !== 'number' || temp <= 0) return [];

    const cleanSet = removeDuplicatesAndSort(set, temp);
    if (cleanSet.length < 2) return [];

    const numClasses = Math.floor(temp / 2);
    const vector = new Array(numClasses).fill(0);

    for (let i = 0; i < cleanSet.length - 1; i++) {
        for (let j = i + 1; j < cleanSet.length; j++) {
            let diff = mod(cleanSet[j] - cleanSet[i], temp);
            if (diff > temp / 2) {
                diff = temp - diff;
            }
            if (diff >= 1 && diff <= numClasses) {
                vector[diff - 1]++;
            }
        }
    }

    return vector;
}

/**
 * Updates the active temperament and harmonizes inputs limits in the DOM
 * @param {number} newTemperament - New temperament value (19, 31, 41, 53)
 * @returns {number} Updated active temperament
 */
function setTemperament(newTemperament) {
    const parsed = parseInt(newTemperament, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
        activeTemperament = parsed;
    }

    if (typeof document !== 'undefined') {
        const transInput = document.getElementById('transpositionInput');
        const invInput = document.getElementById('inversionInput');
        const maxVal = activeTemperament - 1;

        if (transInput) {
            transInput.max = String(maxVal);
            const cur = parseInt(transInput.value, 10);
            if (Number.isNaN(cur) || cur < 0 || cur > maxVal) {
                transInput.value = '0';
            }
        }
        if (invInput) {
            invInput.max = String(maxVal);
            const cur = parseInt(invInput.value, 10);
            if (Number.isNaN(cur) || cur < 0 || cur > maxVal) {
                invInput.value = '0';
            }
        }
    }

    return activeTemperament;
}

// Module object encapsulating functions and state accessors
const TemperamentOperations = {
    mod,
    removeDuplicatesAndSort,
    calculateNormalForm,
    transpose,
    invert,
    calculateIntervalVector,
    setTemperament,
    get temperament() { return activeTemperament; },
    set temperament(val) { setTemperament(val); },
    get originalSet() { return originalSet; },
    set originalSet(val) { originalSet = Array.isArray(val) ? val.slice() : []; },
    get normalForm() { return normalForm; },
    set normalForm(val) { normalForm = Array.isArray(val) ? val.slice() : []; },
    get currentTransposition() { return currentTransposition; },
    set currentTransposition(val) { currentTransposition = typeof val === 'number' ? val : 0; },
    get currentInversion() { return currentInversion; },
    set currentInversion(val) { currentInversion = typeof val === 'number' ? val : 0; }
};

// Backwards compatibility with browser global scope
if (typeof window !== 'undefined') {
    window.TemperamentOperations = TemperamentOperations;
    window.mod = mod;
    window.removeDuplicatesAndSort = removeDuplicatesAndSort;
    window.calculateNormalForm = calculateNormalForm;
    window.transpose = transpose;
    window.invert = invert;
    window.calculateIntervalVector = calculateIntervalVector;
    window.setTemperament = setTemperament;

    // Define properties on window so global variable reads/writes continue to work seamlessly
    Object.defineProperty(window, 'temperament', {
        get() { return activeTemperament; },
        set(val) { setTemperament(val); },
        configurable: true
    });
    Object.defineProperty(window, 'originalSet', {
        get() { return originalSet; },
        set(val) { originalSet = Array.isArray(val) ? val.slice() : []; },
        configurable: true
    });
    Object.defineProperty(window, 'normalForm', {
        get() { return normalForm; },
        set(val) { normalForm = Array.isArray(val) ? val.slice() : []; },
        configurable: true
    });
    Object.defineProperty(window, 'currentTransposition', {
        get() { return currentTransposition; },
        set(val) { currentTransposition = typeof val === 'number' ? val : 0; },
        configurable: true
    });
    Object.defineProperty(window, 'currentInversion', {
        get() { return currentInversion; },
        set(val) { currentInversion = typeof val === 'number' ? val : 0; },
        configurable: true
    });
}

// CommonJS export for Node.js / unit tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemperamentOperations;
}
