from flask import Blueprint, request, jsonify
from app.services.claude_service import ClaudeService

bp = Blueprint('chat', __name__, url_prefix='/api')
claude_service = ClaudeService()

@bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        message = data.get('message')
        conversation_id = data.get('conversation_id')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        response = claude_service.send_message(message, conversation_id)
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/conversations', methods=['GET'])
def get_conversations():
    """Get all conversations"""
    try:
        conversations = claude_service.get_conversations()
        return jsonify(conversations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/conversations/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    """Delete a conversation"""
    try:
        claude_service.delete_conversation(conversation_id)
        return jsonify({'message': 'Conversation deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Made with Bob
