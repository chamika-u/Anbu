# Anbu Setup Guide

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- Git
- IBM Cloud account with WatsonX AI access
- IBM Watson Assistant (optional)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file from the template:
```bash
# Copy config_template.txt content to .env
# Update the following variables:
# - SECRET_KEY: Generate a secure random key
# - IBM_WATSONX_API_KEY: Your IBM WatsonX API key
# - IBM_WATSONX_PROJECT_ID: Your IBM WatsonX project ID
# - IBM_WATSONX_URL: Your IBM WatsonX service URL
# - IBM_WATSON_API_KEY: Your IBM Watson Assistant API key (optional)
# - IBM_WATSON_ASSISTANT_ID: Your Watson Assistant ID (optional)
# - IBM_WATSON_URL: Your Watson Assistant URL (optional)
```

5. Run the Flask application:
```bash
python run.py
```

The backend will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
Anbu/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── tests/
│   ├── requirements.txt
│   ├── run.py
│   └── config_template.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── docs/
    └── SETUP.md
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Chat
- `POST /api/chat` - Send a message to WatsonX AI
  - Body: `{ "message": "your message", "conversation_id": "optional", "model_id": "optional" }`
- `POST /api/chat/assistant` - Send a message to Watson Assistant
  - Body: `{ "message": "your message", "session_id": "optional" }`
- `GET /api/conversations` - Get all conversations
- `DELETE /api/conversations/<id>` - Delete a conversation
- `POST /api/sessions` - Create a new Watson Assistant session
- `DELETE /api/sessions/<id>` - Delete a Watson Assistant session

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - Get all documents
- `DELETE /api/documents/<id>` - Delete a document

## Development

### Running Tests
```bash
cd backend
pytest
```

### Code Formatting
```bash
cd backend
black .
flake8 .
```

## Troubleshooting

### IBM Cloud Authentication
Make sure you have:
1. Created an IBM Cloud account
2. Set up WatsonX AI service
3. Generated API keys from IBM Cloud dashboard
4. Created a WatsonX project and noted the project ID

### SSL Certificate Issues (Windows)
If you encounter SSL certificate errors during pip install, use:
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

### WatsonX Model IDs
Available models include:
- `ibm/granite-13b-chat-v2` (default)
- `ibm/granite-13b-instruct-v2`
- `meta-llama/llama-2-70b-chat`
- Check IBM WatsonX documentation for the latest models

### Port Already in Use
If port 5000 or 5173 is already in use, you can change it:
- Backend: Set `PORT` in `.env` file
- Frontend: Modify `vite.config.ts`