from flask_restful import Resource, reqparse
from flask import jsonify
from common import db

parser = reqparse.RequestParser()
conn = db.mysql.connect()

class documents(Resource):
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