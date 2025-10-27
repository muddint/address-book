import sqlite3

DATABASE = "contacts.db"

contacts_schema = '''
    CREATE TABLE IF NOT EXISTS contacts (
        contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT
    )
'''

emails_schema = '''
    CREATE TABLE IF NOT EXISTS emails (
        email_id INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_id INTEGER,
        email_address TEXT NOT NULL,
        FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
        ON DELETE CASCADE
    )
'''


def get_db_connection():
    con = sqlite3.connect(DATABASE)
    return con

def create_tables():
    con = get_db_connection()
    cur = con.cursor()
    cur.execute(contacts_schema)
    cur.execute(emails_schema)
    con.commit()
    con.close()
    return con
