# Magi Zone Service Uninstallation Script
# This script removes the Magi Zone service from Windows

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "MagiZoneService",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "This script must be run as Administrator"
    exit 1
}

Write-Host "Uninstalling Magi Zone Service..." -ForegroundColor Red

# Check if service exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if (-NOT $existingService) {
    Write-Warning "Service '$ServiceName' does not exist"
    exit 0
}

# Stop the service if it's running
if ($existingService.Status -eq "Running") {
    Write-Host "Stopping service..." -ForegroundColor Yellow
    try {
        Stop-Service -Name $ServiceName -Force
        Write-Host "Service stopped" -ForegroundColor Green
    } catch {
        Write-Warning "Failed to stop service: $_"
        if (-NOT $Force) {
            exit 1
        }
    }
}

# Remove the service
Write-Host "Removing service..." -ForegroundColor Yellow
try {
    Remove-Service -Name $ServiceName -Force
    Write-Host "Service removed successfully" -ForegroundColor Green
} catch {
    Write-Error "Failed to remove service: $_"
    exit 1
}

# Clean up log files (optional)
$logPath = "n:\magi-zone\logs"
if (Test-Path $logPath) {
    Write-Host "Log files remain in: $logPath" -ForegroundColor Cyan
    Write-Host "To remove logs manually: Remove-Item -Recurse -Force '$logPath'" -ForegroundColor Gray
}

Write-Host "Uninstallation completed successfully!" -ForegroundColor Green
