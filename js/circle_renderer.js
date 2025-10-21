/**
 * circle-renderer.js
 * Maneja el renderizado SVG y la interacción del usuario
 */

// Constantes de geometría
const centerX = 200;
const centerY = 200;
const outerRadius = 180;
const innerRadius = 110;

// Estado de la aplicación
let currentSegments = [];
let selectedSegments = new Set();
let fnElements = [];
let tnElements = [];
let tniElements = [];

/**
 * Crea el path SVG para un segmento del círculo
 * @param {number} index - Índice del segmento
 * @param {number} totalSegments - Total de segmentos en el círculo
 * @returns {string} Path SVG
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
 * Crea los elementos de texto para un segmento (número y etiqueta)
 * @param {number} index - Índice del segmento
 * @param {number} value - Valor numérico del segmento
 * @param {string} label - Etiqueta opcional (nota musical)
 * @param {number} totalSegments - Total de segmentos
 * @returns {Array} Array con elementos de texto [numberText, labelText?]
 */
function createSegmentTexts(index, value, label, totalSegments) {
    const anglePerSegment = (2 * Math.PI) / totalSegments;
    const angle = (index + 0.5) * anglePerSegment;
    const baseRadius = (outerRadius + innerRadius) / 2;
    const x = centerX + baseRadius * Math.cos(angle);
    const y = centerY + baseRadius * Math.sin(angle);
    const rotation = (angle * 180 / Math.PI) + 90;
    
    const texts = [];
    
    // Texto del número (arriba)
    const numberText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numberText.setAttribute('x', x);
    numberText.setAttribute('y', y - 8);
    numberText.setAttribute('text-anchor', 'middle');
    numberText.setAttribute('dominant-baseline', 'middle');
    numberText.setAttribute('fill', 'white');
    numberText.setAttribute('font-size', totalSegments > 40 ? '11' : '14');
    numberText.setAttribute('font-weight', 'bold');
    numberText.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
    numberText.textContent = value;
    numberText.classList.add('segment-text');
    numberText.style.pointerEvents = 'none';
    texts.push(numberText);
    
    // Etiqueta de nota (debajo, si existe)
    if (label) {
        const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelText.setAttribute('x', x);
        labelText.setAttribute('y', y + (totalSegments > 40 ? 10 : 14));
        labelText.setAttribute('text-anchor', 'middle');
        labelText.setAttribute('dominant-baseline', 'middle');
        labelText.setAttribute('fill', 'white');
        labelText.setAttribute('font-size', totalSegments > 40 ? '12' : '16');
        labelText.setAttribute('font-weight', totalSegments > 40 ? 'normal' : '700');
        labelText.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
        labelText.textContent = label;
        labelText.classList.add('segment-label');
        labelText.style.pointerEvents = 'none';
        texts.push(labelText);
    }
    
    return texts;
}

/**
 * Valida que las dependencias estén disponibles
 * @returns {boolean} true si todas las dependencias están disponibles
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
 * Inicializa un círculo SVG con segmentos
 * @param {string} svgId - ID del elemento SVG
 * @param {Array} elementsArray - Array para almacenar referencias a elementos
 * @param {boolean} selectable - Si los segmentos son clicables
 */
function initCircle(svgId, elementsArray, selectable) {
    const svg = document.getElementById(svgId);
    if (!svg) {
        console.error(`No se encontró el SVG con id: ${svgId}`);
        return;
    }
    
    // Limpiar SVG
    svg.innerHTML = '';
    
    // Limpiar array de elementos
    elementsArray.length = 0;
    
    const totalSegments = currentSegments.length;
    
    if (totalSegments === 0) {
        console.error('No hay segmentos para renderizar');
        return;
    }
    
    console.log(`Renderizando ${totalSegments} segmentos en ${svgId}`);
    
    currentSegments.forEach((segment, i) => {
        // Crear path del segmento
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createSegmentPath(i, totalSegments));
        path.setAttribute('fill', segment.color);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', totalSegments > 40 ? '1.5' : '2');
        path.classList.add('segment');
        
        if (selectable) {
            path.classList.add('selectable');
            path.addEventListener('click', () => toggleSegment(segment, elementsArray));
        }
        
        svg.appendChild(path);
        
        // Crear textos
        const texts = createSegmentTexts(i, segment.value, segment.label, totalSegments);
        texts.forEach(text => svg.appendChild(text));
        
        // Guardar referencias
        elementsArray.push({
            path: path,
            segment: segment,
            texts: texts
        });
    });
}

/**
 * Alterna la selección de un segmento
 * @param {Object} segment - Segmento a alternar
 * @param {Array} elementsArray - Array de elementos
 */
function toggleSegment(segment, elementsArray) {
    const element = elementsArray.find(el => el.segment.value === segment.value);
    if (!element) return;
    
    if (selectedSegments.has(segment.value)) {
        selectedSegments.delete(segment.value);
        element.texts.forEach(text => text.classList.remove('selected'));
    } else {
        selectedSegments.add(segment.value);
        element.texts.forEach(text => text.classList.add('selected'));
    }
    
    updateFnDisplay();
}

