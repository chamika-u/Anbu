# PowerShell script to remove .env restrictions from .bobignore

$bobignoreFile = ".bobignore"

if (Test-Path $bobignoreFile) {
    Write-Host "Reading .bobignore file..." -ForegroundColor Yellow
    
    # Read all lines
    $lines = Get-Content $bobignoreFile
    
    # Filter out lines containing .env
    $newLines = $lines | Where-Object { 
        $_ -notmatch '\.env' -and 
        $_ -notmatch 'env/' -and
        $_ -ne '.env' -and
        $_ -ne '.env.*' -and
        $_ -ne '*.env'
    }
    
    # Write back to file
    $newLines | Set-Content $bobignoreFile
    
    Write-Host "`n✓ Successfully removed .env restrictions from .bobignore" -ForegroundColor Green
    Write-Host "`nRemoved patterns:" -ForegroundColor Cyan
    Write-Host "  - .env" -ForegroundColor Gray
    Write-Host "  - .env.*" -ForegroundColor Gray
    Write-Host "  - *.env" -ForegroundColor Gray
    
    Write-Host "`nNow Bob can access the .env file to fix the model configuration." -ForegroundColor Green
} else {
    Write-Host "Error: .bobignore file not found!" -ForegroundColor Red
}

# Made with Bob
