# 🚀 Anbu - AI-Powered Developer Onboarding Platform

> **Anbu** (அன்பு) means "Love" in Tamil - We help companies show love to their new developers through intelligent onboarding.

**Powered by IBM watsonx AI** | **IBM Bob Hackathon 2026**

---

## 📖 Project Overview

**Anbu** is an AI-powered web application that automatically generates comprehensive, beginner-friendly onboarding documentation for any GitHub repository. It helps newly hired junior developers quickly understand codebases, tech stacks, and project structures - reducing onboarding time from weeks to hours.

### 🎯 Problem Statement
- New developers spend 2-4 weeks understanding existing codebases
- Documentation is often outdated or missing
- Senior developers spend valuable time explaining project basics
- High learning curve leads to slower productivity

### 💡 Solution
Anbu uses **IBM watsonx AI** to intelligently scan repositories and generate:
- Project overview and architecture
- Tech stack breakdown
- Step-by-step setup guides
- Key files and their purposes
- Getting started tutorials
- Common commands and workflows

---

## ✨ Key Features

### MVP Features (Hackathon Scope)
- ✅ **Public Repository Analysis** - Paste any GitHub URL
- ✅ **AI-Powered Documentation** - watsonx AI generates comprehensive guides
- ✅ **Instant Preview** - View documentation in browser
- ✅ **Download as Markdown** - Save for offline use
- ✅ **Cloud Storage** - Persistent documentation via IBM Cloud Object Storage
- ✅ **Shareable Links** - Share generated docs with team members

### Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Flask (Python) + IBM watsonx AI SDK
- **Cloud**: IBM Code Engine + IBM Cloud Object Storage
- **APIs**: GitHub API, watsonx AI API

---

## 🗓️ Development Timeline

**Deadline**: May 3, 2026 - 7:30 PM (Sri Lankan Time)  
**Time Remaining**: ~36 hours

### Day 1 (May 1-2) - Core Development

#### ✅ Phase 1: Setup & Foundation (4 hours)
**Target**: May 1, 6:00 PM - 10:00 PM

- [ ] Project initialization
  - [ ] Create project structure
  - [ ] Set up Git repository
  - [ ] Initialize Flask backend
  - [ ] Initialize React frontend with Vite
  - [ ] Install all dependencies

- [ ] IBM Cloud Setup
  - [ ] Create IBM Cloud account/login
  - [ ] Set up watsonx AI service
  - [ ] Get API credentials
  - [ ] Create Cloud Object Storage bucket
  - [ ] Set up Code Engine project

- [ ] Backend Core
  - [ ] Flask app with CORS
  - [ ] GitHub API integration
  - [ ] Basic repository fetching
  - [ ] Test with sample repo

**Deliverable**: Working Flask server that can fetch GitHub data

---

#### ✅ Phase 2: AI Integration (5 hours)
**Target**: May 2, 8:00 AM - 1:00 PM

- [ ] Repository Analysis Engine
  - [ ] Parse package.json, requirements.txt, pom.xml
  - [ ] Extract dependencies and versions
  - [ ] Identify programming languages
  - [ ] Build project structure tree
  - [ ] Read key files (README, config files)

- [ ] watsonx AI Integration
  - [ ] Design prompt template
  - [ ] Implement AI API calls
  - [ ] Handle AI responses
  - [ ] Parse and structure output
  - [ ] Error handling and retries

- [ ] Documentation Generator
  - [ ] Format AI output as Markdown
  - [ ] Add table of contents
  - [ ] Include metadata
  - [ ] Generate file structure diagrams

**Deliverable**: Backend that generates AI-powered documentation

---

#### ✅ Phase 3: Frontend & Cloud (4 hours)
**Target**: May 2, 2:00 PM - 6:00 PM

- [ ] Frontend Development
  - [ ] Main page layout
  - [ ] URL input form with validation
  - [ ] Loading spinner with progress
  - [ ] Documentation viewer component
  - [ ] Download button
  - [ ] Error message display
  - [ ] Responsive design

- [ ] IBM Cloud Integration
  - [ ] Upload docs to Object Storage
  - [ ] Generate shareable URLs
  - [ ] Implement URL sharing feature
  - [ ] Test cloud storage

- [ ] API Integration
  - [ ] Connect frontend to backend
  - [ ] Handle API responses
  - [ ] Display generated docs
  - [ ] Implement download functionality

**Deliverable**: Fully functional web application

---

### Day 2 (May 2-3) - Polish & Deploy

#### ✅ Phase 4: Testing & Refinement (3 hours)
**Target**: May 2, 7:00 PM - 10:00 PM

- [ ] Testing
  - [ ] Test with 5+ different repositories
    - [ ] React/Next.js project
    - [ ] Flask/Django project
    - [ ] Express.js project
    - [ ] Spring Boot project
    - [ ] Python data science project
  - [ ] Fix bugs and edge cases
  - [ ] Improve error messages
  - [ ] Optimize performance

