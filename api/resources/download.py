from flask_restful import Resource, reqparse
from flask import send_from_directory
from common import db
import os


parser = reqparse.RequestParser()

# GET helpers
def file_ext(file_name):
    return file_name.rsplit('.', 1)[1].lower()

class download(Resource):
    def get(self):
        try:
            conn = db.mysql.connect()

            try:
                cursor = conn.cursor()
                parser.add_argument('doc_id', type=str)
                parser.add_argument('name', type=str)
                parser.add_argument('path', type=str)
                args = parser.parse_args()

                doc_id = args['doc_id']
                file_name = args['name']
                directory = args['path']
                ext = file_ext(file_name)
                location = directory + doc_id + '.' + ext

                if os.path.exists(location):
                    return send_from_directory(directory, doc_id + '.' + ext, as_attachment=True)

                else:
                    return 'file not found', 404    

            except Exception as e:
                print(e)

            finally:
                conn.close()

        except Exception as e:
            print(e)

    def delete(self):
        return {"request": "delete"}
    