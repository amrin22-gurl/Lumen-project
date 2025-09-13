from handler import create_user, get_user_by_email
from hashlib import sha256

def create_admin_user():
    """Create default admin user if it doesn't exist"""
    admin_email = 'admin@telecom.com'
    admin_password = 'admin123'
    
    # Check if admin already exists
    existing_admin = get_user_by_email(admin_email)
    if existing_admin:
        print(f"Admin user already exists: {admin_email}")
        return
    
    # Create admin user
    password_hash = sha256(admin_password.encode('utf-8')).hexdigest()
    admin_id = create_user('Admin User', admin_email, password_hash, 'admin')
    
    if admin_id:
        print(f"Admin user created successfully: {admin_email}")
        print(f"Password: {admin_password}")
    else:
        print("Failed to create admin user")

if __name__ == '__main__':
    create_admin_user()