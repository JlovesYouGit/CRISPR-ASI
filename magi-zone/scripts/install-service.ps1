# Magi Zone Service Installation Script
# This script installs the Magi Zone service to run persistently on Windows

param(
    [Parameter(Mandatory=$false)]
    [string]$ServicePath = "n:\magi-zone\dist\index.js",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "MagiZoneService",
    
    [Parameter(Mandatory=$false)]
    [string]$DisplayName = "Magi Zone Dimensional Service",
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "Dimensional wave detection, enforce protocol, and reality-tear invocation system",
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoStart = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "This script must be run as Administrator"
    exit 1
}

Write-Host "Installing Magi Zone Service..." -ForegroundColor Green

# Check if service already exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if ($existingService) {
    if ($Force) {
        Write-Host "Removing existing service..." -ForegroundColor Yellow
        Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
        Remove-Service -Name $ServiceName -Force
        Start-Sleep -Seconds 2
    } else {
        Write-Error "Service '$ServiceName' already exists. Use -Force to overwrite."
        exit 1
    }
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Error "Node.js is not installed or not in PATH"
    exit 1
}

# Check if the service executable exists
if (-NOT (Test-Path $ServicePath)) {
    Write-Error "Service executable not found at: $ServicePath"
    exit 1
}

# Create log directory
$logPath = "n:\magi-zone\logs"
if (-NOT (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
    Write-Host "Created log directory: $logPath" -ForegroundColor Cyan
}

# Build the service command
$serviceCommand = "`"$ServicePath`" --service --auto-init"

# Create the service
Write-Host "Creating Windows service..." -ForegroundColor Cyan
New-Service -Name $ServiceName -DisplayName $DisplayName -Description $Description -BinaryPathName $serviceCommand -StartupType Automatic

if ($?) {
    Write-Host "Service created successfully" -ForegroundColor Green
    
    # Set service recovery options
    Write-Host "Configuring service recovery options..." -ForegroundColor Cyan
    $service = Get-WmiObject -Class Win32_Service -Filter "Name='$ServiceName'"
    $service.Change($null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, $null, 1, 60000, 1, 300000, 1, 900000) | Out-Null
    
    # Configure service to restart on failure
    sc.exe failure $ServiceName reset= 86400 actions= restart/60000/restart/300000/restart/900000
    
    if ($AutoStart) {
        Write-Host "Starting service..." -ForegroundColor Cyan
        Start-Service -Name $ServiceName
        
        if ($?) {
            Write-Host "Service started successfully" -ForegroundColor Green
        } else {
            Write-Warning "Service created but failed to start. Check event logs for details."
        }
    }
    
    Write-Host "Installation completed successfully!" -ForegroundColor Green
    Write-Host "Service name: $ServiceName"
    Write-Host "Display name: $DisplayName"
    Write-Host "Log directory: $logPath"
    Write-Host ""
    Write-Host "To manage the service:"
    Write-Host "  Start:    Start-Service $ServiceName"
    Write-Host "  Stop:     Stop-Service $ServiceName"
    Write-Host "  Status:   Get-Service $ServiceName"
    Write-Host "  Remove:   Remove-Service $ServiceName"
    
} else {
    Write-Error "Failed to create service"
    exit 1
}
