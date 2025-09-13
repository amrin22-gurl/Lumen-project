import sqlite3

DB_NAME = 'subscription_db.sqlite3'

# -------------------------
# Helper Functions
# -------------------------
def execute(query, params=()):
    connection = sqlite3.connect(DB_NAME)
    connection.execute("PRAGMA foreign_keys = ON")
    cursor = connection.cursor()
    cursor.execute(query, params)
    last_id = cursor.lastrowid
    connection.commit()
    connection.close()
    return last_id

def fetch(query, params=(), one=False):
    connection = sqlite3.connect(DB_NAME)
    connection.execute("PRAGMA foreign_keys = ON")
    cursor = connection.cursor()
    cursor.execute(query, params)
    result = cursor.fetchone() if one else cursor.fetchall()
    connection.close()
    return result

# -------------------------
# Initialize DB and Tables
# -------------------------
def init_db():
    connection = sqlite3.connect(DB_NAME)
    connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript("""
    -- Users
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer' CHECK(role IN ('admin','customer')),
        signup_date TEXT DEFAULT (datetime('now')),
        country TEXT
    );

    -- Plans
    CREATE TABLE IF NOT EXISTS plans (
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_name TEXT NOT NULL,
        plan_description TEXT,
        price REAL NOT NULL,
        duration_months INTEGER NOT NULL,
        features TEXT,
        is_active INTEGER DEFAULT 1
    );

    -- Subscriptions
    CREATE TABLE IF NOT EXISTS subscriptions (
        subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        status TEXT DEFAULT 'Active' CHECK(status IN ('Active','Expired','Cancelled')),
        auto_renew INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
    );

    -- Subscription Logs
    CREATE TABLE IF NOT EXISTS subscription_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        action_date TEXT DEFAULT (datetime('now')),
        notes TEXT,
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id)
    );

    -- Billing Information
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

    -- Discounts
    CREATE TABLE IF NOT EXISTS discounts (
        discount_id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        percentage REAL,
        valid_from TEXT,
        valid_until TEXT,
        is_active INTEGER DEFAULT 1
    );

    -- Applied Discounts
    CREATE TABLE IF NOT EXISTS subscription_discounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id INTEGER NOT NULL,
        discount_id INTEGER NOT NULL,
        applied_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
        FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
    );

    -- Notifications
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
    connection.close()

# -------------------------
# User Functions
# -------------------------
def create_user(name, email, password_hash, role='customer', country=None):
    query = '''
    INSERT INTO users (name, email, password_hash, role, signup_date, country)
    VALUES (?, ?, ?, ?, datetime('now'), ?)
    '''
    return execute(query, (name, email, password_hash, role, country))

def get_user_by_email(email):
    return fetch("SELECT * FROM users WHERE email=?", (email,), one=True)

def get_user_by_id(user_id):
    return fetch("SELECT * FROM users WHERE user_id=?", (user_id,), one=True)

def update_user(user_id, name=None, email=None, password_hash=None, role=None, country=None):
    user = get_user_by_id(user_id)
    if not user:
        return None
    name = name or user[1]
    email = email or user[2]
    password_hash = password_hash or user[3]
    role = role or user[4]
    country = country or user[6]
    execute('''
        UPDATE users SET name=?, email=?, password_hash=?, role=?, country=? WHERE user_id=?
    ''', (name, email, password_hash, role, country, user_id))
    return get_user_by_id(user_id)

# -------------------------
# Plan Functions
# -------------------------
def create_plan(plan_name, plan_description, price, duration_months, features):
    query = '''
    INSERT INTO plans (plan_name, plan_description, price, duration_months, features)
    VALUES (?, ?, ?, ?, ?)
    '''
    return execute(query, (plan_name, plan_description, price, duration_months, features))

def get_all_plans():
    return fetch("SELECT * FROM plans")

def get_plan_by_id(plan_id):
    return fetch("SELECT * FROM plans WHERE plan_id=?", (plan_id,), one=True)

# -------------------------
# Subscription Functions
# -------------------------
def create_subscription(user_id, plan_id, start_date, end_date=None, status='Active', auto_renew=1):
    query = '''
    INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status, auto_renew)
    VALUES (?, ?, ?, ?, ?, ?)
    '''
    return execute(query, (user_id, plan_id, start_date, end_date, status, auto_renew))

def update_subscription(subscription_id, user_id=None, plan_id=None, start_date=None, end_date=None, status=None, auto_renew=None):
    sub = fetch("SELECT * FROM subscriptions WHERE subscription_id=?", (subscription_id,), one=True)
    if not sub:
        return None
    user_id = user_id or sub[1]
    plan_id = plan_id or sub[2]
    start_date = start_date or sub[3]
    end_date = end_date if end_date is not None else sub[4]
    status = status or sub[5]
    auto_renew = auto_renew if auto_renew is not None else sub[6]
    execute('''
        UPDATE subscriptions SET user_id=?, plan_id=?, start_date=?, end_date=?, status=?, auto_renew=? 
        WHERE subscription_id=?
    ''', (user_id, plan_id, start_date, end_date, status, auto_renew, subscription_id))
    return get_subscription_by_id(subscription_id)

def get_subscription_by_id(subscription_id):
    return fetch('''
        SELECT s.subscription_id, s.user_id, s.plan_id, p.plan_name, s.start_date, s.end_date, s.status, s.auto_renew
        FROM subscriptions s JOIN plans p ON s.plan_id=p.plan_id WHERE s.subscription_id=?
    ''', (subscription_id,), one=True)

def get_subscriptions_by_user(user_id):
    return fetch('''
        SELECT s.subscription_id, s.user_id, s.plan_id, p.plan_name, s.start_date, s.end_date, s.status, s.auto_renew
        FROM subscriptions s JOIN plans p ON s.plan_id=p.plan_id WHERE s.user_id=?
    ''', (user_id,))

# -------------------------
# Initialize DB
# -------------------------
init_db()
