import sqlite3
from flask import Flask, request, render_template, jsonify
import io

app = Flask(__name__)

# In-memory database for demonstration purposes
# This database is temporary and resets every time the server restarts.
# !!! WARNING: Executing arbitrary user-provided SQL is EXTREMELY DANGEROUS in production
# without robust security measures, input sanitization, and strict control.
# This version allows all commands for personal/demo use as requested.
# DO NOT DEPLOY THIS TO A PUBLIC SERVER WITHOUT ADDING STRONG SECURITY!
def get_db_connection():
    conn = sqlite3.connect(':memory:')
    conn.row_factory = sqlite3.Row # This allows accessing columns by name
    # Create a sample table and insert some data if it doesn't exist
    try:
        conn.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")
        # Check if table is empty before inserting sample data
        cursor = conn.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            conn.execute("INSERT INTO users (name, age) VALUES ('Alice', 30)")
            conn.execute("INSERT INTO users (name, age) VALUES ('Bob', 25)")
            conn.execute("INSERT INTO users (name, age) VALUES ('Charlie', 35)")
            conn.commit()
    except Exception as e:
        print(f"Database initialization error: {e}") # Log error if initialization fails
        pass # Continue even if initialization fails, app might still work without sample data
    return conn

@app.route('/')
def index():
    # Render the index.html file from the templates folder
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute():
    if not request.json or 'query' not in request.json:
        return jsonify({'error': 'Geçersiz istek: Sorgu bulunamadı.'}), 400

    query = request.json['query']
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Execute the query - WARNING: This allows any SQL command for personal use!
        cursor.execute(query)

        # Check if the query returned results (e.g., SELECT)
        if cursor.description:
            results = [dict(row) for row in cursor.fetchall()]
            conn.commit() # Commit in case of operations followed by SELECT
            return jsonify({'results': results})
        else:
            # For non-SELECT queries (INSERT, UPDATE, DELETE, CREATE, DROP, etc.)
            conn.commit() # Commit the changes
            # You might want to return info like cursor.rowcount for INSERT/UPDATE/DELETE
            # For simplicity here, we just indicate success without rows.
            return jsonify({'results': []}) # Indicate successful execution, no rows returned

    except sqlite3.Error as e:
        if conn:
            conn.rollback() # Rollback changes on error
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        # Catch any other unexpected errors
        if conn:
             conn.rollback() # Rollback on other errors too
        return jsonify({'error': f'Sunucu hatası: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    # In a production environment, use a production-ready WSGI server
    # app.run(debug=False)
    app.run(host='localhost', port=6000 ,debug=True) # debug=True for dev
      elopment

# Powered: mirac-s GitHub
