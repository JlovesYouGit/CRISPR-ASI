/**
 * Magi: origin executable magic codes stored in pocket dimension.
 * Infinite generation by matching user intent. Tier/grade for cast level.
 */

/** Tier/grade of invocation – selector allowed; auto high-grade when in danger */
export type CastTier = 1 | 2 | 3 | 4 | 5;

export const CAST_TIER_LABELS: Record<CastTier, string> = {
  1: 'basic',
  2: 'standard',
  3: 'advanced',
  4: 'high_advanced',
  5: 'transcendent',
};

/** Single origin executable magic code – one magi */
export type MagiCode = {
  /** Unique id (can be infinite, generated from intent) */
  id: string;
  /** Pattern/signature this code executes */
  patternId: string;
  /** Tier at which this code is available */
  tier: CastTier;
  /** Mana cost base (modified by tier) */
  manaCostBase: number;
  /** Cast time in ms (base) */
  castTimeMsBase: number;
  /** Hz carrier for teleport/decode */
  hzCarrier: number;
  /** Optional intent signature used to generate this code */
  intentSignature?: string;
  createdAt: number;
};

/** 3D point in pocket dimension space */
export type PocketVec3 = [number, number, number];

/** Slot in pocket dimension holding one magi */
export type PocketSlot = {
  position: PocketVec3;
  magi: MagiCode | null;
};
