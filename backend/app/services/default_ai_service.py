import os
from datetime import datetime
from typing import Optional, Dict, Any

class DefaultAIService:
    """Fallback service when WatsonX is not available"""
    
    def __init__(self):
        pass

    def generate_deterministic_mermaid(self, repo_name: str, tree: list) -> str:
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
        
    def generate_documentation(self, prompt: str, repo_info: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate documentation using a template fallback
        """
        if not repo_info:
            return {
                'success': False,
                'error': 'Repository info required for template generation',
                'content': None
            }
            
        owner = repo_info.get('owner', 'unknown')
        repo = repo_info.get('repo_name', 'unknown')
        language = repo_info.get('language', 'Unknown')
        languages = repo_info.get('languages', [])
        tech_stack = ', '.join(languages) if languages else language
        description = repo_info.get('description') or 'No description provided'
        
        # Generate Mermaid diagram
        tree = repo_info.get('tree', [])
        mermaid_code = self.generate_deterministic_mermaid(repo, tree)
        
        # This is essentially what was in analyze.py, moved here for modularity
        content = f"""# {repo} — Developer Onboarding Guide

> **Note:** This documentation was generated using a template because IBM watsonx AI is not configured. 

## 1. Project Overview
- **Repository**: `{owner}/{repo}`
- **Description**: {description}
- **Primary Language**: {language}
- **Tech Stack**: {tech_stack}

## 2. Technology Stack
The project primarily uses {tech_stack}. Based on the repository structure, it appears to be a modern development project with standard configurations.

## 3. Repository Architecture
The following diagram shows the core directory structure of the repository:

```mermaid
{mermaid_code}
```

## 4. Getting Started
To get started with {repo}, follow these steps:

### Prerequisites
- Git installed on your machine
- {language} development environment
- Basic familiarity with {language}

### Installation
```bash
git clone https://github.com/{owner}/{repo}.git
cd {repo}
```

Then install dependencies as described in the repository's README.

## 4. Development Workflow
1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and write tests
3. Commit with a clear message: `git commit -m "feat: add my feature"`
4. Open a pull request for review

## 5. Resources & Help
- [Repository on GitHub](https://github.com/{owner}/{repo})
- [GitHub Docs](https://docs.github.com)
- [{language} Documentation](https://www.google.com/search?q={language}+documentation)
"""
        return {
            'success': True,
            'content': content,
            'error': None
        }

    def send_message(self, message: str, conversation_id: Optional[str] = None, model_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Simple rule-based chat response for when WatsonX is unavailable
        """
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey']):
            response = "Hello! I'm Anbu's assistant. IBM watsonx AI is currently not configured, so I'm operating in a basic mode. How can I help you today?"
        elif 'what is' in message_lower and 'anbu' in message_lower:
            response = "Anbu (அன்பு) means 'Love' in Tamil. It's an AI-powered platform designed to help junior developers onboard faster by generating comprehensive documentation from GitHub repositories."
        elif 'how' in message_lower and 'work' in message_lower:
            response = "Anbu works by fetching repository metadata via the GitHub API and then using IBM watsonx AI to analyze the structure and generate Markdown documentation."
        elif 'watsonx' in message_lower or 'ibm' in message_lower:
            response = "IBM watsonx is a powerful AI platform that Anbu uses for deep code analysis. It seems like the credentials are not correctly set in the .env file at the moment."
        else:
            response = "I'm currently running in 'Default Mode' because IBM watsonx AI is not configured. To get full AI capabilities, please add your IBM_WATSONX_API_KEY and IBM_WATSONX_PROJECT_ID to the .env file. \n\nYou asked: '" + message + "'"

        return {
            'conversation_id': conversation_id or f"def_{datetime.utcnow().timestamp()}",
            'message': response,
            'timestamp': datetime.utcnow().isoformat(),
            'model_id': 'default-fallback'
        }

    def is_available(self) -> bool:
        return True

# Singleton instance
_default_service: Optional[DefaultAIService] = None

def get_default_ai_service() -> DefaultAIService:
    global _default_service
    if _default_service is None:
        _default_service = DefaultAIService()
    return _default_service
