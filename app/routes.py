# View Function

from flask import render_template, send_from_directory
from app import app


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Facings and Pathways')


@app.route('/../static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)
