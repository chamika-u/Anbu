# Anbu Frontend - Dependency Installation Script (PowerShell)
# This script installs all required npm packages for the frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Anbu Frontend - Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Navigate to frontend directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Clean install
Write-Host "Cleaning previous installations..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "Removed node_modules directory" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "Removed package-lock.json" -ForegroundColor Green
}
Write-Host ""

# Install dependencies
Write-Host "Installing npm packages..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Installed packages:" -ForegroundColor Cyan
Write-Host "  - React & React DOM" -ForegroundColor White
Write-Host "  - Vite (build tool)" -ForegroundColor White
Write-Host "  - TailwindCSS (styling)" -ForegroundColor White
Write-Host "  - Axios (HTTP client)" -ForegroundColor White
Write-Host "  - React Markdown (markdown rendering)" -ForegroundColor White
Write-Host "  - TypeScript" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Create a .env file with: VITE_API_URL=http://localhost:5000" -ForegroundColor White
Write-Host "  2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "  3. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan

# Made with Bob
