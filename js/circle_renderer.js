/**
 * circle_renderer.js
 * SVG rendering, mathematical visualization, and accessible interaction for Pitch Class Circles
 */

// Dial Geometry Constants
const centerX = 200;
const centerY = 200;
const outerRadius = 180;
const innerRadius = 110;

// Application State
let currentSegments = [];
const selectedSegments = new Set();
const fnElements = [];
const tnElements = [];
const tniElements = [];

/**
 * Displays an accessible, non-blocking in-app notification toast
 * @param {string} message - Notification text
 * @param {'info'|'warning'|'success'} [type='info'] - Notification semantic type
 * @param {number} [duration=3000] - Lifespan in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn(`[Toast ${type}]: ${message}`);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 350);
    }, duration);
}

/**
 * Returns dynamic typography and positioning config scaled to segment density
 * @param {number} totalSegments - Total degrees in octave (12, 19, 22, 24, 31, 41, 53)
 * @returns {{numberSize: string, labelSize: string, numberOffsetWithLabel: number, labelOffset: number}}
 */
function getFontConfigForTemperament(totalSegments) {
    if (totalSegments <= 12) {
        return {
            numberSize: '14',
            labelSize: '15',
            numberOffsetWithLabel: 7.5,
            labelOffset: 13
        };
    } else if (totalSegments <= 19) {
        return {
            numberSize: '13',
            labelSize: '14',
            numberOffsetWithLabel: 7,
            labelOffset: 12
        };
    } else if (totalSegments <= 24) {
        return {
            numberSize: '12',
            labelSize: '13',
            numberOffsetWithLabel: 6.5,
            labelOffset: 11
        };
    } else if (totalSegments <= 31) {
        return {
            numberSize: '11',
            labelSize: '12',
            numberOffsetWithLabel: 6,
            labelOffset: 10
        };
    } else if (totalSegments <= 41) {
        return {
            numberSize: '9.5',
            labelSize: '10',
            numberOffsetWithLabel: 5.5,
            labelOffset: 9
        };
    } else {
        // 53-TET
        return {
            numberSize: '8.5',
            labelSize: '9',
            numberOffsetWithLabel: 5,
            labelOffset: 8
        };
    }
}

/**
 * Generates an SVG path for an annular ring segment
 * @param {number} index - Segment index
 * @param {number} totalSegments - Total slices in circle
 * @returns {string} SVG Path definition
 */
function createSegmentPath(index, totalSegments) {
    const anglePerSegment = (2 * Math.PI) / totalSegments;
    const startAngle = index * anglePerSegment;
    const endAngle = (index + 1) * anglePerSegment;

    const x1 = centerX + outerRadius * Math.cos(startAngle);
    const y1 = centerY + outerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(endAngle);
    const y2 = centerY + outerRadius * Math.sin(endAngle);
    const x3 = centerX + innerRadius * Math.cos(endAngle);
    const y3 = centerY + innerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(startAngle);
    const y4 = centerY + innerRadius * Math.sin(startAngle);

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
}

/**
 * Creates SVG text elements for segment value and optional note label
 * @param {number} index - Segment index
 * @param {number} value - Pitch class integer
 * @param {string} [label] - Optional natural note label (C, D, E, F, G, A, B)
 * @param {number} totalSegments - Total slices in circle
 * @returns {Array<SVGTextElement>} Array of text elements
 */
function createSegmentTexts(index, value, label, totalSegments) {
    const anglePerSegment = (2 * Math.PI) / totalSegments;
    const angle = (index + 0.5) * anglePerSegment;
    const baseRadius = (outerRadius + innerRadius) / 2;
    const x = centerX + baseRadius * Math.cos(angle);
    const y = centerY + baseRadius * Math.sin(angle);
    const rotation = (angle * 180 / Math.PI) + 90;

    const fontCfg = getFontConfigForTemperament(totalSegments);
    const texts = [];

    // Position pitch class number (centered if no note label, offset radially if label exists)
    const numberY = label ? (y - fontCfg.numberOffsetWithLabel) : y;
    const numberText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numberText.setAttribute('x', String(x));
    numberText.setAttribute('y', String(numberY));
    numberText.setAttribute('text-anchor', 'middle');
    numberText.setAttribute('dominant-baseline', 'central');
    numberText.setAttribute('fill', 'white');
    numberText.setAttribute('font-size', fontCfg.numberSize);
    numberText.setAttribute('font-weight', 'bold');
    numberText.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
    numberText.textContent = String(value);
    numberText.classList.add('segment-text');
    numberText.style.pointerEvents = 'none';
    texts.push(numberText);

    // Natural note name (e.g. C, D, E...)
    if (label) {
        const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelText.setAttribute('x', String(x));
        labelText.setAttribute('y', String(y + fontCfg.labelOffset));
        labelText.setAttribute('text-anchor', 'middle');
        labelText.setAttribute('dominant-baseline', 'central');
        labelText.setAttribute('fill', 'white');
        labelText.setAttribute('font-size', fontCfg.labelSize);
        labelText.setAttribute('font-weight', totalSegments > 31 ? 'bold' : '800');
        labelText.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
        labelText.textContent = label;
        labelText.classList.add('segment-label');
        labelText.style.pointerEvents = 'none';
        texts.push(labelText);
    }

    return texts;
}

