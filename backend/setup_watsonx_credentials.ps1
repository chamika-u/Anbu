# WatsonX Credentials Setup Script
# This script will update your backend/.env file with WatsonX credentials

Write-Host "Setting up WatsonX AI credentials..." -ForegroundColor Green

$envFile = "backend/.env"

# Your WatsonX credentials
$apiKey = "s6MP6hc0MdmpO9uaHeHhhyrKT00sJQ-Dl8HOYbIv2ODc"
$projectId = "c41f5293-add5-43fe-96f0-2fd71939e625"
$url = "https://us-south.ml.cloud.ibm.com"
$modelId = "ibm/granite-13b-chat-v2"

# Check if .env file exists
if (Test-Path $envFile) {
    Write-Host "Found existing .env file" -ForegroundColor Yellow
    
    # Read current content
    $content = Get-Content $envFile -Raw
    
    # Update or add WatsonX credentials
    if ($content -match "IBM_WATSONX_API_KEY=") {
        $content = $content -replace "IBM_WATSONX_API_KEY=.*", "IBM_WATSONX_API_KEY=$apiKey"
        Write-Host "Updated IBM_WATSONX_API_KEY" -ForegroundColor Cyan
    } else {
        $content += "`nIBM_WATSONX_API_KEY=$apiKey"
        Write-Host "Added IBM_WATSONX_API_KEY" -ForegroundColor Cyan
    }
    
    if ($content -match "IBM_WATSONX_PROJECT_ID=") {
        $content = $content -replace "IBM_WATSONX_PROJECT_ID=.*", "IBM_WATSONX_PROJECT_ID=$projectId"
        Write-Host "Updated IBM_WATSONX_PROJECT_ID" -ForegroundColor Cyan
    } else {
        $content += "`nIBM_WATSONX_PROJECT_ID=$projectId"
        Write-Host "Added IBM_WATSONX_PROJECT_ID" -ForegroundColor Cyan
    }
    
    if ($content -match "IBM_WATSONX_URL=") {
        $content = $content -replace "IBM_WATSONX_URL=.*", "IBM_WATSONX_URL=$url"
        Write-Host "Updated IBM_WATSONX_URL" -ForegroundColor Cyan
    } else {
        $content += "`nIBM_WATSONX_URL=$url"
        Write-Host "Added IBM_WATSONX_URL" -ForegroundColor Cyan
    }
    
    if ($content -match "IBM_WATSONX_MODEL_ID=") {
        $content = $content -replace "IBM_WATSONX_MODEL_ID=.*", "IBM_WATSONX_MODEL_ID=$modelId"
        Write-Host "Updated IBM_WATSONX_MODEL_ID" -ForegroundColor Cyan
    } else {
        $content += "`nIBM_WATSONX_MODEL_ID=$modelId"
        Write-Host "Added IBM_WATSONX_MODEL_ID" -ForegroundColor Cyan
    }
    
    # Write back to file
    $content | Set-Content $envFile -NoNewline
    
} else {
    Write-Host "Creating new .env file" -ForegroundColor Yellow
    
    $newContent = @"
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# IBM WatsonX AI Configuration
IBM_WATSONX_API_KEY=$apiKey
IBM_WATSONX_PROJECT_ID=$projectId
IBM_WATSONX_URL=$url
IBM_WATSONX_MODEL_ID=$modelId

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
"@
    
    $newContent | Set-Content $envFile
}

Write-Host "`n✓ WatsonX credentials configured successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Restart the backend server (Ctrl+C in Terminal 1, then run: python backend/run.py)" -ForegroundColor White
Write-Host "2. Test the application by analyzing a GitHub repository" -ForegroundColor White
Write-Host "`nThe application will now use IBM WatsonX AI for documentation generation!" -ForegroundColor Green

# Made with Bob
