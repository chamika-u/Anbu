from flask import Blueprint, jsonify
from app.models.analysis import RepositoryAnalysis
from app.routes.auth import require_auth
from app import db

bp = Blueprint('history', __name__, url_prefix='/api/history')

@bp.route('/', methods=['GET'])
@require_auth
def get_history(user):
    """Get all previously generated repository documentations for the logged-in user."""
    try:
        analyses = RepositoryAnalysis.query.filter_by(user_id=user.id).order_by(RepositoryAnalysis.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'history': [analysis.to_dict() for analysis in analyses]
        }), 200
    except Exception as e:
        print(f"[History] Error fetching history: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/<int:analysis_id>', methods=['GET'])
@require_auth
def get_analysis(user, analysis_id):
    """Get a specific analysis by ID."""
    try:
        analysis = RepositoryAnalysis.query.get_or_404(analysis_id)
        if analysis.user_id != user.id:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        
        return jsonify({
            'success': True,
            'analysis': analysis.to_dict()
        }), 200
    except Exception as e:
        print(f"[History] Error fetching analysis {analysis_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/<int:analysis_id>/progress', methods=['POST'])
@require_auth
def update_progress(user, analysis_id):
    """Update progress for a specific analysis."""
    try:
        data = request.get_json()
        progress = data.get('progress', {})
        
        import json
        analysis = RepositoryAnalysis.query.get_or_404(analysis_id)
        if analysis.user_id != user.id:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
            
        analysis.progress_json = json.dumps(progress)
        db.session.commit()
        
        return jsonify({'success': True}), 200
    except Exception as e:
        print(f"[History] Error updating progress {analysis_id}: {e}")
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
