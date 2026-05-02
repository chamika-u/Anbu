from flask import Blueprint, request, jsonify
from app.services.watsonx_service import get_watsonx_service
import requests
import re
import json
from datetime import datetime
import urllib3

from app import db
from app.models.analysis import RepositoryAnalysis
from app.routes.auth import get_optional_user

# Suppress noisy SSL warnings for GitHub API calls
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

bp = Blueprint('analyze', __name__, url_prefix='/api')


# ── Helpers ───────────────────────────────────────────────────────────────────

def extract_repo_info(repo_url: str):
    """Return (owner, repo) from a GitHub URL, or (None, None) if unrecognised."""
    pattern = r'github\.com/([^/]+)/([^/]+?)(?:\.git)?/?$'
    match = re.search(pattern, repo_url)
    if match:
        return match.group(1), match.group(2)
    return None, None


def fetch_github_repo_data(owner: str, repo: str):
    """
    Fetch repository metadata from the GitHub REST API.

    Returns:
        (repo_data_dict, None)  on success
        (None, error_message)   on failure
    """
    headers = {'Accept': 'application/vnd.github+json'}

    try:
        repo_response = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}',
            headers=headers,
            verify=False,
            timeout=15,
        )
        if repo_response.status_code == 404:
            return None, f"Repository '{owner}/{repo}' not found. Make sure it exists and is public."
        if repo_response.status_code == 403:
            return None, "GitHub API rate limit exceeded. Please wait a moment and try again."
        if repo_response.status_code != 200:
            return None, f"GitHub API returned status {repo_response.status_code}."

        repo_data = repo_response.json()

        # Fetch full recursive tree for architecture diagram
        default_branch = repo_data.get('default_branch', 'main')
        tree_resp = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1',
            headers=headers,
            verify=False,
            timeout=15,
        )
        tree_data = tree_resp.json().get('tree', []) if tree_resp.status_code == 200 else []

        # Language breakdown
        languages_resp = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}/languages',
            headers=headers,
            verify=False,
            timeout=15,
        )
        languages_data = languages_resp.json() if languages_resp.status_code == 200 else {}

        return {
            'name':           repo_data.get('name', repo),
            'description':    repo_data.get('description') or '',
            'language':       repo_data.get('language') or 'Unknown',
            'languages':      list(languages_data.keys()),
            'stars':          repo_data.get('stargazers_count', 0),
            'forks':          repo_data.get('forks_count', 0),
            'topics':         repo_data.get('topics', []),
            'tree':           tree_data,
            'default_branch': default_branch,
            'created_at':     repo_data.get('created_at'),
            'updated_at':     repo_data.get('updated_at'),
        }, None

    except requests.exceptions.Timeout:
        return None, "Timed out while connecting to GitHub. Please try again."
    except requests.exceptions.ConnectionError:
        return None, "Could not connect to GitHub. Check your internet connection."
    except Exception as e:
        return None, f"Unexpected error fetching repository data: {e}"


def build_prompt(repo_info: dict, owner: str, repo: str) -> str:
    """Build the documentation-generation prompt for the AI model."""
    languages = ', '.join(repo_info['languages']) if repo_info['languages'] else repo_info['language']
    topics    = ', '.join(repo_info['topics'])    if repo_info['topics']    else 'None'
    stars     = repo_info.get('stars', 0)
    forks     = repo_info.get('forks', 0)

    return f"""Generate comprehensive onboarding documentation for a junior developer joining a project.

Repository: {owner}/{repo}
Description: {repo_info['description'] or 'No description provided'}
Primary Language: {repo_info['language']}
All Languages: {languages}
Topics / Tags: {topics}
Stars: {stars} | Forks: {forks}

Write the documentation in Markdown. Include the following sections:

# {repo} — Developer Onboarding Guide

## 1. Project Overview
- What this project does and why it exists
- Key features and target audience

## 2. Technology Stack
- Languages, frameworks, and major libraries used
- Development tools and runtime versions

## 3. Architecture Visualization
- Create a Mermaid.js diagram (using `graph TD` or `graph LR`) visualizing the core architecture, data flow, or directory structure of the project.
- Enclose the diagram in a standard markdown code block with the language set to `mermaid`. Avoid using any HTML tags inside the mermaid labels.

## 4. Getting Started
- Prerequisites (tools, accounts, and environment)
- Step-by-step installation guide
- Running the project locally
- Environment variables / configuration

## 5. Project Structure
- Directory layout with explanations
- Key files and their roles

## 6. Development Workflow
- Branching strategy and commit conventions
- Code style and linting rules
- Testing procedures
- Submitting pull requests

## 7. Common Tasks
- Adding a new feature
- Fixing a bug
- Running the test suite
- Deploying to production

## 8. Resources & Help
- Official docs and tutorials
- Community channels
- Who to contact for help

Make every section actionable, beginner-friendly, and use examples where helpful."""


