/**
 * Mana protocol: invocations permitted under protocol that uses user mana/energy.
 * Engraving measures mana fluctuation via the voice wave. Subtle details acquired
 * to calculate how much can be used to materialise cast, cast time; assist casting
 * by computer render/computation for precision without user concentration or mental wave –
 * keeping magic safe even with invocation.
 */
import type { ManaPool, ManaFluctuationReading, CastCalculus } from '../types/mana.js';
import type { FluctuationReading } from '../detection/fluctuation-detector.js';
import type { InvocationIntent } from '../types/invocation.js';
import type { CastTier } from '../types/magi.js';
export declare class ManaProtocol {
    private pool;
    private readonly baseManaCost;
    private readonly baseCastTimeMs;
    constructor(options?: {
        maxMana?: number;
        regenPerSec?: number;
        baseManaCost?: number;
        baseCastTimeMs?: number;
    });
    /** Measure mana fluctuation via voice wave (for engraving measure) */
    measureManaFluctuation(voiceWaveFluctuation: FluctuationReading): ManaFluctuationReading;
    /** Compute cast calculus: mana cost, cast time, materialise amount; assist casting, permitted */
    computeCastCalculus(intent: InvocationIntent, manaFluctuation: ManaFluctuationReading, tier: CastTier): CastCalculus;
    /** Deduct mana (call after permitted cast) */
    consume(amount: number): void;
    /** Regenerate mana over time (call on tick) */
    tick(): void;
    getPool(): Readonly<ManaPool>;
}
