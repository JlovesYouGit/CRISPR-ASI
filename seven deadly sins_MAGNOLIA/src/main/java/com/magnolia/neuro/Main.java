package main.java.com.magnolia.neuro;

/**
 * Main entry point for the MAGNOLIA Neuro Targeting System
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("=== MAGNOLIA Neuro Targeting System v1.0 ===");
        System.out.println("Initializing advanced neural electrode targeting...");
        
        ElectrodeTargetingSystem targetingSystem = new ElectrodeTargetingSystem();
        
        // Test targeting calculations
        double[][] testTargets = {
            {15.0, 10.0, 25.0},  // Prefrontal cortex
            {-5.0, 15.0, 10.0},  // Motor cortex
            {8.0, -12.0, -5.0},  // Somatosensory cortex
            {-20.0, 5.0, -30.0}  // Temporal lobe
        };
        
        System.out.println("\n--- Targeting Calculations ---");
        for (int i = 0; i < testTargets.length; i++) {
            double[] target = testTargets[i];
            TargetingResult result = targetingSystem.calculateTargeting(
                target[0], target[1], target[2]);
            
            System.out.printf("Test %d: ", i + 1);
            if (result.isValid()) {
                System.out.println(result.toString());
                
                // Validate trajectory
                boolean safeTrajectory = targetingSystem.validateTrajectory(
                    0, 0, 0, result.getX(), result.getY(), result.getZ());
                System.out.println("  Trajectory Safety: " + (safeTrajectory ? "✓ SAFE" : "✗ UNSAFE"));
            } else {
                System.out.println("INVALID TARGET - Out of brain bounds");
            }
            System.out.println();
        }
        
        System.out.println("=== System Analysis Complete ===");
    }
}