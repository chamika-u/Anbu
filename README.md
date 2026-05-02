# 🚀 Anbu - AI-Powered Developer Onboarding Platform

> **Anbu** (அன்பு) means "Love" in Tamil - We help companies show love to their new developers through intelligent onboarding.

**Powered by IBM watsonx AI**

---

## 📖 About Anbu

Anbu is an AI-powered web application that automatically generates comprehensive, beginner-friendly onboarding documentation for any GitHub repository. It helps newly hired junior developers quickly understand codebases, tech stacks, and project structures - reducing onboarding time from weeks to hours.

---

## 🎯 Problem Statement

New developers joining a company face significant challenges:

- **Steep Learning Curve**: Understanding existing codebases takes 2-4 weeks
- **Missing Documentation**: Technical documentation is often outdated or incomplete
- **Time Drain**: Senior developers spend valuable hours explaining project basics
- **Slow Productivity**: High learning curve leads to delayed contribution
- **Frustration**: New developers feel overwhelmed and unsupported

**Result**: Companies lose productivity, senior developers lose focus time, and junior developers struggle unnecessarily.

---

## 💡 Our Solution

Anbu leverages **IBM watsonx AI** to intelligently analyze any GitHub repository and automatically generate:

- 📋 **Project Overview** - Clear explanation of what the project does and its purpose
- 🛠️ **Tech Stack Breakdown** - Detailed list of technologies, frameworks, and tools used
- ⚙️ **Setup Instructions** - Step-by-step installation and configuration guide
- 🏗️ **Architecture Overview** - High-level system design and structure
- 📁 **Project Structure** - Directory tree with explanations of key files
- 🚀 **Getting Started Guide** - First commands to run and development workflow
- 🔑 **Key Concepts** - Important patterns, abstractions, and design decisions
- 🐛 **Troubleshooting** - Common issues and their solutions

**Impact**: Reduce onboarding time from weeks to hours, allowing new developers to contribute faster.

---

## ✨ Key Features

### Core Capabilities

- **🔗 Public Repository Support** - Paste any GitHub URL to analyze
- **🤖 AI-Powered Analysis** - IBM watsonx AI understands code structure and patterns
- **📝 Comprehensive Documentation** - Generates beginner-friendly, actionable guides
- **💾 Persistent Dashboard** - Save your generated documentation to a personal dashboard
- **🔄 Progress Tracking** - Keep track of your onboarding progress natively within the app
- **⚡ Real-time Updates** - Live, repository-specific Server-Sent Events (SSE) progress updates during analysis
- **👀 Instant Preview & Export** - View documentation in browser or download as Markdown/PDF
- **🔐 User Authentication** - Secure login and registration for personalized experiences

### Technical Highlights

- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, Go, Ruby, and more
- **Smart Tech Stack Detection** - Automatically identifies frameworks, containerization, and dependencies
- **Dynamic SSE Streaming** - Backend analyzes repository contents and streams specific loading statuses (e.g. "Analysing frontend components")
- **Robust PostgreSQL Backend** - Scalable, relational data storage instead of file-based persistence
- **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🛠️ Technology Stack

### Frontend
- **React** - Modern UI library for building interactive interfaces
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **React Markdown** - Render Markdown documentation beautifully
- **Axios** - HTTP client for API communication

### Backend
- **Flask** (Python) - Lightweight web framework
- **PostgreSQL** - Robust relational database for users, documentation, and progress states
- **IBM watsonx AI SDK** - Access to powerful foundation models
- **PyGithub** - GitHub API integration for repository access
- **Server-Sent Events (SSE)** - Real-time streaming for progress tracking

### IBM Cloud Services
- **IBM watsonx AI** - Core AI capabilities for code analysis and documentation generation
- **IBM Code Engine** - Serverless container platform for backend deployment
- **IBM Cloud Object Storage** - Scalable storage for generated documentation

### APIs & Integrations
- **GitHub REST API** - Fetch repository data and file contents
- **watsonx AI API** - Generate intelligent documentation using LLMs

---

## 🎯 Project Scope

### MVP Features (Current Implementation)

✅ **Repository Analysis**
- Support for public GitHub repositories
- Automatic tech stack detection
- Dependency extraction
- Project structure analysis

✅ **AI Documentation Generation**
- Comprehensive onboarding guides
- Beginner-friendly explanations
- Step-by-step instructions
- Code examples and best practices

✅ **User Interface**
- Clean, intuitive web interface
- Real-time progress indicators
- Documentation preview
- Download functionality

✅ **Cloud Integration & Persistence**
- PostgreSQL database integration
- Persistent, user-specific dashboard
- Interactive progress state synchronization

### Out of Scope (Future Enhancements)

