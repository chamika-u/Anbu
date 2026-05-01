# Fix SSL Certificate Issue for pip
# Run this script in PowerShell: .\fix_ssl.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SSL Certificate Issue Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear problematic environment variables
Write-Host "[1/4] Clearing SSL environment variables..." -ForegroundColor Yellow
$env:SSL_CERT_FILE = ""
$env:REQUESTS_CA_BUNDLE = ""
$env:CURL_CA_BUNDLE = ""
Write-Host "      Done - Environment variables cleared" -ForegroundColor Green
Write-Host ""

# Step 2: Check current environment
Write-Host "[2/4] Checking SSL-related environment variables..." -ForegroundColor Yellow
$sslVars = Get-ChildItem Env: | Where-Object { $_.Name -like "*SSL*" -or $_.Name -like "*CA*" -or $_.Name -like "*CERT*" }
if ($sslVars) {
    Write-Host "      Found SSL-related variables:" -ForegroundColor Cyan
    foreach ($var in $sslVars) {
        Write-Host "      - $($var.Name) = $($var.Value)" -ForegroundColor Gray
    }
}
else {
    Write-Host "      Done - No problematic SSL variables found" -ForegroundColor Green
}
Write-Host ""

# Step 3: Install certifi
Write-Host "[3/4] Installing certifi package..." -ForegroundColor Yellow
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org certifi | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Done - certifi installed successfully" -ForegroundColor Green
}
else {
    Write-Host "      Warning - Could not install certifi, will use --trusted-host" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Install requirements
Write-Host "[4/4] Installing project requirements..." -ForegroundColor Yellow
Write-Host "      This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Installation Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create .env file from backend/config_template.txt" -ForegroundColor White
    Write-Host "2. Run backend: cd backend; python run.py" -ForegroundColor White
    Write-Host "3. Run frontend: cd frontend; npm run dev" -ForegroundColor White
}
else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Installation Failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    Write-Host "For more help, see SSL_CERTIFICATE_FIX.md" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To make these changes permanent, add to your PowerShell profile:" -ForegroundColor Cyan
Write-Host '  $env:SSL_CERT_FILE = ""' -ForegroundColor Gray
Write-Host '  $env:REQUESTS_CA_BUNDLE = ""' -ForegroundColor Gray
Write-Host ""

# Made with Bob
