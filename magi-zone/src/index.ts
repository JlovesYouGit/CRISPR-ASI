/**
 * Magi-Zone: device as pocket dimension 3D with storage of all magi (origin executable
 * magic codes); infinite generation by matching user intent. Teleport via Hz data wave
 * decoded by the system and enforced into outside reality via particle teleportation
 * of movement (no two-places violation – upscale). When invocation is cast by the user,
 * permitted under protocol using user mana/energy; engraving measures mana fluctuation
 * via voice wave. Cast calculus and assist casting for precision without concentration;
 * tier selector and automatic high advanced grade when in danger.
 */

import { HzSpectrumDetector } from './device/hz-spectrum-detector.js';
import { FluctuationDetector } from './detection/fluctuation-detector.js';
import { InvocationDetector } from './detection/invocation-detector.js';
import { EnforceProtocol } from './protocol/enforce-protocol.js';
import { RealityProtocol } from './protocol/reality-protocol.js';
import { ManaProtocol } from './protocol/mana-protocol.js';
import { resolveTier, isPermittedForUser } from './protocol/tier-protocol.js';
import { DimensionalRadar } from './scan/dimensional-radar.js';
import { PocketDimension } from './storage/pocket-dimension.js';
import { encodeHzDataWave, decodeAndEnforce } from './teleport/upscale.js';
import { mapZone3D, getFieldOfRotationDegrees } from './zone/zone-mapper.js';
import { getCastAxes, isAllAxisCasting } from './types/magic-type.js';
import { resolveUserLocation } from './optimal/traveling-wave.js';
import { computeOptimalFormationPoint, defaultDirectionalCommand } from './optimal/optimal-formation-point.js';
import { validateActuationReadiness, resolveTarget } from './validation/actuation-readiness.js';
import { bootstrapService, runBootstrap } from './service/bootstrap.js';
import { runSimplePersistentService } from './service/simple-persistent.js';

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

