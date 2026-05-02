from flask import Blueprint, request, jsonify
from app.services.watsonx_service import get_watsonx_service
import requests
import re
from datetime import datetime
import urllib3

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

        # Contents (root-level files)
        contents_resp = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}/contents',
            headers=headers,
            verify=False,
            timeout=15,
        )
        contents_data = contents_resp.json() if contents_resp.status_code == 200 else []

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
            'contents':       contents_data if isinstance(contents_data, list) else [],
            'default_branch': repo_data.get('default_branch', 'main'),
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

## 3. Getting Started
- Prerequisites (tools, accounts, and environment)
- Step-by-step installation guide
- Running the project locally
- Environment variables / configuration

## 4. Project Structure
- Directory layout with explanations
- Key files and their roles
- Architecture overview

## 5. Development Workflow
- Branching strategy and commit conventions
- Code style and linting rules
- Testing procedures
- Submitting pull requests

## 6. Common Tasks
- Adding a new feature
- Fixing a bug
- Running the test suite
- Deploying to production

## 7. Resources & Help
- Official docs and tutorials
- Community channels
- Who to contact for help

Make every section actionable, beginner-friendly, and use examples where helpful."""


def build_fallback_documentation(owner: str, repo: str, repo_info: dict) -> str:
    """Return a plain template when WatsonX AI is unavailable."""
    language  = repo_info.get('language', 'Unknown')
    languages = repo_info.get('languages', [])
    tech_stack = ', '.join(languages) if languages else language
    description = repo_info.get('description') or 'No description provided'

    return f"""# {repo} — Developer Onboarding Guide

> **Note:** This is an auto-generated template. Configure IBM watsonx AI credentials for a fully AI-generated guide.

## Project Overview

| Field | Value |
|---|---|
| Repository | `{owner}/{repo}` |
| Description | {description} |
| Primary Language | {language} |
| Tech Stack | {tech_stack} |

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

## Project Structure

Explore the repository to understand:
- Main application code
- Configuration files (`.env`, `config.*`)
- Tests (look for a `tests/` or `spec/` folder)
- Documentation (`docs/`, `README.md`)

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

        metadata = {
            'repo_name':          repo,
            'owner':              owner,
            'tech_stack':         repo_info.get('languages', []),
            'dependencies_count': len(repo_info.get('contents', [])),
            'generated_at':       datetime.utcnow().isoformat() + 'Z',
            'ai_generated':       ai_generated,
        }

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