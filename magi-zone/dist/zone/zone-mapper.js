/**
 * Zoning range of magic type: individual casting effects affect surrounding space
 * or incubated gravity. Materialise like LiDAR to 3D mapping – points in space
 * within the zone get materialisation and gravity influence.
 */
import { getMagicType } from '../types/magic-type.js';
/**
 * Map the zone: effect of individual casting on surrounding space / incubated gravity
 * by zoning range of magic type, materialised like LiDAR to 3D mapping.
 */
export function mapZone3D(origin, patternId, castDirection = [0, 1, 0]) {
    const magicType = getMagicType(patternId);
    const { zoningRange, lidarResolution, gravityStrength, fieldOfRotation, allAxisCasting } = magicType;
    const points = [];
    const step = zoningRange / lidarResolution;
    const half = (lidarResolution * zoningRange) / 2;
    for (let ix = 0; ix <= lidarResolution; ix++) {
        for (let iy = 0; iy <= lidarResolution; iy++) {
            for (let iz = 0; iz <= lidarResolution; iz++) {
                const x = origin[0] - half + ix * step;
                const y = origin[1] - half + iy * step;
                const z = origin[2] - half + iz * step;
                const position = [x, y, z];
                const dx = x - origin[0];
                const dy = y - origin[1];
                const dz = z - origin[2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (distance > zoningRange)
                    continue;
                let inField = true;
                if (!fieldOfRotation.omnidirectional && fieldOfRotation.degrees < 360) {
                    const [cx, cy, cz] = castDirection;
                    const dot = (dx * cx + dy * cy + dz * cz) / (distance || 1);
                    const angleDeg = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
                    inField = angleDeg <= fieldOfRotation.degrees / 2;
                }
                const falloff = 1 - distance / zoningRange;
                const materialisation = inField ? falloff * (0.3 + 0.7 * (1 - distance / zoningRange)) : 0;
                const gravityInfluence = inField ? gravityStrength * falloff : 0;
                points.push({
                    position,
                    distance,
                    materialisation,
                    gravityInfluence,
                    inField,
                    allAxisActive: allAxisCasting && inField,
                });
            }
        }
    }
    return {
        origin: [...origin],
        magicType,
        points,
        radius: zoningRange,
        allAxisCasting,
    };
}
/**
 * Get effective field of rotation in degrees for a pattern (360 or cone).
 */
export function getFieldOfRotationDegrees(patternId) {
    return getMagicType(patternId).fieldOfRotation.degrees;
}
