# Anbu Project Structure

## Overview
Anbu is a full-stack application with a Flask backend and React frontend, designed for AI-powered document analysis and chat functionality using IBM WatsonX AI and IBM Watson Assistant.

## Directory Structure

```
Anbu/
├── backend/                    # Flask backend application
│   ├── app/                   # Main application package
│   │   ├── __init__.py       # App factory and configuration
│   │   ├── models/           # Database models
│   │   │   ├── __init__.py
│   │   │   ├── conversation.py
│   │   │   └── document.py
│   │   ├── routes/           # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── chat.py       # Chat endpoints
│   │   │   ├── documents.py  # Document endpoints
│   │   │   └── health.py     # Health check
│   │   └── services/         # Business logic
│   │       ├── __init__.py
│   │       ├── watsonx_service.py
│   │       └── document_service.py
│   ├── tests/                # Test suite
│   │   ├── __init__.py
│   │   └── test_health.py
│   ├── venv/                 # Virtual environment (not in git)
│   ├── config_template.txt   # Environment configuration template
│   ├── requirements.txt      # Python dependencies
│   └── run.py               # Application entry point
│
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   │   ├── assets/         # Static assets
│   │   ├── App.tsx         # Main app component
│   │   ├── App.css         # App styles
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Public assets
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── index.html          # HTML template
│
├── docs/                    # Documentation
│   ├── SETUP.md            # Setup instructions
│   └── PROJECT_STRUCTURE.md # This file
│
├── gitignore_template.txt  # Git ignore template
├── PROJECT_PLAN.md         # Project planning document
└── README.md              # Project overview

```

## Backend Architecture

### Models
- **Conversation**: Stores chat conversation metadata
- **Document**: Stores uploaded document information

### Routes
- **Health**: `/api/health` - System health check
- **Chat**: `/api/chat` - Chat with Claude AI
- **Documents**: `/api/documents` - Document upload and management

### Services
- **WatsonXService**: Handles communication with IBM WatsonX AI for chat and text generation
- **WatsonAssistantService**: Manages sessions and communication with IBM Watson Assistant
- **DocumentService**: Manages document upload, storage, and retrieval

## Frontend Architecture

### Technology Stack
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **CSS**: Styling

## Key Features

1. **AI Chat Interface**: Interact with IBM WatsonX AI and Watson Assistant for document analysis
2. **Multiple AI Models**: Support for various IBM Granite and Llama models
3. **Document Upload**: Upload and process documents
4. **Conversation History**: Track and manage chat conversations
5. **Session Management**: Watson Assistant session handling
6. **RESTful API**: Clean API design for frontend-backend communication

## Configuration Files

### Backend
- [`config_template.txt`](../backend/config_template.txt): Environment variables template
- [`requirements.txt`](../backend/requirements.txt): Python dependencies

### Frontend
- [`package.json`](../frontend/package.json): Node.js dependencies
- [`vite.config.ts`](../frontend/vite.config.ts): Vite configuration
- [`tsconfig.json`](../frontend/tsconfig.json): TypeScript configuration

## Development Workflow

1. Start backend: `cd backend && python run.py`
2. Start frontend: `cd frontend && npm run dev`
3. Run tests: `cd backend && pytest`

## Next Steps

1. Create `.env` file from [`config_template.txt`](../backend/config_template.txt)
2. Set up IBM Cloud account and WatsonX AI service
3. Add your IBM WatsonX API key and project ID
4. (Optional) Set up Watson Assistant and add credentials
5. Implement frontend components
6. Add more comprehensive tests
7. Set up CI/CD pipeline

## IBM Services Integration

### WatsonX AI
- Foundation models for text generation and chat
- Support for IBM Granite and Meta Llama models
- Customizable parameters (temperature, max tokens, etc.)

### Watson Assistant
- Pre-built conversational AI
- Session-based conversations
- Intent recognition and entity extraction

## Notes

- The virtual environment (`venv/`) is excluded from version control
- Environment files (`.env`) are excluded from version control
- Node modules are excluded from version control
- IBM API keys should never be committed to version control
- See [`gitignore_template.txt`](../gitignore_template.txt) for complete exclusion list