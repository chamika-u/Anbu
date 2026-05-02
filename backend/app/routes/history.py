from flask import Blueprint, jsonify
from app.models.analysis import RepositoryAnalysis
from app import db

bp = Blueprint('history', __name__, url_prefix='/api/history')

@bp.route('/', methods=['GET'])
def get_history():
    """Get all previously generated repository documentations."""
    try:
        # Get all analyses, newest first
        analyses = RepositoryAnalysis.query.order_by(RepositoryAnalysis.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'history': [analysis.to_dict() for analysis in analyses]
        }), 200
    except Exception as e:
        print(f"[History] Error fetching history: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/<int:analysis_id>', methods=['GET'])
def get_analysis(analysis_id):
    """Get a specific analysis by ID."""
    try:
        analysis = RepositoryAnalysis.query.get_or_404(analysis_id)
        
        return jsonify({
            'success': True,
            'analysis': analysis.to_dict()
        }), 200
    except Exception as e:
        print(f"[History] Error fetching analysis {analysis_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
