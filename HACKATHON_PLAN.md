# IBM Watsonx AI Hackathon - Repository Documentation Generator

## 🎯 Project Overview
**Deadline**: May 3, 2026 - 7:30 PM Sri Lankan Time (UTC+5:30)  
**Time Available**: ~50 hours from now

A web application that uses IBM watsonx AI to scan GitHub repositories and generate beginner-friendly onboarding documentation for junior developers.

---

## 🛠️ Tech Stack (Simplified for Hackathon)

### Frontend
- **React** (with Vite for fast setup)
- **TailwindCSS** (for quick styling)
- **Axios** (for API calls)

### Backend
- **Flask** (Python) - Simple and fast to develop
- **IBM watsonx AI SDK**
- **GitHub API** (PyGithub library)
- **Local file system** (no database)

### Deployment
- **Localhost** for demo
- Optional: Quick deploy to Vercel (frontend) + Render (backend) if time permits

---

## 📋 MVP Features (Hackathon Scope)

### ✅ Must Have
1. Single-page web interface
2. Input field for public GitHub repository URL
3. Scan and analyze repository using watsonx AI
4. Generate comprehensive onboarding documentation
5. Display documentation in browser
6. Download as Markdown file
7. Loading/progress indicator

### ❌ Out of Scope (For Now)
- User authentication
- Database storage
- Private repository support
- Multiple output formats
- Documentation history
- Team collaboration features

---

## ⏱️ Hour-by-Hour Implementation Plan

### **Phase 1: Setup & Backend Core (Hours 0-2)**

#### Hour 0-1: Project Setup
- [ ] Create project directory structure
- [ ] Initialize Flask backend
- [ ] Set up React frontend with Vite
- [ ] Install dependencies
- [ ] Configure watsonx AI credentials
- [ ] Test watsonx AI connection

#### Hour 1-2: Backend Foundation
- [ ] Create Flask API endpoint `/analyze`
- [ ] Implement GitHub URL validation
- [ ] Set up GitHub API integration
- [ ] Create function to fetch repository metadata
- [ ] Test fetching files from a sample repo

**Deliverable**: Working Flask server that can fetch GitHub repo data

---

### **Phase 2: Repository Analysis (Hours 2-4)**

#### Hour 2-3: File Analysis
- [ ] Parse `package.json` / `requirements.txt` / `pom.xml`
- [ ] Extract dependencies and tech stack
- [ ] Identify project structure (directories/files)
- [ ] Parse README.md if exists
- [ ] Detect programming languages used

#### Hour 3-4: Context Building
- [ ] Create function to read key files (max 10-15 files)
- [ ] Build context string for watsonx AI
- [ ] Implement file filtering (ignore node_modules, .git, etc.)
- [ ] Create structured data object with repo info

**Deliverable**: Function that extracts and structures repository information

---

### **Phase 3: watsonx AI Integration (Hours 4-7)**

#### Hour 4-5: Prompt Engineering
- [ ] Design prompt template for documentation generation
- [ ] Include sections: Overview, Tech Stack, Setup, Architecture
- [ ] Test prompt with sample repository data
- [ ] Refine prompt based on output quality

#### Hour 5-6: AI Integration
- [ ] Implement watsonx AI API call
- [ ] Handle API responses
- [ ] Parse and structure AI-generated content
- [ ] Add error handling for API failures

#### Hour 6-7: Documentation Generation
- [ ] Format AI output into Markdown
- [ ] Add table of contents
- [ ] Include code snippets where relevant
- [ ] Add metadata (repo name, date generated, etc.)

**Deliverable**: Working AI-powered documentation generator

---

### **Phase 4: Frontend Development (Hours 7-9)**

#### Hour 7-8: UI Components
- [ ] Create main page layout
- [ ] Build URL input form with validation
- [ ] Add "Generate Documentation" button
- [ ] Implement loading spinner/progress indicator
- [ ] Create documentation display area

#### Hour 8-9: Integration & Features
- [ ] Connect frontend to Flask backend
- [ ] Display generated documentation
- [ ] Add download button (save as .md file)
- [ ] Implement error messages
- [ ] Add basic styling with TailwindCSS

