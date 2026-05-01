from flask import Blueprint, request, jsonify
from app.services.watsonx_service import WatsonXService, WatsonAssistantService

bp = Blueprint('chat', __name__, url_prefix='/api')
watsonx_service = WatsonXService()
watson_assistant_service = WatsonAssistantService()

@bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests using WatsonX"""
    try:
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

@bp.route('/chat/assistant', methods=['POST'])
def chat_assistant():
    """Handle chat requests using Watson Assistant"""
    try:
        data = request.get_json()
        message = data.get('message')
        session_id = data.get('session_id')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not session_id:
            session_id = watson_assistant_service.create_session()
            if not session_id:
                return jsonify({'error': 'Failed to create session'}), 500
        
        response = watson_assistant_service.send_message(session_id, message)
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/conversations', methods=['GET'])
def get_conversations():
    """Get all conversations"""
    try:
        conversations = watsonx_service.get_conversations()
        return jsonify(conversations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/conversations/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    """Delete a conversation"""
    try:
        watsonx_service.delete_conversation(conversation_id)
        return jsonify({'message': 'Conversation deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/sessions', methods=['POST'])
def create_session():
    """Create a new Watson Assistant session"""
    try:
        session_id = watson_assistant_service.create_session()
        return jsonify({'session_id': session_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a Watson Assistant session"""
    try:
        watson_assistant_service.delete_session(session_id)
        return jsonify({'message': 'Session deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Made with Bob
