/**
 * Invocation: will of voice and emotion/energy in space.
 * Parsed by reality protocol (hypercomputation) and engraved via enforce protocol.
 */

/** Cast tier 1–5; high advanced grade when in danger */
export type InvocationTier = 1 | 2 | 3 | 4 | 5;

export type InvocationIntent = {
  /** Raw will/voice token */
  phrase: string;
  /** Resolved pattern id for engraving */
  patternId: string;
  /** Emotional/energy signature (from wave state) */
  energySignature: number[];
  /** Confidence 0..1 */
  confidence: number;
  /** Tier level selector – permitted under protocol */
  tier?: InvocationTier;
  /** If true, high advanced grade can be cast automatically (user in danger) */
  inDanger?: boolean;
  timestamp: number;
};

export type EngravingPattern = {
  id: string;
  /** 2D-in-3D: vertices in local 2D plane, placed in 3D space */
  vertices2D: [number, number][];
  /** 3D placement (origin of 2D plane in world space) */
  origin3D: [number, number, number];
  /** Normal of 2D plane in 3D */
  normal3D: [number, number, number];
  /** Hz band used to force-engrave */
  engraveHz: number;
  /** Fluctuation at time of engrave */
  fluctuationAtEngrave: number;
  timestamp: number;
};

export type ScannedArea = {
  /** Radar-like: center and radius in 3D */
  center: [number, number, number];
  radius: number;
  /** Invocations detected in this area */
  invocations: InvocationIntent[];
  /** Dimensional state: 2D pattern embedded in 3D */
  dimensionalState: '2d_in_3d';
};