def generate_deterministic_mermaid(repo_name: str, tree: list) -> str:
    """Generate a Mermaid diagram based on the actual repository root contents."""
    if not tree:
        return "graph LR\n    A[Repository] --> B[Empty]"
        
    lines = ["graph LR", f'    Root["📦 {repo_name}"]']
    lines.append('    style Root fill:#161616,color:#ffffff,stroke:#161616,stroke-width:2px,rx:10,ry:10')
    
    ignore_dirs = {'node_modules', 'venv', '.git', '.github', 'dist', 'build', '__pycache__', '.next'}
    
    # Filter and sort paths
    paths = []
    for item in tree:
        path = item.get('path', '')
        parts = path.split('/')
        if any(part in ignore_dirs or part.startswith('.') and len(part) > 1 for part in parts):
            continue
        paths.append((path, item.get('type') == 'tree'))
        
    # Process folders first, then files
    paths.sort(key=lambda x: (not x[1], x[0].lower()))
    
    MAX_NODES = 40
    node_count = 0
    added_nodes = {'': 'Root'}
    
    for path, is_dir in paths:
        if node_count >= MAX_NODES:
            break
            
        parts = path.split('/')
        parent_path = '/'.join(parts[:-1])
        name = parts[-1]
        
        # If parent isn't in graph (e.g. skipped by limits), skip this
        if parent_path not in added_nodes:
            continue
            
        parent_id = added_nodes[parent_path]
        node_id = f"node_{node_count}"
        added_nodes[path] = node_id
        
        if is_dir:
            lines.append(f'    {parent_id} --> {node_id}["📁 {name}"]')
            lines.append(f'    style {node_id} fill:#f0f4ff,stroke:#0f62fe,stroke-width:2px')
        else:
            lines.append(f'    {parent_id} --> {node_id}["📄 {name}"]')
            lines.append(f'    style {node_id} fill:#ffffff,stroke:#8d8d8d,stroke-width:1px')
            
        node_count += 1
            
    if len(paths) > MAX_NODES:
        lines.append(f'    Root -.-> More["... and {len(paths) - MAX_NODES} more items hidden"]')
        lines.append(f'    style More fill:#f4f4f4,stroke:#e0e0e0,stroke-dasharray: 5 5')
    
    return "\n".join(lines)


def build_fallback_documentation(owner: str, repo: str, repo_info: dict) -> str:
    """Return a plain template when WatsonX AI is unavailable."""
    language  = repo_info.get('language', 'Unknown')
    languages = repo_info.get('languages', [])
    tech_stack = ', '.join(languages) if languages else language
    description = repo_info.get('description') or 'No description provided'
    
    mermaid_code = generate_deterministic_mermaid(repo, repo_info.get('tree', []))

    return f"""# {repo} — Developer Onboarding Guide

> **Note:** This is an auto-generated template. Configure IBM watsonx AI credentials for a fully AI-generated guide.

## Project Overview

| Field | Value |
|---|---|
| Repository | `{owner}/{repo}` |
| Description | {description} |
| Primary Language | {language} |
| Tech Stack | {tech_stack} |

## Repository Architecture

This is the live directory structure fetched directly from GitHub:

```mermaid
{mermaid_code}
```

## Getting Started

### Prerequisites
- Git installed on your machine
- {language} development environment
- Basic familiarity with {language}

### Installation

```bash
git clone https://github.com/{owner}/{repo}.git
cd {repo}
```

Then install dependencies and configure environment variables as described in the repository's own README.

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and write tests
3. Commit with a clear message: `git commit -m "feat: add my feature"`
4. Open a pull request for review

## Resources

- [Repository on GitHub](https://github.com/{owner}/{repo})
- [GitHub Docs](https://docs.github.com)
- [{language} Documentation](https://www.google.com/search?q={language}+documentation)
"""


