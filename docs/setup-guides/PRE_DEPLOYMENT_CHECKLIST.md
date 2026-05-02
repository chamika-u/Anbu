# Pre-Deployment Checklist for Anbu

This checklist ensures all dependencies are installed and the project is ready for IBM Cloud deployment.

## ✅ Backend Setup Checklist

### 1. Python Environment
- [ ] Python 3.8+ installed
- [ ] Virtual environment created (`venv/` directory exists)
- [ ] Virtual environment activated

### 2. Dependencies Installation
- [ ] Run installation script:
  - **Windows**: `.\install_dependencies.ps1`
  - **Linux/Mac**: `chmod +x install_dependencies.sh && ./install_dependencies.sh`
- [ ] All packages installed successfully
- [ ] No error messages in installation output

### 3. Required Python Packages
Verify these packages are installed:
- [ ] Flask==3.0.0
- [ ] Flask-CORS==4.0.0
- [ ] Flask-SQLAlchemy==3.1.1
- [ ] python-dotenv==1.0.0
- [ ] requests==2.31.0
- [ ] ibm-watson==8.0.0
- [ ] ibm-cloud-sdk-core==3.19.0
- [ ] ibm-watsonx-ai==0.2.6
- [ ] pytest==7.4.3
- [ ] pytest-cov==4.1.0
- [ ] black==23.12.1
- [ ] flake8==7.0.0

**Verification Command:**
```bash
pip list
```

### 4. Configuration Files
- [ ] Copy [`config_template.txt`](../backend/config_template.txt) to `backend/.env`
- [ ] `.env` file created in backend directory
- [ ] All required environment variables set (see below)

### 5. Environment Variables (`.env` file)
Required variables:
- [ ] `FLASK_ENV=development`
- [ ] `SECRET_KEY=<your-secret-key>`
- [ ] `PORT=5000`
- [ ] `DATABASE_URL=sqlite:///anbu.db`

IBM WatsonX AI (Required):
- [ ] `IBM_WATSONX_API_KEY=<your-api-key>`
- [ ] `IBM_WATSONX_PROJECT_ID=<your-project-id>`
- [ ] `IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com`
- [ ] `IBM_WATSONX_MODEL_ID=ibm/granite-13b-chat-v2`

IBM Watson Assistant (Optional):
- [ ] `IBM_WATSON_API_KEY=<your-api-key>` (if using)
- [ ] `IBM_WATSON_ASSISTANT_ID=<your-assistant-id>` (if using)
- [ ] `IBM_WATSON_URL=<your-watson-url>` (if using)
- [ ] `IBM_WATSON_VERSION=2021-11-27` (if using)

Upload Configuration:
- [ ] `UPLOAD_FOLDER=uploads`
- [ ] `MAX_CONTENT_LENGTH=16777216`

### 6. Directory Structure
Verify these directories exist:
- [ ] `backend/app/`
- [ ] `backend/app/models/`
- [ ] `backend/app/routes/`
- [ ] `backend/app/services/`
- [ ] `backend/tests/`
- [ ] `backend/venv/` (after virtual environment creation)

### 7. Backend Files
Verify these files exist:
- [ ] `backend/run.py`
- [ ] `backend/requirements.txt`
- [ ] `backend/config_template.txt`
- [ ] `backend/app/__init__.py`
- [ ] `backend/app/models/__init__.py`
- [ ] `backend/app/models/conversation.py`
- [ ] `backend/app/models/document.py`
- [ ] `backend/app/routes/__init__.py`
- [ ] `backend/app/routes/health.py`
- [ ] `backend/app/routes/chat.py`
- [ ] `backend/app/routes/documents.py`
- [ ] `backend/app/services/__init__.py`
- [ ] `backend/app/services/watsonx_service.py`
- [ ] `backend/app/services/document_service.py`
- [ ] `backend/tests/__init__.py`
- [ ] `backend/tests/test_health.py`

## ✅ Frontend Setup Checklist

### 1. Node.js Environment
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed

