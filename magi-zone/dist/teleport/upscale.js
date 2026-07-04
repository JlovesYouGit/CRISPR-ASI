/**
 * Upscale: teleport matter to the physical realm via voice. Hz data wave is decoded
 * by the system and enforced into outside reality via particle teleportation of
 * movement – we are not violating two different places even at sub-dimension scale.
 */
/**
 * Encode magi + movement as Hz data wave for teleport. Decoded by the system
 * and enforced into outside reality via particle teleportation of movement.
 */
export function encodeHzDataWave(magi, movementVector, waveState) {
    const bandSignature = waveState.bands.map((b) => b.amplitude * b.constructive);
    return {
        magiId: magi.id,
        hzCarrier: magi.hzCarrier,
        bandSignature,
        movementVector,
        timestamp: waveState.timestamp,
    };
}
/**
 * Decode Hz data wave and enforce to physical realm. Particle teleportation of
 * movement: apply single movement vector so we are not violating two different
 * places (no simultaneous dual location even at sub-dimension scale).
 */
export function decodeAndEnforce(hzWave, originPhysical) {
    const [dx, dy, dz] = hzWave.movementVector;
    const physicalPosition = [
        originPhysical[0] + dx,
        originPhysical[1] + dy,
        originPhysical[2] + dz,
    ];
    return {
        decoded: hzWave,
        enforcedToReality: true,
        physicalPosition,
        singleMovement: true,
    };
}