**Deliverable**: Fully functional web interface

---

### **Phase 5: Testing & Polish (Hours 9-10)**

#### Hour 9: Testing
- [ ] Test with popular repositories:
  - React starter project
  - Flask REST API
  - Express.js app
- [ ] Fix bugs and edge cases
- [ ] Improve error handling
- [ ] Optimize loading times

#### Hour 10: Final Polish
- [ ] Add project branding/logo
- [ ] Write clear instructions on the page
- [ ] Add example repository URLs
- [ ] Create demo video (2-3 minutes)
- [ ] Prepare presentation slides

**Deliverable**: Demo-ready application

---

## 📁 Project Structure

```
repo-doc-generator/
├── backend/
│   ├── app.py                 # Flask main application
│   ├── github_analyzer.py     # GitHub API integration
│   ├── watsonx_service.py     # watsonx AI integration
│   ├── doc_generator.py       # Documentation formatting
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # API keys (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── components/
│   │   │   ├── InputForm.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── DocumentViewer.jsx
│   │   ├── services/
│   │   │   └── api.js        # Backend API calls
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── docs/
│   ├── SETUP.md              # Setup instructions
│   └── DEMO.md               # Demo script
│
└── README.md                 # Project documentation
```

---

## 🔑 Key Implementation Details

### Backend API Endpoint

```python
@app.route('/api/analyze', methods=['POST'])
def analyze_repository():
    """
    Accepts: { "repo_url": "https://github.com/user/repo" }
    Returns: { "documentation": "markdown content", "metadata": {...} }
    """
    # 1. Validate GitHub URL
    # 2. Fetch repository data
    # 3. Analyze with watsonx AI
    # 4. Generate documentation
    # 5. Return formatted markdown
```

### watsonx AI Prompt Template

```
You are an expert technical writer creating onboarding documentation.

Repository: {repo_name}
Tech Stack: {detected_stack}
Dependencies: {dependencies}
File Structure: {structure}

Generate comprehensive onboarding documentation with these sections:
1. Project Overview (2-3 sentences)
2. Tech Stack Breakdown
3. Prerequisites
4. Installation Steps
5. Project Structure Explanation
6. Getting Started Guide
7. Key Files and Their Purpose
8. Common Commands
9. Next Steps for New Developers

Make it beginner-friendly and actionable.
```

---

## 🎨 UI/UX Design (Simple & Clean)

### Main Page Layout
```
┌─────────────────────────────────────────┐
│  🤖 AI Repository Documentation Generator│
│     Powered by IBM watsonx AI            │
├─────────────────────────────────────────┤
│                                          │
│  [Enter GitHub Repository URL]          │
│  [Generate Documentation] 🚀            │
│                                          │
│  Examples:                               │
│  • https://github.com/facebook/react    │
│  • https://github.com/pallets/flask     │
│                                          │
├─────────────────────────────────────────┤
│  📄 Generated Documentation              │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │  [Documentation content here]      │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│  [Download as Markdown] 📥              │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start Commands

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors python-dotenv PyGithub ibm-watsonx-ai
python app.py
```

