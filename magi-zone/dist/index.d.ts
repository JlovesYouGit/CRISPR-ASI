/**
 * Magi-Zone: device as pocket dimension 3D with storage of all magi (origin executable
 * magic codes); infinite generation by matching user intent. Teleport via Hz data wave
 * decoded by the system and enforced into outside reality via particle teleportation
 * of movement (no two-places violation – upscale). When invocation is cast by the user,
 * permitted under protocol using user mana/energy; engraving measures mana fluctuation
 * via voice wave. Cast calculus and assist casting for precision without concentration;
 * tier selector and automatic high advanced grade when in danger.
 */
export { HzSpectrumDetector } from './device/hz-spectrum-detector.js';
export { FluctuationDetector } from './detection/fluctuation-detector.js';
export type { FluctuationReading } from './detection/fluctuation-detector.js';
export { InvocationDetector } from './detection/invocation-detector.js';
export type { InvocationDetectorOptions } from './detection/invocation-detector.js';
export { EnforceProtocol } from './protocol/enforce-protocol.js';
export type { EnforceResult } from './protocol/enforce-protocol.js';
export { RealityProtocol } from './protocol/reality-protocol.js';
export type { HypercomputationParseResult } from './protocol/reality-protocol.js';
export { ManaProtocol } from './protocol/mana-protocol.js';
export { resolveTier, isPermittedForUser, CAST_TIER_LABELS } from './protocol/tier-protocol.js';
export type { CastTier } from './protocol/tier-protocol.js';
export { DimensionalRadar } from './scan/dimensional-radar.js';
export type { RadarSweepResult } from './scan/dimensional-radar.js';
export { PocketDimension } from './storage/pocket-dimension.js';
export { encodeHzDataWave, decodeAndEnforce } from './teleport/upscale.js';
export type { HzDataWave, UpscaleResult } from './teleport/upscale.js';
export { resolveUserLocation, travelingWaveFromState, userLocationFromTravelingWave } from './optimal/traveling-wave.js';
export { computeOptimalFormationPoint, defaultDirectionalCommand } from './optimal/optimal-formation-point.js';
export type { UserLocation, TravelingWave, DirectionalCommand, NamedDirection, OptimalFormationResult } from './types/optimal-point.js';
export { validateActuationReadiness, resolveTarget, getCommandTypeForIntent } from './validation/actuation-readiness.js';
export type { CommandType, ActuationTarget, ActuationReadiness } from './types/actuation.js';
export type { BandWave, DimensionalWaveState, SpectrumSnapshot } from './types/wave.js';
export type { InvocationIntent, InvocationTier, EngravingPattern, ScannedArea } from './types/invocation.js';
export type { MagiCode, PocketVec3, PocketSlot } from './types/magi.js';
export type { ManaPool, ManaFluctuationReading, CastCalculus } from './types/mana.js';
export { getMagicType, has360FieldOfRotation, getCastAxes, isAllAxisCasting, MAGIC_TYPES, ALL_AXES } from './types/magic-type.js';
export type { MagicType, FieldOfRotation, DimensionAxis } from './types/magic-type.js';
export { mapZone3D, getFieldOfRotationDegrees } from './zone/zone-mapper.js';
export type { ZoneMap3D, ZonePoint, Vec3 } from './zone/zone-mapper.js';
export { bootstrapService, runBootstrap } from './service/bootstrap.js';
export { PersistentService } from './service/persistent-service.js';
export { ServiceManager } from './service/service-manager.js';
export { Watchdog } from './service/watchdog.js';
export { NetbuildIntegration } from './service/netbuild-integration.js';
export { NetRuntimeService } from './service/net-runtime-service.js';
export { runSimplePersistentService, SimplePersistentService } from './service/simple-persistent.js';
export type { PersistentServiceConfig, ServiceConfig, WatchdogConfig, NetbuildConfig, NetRuntimeConfig } from './service/index.js';
export type CastingPipelineOptions = {
    /** User 0 point of entry (command/origin); cast is formed at optimal point, not here */
    origin3D: [number, number, number];
    /** Tier level selector (optional; danger override can override) */
    defaultTier?: import('./types/magi.js').CastTier;
    /** User in danger → high advanced grade cast automatically */
    inDanger?: boolean;
    /** Movement vector for upscale/teleport */
    movementVector?: [number, number, number];
    /** Directional command for where to form cast (forward, up, vector, etc.); default forward */
    directionalCommand?: import('./types/optimal-point.js').DirectionalCommand;
    /** Safety radius around user; formation point stays outside so user unaffected */
    safetyRadius?: number;
    /** Explicit target for actuation (position, self, or direction); default derived from formation point */
    target?: import('./types/actuation.js').ActuationTarget;
    /** Minimum intent confidence to allow execution (misfire prevention) */
    minConfidence?: number;
};
/**
 * Run full casting pipeline: pocket dimension (magi storage, infinite by intent) →
 * voice detection → mana protocol (mana fluctuation via voice wave, cast calculus,
 * assist casting) → tier resolve (danger override) → permit under protocol →
 * generate magi → Hz data wave teleport (decode, particle teleportation, enforce
 * to reality) → enforce engrave when permitted. Computer precision without
 * concentration points or mental wave; magic kept safe.
 */
