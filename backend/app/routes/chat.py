from flask import Blueprint, request, jsonify
from app.services.watsonx_service import get_watsonx_service
from app.services.default_ai_service import get_default_ai_service

bp = Blueprint('chat', __name__, url_prefix='/api')

@bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests using WatsonX or Default fallback"""
    try:
        watsonx_service = get_watsonx_service()
        default_service = get_default_ai_service()
        
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'Request body must be JSON.'}), 400
        message = data.get('message')
        conversation_id = data.get('conversation_id')
        model_id = data.get('model_id')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Decide which service to use
        if watsonx_service.is_available():
            print("[Chat] Using WatsonX AI")
            response = watsonx_service.send_message(message, conversation_id, model_id)
        else:
            print("[Chat] WatsonX not available, using Default AI")
            response = default_service.send_message(message, conversation_id, model_id)
        
        return jsonify(response), 200
    except Exception as e:
        print(f"[Chat] Error: {e}")
        return jsonify({'error': str(e)}), 500

# Made with Bob
