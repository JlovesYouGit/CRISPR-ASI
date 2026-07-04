/**
 * Fluctuation detection: measures dimensional space wave states by band wave
 * interpreted constructive. Drives materialising invocation (emotions/energy
 * surrounding matter and states).
 */
export class FluctuationDetector {
    windowSize;
    buffer = [];
    constructor(windowSize = 16) {
        this.windowSize = windowSize;
    }
    /**
     * Feed a dimensional wave state and get fluctuation reading.
     * When fluctuation measures the dimensional space wave states by band wave
     * interpreted constructive, it allows materialising invocation magic via
     * that same wave (emotions and energy surrounding matter and states).
     */
    measure(state) {
        this.buffer.push(state);
        if (this.buffer.length > this.windowSize)
            this.buffer.shift();
        const intensity = Math.min(1, state.fluctuation * 2);
        const activeAxes = {};
        let constructiveSum = 0;
        let energySum = 0;
        for (const band of state.bands) {
            const axis = band.dimensionAxis;
            activeAxes[axis] = (activeAxes[axis] ?? 0) + band.amplitude * band.constructive;
            constructiveSum += band.constructive;
            energySum += band.amplitude * band.constructive;
        }
        const n = state.bands.length || 1;
        const constructiveCoherence = constructiveSum / n;
        const surroundingEnergy = energySum / n;
        return {
            intensity,
            activeAxes,
            constructiveCoherence,
            surroundingEnergy,
            timestamp: state.timestamp,
        };
    }
    getBuffer() {
        return this.buffer;
    }
}