### Frontend Setup
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install axios tailwindcss
npm run dev
```

---

## 🎯 Demo Strategy

### Preparation (Before Presentation)
1. Have 3 pre-tested repositories ready
2. Pre-generate documentation for backup
3. Prepare 2-minute demo script
4. Test on different screen sizes
5. Have screenshots ready

### Live Demo Flow (3-5 minutes)
1. **Introduction** (30 sec)
   - Problem: Junior devs struggle with new codebases
   - Solution: AI-powered onboarding docs

2. **Live Demo** (2 min)
   - Paste GitHub URL
   - Click generate
   - Show loading state
   - Display generated documentation
   - Download file

3. **Highlight watsonx AI** (1 min)
   - Show how AI understands code structure
   - Explain prompt engineering
   - Demonstrate quality of output

4. **Q&A** (1-2 min)

---

## 🏆 Winning Points for Judges

### Technical Excellence
- ✅ Clear IBM watsonx AI integration
- ✅ Working end-to-end demo
- ✅ Clean, maintainable code
- ✅ Good error handling

### Problem Solving
- ✅ Addresses real onboarding pain point
- ✅ Practical solution for companies
- ✅ Scalable approach

### Presentation
- ✅ Clear value proposition
- ✅ Smooth demo
- ✅ Professional UI
- ✅ Good documentation

---

## 📝 Documentation Sections to Generate

### 1. Project Overview
- Brief description
- Main purpose
- Target users

### 2. Tech Stack
- Programming languages
- Frameworks
- Key libraries
- Build tools

### 3. Prerequisites
- Required software versions
- System requirements
- Account requirements

### 4. Installation
- Clone command
- Dependency installation
- Configuration steps

### 5. Project Structure
- Directory tree
- Key folders explained
- Important files

### 6. Getting Started
- First commands to run
- How to start dev server
- How to run tests

### 7. Key Concepts
- Architecture overview
- Design patterns used
- Important abstractions

### 8. Common Tasks
- How to add a feature
- How to fix bugs
- How to deploy

### 9. Resources
- Links to documentation
- Related tutorials
- Team contacts

---

## ⚠️ Common Pitfalls to Avoid

1. **Over-engineering**: Keep it simple, focus on core features
2. **API Rate Limits**: Cache GitHub API responses during testing
3. **Large Repositories**: Set file/size limits (e.g., max 50 files)
4. **Slow AI Responses**: Show progress, add timeout handling
5. **Poor Error Messages**: Always show user-friendly errors
6. **Ugly UI**: Use TailwindCSS components, keep it clean
7. **No Backup Plan**: Have pre-generated docs if live demo fails

---

## 🔧 Environment Variables

Create `.env` file in backend directory:

```env
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
GITHUB_TOKEN=your_github_token_here  # Optional, for higher rate limits
FLASK_ENV=development
```

---

## 📊 Success Metrics

### Minimum Viable Demo
- [ ] Can analyze at least 3 different repositories
- [ ] Generates readable documentation
- [ ] UI is functional and clean
- [ ] Demo runs without crashes
- [ ] watsonx AI integration is visible

### Stretch Goals (If Time Permits)
- [ ] Support for 5+ programming languages
- [ ] Beautiful UI with animations
- [ ] Deploy to cloud (Vercel + Render)
- [ ] Add repository statistics
- [ ] Generate architecture diagrams

---

## 🎬 Final Checklist (Before Submission)

### Code
- [ ] All features working
- [ ] No console errors
- [ ] Code is commented
- [ ] README.md is complete
- [ ] .env.example provided

### Demo
- [ ] Demo video recorded (2-3 min)
- [ ] Screenshots taken
- [ ] Presentation slides ready
- [ ] Backup plan prepared

### Submission
- [ ] GitHub repository is public
- [ ] All files committed
- [ ] Demo link works
- [ ] Submission form filled

---

## 💡 Tips for Success

1. **Start Simple**: Get basic version working first, then enhance
2. **Test Early**: Test with real repos every 2 hours
3. **Time Management**: Stick to the schedule, don't perfectionism
4. **Backup Everything**: Commit code frequently
5. **Practice Demo**: Run through demo 3-4 times before presentation
6. **Stay Calm**: If something breaks, have backup screenshots/video

---

## 📞 Resources

### IBM watsonx AI
- [Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [Python SDK](https://github.com/IBM/watsonx-ai-python-sdk)
- [API Reference](https://cloud.ibm.com/apidocs/watsonx-ai)

### GitHub API
- [REST API Docs](https://docs.github.com/en/rest)
- [PyGithub Library](https://pygithub.readthedocs.io/)

### Frontend
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS](https://tailwindcss.com/docs)

---

## 🎉 Good Luck!

Remember: **Done is better than perfect**. Focus on getting a working demo that showcases watsonx AI integration. You've got this! 🚀

---

**Last Updated**: May 1, 2026  
**Deadline**: May 3, 2026 - 7:30 PM (Sri Lankan Time)