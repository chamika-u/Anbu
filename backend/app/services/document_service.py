import os
from datetime import datetime
from werkzeug.utils import secure_filename

class DocumentService:
    """Service for handling document operations"""
    
    def __init__(self):
        self.documents = {}
        self.upload_folder = os.getenv('UPLOAD_FOLDER', 'uploads')
        os.makedirs(self.upload_folder, exist_ok=True)
    
    def process_document(self, file):
        """Process and store an uploaded document"""
        filename = secure_filename(file.filename)
        document_id = self._generate_document_id()
        
        # Save file
        filepath = os.path.join(self.upload_folder, f"{document_id}_{filename}")
        file.save(filepath)
        
        # Store document metadata
        self.documents[document_id] = {
            'id': document_id,
            'filename': filename,
            'filepath': filepath,
            'uploaded_at': datetime.utcnow().isoformat(),
            'size': os.path.getsize(filepath)
        }
        
        return self.documents[document_id]
    
    def get_all_documents(self):
        """Get all documents"""
        return list(self.documents.values())
    
    def delete_document(self, document_id: str):
        """Delete a document"""
        if document_id in self.documents:
            # Delete file
            filepath = self.documents[document_id]['filepath']
            if os.path.exists(filepath):
                os.remove(filepath)
            
            # Remove from storage
            del self.documents[document_id]
    
    def _generate_document_id(self):
        """Generate a unique document ID"""
        return f"doc_{datetime.utcnow().timestamp()}"

# Made with Bob
