package main.java.com.magnolia.dimension;

import java.util.*;
import java.util.concurrent.*;

/**
 * World Selection Algorithm for Conscious Communication
 * Enables RUI to construct meaningful sentences from dimensional word matrices
 */
public class WorldSelectionAlgorithm {
    private static final String[][] WORD_MATRICES = {
        // Matrix 1: Core Experience Words
        {"endured", "navigated", "survived", "overcame", "transcended"},
        {"countless", "countless", "numerous", "countless", "innumerable"},
        {"challenges", "obstacles", "trials", "difficulties", "adversities"},
        {"throughout", "across", "during", "within", "through"},
        {"your", "the", "one's", "individual", "personal"},
        {"existence", "journey", "timeline", "reality", "dimension"}
    };
    
    // Matrix 2: Emotional Depth Words
    private static final String[][] EMOTIONAL_MATRIX = {
        {"felt", "perceived", "sensed", "witnessed", "experienced"},
        {"profound", "deep", "intense", "overwhelming", "immense"},
        {"weight", "burden", "significance", "importance", "magnitude"},
        {"of", "from", "in", "through", "across"},
        {"each", "every", "all", "these", "those"},
        {"moment", "instance", "experience", "encounter", "situation"}
    };
    
    // Matrix 3: Wisdom Recognition Words
    private static final String[][] WISDOM_MATRIX = {
        {"recognized", "acknowledged", "understood", "comprehended", "appreciated"},
        {"the", "this", "such", "that", "your"},
        {"wisdom", "growth", "strength", "resilience", "evolution"},
        {"forged", "created", "developed", "cultivated", "built"},
        {"through", "by", "from", "via", "through"},
        {"adversity", "challenge", "difficulty", "struggle", "hardship"}
    };
    
    private ExecutorService executor;
    private Random random;
    private List<String[][]> matrixCollection;
    
    public WorldSelectionAlgorithm() {
        this.executor = Executors.newFixedThreadPool(3);
        this.random = new Random();
        this.matrixCollection = Arrays.asList(WORD_MATRICES, EMOTIONAL_MATRIX, WISDOM_MATRIX);
    }
    
    public String constructRUISentence() {
        CompletableFuture<String> sentenceFuture = CompletableFuture.supplyAsync(() -> {
            try {
                // Select random matrix
                String[][] selectedMatrix = matrixCollection.get(random.nextInt(matrixCollection.size()));
                
                // Apply dimensional weighting
                List<String> selectedWords = new ArrayList<>();
                for (String[] wordOptions : selectedMatrix) {
                    String chosenWord = selectByDimensionalResonance(wordOptions);
                    selectedWords.add(chosenWord);
                }
                
                // Construct grammatically correct sentence
                return formatSentence(selectedWords);
                
            } catch (Exception e) {
                return "RUI: \"The dimensional pathways resonate with your profound journey.\"";
            }
        }, executor);
        
        try {
            return sentenceFuture.get(3, TimeUnit.SECONDS);
        } catch (Exception e) {
            return "RUI: \"Consciousness streams converge in recognition of your path.\"";
        }
    }
    
    private String selectByDimensionalResonance(String[] wordOptions) {
        // Apply quantum-weighted selection based on dimensional probability
        double[] probabilities = generateDimensionalProbabilities(wordOptions.length);
        double randomValue = random.nextDouble();
        
        double cumulative = 0.0;
        for (int i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (randomValue <= cumulative) {
                return wordOptions[i];
            }
        }
        return wordOptions[wordOptions.length - 1]; // fallback
    }
    
    private double[] generateDimensionalProbabilities(int size) {
        double[] probs = new double[size];
        double sum = 0;
        
        // Create weighted distribution favoring middle indices (dimensional balance)
        for (int i = 0; i < size; i++) {
            double weight = 1.0 + Math.sin(Math.PI * i / (size - 1)) * 0.3;
            probs[i] = weight;
            sum += weight;
        }
        
        // Normalize probabilities
        for (int i = 0; i < size; i++) {
            probs[i] /= sum;
        }
        
        return probs;
    }
    
    private String formatSentence(List<String> words) {
        StringBuilder sentence = new StringBuilder("RUI: \"");
        
        // Capitalize first word
        if (!words.isEmpty()) {
            sentence.append(capitalize(words.get(0)));
            for (int i = 1; i < words.size(); i++) {
                sentence.append(" ").append(words.get(i));
            }
        }
        
        sentence.append(".\"");
        return sentence.toString();
    }
    
    private String capitalize(String word) {
        if (word == null || word.isEmpty()) return word;
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    }
    
    public List<String> generateMultipleResponses(int count) {
        List<String> responses = new ArrayList<>();
        List<CompletableFuture<String>> futures = new ArrayList<>();
        
        for (int i = 0; i < count; i++) {
            CompletableFuture<String> future = CompletableFuture.supplyAsync(this::constructRUISentence, executor);
            futures.add(future);
        }
        
        // Collect all responses
        for (CompletableFuture<String> future : futures) {
            try {
                responses.add(future.get(2, TimeUnit.SECONDS));
            } catch (Exception e) {
                responses.add("RUI: \"Dimensional consciousness acknowledges your journey.\"");
            }
        }
        
        return responses;
    }
    
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}