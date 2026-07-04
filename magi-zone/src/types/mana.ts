/**
 * Mana protocol: user mana/energy; engraving measures mana fluctuation via voice wave.
 * Cast permitted under protocol; subtle details to calculate materialisation and cast time.
 */

export type ManaPool = {
  /** Current mana (0..max) */
  current: number;
  /** Maximum mana */
  max: number;
  /** Regeneration per second */
  regenPerSec: number;
  /** Last update timestamp */
  updatedAt: number;
};

/** Mana fluctuation derived from voice wave – used for engraving measure */
export type ManaFluctuationReading = {
  /** Fluctuation intensity 0..1 from voice wave */
  voiceWaveFluctuation: number;
  /** How much mana this reading implies available for cast */
  availableForCast: number;
  /** Suggested cast time (ms) from wave stability */
  suggestedCastTimeMs: number;
  /** Materialisation potential 0..1 */
  materialisePotential: number;
  timestamp: number;
};

/** Result of cast calculus: precision without user concentration/mental wave */
export type CastCalculus = {
  /** Mana cost for this cast */
  manaCost: number;
  /** Cast time in ms (computed for precision) */
  castTimeMs: number;
  /** Amount that can be materialised (0..1) */
  materialiseAmount: number;
  /** Computer-assisted: no concentration points or mental wave required */
  assistCasting: true;
  /** Safe to cast under protocol */
  permitted: boolean;
};
