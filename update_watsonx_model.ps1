# PowerShell script to update WatsonX model in backend/.env

$envFile = "backend\.env"

if (Test-Path $envFile) {
    Write-Host "Found backend/.env file" -ForegroundColor Green
    
    # Read the file content
    $content = Get-Content $envFile -Raw
    
    # Replace the old model with the new one
    $newContent = $content -replace 'IBM_WATSONX_MODEL_ID=ibm/granite-13b-chat-v2', 'IBM_WATSONX_MODEL_ID=meta-llama/llama-3-3-70b-instruct'
    
    # Write back to file
    Set-Content -Path $envFile -Value $newContent -NoNewline
    
    Write-Host "`nSuccessfully updated IBM_WATSONX_MODEL_ID to meta-llama/llama-3-3-70b-instruct" -ForegroundColor Green
    Write-Host "`nPlease restart your backend server:" -ForegroundColor Yellow
    Write-Host "1. Press Ctrl+C in the backend terminal" -ForegroundColor Yellow
    Write-Host "2. Run: cd backend; python run.py" -ForegroundColor Yellow
} else {
    Write-Host "Error: backend/.env file not found!" -ForegroundColor Red
    Write-Host "Please create it from backend/config_template.txt" -ForegroundColor Yellow
}

# Made with Bob
