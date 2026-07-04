/**
 * Device detector: Hz / spectrum wave.
 * Samples band waves and interprets constructive dimensional states.
 */
const DEFAULT_RANGE_HZ = [0.1, 20000];
export class HzSpectrumDetector {
    rangeHz;
    bandCount;
    history = [];
    maxHistory = 128;
    constructor(options) {
        this.rangeHz = options?.rangeHz ?? DEFAULT_RANGE_HZ;
        this.bandCount = options?.bandCount ?? 32;
    }
    /**
     * Sample current spectrum and produce dimensional wave state.
     * In a real device this would read from hardware; here we simulate from seed.
     */
    sample(seed) {
        const t = Date.now();
        const rng = seed ?? (t * 0.001 + Math.random());
        const bands = [];
        const [minHz, maxHz] = this.rangeHz;
        const step = (maxHz - minHz) / this.bandCount;
        const axes = ['x', 'y', 'z', 't', 'psi'];
        for (let i = 0; i < this.bandCount; i++) {
            const hz = minHz + step * (i + 0.5);
            bands.push({
                hz,
                bandwidth: step * 0.8,
                constructive: 0.3 + 0.7 * (Math.sin(rng + i * 0.7) * 0.5 + 0.5),
                amplitude: 0.2 + 0.8 * (Math.cos(rng * 1.3 + i * 0.4) * 0.5 + 0.5),
                dimensionAxis: axes[i % axes.length],
            });
        }
        const fluctuation = this.computeFluctuation(bands);
        const state = { bands, fluctuation, timestamp: t };
        this.history.push(state);
        if (this.history.length > this.maxHistory)
            this.history.shift();
        return state;
    }
    computeFluctuation(bands) {
        if (this.history.length < 2)
            return 0;
        const prev = this.history[this.history.length - 1];
        let sum = 0;
        const n = Math.min(bands.length, prev.bands.length);
        for (let i = 0; i < n; i++) {
            const a = bands[i];
            const b = prev.bands[i];
            sum += Math.abs(a.amplitude - b.amplitude) + Math.abs(a.constructive - b.constructive);
        }
        return sum / (n || 1);
    }
    getSnapshot() {
        const state = this.sample();
        return {
            rangeHz: this.rangeHz,
            bands: state.bands,
            fluctuation: state.fluctuation,
            timestamp: state.timestamp,
        };
    }
    getHistory() {
        return this.history;
    }
}
