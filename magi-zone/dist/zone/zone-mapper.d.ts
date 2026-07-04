/**
 * Zoning range of magic type: individual casting effects affect surrounding space
 * or incubated gravity. Materialise like LiDAR to 3D mapping – points in space
 * within the zone get materialisation and gravity influence.
 */
import type { MagicType } from '../types/magic-type.js';
export type Vec3 = [number, number, number];
/** Single point in 3D space with materialisation and incubated gravity (LiDAR-like sample) */
export type ZonePoint = {
    position: Vec3;
    /** Distance from cast origin */
    distance: number;
    /** Materialisation strength 0..1 at this point */
    materialisation: number;
    /** Incubated gravity influence 0..1 at this point */
    gravityInfluence: number;
    /** Within field of rotation (if directional magi) */
    inField: boolean;
    /** When all-axis casting: cast applies on all axes (x,y,z,t,psi) at this point */
    allAxisActive: boolean;
};
/** LiDAR-like 3D mapping of zone: points in surrounding space affected by the cast */
export type ZoneMap3D = {
    /** Cast origin (center of zone) */
    origin: Vec3;
    /** Magic type used (zoning range, resolution, gravity) */
    magicType: MagicType;
    /** Sampled points in 3D (like LiDAR point cloud) */
    points: ZonePoint[];
    /** Bounding radius of zone */
    radius: number;
    /** All-axis casting: effect applies along x, y, z, t, psi */
    allAxisCasting: boolean;
};
/**
 * Map the zone: effect of individual casting on surrounding space / incubated gravity
 * by zoning range of magic type, materialised like LiDAR to 3D mapping.
 */
export declare function mapZone3D(origin: Vec3, patternId: string, castDirection?: Vec3): ZoneMap3D;
/**
 * Get effective field of rotation in degrees for a pattern (360 or cone).
 */
export declare function getFieldOfRotationDegrees(patternId: string): number;