- [ ] UI/UX Polish
  - [ ] Add loading animations
  - [ ] Improve styling
  - [ ] Add example repositories
  - [ ] Add instructions/tooltips
  - [ ] Mobile responsiveness

**Deliverable**: Stable, tested application

---

#### ✅ Phase 5: Deployment & Demo (4 hours)
**Target**: May 3, 10:00 AM - 2:00 PM

- [ ] Deployment
  - [ ] Deploy backend to IBM Code Engine
  - [ ] Deploy frontend to Vercel/IBM Cloud
  - [ ] Configure environment variables
  - [ ] Test production deployment
  - [ ] Set up custom domain (optional)

- [ ] Documentation
  - [ ] Update README with setup instructions
  - [ ] Add architecture diagram
  - [ ] Document API endpoints
  - [ ] Create user guide

- [ ] Demo Preparation
  - [ ] Record demo video (3-5 minutes)
  - [ ] Create presentation slides (5-7 slides)
  - [ ] Prepare 3 test repositories
  - [ ] Practice demo flow
  - [ ] Take screenshots

**Deliverable**: Deployed app + demo materials

---

#### ✅ Phase 6: Final Submission (2 hours)
**Target**: May 3, 3:00 PM - 5:00 PM

- [ ] Final Checks
  - [ ] Test all features end-to-end
  - [ ] Verify all links work
  - [ ] Check mobile responsiveness
  - [ ] Proofread all text
  - [ ] Verify IBM branding

- [ ] Submission Package
  - [ ] GitHub repository is public
  - [ ] README is complete
  - [ ] Demo video uploaded
  - [ ] Presentation slides ready
  - [ ] Fill submission form
  - [ ] Submit before 7:30 PM

**Deliverable**: Complete submission

---

## ✅ Master TODO List

### 🔴 Critical Path (Must Complete)

#### Backend Development
- [ ] Set up Flask application structure
- [ ] Integrate GitHub API for repository fetching
- [ ] Implement watsonx AI integration
- [ ] Create documentation generation logic
- [ ] Set up IBM Cloud Object Storage
- [ ] Deploy to IBM Code Engine

#### Frontend Development
- [ ] Create React app with Vite
- [ ] Build URL input component
- [ ] Implement loading states
- [ ] Create documentation viewer
- [ ] Add download functionality
- [ ] Style with TailwindCSS

#### Integration & Testing
- [ ] Connect frontend to backend API
- [ ] Test with multiple repositories
- [ ] Handle errors gracefully
- [ ] Optimize performance

#### Deployment & Demo
- [ ] Deploy to production
- [ ] Record demo video
- [ ] Create presentation
- [ ] Submit to hackathon

---

### 🟡 Important (Should Complete)

- [ ] Add shareable documentation links
- [ ] Implement progress indicators
- [ ] Add example repositories on homepage
- [ ] Create architecture diagram
- [ ] Add IBM watsonx AI branding
- [ ] Mobile responsive design

---

### 🟢 Nice to Have (If Time Permits)

- [ ] Support for private repositories
- [ ] Multiple output formats (PDF, HTML)
- [ ] Documentation history/cache
- [ ] Code complexity metrics
- [ ] Architecture diagram generation
- [ ] Dark mode toggle

---

## 🏗️ Project Structure

```
anbu/
├── backend/
│   ├── app.py                      # Main Flask application
│   ├── services/
│   │   ├── github_service.py       # GitHub API integration
│   │   ├── watsonx_service.py      # watsonx AI integration
│   │   ├── analyzer.py             # Repository analysis
│   │   └── doc_generator.py        # Documentation formatting
│   ├── utils/
│   │   ├── cloud_storage.py        # IBM Cloud Object Storage
│   │   └── helpers.py              # Utility functions
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variables template
│   └── README.md                   # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   ├── components/
│   │   │   ├── Header.jsx          # App header with branding
│   │   │   ├── InputForm.jsx       # Repository URL input
│   │   │   ├── LoadingSpinner.jsx  # Loading animation
│   │   │   ├── DocumentViewer.jsx  # Markdown viewer
│   │   │   └── ErrorMessage.jsx    # Error display
│   │   ├── services/
│   │   │   └── api.js              # Backend API calls
│   │   ├── styles/
│   │   │   └── index.css           # TailwindCSS styles
│   │   └── main.jsx                # React entry point
│   ├── public/
│   │   └── anbu-logo.svg           # Project logo
│   ├── package.json                # Node dependencies
│   └── README.md                   # Frontend documentation
│
├── docs/
│   ├── ARCHITECTURE.md             # System architecture
│   ├── API.md                      # API documentation
│   └── DEMO_SCRIPT.md              # Demo presentation script
│
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
├── HACKATHON_PLAN.md              # Detailed implementation plan
└── LICENSE                         # MIT License
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- IBM Cloud account
- GitHub account

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors python-dotenv PyGithub ibm-watsonx-ai ibm-cos-sdk

# Create .env file
cp .env.example .env
# Edit .env with your IBM Cloud credentials

# Run Flask server
python app.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔑 Environment Variables

Create `.env` file in backend directory:

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

# GitHub (Optional - for higher rate limits)
GITHUB_TOKEN=your_github_personal_access_token

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
```

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

