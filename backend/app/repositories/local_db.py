import sqlite3
import os
import uuid
from typing import List, Dict, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "local_store.db")

def init_db():
    """Initializes the local SQLite database for the Application Tracker."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Create Applications Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL,
            date_added TEXT NOT NULL,
            url TEXT,
            match_score INTEGER
        )
    ''')
    conn.commit()
    conn.close()

def get_all_applications() -> List[Dict]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications ORDER BY date_added DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def create_application(company: str, role: str, status: str, url: str = "", match_score: int = 0) -> Dict:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    app_id = str(uuid.uuid4())
    date_added = datetime.now().isoformat()
    
    cursor.execute(
        "INSERT INTO applications (id, company, role, status, date_added, url, match_score) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (app_id, company, role, status, date_added, url, match_score)
    )
    conn.commit()
    conn.close()
    
    return {
        "id": app_id,
        "company": company,
        "role": role,
        "status": status,
        "date_added": date_added,
        "url": url,
        "match_score": match_score
    }

def update_application_status(app_id: str, new_status: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE applications SET status = ? WHERE id = ?", (new_status, app_id))
    conn.commit()
    conn.close()

def delete_application(app_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM applications WHERE id = ?", (app_id,))
    conn.commit()
    conn.close()

# Initialize DB when module is imported
init_db()
