from app import db
from datetime import datetime

class Document(db.Model):
    """Document model for storing uploaded documents"""
    __tablename__ = 'documents'
    
    id = db.Column(db.String(100), primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(500), nullable=False)
    size = db.Column(db.Integer)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'size': self.size,
            'uploaded_at': self.uploaded_at.isoformat()
        }

# Made with Bob