// Service exports
export { bootstrapService, runBootstrap } from './service/bootstrap.js';
export { PersistentService } from './service/persistent-service.js';
export { ServiceManager } from './service/service-manager.js';
export { Watchdog } from './service/watchdog.js';
export { NetbuildIntegration } from './service/netbuild-integration.js';
export { NetRuntimeService } from './service/net-runtime-service.js';
export { runSimplePersistentService, SimplePersistentService } from './service/simple-persistent.js';
export type { 
  PersistentServiceConfig, 
  ServiceConfig, 
  WatchdogConfig, 
  NetbuildConfig,
  NetRuntimeConfig
} from './service/index.js';

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
export function runCastingPipeline(
  voicePhrases: string[],
  options: CastingPipelineOptions
) {
  const {
    origin3D,
    defaultTier = 2,
    inDanger = false,
    movementVector = [0, 0, 0],
    directionalCommand = defaultDirectionalCommand(),
    safetyRadius = 0.5,
    target: explicitTarget,
    minConfidence = 0.15,
  } = options;

  const detector = new HzSpectrumDetector({ bandCount: 24 });
  const fluctuationDetector = new FluctuationDetector();
  const invocationDetector = new InvocationDetector();
  const manaProtocol = new ManaProtocol({ maxMana: 100 });
  const enforce = new EnforceProtocol(1.0);
  const reality = new RealityProtocol();
  const radar = new DimensionalRadar(origin3D, 5);
  const pocket = new PocketDimension();

  const waveState = detector.sample();
  const reading = fluctuationDetector.measure(waveState);
  const manaFluctuation = manaProtocol.measureManaFluctuation(reading);
  const userLocation = resolveUserLocation(waveState, origin3D, safetyRadius);

  const detectOptions = { tier: defaultTier as import('./types/invocation.js').InvocationTier, inDanger };
  const parsed = reality.parseViaHypercomputation(
    voicePhrases,
    waveState,
    (phrase) =>
      invocationDetector.detect(phrase, reading, detectOptions) ?? {
        phrase,
        patternId: 'pattern_default',
        energySignature: waveState.bands.map((b) => b.amplitude * b.constructive),
        confidence: 0.2,
        timestamp: Date.now(),
      }
  );

  const sweep = radar.sweep(parsed.intents, waveState);
  const results: Array<{
    intent: import('./types/invocation.js').InvocationIntent;
    tier: import('./types/magi.js').CastTier;
    calculus: import('./types/mana.js').CastCalculus;
    permitted: boolean;
    magi?: import('./types/magi.js').MagiCode;
    upscale?: import('./teleport/upscale.js').UpscaleResult;
    enforceResult?: import('./protocol/enforce-protocol.js').EnforceResult;
    /** Zone 3D map: effect on surrounding space / incubated gravity (LiDAR-like) */
    zoneMap3D?: import('./zone/zone-mapper.js').ZoneMap3D;
    /** Field of rotation in degrees for this magi type (e.g. 360) */
    fieldOfRotationDegrees?: number;
    /** Cast axes (all axes when all-axis casting) */
    castAxes?: import('./types/magic-type.js').DimensionAxis[];
    /** All-axis casting: cast applies along x, y, z, t, psi */
    allAxisCasting?: boolean;
    /** Optimal formation point (cast actuated here; user stays at 0 point of entry) */
    optimalFormation?: import('./types/optimal-point.js').OptimalFormationResult;
    /** Command type and target (validated before execution) */
    commandType?: import('./types/actuation.js').CommandType;
    target?: import('./types/actuation.js').ActuationTarget;
    /** Pre-flight readiness: all variables accounted; if not ready, execution skipped (misfire prevented) */
    actuationReadiness?: import('./types/actuation.js').ActuationReadiness;
    /** True if actuation was executed; false if blocked (misfire prevented) */
    executed?: boolean;
  }> = [];

  const dominantHz = waveState.bands.reduce(
    (best, b) => (b.amplitude * b.constructive > best.score ? { hz: b.hz, score: b.amplitude * b.constructive } : best),
    { hz: 440, score: 0 }
  ).hz;

  for (const intent of parsed.intents) {
    const tier = resolveTier(intent, defaultTier);
    const calculus = manaProtocol.computeCastCalculus(intent, manaFluctuation, tier);
    const permitted = isPermittedForUser(
      intent,
      manaProtocol.getPool().current >= calculus.manaCost,
      calculus.permitted
    );

    const entry: (typeof results)[0] = {
      intent,
      tier,
      calculus,
      permitted,
    };

    entry.fieldOfRotationDegrees = getFieldOfRotationDegrees(intent.patternId);
    entry.castAxes = getCastAxes(intent.patternId);
    entry.allAxisCasting = isAllAxisCasting(intent.patternId);

    const optimalFormation = computeOptimalFormationPoint(
      userLocation,
      intent.patternId,
      directionalCommand
    );
    entry.optimalFormation = optimalFormation;
    const formationPoint = optimalFormation.formationPoint;
    const castNormal = optimalFormation.direction;

    const target = resolveTarget(intent, optimalFormation, explicitTarget);
    entry.target = target;
    const readiness = validateActuationReadiness(
      intent,
      target,
      optimalFormation,
      calculus,
      manaProtocol.getPool().current,
      { minConfidence }
    );
    entry.actuationReadiness = readiness;
    entry.commandType = readiness.variablesAccounted.commandType;

    const mayExecute = permitted && readiness.ready;
    entry.executed = mayExecute;

    if (mayExecute) {
      manaProtocol.tick();
      const magi = pocket.generateMagi(intent, tier, dominantHz);
      entry.magi = magi;
      const hzWave = encodeHzDataWave(magi, movementVector, waveState);
      entry.upscale = decodeAndEnforce(hzWave, formationPoint);
      const [enforceResult] = enforce.mergeAndEngraveBatch(
        [intent],
        waveState,
        formationPoint,
        castNormal
      );
      entry.enforceResult = enforceResult;
      entry.zoneMap3D = mapZone3D(formationPoint, intent.patternId, castNormal);
      manaProtocol.consume(calculus.manaCost);
    }

    results.push(entry);
  }

  return {
    waveState,
    fluctuation: reading,
    manaFluctuation,
    parsed,
    sweep,
    pocketMagiCount: pocket.getAllMagi().length,
    results,
    userLocation,
  };
}

/**
 * Run invocation pipeline (device detectors → fluctuation → invocation → enforce).
 * For full casting with mana, tier, pocket dimension and upscale use runCastingPipeline.
 */
