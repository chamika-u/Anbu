"""
Standalone WatsonX connectivity diagnostic.
NOT a pytest test — run directly:

    python tests/backend/test_watsonx.py

from the project root (e:\\Anbu\\).
"""
import os
import sys

# Resolve paths relative to project root regardless of CWD
_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_backend = os.path.join(_root, 'backend')
_env_file = os.path.join(_backend, '.env')

# Add backend to path so app imports work if needed
sys.path.insert(0, _backend)

from dotenv import load_dotenv
load_dotenv(dotenv_path=_env_file)

api_key   = os.getenv('IBM_WATSONX_API_KEY')
project_id = os.getenv('IBM_WATSONX_PROJECT_ID')
url       = os.getenv('IBM_WATSONX_URL', 'https://us-south.ml.cloud.ibm.com')
model_id  = os.getenv('IBM_WATSONX_MODEL_ID', 'meta-llama/llama-3-3-70b-instruct')

print("=== WatsonX Diagnostics ===")
print(f"API Key   : {api_key[:8]}...{api_key[-4:]}" if api_key else "API Key   : MISSING")
print(f"Project ID: {project_id}")
print(f"URL       : {url}")
print(f"Model     : {model_id}")
print()

# --- SDK import ---
try:
    from ibm_watsonx_ai import APIClient, Credentials
    from ibm_watsonx_ai.foundation_models import ModelInference
    import ibm_watsonx_ai
    ver = getattr(ibm_watsonx_ai, '__version__', 'unknown')
    print(f"[OK] SDK imported  (version: {ver})")
except ImportError as e:
    print(f"[FAIL] SDK import: {e}")
    sys.exit(1)

# --- Client init (primary) ---
client = None
try:
    creds  = Credentials(url=url, api_key=api_key)
    client = APIClient(creds)
    client.set.default_project(project_id)
    print("[OK] Client init via set.default_project()")
except Exception as e:
    print(f"[WARN] Primary init failed: {type(e).__name__}: {e}")
    # Alternate: pass project_id directly to constructor
    try:
        creds  = Credentials(url=url, api_key=api_key)
        client = APIClient(credentials=creds, project_id=project_id)
        print("[OK] Client init via constructor project_id")
    except Exception as e2:
        print(f"[FAIL] Both init strategies failed: {e2}")
        sys.exit(1)

# --- Small generation test ---
print()
print("--- Generation test (max 50 tokens) ---")
try:
    model = ModelInference(
        model_id=model_id,
        api_client=client,
        project_id=project_id,
        params={
            "decoding_method": "greedy",
            "max_new_tokens": 50,
        }
    )
    result = model.generate_text(prompt="Say hello in one sentence.")
    print(f"[OK] Response: {result}")
except Exception as e:
    print(f"[FAIL] Generation: {type(e).__name__}: {e}")
    # Try sampling instead
    print("Retrying with sampling decoding...")
    try:
        model = ModelInference(
            model_id=model_id,
            api_client=client,
            project_id=project_id,
            params={
                "decoding_method": "sample",
                "max_new_tokens": 50,
                "temperature": 0.7,
            }
        )
        result = model.generate_text(prompt="Say hello in one sentence.")
        print(f"[OK] Response (sampling): {result}")
    except Exception as e2:
        print(f"[FAIL] Sampling also failed: {type(e2).__name__}: {e2}")
