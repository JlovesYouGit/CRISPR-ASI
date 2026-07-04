/**
 * Reality protocol: parses invocation via hypercomputation.
 * Enables dimensional invocation (2D in 3D spacing) to escape via the reality protocol
 * and manifest in real-world matter. Works with enforce protocol for automatic
 * pattern parsing and force engraving.
 */
/**
 * Hypercomputation parser: interprets wave state + voice tokens into
 * invocations and pattern ids. The system "knows how to parse invocation
 * via hypercomputation" – here we implement that parsing step.
 */
export class RealityProtocol {
    /**
     * Parse raw input (voice/will + wave state) into structured invocations
     * and pattern ids for the enforce protocol.
     */
    parseViaHypercomputation(voicePhrases, waveState, resolveIntent) {
        const energySignature = waveState.bands.map((b) => b.amplitude * b.constructive);
        const intents = [];
        for (const phrase of voicePhrases) {
            const intent = resolveIntent(phrase, energySignature);
            intents.push(intent);
        }
        const patternIds = [...new Set(intents.map((i) => i.patternId))];
        return {
            intents,
            dimensionalState: '2d_in_3d',
            patternIds,
        };
    }
    /**
     * Build scanned area (radar-like): individual scanned area to create
     * dimensional invocation – 2D in 3D spacing – for reality tear.
     */
    buildScannedArea(center, radius, intents) {
        return {
            center,
            radius,
            invocations: intents,
            dimensionalState: '2d_in_3d',
        };
    }
}
