/**
 * Timeline derivation logic has moved to the backend (ScoringEngine.ts).
 * The frontend Timeline component now reads `role` and `causal_position`
 * directly from the API response — no client-side derivation needed.
 *
 * These tests validate the remaining client-side helper: the causal-path
 * label insertion logic used inside Timeline.jsx, exercised here as a
 * pure function extracted for testability.
 */
import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Helper: mirrors the firstCausalId + hasCausalChain logic in Timeline.jsx
// so we can test it without rendering.
// ---------------------------------------------------------------------------

function getCausalPathInfo(eventsWithScores) {
    const causalItems = (eventsWithScores ?? []).filter(
        item => item.causal_position != null
    );
    const hasCausalChain = causalItems.length >= 2;
    const firstCausalItem = hasCausalChain
        ? causalItems.reduce((min, item) =>
            item.causal_position < min.causal_position ? item : min
        )
        : null;
    return {
        hasCausalChain,
        firstCausalId: firstCausalItem?.event?.id ?? null,
    };
}

function makeItem(id, role = null, causalPosition = null) {
    return { event: { id }, role, causal_position: causalPosition };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Timeline causal path label logic', () => {
    it('hasCausalChain is false when no items have a causal_position', () => {
        const items = [makeItem('a'), makeItem('b'), makeItem('c')];
        const { hasCausalChain } = getCausalPathInfo(items);
        expect(hasCausalChain).toBe(false);
    });

    it('hasCausalChain is false when only one item has a causal_position', () => {
        const items = [makeItem('a', 'primary', 1), makeItem('b')];
        const { hasCausalChain } = getCausalPathInfo(items);
        expect(hasCausalChain).toBe(false);
    });

    it('hasCausalChain is true when two or more items have a causal_position', () => {
        const items = [
            makeItem('a', 'primary', 1),
            makeItem('b', 'contributing', 2),
        ];
        const { hasCausalChain } = getCausalPathInfo(items);
        expect(hasCausalChain).toBe(true);
    });

    it('firstCausalId points to the item with the lowest causal_position', () => {
        const items = [
            makeItem('a', 'contributing', 2),
            makeItem('b', 'primary', 1),
            makeItem('c', 'contributing', 3),
        ];
        const { firstCausalId } = getCausalPathInfo(items);
        expect(firstCausalId).toBe('b');
    });

    it('firstCausalId is null when there is no causal chain', () => {
        const items = [makeItem('a'), makeItem('b')];
        const { firstCausalId } = getCausalPathInfo(items);
        expect(firstCausalId).toBeNull();
    });

    it('handles empty array gracefully', () => {
        const { hasCausalChain, firstCausalId } = getCausalPathInfo([]);
        expect(hasCausalChain).toBe(false);
        expect(firstCausalId).toBeNull();
    });

    it('handles null input gracefully', () => {
        const { hasCausalChain, firstCausalId } = getCausalPathInfo(null);
        expect(hasCausalChain).toBe(false);
        expect(firstCausalId).toBeNull();
    });
});

describe('smoke test', () => {
    it('test infrastructure is working', () => {
        expect(true).toBe(true);
    });
});
