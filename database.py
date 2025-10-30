import sqlite3

DATABASE = "contacts.db"

# Database Schema 
contacts_schema = '''
    CREATE TABLE IF NOT EXISTS contacts (
        contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL
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

# Connects to database
def get_db_connection():
    con = sqlite3.connect(DATABASE)
    con.execute('PRAGMA foreign_keys = ON')  # need this for delete cascade to work
    return con

# Creates tables
def create_tables():
    con = get_db_connection()
    cur = con.cursor()
    cur.execute(contacts_schema)
    cur.execute(emails_schema)
    con.commit()
    con.close()
    return con

# Returns list of contacts
def get_contact_list():
    con = get_db_connection()
    cur = con.cursor()
    query = '''
        SELECT contact_id, first_name, last_name
        FROM contacts
        ORDER BY first_name ASC, last_name ASC
    '''
    results = cur.execute(query).fetchall()
    con.close()
    contact_list = [{'contact_id': contact[0], 
        'first_name': contact[1], 
        'last_name': (contact[2] if contact[2] is not None else '')
        } for contact in results]
    return contact_list

# Given contact id, return name + emails of contact
def get_contact_info(contact_id):
    con = get_db_connection()
    cur = con.cursor()
    contact_query = '''
        SELECT first_name, last_name
        FROM contacts
        WHERE contact_id = ?
    '''
    email_query = '''
        SELECT email_id, email_address
        FROM emails
        WHERE contact_id = ?
    '''
    contact = cur.execute(contact_query, (contact_id,)).fetchone()
    email_list = cur.execute(email_query, (contact_id,)).fetchall()
    con.close()
    emails = [{'email_id': email[0], 'email_address': email[1]} for email in email_list]
    results = {
        'first_name': contact[0], 
        'last_name':contact[1],
        'emails': emails
        }
    return results

# Add name to contact db
def add_contact(first_name, last_name):
    con = get_db_connection()
    cur = con.cursor()
    query = '''
        INSERT INTO contacts (first_name, last_name)
        VALUES (?, ?)
    '''
    cur.execute(query, (first_name, last_name))
    contact_id = cur.lastrowid
    con.commit()
    con.close()
    return contact_id

# Add a contact's email to the db
def add_email(contact_id, email_address):
    con = get_db_connection()
    cur = con.cursor()
    query = '''
        INSERT INTO emails (contact_id, email_address)
        VALUES (?, ?)
    '''
    cur.execute(query, (contact_id, email_address))
    email_id = cur.lastrowid
    con.commit()
    con.close()
    return email_id

# Delete contact from db
def delete_contact(contact_id):
    con = get_db_connection()
    cur = con.cursor()
    query = '''
        DELETE FROM contacts
        WHERE contact_id = ?
    '''
    cur.execute(query, (contact_id,))
    con.commit()
    con.close()

# Delete email from db
def delete_email(email_id):
    con = get_db_connection()
    cur = con.cursor()
    query = '''
        DELETE FROM emails
        WHERE email_id = ?
    '''
    cur.execute(query, (email_id,))
    con.commit()
    con.close()

# Change name of a contact
def update_contact(contact_id, first_name, last_name):
    con = get_db_connection()
    cur = con.cursor()
    query = '''
        UPDATE contacts
        SET first_name = ?, last_name = ?
        WHERE contact_id = ?
    '''
    cur.execute(query, (first_name, last_name, contact_id))
    con.commit()
    con.close()   



    