/**
 * Validates availability of required libraries
 * @returns {boolean}
 */
function validateDependencies() {
    const missing = [];
    if (typeof getSegmentsForTemperament === 'undefined') {
        missing.push('getSegmentsForTemperament (temperament-data.js)');
    }
    if (typeof setTemperament === 'undefined') {
        missing.push('setTemperament (temperament-operations.js)');
    }
    if (missing.length > 0) {
        console.error('ERROR: Faltan dependencias:', missing.join(', '));
        return false;
    }
    return true;
}

/**
 * Initializes an SVG circle visualizer with segments and texts
 * @param {string} svgId - DOM ID of target SVG element
 * @param {Array<Object>} elementsArray - Array to store segment element references
 * @param {boolean} selectable - Whether segments are interactive buttons
 */
function initCircle(svgId, elementsArray, selectable) {
    const svg = document.getElementById(svgId);
    if (!svg) {
        console.error(`No se encontró el SVG con id: ${svgId}`);
        return;
    }

    svg.innerHTML = '';
    elementsArray.length = 0;

    const totalSegments = currentSegments.length;
    if (totalSegments === 0) {
        console.error('No hay segmentos para renderizar');
        return;
    }

    currentSegments.forEach((segment, i) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createSegmentPath(i, totalSegments));
        path.setAttribute('fill', segment.color);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', totalSegments > 40 ? '1' : '1.5');
        path.classList.add('segment');

        const labelText = segment.label ? `Grado ${segment.value} (${segment.label})` : `Grado ${segment.value}`;

        if (selectable) {
            path.classList.add('selectable');
            path.setAttribute('role', 'button');
            path.setAttribute('tabindex', '0');
            path.setAttribute('aria-label', labelText);
            path.setAttribute('aria-pressed', 'false');

            path.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSegment(segment, elementsArray);
            });

            path.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSegment(segment, elementsArray);
                }
            });
        } else {
            path.setAttribute('role', 'img');
            path.setAttribute('aria-label', labelText);
        }

        svg.appendChild(path);

        const texts = createSegmentTexts(i, segment.value, segment.label, totalSegments);
        texts.forEach(text => svg.appendChild(text));

        elementsArray.push({
            path,
            segment,
            texts
        });
    });
}

/**
 * Toggles pitch-class selection in the Fn selector circle
 * @param {Object} segment - Segment model
 * @param {Array<Object>} elementsArray - Segment elements references
 */
function toggleSegment(segment, elementsArray) {
    const element = elementsArray.find(el => el.segment.value === segment.value);
    if (!element) return;

    if (selectedSegments.has(segment.value)) {
        selectedSegments.delete(segment.value);
        element.path.classList.remove('selected');
        element.path.setAttribute('aria-pressed', 'false');
        element.texts.forEach(text => text.classList.remove('selected'));
    } else {
        selectedSegments.add(segment.value);
        element.path.classList.add('selected');
        element.path.setAttribute('aria-pressed', 'true');
        element.texts.forEach(text => text.classList.add('selected'));
    }

    updateFnDisplay();
}

/**
 * Updates the text display for the selected set
 */
function updateFnDisplay() {
    const display = document.getElementById('fnValues');
    if (!display) return;

    if (selectedSegments.size === 0) {
        display.textContent = '-';
    } else {
        const values = Array.from(selectedSegments).sort((a, b) => a - b);
        display.textContent = values.join(', ');
    }
}

/**
 * Clears all selections, highlights, and computed values
 */
function clearSelection() {
    selectedSegments.clear();

    [fnElements, tnElements, tniElements].forEach(group => {
        group.forEach(element => {
            element.path.classList.remove('selected', 'highlighted-yellow', 'highlighted-red');
            if (element.path.hasAttribute('aria-pressed')) {
                element.path.setAttribute('aria-pressed', 'false');
            }
            element.texts.forEach(text => {
                text.classList.remove('selected', 'highlighted-yellow', 'highlighted-red');
            });
        });
    });

    const fnDisp = document.getElementById('fnValues');
    const tnDisp = document.getElementById('tnValues');
    const tniDisp = document.getElementById('tniValues');

    if (fnDisp) fnDisp.textContent = '-';
    if (tnDisp) tnDisp.textContent = '-';
    if (tniDisp) tniDisp.textContent = '-';

    const currentTemp = (typeof temperament !== 'undefined' && temperament) || 19;
    renderIntervalVector([], currentTemp);
}

