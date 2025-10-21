# Generador de Círculos - Conjuntos de Clases de Alturas

Sistema interactivo para visualización y manipulación de conjuntos de clases de alturas en múltiples temperamentos iguales.

## Descripción

Herramienta educativa y de análisis musical que permite trabajar con operaciones de teoría de conjuntos (transposición e inversión) en diferentes temperamentos iguales. Ideal para compositores, teóricos musicales y estudiantes de música contemporánea.

## Características

- **Múltiples temperamentos**: Soporte para 19-TET, 31-TET, 41-TET y 53-TET
- **Operaciones de teoría de conjuntos**:
  - Cálculo automático de forma normal
  - Transposición (Tn)
  - Inversión (TnI)
- **Interfaz visual interactiva**:
  - Tres círculos sincronizados (Fn, Tn, TnI)
  - Selección intuitiva mediante clicks
  - Identificación visual de notas naturales (C, D, E, F, G, A, B)
  - Código de colores por tipo de grado
- **Sin dependencias externas**: Funciona completamente en el navegador

## Uso

### Instalación

No requiere instalación. Simplemente clona el repositorio y abre `index.html` en tu navegador:

```bash
git clone https://github.com/tu-usuario/generadorCirculosConjuntosDeClasesTx.git
cd generadorCirculosConjuntosDeClasesTx
```

Luego abre `index.html` en tu navegador web.

### Guía de uso

1. **Seleccionar temperamento**: Usa el selector desplegable para elegir entre 19, 31, 41 o 53 divisiones por octava

2. **Seleccionar notas**: Haz click en los segmentos del círculo **Fn** para construir tu conjunto de alturas

3. **Configurar transformaciones**:
   - Ajusta el valor de **Transposición (T)**
   - Ajusta el valor de **Inversión (I)**

4. **Calcular resultados**: Presiona el botón **Bang** para ver:
   - Círculo **Tn** (amarillo): resultado de la transposición
   - Círculo **TnI** (rojo): resultado de la inversión

5. **Limpiar**: Usa **Limpiar selección** para reiniciar

## Teoría Musical

### Operaciones Implementadas

- **Forma Normal (Fn)**: Representación canónica del conjunto que minimiza el intervalo entre la primera y última nota
- **Transposición (Tn)**: `Tn(x) = (x + n) mod T`
- **Inversión (TnI)**: `TnI(x) = (n - x) mod T`

Donde `T` es el número de divisiones del temperamento.

### Los Temperamentos

#### 19-TET
- **Grado**: ~63.16 cents
- **Aproxima**: tercera mayor justa
- **Uso histórico**: Guillaume Costeley (s. XVI)

#### 31-TET
- **Grado**: ~38.71 cents
- **Aproxima**: sistema de Huygens-Fokker
- **Precisión**: excelente para quintas y terceras

#### 41-TET
- **Grado**: ~29.27 cents
- **Características**: microtonal avanzado
- **Uso**: música experimental contemporánea

#### 53-TET
- **Grado**: ~22.64 cents
- **Aproxima**: sistema de Jing Fang/Mercator
- **Precisión**: extraordinaria para intervalos justos

## Código de Colores

- **Gris claro** (#e0e0e0): Notas naturales (C, D, E, F, G, A, B)
- **Azul** (#4a90e2): Grados cromáticos principales
- **Negro** (#000000): Grados microtonales
- **Verde** (#6fb369): Grados microtonales adicionales (solo 53-TET)
- **Violeta** (#c878ff): Selección activa
- **Amarillo** (#FFD700): Resultado de transposición
- **Rojo** (#FF4444): Resultado de inversión

## Roadmap

### v1.1 (Planeado)
- [ ] Más temperamentos
- [ ] Exportar/importar conjuntos en formato JSON
- [ ] Historial de operaciones con deshacer/rehacer
- [ ] Presets de acordes comunes
- [ ] Modo oscuro/claro
- [ ] Análisis de vectores interválicos
- [ ] Comparación lado a lado de temperamentos
- [ ] Calculadora de relaciones entre conjuntos
- [ ] Exportación a notación musical
- [ ] Integración con DAWs vía Web MIDI API / OSC websocket
