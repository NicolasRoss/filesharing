
from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from flaskext.mysql import MySQL


app = Flask(__name__)
api = Api(app)

mysql = MySQL()

#setup for mysql database local testing
app.config['MYSQL_DATABASE_USER'] = 'docs'
app.config['MYSQL_DATABASE_PASSWORD'] = 'docs'
app.config['MYSQL_DATABASE_DB'] = 'docs'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

conn = mysql.connect()

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://docs:docs@localhost/docs'
# db = SQLAlchemy(app)

parser = reqparse.RequestParser()
parser.add_argument('key', type=str, help="key is needed to access documents")

class home(Resource):
    def get(self):
        return {"value": "never should've came here, adventurer"}


class Documents(Resource):
    
    def get(self):
        args = parser.parse_args()
        if(args['key'] is not None):
            #run database retreival
            cursor = conn.cursor()
            query = "SELECT * FROM documents WHERE uuid_id = %s"
            documents = cursor.execute(query, [args['key']])
            

            return {"value": cursor.fetchall()}
        else:
            return "no key offered", 400


api.add_resource(home, '/')
api.add_resource(Documents, '/documents')

app.run(debug=True)