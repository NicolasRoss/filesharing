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
        parser.add_argument('uuid', type=str)
        parser.add_argument('name', type=str)
        parser.add_argument('path', type=str)
        args = parser.parse_args()

        doc_id = args['uuid']
        file_name = args['name']
        directory = args['path']
        ext = file_ext(file_name)
        location = directory + doc_id + '.' + ext

        if os.path.exists(location):
            return send_from_directory(directory, doc_id + '.' + ext, as_attachment=True)

        else:
            return 'file not found', 404    

    