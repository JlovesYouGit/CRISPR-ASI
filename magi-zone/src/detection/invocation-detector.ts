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

/** Maps voice phrases to pattern ids (hypercomputation-parsed) */
const PHRASE_PATTERN_MAP: Record<string, string> = {
  manifest: 'pattern_manifest',
  bind: 'pattern_bind',
  shield: 'pattern_shield',
  reveal: 'pattern_reveal',
  seal: 'pattern_seal',
  open: 'pattern_open',
  ward: 'pattern_ward',
  flow: 'pattern_flow',
};

export class InvocationDetector {
  /**
   * Detect invocation from voice/will text and current fluctuation (emotions/energy
   * surrounding matter and states). Returns intent for enforce protocol.
   * When invocation is cast by the user, appropriate to use – tier and inDanger
   * can be set so protocol permits and tier selector / danger override apply.
   */
  detect(
    voicePhrase: string,
    fluctuation: FluctuationReading,
    options?: InvocationDetectorOptions
  ): InvocationIntent | null {
    const normalized = voicePhrase.trim().toLowerCase();
    if (!normalized) return null;

    const words = normalized.split(/\s+/);
    let patternId = 'pattern_default';
    let confidence = 0.3;

    for (const word of words) {
      if (PHRASE_PATTERN_MAP[word]) {
        patternId = PHRASE_PATTERN_MAP[word];
        confidence = 0.85;
        break;
      }
    }

    const energySignature = [
      fluctuation.surroundingEnergy,
      fluctuation.constructiveCoherence,
      fluctuation.intensity,
      ...Object.values(fluctuation.activeAxes),
    ];

    return {
      phrase: voicePhrase,
      patternId,
      energySignature,
      confidence,
      tier: options?.tier,
      inDanger: options?.inDanger,
      timestamp: fluctuation.timestamp,
    };
  }

  /** Register a custom phrase -> pattern for hypercomputation parsing. */
  registerPhrase(phrase: string, patternId: string): void {
    PHRASE_PATTERN_MAP[phrase.trim().toLowerCase()] = patternId;
  }
}
