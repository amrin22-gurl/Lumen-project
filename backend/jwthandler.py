from flask import Flask, flash, redirect, url_for
from flask_jwt_extended import (
    jwt_required, 
    get_jwt_identity
)
from functools import wraps
from handler import get_user


def user_login_required(f):
    # Since most of the functions use the same cookie verification logic,
    # this wrapper is created to avoid code duplication
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        # load the cookie from the request
        cookie = get_jwt_identity()
        if not cookie:
            print("no cookie")
            flash("You need to login first!", "warning")
            return redirect(url_for(""))
        
        try:
            # the cookie will be in the form of "id,role"
            parts = cookie.split(',')
            if len(parts) < 2 or parts[-1] != "user":
                flash("You need to login first!", "warning")
                return redirect(url_for("auth.login"))
            # TODO
            # get the admin from the database
            user = get_user(parts[0])
        except (ValueError, IndexError):
            flash("Invalid session", "warning")
            return redirect(url_for("recruiter.login"))
        
        if not user:
            print("no user")
            flash("You need to login first!", "warning")
            return redirect(url_for("auth.login"))
        
        return f(user, *args, **kwargs)
    return decorated_function


def admin_login_required(f):
    # Since most of the functions use the same cookie verification logic,
    # this wrapper is created to avoid code duplication
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        # load the cookie from the request
        cookie = get_jwt_identity()
        if not cookie:
            print("no cookie")
            flash("You need to login first!", "warning")
            return redirect(url_for(""))
        
        try:
            # the cookie will be in the form of "id,role"
            parts = cookie.split(',')
            if len(parts) < 2 or parts[-1] != "admin":
                flash("You need to login first!", "warning")
                return redirect(url_for("auth.login"))
            # TODO
            # get the admin from the database
            user = get_user(parts[0])
        except (ValueError, IndexError):
            flash("Invalid session", "warning")
            return redirect(url_for("recruiter.login"))
        
        if not user:
            print("no admin")
            flash("You need to login first!", "warning")
            return redirect(url_for("auth.login"))
        
        return f(user, *args, **kwargs)
    return decorated_function