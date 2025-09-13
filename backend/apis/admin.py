from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from handler import (
    get_all_plans, create_plan, get_plan_by_id, 
    get_user_by_id, get_subscriptions_by_user
)

admin = Blueprint('admin', __name__, url_prefix='/admin')

def get_current_user():
    """Extract user info from JWT token"""
    identity = get_jwt_identity()
    if identity:
        user_id, role = identity.split(',')
        return {'user_id': int(user_id), 'role': role}
    return None

def admin_required(f):
    """Decorator to ensure only admin users can access the endpoint"""
    def decorated_function(*args, **kwargs):
        current_user = get_current_user()
        if not current_user or current_user['role'] != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_dashboard():
    """Get admin dashboard overview"""
    try:
        # Mock dashboard data - replace with actual database queries
        dashboard_data = {
            'overview': {
                'total_users': 150,
                'total_plans': 5,
                'active_subscriptions': 89,
                'total_revenue': 12450.50
            },
            'plan_statistics': [
                {'plan_name': 'Basic Plan', 'total_subscriptions': 45, 'active_subscriptions': 40},
                {'plan_name': 'Premium Plan', 'total_subscriptions': 44, 'active_subscriptions': 39}
            ]
        }
        
        return jsonify({
            'success': True,
            'data': dashboard_data
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_users():
    """Get all users for admin"""
    try:
        # Mock users data - replace with actual database query
        users = [
            {
                'user_id': 1,
                'name': 'John Doe',
                'email': 'john@example.com',
                'role': 'customer',
                'signup_date': '2024-01-15',
                'country': 'USA'
            },
            {
                'user_id': 2,
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'role': 'customer',
                'signup_date': '2024-01-20',
                'country': 'Canada'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': users
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin.route('/plans', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_plans():
    """Get all plans for admin management"""
    try:
        plans = get_all_plans()
        plans_data = []
        
        for plan in plans:
            plans_data.append({
                'plan_id': plan[0],
                'plan_name': plan[1],
                'plan_description': plan[2],
                'price': plan[3],
                'duration_months': plan[4],
                'features': plan[5],
                'is_active': plan[6]
            })
        
        return jsonify({
            'success': True,
            'data': plans_data
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin.route('/plans', methods=['POST'])
@jwt_required()
@admin_required
def create_admin_plan():
    """Create a new plan"""
    try:
        data = request.get_json()
        
        plan_name = data.get('plan_name')
        plan_description = data.get('plan_description', '')
        price = data.get('price')
        duration_months = data.get('duration_months')
        features = data.get('features', '')
        is_active = data.get('is_active', 1)
        
        if not plan_name or not price or not duration_months:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        plan_id = create_plan(plan_name, plan_description, price, duration_months, features)
        
        return jsonify({
            'success': True,
            'message': 'Plan created successfully',
            'data': {'plan_id': plan_id}
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin.route('/plans/<int:plan_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_admin_plan(plan_id):
    """Update an existing plan"""
    try:
        data = request.get_json()
        
        # For now, return success - implement actual update logic
        return jsonify({
            'success': True,
            'message': 'Plan updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin.route('/plans/<int:plan_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_admin_plan(plan_id):
    """Delete a plan"""
    try:
        # For now, return success - implement actual delete logic
        return jsonify({
            'success': True,
            'message': 'Plan deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin.route('/subscriptions', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_subscriptions():
    """Get all subscriptions for admin"""
    try:
        # Mock subscriptions data
        subscriptions = [
            {
                'subscription_id': 1,
                'user_id': 1,
                'user_name': 'John Doe',
                'plan_id': 1,
                'plan_name': 'Basic Plan',
                'start_date': '2024-01-15',
                'end_date': '2024-02-15',
                'status': 'Active',
                'auto_renew': True,
                'price': 29.99
            }
        ]
        
        return jsonify({
            'success': True,
            'data': subscriptions
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500