/**
 * Enforce protocol: merge and create automatic pattern parsing, force engraving
 * to physical space using Hz wave. Fluctuations form engravings automatically
 * from the will of voice when invocations are detected in the space.
 */
/** Predefined 2D glyphs (vertices in unit square) for each pattern id */
const PATTERN_GLYPHS = {
    pattern_default: [[0, 0], [1, 0], [0.5, 1], [0, 0]],
    pattern_manifest: [[0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    pattern_bind: [[0, 0], [1, 1], [0, 1], [1, 0], [0, 0]],
    pattern_shield: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5], [0.5, 0]],
    pattern_reveal: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
    pattern_seal: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5], [0.5, 0]],
    pattern_open: [[0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    pattern_ward: [[0, 0], [0.5, 0.5], [0, 1], [0.5, 0.5], [1, 0.5], [0.5, 0.5]],
    pattern_flow: [[0, 0.5], [0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]],
};
export class EnforceProtocol {
    engraveScale;
    dominantHzFromState(state) {
        let best = 0;
        let hz = 440;
        for (const b of state.bands) {
            const score = b.amplitude * b.constructive;
            if (score > best) {
                best = score;
                hz = b.hz;
            }
        }
        return hz;
    }
    constructor(engraveScale = 1.0) {
        this.engraveScale = engraveScale;
    }
    /**
     * Merge invocation intent with current wave state and force-engrave to physical space.
     * Uses Hz wave to form the engraving; enforces high reality tear from internal system
     * to manifest state in real-world matter / surrounding mass.
     */
    mergeAndEngrave(intent, waveState, origin3D, normal3D = [0, 1, 0]) {
        const glyph = PATTERN_GLYPHS[intent.patternId] ?? PATTERN_GLYPHS.pattern_default;
        const vertices2D = glyph.map(([u, v]) => [
            (u - 0.5) * this.engraveScale,
            (v - 0.5) * this.engraveScale,
        ]);
        const engraveHz = this.dominantHzFromState(waveState);
        const fluctuationAtEngrave = waveState.fluctuation;
        const pattern = {
            id: intent.patternId,
            vertices2D,
            origin3D,
            normal3D,
            engraveHz,
            fluctuationAtEngrave,
            timestamp: waveState.timestamp,
        };
        const realityTear = Math.min(1, intent.confidence * (1 + fluctuationAtEngrave) * (intent.energySignature[0] ?? 0.5));
        return { pattern, realityTear };
    }
    /** Batch: multiple intents merged and engraved at same origin. */
    mergeAndEngraveBatch(intents, waveState, origin3D, normal3D = [0, 1, 0]) {
        return intents.map((intent) => this.mergeAndEngrave(intent, waveState, origin3D, normal3D));
    }
}
