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

const TIER_MULTIPLIER: Record<CastTier, number> = {
  1: 1,
  2: 1.5,
  3: 2,
  4: 3,
  5: 5,
};

export class ManaProtocol {
  private pool: ManaPool;
  private readonly baseManaCost: number;
  private readonly baseCastTimeMs: number;

  constructor(options?: {
    maxMana?: number;
    regenPerSec?: number;
    baseManaCost?: number;
    baseCastTimeMs?: number;
  }) {
    const max = options?.maxMana ?? 100;
    this.pool = {
      current: max,
      max,
      regenPerSec: options?.regenPerSec ?? 5,
      updatedAt: Date.now(),
    };
    this.baseManaCost = options?.baseManaCost ?? 15;
    this.baseCastTimeMs = options?.baseCastTimeMs ?? 500;
  }

  /** Measure mana fluctuation via voice wave (for engraving measure) */
  measureManaFluctuation(voiceWaveFluctuation: FluctuationReading): ManaFluctuationReading {
    const voiceWaveFluctuationNorm = voiceWaveFluctuation.intensity;
    const availableForCast = this.pool.current * (0.2 + 0.8 * (1 - voiceWaveFluctuationNorm));
    const suggestedCastTimeMs = Math.max(
      100,
      this.baseCastTimeMs * (0.5 + voiceWaveFluctuationNorm * 0.5)
    );
    const materialisePotential =
      voiceWaveFluctuation.constructiveCoherence * (voiceWaveFluctuation.surroundingEnergy ?? 0.5);

    return {
      voiceWaveFluctuation: voiceWaveFluctuationNorm,
      availableForCast,
      suggestedCastTimeMs,
      materialisePotential,
      timestamp: voiceWaveFluctuation.timestamp,
    };
  }

  /** Compute cast calculus: mana cost, cast time, materialise amount; assist casting, permitted */
  computeCastCalculus(
    intent: InvocationIntent,
    manaFluctuation: ManaFluctuationReading,
    tier: CastTier
  ): CastCalculus {
    const mult = TIER_MULTIPLIER[tier];
    const manaCost = this.baseManaCost * mult * (0.8 + (intent.energySignature[0] ?? 0.5) * 0.4);
    const castTimeMs = Math.round(
      this.baseCastTimeMs * mult * (0.5 + (1 - (intent.energySignature[1] ?? 0.5)) * 0.5)
    );
    const materialiseAmount = Math.min(
      1,
      manaFluctuation.materialisePotential * (intent.confidence ?? 0.5)
    );
    const permitted =
      this.pool.current >= manaCost &&
      intent.confidence >= 0.2 &&
      manaFluctuation.availableForCast >= manaCost;

    return {
      manaCost,
      castTimeMs,
      materialiseAmount,
      assistCasting: true,
      permitted,
    };
  }

  /** Deduct mana (call after permitted cast) */
  consume(amount: number): void {
    this.pool.current = Math.max(0, this.pool.current - amount);
    this.pool.updatedAt = Date.now();
  }

  /** Regenerate mana over time (call on tick) */
  tick(): void {
    const now = Date.now();
    const dt = (now - this.pool.updatedAt) / 1000;
    this.pool.current = Math.min(
      this.pool.max,
      this.pool.current + this.pool.regenPerSec * dt
    );
    this.pool.updatedAt = now;
  }

  getPool(): Readonly<ManaPool> {
    return { ...this.pool };
  }
}
