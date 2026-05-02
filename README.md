# IBM Bob Dev Day Hackathon – Submission Report

*Team / Individual:* Chamika (Anbu Team)  
*Submission Date:* 2026-05-03

---

## 1. Problem & Solution Statement

### Problem
Developer onboarding is a significant bottleneck in engineering teams. New hires often face undocumented or complex codebases, leading to a 2–4 week ramp-up period where they are unproductive. Senior developers are frequently pulled away from their work to explain basic architecture and setup, creating a resource drain across the organization.

### Solution
**Anbu** (Tamil for "Love") is an AI-native platform that automates the generation of comprehensive onboarding guides for any GitHub repository. By leveraging **IBM watsonx.ai**, it provides a deep semantic understanding of the codebase, generating setup guides, tech stack breakdowns, and interactive checklists that reduce onboarding time from weeks to hours.

---

## 2. How IBM Bob Was Used

IBM Bob served as the lead developer and architect for the Anbu platform, handling both complex infrastructure migrations and frontend refinement.

• *Task 1 – Backend Refactor:* Used Bob to migrate the persistence layer from JSON files to a robust PostgreSQL database.
• *Task 2 – Architecture Verification:* Used Bob to verify and run the containerized architecture using Docker Compose.
• *Task 3 – Dashboard Implementation:* Used Bob to build the personalized user dashboard and refactor UI error handling.
• *Task 4 – Sync Logic:* Used Bob to implement real-time synchronization between the frontend checklist and the database.
• *Task 5 – watsonx Integration:* Used Bob to establish the IBM watsonx AI service layer with intelligent fallback mechanisms.
• *Task 6 – Documentation Cleanup:* Used Bob to professionalize the entire repository by standardizing Markdown and removing emojis.
• *Task 7 – Deployment Orchestration:* Used Bob to configure Docker environments and prepare for IBM Code Engine deployment.
• *Task 8 – QA & Validation:* Used Bob to perform deep testing of the analysis routes and watsonx integration.
• *Task 9 – Submission Reporting:* Used Bob to generate this final submission report and consolidate task histories.

---

## 3. Code Repository

• *Public Repo URL:* [https://github.com/chamika-u/Anbu](https://github.com/chamika-u/Anbu)  
• *Main Branch:* `main`

Repository structure:

```text
Anbu/
├─ backend/
│  ├─ app/
│  │  ├─ routes/         # API endpoints (analyze, auth, history)
│  │  ├─ services/       # watsonx and GitHub logic
│  │  └─ models/         # Database schemas
├─ frontend/
│  ├─ src/
│  │  ├─ components/     # Mermaid, Dashboard, Progress UI
│  │  └─ pages/          # Analysis and History views
├─ bob_sessions/         # AI Task Histories
├─ docker-compose.yml
└─ README.md
```

---

## 4. Video Demonstration

• Public Video URL: [Paste your demo video URL here]

Briefly describe what the video shows:
The video showcases the end-to-end user journey: from entering a repository URL, watching real-time analysis progress, viewing AI-generated Mermaid diagrams and documentation, to tracking onboarding progress on the interactive dashboard.

---

## 5. Bob Sessions Directory

All Bob task-session reports are stored in the `bob_sessions/` directory.

Each Bob task includes:
• A screenshot of the Task Session Consumption Summary.
• An exported task-history Markdown file.

### Bob Session Entries

#### Task 1: PostgreSQL Migration
• Description: Migrated the application from local file storage to a professional PostgreSQL database.
• Summary Screenshot: bob_sessions/task-01_summary.png
• Exported History: bob_sessions/task-01_history.md

#### Task 2: Architecture Running
• Description: Verified the project architecture and service connectivity using Docker.
• Summary Screenshot: bob_sessions/task-02_summary.png
• Exported History: bob_sessions/task-02_history.md

#### Task 3: Onboarding Dashboard
• Description: Developed the user-linked progress tracking and history dashboard.
• Summary Screenshot: bob_sessions/task-03_summary.png
• Exported History: bob_sessions/task-03_history.md

#### Task 4: Real-Time Sync
• Description: Implemented bi-directional synchronization between the UI and database.
• Summary Screenshot: bob_sessions/task-04_summary.png
• Exported History: bob_sessions/task-04_history.md

#### Task 5: watsonx Service
• Description: Integrated IBM watsonx AI SDK and implemented fallback AI services.
• Summary Screenshot: bob_sessions/task-05_summary.png
• Exported History: bob_sessions/task-05_history.md

#### Task 6: Documentation Refactor
• Description: Cleaned up and professionalized all repository documentation.
• Summary Screenshot: bob_sessions/task-06_summary.png
• Exported History: bob_sessions/task-06_history.md

#### Task 7: Deployment Configuration
• Description: Optimized Docker settings and environment variable handling.
• Summary Screenshot: bob_sessions/task-07_summary.png
• Exported History: bob_sessions/task-07_history.md

#### Task 8: Service Validation
• Description: Conducted end-to-end testing of the analysis and generation pipeline.
• Summary Screenshot: bob_sessions/task-08_summary.png
• Exported History: bob_sessions/task-08_history.md

#### Task 9: Final Submission Report
• Description: Consolidated all project metrics and created the final hackathon report.
• Summary Screenshot: bob_sessions/task-09_summary.png
• Exported History: bob_sessions/task-09_history.md

---

## 6. Features Implemented

• **AI-Powered Analysis**: Deep semantic analysis of GitHub repos using IBM watsonx.ai.
• **Real-Time Progress (SSE)**: Live streaming of analysis status to the user interface.
• **Mermaid.js Visualization**: Automatic generation of architectural diagrams from code structure.
• **Interactive Checklist**: Dynamic onboarding tasks generated based on repository contents.
• **Personal Dashboard**: Persistent history of analyzed projects and onboarding progress.
• **Secure Authentication**: User accounts with encrypted token storage for private repo access.

---

## 7. Tech Stack

• **Frontend**: React (Vite), TailwindCSS, Axios, React Markdown, Mermaid.js.
• **Backend**: Python (Flask), SQLAlchemy, Server-Sent Events (SSE).
• **Database**: PostgreSQL (Relational persistence).
• **AI / IBM Tools**: IBM Bob (Lead Dev), IBM watsonx.ai (LLM Engine).
• **DevOps**: Docker, Docker Compose.

---

## 8. How to Run the Project

### Prerequisites
- Docker Desktop
- IBM watsonx.ai API Credentials

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/chamika-u/Anbu.git
cd Anbu

# 2. Configure Environment
cp .env.example .env
# Edit .env with your WATSONX_API_KEY and WATSONX_PROJECT_ID

# 3. Launch with Docker
docker-compose up --build
```
Access the application at `http://localhost`.

---

## 9. Submission Checklist

• [x] Public repo URL is available.
• [ ] Demo video URL is available.
• [x] bob_sessions/ folder exists in the repo root.
• [x] Bob session summary screenshots are included.
• [x] Bob exported task-history Markdown files are included.
• [x] Problem and solution statement is complete.
• [x] IBM Bob usage is clearly explained.
• [x] Final code is pushed to the main branch.

---

## 10. Notes

Anbu was built with the vision of making open-source and corporate codebases more accessible. By combining IBM's powerful foundation models with a developer-centric UI, we aim to reduce the "imposter syndrome" often felt by new developers and foster a more inclusive engineering culture.