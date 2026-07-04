/**
 * Actuation: command type and target, and readiness so all variables are
 * accounted for before execution – prevents misfires.
 */
import type { Vec3 } from './optimal-point.js';
/** Command type for actuation (cast, invocation, etc.) */
export type CommandType = 'cast' | 'invoke' | 'ward' | 'manifest' | 'shield' | 'bind' | 'reveal' | 'seal' | 'open' | 'flow';
/** Target of the command: position in space, self, or direction-only */
export type ActuationTarget = {
    type: 'position';
    value: Vec3;
} | {
    type: 'self';
    value: null;
} | {
    type: 'direction';
    value: Vec3;
};
/** Result of pre-flight: all variables accounted for; ready to execute or block reasons */
export type ActuationReadiness = {
    ready: boolean;
    /** All variables that were checked */
    variablesAccounted: {
        commandType: CommandType;
        target: ActuationTarget;
        userEntryPointValid: boolean;
        optimalFormationValid: boolean;
        userUnaffected: boolean;
        manaSufficient: boolean;
        calculusPermitted: boolean;
        intentConfidenceOk: boolean;
        targetInRange: boolean;
        patternIdValid: boolean;
    };
    /** If not ready, why execution was blocked (misfire prevented) */
    blockReasons: string[];
};
