"""
Root-level pytest configuration.
Adds the backend directory to sys.path so that `from app import ...`
works when running tests from the project root:

    pytest tests/
"""
import sys
import os

# Insert backend/ into path so Flask app imports resolve correctly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
