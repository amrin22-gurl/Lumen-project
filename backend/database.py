import sqlite3

# -------------------------
# Connect to DB
# -------------------------
conn = sqlite3.connect('subscription_db.sqlite3')
conn.execute("PRAGMA foreign_keys = ON")  # Enable foreign keys in SQLite

# -------------------------
# Create Tables
# -------------------------
conn.executescript("""
-- 1) Users
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer' CHECK(role IN ('admin','company_owner','customer')),
    signup_date TEXT DEFAULT (datetime('now')),
    country TEXT
);



-- 3) Plans
CREATE TABLE IF NOT EXISTS plans (
    plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_name TEXT NOT NULL,
    plan_description TEXT,
    price REAL NOT NULL,
    duration_months INTEGER NOT NULL,
    features TEXT,
    is_active INTEGER DEFAULT 1
);

-- 4) Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    title TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'Active' CHECK(status IN ('Active','Expired','Cancelled')),
    auto_renew INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
);

-- 5) Subscription Logs
CREATE TABLE IF NOT EXISTS subscription_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    action_date TEXT DEFAULT (datetime('now')),
    notes TEXT,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id)
);

-- 6) Billing Information
CREATE TABLE IF NOT EXISTS billing_information (
    billing_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subscription_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT,
    billing_date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Paid','Pending','Failed')),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id)
);

-- 7) Discounts
CREATE TABLE IF NOT EXISTS discounts (
    discount_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    percentage REAL,
    valid_from TEXT,
    valid_until TEXT,
    is_active INTEGER DEFAULT 1
);

-- 8) Applied Discounts
CREATE TABLE IF NOT EXISTS subscription_discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    discount_id INTEGER NOT NULL,
    applied_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
);

-- 9) Notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subscription_id INTEGER,
    type TEXT NOT NULL,
    message TEXT,
    sent_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id)
);


""")

# -------------------------
# User Functions
# -------------------------
def create_user(conn, name, email, password_hash, role='customer', country=None):
    """Insert a new user."""
    query = '''
    INSERT INTO users (name, email, password_hash, role, signup_date, country)
    VALUES (?, ?, ?, ?, datetime('now'), ?)
    '''
    conn.execute(query, (name, email, password_hash, role, country))
    conn.commit()

def update_user(conn, user_id, name=None, email=None, password_hash=None, role=None, country=None):
    """Update an existing user. Only provided fields are updated."""
    current_user = conn.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
    if not current_user:
        raise ValueError(f"User with id {user_id} does not exist")

    name = name or current_user[1]
    email = email or current_user[2]
    password_hash = password_hash or current_user[3]
    role = role or current_user[4]
    country = country or current_user[6]

    query = '''
    UPDATE users
    SET name = ?, email = ?, password_hash = ?, role = ?, country = ?
    WHERE user_id = ?
    '''
    conn.execute(query, (name, email, password_hash, role, country, user_id))
    conn.commit()

def get_user_with_email(conn, email):
    """Retrieve a user by email."""
    query = 'SELECT * FROM users WHERE email = ?'
    return conn.execute(query, (email,)).fetchone()