### 2. Dependencies Installation
- [ ] Navigate to `frontend/` directory
- [ ] Run `npm install`
- [ ] All packages installed successfully
- [ ] `node_modules/` directory created

### 3. Frontend Files
Verify these files exist:
- [ ] `frontend/package.json`
- [ ] `frontend/vite.config.ts`
- [ ] `frontend/tsconfig.json`
- [ ] `frontend/index.html`
- [ ] `frontend/src/main.tsx`
- [ ] `frontend/src/App.tsx`

## ✅ IBM Cloud Setup Checklist

### 1. IBM Cloud Account
- [ ] IBM Cloud account created
- [ ] Logged into IBM Cloud console

### 2. WatsonX AI Service
- [ ] WatsonX AI service created
- [ ] Project created in WatsonX
- [ ] API key generated
- [ ] Project ID obtained
- [ ] Service URL noted

### 3. Watson Assistant (Optional)
- [ ] Watson Assistant service created (if using)
- [ ] Assistant created
- [ ] API key generated
- [ ] Assistant ID obtained
- [ ] Service URL noted

### 4. Cloud Object Storage (Optional)
- [ ] Cloud Object Storage service created (if needed)
- [ ] Bucket created
- [ ] API key generated
- [ ] Service credentials obtained

## ✅ Testing Checklist

### 1. Backend Tests
- [ ] Run: `cd backend && pytest`
- [ ] All tests pass
- [ ] No import errors

### 2. Backend Server
- [ ] Run: `cd backend && python run.py`
- [ ] Server starts without errors
- [ ] Health check endpoint works: `http://localhost:5000/api/health`
- [ ] Response: `{"status": "healthy", "service": "Anbu Backend"}`

### 3. Frontend Server
- [ ] Run: `cd frontend && npm run dev`
- [ ] Development server starts
- [ ] No compilation errors
- [ ] Frontend accessible at `http://localhost:5173`

### 4. API Endpoints
Test these endpoints (use Postman or curl):
- [ ] `GET /api/health` - Returns healthy status
- [ ] `POST /api/chat` - Accepts chat messages (requires IBM credentials)
- [ ] `GET /api/conversations` - Returns empty array initially
- [ ] `POST /api/documents/upload` - Accepts file uploads
- [ ] `GET /api/documents` - Returns empty array initially

## ✅ Git Setup Checklist

### 1. Git Configuration
- [ ] Git repository initialized
- [ ] `.gitignore` file created (copy from `gitignore_template.txt`)
- [ ] Initial commit made

### 2. Files to Ignore
Verify `.gitignore` includes:
- [ ] `venv/`
- [ ] `node_modules/`
- [ ] `.env`
- [ ] `*.pyc`
- [ ] `__pycache__/`
- [ ] `*.db`
- [ ] `uploads/`

## ✅ Documentation Checklist

- [ ] [`README.md`](../README.md) reviewed
- [ ] [`docs/SETUP.md`](SETUP.md) reviewed
- [ ] [`docs/PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) reviewed
- [ ] [`backend/config_template.txt`](../backend/config_template.txt) reviewed

## 🚀 Ready for Deployment

Once all items are checked:
1. ✅ All dependencies installed
2. ✅ Configuration files set up
3. ✅ IBM Cloud services configured
4. ✅ Tests passing
5. ✅ Servers running locally

**You are ready to deploy to IBM Cloud!**

## 📝 Common Issues and Solutions

### Issue: SSL Certificate Errors
**Solution:** Use trusted hosts flag:
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

### Issue: Import Errors
**Solution:** Ensure virtual environment is activated:
```bash
# Windows
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

### Issue: Port Already in Use
**Solution:** Change port in `.env` file or kill process using the port

### Issue: IBM API Authentication Errors
**Solution:** 
1. Verify API keys are correct
2. Check service URLs
3. Ensure project ID is valid
4. Verify credentials have proper permissions

## 📞 Support

If you encounter issues:
1. Check error messages carefully
2. Review documentation
3. Verify all checklist items
4. Check IBM Cloud service status
5. Review IBM Cloud documentation

---

**Last Updated:** May 1, 2026