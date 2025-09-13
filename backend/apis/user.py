from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from handler import get_all_plans, get_user_by_id, get_subscriptions_by_user, get_plan_by_id, create_subscription

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

@user.route('/plans/<int:plan_id>', methods=['GET'])
def get_user_plan_by_id(plan_id):
    """Get specific plan details"""
    try:
        plan = get_plan_by_id(plan_id)
        if not plan:
            return jsonify({'success': False, 'message': 'Plan not found'}), 404
        
        plan_data = {
            'plan_id': plan[0],
            'plan_name': plan[1],
            'plan_description': plan[2],
            'price': plan[3],
            'duration_months': plan[4],
            'features': plan[5],
            'is_active': plan[6]
        }
        
        return jsonify({
            'success': True,
            'data': plan_data
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
        title = data.get('title', '')
        billing_cycle = data.get('billing_cycle', 'monthly')
        auto_renew = data.get('auto_renew', True)
        payment_method = data.get('payment_method', 'credit_card')
        
        if not plan_id:
            return jsonify({'success': False, 'message': 'Plan ID is required'}), 400
        
        # Get plan details to validate
        plan = get_plan_by_id(plan_id)
        if not plan:
            return jsonify({'success': False, 'message': 'Plan not found'}), 404
        
        # Calculate dates
        from datetime import datetime, timedelta
        start_date = datetime.now().strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=30 * plan[4])).strftime('%Y-%m-%d')
        
        # Create subscription
        subscription_id = create_subscription(
            user_id=current_user['user_id'],
            plan_id=plan_id,
            start_date=start_date,
            end_date=end_date,
            status='Active',
            auto_renew=1 if auto_renew else 0
        )
        
        if subscription_id:
            return jsonify({
                'success': True,
                'message': 'Subscription created successfully',
                'data': {
                    'subscription_id': subscription_id,
                    'plan_name': plan[1],
                    'start_date': start_date,
                    'end_date': end_date,
                    'status': 'Active',
                    'auto_renew': auto_renew,
                    'billing_cycle': billing_cycle,
                    'price': plan[3]
                }
            }), 201
        else:
            return jsonify({'success': False, 'message': 'Failed to create subscription'}), 500
        
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