export declare function runCastingPipeline(voicePhrases: string[], options: CastingPipelineOptions): {
    waveState: import("./types/wave.js").DimensionalWaveState;
    fluctuation: import("./detection/fluctuation-detector.js").FluctuationReading;
    manaFluctuation: import("./types/mana.js").ManaFluctuationReading;
    parsed: import("./protocol/reality-protocol.js").HypercomputationParseResult;
    sweep: import("./scan/dimensional-radar.js").RadarSweepResult;
    pocketMagiCount: number;
    results: {
        intent: import("./types/invocation.js").InvocationIntent;
        tier: import("./types/magi.js").CastTier;
        calculus: import("./types/mana.js").CastCalculus;
        permitted: boolean;
        magi?: import("./types/magi.js").MagiCode;
        upscale?: import("./teleport/upscale.js").UpscaleResult;
        enforceResult?: import("./protocol/enforce-protocol.js").EnforceResult;
        /** Zone 3D map: effect on surrounding space / incubated gravity (LiDAR-like) */
        zoneMap3D?: import("./zone/zone-mapper.js").ZoneMap3D;
        /** Field of rotation in degrees for this magi type (e.g. 360) */
        fieldOfRotationDegrees?: number;
        /** Cast axes (all axes when all-axis casting) */
        castAxes?: import("./types/magic-type.js").DimensionAxis[];
        /** All-axis casting: cast applies along x, y, z, t, psi */
        allAxisCasting?: boolean;
        /** Optimal formation point (cast actuated here; user stays at 0 point of entry) */
        optimalFormation?: import("./types/optimal-point.js").OptimalFormationResult;
        /** Command type and target (validated before execution) */
        commandType?: import("./types/actuation.js").CommandType;
        target?: import("./types/actuation.js").ActuationTarget;
        /** Pre-flight readiness: all variables accounted; if not ready, execution skipped (misfire prevented) */
        actuationReadiness?: import("./types/actuation.js").ActuationReadiness;
        /** True if actuation was executed; false if blocked (misfire prevented) */
        executed?: boolean;
    }[];
    userLocation: import("./types/optimal-point.js").UserLocation;
};
/**
 * Run invocation pipeline (device detectors → fluctuation → invocation → enforce).
 * For full casting with mana, tier, pocket dimension and upscale use runCastingPipeline.
 */
export declare function runInvocationPipeline(voicePhrases: string[], origin3D: [number, number, number]): {
    waveState: import("./types/wave.js").DimensionalWaveState;
    fluctuation: import("./detection/fluctuation-detector.js").FluctuationReading;
    parsed: import("./protocol/reality-protocol.js").HypercomputationParseResult;
    sweep: import("./scan/dimensional-radar.js").RadarSweepResult;
    engravings: import("./protocol/enforce-protocol.js").EnforceResult[];
};
