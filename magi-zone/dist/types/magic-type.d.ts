/**
 * Magic type definitions per pattern/magi: zoning range (surrounding space,
 * incubated gravity), materialisation range, and field of rotation of cast.
 * Some magic has 360° rotation depending on which type of magi it is.
 * All-axis casting: cast applies along x, y, z, t, psi when enabled.
 */
export type MagicTypeId = string;
/** Dimensional axes (x,y,z spatial; t time; psi phase) */
export type DimensionAxis = 'x' | 'y' | 'z' | 't' | 'psi';
export declare const ALL_AXES: DimensionAxis[];
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
/** Per-pattern magic types: zoning range, 360° or directional cast, and all-axis casting */
export declare const MAGIC_TYPES: Record<string, MagicType>;
export declare function getMagicType(patternId: string): MagicType;
/** Check if this magi type has full 360° rotation of cast */
export declare function has360FieldOfRotation(patternId: string): boolean;
/** Get axes this magi type casts on (all axes when allAxisCasting, else castAxes) */
export declare function getCastAxes(patternId: string): DimensionAxis[];
/** Check if this magi type uses all-axis casting (x, y, z, t, psi) */
export declare function isAllAxisCasting(patternId: string): boolean;
