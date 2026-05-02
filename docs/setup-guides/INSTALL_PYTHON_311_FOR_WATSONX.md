# Install Python 3.11 for WatsonX AI - Step by Step Guide

**IMPORTANT:** WatsonX AI packages REQUIRE Python 3.11 or 3.12. Python 3.14 is NOT compatible.

---

## 🎯 Goal
Install Python 3.11 alongside Python 3.14 and create a working environment with WatsonX AI.

---

## 📋 Step-by-Step Instructions

### Step 1: Download Python 3.11

1. Go to: https://www.python.org/downloads/
2. Scroll down to find **Python 3.11.x** (latest 3.11 version)
3. Click on the version to download
4. Download **Windows installer (64-bit)**

### Step 2: Install Python 3.11

1. Run the downloaded installer
2. ✅ **IMPORTANT:** Check "Add python.exe to PATH"
3. ✅ **IMPORTANT:** Check "Install for all users" (optional but recommended)
4. Click "Install Now"
5. Wait for installation to complete
6. Click "Close"

### Step 3: Verify Python 3.11 Installation

Open PowerShell and run:

```powershell
# Check if Python 3.11 is installed
py -3.11 --version
```

You should see: `Python 3.11.x`

### Step 4: Remove Old Virtual Environment

```powershell
# Navigate to project directory
cd E:\Anbu

# Deactivate current venv if active
deactivate

# Remove old venv
Remove-Item -Recurse -Force venv
```

### Step 5: Create New Virtual Environment with Python 3.11

```powershell
# Create new venv with Python 3.11
py -3.11 -m venv venv

# Activate the new venv
.\venv\Scripts\Activate.ps1

# Verify Python version in venv
python --version
# Should show: Python 3.11.x
```

### Step 6: Upgrade pip

```powershell
python -m pip install --upgrade pip
```

### Step 7: Install All Dependencies (Including WatsonX)

```powershell
# Install all requirements
pip install -r backend/requirements.txt
```

This should now install ALL packages including:
- ✅ Flask and all core packages
- ✅ ibm-watson
- ✅ ibm-cloud-sdk-core
- ✅ ibm-watsonx-ai

### Step 8: Verify Installation

```powershell
# Check if WatsonX packages are installed
pip list | Select-String "ibm"
```

You should see:
```
ibm-cloud-sdk-core    3.19.0
ibm-watson            8.0.0
ibm-watsonx-ai        0.2.6
```

### Step 9: Run Tests

```powershell
# Test backend
python -m pytest backend/tests/test_health.py -v
```

Should show: `1 passed`

---

## 🚀 Quick Command Summary

```powershell
# 1. Remove old venv
Remove-Item -Recurse -Force venv

# 2. Create new venv with Python 3.11
py -3.11 -m venv venv

# 3. Activate venv
.\venv\Scripts\Activate.ps1

# 4. Verify Python version
python --version

# 5. Upgrade pip
python -m pip install --upgrade pip

# 6. Install all dependencies
pip install -r backend/requirements.txt

# 7. Verify WatsonX packages
pip list | Select-String "ibm"

# 8. Run tests
python -m pytest backend/tests/test_health.py -v
```

---

## ⚠️ Troubleshooting

### Problem: "py -3.11" not found

**Solution:** Python 3.11 is not installed or not in PATH
- Reinstall Python 3.11
- Make sure to check "Add to PATH" during installation

### Problem: SSL Certificate Error

**Solution:** Run the fix script first
```powershell
.\fix_ssl.ps1
```

### Problem: Still getting pkg_resources error

**Solution:** You're still using Python 3.14
```powershell
# Check Python version in venv
python --version

# If it shows 3.14, recreate venv:
deactivate
Remove-Item -Recurse -Force venv
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Python 3.11 is installed: `py -3.11 --version`
- [ ] Virtual environment uses Python 3.11: `python --version` (in venv)
- [ ] All packages installed: `pip list` shows 50+ packages
- [ ] WatsonX packages installed: `pip show ibm-watsonx-ai`
- [ ] Tests pass: `pytest backend/tests/test_health.py -v`

---

## 🎯 Expected Result

After following these steps, you should have:

✅ Python 3.11 installed alongside Python 3.14
✅ Virtual environment using Python 3.11
✅ All 50 packages installed (including IBM Watson)
✅ WatsonX AI fully functional
✅ Tests passing

---

## 📝 Notes

- Python 3.11 and 3.14 can coexist on the same system
- Use `py -3.11` to specifically run Python 3.11
- Use `py -3.14` to specifically run Python 3.14
- The venv will use whichever Python version you specify when creating it
- Always activate the venv before running the application

---

## 🚀 After Installation - Run the Application

```powershell
# 1. Create .env file (one time)
Copy-Item backend/config_template.txt backend/.env
# Edit backend/.env with your IBM WatsonX credentials

# 2. Start Backend
cd backend
python run.py

# 3. Start Frontend (new terminal)
cd frontend
npm run dev
```

---

## 📞 Need Help?

If you encounter issues:
1. Make sure Python 3.11 is installed: `py -3.11 --version`
2. Make sure venv is using Python 3.11: `python --version` (should show 3.11.x)
3. Check the error message carefully
4. Refer to [`SSL_CERTIFICATE_FIX.md`](SSL_CERTIFICATE_FIX.md) for SSL issues

---

**Remember:** WatsonX AI REQUIRES Python 3.11 or 3.12. Python 3.14 will NOT work!