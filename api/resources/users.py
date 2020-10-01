from flask_restful import Resource, reqparse
from common import db

parser = reqparse.RequestParser()
conn = db.mysql.connect()

class users(Resource):
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