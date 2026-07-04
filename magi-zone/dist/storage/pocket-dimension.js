/**
 * Pocket dimension 3D: storage of all magi (origin executable magic codes).
 * Can generate an infinite number of codes by matching user intent.
 * Teleport via Hz data wave is decoded by the system from here.
 */
const ORIGIN = [0, 0, 0];
const SLOT_SCALE = 1;
const MAX_SLOTS_PER_AXIS = 256;
/** Hash intent to a deterministic id so same intent can resolve to same code id when desired */
function intentSignature(phrase, patternId) {
    return `${phrase}:${patternId}`.toLowerCase().replace(/\s+/g, '_');
}
/** Generate a unique magi id from intent (infinite possible codes) */
function generateMagiId(intent, index) {
    const sig = intentSignature(intent.phrase, intent.patternId);
    return `magi_${sig}_${intent.timestamp}_${index}`;
}
export class PocketDimension {
    slots = new Map();
    magiById = new Map();
    nextIndex = 0;
    keyAt(pos) {
        const [x, y, z] = pos;
        return `${x},${y},${z}`;
    }
    /** Resolve 3D position from index (fill pocket dimension spatially) */
    positionFromIndex(index) {
        const x = (index % MAX_SLOTS_PER_AXIS) * SLOT_SCALE;
        const y = Math.floor(index / MAX_SLOTS_PER_AXIS) % MAX_SLOTS_PER_AXIS * SLOT_SCALE;
        const z = Math.floor(index / (MAX_SLOTS_PER_AXIS * MAX_SLOTS_PER_AXIS)) * SLOT_SCALE;
        return [x, y, z];
    }
    /**
     * Generate magi code from user intent (infinite generation by matching intent).
     * Returns origin executable magic code for this invocation.
     */
    generateMagi(intent, tier, hzCarrier) {
        const index = this.nextIndex++;
        const id = generateMagiId(intent, index);
        const manaCostBase = 10 + (intent.energySignature[0] ?? 0.5) * 20;
        const castTimeMsBase = 300 + (1 - (intent.energySignature[1] ?? 0.5)) * 700;
        const magi = {
            id,
            patternId: intent.patternId,
            tier,
            manaCostBase,
            castTimeMsBase,
            hzCarrier,
            intentSignature: intentSignature(intent.phrase, intent.patternId),
            createdAt: intent.timestamp,
        };
        this.magiById.set(id, magi);
        const pos = this.positionFromIndex(index);
        this.slots.set(this.keyAt(pos), { position: pos, magi });
        return magi;
    }
    /** Find stored magi by pattern or intent (for teleport decode) */
    findMagiByPattern(patternId) {
        for (const magi of this.magiById.values()) {
            if (magi.patternId === patternId)
                return magi;
        }
        return undefined;
    }
    /** Get all magi in pocket dimension (storage of all magi) */
    getAllMagi() {
        return [...this.magiById.values()];
    }
    /** Get slot at 3D position */
    getSlotAt(pos) {
        return this.slots.get(this.keyAt(pos));
    }
    /** Origin of pocket dimension */
    getOrigin() {
        return [...ORIGIN];
    }
}
