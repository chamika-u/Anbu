from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///anbu.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    from app.routes import chat, documents, health, analyze, history, auth
    app.register_blueprint(chat.bp)
    app.register_blueprint(documents.bp)
    app.register_blueprint(health.bp)
    app.register_blueprint(analyze.bp)
    app.register_blueprint(history.bp)
    app.register_blueprint(auth.bp)
    
    # Create database tables with retry logic
    with app.app_context():
        import time
        for i in range(10):
            try:
                db.create_all()
                print("Database tables initialized successfully.")
                break
            except Exception as e:
                print(f"Database connection attempt {i+1} failed: {e}")
                if i < 9:
                    time.sleep(2)
                else:
                    raise e
    
    return app

# Made with Bob
