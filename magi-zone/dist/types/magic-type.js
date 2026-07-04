/**
 * Magic type definitions per pattern/magi: zoning range (surrounding space,
 * incubated gravity), materialisation range, and field of rotation of cast.
 * Some magic has 360° rotation depending on which type of magi it is.
 * All-axis casting: cast applies along x, y, z, t, psi when enabled.
 */
export const ALL_AXES = ['x', 'y', 'z', 't', 'psi'];
const FULL_360 = { degrees: 360, omnidirectional: true };
/** Spatial-only axes (3D) */
const AXES_XYZ = ['x', 'y', 'z'];
/** Per-pattern magic types: zoning range, 360° or directional cast, and all-axis casting */
export const MAGIC_TYPES = {
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
export function getMagicType(patternId) {
    return MAGIC_TYPES[patternId] ?? MAGIC_TYPES.pattern_default;
}
/** Check if this magi type has full 360° rotation of cast */
export function has360FieldOfRotation(patternId) {
    const mt = getMagicType(patternId);
    return mt.fieldOfRotation.omnidirectional && mt.fieldOfRotation.degrees >= 360;
}
/** Get axes this magi type casts on (all axes when allAxisCasting, else castAxes) */
export function getCastAxes(patternId) {
    const mt = getMagicType(patternId);
    return mt.allAxisCasting ? [...ALL_AXES] : [...mt.castAxes];
}
/** Check if this magi type uses all-axis casting (x, y, z, t, psi) */
export function isAllAxisCasting(patternId) {
    return getMagicType(patternId).allAxisCasting;
}
