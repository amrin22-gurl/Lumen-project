from flask import Blueprint, request, jsonify
from handler import create_user, get_user_by_email, update_user
from hashlib import sha256
from flask_jwt_extended import create_access_token


auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    if get_user_by_email(email):
        return jsonify({'message': 'User already exists'}), 400
    
    user_id = create_user(name, email, sha256(password.encode('utf-8')).hexdigest())
    if user_id is not None:
        gotUser = get_user_by_email(email)
        if gotUser is None:
            return jsonify({'message': 'User created successfully. Please login'}), 201
        
        access_token = create_access_token(
            identity=str(gotUser[0]) + ',' + gotUser[4]
        )
        
        user_data = {
            'user_id': gotUser[0],
            'name': gotUser[1],
            'email': gotUser[2],
            'role': gotUser[4]
        }
        
        return jsonify({
            'message': 'User created successfully', 
            'access_token': access_token,
            'user': user_data
        }), 201
    
    return jsonify({'message': 'Could not create user'}), 400


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    requested_role = data.get('role', 'customer')
    
    if not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = get_user_by_email(email)
    
    if user and user[3] == sha256(password.encode('utf-8')).hexdigest():
        # Check if the user's role matches the requested role
        if user[4] != requested_role:
            return jsonify({'message': 'Invalid role selection for this account'}), 403
        
        access_token = create_access_token(
            identity=str(user[0]) + ',' + user[4]
        )
        
        user_data = {
            'user_id': user[0],
            'name': user[1],
            'email': user[2],
            'role': user[4]
        }
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user_data
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401