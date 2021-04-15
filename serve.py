# serve.py

from flask import Flask
from flask import render_template
import zk
import json
from flask import request

# creates a Flask application, named app
app = Flask(__name__)

# a route where we will display a welcome message via an HTML template
@app.route("/")
def home():
    message = "ZK UI"
    return render_template('index.html', message=message)

@app.route("/<title>")
def note(title):
    message = "ZK UI"
    return render_template('index.html', message=message)

@app.route("/api/notes", methods=['GET'])
def list_notes():
    search = request.args.get('search')
    if search is not None:
        return json.dumps(zk.search(search))
    
    return json.dumps(zk.list())

@app.route("/api/notes/<title>", methods=['GET'])
def cat_note(title):
    result =  zk.cat(title)
    return result

@app.route("/api/notes/<title>/open-browser", methods=['GET'])
def open_browser(title):
    result =  zk.open_browser(title)
    return result

@app.route("/api/notes/<title>/open-code", methods=['GET'])
def open_code(title):
    result =  zk.open_code(title)
    return result

@app.route("/api/notes/<title>/new-code", methods=['GET'])
def new_code(title):
    result =  zk.new_code(title)
    return result

# run the application
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
