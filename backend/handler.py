import sqlite3


def execute(query, params):
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute(query, params)
    res = cursor.lastrowid
    connection.commit()
    connection.close()
    return res


def fetch(query, params, one = False):
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute(query, params)
    if one:
        res = cursor.fetchone()
    else:
        res = cursor.fetchall()
    connection.commit()
    connection.close()
    return res


def create_user(name, email, password_hash, role="customer"):
    
    pass


def get_user(email):
    pass


def update_user(id, name, email):
    pass