❌ **Private Repository Support** - Requires OAuth implementation
❌ **Team Collaboration** - Shared workspaces and comments
❌ **Version Control** - Track documentation changes over time
❌ **Analytics Dashboard** - Usage metrics and insights

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        User                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vercel)                     │
│  • Repository URL Input                                  │
│  • Documentation Viewer                                  │
│  • Download & Share Features                             │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Flask Backend (IBM Code Engine)                  │
│  • Request Validation                                    │
│  • Repository Analysis                                   │
│  • AI Integration                                        │
│  • Document Generation                                   │
└──────┬──────────────┬──────────────┬────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌──────────┐   ┌─────────────┐   ┌──────────────────┐
│ GitHub   │   │  IBM        │   │  IBM Cloud       │
│   API    │   │ watsonx AI  │   │ Object Storage   │
│          │   │             │   │                  │
│ • Fetch  │   │ • Analyze   │   │ • Store Docs     │
│   Repos  │   │   Code      │   │ • Generate URLs  │
│ • Get    │   │ • Generate  │   │ • Serve Files    │
│   Files  │   │   Docs      │   │                  │
└──────────┘   └─────────────┘   └──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** - Backend runtime
- **Node.js 18+** - Frontend development
- **IBM Cloud Account** - Access to watsonx AI and Object Storage
- **GitHub Account** - For repository access (optional: personal access token)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/anbu.git
cd anbu
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your IBM Cloud credentials

# Run Flask server
python run.py
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with backend API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 🐳 Running with Docker (Recommended)

The easiest way to run the entire system (Frontend, Backend, and Database) is using Docker Compose.

1. **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
2. **Setup Credentials**: Ensure your `.env` file in the root or backend directory has your IBM watsonx AI credentials.
3. **Launch**:
   ```bash
   docker-compose up --build
   ```
4. **Access**:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000`
   - Database: `localhost:5433` (on host)

The system will automatically initialize the PostgreSQL database and link all services.

### Environment Variables

#### Backend (.env)
```env
# IBM watsonx AI
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# IBM Cloud Object Storage
COS_API_KEY=your_cos_api_key
COS_INSTANCE_ID=your_instance_id
COS_ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud
COS_BUCKET_NAME=anbu-docs

# GitHub (Optional)
GITHUB_TOKEN=your_github_personal_access_token

# Flask & Database
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/anbu
SECRET_KEY=your_secret_key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📖 Usage Guide

### Generating Documentation

1. **Open Anbu** in your web browser
2. **Paste GitHub URL** of the repository you want to analyze
   - Example: `https://github.com/facebook/react`
3. **Click "Generate Documentation"** button
4. **Wait for analysis** - Progress indicator shows current status
5. **Review documentation** - Preview generated content in browser
6. **Download or Share**:
   - Click "Download" to save as Markdown file
   - Click "Share" to get a permanent URL

### Supported Repository Types

- ✅ JavaScript/TypeScript (React, Vue, Angular, Node.js)
- ✅ Python (Django, Flask, FastAPI)
- ✅ Java (Spring Boot, Maven, Gradle)
- ✅ Go (Go modules)
- ✅ Ruby (Rails, Sinatra)
- ✅ PHP (Laravel, Symfony)
- ✅ And many more...

---

## 📊 API Documentation

### POST `/api/analyze`

Analyze a GitHub repository and generate documentation.

**Request:**
```json
{
  "repo_url": "https://github.com/username/repository"
}
```

**Response (Success):**
```json
{
  "success": true,
  "documentation": "# Project Documentation\n\n...",
  "metadata": {
    "repo_name": "repository",
    "owner": "username",
    "tech_stack": ["JavaScript", "React", "Node.js"],
    "dependencies_count": 42,
    "generated_at": "2026-05-01T14:30:00Z"
  },
  "share_url": "https://anbu-docs.s3.amazonaws.com/abc123.md"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid repository URL or repository not found"
}
```

### GET `/api/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## 🎨 Design Philosophy

### User Experience Principles

- **Simplicity First** - One input field, one button, clear results
- **Instant Feedback** - Real-time progress updates during analysis
- **Beginner-Friendly** - Documentation written for junior developers
- **Actionable Content** - Step-by-step instructions, not just descriptions
- **Professional Design** - Clean, modern interface with IBM branding

### Color Scheme

- **Primary**: IBM Blue (#0f62fe) - Trust and professionalism
- **Secondary**: Teal (#00bfa5) - Innovation and growth
- **Background**: Light Gray (#f4f4f4) - Clean and minimal
- **Text**: Dark Gray (#161616) - High readability
- **Accent**: Purple (#8a3ffc) - Creativity and AI

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IBM watsonx AI** - Powerful foundation models for code analysis
- **IBM Cloud** - Reliable infrastructure and services
- **GitHub** - Repository hosting and API access
- **Open Source Community** - Amazing tools and frameworks

---

## 📞 Contact & Support

- **Project Repository**: [github.com/yourusername/anbu](https://github.com/yourusername/anbu)
- **Issues**: [github.com/yourusername/anbu/issues](https://github.com/yourusername/anbu/issues)
- **Email**: your.email@example.com

---

## 🌟 Project Status

**Current Version**: 1.0.0 (MVP)  
**Status**: Active Development  
**Last Updated**: May 3, 2026

---

**Built with ❤️ (Anbu) for developers, by developers**

*Empowering junior developers to succeed from day one*