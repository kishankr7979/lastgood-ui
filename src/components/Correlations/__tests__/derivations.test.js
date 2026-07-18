/**
 * Correlations derivation logic (getHighestValidConfidence, getCorrelationStatus)
 * has moved to the backend (ScoringEngine.ts). Those values are now returned
 * directly by the API as `highest_confidence` and `correlation_status`.
 *
 * The one remaining client-side helper is `getConfidenceColor`, which maps
 * a numeric confidence value to Tailwind color classes. That's pure
 * presentation logic and stays in the frontend.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getConfidenceColor } from '../Correlations.jsx';

// ---------------------------------------------------------------------------
// getConfidenceColor
// ---------------------------------------------------------------------------

describe('getConfidenceColor', () => {
    it('returns green palette for value >= 80', () => {
        const result = getConfidenceColor(80);
        expect(result.text).toContain('green');
        expect(result.bg).toContain('green');
        expect(result.border).toContain('green');
    });

    it('returns green palette for value = 100', () => {
        expect(getConfidenceColor(100).text).toContain('green');
    });

    it('returns green palette for value = 95', () => {
        expect(getConfidenceColor(95).text).toContain('green');
    });

    it('returns yellow palette for value = 50', () => {
        const result = getConfidenceColor(50);
        expect(result.text).toContain('yellow');
        expect(result.bg).toContain('yellow');
        expect(result.border).toContain('yellow');
    });

    it('returns yellow palette for value = 79', () => {
        expect(getConfidenceColor(79).text).toContain('yellow');
    });

    it('returns yellow palette for value = 65', () => {
        expect(getConfidenceColor(65).text).toContain('yellow');
    });

    it('returns red palette for value < 50', () => {
        const result = getConfidenceColor(49);
        expect(result.text).toContain('red');
        expect(result.bg).toContain('red');
        expect(result.border).toContain('red');
    });

    it('returns red palette for value = 0', () => {
        expect(getConfidenceColor(0).text).toContain('red');
    });

    it('returns red palette for value = 25', () => {
        expect(getConfidenceColor(25).text).toContain('red');
    });

    it('returns object with text, bg, and border keys', () => {
        const result = getConfidenceColor(75);
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('bg');
        expect(result).toHaveProperty('border');
    });

    // Property 7: Confidence color thresholds are exhaustive and non-overlapping.
    it('Property 7: every integer in [0, 100] maps to exactly one color family', () => {
        fc.assert(
            fc.property(fc.integer({ min: 0, max: 100 }), (value) => {
                const result = getConfidenceColor(value);
                const isGreen = result.text.includes('green');
                const isYellow = result.text.includes('yellow');
                const isRed = result.text.includes('red');

                // Exactly one color family
                const count = [isGreen, isYellow, isRed].filter(Boolean).length;
                if (count !== 1) return false;

                // Correct threshold mapping
                if (value >= 80) return isGreen;
                if (value >= 50) return isYellow;
                return isRed;
            })
        );
    });
});

describe('smoke test', () => {
    it('test infrastructure is working', () => {
        expect(true).toBe(true);
    });
});
