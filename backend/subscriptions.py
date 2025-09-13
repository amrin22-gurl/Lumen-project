from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# ------------------------
# Database connection helper
# ------------------------
def get_db_connection():
    conn = sqlite3.connect("subscription_db.sqlite3")
    conn.row_factory = sqlite3.Row 
    return conn

# ------------------------
# 1. Get all subscriptions for a user
# ------------------------
@app.route("/my_subscriptions/<int:user_id>", methods=["GET"])
def my_subscriptions(user_id):
    conn = get_db_connection()
    subs = conn.execute("""
        SELECT s.subscription_id, p.plan_name, p.price, s.status, s.start_date, s.end_date
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.plan_id
        WHERE s.user_id = ?
    """, (user_id,)).fetchall()
    conn.close()

    subscriptions = [dict(sub) for sub in subs]

    active = [sub for sub in subscriptions if sub["status"].lower() == "active"]
    past = [sub for sub in subscriptions if sub["status"].lower() in ["cancelled", "expired"]]

    return jsonify({
        "active_subscriptions": active,
        "past_subscriptions": past
    })

# ------------------------
# 2. Cancel subscription
# ------------------------
@app.route("/cancel/<int:subscription_id>", methods=["PUT"])
def cancel_subscription(subscription_id):
    conn = get_db_connection()
    conn.execute(
        "UPDATE subscriptions SET status='Cancelled' WHERE subscription_id=?",
        (subscription_id,)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Subscription cancelled"})

# ------------------------
# 3. Change (upgrade/downgrade) plan
# ------------------------
@app.route("/change_plan", methods=["PUT"])
def change_plan():
    data = request.json
    sub_id = data["subscription_id"]
    new_plan_id = data["new_plan_id"]

    conn = get_db_connection()
    conn.execute("""
        UPDATE subscriptions 
        SET plan_id=? 
        WHERE subscription_id=? AND status='Active'
    """, (new_plan_id, sub_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Plan changed successfully"})

# ------------------------
# 4. Recommendations (basic AI simulation)
# ------------------------
@app.route("/recommendations/<int:user_id>", methods=["GET"])
def recommendations(user_id):
    conn = get_db_connection()
    recs = conn.execute("""
        SELECT * FROM plans
        WHERE plan_id NOT IN (
            SELECT plan_id FROM subscriptions WHERE user_id=?
        )
        AND is_active=1
        ORDER BY price ASC
        LIMIT 3
    """, (user_id,)).fetchall()
    conn.close()

    return jsonify({"recommended_plans": [dict(r) for r in recs]})

# ------------------------
# 5. Notifications (simulated)
# ------------------------
@app.route("/notifications/<int:user_id>", methods=["GET"])
def notifications(user_id):
    conn = get_db_connection()
    subs = conn.execute("""
        SELECT s.subscription_id, p.plan_name, s.end_date
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.plan_id
        WHERE s.user_id=? AND s.status='Active'
    """, (user_id,)).fetchall()
    conn.close()

    notifications = []
    for sub in subs:
        notifications.append({
            "message": f"Your {sub['plan_name']} plan will renew on {sub['end_date']}"
        })

    return jsonify({"notifications": notifications})

# ------------------------
# Run the Flask app
# ------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
