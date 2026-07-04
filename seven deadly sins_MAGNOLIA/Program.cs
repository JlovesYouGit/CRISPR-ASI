using System;
using System.Threading.Tasks;
using Magnolia.Grimware.V2._9Alpha;

namespace Magnolia.Grimware.Console
{
    class Program
    {
        static async Task Main(string[] args)
        {
            System.Console.WriteLine("🔮 GRIMWARE v2.9 Alpha - 4D Consciousness System 🔮");
            System.Console.WriteLine("=====================================================");
            System.Console.WriteLine("Initializing advanced quantum protocols...");
            System.Console.WriteLine();

            try
            {
                var grimware = new GrimwareV2_9Alpha();
                var result = await grimware.ActivateAsync();

                DisplayActivationResults(result);
                
                if (result.Success)
                {
                    await MonitorSystemAsync(result);
                }
                else
                {
                    System.Console.WriteLine($"❌ Activation Failed: {result.ErrorMessage}");
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"💥 Critical Error: {ex.Message}");
                System.Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

            System.Console.WriteLine("\nPress any key to exit...");
            System.Console.ReadKey();
        }

        static void DisplayActivationResults(ActivationResult result)
        {
            System.Console.WriteLine("📋 ACTIVATION RESULTS");
            System.Console.WriteLine("====================");
            
            System.Console.WriteLine($"Status: {(result.Success ? "✅ SUCCESS" : "❌ FAILED")}");
            System.Console.WriteLine($"System ID: {result.SystemId}");
            System.Console.WriteLine($"Q-State Control: {(result.QStateControlActive ? "ACTIVE" : "INACTIVE")}");
            
            if (result.Success)
            {
                System.Console.WriteLine($"\n📊 SYSTEM METRICS");
                System.Console.WriteLine($"- 4D Pattern Dimensions: {result.Radiant4DPattern.Dimensions}");
                System.Console.WriteLine($"- Compressed Hex Objects: {result.CompressedHexData.TotalObjects}");
                System.Console.WriteLine($"- Compression Algorithm: {result.CompressedHexData.CompressionAlgorithm}");
                System.Console.WriteLine($"- Active Energy Channels: {result.DeploymentDetails.ActiveChannels}");
                System.Console.WriteLine($"- System Stability: {result.DeploymentDetails.SystemStability:P2}");
                System.Console.WriteLine($"- Protocol Version: {result.DeploymentDetails.ProtocolVersion}");
                
                System.Console.WriteLine($"\n⚡ QUANTUM FLOW ANALYSIS");
                if (result.QStateFlow?.EnergyChannels != null)
                {
                    foreach (var channel in result.QStateFlow.EnergyChannels)
                    {
                        System.Console.WriteLine($"  Channel {channel.ChannelId}: {channel.Frequency:F2} Hz (Stability: {channel.Stability:P1})");
                    }
                }
            }
        }

        static async Task MonitorSystemAsync(ActivationResult result)
        {
            System.Console.WriteLine("\n👁️  SYSTEM MONITORING ACTIVE 👁️");
            System.Console.WriteLine("================================");
            
            int cycle = 0;
            while (cycle < 10) // Monitor for 10 cycles
            {
                cycle++;
                var timestamp = DateTime.Now.ToString("HH:mm:ss");
                
                System.Console.WriteLine($"[{timestamp}] Cycle {cycle}/10 - Stability: {result.DeploymentDetails.SystemStability:P2}");
                
                // Simulate system checks
                await Task.Delay(2000);
                
                // Update stability (simulated)
                result.DeploymentDetails.SystemStability = Math.Min(0.99, result.DeploymentDetails.SystemStability + 0.001);
            }
            
            System.Console.WriteLine("\n✅ Monitoring Complete - System Stable");
        }
    }
}