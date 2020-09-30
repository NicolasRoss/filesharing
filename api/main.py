
from flask import Flask, jsonify
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
        
    def post(self):
        parser.add_argument('user', type=str)
        parser.add_argument('pass', type=str)
        args = parser.parse_args()
        print(args['pass'])
        print(args['user'])
        if(args['user'] is not None and args['pass'] is not None):
            #validate email and pass here
            cursor = conn.cursor()
            query = "INSERT INTO users (email, password) VALUES (%s,SHA(%s))"
            tup = (args['user'], args['pass'])
            print(tup)
            print(query.format(tup))
            d = cursor.execute(query, tup)
            conn.commit()
            cursor.close()
            return {"request": "success"}
        else:
            return "user and pass not submitted", 400




api.add_resource(home, '/')
api.add_resource(Documents, '/documents')
api.add_resource(Users, '/users')

if __name__ == "__main__":
    app.run(debug=True)