/**
 * Actualiza la visualización de valores seleccionados en Fn
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
 * Limpia todas las selecciones y resultados
 */
function clearSelection() {
    selectedSegments.clear();
    
    [fnElements, tnElements, tniElements].forEach(group => {
        group.forEach(element => {
            element.texts.forEach(text => {
                text.classList.remove('selected', 'highlighted-yellow', 'highlighted-red');
            });
        });
    });
    
    document.getElementById('fnValues').textContent = '-';
    document.getElementById('tnValues').textContent = '-';
    document.getElementById('tniValues').textContent = '-';
}

/**
 * Muestra el resultado de la transposición
 * @param {Array} resultArray - Array con valores transpuestos
 */
function displayTransposition(resultArray) {
    // Limpiar highlights previos
    tnElements.forEach(element => {
        element.texts.forEach(text => text.classList.remove('highlighted-yellow'));
    });
    
    // Aplicar nuevos highlights
    resultArray.forEach(value => {
        const element = tnElements.find(el => el.segment.value === value);
        if (element) {
            element.texts.forEach(text => text.classList.add('highlighted-yellow'));
        }
    });
    
    document.getElementById('tnValues').textContent = 
        resultArray.length > 0 ? resultArray.join(', ') : '-';
}

/**
 * Muestra el resultado de la inversión
 * @param {Array} resultArray - Array con valores invertidos
 */
function displayInversion(resultArray) {
    // Limpiar highlights previos
    tniElements.forEach(element => {
        element.texts.forEach(text => text.classList.remove('highlighted-red'));
    });
    
    // Aplicar nuevos highlights
    resultArray.forEach(value => {
        const element = tniElements.find(el => el.segment.value === value);
        if (element) {
            element.texts.forEach(text => text.classList.add('highlighted-red'));
        }
    });
    
    document.getElementById('tniValues').textContent = 
        resultArray.length > 0 ? resultArray.join(', ') : '-';
}

/**
 * Maneja el evento de submit (botón Bang)
 */
function handleSubmit() {
    const values = Array.from(selectedSegments).sort((a, b) => a - b);
    
    if (values.length === 0) {
        alert('Por favor selecciona al menos un segmento');
        return;
    }
    
    // Usar variables globales de temperament-operations.js
    originalSet = values.slice();
    normalForm = calculateNormalForm(originalSet, temperament);
    
    const transInput = document.getElementById('transpositionInput');
    const invInput = document.getElementById('inversionInput');
    
    currentTransposition = parseInt(transInput.value, 10) || 0;
    currentInversion = parseInt(invInput.value, 10) || 0;
    
    const transposeValue = mod(currentTransposition, temperament);
    const invertValue = mod(currentInversion, temperament);
    
    const transposed = transpose(normalForm, transposeValue, temperament);
    const inverted = invert(normalForm, invertValue, temperament);
    
    displayTransposition(transposed);
    displayInversion(inverted);
}

/**
 * Cambia el temperamento activo y reinicializa los círculos
 * @param {number} newTemperament - Nuevo temperamento
 */
function changeTemperament(newTemperament) {
    console.log(`Cambiando a temperamento: ${newTemperament}`);
    
    // Obtener segmentos para el nuevo temperamento
    currentSegments = getSegmentsForTemperament(newTemperament);
    console.log(`Segmentos cargados: ${currentSegments.length}`);
    
    if (currentSegments.length === 0) {
        console.error(`No se encontraron segmentos para temperamento ${newTemperament}`);
        return;
    }
    
    // Actualizar temperamento en operations
    setTemperament(newTemperament);
    
    // Limpiar selecciones
    selectedSegments.clear();
    
    // Reinicializar círculos
    initCircle('fnSvg', fnElements, true);
    initCircle('tnSvg', tnElements, false);
    initCircle('tniSvg', tniElements, false);
    
    clearSelection();
}

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando Sistema de Círculos...');
    
    // Validar dependencias
    if (!validateDependencies()) {
        console.error('No se puede inicializar: faltan dependencias');
        return;
    }
    
    // Configurar temperamento inicial
    const temperamentSelect = document.getElementById('temperamentSelect');
    if (!temperamentSelect) {
        console.error('ERROR: No se encontró el selector de temperamento');
        return;
    }
    
    const initialTemperament = parseInt(temperamentSelect.value, 10);
    console.log(`Temperamento inicial: ${initialTemperament}`);
    
    changeTemperament(initialTemperament);
    
    // Event listeners
    temperamentSelect.addEventListener('change', function() {
        changeTemperament(parseInt(this.value, 10));
    });
    
    const bangBtn = document.getElementById('bangBtn');
    if (bangBtn) {
        bangBtn.addEventListener('click', handleSubmit);
    } else {
        console.error('ERROR: No se encontró el botón Bang');
    }
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelection);
    } else {
        console.error('ERROR: No se encontró el botón Limpiar');
    }
    
    console.log('Sistema de Círculos inicializado correctamente');
});