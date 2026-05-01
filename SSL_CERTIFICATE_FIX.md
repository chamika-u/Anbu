# SSL Certificate Issue Fix Guide

## Problem
```
ERROR: Could not install packages due to an OSError: Could not find a suitable TLS CA certificate bundle, invalid path: C:\Program Files\PostgreSQL\18\ssl\certs\ca-bundle.crt
```

## Root Cause
PostgreSQL installation has set an environment variable `SSL_CERT_FILE` or `REQUESTS_CA_BUNDLE` pointing to a non-existent certificate file, which pip is trying to use for SSL verification.

---

## Solution 1: Unset the Environment Variable (Recommended)

### Temporary Fix (Current Session Only)
```powershell
# In PowerShell
$env:SSL_CERT_FILE = ""
$env:REQUESTS_CA_BUNDLE = ""

# Then try installing again
pip install -r backend/requirements.txt
```

### Permanent Fix (System-wide)
1. Open **System Properties**:
   - Press `Win + R`
   - Type `sysdm.cpl` and press Enter

2. Go to **Advanced** tab → Click **Environment Variables**

3. Look for these variables in both **User variables** and **System variables**:
   - `SSL_CERT_FILE`
   - `REQUESTS_CA_BUNDLE`
   - `CURL_CA_BUNDLE`

4. **Delete** or **Edit** them if they point to PostgreSQL's certificate path

5. Click **OK** to save changes

6. **Restart your terminal/PowerShell** and try again

---

## Solution 2: Use pip with --trusted-host (Bypass SSL)

```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
```

⚠️ **Warning:** This bypasses SSL verification. Use only if Solution 1 doesn't work.

---

## Solution 3: Point to Valid Certificate Bundle

### Option A: Use certifi package
```powershell
# Install certifi first
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org certifi

# Get the certificate path
python -c "import certifi; print(certifi.where())"

# Set the environment variable to this path
$env:SSL_CERT_FILE = "C:\path\to\certifi\cacert.pem"

# Then install requirements
pip install -r backend/requirements.txt
```

### Option B: Download and use Mozilla's CA bundle
1. Download from: https://curl.se/ca/cacert.pem
2. Save to a permanent location (e.g., `C:\certs\cacert.pem`)
3. Set environment variable:
   ```powershell
   $env:SSL_CERT_FILE = "C:\certs\cacert.pem"
   ```

---

## Solution 4: Fix PostgreSQL Certificate Path

If you need PostgreSQL's SSL certificates:

1. Check if the certificate file exists:
   ```powershell
   Test-Path "C:\Program Files\PostgreSQL\18\ssl\certs\ca-bundle.crt"
   ```

2. If it doesn't exist, create the directory and download certificates:
   ```powershell
   # Create directory
   New-Item -ItemType Directory -Force -Path "C:\Program Files\PostgreSQL\18\ssl\certs"
   
   # Download Mozilla's CA bundle
   Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\Program Files\PostgreSQL\18\ssl\certs\ca-bundle.crt"
   ```

---

## Verification Steps

After applying any solution:

1. **Check environment variables:**
   ```powershell
   Get-ChildItem Env: | Where-Object { $_.Name -like "*SSL*" -or $_.Name -like "*CA*" }
   ```

2. **Test pip:**
   ```powershell
   pip --version
   ```

3. **Try installing a simple package:**
   ```powershell
   pip install requests
   ```

4. **Install project requirements:**
   ```powershell
   pip install -r backend/requirements.txt
   ```

---

## Quick Fix Script

Save this as `fix_ssl.ps1` and run it:

```powershell
# Fix SSL Certificate Issue
Write-Host "Fixing SSL Certificate Issue..." -ForegroundColor Yellow

# Unset problematic environment variables
$env:SSL_CERT_FILE = ""
$env:REQUESTS_CA_BUNDLE = ""
$env:CURL_CA_BUNDLE = ""

Write-Host "Environment variables cleared for current session" -ForegroundColor Green

# Install certifi and get its certificate path
Write-Host "Installing certifi..." -ForegroundColor Yellow
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org certifi

# Get certifi path
$certPath = python -c "import certifi; print(certifi.where())"
Write-Host "Certifi certificate path: $certPath" -ForegroundColor Cyan

# Set SSL_CERT_FILE to certifi's bundle
$env:SSL_CERT_FILE = $certPath
Write-Host "SSL_CERT_FILE set to: $certPath" -ForegroundColor Green

# Try installing requirements
Write-Host "`nInstalling requirements..." -ForegroundColor Yellow
pip install -r backend/requirements.txt

Write-Host "`nDone! If successful, add this to your PowerShell profile:" -ForegroundColor Green
Write-Host "`$env:SSL_CERT_FILE = '$certPath'" -ForegroundColor Cyan
```

Run it:
```powershell
.\fix_ssl.ps1
```

---

## For Virtual Environment Users

If you're using a virtual environment (venv):

```powershell
# Activate venv first
.\venv\Scripts\Activate.ps1

# Then apply any of the solutions above
$env:SSL_CERT_FILE = ""
$env:REQUESTS_CA_BUNDLE = ""

# Install requirements
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
```

---

## Permanent Solution for Your System

Add to your PowerShell profile (`$PROFILE`):

```powershell
# Open profile
notepad $PROFILE

# Add these lines:
$env:SSL_CERT_FILE = ""
$env:REQUESTS_CA_BUNDLE = ""

# Or use certifi:
# $env:SSL_CERT_FILE = "C:\path\to\certifi\cacert.pem"
```

---

## Still Having Issues?

1. **Check PostgreSQL Environment Variables:**
   ```powershell
   Get-ChildItem Env: | Where-Object { $_.Value -like "*PostgreSQL*" }
   ```

2. **Reinstall pip:**
   ```powershell
   python -m pip install --upgrade --force-reinstall pip
   ```

3. **Use Python's built-in certificates:**
   ```powershell
   python -m pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
   ```

---

## Summary

**Quickest Fix:**
```powershell
$env:SSL_CERT_FILE = ""
$env:REQUESTS_CA_BUNDLE = ""
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
```

**Best Long-term Fix:**
Remove the PostgreSQL SSL environment variables from System Environment Variables permanently.