# Magi Zone - Dimensional Wave Detection System

A persistent dimensional wave detection, enforce protocol, and reality-tear invocation system that runs as a Windows service with automatic initialization and watchdog monitoring.

## Features

- **Persistent Service**: Runs as a Windows service that starts automatically on boot
- **Watchdog Monitoring**: Built-in health monitoring with activation threshold detection
- **Netbuild Integration**: Auto-initialization with netbuild functionality
- **Zero Terminal Required**: Fully automated operation without manual intervention
- **Health Logging**: Comprehensive logging and monitoring
- **Auto-Recovery**: Automatic restart on failure with configurable thresholds

## Quick Start

### Prerequisites

- Windows 10/11 or Windows Server 2016+
- Node.js 18+ installed
- Administrator privileges for service installation

### Installation

1. **Clone and Build**:
   ```bash
   npm install
   npm run build
   ```

2. **Install Service** (Run as Administrator):
   ```bash
   npm run setup
   ```
   
   Or manually:
   ```powershell
   # As Administrator
   npm run install-service
   ```

3. **Verify Installation**:
   ```bash
   sc query MagiZoneService
   ```

The service will now:
- Start automatically on Windows boot
- Run continuously with health monitoring
- Restart automatically if it crashes
- Log all activities to `n:\magi-zone\logs\`

## Usage

### Service Management

```bash
# Start service
net start MagiZoneService

# Stop service
net stop MagiZoneService

# Check status
sc query MagiZoneService

# View logs
type n:\magi-zone\logs\*.log
```

### Development Modes

```bash
# Normal execution
npm start

# Service mode (manual testing)
npm run service

# Netbuild mode
npm run netbuild

# Development with watch
npm run dev
```

## Configuration

The service uses default configuration which can be customized:

### Service Configuration

- **Service Name**: `MagiZoneService`
- **Display Name**: `Magi Zone Dimensional Service`
- **Startup Type**: Automatic
- **Watchdog Interval**: 30 seconds
- **Activation Threshold**: 10 events per minute

### Logging

Logs are stored in `n:\magi-zone\logs\`:
- `MagiZoneService.log` - Main service logs
- `MagiZone-watchdog.log` - Watchdog monitoring logs
- `netbuild-integration.log` - Netbuild process logs
- `netbuild-output.log` - Process stdout/stderr
- `persistent-service.log` - Overall system logs

## Architecture

### Core Components

1. **ServiceManager**: Windows service wrapper with installation/management
2. **Watchdog**: Health monitoring with activation threshold detection
3. **NetbuildIntegration**: Process management with auto-restart
4. **PersistentService**: Orchestrates all components

### Activation Threshold

The system monitors activation events and triggers when:
- More than 10 events occur within 1 minute
- Service health checks fail consecutively
- Process crashes or becomes unresponsive

### Auto-Recovery

- **Service Restart**: Automatic restart on failure
- **Process Recovery**: Netbuild process auto-restart with backoff
- **Health Monitoring**: Continuous health checks every 15 seconds
- **Failure Limits**: Maximum 10 restart attempts before manual intervention

## Uninstallation

To completely remove the service:

```bash
# As Administrator
npm run uninstall-service
```

Or manually:
```powershell
# As Administrator
Stop-Service MagiZoneService -Force
Remove-Service MagiZoneService
```

## Troubleshooting

### Service Won't Start

1. Check Node.js installation: `node --version`
2. Verify built files exist: `dir n:\magi-zone\dist\`
3. Check Windows Event Viewer for service errors
4. Review logs: `type n:\magi-zone\logs\*.log`

### High CPU/Memory Usage

1. Monitor activation thresholds in watchdog logs
2. Check for infinite loops in dimensional processing
3. Verify netbuild process health

### Logs Not Created

1. Ensure write permissions to `n:\magi-zone\logs\`
2. Check disk space availability
3. Verify service has proper file system access

## Development

### Project Structure

```
src/
├── service/           # Service management components
│   ├── service-manager.ts
│   ├── watchdog.ts
│   ├── netbuild-integration.ts
│   ├── persistent-service.ts
│   └── bootstrap.ts
├── device/           # Hardware detection
├── detection/        # Wave detection algorithms
├── protocol/         # Enforcement protocols
├── teleport/         # Dimensional teleportation
└── ...
scripts/              # Installation scripts
├── install-service.ps1
├── uninstall-service.ps1
└── setup.bat
```

### Building

```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode for development
```

## License

Dimensional wave detection and reality-tear invocation system. Use responsibly.
