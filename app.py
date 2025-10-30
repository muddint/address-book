from flask import Flask, render_template, jsonify, request
import database

app = Flask(__name__)

# Home page
@app.route('/')
def home():
    return render_template('index.html')

# Get list of all contacts
@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    contacts = database.get_contact_list()
    return jsonify({'contacts': contacts})

# Get info of a given contact
@app.route('/api/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    contact = database.get_contact_info(contact_id)
    return jsonify(contact)

# Create a new contact
@app.route('/api/contacts', methods=['POST'])
def add_new_contact():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    contact_id = database.add_contact(first_name, last_name)
    return jsonify({'contact_id': contact_id})

# Delete a given contact
@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    database.delete_contact(contact_id)
    return jsonify({'status': 'success'})

# Update name info of a given contact 
@app.route('/api/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    database.update_contact(contact_id, first_name, last_name)
    return jsonify({'status': 'success'})

# Add email for a given contact
@app.route('/api/contacts/<int:contact_id>/emails', methods=['POST'])
def add_email(contact_id):
    data = request.get_json()
    email_address = data.get('email_address')
    email_id = database.add_email(contact_id, email_address)
    return jsonify({'email_id': email_id})

# Delete a given email 
@app.route('/api/emails/<int:email_id>', methods=['DELETE'])
def delete_email(email_id):
    database.delete_email(email_id)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    database.create_tables()
    app.run(debug=True)