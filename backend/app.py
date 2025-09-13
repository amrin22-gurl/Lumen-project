from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from apis import auth, admin, user


def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    # Initialize extensions
    jwt = JWTManager(app)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth.auth)
    app.register_blueprint(admin.admin)
    app.register_blueprint(user.user)
    
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8000)