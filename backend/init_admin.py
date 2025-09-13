#!/usr/bin/env python3
"""
Initialize admin user and sample data for the telecom subscription system
"""

import hashlib
from handler import create_user, create_plan, init_db

def init_admin_user():
    """Create default admin user"""
    admin_email = "admin@telecom.com"
    admin_password = "admin123"
    admin_name = "Admin User"
    
    # Hash the password
    password_hash = hashlib.sha256(admin_password.encode('utf-8')).hexdigest()
    
    try:
        user_id = create_user(admin_name, admin_email, password_hash, role='admin', country='USA')
        print(f"Admin user created with ID: {user_id}")
        return user_id
    except Exception as e:
        print(f"Admin user might already exist: {e}")
        return None

def init_sample_plans():
    """Create sample telecom plans"""
    plans = [
        {
            'name': 'Basic Plan',
            'description': 'Entry-level internet plan with essential features',
            'price': 29.99,
            'duration': 1,
            'features': '24/7 Support,Free Installation,50 Mbps Speed'
        },
        {
            'name': 'Premium Plan', 
            'description': 'High-speed internet with unlimited data',
            'price': 59.99,
            'duration': 1,
            'features': '24/7 Support,Free Installation,Router Included,100 Mbps Speed,Unlimited Data'
        },
        {
            'name': 'Enterprise Plan',
            'description': 'Business-grade internet solution',
            'price': 99.99,
            'duration': 1,
            'features': '24/7 Priority Support,Free Installation,Router Included,500 Mbps Speed,Unlimited Data,Static IP'
        }
    ]
    
    for plan in plans:
        try:
            plan_id = create_plan(
                plan['name'],
                plan['description'], 
                plan['price'],
                plan['duration'],
                plan['features']
            )
            print(f"Plan '{plan['name']}' created with ID: {plan_id}")
        except Exception as e:
            print(f"Error creating plan '{plan['name']}': {e}")

def init_sample_user():
    """Create sample customer user"""
    user_email = "user@telecom.com"
    user_password = "user123"
    user_name = "Customer User"
    
    # Hash the password
    password_hash = hashlib.sha256(user_password.encode('utf-8')).hexdigest()
    
    try:
        user_id = create_user(user_name, user_email, password_hash, role='customer', country='USA')
        print(f"Sample user created with ID: {user_id}")
        return user_id
    except Exception as e:
        print(f"Sample user might already exist: {e}")
        return None

if __name__ == "__main__":
    print("Initializing database and sample data...")
    
    # Initialize database
    init_db()
    print("Database initialized")
    
    # Create admin user
    init_admin_user()
    
    # Create sample user
    init_sample_user()
    
    # Create sample plans
    init_sample_plans()
    
    print("Initialization complete!")