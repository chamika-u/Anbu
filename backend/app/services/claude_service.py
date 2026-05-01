import os
from anthropic import Anthropic
from datetime import datetime

class ClaudeService:
    """Service for interacting with Claude API"""
    
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
        self.conversations = {}
    
    def send_message(self, message: str, conversation_id: str = None):
        """Send a message to Claude and get response"""
        if conversation_id is None:
            conversation_id = self._generate_conversation_id()
            self.conversations[conversation_id] = {
                'id': conversation_id,
                'messages': [],
                'created_at': datetime.utcnow().isoformat()
            }
        
        # Add user message to conversation
        self.conversations[conversation_id]['messages'].append({
            'role': 'user',
            'content': message,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Get response from Claude
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=[
                {"role": msg['role'], "content": msg['content']}
                for msg in self.conversations[conversation_id]['messages']
            ]
        )
        
        # Add assistant response to conversation
        assistant_message = response.content[0].text
        self.conversations[conversation_id]['messages'].append({
            'role': 'assistant',
            'content': assistant_message,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        return {
            'conversation_id': conversation_id,
            'message': assistant_message,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def get_conversations(self):
        """Get all conversations"""
        return list(self.conversations.values())
    
    def delete_conversation(self, conversation_id: str):
        """Delete a conversation"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
    
    def _generate_conversation_id(self):
        """Generate a unique conversation ID"""
        return f"conv_{datetime.utcnow().timestamp()}"

# Made with Bob
