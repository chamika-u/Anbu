from flask import Blueprint, jsonify
import sys

bp = Blueprint('health', __name__, url_prefix='/api')

@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Anbu Backend',
        'version': '1.0.0',
        'python': sys.version.split()[0],
    }), 200
