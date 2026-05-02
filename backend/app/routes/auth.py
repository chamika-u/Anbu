from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from app import db
from itsdangerous import URLSafeTimedSerializer
from functools import wraps

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def generate_token(user_id):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(user_id, salt='auth-token')

def verify_token(token):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        user_id = serializer.loads(token, salt='auth-token', max_age=86400) # 24 hours
        return user_id
    except:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'success': False, 'error': 'Missing or invalid token'}), 401
            
        token = token.split(' ')[1]
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'success': False, 'error': 'Token is invalid or expired'}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 401
            
        return f(user, *args, **kwargs)
    return decorated

def get_optional_user():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return None
    token = token.split(' ')[1]
    user_id = verify_token(token)
    if user_id:
        return User.query.get(user_id)
    return None

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email is already registered'}), 400
        
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    token = generate_token(user.id)
    return jsonify({
        'success': True,
        'token': token,
        'user': user.to_dict()
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
    token = generate_token(user.id)
    return jsonify({
        'success': True,
        'token': token,
        'user': user.to_dict()
    }), 200

@bp.route('/me', methods=['GET'])
@require_auth
def get_me(user):
    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200
