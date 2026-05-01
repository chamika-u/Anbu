from flask import Blueprint, request, jsonify
from app.services.watsonx_service import get_watsonx_service

bp = Blueprint('chat', __name__, url_prefix='/api')

@bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests using WatsonX"""
    try:
        watsonx_service = get_watsonx_service()
        
        data = request.get_json()
        message = data.get('message')
        conversation_id = data.get('conversation_id')
        model_id = data.get('model_id')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        response = watsonx_service.send_message(message, conversation_id, model_id)
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Made with Bob
