from app import db
from datetime import datetime
import json

class RepositoryAnalysis(db.Model):
    """Model for storing generated repository documentation and metadata."""
    __tablename__ = 'repository_analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    repo_url = db.Column(db.String(512), nullable=False)
    owner = db.Column(db.String(128), nullable=False)
    repo_name = db.Column(db.String(128), nullable=False)
    
    documentation = db.Column(db.Text, nullable=False)
    metadata_json = db.Column(db.Text, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_metadata(self):
        try:
            return json.loads(self.metadata_json)
        except:
            return {}
            
    def to_dict(self):
        return {
            'id': self.id,
            'repo_url': self.repo_url,
            'owner': self.owner,
            'repo_name': self.repo_name,
            'documentation': self.documentation,
            'metadata': self.get_metadata(),
            'created_at': self.created_at.isoformat() + 'Z'
        }
