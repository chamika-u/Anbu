from flask import Blueprint, request, jsonify, Response, stream_with_context
from app.services.watsonx_service import get_watsonx_service
from app.services.default_ai_service import get_default_ai_service
import requests
import re
import json
from datetime import datetime
import urllib3
import time

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


# Mermaid generation is now handled by DefaultAIService


# Fallback documentation is now handled by DefaultAIService


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
    """Analyse a GitHub repository and return onboarding documentation via SSE."""
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

        def generate():
            try:
                yield f"data: {json.dumps({'status': 'progress', 'message': f'Connecting to GitHub to fetch {owner}/{repo}...'})}\n\n"
                print(f"[Analyze] Fetching data for {owner}/{repo}…")
                repo_info, fetch_error = fetch_github_repo_data(owner, repo)
                if fetch_error:
                    yield f"data: {json.dumps({'status': 'error', 'error': fetch_error})}\n\n"
                    return

                yield f"data: {json.dumps({'status': 'progress', 'message': 'Analysing project structure and dependencies...'})}\n\n"
                
                # Provide specific progress updates based on repo contents
                tree = repo_info.get('tree', [])
                top_dirs = set()
                files = []
                for item in tree:
                    path = item.get('path', '')
                    parts = path.split('/')
                    if len(parts) > 1:
                        top_dirs.add(parts[0].lower())
                    if item.get('type') != 'tree':
                        files.append(path.split('/')[-1].lower())
                        
                if any(d in top_dirs for d in ['frontend', 'client', 'ui', 'web', 'app']):
                    yield f"data: {json.dumps({'status': 'progress', 'message': f'Analysing frontend components for {repo}...'})}\n\n"
                    time.sleep(0.6)
                    
                if any(d in top_dirs for d in ['backend', 'server', 'api']):
                    yield f"data: {json.dumps({'status': 'progress', 'message': f'Analysing backend services for {repo}...'})}\n\n"
                    time.sleep(0.6)
                    
                if any(f in files for f in ['package.json', 'requirements.txt', 'pom.xml', 'go.mod', 'cargo.toml']):
                    yield f"data: {json.dumps({'status': 'progress', 'message': 'Resolving package dependencies...'})}\n\n"
                    time.sleep(0.6)
                    
                if any(f in files for f in ['docker-compose.yml', 'docker-compose.yaml', 'dockerfile']):
                    yield f"data: {json.dumps({'status': 'progress', 'message': 'Inspecting containerization configs...'})}\n\n"
                    time.sleep(0.6)
                    
                languages = repo_info.get('languages', [])
                if languages:
                    langs_str = ", ".join(languages[:3])
                    yield f"data: {json.dumps({'status': 'progress', 'message': f'Processing {langs_str} ecosystem...'})}\n\n"
                    time.sleep(0.6)

                # Try AI generation
                watsonx_service = get_watsonx_service()
                default_service = get_default_ai_service()
                ai_generated = False
                documentation = ''

                if watsonx_service.is_available():
                    yield f"data: {json.dumps({'status': 'progress', 'message': f'Generating AI documentation for {repo} using IBM watsonx...'})}\n\n"
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
                        print(f"[Analyze] WatsonX runtime error: {wx_error} — using fallback")
                        yield f"data: {json.dumps({'status': 'progress', 'message': 'AI generation failed. Using default code...'})}\n\n"
                        # Use default service as fallback
                        df_response = default_service.generate_documentation('', repo_info={'owner': owner, 'repo_name': repo, 'language': repo_info.get('language'), 'languages': repo_info.get('languages'), 'description': repo_info.get('description'), 'tree': repo_info.get('tree', [])})
                        documentation = df_response.get('content') or ''
                else:
                    print("[Analyze] WatsonX not configured — using default code")
                    yield f"data: {json.dumps({'status': 'progress', 'message': 'Generating documentation using default code...'})}\n\n"
                    # Use default service
                    df_response = default_service.generate_documentation('', repo_info={'owner': owner, 'repo_name': repo, 'language': repo_info.get('language'), 'languages': repo_info.get('languages'), 'description': repo_info.get('description'), 'tree': repo_info.get('tree', [])})
                    documentation = df_response.get('content') or ''

                yield f"data: {json.dumps({'status': 'progress', 'message': 'Finalising documentation and checklist...'})}\n\n"
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

                result = {
                    'success': True,
                    'documentation': documentation,
                    'metadata': metadata,
                    'share_url': f"https://github.com/{owner}/{repo}",
                    'using_watsonx': ai_generated,
                }
                
                yield f"data: {json.dumps({'status': 'complete', 'result': result})}\n\n"

            except Exception as e:
                print(f"[Analyze] Unhandled exception in generator: {e}")
                yield f"data: {json.dumps({'status': 'error', 'error': f'Internal server error: {e}'})}\n\n"

        return Response(stream_with_context(generate()), mimetype='text/event-stream')

    except Exception as e:
        print(f"[Analyze] Unhandled exception: {e}")
        return jsonify({
            'success': False,
            'error':   f'Internal server error: {e}',
        }), 500