**Response:**
```json
{
  "success": true,
  "documentation": "# Project Documentation\n\n...",
  "metadata": {
    "repo_name": "repository",
    "owner": "username",
    "tech_stack": ["JavaScript", "React", "Node.js"],
    "generated_at": "2026-05-01T14:30:00Z"
  },
  "share_url": "https://anbu-docs.s3.amazonaws.com/abc123.md"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid repository URL"
}
```

---

## 🎨 UI/UX Design

### Color Scheme
- Primary: IBM Blue (#0f62fe)
- Secondary: Teal (#00bfa5)
- Background: White (#ffffff)
- Text: Dark Gray (#161616)
- Accent: Purple (#8a3ffc)

### Key Components
1. **Hero Section** - Project branding and tagline
2. **Input Form** - Clean, centered URL input
3. **Loading State** - Animated spinner with progress text
4. **Documentation Viewer** - Markdown rendered with syntax highlighting
5. **Action Buttons** - Download and Share functionality

---

## 🎯 Demo Strategy

### Demo Flow (3-5 minutes)

1. **Introduction** (30 seconds)
   - "Meet Anbu - AI-powered developer onboarding"
   - Show the problem: confused new developer
   - Present the solution

2. **Live Demo** (2 minutes)
   - Open Anbu web app
   - Paste popular GitHub repository URL (e.g., React)
   - Click "Generate Documentation"
   - Show loading animation
   - Display generated documentation
   - Highlight key sections
   - Download as Markdown
   - Show shareable link

3. **IBM watsonx AI Showcase** (1 minute)
   - Explain how watsonx AI analyzes code
   - Show prompt engineering approach
   - Demonstrate quality and accuracy
   - Highlight IBM Cloud integration

4. **Impact & Future** (30 seconds)
   - Time saved: weeks → hours
   - Cost reduction for companies
   - Better developer experience
   - Future enhancements

5. **Q&A** (1 minute)

### Backup Plan
- Have 3 pre-generated documentation examples
- Screenshots of each step
- Recorded demo video as fallback

---

## 🏆 Hackathon Submission Checklist

### Code & Documentation
- [ ] GitHub repository is public
- [ ] README.md is comprehensive
- [ ] Code is well-commented
- [ ] .env.example provided
- [ ] All dependencies listed
- [ ] Setup instructions are clear

### Deployment
- [ ] Backend deployed to IBM Code Engine
- [ ] Frontend deployed and accessible
- [ ] All environment variables configured
- [ ] HTTPS enabled
- [ ] Custom domain (optional)

### Demo Materials
- [ ] Demo video recorded (3-5 minutes)
- [ ] Presentation slides created (5-7 slides)
- [ ] Screenshots captured
- [ ] Architecture diagram included
- [ ] IBM branding visible

### Testing
- [ ] Tested with 5+ repositories
- [ ] All features working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Error handling works

### Submission
- [ ] Submission form filled
- [ ] All links verified
- [ ] Team information complete
- [ ] Submitted before deadline (May 3, 7:30 PM)

---

## 🎓 Technical Highlights

### IBM watsonx AI Integration
- Uses watsonx.ai foundation models for code understanding
- Custom prompt engineering for documentation generation
- Handles multiple programming languages
- Generates human-readable, beginner-friendly content

### IBM Cloud Services
- **Code Engine**: Serverless backend deployment
- **Object Storage**: Persistent documentation storage
- **watsonx AI**: Core AI capabilities

### Smart Analysis
- Detects tech stack automatically
- Identifies project structure
- Extracts dependencies
- Understands architecture patterns
- Generates setup instructions

---

## 📈 Future Enhancements

### Phase 2 (Post-Hackathon)
- [ ] Private repository support with OAuth
- [ ] Multiple output formats (PDF, HTML, DOCX)
- [ ] Documentation vers ioning
- [ ] Team collaboration features
- [ ] Integration with Slack/Teams

### Phase 3 (Production)
- [ ] Enterprise features
- [ ] Custom branding
- [ ] Analytics dashboard
- [ ] API for CI/CD integration
- [ ] Multi-language support

---

## 👥 Team

**Developer**: [Your Name]  
**Project**: Anbu - AI Developer Onboarding  
**Hackathon**: IBM Bob Hackathon 2026  
**Timeline**: May 1-3, 2026  

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IBM watsonx AI** for powerful code analysis capabilities
- **IBM Cloud** for reliable infrastructure
- **GitHub API** for repository access
- **React & Flask** communities for excellent frameworks

---

**Built with ❤️ (Anbu) for developers, by developers**

*Last Updated: May 1, 2026*  
*Deadline: May 3, 2026 - 7:30 PM (Sri Lankan Time)*