/**
 * Displays transposition results on the Tn circle
 * @param {Array<number>} resultArray - Transposed pitch classes
 */
function displayTransposition(resultArray) {
    tnElements.forEach(element => {
        element.path.classList.remove('highlighted-yellow');
        element.texts.forEach(text => text.classList.remove('highlighted-yellow'));
    });

    resultArray.forEach(value => {
        const element = tnElements.find(el => el.segment.value === value);
        if (element) {
            element.path.classList.add('highlighted-yellow');
            element.texts.forEach(text => text.classList.add('highlighted-yellow'));
        }
    });

    const display = document.getElementById('tnValues');
    if (display) {
        display.textContent = resultArray.length > 0 ? resultArray.join(', ') : '-';
    }
}

/**
 * Displays inversion results on the TnI circle
 * @param {Array<number>} resultArray - Inverted pitch classes
 */
function displayInversion(resultArray) {
    tniElements.forEach(element => {
        element.path.classList.remove('highlighted-red');
        element.texts.forEach(text => text.classList.remove('highlighted-red'));
    });

    resultArray.forEach(value => {
        const element = tniElements.find(el => el.segment.value === value);
        if (element) {
            element.path.classList.add('highlighted-red');
            element.texts.forEach(text => text.classList.add('highlighted-red'));
        }
    });

    const display = document.getElementById('tniValues');
    if (display) {
        display.textContent = resultArray.length > 0 ? resultArray.join(', ') : '-';
    }
}

/**
 * Handles the Bang button click / Enter submission: computes Normal Form, Tn, and TnI
 */
function handleSubmit() {
    const values = Array.from(selectedSegments).sort((a, b) => a - b);

    if (values.length === 0) {
        showToast('Por favor selecciona al menos un segmento antes de presionar Bang', 'warning');
        return;
    }

    const currentTemp = (typeof temperament !== 'undefined' && temperament) || 19;
    const calcNormal = (typeof calculateNormalForm === 'function')
        ? calculateNormalForm
        : (window.TemperamentOperations && window.TemperamentOperations.calculateNormalForm);
    const transFn = (typeof transpose === 'function')
        ? transpose
        : (window.TemperamentOperations && window.TemperamentOperations.transpose);
    const invFn = (typeof invert === 'function')
        ? invert
        : (window.TemperamentOperations && window.TemperamentOperations.invert);
    const modFn = (typeof mod === 'function')
        ? mod
        : (window.TemperamentOperations && window.TemperamentOperations.mod);

    const normForm = calcNormal(values, currentTemp);

    if (typeof originalSet !== 'undefined') originalSet = values.slice();
    if (typeof normalForm !== 'undefined') normalForm = normForm.slice();

    const transInput = document.getElementById('transpositionInput');
    const invInput = document.getElementById('inversionInput');

    const rawT = transInput ? parseInt(transInput.value, 10) : 0;
    const rawI = invInput ? parseInt(invInput.value, 10) : 0;

    const transposeValue = modFn(Number.isNaN(rawT) ? 0 : rawT, currentTemp);
    const invertValue = modFn(Number.isNaN(rawI) ? 0 : rawI, currentTemp);

    if (typeof currentTransposition !== 'undefined') currentTransposition = transposeValue;
    if (typeof currentInversion !== 'undefined') currentInversion = invertValue;

    const transposed = transFn(normForm, transposeValue, currentTemp);
    const inverted = invFn(normForm, invertValue, currentTemp);

    displayTransposition(transposed);
    displayInversion(inverted);

    const calcVec = (typeof calculateIntervalVector === 'function')
        ? calculateIntervalVector
        : (window.TemperamentOperations && window.TemperamentOperations.calculateIntervalVector);
    if (calcVec) {
        const vec = calcVec(normForm, currentTemp);
        renderIntervalVector(vec, currentTemp);
    }
}

/**
 * Renders the interval vector analysis grid and stats
 * @param {Array<number>} vector - Counts of interval classes
 * @param {number} temp - Current temperament
 */
