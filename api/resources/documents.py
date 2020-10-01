from flask_restful import Resource, reqparse
from flask import jsonify
from common import db

parser = reqparse.RequestParser()
conn = db.mysql.connect()

class documents(Resource):
    def get(self):
        parser.add_argument('key', type=str, help="key is needed to access documents")
        parser.add_argument('user', type=str)
        args = parser.parse_args()

        if(args['key'] is not None):
            
            cursor = conn.cursor()
            query = "SELECT doc_id, directory_loc, uuid_id FROM documents WHERE uuid_id = %s"
            documents = cursor.execute(query, args['key'])
            
            if(documents > 0):
                payload = []
                resp = cursor.fetchall()
                for result in resp:
                    content = {"doc_id": result[0], "directory_loc": result[1], "uuid_id": result[2]}
                    payload.append(content)
                return jsonify(payload)
            else:
                return "invalid key", 400
        elif(args['user'] is not None):
            #get all documents owned by user id
            cursor = conn.cursor()
            query = "SELECT doc_uuid FROM user_documents WHERE user_id = %s"
            doc_ids = cursor.execute(query, args['user'])

            if(doc_ids > 0):
                print(doc_ids)
                payload = []
                resp = cursor.fetchall()
                for result in resp:
                    content = {"doc_id": result[0]}
                    payload.append(content)

                return jsonify(payload)
        else:
            return "no user or key submitted", 400

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