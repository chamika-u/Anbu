import os
from datetime import datetime
from typing import Optional, Dict, Any

try:
    from ibm_watsonx_ai import APIClient, Credentials
    from ibm_watsonx_ai.foundation_models import ModelInference
    from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
    WATSONX_AVAILABLE = True
except ImportError:
    APIClient = None
    Credentials = None
    ModelInference = None
    GenParams = None
    WATSONX_AVAILABLE = False


class WatsonXService:
    """Service for interacting with IBM WatsonX AI"""
    
    def __init__(self):
        # WatsonX AI credentials
        self.api_key = os.getenv('IBM_WATSONX_API_KEY')
        self.project_id = os.getenv('IBM_WATSONX_PROJECT_ID')
        self.url = os.getenv('IBM_WATSONX_URL', 'https://us-south.ml.cloud.ibm.com')
        
        # Debug logging
        print(f"[WatsonX Init] API Key present: {bool(self.api_key and self.api_key != 'your-watsonx-api-key-here')}")
        print(f"[WatsonX Init] Project ID present: {bool(self.project_id and self.project_id != 'your-watsonx-project-id-here')}")
        print(f"[WatsonX Init] WatsonX SDK available: {WATSONX_AVAILABLE}")
        
        # Initialize WatsonX client only if credentials are available
        self.client = None
        self.is_configured = False
        
        if not WATSONX_AVAILABLE:
            print("[WatsonX Init] ✗ WatsonX SDK not installed. Install with: pip install ibm-watsonx-ai")
            return
            
        if not self.api_key or not self.project_id:
            print("[WatsonX Init] ✗ Missing credentials. Please set IBM_WATSONX_API_KEY and IBM_WATSONX_PROJECT_ID in .env")
            return
            
        # Check if credentials are not placeholder values
        if self.api_key == 'your-watsonx-api-key-here' or self.project_id == 'your-watsonx-project-id-here':
            print("[WatsonX Init] ✗ Placeholder credentials detected. Please update backend/.env with actual credentials.")
            return
        
        try:
            print("[WatsonX Init] Attempting to initialize WatsonX client...")
            credentials = Credentials(
                url=self.url,
                api_key=self.api_key
            )
            self.client = APIClient(credentials)
            self.client.set.default_project(self.project_id)
            self.is_configured = True
            print("[WatsonX Init] ✓ WatsonX client initialized successfully!")
        except Exception as e:
            print(f"[WatsonX Init] ✗ Could not initialize WatsonX client: {e}")
            self.client = None
            self.is_configured = False
    
    def generate_documentation(self, prompt: str, model_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate documentation using WatsonX AI
        
        Args:
            prompt: The prompt to send to the model
            model_id: Optional model ID to use (defaults to granite-13b-chat-v2)
            
        Returns:
            Dictionary with 'success', 'content', and optional 'error' keys
        """
        if not self.is_configured or not self.client:
            return {
                'success': False,
                'error': 'WatsonX AI is not configured. Please check your credentials.',
                'content': None
            }
        
        if model_id is None:
            model_id = os.getenv('IBM_WATSONX_MODEL_ID', 'ibm/granite-13b-chat-v2')
        
        try:
            print(f"[WatsonX] Generating documentation with model: {model_id}")
            
            # Initialize model with proper parameters
            model = ModelInference(
                model_id=model_id,
                api_client=self.client,
                project_id=self.project_id,
                params={
                    GenParams.DECODING_METHOD: "greedy",
                    GenParams.MAX_NEW_TOKENS: 2048,
                    GenParams.MIN_NEW_TOKENS: 100,
                    GenParams.TEMPERATURE: 0.7,
                    GenParams.TOP_K: 50,
                    GenParams.TOP_P: 1,
                    GenParams.REPETITION_PENALTY: 1.1
                }
            )
            
            # Generate response
            print("[WatsonX] Sending request to model...")
            response = model.generate_text(prompt=prompt)
            
            print(f"[WatsonX] ✓ Generated {len(response)} characters of documentation")
            
            return {
                'success': True,
                'content': response,
                'error': None
            }
            
        except Exception as e:
            error_msg = f"Error generating documentation: {str(e)}"
            print(f"[WatsonX] ✗ {error_msg}")
            return {
                'success': False,
                'error': error_msg,
                'content': None
            }
    
    def send_message(self, message: str, conversation_id: Optional[str] = None, model_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Send a message to WatsonX and get response (for chat functionality)
        
        Args:
            message: The message to send
            conversation_id: Optional conversation ID for context
            model_id: Optional model ID to use
            
        Returns:
            Dictionary with conversation_id, message, timestamp, and optional error
        """
        if not self.is_configured or not self.client:
            return {
                'error': 'WatsonX client not initialized. Please check your credentials.',
                'conversation_id': conversation_id or 'error',
                'message': '',
                'timestamp': datetime.utcnow().isoformat()
            }
        
        if model_id is None:
            model_id = os.getenv('IBM_WATSONX_MODEL_ID', 'ibm/granite-13b-chat-v2')
        
        try:
            print(f"[WatsonX Chat] Sending message with model: {model_id}")
            
            # Initialize model
            model = ModelInference(
                model_id=model_id,
                api_client=self.client,
                project_id=self.project_id,
                params={
                    GenParams.DECODING_METHOD: "greedy",
                    GenParams.MAX_NEW_TOKENS: 1024,
                    GenParams.TEMPERATURE: 0.7,
                    GenParams.TOP_K: 50,
                    GenParams.TOP_P: 1
                }
            )
            
            # Get response from WatsonX
            response = model.generate_text(prompt=message)
            
            return {
                'conversation_id': conversation_id or self._generate_conversation_id(),
                'message': response,
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            print(f"[WatsonX Chat] ✗ {error_msg}")
            return {
                'error': error_msg,
                'conversation_id': conversation_id or 'error',
                'message': '',
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def is_available(self) -> bool:
        """Check if WatsonX service is available and configured"""
        return self.is_configured and self.client is not None
    
    def _generate_conversation_id(self) -> str:
        """Generate a unique conversation ID"""
        return f"conv_{datetime.utcnow().timestamp()}"


# Singleton instance
_watsonx_service = None

def get_watsonx_service() -> WatsonXService:
    """Get or create the WatsonX service singleton"""
    global _watsonx_service
    if _watsonx_service is None:
        _watsonx_service = WatsonXService()
    return _watsonx_service

# Made with Bob
