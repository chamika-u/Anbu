# PowerShell script to update WatsonX model in backend/.env

$envFile = "backend\.env"

if (Test-Path $envFile) {
    Write-Host "Found .env file at: $envFile" -ForegroundColor Green
    
    # Read the file content
    $content = Get-Content $envFile -Raw
    
    # Replace the old model with the new one
    $oldModel = "IBM_WATSONX_MODEL_ID=ibm/granite-13b-chat-v2"
    $newModel = "IBM_WATSONX_MODEL_ID=meta-llama/llama-3-3-70b-instruct"
    
    if ($content -match "IBM_WATSONX_MODEL_ID") {
        $content = $content -replace "IBM_WATSONX_MODEL_ID=.*", $newModel
        Set-Content -Path $envFile -Value $content -NoNewline
        Write-Host "`nSuccessfully updated model to: meta-llama/llama-3-3-70b-instruct" -ForegroundColor Green
        Write-Host "`nPlease restart the backend server:" -ForegroundColor Yellow
        Write-Host "  1. Press Ctrl+C in the backend terminal" -ForegroundColor Yellow
        Write-Host "  2. Run: cd backend; python run.py" -ForegroundColor Yellow
    } else {
        # Add the model line if it doesn't exist
        $content += "`n$newModel"
        Set-Content -Path $envFile -Value $content -NoNewline
        Write-Host "`nAdded model configuration: meta-llama/llama-3-3-70b-instruct" -ForegroundColor Green
        Write-Host "`nPlease restart the backend server:" -ForegroundColor Yellow
        Write-Host "  1. Press Ctrl+C in the backend terminal" -ForegroundColor Yellow
        Write-Host "  2. Run: cd backend; python run.py" -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: .env file not found at $envFile" -ForegroundColor Red
    Write-Host "Please create the file first or check the path." -ForegroundColor Red
}

# Made with Bob
