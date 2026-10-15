/**
 * tests/temperament-operations.test.js
 * Comprehensive unit test suite for microtonal Pitch Class Set Theory operations and configurations.
 * Uses Node.js native test runner (node:test) and strict assertions (node:assert/strict).
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const Operations = require('../js/temperament-operations.js');
const Data = require('../js/temperament-data.js');
const { getFontConfigForTemperament } = require('../js/circle_renderer.js');

const {
    mod,
    removeDuplicatesAndSort,
    calculateNormalForm,
    transpose,
    invert,
    calculateIntervalVector,
    setTemperament
} = Operations;

const {
    TEMPERAMENT_CONFIGS,
    getTemperamentConfig,
    getSegmentsForTemperament,
    getTemperamentName,
    getTemperamentDescription,
    getAvailableTemperaments,
    isTemperamentSupported,
    isValidPitchClass,
    validatePitchClass
} = Data;

describe('1. Modulo Arithmetic (mod)', () => {
    it('handles positive numbers and zero correctly', () => {
        assert.equal(mod(0, 19), 0);
        assert.equal(mod(5, 19), 5);
        assert.equal(mod(18, 19), 18);
        assert.equal(mod(19, 19), 0);
        assert.equal(mod(20, 19), 1);
        assert.equal(mod(38, 19), 0);
    });

    it('handles negative numbers correctly across different temperaments', () => {
        assert.equal(mod(-1, 19), 18);
        assert.equal(mod(-19, 19), 0);
        assert.equal(mod(-20, 19), 18);
        assert.equal(mod(-5, 31), 26);
        assert.equal(mod(-41, 41), 0);
        assert.equal(mod(-2, 53), 51);
    });

    it('handles edge cases safely without throwing', () => {
        assert.equal(mod(5, 0), 0);
        assert.equal(mod(5, NaN), 0);
        assert.equal(mod(-0, 19), 0);
    });
});

describe('2. Sanitization & Sorting (removeDuplicatesAndSort)', () => {
    it('returns empty array for empty or invalid inputs', () => {
        assert.deepEqual(removeDuplicatesAndSort([]), []);
        assert.deepEqual(removeDuplicatesAndSort(null), []);
        assert.deepEqual(removeDuplicatesAndSort(undefined), []);
        assert.deepEqual(removeDuplicatesAndSort('not-an-array'), []);
    });

    it('removes duplicates and sorts ascending', () => {
        assert.deepEqual(removeDuplicatesAndSort([5, 2, 5, 8, 2, 0]), [0, 2, 5, 8]);
    });

    it('normalizes modulo when modulo parameter is supplied', () => {
        // -1 mod 19 = 18, 20 mod 19 = 1
        assert.deepEqual(removeDuplicatesAndSort([-1, 20, 5, 0], 19), [0, 1, 5, 18]);
    });

    it('filters out non-numeric values and NaNs', () => {
        assert.deepEqual(removeDuplicatesAndSort([10, NaN, 'foo', null, 3]), [3, 10]);
    });
});

describe('3. John Rahn Normal Form (calculateNormalForm)', () => {
    it('handles trivial sets (empty and single pitch)', () => {
        assert.deepEqual(calculateNormalForm([], 19), []);
        assert.deepEqual(calculateNormalForm([7], 19), [7]);
        assert.deepEqual(calculateNormalForm([26], 31), [26]);
    });

    it('computes standard diatonic triad normal form in 12-TET', () => {
        // Diatonic major triad C-E-G in 12-TET: C=0, E=4, G=7
        assert.deepEqual(calculateNormalForm([7, 0, 4], 12), [0, 4, 7]);
        assert.deepEqual(calculateNormalForm([4, 7, 0], 12), [0, 4, 7]);
    });

    it('computes standard diatonic triad normal form in 19-TET', () => {
        // C=0, E=6, G=11 in 19-TET.
        // Rotations: [0,6,11] span 11; [6,11,0] span 13; [11,0,6] span 14.
        assert.deepEqual(calculateNormalForm([11, 0, 6], 19), [0, 6, 11]);
        assert.deepEqual(calculateNormalForm([6, 11, 0], 19), [0, 6, 11]);
    });

    it('resolves tie-breakers strictly using canonical Rahn rule in 19-TET', () => {
        // Constructed 19-TET set: {0, 1, 7, 8, 14}
        // Cyclic rotations:
        // R2: [7, 8, 14, 0, 1] -> span = (1 - 7) mod 19 = 13.
        //     k=3: (0 - 7) mod 19 = 12.
        //     k=2: (14 - 7) mod 19 = 7.
        // R4: [14, 0, 1, 7, 8] -> span = (8 - 14) mod 19 = 13.
        //     k=3: (7 - 14) mod 19 = 12.
        //     k=2: (1 - 14) mod 19 = 6.
        // At k=2, R4 has interval 6 < 7 of R2. R4 wins!
        const set19 = [0, 1, 7, 8, 14];
        assert.deepEqual(calculateNormalForm(set19, 19), [14, 0, 1, 7, 8]);
    });

    it('computes normal form correctly in 22-TET', () => {
        // Diatonic major triad C-E-G in 22-TET: C=0, E=8, G=13
        // [0, 8, 13] span 13.
        // [8, 13, 0] span (0 - 8) mod 22 = 14.
        // [13, 0, 8] span (8 - 13) mod 22 = 17.
        assert.deepEqual(calculateNormalForm([13, 8, 0], 22), [0, 8, 13]);
    });

    it('computes normal form correctly in 24-TET', () => {
        // Diatonic major triad C-E-G in 24-TET: C=0, E=8, G=14
        // [0, 8, 14] span 14.
        // [8, 14, 0] span (0 - 8) mod 24 = 16.
        // [14, 0, 8] span (8 - 14) mod 24 = 18.
        assert.deepEqual(calculateNormalForm([14, 0, 8], 24), [0, 8, 14]);
    });

    it('computes normal form correctly in 31-TET', () => {
        // Diatonic major triad C-E-G in 31-TET: C=0, E=10, G=18
        // [0, 10, 18] has span 18.
        // [10, 18, 0] has span (0 - 10) mod 31 = 21.
        // [18, 0, 10] has span (10 - 18) mod 31 = 23.
        assert.deepEqual(calculateNormalForm([18, 10, 0], 31), [0, 10, 18]);
    });

    it('computes normal form correctly in 41-TET', () => {
        // Diatonic major triad C-E-G in 41-TET: C=0, E=14, G=24
        // [0, 14, 24] span 24.
        assert.deepEqual(calculateNormalForm([24, 0, 14], 41), [0, 14, 24]);
    });

    it('computes normal form correctly in 53-TET', () => {
        // Diatonic major triad C-E-G in 53-TET: C=0, E=18, G=31
        // [0, 18, 31] span 31.
        assert.deepEqual(calculateNormalForm([31, 18, 0], 53), [0, 18, 31]);
    });

    it('resolves fully symmetrical chords by selecting rotation with lowest initial pitch', () => {
        // Complete aggregate in 19-TET: all rotations have identical interval profiles
        const full19 = Array.from({ length: 19 }, (_, i) => i);
        const permuted = full19.slice(5).concat(full19.slice(0, 5));
        assert.deepEqual(calculateNormalForm(permuted, 19), full19);
    });
});

describe('4. Transposition (transpose)', () => {
    it('transposes pitch classes pure and sorted in 19-TET', () => {
        assert.deepEqual(transpose([0, 6, 11], 3, 19), [3, 9, 14]);
    });

    it('wraps around octave correctly', () => {
        // (0+15)%19=15, (6+15)%19=2, (11+15)%19=7 => sorted: [2, 7, 15]
        assert.deepEqual(transpose([0, 6, 11], 15, 19), [2, 7, 15]);
    });

    it('handles negative intervals cleanly', () => {
        // -2 mod 19 = 17 => (0+17)%19=17, (6+17)%19=4, (11+17)%19=9 => [4, 9, 17]
        assert.deepEqual(transpose([0, 6, 11], -2, 19), [4, 9, 17]);
    });

    it('handles transpositions across 12, 22, 24, 31, 41, 53-TET', () => {
        assert.deepEqual(transpose([0, 4, 7], 2, 12), [2, 6, 9]);
        assert.deepEqual(transpose([0, 8, 13], 5, 22), [5, 13, 18]);
        assert.deepEqual(transpose([0, 8, 14], 6, 24), [6, 14, 20]);
        assert.deepEqual(transpose([0, 10, 18], 20, 31), [7, 20, 30]);
        assert.deepEqual(transpose([0, 14, 24], 30, 41), [3, 13, 30]);
        assert.deepEqual(transpose([0, 18, 31], 40, 53), [5, 18, 40]);
    });
});

describe('5. Inversion (invert)', () => {
    it('inverts around index 0 (I_0) cleanly in 19-TET', () => {
        // (0 - 0)%19 = 0, (0 - 6)%19 = 13, (0 - 11)%19 = 8 => [0, 8, 13]
        assert.deepEqual(invert([0, 6, 11], 0, 19), [0, 8, 13]);
    });

    it('inverts around arbitrary indices (I_n)', () => {
        // (5 - 0)%19 = 5, (5 - 6)%19 = 18, (5 - 11)%19 = 13 => [5, 13, 18]
        assert.deepEqual(invert([0, 6, 11], 5, 19), [5, 13, 18]);
    });

    it('handles inversions in 12, 22, 24, 31, 41, 53-TET', () => {
        // 12-TET: I_0 of [0, 4, 7] -> (0-0)%12=0, (0-4)%12=8, (0-7)%12=5 => [0, 5, 8]
        assert.deepEqual(invert([0, 4, 7], 0, 12), [0, 5, 8]);

        // 22-TET: I_0 of [0, 8, 13] -> (0-0)%22=0, (0-8)%22=14, (0-13)%22=9 => [0, 9, 14]
        assert.deepEqual(invert([0, 8, 13], 0, 22), [0, 9, 14]);

        // 24-TET: I_0 of [0, 8, 14] -> (0-0)%24=0, (0-8)%24=16, (0-14)%24=10 => [0, 10, 16]
        assert.deepEqual(invert([0, 8, 14], 0, 24), [0, 10, 16]);

        // 31-TET: I_0 of [0, 10, 18] -> (0-0)%31=0, (0-10)%31=21, (0-18)%31=13 => [0, 13, 21]
        assert.deepEqual(invert([0, 10, 18], 0, 31), [0, 13, 21]);

        // 41-TET: I_0 of [0, 14, 24] -> (0-0)%41=0, (0-14)%41=27, (0-24)%41=17 => [0, 17, 27]
        assert.deepEqual(invert([0, 14, 24], 0, 41), [0, 17, 27]);

        // 53-TET: I_0 of [0, 18, 31] -> (0-0)%53=0, (0-18)%53=35, (0-31)%53=22 => [0, 22, 35]
        assert.deepEqual(invert([0, 18, 31], 0, 53), [0, 22, 35]);
    });
});

describe('6. Interval Vector (calculateIntervalVector)', () => {
    it('returns empty array for invalid or sub-dyad inputs', () => {
        assert.deepEqual(calculateIntervalVector([], 19), []);
        assert.deepEqual(calculateIntervalVector([5], 19), []);
    });

    it('calculates exact interval vector length floor(temp / 2) for all 7 temperaments', () => {
        assert.equal(calculateIntervalVector([0, 1], 12).length, 6);
        assert.equal(calculateIntervalVector([0, 1], 19).length, 9);
        assert.equal(calculateIntervalVector([0, 1], 22).length, 11);
        assert.equal(calculateIntervalVector([0, 1], 24).length, 12);
        assert.equal(calculateIntervalVector([0, 1], 31).length, 15);
        assert.equal(calculateIntervalVector([0, 1], 41).length, 20);
        assert.equal(calculateIntervalVector([0, 1], 53).length, 26);
    });

    it('computes exact interval vector for C-major triad in 12-TET, 22-TET, and 24-TET', () => {
        // 12-TET: [0, 4, 7] -> length 6: [0, 0, 1, 1, 1, 0]
        const vec12 = calculateIntervalVector([0, 4, 7], 12);
        assert.deepEqual(vec12, [0, 0, 1, 1, 1, 0]);
        assert.equal(vec12.reduce((sum, n) => sum + n, 0), 3);

        // 22-TET: [0, 8, 13] -> length 11: [0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]
        const vec22 = calculateIntervalVector([0, 8, 13], 22);
        assert.deepEqual(vec22, [0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]);
        assert.equal(vec22.reduce((sum, n) => sum + n, 0), 3);

        // 24-TET: [0, 8, 14] -> length 12: [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0]
        const vec24 = calculateIntervalVector([0, 8, 14], 24);
        assert.deepEqual(vec24, [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0]);
        assert.equal(vec24.reduce((sum, n) => sum + n, 0), 3);
    });

    it('computes exact interval vector counts for a triad in 19-TET', () => {
        // [0, 6, 11] in 19-TET:
        // (0, 6): interval 6
        // (6, 11): interval 5
        // (0, 11): interval 11 > 9.5 -> 19 - 11 = 8
        // ic_5=1, ic_6=1, ic_8=1, others=0
        const vec = calculateIntervalVector([0, 6, 11], 19);
        assert.deepEqual(vec, [0, 0, 0, 0, 1, 1, 0, 1, 0]);
        assert.equal(vec.reduce((sum, n) => sum + n, 0), 3);
    });

    it('verifies that total interval count equals n*(n-1)/2', () => {
        const pentad = [0, 5, 12, 23, 30]; // 5 notes in 31-TET
        const vec = calculateIntervalVector(pentad, 31);
        const totalPairs = (5 * 4) / 2; // 10
        assert.equal(vec.reduce((sum, n) => sum + n, 0), totalPairs);
    });
});

describe('7. Temperament Data Consistency (temperament-data.js)', () => {
    it('protects TEMPERAMENT_CONFIGS from mutation via deepFreeze', () => {
        assert.ok(Object.isFrozen(TEMPERAMENT_CONFIGS));
        [12, 19, 22, 24, 31, 41, 53].forEach(div => {
            assert.ok(Object.isFrozen(TEMPERAMENT_CONFIGS[div]), `${div}-TET config must be frozen`);
            assert.ok(Object.isFrozen(TEMPERAMENT_CONFIGS[div].segments), `${div}-TET segments array must be frozen`);
            assert.ok(Object.isFrozen(TEMPERAMENT_CONFIGS[div].segments[0]), `${div}-TET segment item must be frozen`);
        });
    });

    it('supports all 7 documented equal temperaments (12, 19, 22, 24, 31, 41, 53)', () => {
        const expected = [12, 19, 22, 24, 31, 41, 53];
        expected.forEach(div => {
            assert.ok(isTemperamentSupported(div), `${div}-TET must be supported`);
            const config = getTemperamentConfig(div);
            assert.ok(config, `Config for ${div} must exist`);
            assert.equal(config.segments.length, div, `Segment count must match ${div}`);
        });
    });

    it('ensures all segments have valid values, colors, and structure', () => {
        const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
        [12, 19, 22, 24, 31, 41, 53].forEach(div => {
            const segments = getSegmentsForTemperament(div);
            assert.equal(segments.length, div);
            segments.forEach((seg, idx) => {
                assert.equal(seg.value, idx, `Segment value at index ${idx} must equal ${idx}`);
                assert.ok(hexColorRegex.test(seg.color), `Color ${seg.color} must be valid 6-char hex`);
            });
        });
    });

    it('places natural diatonic notes (C, D, E, F, G, A, B) at canonical degree indices', () => {
        const canonicalNotes = {
            12: { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 },
            19: { C: 0, D: 3, E: 6, F: 8, G: 11, A: 14, B: 17 },
            22: { C: 0, D: 4, E: 8, F: 9, G: 13, A: 17, B: 21 },
            24: { C: 0, D: 4, E: 8, F: 10, G: 14, A: 18, B: 22 },
            31: { C: 0, D: 5, E: 10, F: 13, G: 18, A: 23, B: 28 },
            41: { C: 0, D: 7, E: 14, F: 17, G: 24, A: 31, B: 38 },
            53: { C: 0, D: 9, E: 18, F: 22, G: 31, A: 40, B: 49 }
        };

        Object.entries(canonicalNotes).forEach(([tempStr, notes]) => {
            const temp = parseInt(tempStr, 10);
            const segments = getSegmentsForTemperament(temp);
            const labeledSegments = {};
            segments.forEach(s => {
                if (s.label) {
                    labeledSegments[s.label] = s.value;
                }
            });

            assert.deepEqual(
                labeledSegments,
                notes,
                `Natural note labels in ${temp}-TET must match canonical diatonic positions`
            );
        });
    });

    it('correctly maps chromatic and microtonal colors in 12-TET, 22-TET, and 24-TET', () => {
        // 12-TET
        const segs12 = getSegmentsForTemperament(12);
        const blue12 = segs12.filter(s => s.color === '#4a90e2').map(s => s.value);
        assert.deepEqual(blue12, [1, 3, 6, 8, 10]);

        // 22-TET
        const segs22 = getSegmentsForTemperament(22);
        const blue22 = segs22.filter(s => s.color === '#4a90e2').map(s => s.value);
        const black22 = segs22.filter(s => s.color === '#000000').map(s => s.value);
        assert.deepEqual(blue22, [2, 6, 11, 15, 19]);
        assert.deepEqual(black22, [1, 3, 5, 7, 10, 12, 14, 16, 18, 20]);

        // 24-TET
        const segs24 = getSegmentsForTemperament(24);
        const blue24 = segs24.filter(s => s.color === '#4a90e2').map(s => s.value);
        const black24 = segs24.filter(s => s.color === '#000000').map(s => s.value);
        assert.deepEqual(blue24, [2, 6, 12, 16, 20]);
        assert.deepEqual(black24, [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]);
    });

    it('validates pitch class helper functions', () => {
        assert.equal(isValidPitchClass(0, 19), true);
        assert.equal(isValidPitchClass(18, 19), true);
        assert.equal(isValidPitchClass(19, 19), false);
        assert.equal(isValidPitchClass(-1, 19), false);
        assert.equal(isValidPitchClass(3.5, 19), false);
        assert.equal(isValidPitchClass(10, 999), false);

        assert.equal(validatePitchClass(10, 19), 10);
        assert.throws(() => validatePitchClass(25, 19), RangeError);
    });
});

describe('8. Typography Dynamic Scaling (circle_renderer.js)', () => {
    it('scales typography appropriately across all supported temperaments', () => {
        const cfg12 = getFontConfigForTemperament(12);
        assert.equal(cfg12.numberSize, '14');
        assert.equal(cfg12.labelSize, '15');

        const cfg19 = getFontConfigForTemperament(19);
        assert.equal(cfg19.numberSize, '13');
        assert.equal(cfg19.labelSize, '14');

        const cfg22 = getFontConfigForTemperament(22);
        assert.equal(cfg22.numberSize, '12');
        assert.equal(cfg22.labelSize, '13');

        const cfg24 = getFontConfigForTemperament(24);
        assert.equal(cfg24.numberSize, '12');
        assert.equal(cfg24.labelSize, '13');

        const cfg31 = getFontConfigForTemperament(31);
        assert.equal(cfg31.numberSize, '11');
        assert.equal(cfg31.labelSize, '12');

        const cfg41 = getFontConfigForTemperament(41);
        assert.equal(cfg41.numberSize, '9.5');
        assert.equal(cfg41.labelSize, '10');

        const cfg53 = getFontConfigForTemperament(53);
        assert.equal(cfg53.numberSize, '8.5');
        assert.equal(cfg53.labelSize, '9');
    });
});
