import pytest
from app import create_app

@pytest.fixture
def client():
    """Create a test client for the Flask application"""
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert data['service'] == 'Anbu Backend'

# Made with Bob
