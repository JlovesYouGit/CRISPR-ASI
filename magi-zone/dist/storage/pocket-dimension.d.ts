/**
 * Pocket dimension 3D: storage of all magi (origin executable magic codes).
 * Can generate an infinite number of codes by matching user intent.
 * Teleport via Hz data wave is decoded by the system from here.
 */
import type { MagiCode, PocketVec3, PocketSlot, CastTier } from '../types/magi.js';
import type { InvocationIntent } from '../types/invocation.js';
export declare class PocketDimension {
    private slots;
    private magiById;
    private nextIndex;
    private keyAt;
    /** Resolve 3D position from index (fill pocket dimension spatially) */
    private positionFromIndex;
    /**
     * Generate magi code from user intent (infinite generation by matching intent).
     * Returns origin executable magic code for this invocation.
     */
    generateMagi(intent: InvocationIntent, tier: CastTier, hzCarrier: number): MagiCode;
    /** Find stored magi by pattern or intent (for teleport decode) */
    findMagiByPattern(patternId: string): MagiCode | undefined;
    /** Get all magi in pocket dimension (storage of all magi) */
    getAllMagi(): MagiCode[];
    /** Get slot at 3D position */
    getSlotAt(pos: PocketVec3): PocketSlot | undefined;
    /** Origin of pocket dimension */
    getOrigin(): PocketVec3;
}