export function runInvocationPipeline(
  voicePhrases: string[],
  origin3D: [number, number, number]
) {
  const detector = new HzSpectrumDetector({ bandCount: 24 });
  const fluctuationDetector = new FluctuationDetector();
  const invocationDetector = new InvocationDetector();
  const enforce = new EnforceProtocol(1.0);
  const reality = new RealityProtocol();
  const radar = new DimensionalRadar(origin3D, 5);

  const waveState = detector.sample();
  const reading = fluctuationDetector.measure(waveState);

  const parsed = reality.parseViaHypercomputation(
    voicePhrases,
    waveState,
    (phrase) =>
      invocationDetector.detect(phrase, reading) ?? {
        phrase,
        patternId: 'pattern_default',
        energySignature: [],
        confidence: 0.2,
        timestamp: Date.now(),
      }
  );

  const sweep = radar.sweep(parsed.intents, waveState);
  const results = enforce.mergeAndEngraveBatch(
    parsed.intents,
    waveState,
    origin3D,
    [0, 1, 0]
  );

  return {
    waveState,
    fluctuation: reading,
    parsed,
    sweep,
    engravings: results,
  };
}

const isMain = typeof process !== 'undefined' && process.argv[1]?.endsWith('index.js');
if (isMain) {
  const args = process.argv.slice(2);
  
  // Check for simple persistent mode
  if (args.includes('--simple') || args.includes('--persistent')) {
    console.log('Starting Magi Zone in simple persistent mode...');
    runSimplePersistentService().catch(error => {
      console.error('Simple persistent service startup failed:', error);
      process.exit(1);
    });
  }
  // Check for service mode
  else if (args.includes('--service') || args.includes('--bootstrap')) {
    console.log('Starting Magi Zone in persistent service mode...');
    runBootstrap().catch(error => {
      console.error('Service startup failed:', error);
      process.exit(1);
    });
  }
  // Check for netbuild mode
  else if (args.includes('--netbuild')) {
    console.log('Starting Magi Zone in netbuild mode...');
    // Netbuild mode logic would go here
    console.log('Netbuild mode activated - ready for dimensional operations');
  }
  // Check for .NET runtime mode
  else if (args.includes('--netruntime') || args.includes('--dotnet')) {
    console.log('Starting Magi Zone with .NET runtime...');
    import('./service/net-runtime-service.js').then(({ NetRuntimeService }) => {
      const config = {
        dotnetPath: 'dotnet',
        assemblyPath: 'n:\\magi-zone\\bin\\Debug\\net9.0\\MagiZone.Runtime.dll',
        arguments: ['--auto-load', '--service-mode'],
        workingDirectory: process.cwd(),
        autoStart: true,
        autoRestart: true,
        restartDelay: 3000,
        maxRestarts: 5,
        timeout: 30000,
        logPath: 'logs'
      };
      
      const netRuntime = new NetRuntimeService(config);
      netRuntime.on('ready', () => {
        console.log(' .NET runtime is ready');
      });
      
      netRuntime.on('assemblyLoaded', (path) => {
        console.log(` Assembly loaded: ${path}`);
      });
      
      netRuntime.initialize().then(() => {
        console.log(' .NET runtime service started successfully');
      }).catch(error => {
        console.error(' Failed to start .NET runtime:', error);
        process.exit(1);
      });
    }).catch(error => {
      console.error('Failed to load .NET runtime service:', error);
      process.exit(1);
    });
  }
  // Default demo mode
  else {
    const result = runCastingPipeline(['manifest shield', 'ward'], {
      origin3D: [0, 0, 0],
      defaultTier: 2,
      inDanger: true,
      movementVector: [1, 0, 0],
    });
    console.log('Mana fluctuation (voice wave):', result.manaFluctuation.voiceWaveFluctuation);
    console.log('Permitted casts:', result.results.filter((r) => r.permitted).length);
    console.log('Pocket magi count:', result.pocketMagiCount);
    console.log('Tiers used:', result.results.map((r) => r.tier));
    if (result.results[0]?.upscale) {
      console.log('Upscale physical position:', result.results[0].upscale.physicalPosition);
    }
  }
}
