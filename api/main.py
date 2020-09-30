from flask import Flask, jsonify, render_template, make_response, request
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from flaskext.mysql import MySQL
import os

app = Flask(__name__)
api = Api(app)

mysql = MySQL()

#setup for mysql database local testing
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'docs'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

conn = mysql.connect()

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://docs:docs@localhost/docs'
# db = SQLAlchemy(app)

parser = reqparse.RequestParser()
# parser.add_argument('key', type=str, help="key is needed to access documents")

class home(Resource):
    def get(self):
        return {"value": "never should've came here, adventurer"}


class Documents(Resource):
    def get(self):
        parser.add_argument('key', type=str, help="key is needed to access documents")
        args = parser.parse_args()

        if(args['key'] is not None):
            
            cursor = conn.cursor()
            query = "SELECT * FROM documents WHERE uuid_id = %s"
            documents = cursor.execute(query, [args['key']])
            
            if(documents > 0):
                
                return jsonify(cursor.fetchall())
            else:
                return "invalid key", 400
        else:
            return "no key submitted", 400

    def post(self):
        parser.add_argument('text', type=str)
        args = parser.parse_args()

        if(args['text'] is not None):
            cursor = conn.cursor()
            query = "INSERT INTO documents (text) VALUES (%s)"
            
            d = cursor.execute(query, [args['text']])
            print(args['text'])
            print(d)
            conn.commit()
            cursor.close()
            
            return {"request": "success"}
        else:
            return "no text submitted", 400


    '''
    TODO: add a put message if we go that way
    '''

class Users(Resource):
    def get(self):
        parser.add_argument('user_id', type=int)
        args = parser.parse_args()

        if(args['user_id'] is not None):
            
            return {"request": "success"}
        else:
            return "no user_id submitted", 400


app.config["UPLOADS"] = "static/server"

class upload(Resource):
    def get(self):
        return make_response(render_template('upload_page.html'))

    # add files to server
    def post(self):
        file_to_upload = request.files["file"]

        #add text based files
        if file_to_upload.content_type.startswith("text/"):
            file_to_upload.save(os.path.join(app.config["UPLOADS"], 'text/' + file_to_upload.filename))

            return {
                    'data': file_to_upload.filename,
                    'message': 'file uploaded'
                   }
        else:

            return 'invalid file type', 400

api.add_resource(home, '/')
api.add_resource(Documents, '/documents')
api.add_resource(upload, '/upload')

if __name__ == "__main__":
    app.run(debug=True)