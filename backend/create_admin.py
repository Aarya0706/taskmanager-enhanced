"""
Run once to create the first admin login.
    python create_admin.py
"""
import bcrypt
import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_mysql_password",
    "database": "task_management_db",
}

username = input("New admin username: ").strip()
password = input("New admin password: ").strip()

hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()
cursor.execute(
    "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
    (username, hashed, "admin")
)
conn.commit()
cursor.close()
conn.close()

print(f"Admin user '{username}' created.")
