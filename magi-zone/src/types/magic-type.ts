/**
 * Magic type definitions per pattern/magi: zoning range (surrounding space,
 * incubated gravity), materialisation range, and field of rotation of cast.
 * Some magic has 360° rotation depending on which type of magi it is.
 * All-axis casting: cast applies along x, y, z, t, psi when enabled.
 */

export type MagicTypeId = string;

/** Dimensional axes (x,y,z spatial; t time; psi phase) */
export type DimensionAxis = 'x' | 'y' | 'z' | 't' | 'psi';

export const ALL_AXES: DimensionAxis[] = ['x', 'y', 'z', 't', 'psi'];

/** Field of rotation: 360 = full sphere, else cone angle in degrees */
export type FieldOfRotation = {
  /** Degrees (360 = full 360° rotation of cast; 90 = quarter cone, etc.) */
  degrees: number;
  /** If true, cast is omnidirectional (360 horizontal + vertical) */
  omnidirectional: boolean;
};

export type MagicType = {
  id: MagicTypeId;
  /** Zoning range: radius that affects surrounding space / incubated gravity */
  zoningRange: number;
  /** LiDAR-like 3D mapping: resolution (points per unit) for materialisation range */
  lidarResolution: number;
  /** Field of rotation of cast – 360 for full sphere depending on magi type */
  fieldOfRotation: FieldOfRotation;
  /** Incubated gravity strength 0..1 within zone */
  gravityStrength: number;
  /** When true, cast applies along all axes (x, y, z, t, psi) */
  allAxisCasting: boolean;
  /** Which axes this magi casts on (when allAxisCasting false, subset; when true, ALL_AXES) */
  castAxes: DimensionAxis[];
};

const FULL_360: FieldOfRotation = { degrees: 360, omnidirectional: true };

/** Spatial-only axes (3D) */
const AXES_XYZ: DimensionAxis[] = ['x', 'y', 'z'];

/** Per-pattern magic types: zoning range, 360° or directional cast, and all-axis casting */
export const MAGIC_TYPES: Record<string, MagicType> = {
  pattern_default: {
    id: 'pattern_default',
    zoningRange: 3,
    lidarResolution: 4,
    fieldOfRotation: { degrees: 180, omnidirectional: false },
    gravityStrength: 0.2,
    allAxisCasting: false,
    castAxes: AXES_XYZ,
  },
  pattern_manifest: {
    id: 'pattern_manifest',
    zoningRange: 8,
    lidarResolution: 6,
    fieldOfRotation: FULL_360,
    gravityStrength: 0.5,
    allAxisCasting: true,
    castAxes: ALL_AXES,
  },
  pattern_bind: {
    id: 'pattern_bind',
    zoningRange: 5,
    lidarResolution: 5,
    fieldOfRotation: { degrees: 120, omnidirectional: false },
    gravityStrength: 0.6,
    allAxisCasting: false,
    castAxes: AXES_XYZ,
  },
  pattern_shield: {
    id: 'pattern_shield',
    zoningRange: 6,
    lidarResolution: 6,
    fieldOfRotation: FULL_360,
    gravityStrength: 0.4,
    allAxisCasting: true,
    castAxes: ALL_AXES,
  },
  pattern_reveal: {
    id: 'pattern_reveal',
    zoningRange: 12,
    lidarResolution: 8,
    fieldOfRotation: FULL_360,
    gravityStrength: 0.15,
    allAxisCasting: true,
    castAxes: ALL_AXES,
  },
  pattern_seal: {
    id: 'pattern_seal',
    zoningRange: 4,
    lidarResolution: 5,
    fieldOfRotation: { degrees: 360, omnidirectional: true },
    gravityStrength: 0.7,
    allAxisCasting: true,
    castAxes: ALL_AXES,
  },
  pattern_open: {
    id: 'pattern_open',
    zoningRange: 5,
    lidarResolution: 5,
    fieldOfRotation: { degrees: 90, omnidirectional: false },
    gravityStrength: 0.3,
    allAxisCasting: false,
    castAxes: AXES_XYZ,
  },
  pattern_ward: {
    id: 'pattern_ward',
    zoningRange: 10,
    lidarResolution: 6,
    fieldOfRotation: FULL_360,
    gravityStrength: 0.35,
    allAxisCasting: true,
    castAxes: ALL_AXES,
  },
  pattern_flow: {
    id: 'pattern_flow',
    zoningRange: 7,
    lidarResolution: 6,
    fieldOfRotation: FULL_360,
    gravityStrength: 0.25,
    allAxisCasting: true,
    castAxes: ALL_AXES,
  },
};

export function getMagicType(patternId: string): MagicType {
  return MAGIC_TYPES[patternId] ?? MAGIC_TYPES.pattern_default;
}

/** Check if this magi type has full 360° rotation of cast */
export function has360FieldOfRotation(patternId: string): boolean {
  const mt = getMagicType(patternId);
  return mt.fieldOfRotation.omnidirectional && mt.fieldOfRotation.degrees >= 360;
}

/** Get axes this magi type casts on (all axes when allAxisCasting, else castAxes) */
export function getCastAxes(patternId: string): DimensionAxis[] {
  const mt = getMagicType(patternId);
  return mt.allAxisCasting ? [...ALL_AXES] : [...mt.castAxes];
}

/** Check if this magi type uses all-axis casting (x, y, z, t, psi) */
export function isAllAxisCasting(patternId: string): boolean {
  return getMagicType(patternId).allAxisCasting;
}