function renderIntervalVector(vector, temp) {
    const grid = document.getElementById('vectorGrid');
    const notation = document.getElementById('vectorNotation');
    const badge = document.getElementById('totalIntervalsBadge');

    if (!grid) return;

    const totalIntervalClasses = Math.floor(temp / 2);
    const centsPerStep = 1200 / temp;

    if (!vector || vector.length === 0) {
        if (notation) notation.textContent = 'Notación formal: ⟨ - ⟩';
        if (badge) badge.textContent = 'Total intervalos: 0';
        grid.innerHTML = '';
        for (let k = 1; k <= totalIntervalClasses; k++) {
            const cents = Math.round(k * centsPerStep);
            const col = document.createElement('div');
            col.className = 'vector-col empty';
            col.innerHTML = `
                <div class="vector-header">ic<sub>${k}</sub></div>
                <div class="vector-cents">~${cents}¢</div>
                <div class="vector-count">0</div>
                <div class="vector-bar-wrap"><div class="vector-bar" style="height: 0%"></div></div>
            `;
            grid.appendChild(col);
        }
        return;
    }

    const totalIntervals = vector.reduce((acc, val) => acc + val, 0);
    const maxVal = Math.max(...vector, 1);

    if (notation) notation.textContent = `Notación formal: ⟨ ${vector.join(', ')} ⟩`;
    if (badge) badge.textContent = `Total intervalos: ${totalIntervals}`;

    grid.innerHTML = '';
    for (let k = 1; k <= totalIntervalClasses; k++) {
        const count = vector[k - 1] || 0;
        const cents = Math.round(k * centsPerStep);
        const heightPct = count > 0 ? Math.min(100, Math.round((count / maxVal) * 100)) : 0;
        const col = document.createElement('div');
        col.className = `vector-col${count > 0 ? ' has-count' : ' empty'}`;
        col.innerHTML = `
            <div class="vector-header">ic<sub>${k}</sub></div>
            <div class="vector-cents">~${cents}¢</div>
            <div class="vector-count">${count}</div>
            <div class="vector-bar-wrap"><div class="vector-bar" style="height: ${heightPct}%"></div></div>
        `;
        grid.appendChild(col);
    }
}

/**
 * Changes active temperament and reinitializes circles
 * @param {number} newTemperament - Divisions per octave
 */
function changeTemperament(newTemperament) {
    currentSegments = getSegmentsForTemperament(newTemperament);

    if (currentSegments.length === 0) {
        console.error(`No se encontraron segmentos para temperamento ${newTemperament}`);
        showToast(`Error al cargar datos de ${newTemperament}-TET`, 'warning');
        return;
    }

    setTemperament(newTemperament);
    selectedSegments.clear();

    initCircle('fnSvg', fnElements, true);
    initCircle('tnSvg', tnElements, false);
    initCircle('tniSvg', tniElements, false);

    clearSelection();
}

/**
 * Initializes application on DOMContentLoaded
 */
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!validateDependencies()) {
            console.error('No se puede inicializar: faltan dependencias');
            return;
        }

        const temperamentSelect = document.getElementById('temperamentSelect');
        if (!temperamentSelect) {
            console.error('ERROR: No se encontró el selector de temperamento');
            return;
        }

        const initialTemperament = parseInt(temperamentSelect.value, 10);
        changeTemperament(initialTemperament);

        // Event Listeners
        temperamentSelect.addEventListener('change', function() {
            changeTemperament(parseInt(this.value, 10));
        });

        const bangBtn = document.getElementById('bangBtn');
        if (bangBtn) {
            bangBtn.addEventListener('click', handleSubmit);
        }

        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearSelection();
                showToast('Selección limpiada', 'info', 1500);
            });
        }

        // Input sanitization on manual typing/blur
        const transInput = document.getElementById('transpositionInput');
        const invInput = document.getElementById('inversionInput');

        [transInput, invInput].forEach(input => {
            if (!input) return;
            input.addEventListener('change', function() {
                const currentTemp = (typeof temperament !== 'undefined' && temperament) || 19;
                const maxVal = currentTemp - 1;
                let val = parseInt(this.value, 10);
                if (Number.isNaN(val) || val < 0) {
                    this.value = '0';
                } else if (val > maxVal) {
                    this.value = String(val % currentTemp);
                }
            });
        });

        // Global keyboard accessibility: Enter for Bang, Escape for Clear
        document.addEventListener('keydown', (e) => {
            const activeEl = document.activeElement;

            if (e.key === 'Escape') {
                clearSelection();
                showToast('Selección limpiada', 'info', 1500);
                return;
            }

            if (e.key === 'Enter') {
                // If focus is specifically on an SVG segment button or theme toggle, let that element's handler process it
                if (activeEl && (activeEl.classList.contains('selectable') || activeEl.id === 'themeToggle' || activeEl.id === 'clearBtn')) {
                    return;
                }
                e.preventDefault();
                handleSubmit();
            }
        });
    });
}

// Module export structure for testing and modular environments
if (typeof window !== 'undefined') {
    window.getFontConfigForTemperament = getFontConfigForTemperament;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getFontConfigForTemperament
    };
}
