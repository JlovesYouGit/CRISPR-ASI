"""
Demonstration Script for Human Biologic Enhancement System
Shows system capabilities and enhancement results
"""

from bio_enhancement_core import BioEnhancementCore, EnhancementType
import json
import time

def demonstrate_enhancement_system():
    """Demonstrate the complete enhancement system capabilities"""
    
    print("=" * 60)
    print("HUMAN BIOLOGIC ENHANCEMENT SYSTEM - DEMONSTRATION")
    print("=" * 60)
    
    # Initialize system
    print("\n🔧 INITIALIZING ENHANCEMENT SYSTEM...")
    enhancement_core = BioEnhancementCore()
    
    # Show initial system status
    print("\n📊 INITIAL SYSTEM STATUS:")
    initial_status = enhancement_core.get_system_status()
    display_system_status(initial_status, "BEFORE ENHANCEMENT")
    
    # Generate mana particles
    print(f"\n⚡ GENERATING MANA PARTICLES...")
    print(f"Creating 5000 mana particles for enhancement process...")
    enhancement_core._generate_mana_particles(5000)
    print(f"Mana reservoir contains {len(enhancement_core.mana_reservoir)} particles")
    
    # Execute enhancement sequence
    print(f"\n🚀 EXECUTING ENHANCEMENT SEQUENCE...")
    enhancement_sequence = [
        ("🧠 Neural Pathway Enhancement", EnhancementType.NEURAL_PATHWAY_ENHANCEMENT),
        ("💪 Muscle Fiber Optimization", EnhancementType.MUSCLE_FIBER_OPTIMIZATION),
        ("❤️  Cardiovascular Boost", EnhancementType.CARDIOVASCULAR_BOOST),
        ("🦴 Bone Structure Reinforcement", EnhancementType.BONE_STRUCTURE_REINFORCEMENT),
        ("👁️  Sensory Amplification", EnhancementType.SENSORY_AMPLIFICATION)
    ]
    
    for i, (name, enhancement_type) in enumerate(enhancement_sequence, 1):
        print(f"\n[{i}/5] {name}")
        print("-" * 40)
        
        # Apply enhancement
        success = enhancement_core.apply_enhancement(enhancement_type)
        
        if success:
            print(f"✅ {name} completed successfully")
            
            # Show immediate results for key enhancements
            if enhancement_type == EnhancementType.NEURAL_PATHWAY_ENHANCEMENT:
                nervous_system = enhancement_core.systems["nervous_system"]
                print(f"   Signal Speed: {nervous_system.current_state['signal_speed']:.1f} m/s")
                print(f"   Processing Power: {nervous_system.current_state['processing_power']:.2f}x baseline")
                print(f"   Reaction Time: {nervous_system.current_state['reaction_time']:.3f}s")
                
            elif enhancement_type == EnhancementType.MUSCLE_FIBER_OPTIMIZATION:
                muscle_system = enhancement_core.systems["muscular_system"]
                print(f"   Strength: {muscle_system.current_state['strength']:.2f}x baseline")
                print(f"   Endurance: {muscle_system.current_state['endurance']:.2f}x baseline")
                print(f"   Fiber Density: {muscle_system.current_state['fiber_density']:.3f}")
                
        else:
            print(f"❌ {name} failed")
        
        time.sleep(0.5)  # Brief pause for dramatic effect
    
    # Show final results
    print(f"\n🏆 FINAL ENHANCEMENT RESULTS:")
    print("=" * 50)
    final_status = enhancement_core.get_system_status()
    display_system_status(final_status, "AFTER ENHANCEMENT")
    
    # Calculate overall improvements
    print(f"\n📈 OVERALL IMPROVEMENT SUMMARY:")
    print("=" * 40)
    
    improvements = calculate_improvements(initial_status, final_status)
    for system_name, improvement_data in improvements.items():
        print(f"\n{system_name.upper().replace('_', ' ')}:")
        for metric, improvement in improvement_data.items():
            if isinstance(improvement, float):
                print(f"  {metric}: {improvement:+.2f}% improvement")
            else:
                print(f"  {metric}: {improvement}")

def display_system_status(status, title):
    """Display system status in a formatted way"""
    print(f"\n{title}:")
    print("-" * 30)
    
    for system_name, system_data in status.items():
        print(f"\n{system_name.replace('_', ' ').title()}:")
        current_state = system_data["current_state"]
        for metric, value in current_state.items():
            if isinstance(value, float):
                if metric == "reaction_time":
                    print(f"  {metric.replace('_', ' ').title()}: {value:.3f}s")
                elif metric == "heart_rate":
                    print(f"  {metric.replace('_', ' ').title()}: {value:.1f} BPM")
                else:
                    print(f"  {metric.replace('_', ' ').title()}: {value:.2f}x baseline")
            else:
                print(f"  {metric.replace('_', ' ').title()}: {value}")

def calculate_improvements(initial_status, final_status):
    """Calculate percentage improvements for each system"""
    improvements = {}
    
    for system_name in initial_status.keys():
        if system_name in final_status:
            initial_system = initial_status[system_name]["current_state"]
            final_system = final_status[system_name]["current_state"]
            
            system_improvements = {}
            for metric in initial_system.keys():
                if metric in final_system:
                    initial_value = initial_system[metric]
                    final_value = final_system[metric]
                    
                    if isinstance(initial_value, (int, float)) and initial_value != 0:
                        if metric == "reaction_time":
                            # For reaction time, lower is better
                            improvement = ((initial_value - final_value) / initial_value) * 100
                        elif metric == "heart_rate":
                            # For heart rate, lower can be better (more efficient)
                            improvement = ((initial_value - final_value) / initial_value) * 100
                        else:
                            # For other metrics, higher is better
                            improvement = ((final_value - initial_value) / initial_value) * 100
                        
                        system_improvements[metric] = improvement
            
            improvements[system_name] = system_improvements
    
    return improvements

def show_capabilities():
    """Show system capabilities and specifications"""
    print("\n⚙️  SYSTEM CAPABILITIES:")
    print("=" * 30)
    
    capabilities = {
        "Biological Systems": [
            "Muscle fiber optimization (3.5x strength)",
            "Neural pathway enhancement (4x processing)",
            "Cardiovascular boost (2.5x blood flow)",
            "Bone structure reinforcement (2x density)",
            "Sensory amplification (enhanced perception)",
            "Cellular regeneration acceleration"
        ],
        "Technical Features": [
            "Quantum-level calculations",
            "Bio-electric current transmission",
            "Real-time safety monitoring",
            "Geometric pattern formation",
            "Mana energy conversion",
            "Multi-system orchestration"
        ],
        "Safety Protocols": [
            "Subject validation (18-65 years)",
            "Vital sign monitoring",
            "Emergency shutdown systems",
            "Environmental parameter checking",
            "Automatic calibration"
        ]
    }
    
    for category, items in capabilities.items():
        print(f"\n{category}:")
        for item in items:
            print(f"  • {item}")

def main():
    """Main demonstration function"""
    demonstrate_enhancement_system()
    show_capabilities()
    
    print(f"\n" + "=" * 60)
    print("✨ DEMONSTRATION COMPLETE ✨")
    print("The Human Biologic Enhancement System is ready for deployment!")
    print("=" * 60)

if __name__ == "__main__":
    main()