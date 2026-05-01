import os
from datetime import datetime
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.foundation_models import ModelInference

class WatsonXService:
    """Service for interacting with IBM WatsonX AI"""
    
    def __init__(self):
        # WatsonX AI credentials
        self.api_key = os.getenv('IBM_WATSONX_API_KEY')
        self.project_id = os.getenv('IBM_WATSONX_PROJECT_ID')
        self.url = os.getenv('IBM_WATSONX_URL', 'https://us-south.ml.cloud.ibm.com')
        
        # Initialize WatsonX client
        self.credentials = {
            "url": self.url,
            "apikey": self.api_key
        }
        
        self.client = APIClient(self.credentials)
        self.conversations = {}
    
    def send_message(self, message: str, conversation_id: str = None, model_id: str = None):
        """Send a message to WatsonX and get response"""
        if model_id is None:
            model_id = os.getenv('IBM_WATSONX_MODEL_ID', 'ibm/granite-13b-chat-v2')
        
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
        
        # Build conversation context
        conversation_history = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in self.conversations[conversation_id]['messages']
        ])
        
        # Initialize model
        model = ModelInference(
            model_id=model_id,
            api_client=self.client,
            project_id=self.project_id,
            params={
                "decoding_method": "greedy",
                "max_new_tokens": 1024,
                "temperature": 0.7,
                "top_k": 50,
                "top_p": 1
            }
        )
        
        # Get response from WatsonX
        response = model.generate_text(prompt=conversation_history)
        
        # Add assistant response to conversation
        self.conversations[conversation_id]['messages'].append({
            'role': 'assistant',
            'content': response,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        return {
            'conversation_id': conversation_id,
            'message': response,
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


class WatsonAssistantService:
    """Service for interacting with IBM Watson Assistant"""
    
    def __init__(self):
        # Watson Assistant credentials
        self.api_key = os.getenv('IBM_WATSON_API_KEY')
        self.assistant_id = os.getenv('IBM_WATSON_ASSISTANT_ID')
        self.url = os.getenv('IBM_WATSON_URL')
        self.version = os.getenv('IBM_WATSON_VERSION', '2021-11-27')
        
        # Initialize Watson Assistant
        authenticator = IAMAuthenticator(self.api_key)
        self.assistant = AssistantV2(
            version=self.version,
            authenticator=authenticator
        )
        self.assistant.set_service_url(self.url)
        
        self.sessions = {}
    
    def create_session(self):
        """Create a new Watson Assistant session"""
        response = self.assistant.create_session(
            assistant_id=self.assistant_id
        ).get_result()
        
        session_id = response['session_id']
        self.sessions[session_id] = {
            'id': session_id,
            'created_at': datetime.utcnow().isoformat()
        }
        
        return session_id
    
    def send_message(self, session_id: str, message: str):
        """Send a message to Watson Assistant"""
        if session_id not in self.sessions:
            session_id = self.create_session()
        
        response = self.assistant.message(
            assistant_id=self.assistant_id,
            session_id=session_id,
            input={
                'message_type': 'text',
                'text': message
            }
        ).get_result()
        
        # Extract response text
        assistant_message = ""
        if response.get('output', {}).get('generic'):
            for item in response['output']['generic']:
                if item.get('response_type') == 'text':
                    assistant_message += item.get('text', '')
        
        return {
            'session_id': session_id,
            'message': assistant_message,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def delete_session(self, session_id: str):
        """Delete a Watson Assistant session"""
        try:
            self.assistant.delete_session(
                assistant_id=self.assistant_id,
                session_id=session_id
            )
            if session_id in self.sessions:
                del self.sessions[session_id]
        except Exception as e:
            print(f"Error deleting session: {e}")

# Made with Bob
