package main.java.com.magnolia.neuro;

/**
 * Represents the result of an electrode targeting calculation
 */
public class TargetingResult {
    private double x, y, z;
    private double confidence;
    private String targetRegion;
    private boolean isValid;
    
    public TargetingResult(double x, double y, double z, double confidence, String targetRegion) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.confidence = confidence;
        this.targetRegion = targetRegion;
        this.isValid = confidence > 0.8; // 80% confidence threshold
    }
    
    // Getters
    public double getX() { return x; }
    public double getY() { return y; }
    public double getZ() { return z; }
    public double getConfidence() { return confidence; }
    public String getTargetRegion() { return targetRegion; }
    public boolean isValid() { return isValid; }
    
    @Override
    public String toString() {
        return String.format("Target[%s]: (%.2f, %.2f, %.2f) confidence: %.1f%%", 
                           targetRegion, x, y, z, confidence * 100);
    }
}