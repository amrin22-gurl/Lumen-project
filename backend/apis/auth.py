from flask import Blueprint, request, jsonify
from handler import create_user, get_user, update_user
from hashlib import sha256
from flask_jwt_extended import create_access_token


auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    if get_user(email):
        return jsonify({'message': 'User already exists'}), 400
    user = create_user(name, email, sha256(password.encode('utf-8')).hexdigest())
    if user is not None:
        gotUser = get_user(email)
        if gotUser is  None:
            return jsonify({'message': 'User created successfully. Please login'}), 201
        access_token = create_access_token(
            identity=gotUser['user_id'] + ','+ gotUser['role'],
        )
        return jsonify({'message': 'User created successfully', access_token: access_token}), 201
    
    return jsonify({'message': 'Could not create user'}), 400


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = get_user(email)
    
    if user and user['password_hash'] == sha256(password.encode('utf-8')).hexdigest():
        return jsonify({'message': 'Login successful'}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401