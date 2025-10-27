from flask import Flask, render_template
from database import create_tables

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)