def generate_deterministic_checklist(repo_info: dict) -> list:
    """Generate a dynamic checklist based on files found in the repository."""
    tree = repo_info.get('tree', [])
    # Extract just the filenames for quick lookups
    files = {item.get('path', '').split('/')[-1].lower() for item in tree if item.get('type') != 'tree'}
    
    tasks = [
        {"id": "clone", "title": "Clone the repository to your local machine"},
        {"id": "ide", "title": "Open the project in your preferred IDE"}
    ]
    
    if "readme.md" in files:
        tasks.append({"id": "readme", "title": "Read through the README.md for project-specific context"})
    
    if ".env.example" in files or ".env.template" in files or ".env.sample" in files:
        tasks.append({"id": "env", "title": "Duplicate the example environment file to .env and fill in required secrets"})
        
    if "package.json" in files:
        tasks.append({"id": "npm", "title": "Install Node.js dependencies (run `npm install`, `yarn`, or `pnpm install`)"})
        
    if "requirements.txt" in files:
        tasks.append({"id": "pip", "title": "Create a Python virtual environment and run `pip install -r requirements.txt`"})
        
    if "docker-compose.yml" in files or "docker-compose.yaml" in files:
        tasks.append({"id": "docker", "title": "Start background services using `docker-compose up -d`"})
        
    if "makefile" in files:
        tasks.append({"id": "make", "title": "Explore the Makefile for available build/run commands"})
        
    return tasks


# ── Route ─────────────────────────────────────────────────────────────────────

@bp.route('/analyze', methods=['POST'])
def analyze_repository():
    """Analyse a GitHub repository and return onboarding documentation."""
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'success': False, 'error': 'Request body must be JSON.'}), 400

        repo_url = (data.get('repo_url') or '').strip()
        if not repo_url:
            return jsonify({'success': False, 'error': 'Repository URL is required.'}), 400

        # Parse GitHub URL
        owner, repo = extract_repo_info(repo_url)
        if not owner or not repo:
            return jsonify({
                'success': False,
                'error': 'Invalid GitHub URL. Expected format: https://github.com/owner/repo',
            }), 400

        # Fetch data from GitHub
        print(f"[Analyze] Fetching data for {owner}/{repo}…")
        repo_info, fetch_error = fetch_github_repo_data(owner, repo)
        if fetch_error:
            return jsonify({'success': False, 'error': fetch_error}), 400

        # Try AI generation
        watsonx_service = get_watsonx_service()
        ai_generated = False
        documentation = ''

        if watsonx_service.is_available():
            print("[Analyze] WatsonX is configured — generating AI documentation…")
            prompt = build_prompt(repo_info, owner, repo)
            wx_response = watsonx_service.generate_documentation(prompt)

            if wx_response.get('success') and wx_response.get('content'):
                documentation = wx_response['content']
                ai_generated = True
                print(f"[Analyze] ✓ AI documentation generated ({len(documentation)} chars)")
            else:
                # WatsonX call failed at runtime — fall back gracefully
                wx_error = wx_response.get('error', 'Unknown WatsonX error')
                print(f"[Analyze] WatsonX runtime error: {wx_error} — using fallback template")
                documentation = build_fallback_documentation(owner, repo, repo_info)
        else:
            print("[Analyze] WatsonX not configured — using fallback template")
            documentation = build_fallback_documentation(owner, repo, repo_info)

        # Generate Checklist
        checklist = generate_deterministic_checklist(repo_info)

        metadata = {
            'repo_name':          repo,
            'owner':              owner,
            'tech_stack':         repo_info.get('languages', []),
            'dependencies_count': len(repo_info.get('tree', [])),
            'generated_at':       datetime.utcnow().isoformat() + 'Z',
            'ai_generated':       ai_generated,
            'checklist':          checklist,
        }

        # Save to database
        try:
            user = get_optional_user()
            print(f"[Analyze] Saving record. User ID resolved: {user.id if user else 'None'}")
            analysis_record = RepositoryAnalysis(
                repo_url=repo_url,
                owner=owner,
                repo_name=repo,
                documentation=documentation,
                metadata_json=json.dumps(metadata),
                user_id=user.id if user else None
            )
            db.session.add(analysis_record)
            db.session.commit()
            print(f"[Analyze] Saved analysis to database with ID: {analysis_record.id}")
            metadata['id'] = analysis_record.id
        except Exception as db_err:
            print(f"[Analyze] Database save error: {db_err}")
            db.session.rollback()

        return jsonify({
            'success':       True,
            'documentation': documentation,
            'metadata':      metadata,
            'share_url':     f'https://github.com/{owner}/{repo}',
            'using_watsonx': ai_generated,
        }), 200

    except Exception as e:
        print(f"[Analyze] Unhandled exception: {e}")
        return jsonify({
            'success': False,
            'error':   f'Internal server error: {e}',
        }), 500