from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from handler import get_all_plans, get_user_by_id, get_subscriptions_by_user

user = Blueprint('user', __name__, url_prefix='/user')

def get_current_user():
    """Extract user info from JWT token"""
    identity = get_jwt_identity()
    if identity:
        user_id, role = identity.split(',')
        return {'user_id': int(user_id), 'role': role}
    return None

@user.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get current user's profile"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        user_data = get_user_by_id(current_user['user_id'])
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        profile = {
            'user_id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[4],
            'signup_date': user_data[5],
            'country': user_data[6],
            'unread_notifications': 0
        }
        
        return jsonify({
            'success': True,
            'data': profile
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@user.route('/plans', methods=['GET'])
def get_user_plans():
    """Get all available plans for users"""
    try:
        plans = get_all_plans()
        plans_data = []
        
        for plan in plans:
            if plan[6]:  # Only active plans
                plans_data.append({
                    'plan_id': plan[0],
                    'plan_name': plan[1],
                    'plan_description': plan[2],
                    'price': plan[3],
                    'duration_months': plan[4],
                    'features': plan[5].split(',') if plan[5] else []
                })
        
        return jsonify({
            'success': True,
            'data': plans_data
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@user.route('/subscriptions', methods=['GET'])
@jwt_required()
def get_user_subscriptions():
    """Get current user's subscriptions"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        subscriptions = get_subscriptions_by_user(current_user['user_id'])
        subscriptions_data = []
        
        for sub in subscriptions:
            subscriptions_data.append({
                'subscription_id': sub[0],
                'user_id': sub[1],
                'plan_id': sub[2],
                'plan_name': sub[3],
                'start_date': sub[4],
                'end_date': sub[5],
                'status': sub[6],
                'auto_renew': bool(sub[7]),
                'price': 29.99  # Mock price - should come from plan data
            })
        
        return jsonify({
            'success': True,
            'data': subscriptions_data
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@user.route('/subscriptions', methods=['POST'])
@jwt_required()
def create_user_subscription():
    """Create a new subscription for the user"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        data = request.get_json()
        plan_id = data.get('plan_id')
        
        if not plan_id:
            return jsonify({'success': False, 'message': 'Plan ID is required'}), 400
        
        # Mock subscription creation - implement actual logic
        return jsonify({
            'success': True,
            'message': 'Subscription created successfully',
            'data': {
                'subscription_id': 1,
                'plan_name': 'Basic Plan',
                'start_date': '2024-01-01',
                'end_date': '2024-02-01',
                'status': 'Active'
            }
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@user.route('/dashboard', methods=['GET'])
@jwt_required()
def get_user_dashboard():
    """Get user dashboard data"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        user_data = get_user_by_id(current_user['user_id'])
        subscriptions = get_subscriptions_by_user(current_user['user_id'])
        
        # Count subscription statuses
        active_count = sum(1 for sub in subscriptions if sub[6] == 'Active')
        expired_count = sum(1 for sub in subscriptions if sub[6] == 'Expired')
        cancelled_count = sum(1 for sub in subscriptions if sub[6] == 'Cancelled')
        
        dashboard_data = {
            'user_info': {
                'name': user_data[1] if user_data else 'User',
                'email': user_data[2] if user_data else '',
                'member_since': user_data[5] if user_data else ''
            },
            'subscription_stats': {
                'total': len(subscriptions),
                'active': active_count,
                'expired': expired_count,
                'cancelled': cancelled_count
            },
            'active_subscriptions': [],
            'notifications': {
                'unread_count': 0,
                'recent': []
            }
        }
        
        return jsonify({
            'success': True,
            'data': dashboard_data
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500