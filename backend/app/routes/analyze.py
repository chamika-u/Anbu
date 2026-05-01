from flask import Blueprint, request, jsonify
from app.services.watsonx_service import WatsonXService
import requests
import re
from datetime import datetime
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

bp = Blueprint('analyze', __name__, url_prefix='/api')
watsonx_service = WatsonXService()

def extract_repo_info(repo_url):
    """Extract owner and repo name from GitHub URL"""
    pattern = r'github\.com/([^/]+)/([^/]+?)(?:\.git)?/?$'
    match = re.search(pattern, repo_url)
    if match:
        return match.group(1), match.group(2)
    return None, None

def fetch_github_repo_data(owner, repo):
    """Fetch repository data from GitHub API"""
    try:
        # Disable SSL verification to avoid certificate issues
        # Get repository info
        repo_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}', verify=False)
        if repo_response.status_code != 200:
            return None, f"Repository not found or not accessible"
        
        repo_data = repo_response.json()
        
        # Get repository contents
        contents_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/contents', verify=False)
        contents_data = contents_response.json() if contents_response.status_code == 200 else []
        
        # Get languages
        languages_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/languages', verify=False)
        languages_data = languages_response.json() if languages_response.status_code == 200 else {}
        
        return {
            'name': repo_data.get('name'),
            'description': repo_data.get('description', ''),
            'language': repo_data.get('language', 'Unknown'),
            'languages': list(languages_data.keys()),
            'stars': repo_data.get('stargazers_count', 0),
            'forks': repo_data.get('forks_count', 0),
            'topics': repo_data.get('topics', []),
            'contents': contents_data,
            'default_branch': repo_data.get('default_branch', 'main'),
            'created_at': repo_data.get('created_at'),
            'updated_at': repo_data.get('updated_at'),
        }, None
    except Exception as e:
        return None, str(e)

def generate_documentation_prompt(repo_info, owner, repo):
    """Generate a prompt for WatsonX to create onboarding documentation"""
    languages = ', '.join(repo_info['languages']) if repo_info['languages'] else repo_info['language']
    topics = ', '.join(repo_info['topics']) if repo_info['topics'] else 'None'
    
    prompt = f"""Generate comprehensive onboarding documentation for a junior developer joining a project.

Repository: {owner}/{repo}
Description: {repo_info['description']}
Primary Language: {repo_info['language']}
Tech Stack: {languages}
Topics: {topics}

Create a detailed onboarding guide in Markdown format that includes:

1. **Project Overview**
   - What the project does
   - Key features and functionality
   - Target audience or use case

2. **Technology Stack**
   - Programming languages used
   - Frameworks and libraries
   - Development tools

3. **Getting Started**
   - Prerequisites (software, tools, accounts needed)
   - Installation steps
   - Configuration requirements
   - How to run the project locally

4. **Project Structure**
   - Main directories and their purposes
   - Key files and what they do
   - Architecture overview

5. **Development Workflow**
   - How to make changes
   - Testing procedures
   - Code style guidelines
   - Git workflow (branching, commits, PRs)

6. **Common Tasks**
   - How to add new features
   - How to fix bugs
   - How to run tests
   - How to deploy

7. **Resources**
   - Documentation links
   - Helpful tutorials
   - Community resources
   - Who to contact for help

Make it beginner-friendly, clear, and actionable. Use examples where helpful."""

    return prompt

@bp.route('/analyze', methods=['POST'])
def analyze_repository():
    """Analyze a GitHub repository and generate onboarding documentation"""
    try:
        data = request.get_json()
        repo_url = data.get('repo_url')
        
        if not repo_url:
            return jsonify({'error': 'Repository URL is required'}), 400
        
        # Extract owner and repo name
        owner, repo = extract_repo_info(repo_url)
        if not owner or not repo:
            return jsonify({'error': 'Invalid GitHub repository URL'}), 400
        
        # Fetch repository data from GitHub
        repo_info, error = fetch_github_repo_data(owner, repo)
        if error:
            return jsonify({'error': f'Failed to fetch repository data: {error}'}), 400
        
        # Generate documentation prompt
        prompt = generate_documentation_prompt(repo_info, owner, repo)
        
        # Use WatsonX to generate documentation
        response = watsonx_service.send_message(prompt)
        
        if 'error' in response:
            return jsonify({
                'success': False,
                'error': response['error']
            }), 500
        
        documentation = response.get('message', '')
        
        # Prepare metadata (repo_info is guaranteed to be a dict here, not None)
        metadata = {
            'repo_name': repo,
            'owner': owner,
            'tech_stack': repo_info['languages'] if repo_info else [],
            'dependencies_count': len(repo_info.get('contents', [])) if repo_info else 0,
            'generated_at': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'success': True,
            'documentation': documentation,
            'metadata': metadata,
            'share_url': f'https://github.com/{owner}/{repo}'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Made with Bob