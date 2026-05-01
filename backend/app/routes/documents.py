from flask import Blueprint, request, jsonify
from app.services.document_service import DocumentService

bp = Blueprint('documents', __name__, url_prefix='/api')
document_service = DocumentService()

@bp.route('/documents/upload', methods=['POST'])
def upload_document():
    """Upload and process a document"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        result = document_service.process_document(file)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents', methods=['GET'])
def get_documents():
    """Get all documents"""
    try:
        documents = document_service.get_all_documents()
        return jsonify(documents), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/<document_id>', methods=['DELETE'])
def delete_document(document_id):
    """Delete a document"""
    try:
        document_service.delete_document(document_id)
        return jsonify({'message': 'Document deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Made with Bob
