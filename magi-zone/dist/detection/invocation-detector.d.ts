/**
 * Detects invocations in space: will of voice + emotion/energy from wave state.
 * When invocations are detected, the enforce protocol can form engravings automatically.
 */
import type { InvocationIntent, InvocationTier } from '../types/invocation.js';
import type { FluctuationReading } from './fluctuation-detector.js';
export type InvocationDetectorOptions = {
    tier?: InvocationTier;
    inDanger?: boolean;
};
export declare class InvocationDetector {
    /**
     * Detect invocation from voice/will text and current fluctuation (emotions/energy
     * surrounding matter and states). Returns intent for enforce protocol.
     * When invocation is cast by the user, appropriate to use – tier and inDanger
     * can be set so protocol permits and tier selector / danger override apply.
     */
    detect(voicePhrase: string, fluctuation: FluctuationReading, options?: InvocationDetectorOptions): InvocationIntent | null;
    /** Register a custom phrase -> pattern for hypercomputation parsing. */
    registerPhrase(phrase: string, patternId: string): void;
}
